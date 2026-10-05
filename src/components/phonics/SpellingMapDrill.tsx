import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftRight, AudioWaveform, AlertTriangle, Sparkles } from 'lucide-react';
import { spellingPatterns } from '@/data/spellingPatterns';
import { phonemes } from '@/data/phonemes';
import { words } from '@/data/words';
import QuestionRunner from '@/components/practice/QuestionRunner';
import NeonButton from '@/components/ui/NeonButton';
import { phonemeToSpellingQ, spellingToPhonemeQ, syllableQ, stressQ, listenWriteIpaQ } from '@/lib/questionFactory';
import { shuffleArr } from '@/lib/questionFactory';
import { useSpeech } from '@/hooks/useSpeech';
import { playSfx } from '@/hooks/useSfx';

type Direction = 'p2s' | 's2p' | 'mixed' | 'full';

const DIRECTIONS: { key: Direction; label: string; desc: string }[] = [
  { key: 'p2s', label: '音标 → 字母组合', desc: '给出 /ʃn/，选出 -tion / -sion / -cian' },
  { key: 's2p', label: '字母组合 → 音标', desc: '给出 -tion，选出 /ʃn/ / /tʃən/ / /ʃən/' },
  { key: 'mixed', label: '双向综合', desc: '两个方向随机混合' },
  { key: 'full', label: '音节 + 重音 + 拼写', desc: '先划音节，再标重音，最后匹配拼写' },
];

/** 音标拼写对应训练（双向）+ 规则动画 */
export default function SpellingMapDrill() {
  const [dir, setDir] = useState<Direction>('mixed');
  const [seed, setSeed] = useState(1);
  const { speak } = useSpeech();

  const questions = useMemo(() => {
    const rng = seed;
    if (dir === 'p2s') {
      return shuffleArr(phonemes)
        .slice(0, 8)
        .map((p) => phonemeToSpellingQ(p, phonemes));
    }
    if (dir === 's2p') {
      return shuffleArr(spellingPatterns)
        .slice(0, 8)
        .map((p) => spellingToPhonemeQ(p, spellingPatterns));
    }
    if (dir === 'full') {
      const w = shuffleArr(words).slice(0, 3);
      return w.flatMap((word) => [syllableQ(word), stressQ(word), listenWriteIpaQ(word)]).slice(0, 9);
    }
    // mixed
    const a = phonemeToSpellingQ(shuffleArr(phonemes)[rng % phonemes.length], phonemes);
    const b = spellingToPhonemeQ(shuffleArr(spellingPatterns)[rng % spellingPatterns.length], spellingPatterns);
    const c = phonemeToSpellingQ(shuffleArr(phonemes)[(rng * 3) % phonemes.length], phonemes);
    const d = spellingToPhonemeQ(shuffleArr(spellingPatterns)[(rng * 5) % spellingPatterns.length], spellingPatterns);
    return [a, b, c, d];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dir, seed]);

  return (
    <div className="flex flex-col gap-6">
      {/* 方向选择 */}
      <div className="grid gap-2.5 md:grid-cols-4">
        {DIRECTIONS.map((d) => (
          <button
            key={d.key}
            type="button"
            onClick={() => {
              playSfx('click');
              setDir(d.key);
              setSeed((s) => s + 1);
            }}
            className={`rounded-2xl border p-4 text-left transition-all duration-300 ${
              dir === d.key
                ? 'border-neon bg-neon/12 shadow-[0_0_22px_rgba(0,229,255,0.28)]'
                : 'border-white/12 bg-white/[0.04] hover:border-neon/50'
            }`}
            aria-pressed={dir === d.key}
          >
            <div className="mb-1 flex items-center gap-1.5 text-sm font-semibold text-white">
              <ArrowLeftRight size={14} className={dir === d.key ? 'text-neon' : 'text-slate-400'} aria-hidden />
              {d.label}
            </div>
            <div className="text-xs leading-relaxed text-slate-400">{d.desc}</div>
          </button>
        ))}
      </div>

      {/* 题目运行器 */}
      <QuestionRunner
        key={`${dir}-${seed}`}
        questions={questions}
        heading={DIRECTIONS.find((d) => d.key === dir)?.label}
      />

      {/* 规则动画：拼写块 → 发音 */}
      <PatternSpotlight />

      <div className="flex justify-end">
        <NeonButton size="sm" variant="ghost" onClick={() => setSeed((s) => s + 7)}>
          换一组 ↻
        </NeonButton>
      </div>
      <p className="text-xs text-slate-400">
        提示：听音拼写不熟？切到「听音拼写训练」标签，先写音标、再写单词，逐字母反馈。
        <button type="button" className="ml-2 text-neon underline" onClick={() => speak('construction')}>
          试听 construction
        </button>
      </p>
    </div>
  );
}

