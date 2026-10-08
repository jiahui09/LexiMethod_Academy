#!/usr/bin/env node
/**
 * 新课程体系结构与文案验收（课程重构 v1）
 * 校验 src/data/courses/*.ts：
 *  - 结构：units 5–6、单元时长 5–9 且与 durationMin 一致、selfCheck=5、诊断/出门条 6–10 题
 *  - 题目：id 唯一且符合 cNN-domain-n、必填字段非空、choices 3–4 项唯一 correct 且与 answer 一致
 *  - 文案密度：claim ≤40、example ≤80、warning ≤60、list 项 ≤30、verdict ≤50、单元标题 ≤24
 *  - 禁令：正文字段无破折号/连接号/冒号；翻案腔词面出现即列出（人工复核）
 * 用法：node scripts/check-courses.mjs   （退出码非 0 = 有硬错误）
 */
import { build } from 'esbuild';
import { readdirSync, writeFileSync, unlinkSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dir = join(root, 'src/data/courses');
const files = readdirSync(dir).filter((f) => f.endsWith('.ts') && f !== 'index.ts').sort();

const errors = [];
const warns = [];
const err = (f, m) => errors.push(`${f}: ${m}`);
const warn = (f, m) => warns.push(`${f}: ${m}`);

// ---- 打包为可 import 的 ESM（类型文件转运行时数据） ----
const outfile = join(root, '.tmp/check-courses.bundle.mjs');
const entry = files.map((f) => `export * from ${JSON.stringify(join(dir, f))};`).join('\n');
const entryPath = join(root, '.tmp/check-courses.entry.ts');
writeFileSync(entryPath, entry);
try {
  await build({
    entryPoints: [entryPath],
    outfile,
    bundle: true,
    format: 'esm',
    platform: 'node',
    absWorkingDir: root,
    logLevel: 'silent',
  });
} catch (e) {
  console.error('bundle 失败\n' + e);
  process.exit(1);
}

const mod = await import(pathToFileURL(outfile).href + `?t=${Date.now()}`);
const courses = Object.values(mod).filter((v) => v && typeof v === 'object' && 'units' in v);

if (courses.length !== files.length) {
  err('index', `导出课程数 ${courses.length} ≠ 文件数 ${files.length}（是否有文件未导出 Course）`);
}

// ---- 禁用标点与翻案腔 ----
const BANNED = [
  ['——', '双破折号'],
  ['—', '破折号'],
  ['–', '连接号'],
  ['：', '冒号'],
  [':', '半角冒号'],
];
const FANAN = ['而是', '你以为', '说到底', '先说结论', '说白了', '值得注意的是', '需要指出的是', '实际上', '并非'];

const prose = (v, path, f) => {
  if (typeof v !== 'string' || !v) return;
  for (const [ch, name] of BANNED) {
    if (v.includes(ch)) err(f, `${path} 含禁用${name}: ${JSON.stringify(v.slice(0, 48))}`);
  }
  for (const w of FANAN) if (v.includes(w)) warn(f, `${path} 疑似翻案腔词面「${w}」: ${JSON.stringify(v.slice(0, 48))}`);
};

// ---- 各字段长度上限 ----
const LIM = { claim: 40, example: 80, warning: 60, listItem: 30, verdict: 50, unitTitle: 24, practicePrompt: 60, check: 50 };

const seenIds = new Set();
const STAGES = ['pathway', 'deconstruct', 'encode', 'retrieve', 'capstone'];

for (const c of courses) {
  const f = c.id ?? '?';
  // 顶层
  if (!STAGES.includes(c.stage)) err(f, `stage 非法: ${c.stage}`);
  if (!Number.isInteger(c.order) || c.order < 1 || c.order > 8) err(f, `order 非法: ${c.order}`);
  if (!c.title || !c.subtitle || !c.goal) err(f, 'title/subtitle/goal 有空');
  prose(c.title, 'title', f); prose(c.subtitle, 'subtitle', f); prose(c.goal, 'goal', f);
  if (c.units.length < 5 || c.units.length > 6) err(f, `units 数 ${c.units.length} 不在 5–6`);
  const sum = c.units.reduce((s, u) => s + u.durationMin, 0);
  if (sum !== c.durationMin) err(f, `durationMin ${c.durationMin} ≠ 单元和 ${sum}`);
  if (sum < 30 || sum > 38) err(f, `总时长 ${sum} 不在 30–38`);
  if (c.selfCheck.length !== 5) err(f, `selfCheck ${c.selfCheck.length} 条 ≠ 5`);
  c.selfCheck.forEach((s, i) => prose(s, `selfCheck[${i}]`, f));

  // 诊断
  const d = c.opening;
  if (!d || !d.lead) err(f, 'opening.lead 空');
  else prose(d.lead, 'opening.lead', f);
  if (d && (d.questions.length < 6 || d.questions.length > 10)) err(f, `诊断题数 ${d.questions.length} 不在 6–10`);
  if (d && (d.bands.length < 2 || d.bands.length > 4)) err(f, `诊断 bands ${d.bands.length} 不在 2–4`);
  d?.bands.forEach((b, i) => prose(b.verdict, `bands[${i}].verdict`, f));
  checkQ(d?.questions ?? [], f, 'diag');

  // 单元
  const uids = new Set();
  c.units.forEach((u, i) => {
    const p = `units[${i}]`;
    if (!/^u[1-6]$/.test(u.id)) err(f, `${p}.id 非法: ${u.id}`);
    if (uids.has(u.id)) err(f, `重复单元 id ${u.id}`);
    uids.add(u.id);
    if (u.durationMin < 5 || u.durationMin > 9) err(f, `${p} 时长 ${u.durationMin} 不在 5–9`);
    prose(u.title, `${p}.title`, f);
    if (u.title.length > LIM.unitTitle) err(f, `${p}.title 超 ${LIM.unitTitle} 字: ${u.title}`);
    if (!u.claim) err(f, `${p}.claim 空`);
    if (u.claim.length > LIM.claim) err(f, `${p}.claim ${u.claim.length} 字 > ${LIM.claim}: ${u.claim}`);
    prose(u.claim, `${p}.claim`, f);
    if (!Array.isArray(u.blocks) || u.blocks.length < 1) err(f, `${p}.blocks 空`);
    u.blocks.forEach((b, j) => {
      const bp = `${p}.blocks[${j}]`;
      if (b.kind === 'example') {
        if (b.text.length > LIM.example) err(f, `${bp}.text ${b.text.length} 字 > ${LIM.example}`);
        prose(b.text, bp + '.text', f); if (b.note) prose(b.note, bp + '.note', f);
      } else if (b.kind === 'warning') {
        if (b.text.length > LIM.warning) err(f, `${bp}.text ${b.text.length} 字 > ${LIM.warning}`);
        prose(b.text, bp + '.text', f);
      } else if (b.kind === 'list') {
        b.items.forEach((it, k) => {
          if (it.length > LIM.listItem) err(f, `${bp}.items[${k}] ${it.length} 字 > ${LIM.listItem}`);
          prose(it, `${bp}.items[${k}]`, f);
        });
      } else if (b.kind === 'demo') {
        if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(b.ref)) err(f, `${bp}.ref 非 kebab-case: ${b.ref}`);
        prose(b.caption, bp + '.caption', f);
      } else err(f, `${bp} 未知 kind`);
    });
    if (u.check) { prose(u.check, `${p}.check`, f); if (u.check.length > LIM.check) err(f, `${p}.check 超长`); }
    if (u.practice) {
      if (!u.practice.kind || !u.practice.title || !u.practice.prompt) err(f, `${p}.practice 缺字段`);
      prose(u.practice.prompt, `${p}.practice.prompt`, f);
      if (u.practice.debrief) prose(u.practice.debrief, `${p}.practice.debrief`, f);
    }
  });

  // 出门条
  const x = c.exitTicket;
  if (!x?.intro) err(f, 'exitTicket.intro 空'); else prose(x.intro, 'exitTicket.intro', f);
  if (x && (x.questions.length < 6 || x.questions.length > 10)) err(f, `出门条题数 ${x.questions.length} 不在 6–10`);
  if (x && (x.bands.length < 2 || x.bands.length > 3)) err(f, `出门条 bands ${x.bands.length} 不在 2–3`);
  x?.bands.forEach((b, i) => prose(b.verdict, `exit.bands[${i}].verdict`, f));
  checkQ(x?.questions ?? [], f, 'exit');
}

