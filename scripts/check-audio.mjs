#!/usr/bin/env node
/**
 * 音频资产门禁（npm run check:audio，已并入 verify）
 *
 * 三方一致性：src/data/phonemes.ts ↔ public/audio/manifest.json ↔ 磁盘文件
 *  - 48 音素 + 45 去重例词全覆盖（id/词、slug、文件路径）
 *  - 每个 mp3 存在、可解码（ffprobe）、时长合理、体积在预算内
 *  - src/data/phonemeAudio.ts 覆盖全部 id 与词（生成物未过期）
 *  - 音频总量 ≤ 1.5MB（全量静态资源 2MB 预算的音频份额）
 *
 * 依赖：node_modules/.bin/esbuild（随 vite）、系统 ffprobe（ffmpeg）
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const AUDIO_DIR = path.join(ROOT, 'public', 'audio');
const MANIFEST = path.join(AUDIO_DIR, 'manifest.json');
const GEN_MODULE = path.join(ROOT, 'src', 'data', 'phonemeAudio.ts');
const MAX_TOTAL = 1.5 * 1024 * 1024;
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
  /* 1. 数据源 */
  const esbuild = path.join(ROOT, 'node_modules', '.bin', 'esbuild');
  if (!fs.existsSync(esbuild)) err('缺少 esbuild（先 npm install）');
  const tmp = path.join(ROOT, '.tmp', 'check-audio-phonemes.mjs');
  fs.mkdirSync(path.dirname(tmp), { recursive: true });
  const r = spawnSync(esbuild, [path.join(ROOT, 'src', 'data', 'phonemes.ts'), '--bundle', '--format=esm', `--outfile=${tmp}`, `--tsconfig=${path.join(ROOT, 'tsconfig.app.json')}`], { encoding: 'utf8' });
  if (r.status !== 0) {
    err(`esbuild 编译 phonemes.ts 失败:\n${r.stderr}`);
  }
  let phonemes = [];
  if (errors.length === 0) {
    phonemes = (await import(`${pathToFileURL(tmp).href}?v=${Date.now()}`)).phonemes;
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
    const words = [...new Set(phonemes.map((p) => p.ttsWord))];
    const mWords = manifest.words.map((x) => x.word);
    const missW = words.filter((w) => !mWords.includes(w));
    if (missW.length) err(`manifest 缺例词: ${missW.join(' ')}`);
    if (manifest.phonemes.length !== 48) err(`manifest 音素条目 ${manifest.phonemes.length} ≠ 48`);

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
    if (total > MAX_TOTAL) err(`音频总量 ${(total / 1024).toFixed(0)}KB > 1536KB 上限`);

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
