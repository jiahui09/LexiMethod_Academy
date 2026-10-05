import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftRight, AudioWaveform, AlertTriangle, Sparkles } from 'lucide-react';
import { spellingPatterns } from '@/data/spellingPatterns';
import { phonemes } from '@/data/phonemes';
import { words } from '@/data/words';
import QuestionRunner from '@/components/practice/QuestionRunner';
import { EduButton } from '@/components/edu';
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
            className={`rounded-[4px] border p-4 text-left transition-colors duration-200 ${
              dir === d.key
                ? 'border-rubric bg-rubric'
                : 'border-rule bg-bone2/50 hover:border-cobalt'
            }`}
            aria-pressed={dir === d.key}
          >
            <div className={`mb-1 flex items-center gap-1.5 text-sm font-semibold ${dir === d.key ? 'text-bone' : 'text-paperink'}`}>
              <ArrowLeftRight size={14} className={dir === d.key ? 'text-bone' : 'text-colophon'} aria-hidden />
              {d.label}
            </div>
            <div className={`text-xs leading-relaxed ${dir === d.key ? 'text-bone' : 'text-colophon'}`}>{d.desc}</div>
          </button>
        ))}
      </div>

      {/* 题目运行器 */}
      <QuestionRunner tone="paper"
        key={`${dir}-${seed}`}
        questions={questions}
        heading={DIRECTIONS.find((d) => d.key === dir)?.label}
      />

      {/* 规则动画：拼写块 → 发音 */}
      <PatternSpotlight />

      <div className="flex justify-end">
        <EduButton size="sm" variant="ghost" onClick={() => setSeed((s) => s + 7)}>
          换一组
        </EduButton>
      </div>
      <p className="text-xs leading-relaxed text-colophon">
        提示：听音拼写不熟？切到「听音拼写训练」标签，先写音标、再写单词，逐字母反馈。
        <button type="button" className="ml-2 text-cobalt underline" onClick={() => speak('construction')}>
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
    <section className="rounded-[4px] border border-rule bg-bone2/60 p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-cobalt">
          <Sparkles size={15} aria-hidden /> 拼写规则动画
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
              className={`ipa min-h-[44px] min-w-[44px] rounded-[4px] border px-2.5 py-1 text-xs transition-colors duration-200 ${
                p.id === patternId
                  ? 'border-rubric bg-rubric text-bone'
                  : 'border-rule bg-bone2/50 text-colophon hover:border-paperink hover:text-paperink'
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
          className="ipa rounded-[4px] border border-rule bg-bone2/50 px-6 py-3 text-2xl font-bold text-paperink"
        >
          {pat.pattern}
        </motion.span>
        <motion.span
          key={`l-${pat.id}`}
          className="h-0.5 w-20 bg-cobalt"
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
          className="ipa rounded-[4px] border border-cobalt bg-cobalt/[0.06] px-6 py-3 text-2xl font-bold text-cobalt"
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
              className="flex items-center gap-3 rounded-[4px] border border-rule bg-bone2/50 px-4 py-3 text-left transition-colors duration-200 hover:border-cobalt"
              aria-label={`朗读 ${w}`}
            >
              <span className="font-serif text-base font-semibold text-paperink">
                {idx >= 0 ? (
                  <>
                    {head}
                    <mark className="rounded-[2px] bg-cobalt/10 px-1 text-cobalt">{mid}</mark>
                    {tail}
                  </>
                ) : (
                  w
                )}
              </span>
              <span className="ml-auto flex items-center gap-2">
                <AudioWaveform size={14} className="text-colophon" aria-hidden />
                <span className="ipa text-xs text-cobalt">{pat.phoneme}</span>
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* 例外 */}
      {pat.exceptions.length > 0 && (
        <div className="rounded-[4px] border border-rubric/35 bg-rubric/[0.06] p-4">
          <div className="mb-1.5 flex items-center gap-2 text-xs font-semibold text-rubric">
            <AlertTriangle size={13} aria-hidden /> 例外（规则 ≠ 100%）
          </div>
          <div className="flex flex-wrap gap-2 text-sm">
            {pat.exceptions.map((e) => (
              <span key={e} className="rounded-[4px] border border-rubric/40 bg-bone2/60 px-3 py-1.5 font-serif text-paperink">
                {e}
              </span>
            ))}
          </div>
        </div>
      )}
      <p className="mt-3 text-xs leading-relaxed text-colophon">{pat.rule}</p>
    </section>
  );
}
