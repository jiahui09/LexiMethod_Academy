/* 深度 UI 验收：全路由零报错 + 11 题型可作答得分 + 核心流程端到端 */
import { build } from 'esbuild';
import { unlink } from 'node:fs/promises';
import puppeteer from 'puppeteer-core';

const BASE = process.env.LEXI_BASE || 'http://127.0.0.1:5173';
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
const { quizBanks, words } = await import(dataFile.pathname);
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
/** XP 只能从界面上读（零存储，localStorage 永远是空的） */
const xp = async () => page.evaluate(() => {
  const el = document.querySelector('[data-testid="header-xp"]');
  return el ? Number((el.textContent || '').replace(/[^0-9]/g, '')) : -1;
});
const waitXpChange = async (from, timeout = 2500) => {
  const t0 = Date.now();
  while (Date.now() - t0 < timeout) {
    if ((await xp()) !== from) return true;
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

console.log('[2] 首页性能与首屏（真实硬加载）');
const t0 = Date.now();
await page.goto(BASE + '/', { waitUntil: 'networkidle2', timeout: 20000 });
booted = true;
const loadMs = Date.now() - t0;
check('首页加载 < 3s', loadMs < 3000, `${loadMs}ms`);
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

console.log('[5] 互动训练：11 种题型逐个作答');
await goto('/practice');
const TYPE_TABS = ['听音选音标', '看词选音标', '音标选拼写', '拼写选音标', '听写音标', '听写单词', '音节划分', '重音定位', '最小对立对', '词缀拼装', '语境选词'];
const solvedTypes = [];
for (const tab of TYPE_TABS) {
  const switched = await page.evaluate((t) => {
    const b = [...document.querySelectorAll('button')].find((x) => x.textContent.trim() === t);
    if (b) b.click();
    return !!b;
  }, tab);
  await sleep(750);
  if (!switched) { check(`页签「${tab}」可切换`, false); continue; }

  const before = await xp();

  const handle = await page.evaluate(() => {
    // 返回整页文本与控件标记。prompt 在同类题内会重复（8 道最小对立对共用一个题干），
    // 单靠 prompt 反查会定位到错误题目，必须优先用每题唯一的 narration 定位。
    const body = document.body.innerText;
    const hasInput = !!document.querySelector('input.input-neon');
    const hasPool = !!document.querySelector('[aria-label="可选拼块"]');
    const stressGroup = !!document.querySelector('[aria-label="选择重音音节"]');
    return { body, hasInput, hasPool, stressGroup };
  });
  /** 判定反馈面板是否给出「回答正确」——比 XP 变化更强的正确性证据（答错也 +1 XP） */
  const answeredCorrectly = () => page.evaluate(() => document.body.innerText.includes('回答正确'));

  const bank = quizBanks[tabToKey(tab)] || [];
  const q =
    bank.find((x) => x.narration && handle.body.includes(x.narration)) ??
    bank.find((x) => handle.body.includes(x.prompt));

  if (q && q.choices) {
    const right = q.choices.find((c) => c.correct);
    const clicked = await page.evaluate((label) => {
      const btns = [...document.querySelectorAll('button')].filter((b) => !b.closest('nav') && !b.closest('[role="tablist"]'));
      const match = (t) => t === label || (t.startsWith(label) && !/[A-Za-z0-9]/.test(t[label.length] ?? ''));
      const el = btns.find((b) => {
        const raw = b.textContent.trim();
        return match(raw) || match(raw.replace(/^[A-D]/, ''));
      });
      if (el) { el.click(); return true; }
      return false;
    }, right.label);
    await sleep(600);
    const changed = await waitXpChange(before);
    const correct = clicked && changed && (await answeredCorrectly());
    if (correct) solvedTypes.push(tab);
    check(`「${tab}」选择正确答案得分`, correct,
      clicked ? (changed ? '' : 'XP 未变化') : `未找到选项（题干：${(q.narration || q.prompt).slice(0, 18)}）`);
  } else if (handle.stressGroup && q) {
    const idx = Number(q.answer);
    await page.evaluate((i) => {
      const g = document.querySelector('[aria-label="选择重音音节"]');
      g.querySelectorAll('button')[i].click();
    }, idx);
    await sleep(600);
    const changed = await waitXpChange(before);
    const correct = changed && (await answeredCorrectly());
    if (correct) solvedTypes.push(tab);
    check(`「${tab}」点选重音得分`, correct, changed ? '' : 'XP 未变化');
  } else if (handle.hasPool && q) {
    const segments = q.answer.split('-');
    let okAll = true;
    for (let i = 0; i < segments.length; i++) {
      const picked = await page.evaluate((seg) => {
        const pool = document.querySelector('[aria-label="可选拼块"]');
        const b = pool && [...pool.querySelectorAll('button')].find((x) => x.textContent.trim() === seg);
        if (!b) return false;
        b.click();
        return true;
      }, segments[i]);
      await sleep(220);
      const placed = await page.evaluate((i) => {
        const s = document.querySelector(`button[aria-label^="第 ${i + 1} 个槽位"]`);
        if (!s) return false;
        s.click();
        return true;
      }, i);
      await sleep(250);
      if (!picked || !placed) { okAll = false; break; }
    }
    await sleep(700);
    const changed = okAll && (await waitXpChange(before));
    const correct = changed && (await answeredCorrectly());
    if (correct) solvedTypes.push(tab);
    check(`「${tab}」按答案拼装判对`, correct, okAll ? (changed ? '' : 'XP 未变化') : '拼块/槽位缺失');
  } else if (handle.hasInput && q) {
    // 听写类：题干相同，靠 narration 定位后输入该题的标准答案
    await page.click('input.input-neon');
    await page.type('input.input-neon', q.answer, { delay: 12 });
    await clickText('button', '提交');
    await sleep(600);
    const changed = await waitXpChange(before);
    const correct = changed && (await answeredCorrectly());
    if (correct) solvedTypes.push(tab);
    check(`「${tab}」提交标准答案判对`, correct, changed ? '' : 'XP 未变化');
  } else {
    check(`「${tab}」题目出现`, false, q ? '无法识别题型控件' : '题干未匹配到题库');
  }
  consoleErrors = [];
}
check('11 种题型全部作答判对', solvedTypes.length === 11, `判对 ${solvedTypes.length}/11`);
check('拖拽/点选类题型（音节/词缀/重音）全部判对',
  ['音节划分', '词缀拼装', '重音定位'].every((t) => solvedTypes.includes(t)),
  solvedTypes.join(','));
check('练习过程零报错', consoleErrors.length === 0, consoleErrors[0] || '');
consoleErrors = [];

console.log('[6] 听音拼写训练（听写流程）');
await goto('/lab/dictation');
const dictBefore = await xp();
const hasInput = await page.$('input.input-neon');
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
    await page.click('input.input-neon');
    await page.type('input.input-neon', expected, { delay: 12 });
    await clickText('button', '提交');
    await sleep(700);
    const judged = await page.evaluate(() => document.body.innerText.includes('回答正确'));
    check('听写提交标准答案判对', judged && (await waitXpChange(dictBefore)), `题干「${promptText.slice(0, 20)}」→ ${expected}`);
  } else {
    check('听写题干可反查期望答案', false, promptText.slice(0, 40) || '未取到题干');
  }
} else {
  check('听写输入框存在', false);
}
check('听写页零报错', consoleErrors.length === 0, consoleErrors[0] || '');
consoleErrors = [];

