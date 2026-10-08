/* 深度 UI 验收 —— 压膜活页手册（Acetate Manual）
 * [1] 路由零报错 [2] 首屏 [3] 旗舰课端到端（诊断→报告→U1→自检→深链）
 * [4] 实验室 48 音标 [5] 削减路由 404 [6] 听写流程 [10] 设置 [10b] 零存储
 * [11] 目录状态行（内存进度 / 刷新归零） [11b] 去角色化 [14] 方向感（面包屑/底导/深链）
 * [12] 移动端无横向溢出 */
import { build } from 'esbuild';
import { unlink } from 'node:fs/promises';
import puppeteer from 'puppeteer-core';

const BASE = process.env.LEXI_BASE || 'http://127.0.0.1:5173';
const ROUTES = [
  ['/', 'LexiMethod'],
  ['/methods', '手册总目'],
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
const { words, courses } = await import(dataFile.pathname);
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
const bodyHas = (text) => page.evaluate((t) => document.body.innerText.includes(t), text);
const waitBody = async (text, timeout = 3000) => {
  const t0 = Date.now();
  while (Date.now() - t0 < timeout) {
    if (await bodyHas(text)) return true;
    await sleep(200);
  }
  return false;
};
const bottomVerdictExcerpt = (v) => v.slice(0, 24) + (v.length > 24 ? '…' : '');
const clickText = (sel, text) => page.evaluate(({ sel, text }) => {
  const el = [...document.querySelectorAll(sel)].find((e) => e.textContent.includes(text));
  if (el) { el.click(); return true; }
  return false;
}, { sel, text });
/** 目录行状态（行为证据）：已收口 > 进行中 > 未到 */
const readRowStatus = (courseId) => page.evaluate((id) => {
  const t = document.querySelector(`[data-method-row="${id}"]`)?.innerText ?? '';
  return ['已收口', '进行中', '未到'].find((s) => t.includes(s)) ?? '';
}, courseId);

console.log('[1] 路由遍历 + 零控制台错误');
for (const [route, expectText] of ROUTES) {
  await goto(route);
  const body = await page.evaluate(() => document.body.innerText);
  const hasErr = consoleErrors.length > 0;
  check(`路由 ${route}`, !hasErr && body.includes(expectText),
    hasErr ? consoleErrors[0].slice(0, 120) : (body.includes(expectText) ? '' : `缺少「${expectText}」`));
  consoleErrors = [];
}

console.log('[2] 首屏性能（真实硬加载）');
const t0 = Date.now();
await page.goto(BASE + '/', { waitUntil: 'networkidle2', timeout: 20000 });
booted = true;
const loadMs = Date.now() - t0;
check('首屏加载 < 3s', loadMs < 3000, `${loadMs}ms`);
await sleep(700);

console.log('[3] 旗舰课端到端：诊断 → 成绩单 → 进 U1 → 勾自检 → step-next → 出门条');
const flag = courses.find((c) => c.id === 'phonetic-spelling');
// 每题的正确项 label：作答时故意选错，分数确定性归零 → 分数带应落底带
const correctLabels = flag.opening.questions.map((q) => q.choices?.find((c) => c.correct)?.label ?? null);
const bottomBand = flag.opening.bands[flag.opening.bands.length - 1];
await goto('/methods/phonetic-spelling');
const diagStart = await page.evaluate(() => {
  const r = document.querySelector('[data-testid="course-question-runner"]');
  return { has: !!r, counter: /(\d{2})\s*\/\s*(\d{2})/.exec(r?.innerText ?? '')?.[0] ?? '' };
});
check('默认路由落诊断（一题一屏跑器）', diagStart.has, diagStart.has ? `计数 ${diagStart.counter}` : '无跑器');
check('诊断机器计数存在', !!diagStart.counter, diagStart.counter);

let summary = false;
let kinds = [];
for (let i = 0; i < 60; i++) {
  const state = await page.evaluate((correctLabels) => {
    const r = document.querySelector('[data-testid="course-question-runner"]');
    // 终态：跑器内成绩单，或父层已换成带 report 的「进入 U1」（二者互斥的完成证据）
    if (document.querySelector('[data-testid="course-runner-summary"]') || document.querySelector('[data-testid="diag-enter-u1"]')) return 'summary';
    if (!r) return 'no-runner';
    // 揭晓后前进（下一题 / 批改完成）
    const adv = [...r.querySelectorAll('button')].find((b) => /^(下一题|批改完成)/.test(b.textContent.trim()) && !b.disabled);
    if (adv) { adv.click(); return 'advance'; }
    const group = r.querySelector('[role="group"][aria-label="选项"]');
    const btns = group ? [...group.querySelectorAll('button:not([disabled])')] : [];
    if (btns.length) {
      // 故意答错：挑不含正确 label 的选项（数据里 correct 恒唯一）
      const cm = /(\d{2})\s*\/\s*\d{2}/.exec(r.innerText);
      const idx = cm ? Number(cm[1]) - 1 : -1;
      const right = correctLabels[idx];
      const wrong = (right ? btns.find((b) => !b.textContent.includes(right)) : null) ?? btns[btns.length - 1];
      wrong.click();
      return 'choice';
    }
    const input = r.querySelector('input.edu-input, textarea.edu-input');
    if (input) {
      const proto = input.tagName === 'TEXTAREA' ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
      Object.getOwnPropertyDescriptor(proto, 'value').set.call(input, 'practice');
      input.dispatchEvent(new Event('input', { bubbles: true }));
      const submit = [...r.querySelectorAll('button')].find((b) => b.textContent.includes('提交') && !b.disabled);
      if (submit) { submit.click(); return 'typed'; }
      return 'typed-no-submit';
    }
    const self = r.querySelector('[role="group"][aria-label="对照参考后自评"] button:not([disabled])');
    if (self) { self.click(); return 'self'; }
    return 'stuck';
  }, correctLabels);
  if (!kinds.includes(state)) kinds.push(state);
  if (state === 'summary') { summary = true; break; }
  if (state === 'stuck' || state === 'no-runner' || state === 'typed-no-submit') break;
  await sleep(420);
}
check('诊断逐题作答到成绩单', summary, `状态链 ${kinds.join('>')}`);
const scoreText = await page.evaluate(() =>
  (document.querySelector('[data-testid="course-runner-summary"]')?.innerText ??
   document.querySelector('[data-testid="band-score"]')?.innerText ??
   ''));
check('成绩单给出 x / y 分数', /\d+\s*\/\s*\d+/.test(scoreText), scoreText.replace(/\n/g, ' ').slice(0, 40));
// 全部故意答错 → 00 / 10 → 必须落底带（pickBand 谓词回归 + 报告接线双重守卫）
check('故意全错得 0 分', /^00\s*\/\s*10/.test(scoreText.replace(/\n/g, ' ')), scoreText.replace(/\n/g, ' ').slice(0, 20));
const verdictShown = await page.evaluate((v) => document.body.innerText.includes(v), bottomBand.verdict);
check('0 分落底带（报告渲染正确 verdict）', verdictShown, bottomVerdictExcerpt(bottomBand.verdict));
const entered = await clickText('[data-testid="diag-enter-u1"]', '进入 U1');
check('「进入 U1」可点', entered);
await sleep(700);
const u1 = await page.evaluate(() => ({
  check: !!document.querySelector('[data-testid="unit-check"]'),
  step: new URL(window.location.href).searchParams.get('step'),
}));
check('落到 U1（?step=1 + 自检行）', u1.check && u1.step === '1', JSON.stringify(u1));
await page.evaluate(() => document.querySelector('[data-testid="unit-check"]')?.click());
await sleep(500);
const checkState = await page.evaluate(() => {
  const b = document.querySelector('[data-testid="unit-check"]');
  return { checked: b?.getAttribute('aria-checked'), text: b?.innerText ?? '' };
});
check('勾自检 → 已达成', checkState.checked === 'true' && checkState.text.includes('已达成'),
  `aria-checked=${checkState.checked}`);
await page.evaluate(() => document.querySelector('[data-testid="step-next"]')?.click());
await sleep(600);
check('step-next → ?step=2', page.url().includes('step=2'), page.url().split('?')[1] ?? '(无参数)');
await goto('/methods/phonetic-spelling?step=7');
check('出门条（?step=7）可进', await bodyHas('出门条'));
check('[3] 段零报错', consoleErrors.length === 0, consoleErrors[0] || '');
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
    check('听写提交标准答案判对', judged, judged ? `题干「${promptText.slice(0, 20)}」→ ${expected}` : `未出现「回答正确」（题干「${promptText.slice(0, 20)}」→ ${expected}）`);
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
check('设置页展示零存储说明', zeroNote.includes('零存储') && zeroNote.includes('localStorage'),
  zeroNote.slice(0, 46).replace(/\n/g, ' '));
check('零存储段零报错', consoleErrors.length === 0, consoleErrors[0] || '');
consoleErrors = [];

console.log('[11] 目录状态行：会话内存进度 / 刷新归零');
await goto('/methods');
const rows = await page.evaluate(() => document.querySelectorAll('[data-testid="data-method-row"]').length);
check('课程目录 8 条词条', rows === 8, `${rows} 行`);
// [3] 已勾过 U1 自检 → 状态应为「进行中」；整页刷新后内存 store 重建 → 回到「未到」
const stBefore = await readRowStatus('phonetic-spelling');
check('会话内进度可见（进行中）', stBefore === '进行中', stBefore || '读不到状态');
await page.reload({ waitUntil: 'networkidle2' });
await sleep(900);
const stAfter = await readRowStatus('phonetic-spelling');
check('刷新归零（未到）', stAfter === '未到', `${stBefore} → ${stAfter}`);
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

console.log('[14] 方向感引导：面包屑 / 底部导航 / 深链定位');
await page.setViewport({ width: 1280, height: 900 });
await sleep(400);

// 1) 每页：面包屑段数（直接子级 span/a）+ 底部「下一步去哪儿」引导
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
    crumbs: document.querySelectorAll('nav[aria-label="面包屑"] > span, nav[aria-label="面包屑"] > a').length,
    next: !!document.querySelector('[data-testid="next-step-bar"]'),
  }));
  if (g.crumbs < min || !g.next) crumbBad.push(`${route}(${g.crumbs}段,需≥${min},bar=${g.next ? 1 : 0})`);
}
check('每页面包屑段数达标 + 「下一步」引导条', crumbBad.length === 0, crumbBad.join(' ') || '7 条路由全部通过');

