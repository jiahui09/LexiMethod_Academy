import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, History, Eye, Shuffle, BookOpenCheck, ArrowRight, Check } from 'lucide-react';
import WordAnalysisWizard from '@/components/analyze/WordAnalysisWizard';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { StaggerGroup, StaggerItem } from '@/components/ui/Cards';
import NeonButton from '@/components/ui/NeonButton';
import { words } from '@/data/words';
import { useProgress } from '@/store/progressStore';
import { playSfx } from '@/hooks/useSfx';
import { useMotionTier } from '@/hooks/useMotionTier';

const QUICK = ['incomprehensible', 'transportation', 'photograph', 'decision'];

/** 实战演练：六步词分析向导（只给提示，不给答案）——辞书纸面版式 */
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
      {/* 卷首题名：面包屑 + 词头 h1（纸面上方绝不做眉标）+ 唯一去向 */}
      <header className="border-b border-rule pb-5">
        <Breadcrumbs tone="paper" items={[{ label: '学习地图', to: '/' }, { label: '实战演练' }]} />
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold leading-tight text-paperink md:text-3xl">
              实战演练：拿一个没学过的词走完 6 步
            </h1>
            <p className="mt-2 max-w-[68ch] text-[15px] leading-[1.85] text-colophon">
              目标不是查到答案，而是练出推导链：定词性 → 划音节与重音 → 拆词根词缀 → 猜词义 → 与词典核对 → 放进语境输出。全程网站只给提示，绝不替你作答。
            </p>
          </div>
          <Link
            to="/feynman"
            className="inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-[3px] border border-rule px-4 py-2.5 text-sm text-paperink transition-colors hover:bg-bone2"
          >
            下一步 · 费曼关：讲一遍 <ArrowRight size={14} aria-hidden />
          </Link>
        </div>
      </header>

      {/* 输入 */}
      <motion.form
        initial={tier === 'off' ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        onSubmit={(e) => {
          e.preventDefault();
          start(input);
        }}
        className="flex flex-wrap items-center gap-3 rounded-[3px] border border-rule bg-bone2/50 p-4"
      >
        <label htmlFor="analyze-input" className="flex items-center gap-2 text-sm text-colophon">
          <Search size={15} className="text-rubric" aria-hidden />
          输入任意单词：
        </label>
        <input
          id="analyze-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="例如：unpredictable / meteorological"
          className="edu-input min-w-[240px] flex-1"
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
      <div className="flex flex-wrap items-center gap-2 text-xs text-colophon">
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
            className="min-h-[44px] rounded-[3px] border border-rule px-3 py-1.5 text-xs text-paperink transition-colors hover:border-cobalt hover:text-cobalt"
          >
            {w}
          </button>
        ))}
        <span className="mx-1 h-4 w-px bg-rule" aria-hidden />
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
            className="min-h-[44px] rounded-[3px] border border-rule px-3 py-1.5 font-serif text-xs text-paperink transition-colors hover:border-cobalt hover:text-cobalt"
          >
            {w.word}
          </button>
        ))}
      </div>

      {/* 向导 */}
      <WordAnalysisWizard key={`${target}-${historyKey}`} wordId={target} />

      {/* 历史记录 */}
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-[3px] border border-rule bg-bone2/50 p-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-paperink">
            <History size={15} className="text-cobalt" aria-hidden /> 分析历史（{analyzed.length}）
          </div>
          <div className="flex flex-wrap gap-2">
            {analyzed.length === 0 && <p className="text-xs text-colophon">完成一次分析后会记录在这里。</p>}
            {analyzed.map((a, i) => (
              <button
                key={`${a.word}-${i}`}
                type="button"
                onClick={() => {
                  playSfx('tick');
                  setInput(a.word);
                  start(a.word);
                }}
                className="flex min-h-[44px] items-center gap-2 rounded-[3px] border border-rule px-3 py-2 text-xs transition-colors hover:border-cobalt"
              >
                <span className="font-serif font-semibold text-paperink">{a.word}</span>
                <span className="text-colophon">{new Date(a.at).toLocaleDateString('zh-CN')}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[3px] border border-rule bg-bone2/50 p-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-paperink">
            <BookOpenCheck size={15} className="text-cobalt" aria-hidden /> 实战检查清单
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
                <div className="flex items-start gap-2 border-t border-rule py-2.5 text-xs text-colophon">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border border-cobalt text-cobalt">
                    <Check size={11} aria-hidden />
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