console.log('[7] 实战演练：六步词分析向导');
await goto('/analyze');
await page.type('input[placeholder*="unpredictable"]', 'construction', { delay: 10 });
await clickText('button', '开始分析');
await sleep(700);
let guard = 0;
while (guard++ < 14) {
  if (await page.evaluate(() => document.body.innerText.includes('完成分析'))) break;
  const done = await page.evaluate(() => {
    const dict = [...document.querySelectorAll('button')].find((b) => /对照内置词典/.test(b.textContent));
    if (dict && !dict.disabled) { dict.click(); return 'reveal'; }
    const option = [...document.querySelectorAll('button[aria-pressed]')].find((b) => /^(名词|动词|形容词|副词)/.test(b.textContent.trim()));
    if (option) { option.click(); return 'choice'; }
    const input = document.querySelector('input.input-neon[aria-label], textarea.input-neon[aria-label]');
    if (input && !input.value) {
      const proto = input.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
      Object.getOwnPropertyDescriptor(proto, 'value').set.call(input, 'con-struc-tion');
      input.dispatchEvent(new Event('input', { bubbles: true }));
      return 'typed';
    }
    return 'none';
  });
  await sleep(350);
  await clickText('button', '下一步');
  await sleep(450);
  if (done === 'none') {
    // 控件没识别到，再尝试推进一次后退出
    const again = await page.evaluate(() => document.body.innerText.includes('完成分析'));
    if (again) break;
  }
}
await page.evaluate(() => {
  const input = document.querySelector('input.input-neon[aria-label], textarea.input-neon[aria-label]');
  if (input && !input.value) {
    const proto = input.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(proto, 'value').set.call(input, 'con-struc-tion');
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }
});
await sleep(300);
const finished = await clickText('button', '完成分析');
await sleep(700);
const analyzed = await page.evaluate(() => ({
  head: Number(document.body.innerText.match(/分析历史（(\d+)）/)?.[1] ?? '0'),
  hasWord: [...document.querySelectorAll('section button')].some((b) => b.textContent.trim() === 'construction'),
}));
check('向导走到完成分析', finished);
check('分析历史记录 construction', analyzed.head >= 1 && analyzed.hasWord,
  `分析历史 ${analyzed.head} · construction=${analyzed.hasWord}`);
