/**
 * 冒烟测试 —— 压膜活页手册（Acetate Manual）新流程
 *
 * 断言面（每轮集成后必跑）：
 *   [1] 路由遍历：无控制台/网络错误，有导航地标（书口/路径）与「下一步」引导条
 *   [2] 首屏 3s
 *   [3] 本机存储边界（localStorage 仅 leximethod.* 进度键，ss/cookie 全空）· 去角色化无残留 · 空库 CTA=「开始第一课」
 *       · 目录 8 词条 · 深链 ?step= 只定位不自动完成
 *   [4] 旗舰课步进流：默认落诊断（一题一屏）→ 交互一次无错 → 深链单元页
 *       → step-next 前进改变 ?step= → 出门条可进
 *   [5] 实验室：三 tab 可进，发音按钮可用
 *   [6] 移动端 375px 多路由无横向溢出
 *
 * 用法：npm run dev（5173）后 node scripts/smoke.mjs
 */
import puppeteer from 'puppeteer-core';

const BASE = process.env.SMOKE_BASE ?? 'http://127.0.0.1:5173';
const CHROME = process.env.CHROME_BIN ?? '/usr/bin/chromium';
const TIMEOUT = Number(process.env.SMOKE_TIMEOUT ?? 20000);

/** 路由与预期正文（任一命中即过） */
const ROUTES = [
  ['/', ['LexiMethod']],
  ['/methods', ['课程总目']],
  ['/methods/phonics-syllables', ['自然拼读法']],
  ['/lab/phonemes', ['音标实验室']],
  ['/lab/mapping', ['音标拼写对应']],
  ['/lab/dictation', ['听音拼写训练']],
  ['/settings', ['设置']],
  ['/definitely-not-a-route', ['没有这一页', '404', '找不到']],
];

