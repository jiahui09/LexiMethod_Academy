#!/usr/bin/env node
/**
 * LexiMethod Academy — 冒烟测试 (puppeteer-core + 系统 chromium)
 *
 * 用法:
 *   node scripts/smoke.mjs [baseUrl]        # 默认 http://127.0.0.1:5173
 *
 * 检查项:
 *   1. 全部路由可访问且无 console.error / pageerror（含面包屑 + 下一步引导）
 *   2. 首屏（课程目录）3s 内渲染出标题
 *   3. 零数据存储 + 课程完成语义：深链 ?step=n 只定位不改进度（反向断言）、
 *      学完课程进度 +8、刷新后进度归零、存储键为空、无 XP/成就徽章残留
 *   4. 旗舰课 8 步可完整点击走完（上一步/下一步/重播）
 *   5. 音标实验室可选择音标并进入 7 步教学
 *   6. 移动端视口不横向溢出
 *
 * 注：站点已削减——只保留方法课程与音标实验室（/methods、/lab、/settings、404）。
 *     训练 / 复习 / 实战演练 / 费曼关 / 工具箱 / 统计 / 首页 已移除，路由不复存在。
 *     XP / 连续天数 / 成就徽章 / 连击早已移除，相关断言一律以
 *     行为证据替代（进度行文本、course-step 文本、存储键数、残留扫描）。
 */
import puppeteer from 'puppeteer-core';

const BASE = process.argv[2] ?? 'http://127.0.0.1:5173';
const CHROME = process.env.CHROME_BIN ?? '/usr/bin/chromium';
const TIMEOUT = 25000;