check('分析页零报错', consoleErrors.length === 0, consoleErrors[0] || '');
consoleErrors = [];

console.log('[8] 方法工具箱 7 个页签');
await goto('/toolbox');
for (const tab of ['音节划分器', '重音查询', '词根词缀检索', '语境笔记', '复习节奏', '输出训练', '元认知清单']) {
  const okTab = await clickText('button', tab);
  await sleep(450);
  if (!okTab) check(`工具箱「${tab}」`, false);
}
check('工具箱 7 页签零报错', consoleErrors.length === 0, consoleErrors[0] || '');
consoleErrors = [];

console.log('[9] 复习中心：间隔重复作答');
await goto('/review');
const dueNum = await page.evaluate(() => {
  const m = document.body.innerText.match(/今日到期\s*(\d+)/);
  return m ? Number(m[1]) : 0;
});
const started = dueNum > 0 ? await clickText('button', '开始复习') : false;
await sleep(500);
const hasCard = started && (await page.evaluate(() => document.body.innerText.includes('记得')));
if (hasCard) {
  const revBefore = await page.evaluate(() => document.body.innerText.match(/主动回忆 (\d+) 次/)?.[1] ?? '0');
  await clickText('button', '记得');
  await sleep(600);
  const revAfter = await page.evaluate(() => document.body.innerText.match(/主动回忆 (\d+) 次/)?.[1] ?? '0');
  check('复习「记得」推进队列', Number(revAfter) > Number(revBefore), `${revBefore} → ${revAfter}`);
} else {
  check('到期卡片可进入复习会话', dueNum > 0 && started, `due=${dueNum}`);
}
check('复习页零报错', consoleErrors.length === 0, consoleErrors[0] || '');
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

console.log('[11] 零存储 + 首页「我的进度」调节面板');
await goto('/');
const earnedStart = await page.evaluate(() =>
  document.querySelector('[data-testid="achievement-badge"][data-title="初次启程"]')?.dataset.earned);
check('start 成就解锁', earnedStart === '1', `earned=${earnedStart}`);
const xp1 = await xp();
check('会话内已累计 XP（进度在内存里）', xp1 > 0, `${xp1} XP`);
await page.reload({ waitUntil: 'networkidle2' });
await sleep(900);
const xp2 = await xp();
check('刷新后回到初始状态（XP 归零）', xp2 === 0, `${xp1} → ${xp2}`);
const panelInfo = await page.evaluate(() => {
  const p = document.querySelector('[data-testid="progress-panel"]');
  if (!p) return null;
  return {
    rows: p.querySelectorAll('[data-method-row]').length,
    inc: p.querySelectorAll('[data-step-inc]').length,
    note: p.innerText,
  };
});
check('首页出现「我的进度 · 继续学习」面板', Boolean(panelInfo) && panelInfo.rows === 8 && panelInfo.inc === 8,
  panelInfo ? `${panelInfo.rows} 行` : '面板缺失');