function checkQ(qs, f, domain) {
  qs.forEach((q, i) => {
    const p = `题[${i}](${q.id})`;
    if (!q.id || !new RegExp(`^c\\d{2}-${domain}-\\d+$`).test(q.id)) err(f, `${p} id 不合规`);
    if (seenIds.has(q.id)) err(f, `重复题 id ${q.id}`);
    seenIds.add(q.id);
    for (const k of ['prompt', 'narration', 'answer', 'hint', 'explain']) {
      if (!q[k] || typeof q[k] !== 'string') err(f, `${p}.${k} 空`);
    }
    for (const k of ['prompt', 'narration', 'hint', 'explain']) prose(q[k], `${p}.${k}`, f);
    if (Array.isArray(q.choices)) {
      if (q.choices.length < 3 || q.choices.length > 4) err(f, `${p}.choices ${q.choices.length} 项不在 3–4`);
      const correct = q.choices.filter((c) => c.correct);
      if (correct.length !== 1) err(f, `${p}.choices correct 数 = ${correct.length} ≠ 1`);
      if (correct[0] && correct[0].label !== q.answer) err(f, `${p}.answer「${q.answer}」≠ 正确项「${correct[0].label}」`);
      q.choices.forEach((c, k) => prose(c.label, `${p}.choices[${k}]`, f));
    }
  });
}

// ---- 汇总 ----
const order = courses.map((c) => c.order).sort((a, b) => a - b).join(',');
if (order !== '1,2,3,4,5,6,7,8') err('path', `课序 order 不连续: ${order}`);
const ids = new Set(courses.map((c) => c.id));
if (ids.size !== courses.length) err('path', '课程 id 有重复');

for (const w of warns) console.log('WARN  ' + w);
for (const e of errors) console.log('ERROR ' + e);
console.log(`\n检查 ${files.length} 门课：${errors.length} 错误，${warns.length} 警告`);
try { unlinkSync(entryPath); unlinkSync(outfile); } catch {}
process.exit(errors.length ? 1 : 0);
