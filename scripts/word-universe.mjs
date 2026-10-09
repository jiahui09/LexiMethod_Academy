#!/usr/bin/env node
/**
 * 词全集单源（word universe）
 * ============================================================
 * 定义「教学里所有会被点读/朗读」的词槽位全集：
 *   phonemes   ttsWord + exampleWords + minimalPairs(a,b)
 *   words      word + wordFamily[].word + syllables[]
 *   demoConfig rule.word/syllables + mapping.family/exceptions + practice.word + applicationWord
 *   rules      examples[]（"word /ipa" 取首段）
 *   spellingPatterns  examples[] + exceptions[]（同上）
 *   affixes    prefixes/suffixes/roots 的 examples[]
 *   quizBanks  speak 字段（整串为纯词才算；词组/句子留 TTS）
 *   literals   组件内写死的英文词
 *
 * 过滤规则：全小写 a-z、长度 ≥2、去重、字典序（保证门禁确定性）。
 * WORD_SKIP：碎片黑名单——孤立合成听感不合格的音节/词缀碎片，
 *   加入后回落浏览器 TTS（生成器与门禁同读此名单；若已有 mp3 需手动删除）。
 *
 * 用法：node scripts/word-universe.mjs   # 打印词表盘点报告
 * 依赖：node_modules/.bin/esbuild（随 vite 自带）
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/**
 * 碎片黑名单（抽听样片不合格时追加）。
 * 纯 a-z 小写词，不含文件名后缀。
 */
export const WORD_SKIP = [
  // 例：'struc' —— 等抽听后按需追加
];

/** 合法词 token：纯小写 a-z 且 ≥2 字符 */
const TOKEN = /^[a-z]{2,}$/;

/**
 * 显式补录词（不来自数据源，直接写定合成输入）。
 * token 即文件名（public/audio/words/<token>.mp3），phonemes 为 [[IPA]] 原始音素输入。
 * 用途：同形异读词必须分别合成（如 record 名词/动词重音不同，纯文本会读成同一个音）。
 */
export const EXTRA_WORDS = [
  { token: 'record-noun', phonemes: '[[ˈɹɛkɚd]]', note: 'record 名词重音在首音节（课程 02 演示/出门条用）' },
  { token: 'record-verb', phonemes: '[[ɹɪˈkɔɹd]]', note: 'record 动词重音在第二音节' },
];

/** esbuild 打包数据入口 → 可导入的模块（每进程一次） */
let cachedData = null;
export async function loadData() {
  if (cachedData) return cachedData;
  const esbuild = path.join(ROOT, 'node_modules', '.bin', 'esbuild');
  if (!fs.existsSync(esbuild)) throw new Error('缺少 esbuild（node_modules/.bin/esbuild），先 npm install');
  const tmp = path.join(ROOT, '.tmp');
  fs.mkdirSync(tmp, { recursive: true });
  const outFile = path.join(tmp, 'wordUniverse.bundle.mjs');
  const { execFileSync } = await import('node:child_process');
  execFileSync(esbuild, [
    path.join(ROOT, 'scripts', 'wordUniverse.entry.ts'),
    '--bundle', '--format=esm', `--outfile=${outFile}`,
    `--tsconfig=${path.join(ROOT, 'tsconfig.app.json')}`,
    '--log-level=error',
  ], { stdio: ['ignore', 'ignore', 'inherit'] });
  cachedData = await import(`${pathToFileURL(outFile).href}?v=${Date.now()}`);
  return cachedData;
}

/**
 * 从数据模块提取词全集。
 * @returns {{ words: string[], skipped: {token:string, source:string, reason:string}[], bySource: Record<string, {raw:number, ok:number}> }}
 */