check('面板解释“不保存数据、由你调节”', Boolean(panelInfo) && /不保存数据|零存储/.test(panelInfo.note),
  (panelInfo?.note ?? '').split('\n')[2]?.slice(0, 40) ?? '');
consoleErrors = [];

console.log('[13] 费曼关：关键词检查 + 自评 + 掌握标准');
await goto('/feynman?method=phonics-syllables');
const feynmanReady = await page.evaluate(() => !!document.querySelector('#feynman-text'));
check('费曼关页面可打开', feynmanReady);

const kwList = await page.$$eval('[data-kw]', (els) => els.map((e) => e.getAttribute('data-kw')));
check('展示关键词检查项', kwList.length >= 6, kwList.join(','));

// 构造一份合格讲解：命中 5 个关键词 + 3 个例子词 + 例外表述
const explanation = `${kwList.slice(0, 5).join('，')}。例如 transportation、baby、record 三个词都能这样处理；例外：非重读音节会弱读，不能读得太实。`;
await page.evaluate((t) => {
  const ta = document.querySelector('#feynman-text');
  const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
  setter.call(ta, t);
  ta.dispatchEvent(new Event('input', { bubbles: true }));
}, explanation);
await page.evaluate(() => document.querySelectorAll('[data-rate="5"]').forEach((b) => b.click()));
await sleep(300);

const feyXpBefore = await xp();
const submitted = await clickText('button', '提交费曼关');
await sleep(700);
const feyBody = await page.evaluate(() => document.body.innerText);
check('费曼关提交并判定通过', submitted && feyBody.includes('费曼关通过'), feyBody.includes('费曼关通过') ? '' : feyBody.slice(0, 160));
const feyXpAfter = await xp();
check('通过费曼关获得 XP', feyXpAfter - feyXpBefore === 15, `${feyXpBefore} → ${feyXpAfter}`);
const feyUrl = await page.evaluate(() => window.location.search);
check('费曼关 ?method= 参数仍生效', feyUrl === '?method=phonics-syllables', feyUrl);
// 成就与记录都要能在界面上看到（零存储：localStorage 里没有状态可读）
await goto('/');
const feyBadge = await page.evaluate(() =>
  document.querySelector('[data-testid="achievement-badge"][data-title="讲得出，才算会"]')?.dataset.earned);
check('费曼关成就解锁', feyBadge === '1', `earned=${feyBadge}`);
const startBadge = await page.evaluate(() =>
  document.querySelector('[data-testid="achievement-badge"][data-title="初次启程"]')?.dataset.earned);
check('课程成就仍在（会话内状态未被导航清掉）', startBadge === '1', `earned=${startBadge}`);
check('费曼关零报错', consoleErrors.length === 0, consoleErrors[0] || '');
consoleErrors = [];

console.log('[14] 方向感引导：面包屑 / 进度调节续学 / 底部导航');
await page.setViewport({ width: 1280, height: 900 });
await sleep(400);

// 1) 每页：≥2 段面包屑 + 底部「下一步去哪儿」引导
let crumbBad = [];
for (const route of ['/methods', '/methods/phonics-syllables', '/lab/phonemes', '/practice', '/analyze', '/toolbox', '/review', '/stats', '/settings', '/feynman', '/definitely-not-a-route']) {
  await goto(route);
  const g = await page.evaluate(() => ({
    crumbs: document.querySelectorAll('nav[aria-label="面包屑"] > span').length,
    next: !!document.querySelector('[data-testid="next-step-bar"]'),
    introNext: !!document.querySelector('[data-testid="intro-next"]'),
  }));
  if (g.crumbs < 2 || !g.next) crumbBad.push(`${route}(${g.crumbs}段,bar=${g.next ? 1 : 0})`);
}
check('每个二级页面 ≥2 段面包屑 + 「下一步」引导条', crumbBad.length === 0, crumbBad.join(' ') || '11 条路由全部通过');
await goto('/');
const homeCrumbs = await page.evaluate(() => document.querySelectorAll('nav[aria-label="面包屑"] > span').length);
check('首页也有面包屑锚点', homeCrumbs === 1, `${homeCrumbs} 段`);