/** 规则聚焦：高亮拼写块 + 同规则词连线 + 例外 */
function PatternSpotlight() {
  const [patternId, setPatternId] = useState(spellingPatterns[0]?.id ?? '');
  const pat = spellingPatterns.find((p) => p.id === patternId) ?? spellingPatterns[0];
  const { speak } = useSpeech();
  if (!pat) return null;

  return (
    <section className="rounded-3xl border border-white/12 bg-white/[0.04] p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <Sparkles size={15} className="text-pink-lit" aria-hidden /> 拼写规则动画
        </div>
        <div className="flex flex-wrap gap-1.5">
          {spellingPatterns.slice(0, 10).map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                playSfx('tick');
                setPatternId(p.id);
              }}
              className={`ipa min-h-[44px] min-w-[44px] rounded-lg border px-2.5 py-1 text-xs transition ${
                p.id === patternId ? 'border-pink bg-pink/18 text-pink-lit' : 'border-white/12 bg-white/5 text-slate-300 hover:border-pink/50'
              }`}
              aria-pressed={p.id === patternId}
            >
              {p.pattern}
            </button>
          ))}
        </div>
      </div>

      {/* 拼写 → 发音 */}
      <div className="mb-4 flex flex-wrap items-center justify-center gap-4">
        <motion.span
          key={`a-${pat.id}`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          className="ipa rounded-2xl border border-pink/50 bg-pink/12 px-6 py-3 text-2xl font-bold text-white shadow-[0_0_24px_rgba(255,77,157,0.3)]"
        >
          {pat.pattern}
        </motion.span>
        <motion.span
          key={`l-${pat.id}`}
          className="h-0.5 w-20 rounded-full bg-gradient-to-r from-pink to-neon"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ originX: 0 }}
        />
        <motion.span
          key={`b-${pat.id}`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22, delay: 0.35 }}
          className="ipa rounded-2xl border border-neon/50 bg-neon/12 px-6 py-3 text-2xl font-bold text-white shadow-[0_0_24px_rgba(0,229,255,0.3)]"
        >
          {pat.phoneme}
        </motion.span>
      </div>

      {/* 同规则词高亮 */}
      <div className="mb-3 grid gap-2 md:grid-cols-2">
        {pat.examples.map((w, i) => {
          const idx = w.toLowerCase().indexOf(pat.pattern.replace('-', '').toLowerCase());
          const core = pat.pattern.replace('-', '');
          const head = idx >= 0 ? w.slice(0, idx + (pat.pattern.startsWith('-') ? 0 : 0)) : w;
          const tail = idx >= 0 ? w.slice(idx + core.length) : '';
          const mid = idx >= 0 ? w.slice(idx, idx + core.length) : '';
          return (
            <motion.button
              key={w}
              type="button"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.08 }}
              onClick={() => {
                playSfx('tick');
                speak(w);
              }}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left transition hover:border-neon/50"
              aria-label={`朗读 ${w}`}
            >
              <span className="font-display text-base font-semibold text-white">
                {idx >= 0 ? (
                  <>
                    {head}
                    <mark className="rounded bg-pink/20 px-1 text-pink-lit">{mid}</mark>
                    {tail}
                  </>
                ) : (
                  w
                )}
              </span>
              <span className="ml-auto flex items-center gap-2">
                <AudioWaveform size={14} className="text-neon" aria-hidden />
                <span className="ipa text-xs text-neon">{pat.phoneme}</span>
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* 例外 */}
      {pat.exceptions.length > 0 && (
        <div className="rounded-2xl border border-warn/35 bg-warn/[0.07] p-4">
          <div className="mb-1.5 flex items-center gap-2 text-xs font-semibold text-warn">
            <AlertTriangle size={13} aria-hidden /> 例外（规则 ≠ 100%）
          </div>
          <div className="flex flex-wrap gap-2 text-sm">
            {pat.exceptions.map((e) => (
              <span key={e} className="rounded-lg border border-warn/30 bg-warn/10 px-3 py-1.5 text-[#FFE7BD]">
                {e}
              </span>
            ))}
          </div>
        </div>
      )}
      <p className="mt-3 text-xs leading-relaxed text-slate-400">{pat.rule}</p>
    </section>
  );
}
