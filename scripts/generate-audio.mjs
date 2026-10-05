#!/usr/bin/env node
/**
 * 音标 / 例词 离线音频生成器
 * ============================================================
 * 输入：src/data/phonemes.ts（48 音标 + ttsWord 例词，经 esbuild 编译后导入）
 * 引擎：piper-tts（工作区 venv .venv-audio）+ en_US-lessac-medium（.models/）
 * 输出：public/audio/phonemes/<slug>.mp3   48 个孤立音素
 *       public/audio/words/<word>.mp3      全部例词 + 最小对立对（去重，约 220 词）
 *       public/audio/manifest.json         溯源清单（时长/响度/许可）
 *       src/data/phonemeAudio.ts           运行时映射模块（勿手改）
 *
 * 用法：
 *   node scripts/generate-audio.mjs --setup   首次：建 venv + 装 piper + 下载模型（校验 md5）
 *   node scripts/generate-audio.mjs           增量生成（已有 mp3 直接复用并重新计量）
 *   node scripts/generate-audio.mjs --force   全量重生成（换音色/换模型后必须）
 *
 * 依赖：python3、ffmpeg/ffprobe、node_modules/.bin/esbuild（随 vite 自带）
 */
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const VENV = path.join(ROOT, '.venv-audio');
const PIPER_PY = path.join(VENV, 'bin', 'python');
const MODEL = path.join(ROOT, '.models', 'en_US-lessac-medium.onnx');
const MODEL_JSON = `${MODEL}.json`;
/** voices.json 中 en_US-lessac-medium.onnx 的官方 md5 */
const MODEL_MD5 = '2fc642b535197b6305c7c8f92dc8b24f';
const MODEL_URL = 'https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/lessac/medium/en_US-lessac-medium.onnx';
const MODEL_JSON_URL = `${MODEL_URL}.json`;

const OUT_PH_DIR = path.join(ROOT, 'public', 'audio', 'phonemes');
const OUT_W_DIR = path.join(ROOT, 'public', 'audio', 'words');
const TMP = path.join(ROOT, '.tmp', 'audio');
const OUT_PH_REL = 'public/audio/phonemes';
const OUT_W_REL = 'public/audio/words';

/** 音标 id → ASCII 文件名 slug（48 项，改这里后重新生成） */
const SLUG = {
  'iː': 'ii', 'ɪ': 'ih', e: 'eh', æ: 'ae', 'ɜː': 'er', 'ə': 'ax',
  'ɑː': 'aa', 'ɒ': 'ao', 'ɔː': 'aw', ʊ: 'ub', 'uː': 'uu', 'ʌ': 'av',
  eɪ: 'ei', aɪ: 'ai', 'ɔɪ': 'oi', 'əʊ': 'ou', aʊ: 'au', 'ɪə': 'ier', eə: 'ear', 'ʊə': 'uer',
  p: 'p', b: 'b', t: 't', d: 'd', k: 'k', g: 'g', f: 'f', v: 'v', 'θ': 'th', 'ð': 'dh',
  s: 's', z: 'z', 'ʃ': 'sh', 'ʒ': 'zh', h: 'h', 'tʃ': 'ch', 'dʒ': 'jh', m: 'm', n: 'n',
  'ŋ': 'ng', l: 'l', r: 'r', w: 'w', j: 'y', tr: 'tr', dr: 'dr', ts: 'ts', dz: 'dz',
};

/* ---------------- 管线参数（与 NOTICE-AUDIO.md 同步） ---------------- */
const TARGET_MEAN_DB = -16;   // 归一化目标响度（mean_volume）
const VOLUME_CLAMP = 12;      // 增益修正上限 ±dB
const TRIM_HEAD = '0.03';     // 裁剪后保留头/尾静音（s）
const TRIM_TAIL = '0.03';
const FINAL_PAD = '0.05';     // 编码前追加尾部静音（s）
const MIN_PH_DUR = 0.08, MAX_PH_DUR = 3.5;
const MIN_W_DUR = 0.15, MAX_W_DUR = 3.0;
const MEAN_DB_MIN = -26, MEAN_DB_MAX = -6;

/* ---------------- 小工具 ---------------- */
const log = (...a) => console.log(...a);
const die = (msg) => { console.error(`\n✗ ${msg}`); process.exit(1); };

function sh(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, { encoding: 'utf8', cwd: ROOT, ...opts });
  if (r.status !== 0) {
    throw new Error(`${cmd} ${args.join(' ')}\n${r.stderr || r.stdout || ''}`);
  }
  return r.stdout ?? '';
}