// 2) 首页把进度调到 3 节 → XP +30 → CTA 指向第 4 步 → 落地那一节
await goto('/');
const xpA = await xp();
for (let i = 0; i < 3; i++) {
  await page.click('[data-step-inc="0"]');
  await sleep(220);
}
const xpB = await xp();
const cnt0 = await page.$eval('[data-step-count="0"]', (e) => e.textContent.trim());
check('调节后卡片显示 3/8 节', cnt0 === '3/8', cnt0);
check('每标记一节 +10 XP（3 节 = +30）', xpB - xpA === 30, `${xpA} → ${xpB}（Δ${xpB - xpA}）`);
const resumeLabel = await page.$eval('[data-testid="resume-btn"]', (e) => e.textContent.trim());
check('主 CTA 指向「第 4 步」', resumeLabel.includes('第 4 步'), resumeLabel);
const resumeHere = await page.evaluate(() => document.querySelectorAll('[data-testid="map-you-are-here"]').length >= 1);
check('学习地图标注「你在这里」', resumeHere);
await page.click('[data-testid="resume-btn"]');
await sleep(1300);
const landedUrl = await page.evaluate(() => window.location.pathname + window.location.search);
check('跳到 /methods/phonics-syllables?step=3', landedUrl === '/methods/phonics-syllables?step=3', landedUrl);
const landedStep = await page.evaluate(() => document.querySelector('[data-testid="course-step"]')?.textContent.trim() ?? '');
check('课程页落在第 4 步', landedStep.includes('第 4 步'), landedStep);
const xpC = await xp();
check('进入该步再 +10 XP', xpC - xpB === 10, `${xpB} → ${xpC}`);

// 3) 移动端底部导航：5 项、当前高亮、可点
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
check('375px 底部导航 5 项可见', Boolean(bn) && bn.count === 5 && bn.h > 40 && bn.w > 300,
  bn ? `${bn.count} 项 · ${Math.round(bn.w)}×${Math.round(bn.h)}` : '无底部导航');
check('底部导航高亮当前页', Boolean(bn) && bn.items.filter((i) => i.on).length === 1,
  bn ? bn.items.map((i) => `${i.t}${i.on ? '·当前' : ''}`).join('/') : '');
const clickedNav = await page.evaluate(() => {
  const a = document.querySelector('[data-testid="bottom-nav"] li:nth-child(4) a');
  if (a) { a.click(); return true; }
  return false;
});
await sleep(900);
const afterNav = await page.evaluate(() => window.location.pathname);
check('底部导航可点击跳转', clickedNav && afterNav === '/review', afterNav);
await page.setViewport({ width: 1280, height: 900 });
await sleep(500);
check('方向感引导段零报错', consoleErrors.length === 0, consoleErrors[0] || '');
consoleErrors = [];

console.log('[12] 移动端 375px 无横向滚动');
await page.setViewport({ width: 375, height: 780 });
for (const route of ['/', '/methods/phonics-syllables', '/lab/phonemes', '/practice', '/feynman']) {
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

/** 页签名 → quizBanks key */
function tabToKey(tab) {
  return {
    听音选音标: 'listenChoosePhoneme',
    看词选音标: 'wordChoosePhoneme',
    音标选拼写: 'phonemeChooseSpelling',
    拼写选音标: 'spellingChoosePhoneme',
    听写音标: 'listenWritePhoneme',
    听写单词: 'listenWriteWord',
    音节划分: 'syllableSplit',
    重音定位: 'stressPosition',
    最小对立对: 'minimalPair',
    词缀拼装: 'affixAssemble',
    语境选词: 'contextChoice',
  }[tab];
}