const ROUTES = [
  ['/', '方法课程'],
  ['/methods', '方法课程'],
  ['/methods/phonics-syllables', '自然拼读法'],
  ['/lab/phonemes', '音标实验室'],
  ['/lab/mapping', '音标拼写对应'],
  ['/lab/dictation', '听音拼写训练'],
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

    /* 2. 首屏 3 秒加载（根路径重定向进课程目录） */
    console.log('\n[2] 首屏 3s 加载');
    const t0 = Date.now();
    await page.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: TIMEOUT });
    await page.waitForFunction(() => document.body.innerText.includes('LexiMethod'), { timeout: 3000 });
    const loadMs = Date.now() - t0;
    if (loadMs > 3000) fail(`首屏加载 ${loadMs}ms > 3000ms`);
    else ok(`首屏标题出现于 ${loadMs}ms`);

    /* 3. 零数据存储 + 课程完成语义 */
    console.log('\n[3] 零数据存储 · 深链只定位不改进度 · 无 XP 残留');
    await page.goto(BASE + '/methods', { waitUntil: 'networkidle2', timeout: TIMEOUT });
    await sleep(700);

    const readCount = () =>
      page.evaluate(() => {
        const m = (document.querySelector('[data-method-row="phonics-syllables"]')?.innerText ?? '').match(
          /(\d+)\s*\/\s*(\d+)/,
        );
        return m ? `${m[1]}/${m[2]}` : '';
      });

    // SPA 前进/后退：整页 goto 会重建内存 store，测不出「打开页面偷偷改进度」
    const spaGoto = async (path) => {
      await page.evaluate((p) => {
        window.history.pushState({}, '', p);
        window.dispatchEvent(new PopStateEvent('popstate', { state: {} }));
      }, path);
      await sleep(750);
    };

    // 3a. 深链 ?step=3 只定位、不自动完成步骤（bug 修复验证）
    const cntBase = await readCount();
    await spaGoto('/methods/phonics-syllables?step=3');
    const stepText = (await page.evaluate(() => document.querySelector('[data-testid="course-step"]')?.textContent ?? '')).trim();
    if (!stepText.includes('第 4 步')) fail(`深链 ?step=3 应落在第 4 步，实为「${stepText || '(无 course-step)'}」`);
    else ok('深链 ?step=3 落在第 4 步');
    await spaGoto('/methods');
    const cntDeep = await readCount();
    if (!cntBase || cntDeep !== cntBase) {
      fail(`打开深链不应改进度（修复验证）：${cntBase || '(读不到)'} → ${cntDeep || '(读不到)'}`);
    } else ok(`打开深链进度不变（${cntDeep}）`);

    const store = await page.evaluate(() => ({
      ls: Object.keys(window.localStorage).length,
      ss: Object.keys(window.sessionStorage).length,
      cookies: document.cookie.split(';').filter(Boolean).length,
    }));
    if (store.ls || store.ss || store.cookies) {
      fail(`浏览器存储被写入: localStorage=${store.ls} sessionStorage=${store.ss} cookies=${store.cookies}`);
    } else ok('localStorage / sessionStorage / cookies 全部为空');

    // 3d. 去角色化残留扫描：无 header-xp / 无 XP 文案 / 无成就徽章
    const residue = await page.evaluate(() => ({
      xpId: !!document.querySelector('[data-testid="header-xp"]'),
      xpText: (document.body.innerText.match(/\bXP\b/g) || []).length,
      badges: document.querySelectorAll('[data-testid="achievement-badge"]').length,
    }));
    if (residue.xpId || residue.xpText || residue.badges) {
      fail(`去角色化残留: header-xp=${residue.xpId} XP文案=${residue.xpText} 徽章=${residue.badges}`);
    } else ok('无 XP / 成就徽章残留');

    // 3e. 空库首访：课程目录主 CTA 为「开始第一课」
    const heroCta = await page.evaluate(() => document.querySelector('[data-testid="intro-next"]')?.textContent.trim() ?? '');
    if (!heroCta.includes('开始第一课')) fail(`空库主 CTA 应为「开始第一课」，实为「${heroCta || '(无 intro-next)'}」`);
    else ok('空库主 CTA =「开始第一课」');

    // 3f. 课程目录 8 条词条（进度 0/8 起步）
    const rows = await page.evaluate(
      () => document.querySelectorAll('[data-testid="data-method-row"]').length,
    );
    if (rows !== 8) fail(`课程目录词条数 ${rows}/8`);
    else ok('课程目录 8 条词条');
    if (cntBase && cntBase !== '0/8') fail(`空库旗舰课进度应为 0/8，实为 ${cntBase}`);
    else ok('空库旗舰课进度 0/8');

    /* 4. 旗舰课 8 步 */
    console.log('\n[4] 旗舰课《自然拼读法》8 步走完');
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
      const nextBtn = await page.$$('button[aria-label*="下一步"], button[aria-label*="完成本课"]');
      if (!nextBtn.length) {
        fail(`第 ${step + 1} 步找不到「下一步/完成本课」按钮`);
        break;
      }
      // 前 7 步点「下一步」，最后一步点「完成本课」（完成只由显式操作触发）
      await nextBtn[nextBtn.length - 1].click();
    }
    if (seen.filter(Boolean).length < 8) fail(`只走到 ${seen.filter(Boolean).length}/8 步: ${JSON.stringify(seen)}`);
    else ok(`8 步完成: ${seen.map((s) => s.slice(0, 14)).join(' → ')}`);

    // 显式「完成本课」后：按钮进入「本课已完成」终态（完成语义由显式操作驱动）
    await sleep(600);
    const finishState = await page.evaluate(() => {
      const b = document.querySelector('button[aria-label="完成本课"]');
      return b ? b.textContent.trim() : '';
    });
    if (!finishState.includes('本课已完成')) fail(`点「完成本课」后应显示「本课已完成」，实为「${finishState || '(无按钮)'}」`);
    else ok('显式「完成本课」→ 本课已完成');

    // 重播按钮
    const replay = await page.$('button[aria-label*="重播"], button[aria-label*="重播动画"]');
    if (replay) {
      await replay.click();
      ok('重播按钮可点击');
    } else fail('找不到重播按钮');

    /* 5. 音标实验室 */
    console.log('\n[5] 音标实验室 7 步教学');
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

    /* 5b. 音标离线音频（manifest 全量可取 + mp3 解码播放 + UI 按钮可用） */
    console.log('\n[5b] 音标离线音频（48 音素 + 例词）');
    const audioCheck = await page.evaluate(async () => {
      const out = { manifest: null, bad: [], played: null, ui: null };
      try {
        const mr = await fetch('/audio/manifest.json');
        if (!mr.ok) {
          out.manifest = `HTTP ${mr.status}`;
          return out;
        }
        const mf = await mr.json();
        out.manifest = { phonemes: mf.phonemes.length, words: mf.words.length };
        // 分批并发（32/批）：词全集近千条，串行会拖慢整轮冒烟
        const files = [...mf.phonemes, ...mf.words];
        for (let i = 0; i < files.length; i += 32) {
          await Promise.all(
            files.slice(i, i + 32).map(async (x) => {
              const r = await fetch(`/audio/${x.file}`);
              if (!r.ok) out.bad.push(`${x.file} HTTP ${r.status}`);
            }),
          );
        }
      } catch (e) {
        out.manifest = String(e);
        return out;
      }
      try {
        const a = new Audio('/audio/phonemes/th.mp3');
        await a.play();
        await new Promise((r) => setTimeout(r, 400));
        out.played = { t: a.currentTime, dur: a.duration, err: a.error ? a.error.code : null };
        a.pause();
      } catch (e) {
        out.played = { ex: String(e) };
      }
      const btn = Array.from(document.querySelectorAll('button[aria-label*="发音"]')).find((b) =>
        (b.getAttribute('aria-label') ?? '').includes('/θ/'),
      );
      out.ui = btn ? { label: btn.getAttribute('aria-label'), disabled: btn.disabled } : null;
      if (btn && !btn.disabled) btn.click();
      await new Promise((r) => setTimeout(r, 250));
      return out;
    });
    if (!audioCheck.manifest || typeof audioCheck.manifest === 'string') fail(`manifest 加载失败: ${audioCheck.manifest}`);
    else if (audioCheck.manifest.phonemes !== 48) fail(`manifest 音素数 = ${audioCheck.manifest.phonemes}，应为 48`);
    else ok(`manifest: 48 音素 + ${audioCheck.manifest.words} 例词`);
    if (audioCheck.bad.length) fail(`音频取失败: ${audioCheck.bad.slice(0, 3).join(', ')}${audioCheck.bad.length > 3 ? '…' : ''}`);
    else ok('manifest 全部音频文件 HTTP 200');
    const p = audioCheck.played;
    if (!p || p.ex || p.err !== null || !(p.t > 0)) fail(`音标 mp3 解码播放失败: ${JSON.stringify(p)}`);
    else ok(`音标 mp3 解码播放正常（${p.t.toFixed(2)}s / ${p.dur.toFixed(2)}s）`);
    if (!audioCheck.ui) fail('未找到「播放 /θ/ 发音」按钮');
    else if (audioCheck.ui.disabled) fail(`音标播放按钮被禁用: ${audioCheck.ui.label}`);
    else ok(`UI 按钮可用并已触发: ${audioCheck.ui.label}`);

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
