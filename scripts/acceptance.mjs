/* 深度 UI 验收：全路由零报错 + 核心流程端到端
 * （站点已削减：只保留方法课程与音标实验室；训练/复习/实战演练/费曼关/工具箱/统计/首页已移除） */
import { build } from 'esbuild';
import { unlink } from 'node:fs/promises';
import puppeteer from 'puppeteer-core';

const BASE = process.env.LEXI_BASE || 'http://127.0.0.1:5173';
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

const results = [];
const check = (name, cond, extra = '') => {
  results.push({ name, ok: !!cond, extra });
  console.log(`  ${cond ? '✓' : '✗'} ${name}${extra ? `（${extra}）` : ''}`);
  return !!cond;
};

/* ---------- 打包数据助手 ---------- */
const dataFile = new URL('./.accData.bundle.mjs', import.meta.url);
await build({
  entryPoints: ['scripts/acceptanceData.entry.ts'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  outfile: dataFile.pathname,
  logLevel: 'silent',
  alias: { '@': './src' },
});
const { words } = await import(dataFile.pathname);
await unlink(dataFile.pathname).catch(() => {});

/* ---------- 浏览器 ---------- */
const browser = await puppeteer.launch({
  executablePath: '/usr/bin/chromium',
  headless: 'new',
  args: ['--no-sandbox', '--mute-audio', '--autoplay-policy=no-user-gesture-required'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900 });

let consoleErrors = [];
let routeErrors = [];
page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
page.on('pageerror', (e) => consoleErrors.push('pageerror: ' + e.message));
page.on('requestfailed', (r) => consoleErrors.push('requestfailed: ' + r.url()));

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * 站点是零存储纯前端 SPA：进度只存在于当前会话内存里。
 * 因此除首次硬加载外，一律用 pushState 前进，跨段断言共享同一次会话的状态。
 */
let booted = false;
const goto = async (path) => {
  routeErrors = [];
  if (!booted) {
    await page.goto(BASE + '/', { waitUntil: 'networkidle2', timeout: 20000 });
    booted = true;
    await sleep(700);
  }
  const cur = await page.evaluate(() => window.location.pathname + window.location.search);
  if (cur !== path) {
    await page.evaluate((p) => {
      window.history.pushState({}, '', p);
      window.dispatchEvent(new PopStateEvent('popstate', { state: {} }));
    }, path);
    await sleep(650);
  }
};
/** 行为证据 oracle（零存储应用没有 XP 计数器可读）：等待 body 出现指定反馈文本 */
const bodyHas = (text) => page.evaluate((t) => document.body.innerText.includes(t), text);
const waitBody = async (text, timeout = 3000) => {
  const t0 = Date.now();
  while (Date.now() - t0 < timeout) {
    if (await bodyHas(text)) return true;
    await sleep(200);
  }
  return false;
};
const clickText = (sel, text) => page.evaluate(({ sel, text }) => {
  const el = [...document.querySelectorAll(sel)].find((e) => e.textContent.includes(text));
  if (el) { el.click(); return true; }
  return false;
}, { sel, text });

console.log('[1] 路由遍历 + 零控制台错误');
for (const [route, expectText] of ROUTES) {
  await goto(route);
  const body = await page.evaluate(() => document.body.innerText);
  const hasErr = consoleErrors.length > 0;
  check(`路由 ${route}`, !hasErr && body.includes(expectText),
    hasErr ? consoleErrors[0].slice(0, 120) : (body.includes(expectText) ? '' : `缺少「${expectText}」`));
  if (hasErr) routeErrors.push(...consoleErrors);
  consoleErrors = [];
}

console.log('[2] 首屏性能（真实硬加载）');
const t0 = Date.now();
await page.goto(BASE + '/', { waitUntil: 'networkidle2', timeout: 20000 });
booted = true;
const loadMs = Date.now() - t0;
check('首屏加载 < 3s', loadMs < 3000, `${loadMs}ms`);
await sleep(700);

console.log('[3] 旗舰课 8 步 + 重播 + 自动播放');
await goto('/methods/phonics-syllables');
const titles = [];
for (let i = 0; i < 8; i++) {
  const h = await page.evaluate(() => {
    const card = [...document.querySelectorAll('main h2')].map((h) => h.textContent.trim());
    return card.find((t) => t && t.length > 3 && !t.includes('LexiMethod')) || '';
  });
  titles.push(h.slice(0, 16));
  const clicked = await clickText('button[aria-label*="下一步"]', '下一步');
  if (!clicked) break;
  await sleep(650);
}
check('8 步全部走过', titles.length === 8, titles.join(' → ').slice(0, 90));
check('第 8 步为掌握标准', (titles[7] || '').includes('掌握'));
check('重播按钮存在', await clickText('button[aria-label*="重播"]', '重播'));
await sleep(400);
const autoplayBtn = await page.evaluate(() => {
  const b = [...document.querySelectorAll('button')].find((x) => /自动播放|暂停播放/.test(x.textContent));
  if (b) b.click();
  return !!b;
});
check('自动播放可切换', autoplayBtn);
await page.evaluate(() => {
  const b = [...document.querySelectorAll('button')].find((x) => /暂停播放/.test(x.textContent));
  if (b) b.click();
});
consoleErrors = [];

console.log('[4] 音标实验室：48 音标 + 7 步 + 标记已学');
await goto('/lab/phonemes');
const phonemeBtns = await page.$$('button[aria-label^="选择音标"]');
check('48 个音标按钮', phonemeBtns.length === 48, `${phonemeBtns.length}`);
const theta = await page.evaluate(() => {
  const b = [...document.querySelectorAll('button[aria-label^="选择音标"]')].find((x) => x.getAttribute('aria-label').includes('θ'));
  if (b) b.click();
  return !!b;
});
check('可选中 /θ/', theta);
await sleep(600);
for (let i = 0; i < 7; i++) {
  await clickText('button[aria-label*="下一步"]', '下一步');
  await sleep(500);
}
const learned = await page.evaluate(() => document.body.innerText.match(/已学音标：\s*(\d+)/)?.[1]);
const learnedDots = await page.evaluate(() => document.querySelectorAll('button[aria-label^="选择音标"] [aria-label="已学"]').length);
check('学完 7 步自动标记 /θ/', Number(learned) >= 1 && learnedDots >= 1, `已学音标 ${learned ?? '?'} · 图表已学标记 ${learnedDots}`);
check('实验室无报错', consoleErrors.length === 0, consoleErrors[0] || '');
consoleErrors = [];

console.log('[5] 站点削减：已移除路由全部落 404');
for (const gone of ['/practice', '/review', '/analyze', '/feynman', '/toolbox', '/stats']) {
  await goto(gone);
  const body = await page.evaluate(() => document.body.innerText);
  check(`已移除路由 ${gone} 落 404`, body.includes('404') && body.includes('这条路没有词'),
    body.includes('404') ? '' : body.slice(0, 80));
}
check('削减段零报错', consoleErrors.length === 0, consoleErrors[0] || '');
consoleErrors = [];

console.log('[6] 听音拼写训练（听写流程）');
await goto('/lab/dictation');
const hasInput = await page.$('input.edu-input');
if (hasInput) {
  // 听写页题目由工厂实时生成，题干里内嵌词或音标：据此反查期望答案并断言判对
  const promptText = await page.evaluate(() => {
    const all = [...document.querySelectorAll('p, h2, h3')].map((e) => e.textContent.trim());
    return all.find((x) => /^听写音标：|^听音拼写：/.test(x)) || '';
  });
  const ipaHit = promptText.match(/^听写音标：(.+)$/);
  const wordHit = promptText.match(/^听音拼写：(.+)$/);
  const expected = ipaHit
    ? words.find((w) => w.word === ipaHit[1])?.phoneticUK
    : wordHit
      ? words.find((w) => w.phoneticUK === wordHit[1])?.word
      : undefined;
  if (expected) {
    await page.click('input.edu-input');
    await page.type('input.edu-input', expected, { delay: 12 });
    await clickText('button', '提交');
    await sleep(700);
    const judged = await waitBody('回答正确', 3000);
    check('听写提交标准答案判对', judged, judged ? `题干「${promptText.slice(0, 20)}」→ ${expected}` : `未出现「回答正确」反馈（题干「${promptText.slice(0, 20)}」→ ${expected}）`);
  } else {
    check('听写题干可反查期望答案', false, promptText.slice(0, 40) || '未取到题干');
  }
} else {
  check('听写输入框存在', false);
}
check('听写页零报错', consoleErrors.length === 0, consoleErrors[0] || '');
consoleErrors = [];

console.log('[10] 设置：口音与动效档位');
await goto('/settings');
const accentOk = await page.evaluate(() => {
  const b = [...document.querySelectorAll('button[aria-pressed]')].find((x) => x.textContent.includes('美式发音'));
  if (b) b.click();
  return !!b;
});
await sleep(400);
const accentState = await page.evaluate(() => {
  const b = [...document.querySelectorAll('button[aria-pressed]')].find((x) => x.textContent.includes('美式发音'));
  return b ? b.getAttribute('aria-pressed') : null;
});
check('切换美式发音生效', accentOk && accentState === 'true', `aria-pressed=${accentState}`);
const lightOk = await page.evaluate(() => {
  const b = [...document.querySelectorAll('button[aria-pressed]')].find((x) => x.textContent.includes('轻量'));
  if (b) b.click();
  return !!b;
});
await sleep(400);
const motionAttr = await page.evaluate(() => document.documentElement.getAttribute('data-motion'));
check('动效档位写入 data-motion', lightOk && motionAttr === 'light', motionAttr);
check('设置页零报错', consoleErrors.length === 0, consoleErrors[0] || '');
consoleErrors = [];

console.log('[10b] 零数据存储：不写浏览器存储、无导出导入');
const storeState = await page.evaluate(() => ({
  ls: Object.keys(window.localStorage).length,
  ss: Object.keys(window.sessionStorage).length,
  cookies: document.cookie.split(';').filter(Boolean).length,
}));
check('localStorage / sessionStorage / cookies 全空', storeState.ls === 0 && storeState.ss === 0 && storeState.cookies === 0,
  JSON.stringify(storeState));
const exportBtn = await clickText('button', '导出备份');
const importInput = await page.$('input[type="file"]');
check('设置页已无「导出备份」入口', !exportBtn);
check('设置页已无导入入口', !importInput);
const zeroNote = await page.evaluate(() => document.querySelector('[data-testid="zero-storage-note"]')?.innerText ?? '');
check('设置页展示「数据与隐私：零存储」说明', zeroNote.includes('零存储') && zeroNote.includes('localStorage'),
  zeroNote.slice(0, 46).replace(/\n/g, ' '));
check('零存储段零报错', consoleErrors.length === 0, consoleErrors[0] || '');
consoleErrors = [];

console.log('[11] 零存储 + 课程目录进度行');
await goto('/methods');
/** 读课程目录第 1 门课的进度行（行为证据，替代已删除的 XP 计数器） */
const readCount = () => page.evaluate(() => {
  const m = (document.querySelector('[data-method-row="phonics-syllables"]')?.innerText ?? '').match(/\d+\s*\/\s*\d+/);
  return m ? m[0].replace(/\s+/g, '') : '';
});
const rowInfo = await page.evaluate(() => ({
  rows: document.querySelectorAll('[data-testid="data-method-row"]').length,
}));
check('课程目录 8 条词条', rowInfo.rows === 8, `${rowInfo.rows} 行`);
// [3] 明确点击过课程下一步 → 会话内进度应 >0；刷新后内存 store 重建 → 归零
const cntBeforeReload = await readCount();
check('会话内已产生进度（进度在内存里）', !!cntBeforeReload && cntBeforeReload !== '0/8', cntBeforeReload || '读不到进度行');
await page.reload({ waitUntil: 'networkidle2' });
await sleep(900);
const cntAfterReload = await readCount();
check('刷新后回到初始状态（进度归零，零存储）', cntAfterReload === '0/8', `${cntBeforeReload} → ${cntAfterReload}`);
consoleErrors = [];

console.log('[11b] 去角色化：XP / 成就徽章残留扫描');
const heroCta = await page.evaluate(() => document.querySelector('[data-testid="intro-next"]')?.textContent.trim() ?? '');
check('空库主 CTA 为「开始第一课」', heroCta.includes('开始第一课'), heroCta.slice(0, 40) || '(无 intro-next)');
const homeResidue = await page.evaluate(() => ({
  xpId: !!document.querySelector('[data-testid="header-xp"]'),
  xpText: (document.body.innerText.match(/\bXP\b/g) || []).length,
  badges: document.querySelectorAll('[data-testid="achievement-badge"]').length,
}));
check('课程目录无 XP / 成就徽章残留',
  !homeResidue.xpId && homeResidue.xpText === 0 && homeResidue.badges === 0, JSON.stringify(homeResidue));
check('去角色化段零报错', consoleErrors.length === 0, consoleErrors[0] || '');
consoleErrors = [];

console.log('[14] 方向感引导：面包屑 / 底部导航');
await page.setViewport({ width: 1280, height: 900 });
await sleep(400);

// 1) 每页：≥1 段面包屑（二级页 ≥2）+ 底部「下一步去哪儿」引导
let crumbBad = [];
const CRUMB_MIN = {
  '/methods': 1,
  '/methods/phonics-syllables': 2,
  '/lab/phonemes': 2,
  '/lab/mapping': 2,
  '/lab/dictation': 2,
  '/settings': 2,
  '/definitely-not-a-route': 2,
};
for (const [route, min] of Object.entries(CRUMB_MIN)) {
  await goto(route);
  const g = await page.evaluate(() => ({
    crumbs: document.querySelectorAll('nav[aria-label="面包屑"] > span').length,
    next: !!document.querySelector('[data-testid="next-step-bar"]'),
    introNext: !!document.querySelector('[data-testid="intro-next"]'),
  }));
  if (g.crumbs < min || !g.next) crumbBad.push(`${route}(${g.crumbs}段,需≥${min},bar=${g.next ? 1 : 0})`);
}
check('每页面包屑段数达标 + 「下一步」引导条', crumbBad.length === 0, crumbBad.join(' ') || '7 条路由全部通过');

// 2) 深链 ?step=3 只定位、不改进度（载入课程页的反向断言）
await goto('/methods');
const cntRoot = await readCount();
await goto('/methods/phonics-syllables?step=3');
const landedStep = await page.evaluate(() => document.querySelector('[data-testid="course-step"]')?.textContent.trim() ?? '');
check('课程页落在第 4 步', landedStep.includes('第 4 步'), landedStep);
await goto('/methods');
const cntAfterLand = await readCount();
check('落地课程页不改进度（深链只定位）', cntAfterLand === cntRoot, `${cntRoot} → ${cntAfterLand}`);

// 3) 移动端底部导航：3 项、当前高亮、可点
await page.setViewport({ width: 375, height: 812 });
await sleep(700);
const bn = await page.evaluate(() => {
  const nav = document.querySelector('[data-testid="bottom-nav"]');
  if (!nav) return null;
  const items = [...nav.querySelectorAll('a')].map((a) => ({
    t: a.innerText.trim().replace(/\s+/g, ''),
    on: a.getAttribute('aria-current') === 'page',
  }));
  return { count: items.length, items, h: nav.getBoundingClientRect().height, w: nav.getBoundingClientRect().width };
});
check('375px 底部导航 3 项可见', Boolean(bn) && bn.count === 3 && bn.h > 40 && bn.w > 300,
  bn ? `${bn.count} 项 · ${Math.round(bn.w)}×${Math.round(bn.h)}` : '无底部导航');
check('底部导航高亮当前页', Boolean(bn) && bn.items.filter((i) => i.on).length === 1,
  bn ? bn.items.map((i) => `${i.t}${i.on ? '·当前' : ''}`).join('/') : '');
const clickedNav = await page.evaluate(() => {
  // 按目的地选择（而非位置）：导航项顺序允许调整，链接必须始终可达
  const a = document.querySelector('[data-testid="bottom-nav"] a[href="/lab/phonemes"]');
  if (a) { a.click(); return true; }
  return false;
});
await sleep(900);
const afterNav = await page.evaluate(() => window.location.pathname);
check('底部导航可点击跳转', clickedNav && afterNav === '/lab/phonemes', afterNav);
await page.setViewport({ width: 1280, height: 900 });
await sleep(500);
check('方向感引导段零报错', consoleErrors.length === 0, consoleErrors[0] || '');
consoleErrors = [];

console.log('[12] 移动端 375px 无横向滚动');
await page.setViewport({ width: 375, height: 780 });
for (const route of ['/', '/methods/phonics-syllables', '/lab/phonemes', '/lab/dictation']) {
  await goto(route);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  check(`移动端 ${route} 无横向溢出`, overflow <= 4, `overflow=${overflow}`);
}

await browser.close();

const failed = results.filter((r) => !r.ok);
console.log(`\n结果：${results.length - failed.length}/${results.length} 通过${failed.length ? ' ❌' : ' ✅'}`);
if (failed.length) {
  for (const f of failed) console.log(`  ✗ ${f.name} ${f.extra}`);
  process.exit(1);
}
