#!/usr/bin/env node
/**
 * LexiMethod Academy — DESIGN.md 质量底线审计（四合一）
 *
 * 用法:
 *   node scripts/audit-floor.mjs [baseUrl]        # 默认 http://127.0.0.1:5173
 *   node scripts/audit-floor.mjs --route /stats    # 只审单路由（修复时聚焦用）
 *
 * 检查项（对应 DESIGN.md 硬规则，归零后并入 verify 门禁）:
 *   A. 对比度：可见文本 vs 有效背景（WCAG 相对亮度），正文 <4.5:1、
 *      大字（≥24px 或 ≥18.66px 且粗体）<3:1 记违规；背景链路含渐变时近似取最近实色并标注。
 *   B. 字号底线：computed font-size < 12px。
 *   C. 触控目标：390px 视口下 a/button/[role=button]/[role=tab] 宽或高 < 44px
 *      （排除段落内的行文链接——行文链接按 WCAG 行内例外处理）。
 *   D. 结构：每路由恰好 1 个 h1；DOM 无重复 id。
 *
 * 输出: 分组清单（每组限量展示）+ 全量 JSON 报告 .impeccable/audit-floor.json
 * 退出码: 0 = 零违规；1 = 有违规。
 */
import puppeteer from 'puppeteer-core';

// 参数解析：位置参数 base、--route 过滤
const argv = process.argv.slice(2);
const routeIdx = argv.indexOf('--route');
const ROUTE_FILTER = routeIdx !== -1 ? argv[routeIdx + 1] : null;
const positional = argv.filter((a, i) => !a.startsWith('--') && i !== routeIdx + 1 && argv[i - 1] !== '--out');
const BASE_URL = positional[0] ?? 'http://127.0.0.1:5173';
const outIdx = argv.indexOf('--out');
const OUT_FILE = outIdx !== -1 ? argv[outIdx + 1] : '.impeccable/audit-floor.json';
const CHROME = process.env.CHROME_BIN ?? '/usr/bin/chromium';