// 2) 深链 ?step=3 只定位、不改进度（书眉机器计数 = 04 / 08）
await goto('/methods');
const statusRoot = await readRowStatus('phonics-syllables');
await goto('/methods/phonics-syllables?step=3');
const landed = await page.evaluate(() => document.body.innerText.includes('04 / 08'));
check('课程页落在步 04（?step=3 书眉计数）', landed, landed ? '' : '书眉未见 04 / 08');
await goto('/methods');
const statusAfter = await readRowStatus('phonics-syllables');
check('落地课程页不改进度（深链只定位）', statusAfter === statusRoot, `${statusRoot} → ${statusAfter}`);

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
  const a = document.querySelector('[data-testid="bottom-nav"] a[href="/lab/phonemes"]');
  if (a) { a.click(); return true; }
  return false;
});
await sleep(900);
const afterNav = await page.evaluate(() => window.location.pathname);
check('底部导航可点击跳转', clickedNav && afterNav === '/lab/phonemes', afterNav);
// 实验室三卷都算「实验室」当前项
const bnLab = await page.evaluate(() => {
  const nav = document.querySelector('[data-testid="bottom-nav"]');
  return nav ? [...nav.querySelectorAll('a')].filter((a) => a.getAttribute('aria-current') === 'page').length : -1;
});
check('/lab 卷内底导仍唯一高亮', bnLab === 1, `高亮 ${bnLab} 项`);
await page.setViewport({ width: 1280, height: 900 });
await sleep(500);
check('方向感引导段零报错', consoleErrors.length === 0, consoleErrors[0] || '');
consoleErrors = [];

console.log('[12] 移动端 375px 无横向滚动');
await page.setViewport({ width: 375, height: 780 });
for (const route of ['/', '/methods/phonics-syllables', '/methods/phonetic-spelling?step=1', '/lab/phonemes', '/lab/dictation']) {
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
