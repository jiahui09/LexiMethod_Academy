#!/usr/bin/env node
/**
 * LexiMethod Academy — 冒烟测试 (puppeteer-core + 系统 chromium)
 *
 * 用法:
 *   node scripts/smoke.mjs [baseUrl]        # 默认 http://127.0.0.1:5173
 *
 * 检查项:
 *   1. 全部路由可访问且无 console.error / pageerror（含面包屑 + 下一步引导）
 *   2. 首页 3s 内渲染出标题
 *   3. 旗舰课 8 步可完整点击走完（上一步/下一步/重播）
 *   4. 音标实验室可选择音标并进入 7 步教学
 *   5. 零数据存储：浏览器存储为空，刷新后进度归零（进度由首页手动调节）
 */
import puppeteer from 'puppeteer-core';

const BASE = process.argv[2] ?? 'http://127.0.0.1:5173';
const CHROME = process.env.CHROME_BIN ?? '/usr/bin/chromium';
const TIMEOUT = 25000;

const ROUTES = [
  ['/', '学习地图'],
  ['/methods', '方法课程'],
  ['/methods/phonics-syllables', '自然拼读法'],
  ['/lab/phonemes', '音标实验室'],
  ['/lab/mapping', '音标拼写对应'],
  ['/lab/dictation', '听音拼写训练'],
  ['/practice', '互动训练'],
  ['/analyze', '实战演练'],
  ['/feynman', '费曼关'],
  ['/toolbox', '方法工具箱'],
  ['/review', '复习中心'],
  ['/stats', '统计'],
  ['/settings', '设置'],
  ['/definitely-not-a-route', '404'],
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

  try {
    /* 1. 路由遍历 */
    console.log('\n[1] 路由遍历 + 无控制台错误');
    for (const [route, expect] of ROUTES) {
      consoleErrors.length = 0;
      await page.goto(BASE + route, { waitUntil: 'networkidle2', timeout: TIMEOUT });
      await sleep(700);
      const text = await page.evaluate(() => document.body.innerText);
      if (!text.includes(expect)) fail(`${route} 未出现预期文本「${expect}」`);
      // 方向感：每页必须有面包屑（我在哪）与底部「下一步去哪儿」引导
      const guide = await page.evaluate(() => ({
        crumbs: document.querySelectorAll('nav[aria-label="面包屑"] span').length,
        next: !!document.querySelector('[data-testid="next-step-bar"]'),
      }));
      if (guide.crumbs < 1) fail(`${route} 缺少面包屑`);
      if (!guide.next) fail(`${route} 缺少「下一步」引导条`);
      const errs = [...consoleErrors];
      if (errs.length) fail(`${route} 出现错误: ${errs.slice(0, 3).join(' | ')}`);
      else ok(`${route} 无错误（面包屑 ${guide.crumbs} 段 · 引导条 ✓）`);
    }

    /* 2. 首页 3 秒加载 */
    console.log('\n[2] 首页 3s 加载');
    const t0 = Date.now();
    await page.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: TIMEOUT });
    await page.waitForFunction(() => document.body.innerText.includes('LexiMethod'), { timeout: 3000 });
    const loadMs = Date.now() - t0;
    if (loadMs > 3000) fail(`首页加载 ${loadMs}ms > 3000ms`);
    else ok(`首页标题出现于 ${loadMs}ms`);

    /* 3. 旗舰课 8 步 */
    console.log('\n[3] 旗舰课《自然拼读法》8 步走完');
    await page.goto(BASE + '/methods/phonics-syllables', { waitUntil: 'networkidle2', timeout: TIMEOUT });
    await sleep(800);
    const titles = await page.evaluate(() =>
      Array.from(document.querySelectorAll('h2')).map((h) => h.textContent ?? ''),
    );
    const seen = [];
    for (let step = 0; step < 8; step++) {
      await sleep(500);
      const cur = await page.evaluate(() => {
        const h = Array.from(document.querySelectorAll('h2')).find((x) => (x.textContent ?? '').trim().length > 0);
        return h ? h.textContent.trim() : '';
      });
      seen.push(cur);
      const nextBtn = await page.$$('button[aria-label*="下一步"], button[aria-label*="next"]');
      if (!nextBtn.length) {
        fail(`第 ${step + 1} 步找不到「下一步」按钮`);
        break;
      }
      // 最后一步不点
      if (step < 7) await nextBtn[nextBtn.length - 1].click();
    }
    if (seen.filter(Boolean).length < 8) fail(`只走到 ${seen.filter(Boolean).length}/8 步: ${JSON.stringify(seen)}`);
    else ok(`8 步完成: ${seen.map((s) => s.slice(0, 14)).join(' → ')}`);

    // 重播按钮
    const replay = await page.$('button[aria-label*="重播"], button[aria-label*="重播动画"]');
    if (replay) {
      await replay.click();
      ok('重播按钮可点击');
    } else fail('找不到重播按钮');

    /* 4. 音标实验室 */
    console.log('\n[4] 音标实验室 7 步教学');
    await page.goto(BASE + '/lab/phonemes', { waitUntil: 'networkidle2', timeout: TIMEOUT });
    await sleep(900);
    const chipCount = await page.evaluate(
      () => document.querySelectorAll('button[aria-label^="选择音标"]').length,
    );
    if (chipCount !== 48) fail(`音标图表数量 = ${chipCount}，应为 48`);
    else ok('48 个音标全部渲染');

    // 选一个音标（/θ/ 或第一个）
    const clicked = await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button[aria-label^="选择音标"]')).find((b) =>
        (b.getAttribute('aria-label') ?? '').includes('θ'),
      );
      (btn ?? document.querySelector('button[aria-label^="选择音标"]'))?.click();
      return Boolean(btn);
    });
    ok(clicked ? '选中 /θ/' : '选中第一个音标');
    await sleep(700);

    // 走 7 步
    for (let i = 0; i < 6; i++) {
      const next = await page.$$('button[aria-label*="下一步"], button[aria-label*="next"]');
      if (!next.length) break;
      await next[next.length - 1].click();
      await sleep(400);
    }
    const stageText = await page.evaluate(() => document.body.innerText);
    if (!stageText.includes('互动判断')) fail('音标 7 步未到达「互动判断」');
    else ok('音标 7 步走完');

    /* 5. 零数据存储：浏览器存储为空，刷新回到初始 */
    console.log('\n[5] 零数据存储：刷新后回到初始');
    await page.goto(BASE + '/methods/phonics-syllables', { waitUntil: 'networkidle2' });
    await sleep(700);
    const store = await page.evaluate(() => ({
      ls: Object.keys(window.localStorage).length,
      ss: Object.keys(window.sessionStorage).length,
      cookies: document.cookie.split(';').filter(Boolean).length,
    }));
    if (store.ls || store.ss || store.cookies) {
      fail(`浏览器存储被写入: localStorage=${store.ls} sessionStorage=${store.ss} cookies=${store.cookies}`);
    } else ok('localStorage / sessionStorage / cookies 全部为空');

    const readXp = () =>
      page.evaluate(() => {
        const el = document.querySelector('[data-testid="header-xp"]');
        return el ? Number((el.textContent || '').replace(/[^0-9]/g, '')) : -1;
      });
    const xpBefore = await readXp();
    if (xpBefore <= 0) fail(`进入课程应有会话内 XP（进入某步 +10），实为 ${xpBefore}`);
    await page.reload({ waitUntil: 'networkidle2' });
    await sleep(800);
    const xpAfter = await readXp();
    if (xpAfter !== 0) fail(`刷新后 XP 应归零（零存储），实为 ${xpAfter}`);
    else ok(`刷新后归零（刷新前 ${xpBefore} XP → 0 XP）`);

    // 首页必须提供「我的进度」手动调节入口
    const panel = await page.evaluate(() => {
      const p = document.querySelector('[data-testid="progress-panel"]');
      return p ? { rows: p.querySelectorAll('[data-method-row]').length, inc: p.querySelectorAll('[data-step-inc]').length } : null;
    });
    if (!panel || panel.rows !== 8 || panel.inc !== 8) fail(`首页「我的进度」面板行数 ${panel?.rows ?? 0}/8`);
    else ok('首页「我的进度」面板：8 门课均可手动调节数');

    /* 6. 移动端视口不横向溢出 */
    console.log('\n[6] 移动端 375px 无横向滚动');
    await page.setViewport({ width: 375, height: 780, isMobile: true });
    await page.goto(BASE + '/', { waitUntil: 'networkidle2' });
    await sleep(800);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (overflow > 4) fail(`移动端横向溢出 ${overflow}px`);
    else ok('移动端无横向滚动');
  } catch (err) {
    fail(`异常: ${err.message}`);
  } finally {
    await browser.close();
  }

  console.log(`\n结果: ${failures === 0 ? '全部通过 ✅' : `${failures} 项失败 ❌`}`);
  process.exit(failures === 0 ? 0 : 1);
}

main();
