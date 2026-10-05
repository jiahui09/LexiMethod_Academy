#!/usr/bin/env node
/**
 * 音频资产门禁（npm run check:audio，已并入 verify）
 *
 * 三方一致性：词全集 scripts/word-universe.mjs ↔ public/audio/manifest.json ↔ 磁盘文件
 *  - 48 音素 + 词全集（约 926 词：8 数据源全部可点读词槽位）全覆盖（id/词、slug、文件路径）
 *  - 每个 mp3 存在、可解码（ffprobe）、时长合理、体积在预算内
 *  - src/data/phonemeAudio.ts 覆盖全部 id 与词（生成物未过期）
 *  - 音频总量 ≤ 4MB（全量静态资源 4.5MB 预算的音频份额；音频点击时才拉取，不进首屏）
 *
 * 依赖：node_modules/.bin/esbuild（随 vite）、系统 ffprobe（ffmpeg）
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildWordUniverse, loadData as loadUniverseData } from './word-universe.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const AUDIO_DIR = path.join(ROOT, 'public', 'audio');
const MANIFEST = path.join(AUDIO_DIR, 'manifest.json');
const GEN_MODULE = path.join(ROOT, 'src', 'data', 'phonemeAudio.ts');
const MAX_TOTAL = 4 * 1024 * 1024;
const LIMITS = { phMin: 0.08, phMax: 3.5, wMin: 0.15, wMax: 3.0, phKB: 40, wKB: 60 };

const errors = [];
const err = (m) => errors.push(m);

function ffprobeDur(file) {
  const r = spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file], { encoding: 'utf8' });
  if (r.status !== 0) return NaN;
  const d = parseFloat(r.stdout);
  return Number.isFinite(d) ? d : NaN;
}

async function main() {
  /* 1. 数据源（词全集单源，esbuild 打包 8 个数据文件） */
  let phonemes = [];
  let words = [];
  try {
    const data = await loadUniverseData();
    phonemes = data.phonemes ?? [];
    words = (await buildWordUniverse()).words;
  } catch (e) {
    err(`词全集打包失败:\n${e.message ?? e}`);
  }
  if (phonemes.length && phonemes.length !== 48) err(`音标数 ${phonemes.length} ≠ 48`);

  /* 2. manifest */
  if (!fs.existsSync(MANIFEST)) {
    err('缺少 public/audio/manifest.json —— 运行 npm run gen:audio 生成');
  }
  const manifest = fs.existsSync(MANIFEST) ? JSON.parse(fs.readFileSync(MANIFEST, 'utf8')) : null;

  if (manifest && phonemes.length) {
    const ids = phonemes.map((p) => p.id);
    const mIds = manifest.phonemes.map((x) => x.id);
    const miss = ids.filter((id) => !mIds.includes(id));
    const extra = mIds.filter((id) => !ids.includes(id));
    if (miss.length) err(`manifest 缺音素: ${miss.join(' ')}`);
    if (extra.length) err(`manifest 多音素: ${extra.join(' ')}`);
    // 全量词表来自词全集单源（见 scripts/word-universe.mjs 头注）
    const mWords = manifest.words.map((x) => x.word);
    const missW = words.filter((w) => !mWords.includes(w));
    const extraW = mWords.filter((w) => !words.includes(w));
    if (missW.length) err(`manifest 缺例词（${missW.length}）: ${missW.slice(0, 10).join(' ')}${missW.length > 10 ? ' …' : ''}`);
    if (extraW.length) err(`manifest 过期例词（数据已删）: ${extraW.join(' ')}`);
    if (manifest.phonemes.length !== 48) err(`manifest 音素条目 ${manifest.phonemes.length} ≠ 48`);
    if (manifest.words.length !== words.length) err(`manifest 词条目 ${manifest.words.length} ≠ 数据全量 ${words.length}`);

    /* 3. 磁盘文件逐一核验 */
    let total = 0;
    const checkFile = (rel, min, max, kb, tag) => {
      const f = path.join(AUDIO_DIR, rel);
      if (!fs.existsSync(f)) return err(`${tag} 文件缺失: audio/${rel}`);
      const size = fs.statSync(f).size;
      total += size;
      if (size > kb * 1024) err(`${tag} 超限 ${size}B > ${kb}KB: audio/${rel}`);
      const dur = ffprobeDur(f);
      if (!Number.isFinite(dur)) err(`${tag} 无法解码: audio/${rel}`);
      else if (dur < min || dur > max) err(`${tag} 时长 ${dur.toFixed(3)}s ∉ [${min}, ${max}]: audio/${rel}`);
    };
    for (const x of manifest.phonemes) checkFile(x.file, LIMITS.phMin, LIMITS.phMax, LIMITS.phKB, `音素 /${x.id}/`);
    for (const x of manifest.words) checkFile(x.file, LIMITS.wMin, LIMITS.wMax, LIMITS.wKB, `例词 "${x.word}"`);
    if (total > MAX_TOTAL) err(`音频总量 ${(total / 1024).toFixed(0)}KB > ${(MAX_TOTAL / 1024 / 1024).toFixed(1)}MB 上限`);

    /* 目录无孤儿（存在但未入清单的文件） */
    for (const [dir, expect] of [['phonemes', manifest.phonemes], ['words', manifest.words]]) {
      const abs = path.join(AUDIO_DIR, dir);
      const onDisk = fs.existsSync(abs) ? fs.readdirSync(abs).filter((f) => f.endsWith('.mp3')) : [];
      const listed = expect.map((x) => path.basename(x.file));
      const orphans = onDisk.filter((f) => !listed.includes(f));
      if (orphans.length) err(`${dir}/ 孤儿文件（未入 manifest）: ${orphans.slice(0, 5).join(', ')}`);
    }

    /* 4. 生成的运行时模块覆盖完整 */
    if (!fs.existsSync(GEN_MODULE)) {
      err('缺少 src/data/phonemeAudio.ts —— 运行 npm run gen:audio 生成');
    } else {
      const src = fs.readFileSync(GEN_MODULE, 'utf8');
      for (const id of ids) if (!src.includes(JSON.stringify(id))) err(`phonemeAudio.ts 缺音素 id: ${id}`);
      for (const w of words) if (!src.includes(JSON.stringify(w))) err(`phonemeAudio.ts 缺例词: ${w}`);
    }

    if (errors.length) {
      console.error(`✗ 音频门禁 ${errors.length} 项失败:`);
      for (const e of errors) console.error(`  - ${e}`);
      process.exit(1);
    }
    console.log(`✓ 音频门禁通过：音素 ${manifest.phonemes.length}/48 + 例词 ${manifest.words.length}/${words.length}，共 ${(total / 1024).toFixed(0)}KB`);
    return;
  }

  if (errors.length) {
    console.error(`✗ 音频门禁 ${errors.length} 项失败:`);
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
