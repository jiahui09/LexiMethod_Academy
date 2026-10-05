import { useMemo, useState } from 'react';
import { Headphones, Timer, ListRestart, Info } from 'lucide-react';
import { words } from '@/data/words';
import QuestionRunner from '@/components/practice/QuestionRunner';
import NeonButton from '@/components/ui/NeonButton';
import { listenWriteIpaQ, listenWriteWordQ, shuffleArr } from '@/lib/questionFactory';
import { useProgress } from '@/store/progressStore';
import { useReview } from '@/store/reviewStore';
import { playSfx } from '@/hooks/useSfx';

type Mode = 'ipa-then-word' | 'ipa' | 'word';

const MODES: { key: Mode; label: string; desc: string }[] = [
  { key: 'ipa-then-word', label: '先写音标 → 再写单词', desc: '完整链路：听音 → 音标 → 拼写，逐字母反馈' },
  { key: 'ipa', label: '只写音标', desc: '训练音标速记与重音符号' },
  { key: 'word', label: '只写单词', desc: '训练音节拼写，错误字母红色抖动并显示正确字母' },
];

/** 听音拼写训练 */
export default function DictationTrainer() {
  const [mode, setMode] = useState<Mode>('ipa-then-word');
  const [count, setCount] = useState(6);
  const [seed, setSeed] = useState(1);
  const [onlyTag, setOnlyTag] = useState<string | null>(null);
  const dictationCount = useProgress((s) => s.labDictationCount);
  const mistakes = useReview((s) => s.mistakes);

  const tags = useMemo(() => Array.from(new Set(words.flatMap((w) => w.tags))).slice(0, 10), []);

  const questions = useMemo(() => {
    const pool = onlyTag ? words.filter((w) => w.tags.includes(onlyTag)) : words;
    const chosen = shuffleArr(pool.length ? pool : words).slice(0, count);
    return chosen.flatMap((w) => {
      const list = [];
      if (mode !== 'word') list.push(listenWriteIpaQ(w));
      if (mode !== 'ipa') list.push(listenWriteWordQ(w));
      return list;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, count, seed, onlyTag]);

  const listenMistakes = mistakes.filter((m) => m.type === 'listenWriteWord' || m.type === 'listenWritePhoneme');

  return (
    <div className="flex flex-col gap-6">
      {/* 模式 */}
      <div className="grid gap-2.5 md:grid-cols-3">
        {MODES.map((m) => (
          <button
            key={m.key}
            type="button"
            onClick={() => {
              playSfx('click');
              setMode(m.key);
              setSeed((s) => s + 1);
            }}
            className={`rounded-2xl border p-4 text-left transition-all duration-300 ${
              mode === m.key ? 'border-neon bg-neon/12 shadow-[0_0_22px_rgba(0,229,255,0.28)]' : 'border-white/12 bg-white/[0.04] hover:border-neon/50'
            }`}
            aria-pressed={mode === m.key}
          >
            <div className="mb-1 flex items-center gap-1.5 text-sm font-semibold text-white">
              <Headphones size={14} className={mode === m.key ? 'text-neon' : 'text-slate-400'} aria-hidden />
              {m.label}
            </div>
            <div className="text-xs leading-relaxed text-slate-400">{m.desc}</div>
          </button>
        ))}
      </div>

      {/* 控制条 */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
        <span className="flex items-center gap-1.5 text-xs text-slate-400">
          <Timer size={13} aria-hidden /> 题量
        </span>
        {[4, 6, 10].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => {
              playSfx('tick');
              setCount(n);
              setSeed((s) => s + 1);
            }}
            className={`min-h-[44px] rounded-lg border px-3 py-1 text-xs transition ${
              count === n ? 'border-neon bg-neon/15 text-neon' : 'border-white/12 text-slate-300 hover:border-neon/50'
            }`}
            aria-pressed={count === n}
          >
            {n} 词
          </button>
        ))}
        <span className="mx-1 h-4 w-px bg-white/10" aria-hidden />
        <button
          type="button"
          onClick={() => {
            playSfx('tick');
            setOnlyTag(null);
            setSeed((s) => s + 1);
          }}
          className={`min-h-[44px] rounded-lg border px-3 py-1 text-xs transition ${!onlyTag ? 'border-violet bg-violet/15 text-violet-lit' : 'border-white/12 text-slate-300 hover:border-violet/50'}`}
          aria-pressed={!onlyTag}
        >
          全部词
        </button>
        {tags.slice(0, 5).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => {
              playSfx('tick');
              setOnlyTag(t);
              setSeed((s) => s + 1);
            }}
            className={`min-h-[44px] rounded-lg border px-3 py-1 text-xs transition ${
              onlyTag === t ? 'border-violet bg-violet/15 text-violet-lit' : 'border-white/12 text-slate-300 hover:border-violet/50'
            }`}
            aria-pressed={onlyTag === t}
          >
            {t}
          </button>
        ))}
        <NeonButton
          size="sm"
          variant="ghost"
          className="ml-auto"
          onClick={() => {
            playSfx('reveal');
            setSeed((s) => s + 7);
          }}
        >
          <ListRestart size={13} aria-hidden /> 重新出题
        </NeonButton>
      </div>

      {/* 训练 */}
      <QuestionRunner key={`${mode}-${count}-${seed}-${onlyTag ?? 'all'}`} questions={questions} heading="听音拼写训练" />

      {/* 统计与错题 */}
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <div className="mb-1 flex items-center gap-2 text-xs font-semibold text-neon">
            <Info size={13} aria-hidden /> 训练要点
          </div>
          <ul className="flex flex-col gap-1.5 text-xs leading-relaxed text-slate-400">
            <li>· 慢速听结构 → 常速听流利度；两次播放后再落笔。</li>
            <li>· 先写音标：把声音固化成符号，再映射到拼写，正确率更高。</li>
            <li>· 逐字母核对：错在哪一节，就说明哪个“拼写 ↔ 发音”规则没掌握。</li>
            <li>· 错题会自动进入复习中心，按 1/3/7/14/30 天间隔重现。</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-warn">
            <ListRestart size={13} aria-hidden /> 听写相关错题（{listenMistakes.length}）
          </div>
          <div className="flex max-h-40 flex-col gap-1.5 overflow-y-auto pr-1">
            {listenMistakes.length === 0 && <p className="text-xs text-slate-400">暂无错题，继续保持。</p>}
            {listenMistakes.slice(0, 8).map((m) => (
              <div key={m.id} className="flex flex-wrap items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs">
                <span className="text-slate-400">{m.prompt.slice(0, 26)}</span>
                <span className="ipa text-danger">你的：{m.given || '（空）'}</span>
                <span className="ipa text-success">正确：{m.answer}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-400">累计听写训练：{dictationCount} 次（在题目中作答自动累计）</p>
    </div>
  );
}