function md5(file) {
  return sh('md5sum', [file]).trim().split(/\s+/)[0];
}

function ffprobeDur(file) {
  return parseFloat(sh('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file]));
}

function measure(file) {
  // volumedetect 统计打在 stderr（stdout 为空）
  const r = spawnSync('ffmpeg', ['-i', file, '-af', 'volumedetect', '-f', 'null', '-'], { encoding: 'utf8', cwd: ROOT });
  const out = `${r.stdout ?? ''}${r.stderr ?? ''}`;
  const mean = out.match(/mean_volume:\s*(-?[\d.]+)\s*dB/);
  const max = out.match(/max_volume:\s*(-?[\d.]+)\s*dB/);
  return { mean: mean ? parseFloat(mean[1]) : -91, max: max ? parseFloat(max[1]) : -91 };
}

/* ---------------- --setup：venv + 模型 ---------------- */
function setup() {
  log('▸ --setup：准备生成环境…');
  if (!fs.existsSync(PIPER_PY)) {
    log('  · 创建 .venv-audio …');
    sh('python3', ['-m', 'venv', VENV]);
  }
  if (spawnSync(PIPER_PY, ['-c', 'import piper'], { stdio: 'ignore' }).status !== 0) {
    log('  · pip install piper-tts …');
    sh(PIPER_PY, ['-m', 'pip', 'install', '--no-cache-dir', '--quiet', 'piper-tts']);
  }
  if (!fs.existsSync(MODEL) || md5(MODEL) !== MODEL_MD5) {
    log('  · 下载模型 en_US-lessac-medium（63MB）…');
    fs.mkdirSync(path.dirname(MODEL), { recursive: true });
    sh('curl', ['-sL', '--connect-timeout', '20', '-o', MODEL, MODEL_URL]);
    const got = md5(MODEL);
    if (got !== MODEL_MD5) {
      fs.rmSync(MODEL, { force: true });
      die(`模型 md5 不符（期望 ${MODEL_MD5}，实得 ${got}），已删除请重试`);
    }
  }
  if (!fs.existsSync(MODEL_JSON)) sh('curl', ['-sL', '-o', MODEL_JSON, MODEL_JSON_URL]);
  log('✓ 环境就绪');
}

/* ---------------- 主流程 ---------------- */
async function compilePhonemes() {
  const esbuild = path.join(ROOT, 'node_modules', '.bin', 'esbuild');
  if (!fs.existsSync(esbuild)) die('缺少 esbuild（node_modules/.bin/esbuild），先 npm install');
  const outFile = path.join(TMP, 'phonemes.mjs');
  fs.mkdirSync(TMP, { recursive: true });
  sh(esbuild, [
    path.join(ROOT, 'src', 'data', 'phonemes.ts'),
    '--bundle', '--format=esm', `--outfile=${outFile}`,
    `--tsconfig=${path.join(ROOT, 'tsconfig.app.json')}`,
  ]);
  const mod = await import(`${pathToFileURL(outFile).href}?v=${Date.now()}`);
  return mod.phonemes;
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes('--setup')) setup();

  if (!fs.existsSync(PIPER_PY)) die(`缺少 ${PIPER_PY} —— 先运行: node scripts/generate-audio.mjs --setup`);
  if (!fs.existsSync(MODEL)) die(`缺少模型 ${MODEL} —— 先运行: node scripts/generate-audio.mjs --setup`);
  for (const bin of ['ffmpeg', 'ffprobe']) {
    if (spawnSync(bin, ['-version'], { stdio: 'ignore' }).status !== 0) die(`缺少 ${bin}`);
  }

  /* 1. 数据校验 */
  const phonemes = await compilePhonemes();
  if (phonemes.length !== 48) die(`音标数量 ${phonemes.length} ≠ 48`);
  const ids = phonemes.map((p) => p.id);
  if (new Set(ids).size !== 48) die('音标 id 有重复');
  const missingSlug = ids.filter((id) => !SLUG[id]);
  if (missingSlug.length) die(`SLUG 缺项: ${missingSlug.join(' ')}`);
  const slugs = Object.values(SLUG);
  if (new Set(slugs).size !== 48) die('SLUG 值有重复');
  const noWord = phonemes.filter((p) => !p.ttsWord).map((p) => p.id);
  if (noWord.length) die(`缺 ttsWord: ${noWord.join(' ')}`);

  /* 2. 增量批量合成（piper 单进程） */
  fs.rmSync(TMP, { recursive: true, force: true });
  fs.mkdirSync(TMP, { recursive: true });
  fs.mkdirSync(OUT_PH_DIR, { recursive: true });
  fs.mkdirSync(OUT_W_DIR, { recursive: true });

  // 全量词表：ttsWord + exampleWords + 最小对立对（教学里所有会被朗读的词）
  const uniqueWords = [
    ...new Set(
      phonemes
        .flatMap((p) => [p.ttsWord, ...p.exampleWords, ...(p.minimalPairs ?? []).flatMap((x) => [x.a, x.b])])
        .filter(Boolean),
    ),
  ];
  for (const w of uniqueWords) {
    if (!/^[a-z]+$/.test(w)) die(`词表含非 a-z 字符: ${JSON.stringify(w)}`);
  }

  // --force / 模型变更 / 无历史清单 → 全量重生成；否则只合成缺失文件
  const MANIFEST_PATH = path.join(ROOT, 'public', 'audio', 'manifest.json');
  const old = fs.existsSync(MANIFEST_PATH) ? JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8')) : null;
  const force = args.includes('--force') || !old || old.engine?.modelMd5 !== MODEL_MD5;
  const needPh = phonemes.filter((p) => force || !fs.existsSync(path.join(OUT_PH_DIR, `${SLUG[p.id]}.mp3`)));
  const needW = uniqueWords.filter((w) => force || !fs.existsSync(path.join(OUT_W_DIR, `${w}.mp3`)));

  const items = [
    ...needPh.map((p) => ({ out: path.join(TMP, `ph_${SLUG[p.id]}.wav`), text: `[[${p.id}]]` })),
    ...needW.map((w) => ({ out: path.join(TMP, `w_${w}.wav`), text: w })),
  ];
  log(`▸ 词表 ${uniqueWords.length} 词；本次合成 ${items.length} 条（音素 ${needPh.length}/48 + 词 ${needW.length}${force ? '，全量' : '，增量'}）…`);
  if (items.length) {
    const spec = JSON.stringify({ model: MODEL, config: MODEL_JSON, items });
    // cwd=TMP：piper/espeak 会在进程工作目录落会话残渣（如 :memory:.ses），别污染仓库根
    const r = spawnSync(PIPER_PY, [path.join(ROOT, 'scripts', 'piper_batch.py')], {
      input: spec, encoding: 'utf8', cwd: TMP, maxBuffer: 32 * 1024 * 1024,
    });
    if (r.status !== 0) die(`piper 批量合成失败:\n${r.stderr}`);
    const batch = JSON.parse(r.stdout.trim());
    if (batch.errors.length) die(`合成失败:\n${batch.errors.map((e) => `${e.out}: ${e.error}`).join('\n')}`);
  } else {
    log('  · 全部命中缓存，无需合成');
  }

  /* 3. 修剪 + 响度归一 + 编码 mp3 + 校验 */
  const encode = (rawWav, outMp3) => {
    const trimmed = `${rawWav}.t.wav`;
    sh('ffmpeg', ['-y', '-v', 'error', '-i', rawWav, '-af',
      `silenceremove=start_periods=1:start_threshold=-45dB:start_silence=${TRIM_HEAD},areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=${TRIM_TAIL},areverse`,
      trimmed]);
    const { mean } = measure(trimmed);
    const delta = Math.max(-VOLUME_CLAMP, Math.min(VOLUME_CLAMP, TARGET_MEAN_DB - mean)).toFixed(1);
    sh('ffmpeg', ['-y', '-v', 'error', '-i', trimmed, '-af',
      `volume=${delta}dB,alimiter=limit=0.89,apad=pad_dur=${FINAL_PAD}`,
      '-ac', '1', '-ar', '22050', '-b:a', '64k', outMp3]);
    const dur = ffprobeDur(outMp3);
    const after = measure(outMp3);
    return { dur, meanDb: after.mean, bytes: fs.statSync(outMp3).size };
  };

  const failures = [];
  const phResults = [], wResults = [];
  const check = (tag, res, minD, maxD) => {
    if (!(res.dur >= minD && res.dur <= maxD)) failures.push(`${tag} 时长 ${res.dur.toFixed(3)}s ∉ [${minD}, ${maxD}]`);
    else if (!(res.meanDb >= MEAN_DB_MIN && res.meanDb <= MEAN_DB_MAX)) failures.push(`${tag} 响度 ${res.meanDb}dB ∉ [${MEAN_DB_MIN}, ${MEAN_DB_MAX}]`);
    else return true;
    return false;
  };
  /** 增量路径：wav 未合成（已有 mp3）→ 直接对现文件计量，同样过校验 */
  const measureExisting = (mp3) => ({ dur: ffprobeDur(mp3), meanDb: measure(mp3).mean, bytes: fs.statSync(mp3).size });

  for (const p of phonemes) {
    const slug = SLUG[p.id];
    const out = path.join(OUT_PH_DIR, `${slug}.mp3`);
    const wav = path.join(TMP, `ph_${slug}.wav`);
    const res = fs.existsSync(wav) ? encode(wav, out) : fs.existsSync(out) ? measureExisting(out) : null;
    if (!res) {
      failures.push(`音素 /${p.id}/ 合成与缓存均缺失`);
      continue;
    }
    if (check(`音素 /${p.id}/`, res, MIN_PH_DUR, MAX_PH_DUR)) {
      phResults.push({ id: p.id, slug, file: `phonemes/${slug}.mp3`, durationMs: Math.round(res.dur * 1000), meanDb: res.meanDb });
    }
  }
  for (const w of uniqueWords) {
    const out = path.join(OUT_W_DIR, `${w}.mp3`);
    const wav = path.join(TMP, `w_${w}.wav`);
    const res = fs.existsSync(wav) ? encode(wav, out) : fs.existsSync(out) ? measureExisting(out) : null;
    if (!res) {
      failures.push(`词 "${w}" 合成与缓存均缺失`);
      continue;
    }
    if (check(`例词 "${w}"`, res, MIN_W_DUR, MAX_W_DUR)) {
      wResults.push({ word: w, file: `words/${w}.mp3`, durationMs: Math.round(res.dur * 1000), meanDb: res.meanDb });
    }
  }
  if (failures.length) die(`校验失败 ${failures.length} 项:\n  ${failures.join('\n  ')}`);

  /* 4. manifest + 运行时映射模块 */
  const manifest = {
    generatedAt: new Date().toISOString(),
    engine: { tts: 'piper-tts', model: 'en_US-lessac-medium', modelMd5: MODEL_MD5, sampleRate: 22050, bitrate: '64k', phonemeInput: 'espeak [[IPA]]' },
    license: {
      model: 'rhasspy/piper-voices（HuggingFace 卡片标注 MIT）',
      dataset: 'Lessac BLIZZARD 2013（CSTR/Lessac 研究许可）',
      usage: '个人非商业教学用途；商用前须更换音色并重新生成（NOTICE-AUDIO.md）',
    },
    phonemes: phResults,
    words: wResults,
  };
  fs.writeFileSync(path.join(ROOT, 'public', 'audio', 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);

  const ts = `// 自动生成：scripts/generate-audio.mjs（npm run gen:audio）—— 手改无效
// 音标/例词离线音频映射；文件位于 public/audio/，与页面同源、无外部请求。

/** 音标 id → 音频 slug（public/audio/phonemes/<slug>.mp3） */
export const PHONEME_AUDIO: Record<string, string> = {
${phResults.map((r) => `  ${JSON.stringify(r.id)}: ${JSON.stringify(r.slug)},`).join('\n')}
};

/** 例词 → 音频（public/audio/words/<word>.mp3；词本身即文件名） */
export const WORD_AUDIO: Record<string, string> = {
${wResults.map((r) => `  ${JSON.stringify(r.word)}: ${JSON.stringify(r.word)},`).join('\n')}
};

/** 音标离线音频 URL；无映射返回 null（调用方回退浏览器 TTS） */
export function phonemeAudioUrl(id: string): string | null {
  const slug = PHONEME_AUDIO[id];
  return slug ? \`\${import.meta.env.BASE_URL}audio/phonemes/\${slug}.mp3\` : null;
}

/** 例词离线音频 URL；无映射返回 null（调用方回退浏览器 TTS） */
export function wordAudioUrl(word: string): string | null {
  const w = WORD_AUDIO[word];
  return w ? \`\${import.meta.env.BASE_URL}audio/words/\${w}.mp3\` : null;
}
`;
  fs.writeFileSync(path.join(ROOT, 'src', 'data', 'phonemeAudio.ts'), ts);

  /* 5. 汇总 */
  const totalBytes = [...phResults, ...wResults].reduce((s, r) => s + (fs.statSync(path.join(ROOT, 'public', 'audio', r.file)).size), 0);
  log(`✓ 生成完成：音素 ${phResults.length}/48 + 例词 ${wResults.length}/${uniqueWords.length}，合计 ${(totalBytes / 1024).toFixed(0)}KB`);
  log(`  · ${OUT_PH_REL}/  ${OUT_W_REL}/  manifest.json`);
  log(`  · src/data/phonemeAudio.ts（运行时映射）`);
}

main().catch((e) => { console.error(e); process.exit(1); });