export function extractWords(mod) {
  const skip = new Set(WORD_SKIP);
  const collected = new Map(); // token -> source（先到先得，仅用于报告）
  const skipped = [];
  const bySource = {};
  const take = (source, candidate, { firstSegment = false } = {}) => {
    const s = (bySource[source] ??= { raw: 0, ok: 0 });
    if (candidate == null) return;
    s.raw++;
    let token = String(candidate).trim();
    if (firstSegment) token = token.split(/\s+/)[0] ?? '';
    if (skip.has(token)) {
      skipped.push({ token, source, reason: 'WORD_SKIP' });
      return;
    }
    if (!TOKEN.test(token)) {
      skipped.push({ token, source, reason: 'non-token' });
      return;
    }
    s.ok++;
    if (!collected.has(token)) collected.set(token, source);
  };

  /* phonemes：ttsWord + exampleWords + minimalPairs */
  for (const p of mod.phonemes) {
    take('phonemes.ttsWord', p.ttsWord);
    for (const w of p.exampleWords ?? []) take('phonemes.exampleWords', w);
    for (const pair of p.minimalPairs ?? []) {
      take('phonemes.minimalPairs', pair.a);
      take('phonemes.minimalPairs', pair.b);
    }
  }

  /* words：词 + 词族 + 音节块 */
  for (const w of mod.words) {
    take('words.word', w.word);
    for (const f of w.wordFamily ?? []) take('words.wordFamily', f.word);
    for (const syl of w.syllables ?? []) take('words.syllables', syl);
  }

  /* demoConfig：规则演示/拼写映射/实战生词 */
  for (const [id, demo] of Object.entries(mod.demoByMethod ?? {})) {
    const src = `demo.${id}`;
    if (demo.rule) {
      take(`${src}.rule.word`, demo.rule.word);
      for (const syl of demo.rule.syllables ?? []) take(`${src}.rule.syllables`, syl);
    }
    if (demo.mapping) {
      for (const f of demo.mapping.family ?? []) take(`${src}.mapping.family`, f.word);
      for (const e of demo.mapping.exceptions ?? []) take(`${src}.mapping.exceptions`, e.word);
    }
    if (demo.practice?.word) take(`${src}.practice.word`, demo.practice.word);
    if (demo.applicationWord) take(`${src}.applicationWord`, demo.applicationWord);
  }

  /* rules / spellingPatterns："word /ipa" 首段 */
  for (const r of mod.rules) for (const e of r.examples ?? []) take('rules.examples', e, { firstSegment: true });
  for (const sp of mod.spellingPatterns) {
    for (const e of sp.examples ?? []) take('spellingPatterns.examples', e, { firstSegment: true });
    for (const e of sp.exceptions ?? []) take('spellingPatterns.exceptions', e, { firstSegment: true });
  }

  /* affixes：例词（纯词，词缀原文带连字符自然落选） */
  for (const a of [...mod.prefixes, ...mod.suffixes, ...mod.roots])
    for (const e of a.examples ?? []) take('affixes.examples', e);

  /* quizBanks：speak 整串为纯词才收（词组/句子留 TTS） */
  for (const list of Object.values(mod.quizBanks ?? {}))
    for (const q of list ?? []) take('quizBanks.speak', q.speak);

  /* 组件内写死的英文词 */
  for (const w of ['ambulance', 'construction']) take('literals', w);

  /* 显式补录词（同形异读等，合成输入见 EXTRA_WORDS） */
  for (const e of EXTRA_WORDS) {
    if (skip.has(e.token)) continue;
    const s = (bySource['extra'] ??= { raw: 0, ok: 0 });
    s.raw++;
    if (!collected.has(e.token)) {
      collected.set(e.token, 'extra');
      s.ok++;
    }
  }

  const words = [...collected.keys()].sort();
  return { words, skipped, bySource };
}

/** 一步到位：打包 + 提取 */
export async function buildWordUniverse() {
  return extractWords(await loadData());
}

/* ---------------- CLI 报告 ---------------- */
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { words, skipped, bySource } = await buildWordUniverse();
  console.log('=== 词全集盘点 ===');
  const rows = Object.entries(bySource).sort((a, b) => a[0].localeCompare(b[0]));
  for (const [src, s] of rows) console.log(`  ${src.padEnd(36)} 候选 ${String(s.raw).padStart(4)} → 收录 ${String(s.ok).padStart(4)}`);
  console.log(`  —— 唯一词合计：${words.length}（WORD_SKIP ${WORD_SKIP.length}）`);
  const nonToken = skipped.filter((s) => s.reason === 'non-token');
  console.log(`  —— 落选（非纯词 token）：${nonToken.length}，样例：`);
  for (const s of nonToken.slice(0, 20)) console.log(`      ${JSON.stringify(s.token)} ← ${s.source}`);
  if (nonToken.length > 20) console.log(`      … 其余 ${nonToken.length - 20} 条`);
}