let failures = 0;
const fail = (msg) => {
  failures++;
  console.error(`  ✗ ${msg}`);
};
const ok = (msg) => console.log(`  ✓ ${msg}`);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  console.log(`→ 冒烟测试 ${BASE}`);
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--mute-audio', '--autoplay-policy=no-user-gesture-required'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  /** @type {string[]} */
  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(`[console] ${msg.text()}`);
  });
  page.on('pageerror', (err) => consoleErrors.push(`[pageerror] ${err.message}`));
  page.on('requestfailed', (req) => {
    const u = req.url();
    if (!u.includes('favicon')) consoleErrors.push(`[requestfailed] ${u} — ${req.failure()?.errorText}`);
  });

  const spaGoto = async (path) => {
    await page.evaluate((p) => {
      window.history.pushState({}, '', p);
      window.dispatchEvent(new PopStateEvent('popstate', { state: {} }));
    }, path);
    await sleep(700);
  };

  try {
    /* 1. 路由遍历 */
    console.log('\n[1] 路由遍历 + 无控制台错误');
    for (const [route, expects] of ROUTES) {
      consoleErrors.length = 0;
      await page.goto(BASE + route, { waitUntil: 'networkidle2', timeout: TIMEOUT });
      await sleep(700);
      const text = await page.evaluate(() => document.body.innerText);
      if (!expects.some((t) => text.includes(t))) {
        fail(`${route} 未出现预期正文（${expects.join(' / ')}）`);
      }
      // 方向感：导航地标（书口或路径行）+ 底部「下一步去哪儿」引导条
      const guide = await page.evaluate(() => ({
        navs: document.querySelectorAll('nav[aria-label], aside[aria-label]').length,
        next: !!document.querySelector('[data-testid="next-step-bar"]'),
      }));
      if (guide.navs < 1) fail(`${route} 缺少带 aria-label 的导航地标`);
      if (!guide.next) fail(`${route} 缺少「下一步」引导条`);
      if (consoleErrors.length) fail(`${route} 出现错误: ${consoleErrors.slice(0, 3).join(' | ')}`);
      else ok(`${route} 正文✓ 导航地标${guide.navs} 引导条✓ 无错误`);
    }

    /* 2. 首屏 3 秒 */
    console.log('\n[2] 首屏 3s 加载');
    const t0 = Date.now();
    await page.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: TIMEOUT });
    await page.waitForFunction(() => document.body.innerText.includes('LexiMethod'), { timeout: 3000 });
    const loadMs = Date.now() - t0;
    if (loadMs > 3000) fail(`首屏 ${loadMs}ms > 3000ms`);
    else ok(`首屏品牌字样出现于 ${loadMs}ms`);

    /* 3. 本机存储边界（P0-2 后：仅允许 leximethod.* 进度键）+ 去角色化 + 空库语义 */
    console.log('\n[3] 本机存储边界 · 空库 CTA · 目录 8 词条 · 深链只定位');
    await page.goto(BASE + '/methods', { waitUntil: 'networkidle2', timeout: TIMEOUT });
    await sleep(700);

    const store = await page.evaluate(() => {
      const keys = Object.keys(window.localStorage);
      return {
        foreign: keys.filter((k) => !k.startsWith('leximethod.')),
        ss: Object.keys(window.sessionStorage).length,
        cookies: document.cookie.split(';').filter(Boolean).length,
      };
    });
    if (store.foreign.length || store.ss || store.cookies) {
      fail(`浏览器存储越界: 非 leximethod 键=[${store.foreign.join(',')}] ss=${store.ss} cookies=${store.cookies}`);
    } else ok('localStorage 仅 leximethod.* 进度键，sessionStorage / cookies 全空');

    const residue = await page.evaluate(() => ({
      xpId: !!document.querySelector('[data-testid="header-xp"]'),
      xpText: (document.body.innerText.match(/\bXP\b/g) || []).length,
      badges: document.querySelectorAll('[data-testid="achievement-badge"]').length,
    }));
    if (residue.xpId || residue.xpText || residue.badges) {
      fail(`去角色化残留: header-xp=${residue.xpId} XP文案=${residue.xpText} 徽章=${residue.badges}`);
    } else ok('无 XP / 成就徽章残留');

    const heroCta = await page.evaluate(() => document.querySelector('[data-testid="intro-next"]')?.textContent.trim() ?? '');
    if (!heroCta.includes('开始第一课')) fail(`空库主 CTA 应含「开始第一课」，实为「${heroCta || '(无 intro-next)'}」`);
    else ok('空库主 CTA =「开始第一课」');

    const rows = await page.evaluate(() => document.querySelectorAll('[data-testid="data-method-row"]').length);
    if (rows !== 8) fail(`课程目录词条数 ${rows}/8`);
    else ok('课程目录 8 条词条');

    // 深链 ?step=7（出门条）直接开：不得跳过诊断/单元（页面存在但未产生任何完成态）
    await spaGoto('/methods/phonics-syllables?step=7');
    const exitState = await page.evaluate(() => ({
      summary: !!document.querySelector('[data-testid="course-runner-summary"]'),
      score: !!document.querySelector('[data-testid="band-score"]'),
    }));
    if (exitState.summary || exitState.score) fail('深链 ?step=7 不应直接出现完成态（summary/score）');
    else ok('深链 ?step=7 只定位，无自动完成');

    const store2 = await page.evaluate(() => ({
      foreign: Object.keys(window.localStorage).filter((k) => !k.startsWith('leximethod.')),
      ss: Object.keys(window.sessionStorage).length,
    }));
    if (store2.foreign.length || store2.ss) fail(`深链后出现越界存储: ${JSON.stringify(store2)}`);
    else ok('深链后依旧只允许 leximethod.* 进度键');

    /* 4. 旗舰课步进流（诊断一题一屏 → 单元 → 出门条） */
    console.log('\n[4] 旗舰课：诊断渲染 → 一次交互 → 单元深链 → step-next → 出门条');
    await page.goto(BASE + '/methods/phonetic-spelling', { waitUntil: 'networkidle2', timeout: TIMEOUT });
    await sleep(800);

    const diag = await page.evaluate(() => {
      const runner = document.querySelector('[data-testid="course-question-runner"]');
      const t = runner?.innerText ?? '';
      return { has: !!runner, counter: /(\d{2})\s*\/\s*(\d{2})/.exec(t)?.[0] ?? '' };
    });
    if (!diag.has) fail('默认路由未渲染课程题跑器（诊断）');
    else if (!diag.counter) fail('诊断首题缺机器计数（01 / NN）');
    else ok(`诊断渲染 ✓ 计数 ${diag.counter}`);

    // 交互一次：点跑器内第一个可点按钮，不得抛错
    consoleErrors.length = 0;
    const clicked = await page.evaluate(() => {
      const runner = document.querySelector('[data-testid="course-question-runner"]');
      const btn = runner?.querySelector('button:not([disabled])');
      if (!btn) return false;
      btn.click();
      return true;
    });
    await sleep(600);
    if (!clicked) fail('诊断题内找不到可交互按钮');
    else if (consoleErrors.length) fail(`诊断交互抛错: ${consoleErrors.slice(0, 2).join(' | ')}`);
    else ok('诊断交互一次，无控制台错误');

    // 单元深链
    await spaGoto('/methods/phonetic-spelling?step=1');
    const unit = await page.evaluate(() => ({
      claim: !!document.querySelector('h2'),
      check: !!document.querySelector('[data-testid="unit-check"]'),
      h1: (document.querySelector('h1')?.textContent ?? '').trim(),
    }));
    if (!unit.claim || !unit.check) fail(`?step=1 单元页缺 h2 主张或 unit-check（${JSON.stringify(unit)}）`);
    else ok(`U1 单元页渲染 ✓（${unit.h1.slice(0, 18)}）`);

    // step-next 前进改变 ?step=
    const advanced = await page.evaluate(() => {
      const b = document.querySelector('[data-testid="step-next"]');
      if (!b) return 'no-button';
      b.click();
      return 'clicked';
    });
    await sleep(600);
    const url = page.url();
    if (advanced !== 'clicked') fail('单元页缺 step-next 按钮');
    else if (!url.includes('step=2')) fail(`step-next 后 URL 应含 step=2，实为 ${url}`);
    else ok('step-next 前进 → ?step=2');

    // 出门条可进（渲染 intro 区即可，不强制答题）
    await spaGoto('/methods/phonetic-spelling?step=7');
    const exit = await page.evaluate(() => ({
      text: document.body.innerText.includes('出门条'),
      toCatalog: !!document.querySelector('[data-testid="exit-to-catalog"]'),
    }));
    if (!exit.text) fail('?step=7 未出现「出门条」正文');
    else ok('出门条页可进 ✓');

    // 全程存储边界：只允许 leximethod.* 进度键
    const store3 = await page.evaluate(() => {
      const keys = Object.keys(window.localStorage);
      return {
        foreign: keys.filter((k) => !k.startsWith('leximethod.')),
        ss: Object.keys(window.sessionStorage).length,
        cookies: document.cookie.split(';').filter(Boolean).length,
      };
    });
    if (store3.foreign.length || store3.ss || store3.cookies) fail(`流程结束存储越界: ${JSON.stringify(store3)}`);
    else ok('步进流程全程只有 leximethod.* 键，无 cookie / sessionStorage');

    /* 5. 实验室 */
    console.log('\n[5] 实验室：tab 可进 + 发音按钮可用');
    for (const [tab, label] of [
      ['phonemes', '音标实验室'],
      ['mapping', '音标拼写对应'],
      ['dictation', '听音拼写训练'],
    ]) {
      consoleErrors.length = 0;
      await page.goto(`${BASE}/lab/${tab}`, { waitUntil: 'networkidle2', timeout: TIMEOUT });
      await sleep(700);
      const text = await page.evaluate(() => document.body.innerText);
      if (!text.includes(label)) fail(`/lab/${tab} 未出现「${label}」`);
      if (consoleErrors.length) fail(`/lab/${tab} 控制台错误: ${consoleErrors.slice(0, 2).join(' | ')}`);
      else ok(`/lab/${tab} ✓`);
    }
    await page.goto(BASE + '/lab/phonemes', { waitUntil: 'networkidle2', timeout: TIMEOUT });
    await sleep(700);
    const audio = await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find((b) => /播放/.test(b.getAttribute('aria-label') ?? b.title ?? ''));
      return btn ? { label: btn.getAttribute('aria-label') ?? btn.title, disabled: btn.disabled } : null;
    });
    if (!audio) fail('音标实验室找不到发音按钮（aria-label 含「播放」）');
    else if (audio.disabled) fail(`发音按钮被禁用: ${audio.label}`);
    else ok(`发音按钮可用: ${audio.label}`);

    /* 6. 移动端多路由无横向溢出 */
    console.log('\n[6] 移动端 375px 无横向滚动（多路由）');
    await page.setViewport({ width: 375, height: 780, isMobile: true });
    for (const route of ['/', '/methods', '/methods/phonetic-spelling?step=1', '/lab/phonemes', '/settings']) {
      await page.goto(BASE + route, { waitUntil: 'networkidle2', timeout: TIMEOUT });
      await sleep(700);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      if (overflow > 4) fail(`${route} 移动端横向溢出 ${overflow}px`);
      else ok(`${route} 无横向溢出`);
    }
  } catch (err) {
    fail(`异常: ${err.message}`);
  } finally {
    await browser.close();
  }

  console.log(`\n结果: ${failures === 0 ? '全部通过 ✅' : `${failures} 项失败 ❌`}`);
  process.exit(failures === 0 ? 0 : 1);
}

main();
