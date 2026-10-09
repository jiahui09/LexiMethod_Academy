import { useMemo, useState } from 'react';
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
            className={` border-2 p-4 text-left transition-colors duration-200 ${
              dir === d.key
                ? 'border-ink bg-ink'
                : 'border-ink bg-under/50 hover:border-ink'
            }`}
            aria-pressed={dir === d.key}
          >
            <div className={`mb-1 flex items-center gap-1.5 text-sm font-semibold ${dir === d.key ? 'text-milk' : 'text-ink'}`}>
              <ArrowLeftRight size={14} className={dir === d.key ? 'text-milk' : 'text-ink2'} aria-hidden />
              {d.label}
            </div>
            <div className={`text-xs leading-relaxed ${dir === d.key ? 'text-milk' : 'text-ink2'}`}>{d.desc}</div>
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
      <p className="text-xs leading-relaxed text-ink2">
        听音拼写不熟就先写音标再写单词，逐字母反馈。切到「听音拼写训练」分台专门练这条链路。
        {/* 行内试听入口走墨色下划线：蓝色只留给答题与焦点 */}
        <button
          type="button"
          className="ml-2 text-ink underline decoration-rule underline-offset-4 hover:decoration-ink"
          onClick={() => speak('construction')}
        >
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
    <section className=" border-2 border-ink bg-under/60 p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-ink">
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
              className={`ipa min-h-[44px] min-w-[44px] border-2 px-2.5 py-1 text-xs transition-colors duration-200 ${
                p.id === patternId
                  ? 'border-ink bg-ink text-milk'
                  : 'border-ink bg-under/50 text-ink2 hover:border-ink hover:text-ink'
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
        <span
          key={`a-${pat.id}`}
          className="ipa hinge border-2 border-ink bg-under/50 px-6 py-3 text-2xl font-bold text-ink"
        >
          {pat.pattern}
        </span>
        <span key={`l-${pat.id}`} className="h-0.5 w-20 bg-ink" aria-hidden />
        <span
          key={`b-${pat.id}`}
          className="ipa hinge border-2 border-ink bg-under px-6 py-3 text-2xl font-bold text-ink"
        >
          {pat.phoneme}
        </span>
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
            <button
              key={w}
              type="button"
              onClick={() => {
                playSfx('tick');
                speak(w);
              }}
              className="flex items-center gap-3 border-2 border-ink bg-under/50 px-4 py-3 text-left transition-colors hover:border-ink"
              aria-label={`朗读 ${w}`}
            >
              <span className="font-serif text-base font-semibold text-ink">
                {idx >= 0 ? (
                  <>
                    {head}
                    <mark className=" bg-board-pathway/40 px-1 text-ink">{mid}</mark>
                    {tail}
                  </>
                ) : (
                  w
                )}
              </span>
              <span className="ml-auto flex items-center gap-2">
                <AudioWaveform size={14} className="text-ink2" aria-hidden />
                <span className="ipa text-xs text-ink">{pat.phoneme}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* 例外 */}
      {pat.exceptions.length > 0 && (
        <div className=" border-2 border-errata/60 bg-leaf p-4">
          <div className="mb-1.5 flex items-center gap-2 text-xs font-semibold text-errata-deep">
            <AlertTriangle size={13} aria-hidden /> 例外（规则 ≠ 100%）
          </div>
          <div className="flex flex-wrap gap-2 text-sm">
            {pat.exceptions.map((e) => (
              <span key={e} className=" border-2 border-errata/40 bg-under/60 px-3 py-1.5 font-serif text-ink">
                {e}
              </span>
            ))}
          </div>
        </div>
      )}
      <p className="mt-3 text-xs leading-relaxed text-ink2">{pat.rule}</p>
    </section>
  );
}
