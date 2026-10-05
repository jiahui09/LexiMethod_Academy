import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, History, Eye, Shuffle, BookOpenCheck } from 'lucide-react';
import WordAnalysisWizard from '@/components/analyze/WordAnalysisWizard';
import PageIntro from '@/components/layout/PageIntro';
import { StaggerGroup, StaggerItem } from '@/components/ui/Cards';
import NeonButton from '@/components/ui/NeonButton';
import { words } from '@/data/words';
import { useProgress } from '@/store/progressStore';
import { playSfx } from '@/hooks/useSfx';
import { useMotionTier } from '@/hooks/useMotionTier';

const QUICK = ['incomprehensible', 'transportation', 'photograph', 'decision'];

/** 实战演练：六步词分析向导（只给提示，不给答案） */
export default function Analyze() {
  const tier = useMotionTier();
  const [input, setInput] = useState('');
  const [target, setTarget] = useState('incomprehensible');
  const [historyKey, setHistoryKey] = useState(0);
  const analyzed = useProgress((s) => s.analyzedWords);

  const start = (raw: string) => {
    const w = raw.trim().toLowerCase().replace(/[^a-z-]/g, '');
    if (!w) return;
    playSfx('reveal');
    setTarget(w);
    setHistoryKey((k) => k + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const suggestions = useMemo(() => shuffleSeeded(words.map((w) => w.word)), []);

  return (
    <div className="flex flex-col gap-6">
      <PageIntro
        crumbs={[{ label: '学习地图', to: '/' }, { label: '实战演练' }]}
        kicker="Real-world Drill"
        title="实战演练：拿一个没学过的词走完 6 步"
        desc="目标不是查到答案，而是练出推导链：定词性 → 划音节与重音 → 拆词根词缀 → 猜词义 → 与词典核对 → 放进语境输出。全程网站只给提示，绝不替你作答。"
        next={{ label: '费曼关：讲一遍', to: '/feynman' }}
      />

      {/* 输入 */}
      <motion.form
        initial={tier === 'off' ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        onSubmit={(e) => {
          e.preventDefault();
          start(input);
        }}
        className="glass flex flex-wrap items-center gap-3 p-4"
      >
        <label htmlFor="analyze-input" className="flex items-center gap-2 text-sm text-slate-300">
          <Search size={15} className="text-neon" aria-hidden />
          输入任意单词：
        </label>
        <input
          id="analyze-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="例如：unpredictable / meteorological"
          className="input-neon min-w-[240px] flex-1"
          autoComplete="off"
          spellCheck={false}
        />
        <NeonButton type="submit">开始分析</NeonButton>
        <NeonButton
          type="button"
          variant="ghost"
          onClick={() => {
            playSfx('tick');
            const w = suggestions[Math.floor(Math.random() * suggestions.length)];
            setInput(w);
            start(w);
          }}
        >
          <Shuffle size={14} aria-hidden /> 随机来一个
        </NeonButton>
      </motion.form>

      {/* 快捷词 */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <Eye size={13} aria-hidden /> 课程里的实战词：
        </span>
        {QUICK.map((w) => (
          <button
            key={w}
            type="button"
            onClick={() => {
              playSfx('tick');
              setInput(w);
              start(w);
            }}
            className="min-h-[44px] rounded-lg border border-neon/35 bg-neon/[0.08] px-3 py-1.5 text-xs text-neon transition hover:border-neon/70"
          >
            {w}
          </button>
        ))}
        <span className="mx-1 h-4 w-px bg-white/10" aria-hidden />
        <span>或从词库挑：</span>
        {words.slice(0, 6).map((w) => (
          <button
            key={w.id}
            type="button"
            onClick={() => {
              playSfx('tick');
              setInput(w.word);
              start(w.word);
            }}
            className="min-h-[44px] rounded-lg border border-violet/35 bg-violet/[0.08] px-3 py-1.5 text-xs text-violet-lit transition hover:border-violet/70"
          >
            {w.word}
          </button>
        ))}
      </div>

      {/* 向导 */}
      <WordAnalysisWizard key={`${target}-${historyKey}`} wordId={target} />

      {/* 历史记录 */}
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
            <History size={15} className="text-pink-lit" aria-hidden /> 分析历史（{analyzed.length}）
          </div>
          <div className="flex flex-wrap gap-2">
            {analyzed.length === 0 && <p className="text-xs text-slate-400">完成一次分析后会记录在这里。</p>}
            {analyzed.map((a, i) => (
              <button
                key={`${a.word}-${i}`}
                type="button"
                onClick={() => {
                  playSfx('tick');
                  setInput(a.word);
                  start(a.word);
                }}
                className="flex min-h-[44px] items-center gap-2 rounded-xl border border-white/12 bg-white/[0.05] px-3 py-2 text-xs transition hover:border-pink/60"
              >
                <span className="font-semibold text-white">{a.word}</span>
                <span className="text-slate-400">{new Date(a.at).toLocaleDateString('zh-CN')}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
            <BookOpenCheck size={15} className="text-success" aria-hidden /> 实战检查清单
          </div>
          <StaggerGroup className="grid gap-2" stagger={0.05}>
            {[
              '能只看音标就大致读对，不靠字母挨个念',
              '能说出重音位置，并用重音区别词性（record / record）',
              '能把词拆成 前缀+词根+后缀 并解释每部分',
              '能先猜出词义，再与词典核对（命中 ≥ 60%）',
              '能把新词放进自己造的句子里，完成一次输出',
            ].map((t, i) => (
              <StaggerItem key={i}>
                <div className="flex items-start gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-xs text-slate-300">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-success/50 text-xs text-success">
                    ✓
                  </span>
                  {t}
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>
    </div>
  );
}

function shuffleSeeded(arr: string[]): string[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