const ROUTES = [
  '/',
  '/methods',
  '/methods/phonics-syllables',
  '/lab/phonemes',
  '/lab/mapping',
  '/lab/dictation',
  '/practice',
  '/analyze',
  '/feynman',
  '/toolbox',
  '/review',
  '/stats',
  '/settings',
  '/definitely-not-a-route',
];
const routes = ROUTE_FILTER ? [ROUTE_FILTER] : ROUTES;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** 页面内执行：对比度 + 字号 + h1 + 重复 id（桌面视口） */
const auditDesktop = () => {
  const parseColor = (str) => {
    const m = str && str.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const parts = m[1].split(/[,\s/]+/).filter(Boolean).map(Number);
    if (parts.length < 3 || parts.some(Number.isNaN)) return null;
    return { r: parts[0], g: parts[1], b: parts[2], a: parts.length > 3 ? parts[3] : 1 };
  };
  const lin = (c) => { const v = c / 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  const lum = ({ r, g, b }) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  const over = (src, dst) => ({
    r: src.r * src.a + dst.r * (1 - src.a),
    g: src.g * src.a + dst.g * (1 - src.a),
    b: src.b * src.a + dst.b * (1 - src.a),
    a: 1,
  });

  const sel = (el) => {
    const parts = [];
    let cur = el;
    for (let d = 0; cur && cur !== document.body && d < 4; d++, cur = cur.parentElement) {
      let s = cur.tagName.toLowerCase();
      if (cur.id) s += `#${cur.id}`;
      else if (cur.classList.length) s += '.' + [...cur.classList].slice(0, 2).join('.');
      parts.unshift(s);
    }
    return parts.join('>') || 'body';
  };

  // 有效背景：沿祖先收集实色（从根向下合成）；遇到背景图/渐变标注近似
  const effectiveBg = (el) => {
    const chain = [];
    let gradientSeen = false;
    for (let cur = el; cur; cur = cur.parentElement) {
      const cs = getComputedStyle(cur);
      if (cs.backgroundImage && cs.backgroundImage !== 'none') gradientSeen = true;
      const c = parseColor(cs.backgroundColor);
      if (c && c.a > 0) chain.push(c);
    }
    let bg = { r: 11, g: 16, b: 32, a: 1 }; // 兜底：abyss #0B1020
    for (let i = chain.length - 1; i >= 0; i--) bg = over(chain[i], bg);
    return { bg, gradientSeen };
  };

  const visible = (el) => {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') return false;
    if (el.closest('[aria-hidden="true"]')) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };

  const contrast = [];
  const typeFloor = [];
  let gradientTextSkipped = 0;
  for (const el of document.querySelectorAll('body *')) {
    const hasText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 0);
    if (!hasText || !visible(el)) continue;
    const cs = getComputedStyle(el);
    const size = parseFloat(cs.fontSize);
    const text = (el.textContent || '').trim().slice(0, 40);

    // B. 字号底线
    if (size > 0 && size < 12) {
      typeFloor.push({ sel: sel(el), size, text });
    }

    // A. 对比度
    // 渐变文字（background-clip:text）：computed color 为透明，真实笔画是 background-image 的
    // 色标 —— 解析色标逐个算比值，取最差值代表该文字；解析不出则跳过并计数提示人工核查
    const isGradientText = cs.webkitBackgroundClip === 'text' || cs.backgroundClip === 'text';
    let fgStops = null;
    if (isGradientText) {
      const hexes = (cs.backgroundImage || '').match(/#[0-9a-fA-F]{3,8}\b/g) || [];
      const rgbs = (cs.backgroundImage || '').match(/rgba?\([^)]+\)/g) || [];
      const stops = [...hexes.map(h => {
        let x = h.slice(1);
        if (x.length === 3 || x.length === 4) x = [...x].map(c => c + c).join('');
        return { r: parseInt(x.slice(0, 2), 16), g: parseInt(x.slice(2, 4), 16), b: parseInt(x.slice(4, 6), 16), a: 1 };
      }), ...rgbs.map(parseColor).filter(Boolean)];
      fgStops = stops.length ? stops : null;
    }
    const fgRaw = fgStops ? null : parseColor(cs.color);
    if (!fgStops && !fgRaw) continue;
    if (isGradientText && !fgStops) { gradientTextSkipped++; continue; }
    const { bg, gradientSeen } = effectiveBg(el);
    const weight = Number(cs.fontWeight) || 400;
    const large = size >= 24 || (size >= 18.66 && weight >= 700);
    const need = large ? 3 : 4.5;
    const ratioOf = (f) => {
      const fg = f.a < 1 ? over(f, bg) : f;
      const l1 = Math.max(lum(fg), lum(bg));
      const l2 = Math.min(lum(fg), lum(bg));
      return (l1 + 0.05) / (l2 + 0.05);
    };
    const candidates = fgStops ? fgStops : [fgRaw];
    const ratio = Math.min(...candidates.map(ratioOf));
    if (ratio < need) {
      contrast.push({
        sel: sel(el), text, size, weight,
        fg: fgStops ? cs.backgroundImage.slice(0, 60) : cs.color,
        bg: `rgb(${Math.round(bg.r)}, ${Math.round(bg.g)}, ${Math.round(bg.b)})`,
        approxBg: gradientSeen,
        gradientText: !!fgStops,
        ratio: Math.round(ratio * 100) / 100, need,
      });
    }
  }

  // D. 结构
  const h1 = document.querySelectorAll('h1').length;
  const ids = {};
  for (const el of document.querySelectorAll('[id]')) (ids[el.id] ??= 0), ids[el.id]++;
  const dupIds = Object.entries(ids).filter(([, n]) => n > 1).map(([id, n]) => ({ id, n }));

  return { contrast, typeFloor, h1, dupIds, gradientTextSkipped };
};

/** 页面内执行：触控目标（390 视口） */
const auditTouch = () => {
  const sel = (el) => {
    const parts = [];
    let cur = el;
    for (let d = 0; cur && cur !== document.body && d < 4; d++, cur = cur.parentElement) {
      let s = cur.tagName.toLowerCase();
      if (cur.id) s += `#${cur.id}`;
      else if (cur.classList.length) s += '.' + [...cur.classList].slice(0, 2).join('.');
      parts.unshift(s);
    }
    return parts.join('>') || 'body';
  };
  const small = [];
  for (const el of document.querySelectorAll('a, button, [role="button"], [role="tab"]')) {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    if (el.classList.contains('sr-only')) continue; // skip-link：聚焦前 1×1 不可点，非真实目标
    if (el.closest('[aria-hidden="true"]')) continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    // 行文例外：段落内的行内 a/button 不计入（WCAG 行内上下文例外）
    if (el.tagName === 'A' && el.closest('p')) continue;
    if (el.tagName === 'BUTTON' && el.closest('p')) continue;
    if (r.width < 44 || r.height < 44) {
      small.push({
        sel: sel(el),
        text: (el.textContent || '').trim().slice(0, 24),
        w: Math.round(r.width), h: Math.round(r.height),
      });
    }
  }
  return small;
};

async function main() {
  console.log(`→ DESIGN.md 底线审计 ${BASE_URL}${ROUTE_FILTER ? `（仅 ${ROUTE_FILTER}）` : ''}`);
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--mute-audio'],
  });
  const page = await browser.newPage();

  const report = { at: new Date().toISOString(), base: BASE_URL, contrast: [], typeFloor: [], touch: [], h1: [], dupIds: [] };

  await page.setViewport({ width: 1280, height: 900 });
  for (const route of routes) {
    try {
      await page.goto(BASE_URL + route, { waitUntil: 'networkidle2', timeout: 20000 });
      await sleep(700);
      const r = await page.evaluate(auditDesktop);
      for (const v of r.contrast) report.contrast.push({ route, ...v });
      for (const v of r.typeFloor) report.typeFloor.push({ route, ...v });
      if (r.h1 !== 1) report.h1.push({ route, count: r.h1 });
      for (const v of r.dupIds) report.dupIds.push({ route, ...v });
      report.gradientTextSkipped = (report.gradientTextSkipped ?? 0) + (r.gradientTextSkipped ?? 0);
    } catch (e) {
      report.h1.push({ route, count: -1, error: String(e).slice(0, 80) });
    }
  }

  {
    await page.setViewport({ width: 390, height: 844, isMobile: true });
    for (const route of routes) {
      try {
        await page.goto(BASE_URL + route, { waitUntil: 'networkidle2', timeout: 20000 });
        await sleep(600);
        const small = await page.evaluate(auditTouch);
        for (const v of small) report.touch.push({ route, ...v });
      } catch {
        /* 触控段加载失败不吞整体 */
      }
    }
  }

  await browser.close();

  // 加载失败检测：任何路由没打开，本轮结果即无效，必须显式失败而非静默假 0
  const loadFails = report.h1.filter((v) => v.count === -1 || v.error);
  if (loadFails.length > 0) {
    console.log(`[致命] ${loadFails.length}/${routes.length} 条路由加载失败（dev server 是否在 ${BASE_URL} 运行？），本轮审计无效`);
    for (const v of loadFails) console.log('   ', v.route, String(v.error ?? '').slice(0, 70));
    const fs0 = await import('node:fs');
    fs0.mkdirSync('.impeccable', { recursive: true });
    fs0.writeFileSync(OUT_FILE, JSON.stringify({ ...report, loadFailed: true }, null, 2));
    process.exit(1);
  }

  const show = (title, list, fmt, cap = 12) => {
    console.log(`\n[${title}] ${list.length} 条`);
    for (const v of list.slice(0, cap)) console.log('  ' + fmt(v));
    if (list.length > cap) console.log(`  …还有 ${list.length - cap} 条（见 JSON 报告）`);
  };

  show('A 对比度', report.contrast,
    (v) => `${v.ratio}:1<${v.need} ${v.route} ${v.size}px "${v.text}" ← ${v.sel}${v.approxBg ? ' [近似bg:渐变]' : ''}`);
  show('B 字号<12px', report.typeFloor,
    (v) => `${v.route} ${v.size}px "${v.text}" ← ${v.sel}`);
  show('C 触控<44px', report.touch,
    (v) => `${v.route} ${v.w}×${v.h} "${v.text}" ← ${v.sel}`);
  show('D 结构', [
    ...report.h1.map((v) => ({ k: `h1=${v.count}${v.error ? ' 加载失败:' + v.error : ''} @ ${v.route}` })),
    ...report.dupIds.map((v) => ({ k: `重复id #${v.id} ×${v.n} @ ${v.route}` })),
  ], (v) => v.k, 20);

  const total = report.contrast.length + report.typeFloor.length + report.touch.length + report.h1.length + report.dupIds.length;
  console.log(`\n汇总: A=${report.contrast.length} B=${report.typeFloor.length} C=${report.touch.length} D=${report.h1.length + report.dupIds.length}  合计=${total}`
    + (report.gradientTextSkipped ? `（另有 ${report.gradientTextSkipped} 处渐变文字因无法解析色标跳过，人工核查）` : ''));

  const fs = await import('node:fs');
  fs.mkdirSync('.impeccable', { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify(report, null, 2));
  console.log('报告已写入 ' + OUT_FILE);

  process.exit(total === 0 ? 0 : 1);
}

main().catch((e) => { console.error(e); process.exit(2); });
