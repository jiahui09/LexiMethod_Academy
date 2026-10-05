import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Dumbbell, ListRestart, BarChart3 } from 'lucide-react';
import type { Question, QuestionType } from '@/types';
import { quizBanks } from '@/data/quizBanks';
import { words } from '@/data/words';
import { phonemes } from '@/data/phonemes';
import { spellingPatterns } from '@/data/spellingPatterns';
import QuestionRunner from '@/components/practice/QuestionRunner';
import PageIntro from '@/components/layout/PageIntro';
import { StaggerGroup, StaggerItem } from '@/components/ui/Cards';
import NeonButton from '@/components/ui/NeonButton';
import { TYPE_LABELS } from '@/lib/answers';
import {
  listenWriteWordQ,
  listenWriteIpaQ,
  syllableQ,
  stressQ,
  contextQ,
  phonemeToSpellingQ,
  spellingToPhonemeQ,
  shuffleArr,
} from '@/lib/questionFactory';
import { useProgress } from '@/store/progressStore';
import { playSfx } from '@/hooks/useSfx';

const TYPES = Object.keys(TYPE_LABELS) as QuestionType[];

/** 每种题型的题库：优先题库文件，缺的用工厂从数据集生成 */
function bankFor(type: QuestionType): Question[] {
  const bank = quizBanks[type] ?? [];
  if (bank.length >= 8) return bank;
  switch (type) {
    case 'listenWriteWord':
      return words.map(listenWriteWordQ);
    case 'listenWritePhoneme':
      return words.map(listenWriteIpaQ);
    case 'syllableSplit':
      return words.map(syllableQ);
    case 'stressPosition':
      return words.map(stressQ);
    case 'contextChoice':
      return words.map((w) => contextQ(w, words));
    case 'phonemeChooseSpelling':
      return phonemes.filter((p) => p.commonSpellings.length > 0).map((p) => phonemeToSpellingQ(p, phonemes));
    case 'spellingChoosePhoneme':
      return spellingPatterns.map((p) => spellingToPhonemeQ(p, spellingPatterns));
    default:
      return bank;
  }
}

/** 互动训练页：11 种题型全覆盖 */
export default function Practice() {
  const [type, setType] = useState<QuestionType | 'mixed'>('mixed');
  const [seed, setSeed] = useState(1);
  const stats = useProgress((s) => s.stats);

  const questions = useMemo(() => {
    if (type !== 'mixed') {
      return shuffleArr(bankFor(type)).slice(0, 8);
    }
    // 综合：每种题型各抽 1 题，覆盖全部 11 种
    return shuffleArr(TYPES.flatMap((t) => shuffleArr(bankFor(t)).slice(0, 1))).slice(0, 11);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, seed]);

  const totalAnswered = TYPES.reduce((sum, t) => sum + (stats[t]?.total ?? 0), 0);
  const totalCorrect = TYPES.reduce((sum, t) => sum + (stats[t]?.correct ?? 0), 0);

  return (
    <div className="flex flex-col gap-6">
      <PageIntro
        crumbs={[{ label: '学习地图', to: '/' }, { label: '互动训练' }]}
        kicker="Practice"
        title="互动训练：11 种题型，练的是方法不是手速"
        desc="听音选音标、看口型猜音标、音标⇄拼写双向、听音写音标/单词（逐字母反馈）、音节划分、重音定位、最小对立对、词缀组装、语境选词 —— 每道题都附带原理讲解，错题自动进复习中心。"
        next={{ label: '复习中心（到期卡片）', to: '/review' }}
      />

      {/* 概览 */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="glass p-5">
          <div className="text-xs uppercase tracking-widest text-slate-400">累计作答</div>
          <div className="font-display text-3xl font-bold text-white tabular-nums">{totalAnswered}</div>
          <div className="text-xs text-slate-400">正确 {totalCorrect}</div>
        </div>
        <div className="glass p-5">
          <div className="text-xs uppercase tracking-widest text-slate-400">总正确率</div>
          <div className="font-display text-3xl font-bold text-neon tabular-nums">
            {totalAnswered ? Math.round((totalCorrect / totalAnswered) * 100) : 0}%
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/8">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-neon to-violet"
              initial={{ width: 0 }}
              animate={{ width: `${totalAnswered ? (totalCorrect / totalAnswered) * 100 : 0}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
        </div>
        <div className="glass p-5">
          <div className="text-xs uppercase tracking-widest text-slate-400">覆盖题型</div>
          <div className="font-display text-3xl font-bold text-success tabular-nums">
            {TYPES.filter((t) => (stats[t]?.total ?? 0) > 0).length}
            <span className="text-base text-slate-400"> / 11</span>
          </div>
          <div className="text-xs text-slate-400">全题型都练过 = 方法闭环</div>
        </div>
      </div>

      {/* 题型选择 */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            playSfx('click');
            setType('mixed');
            setSeed((s) => s + 1);
          }}
          className={`flex min-h-[44px] items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-medium transition-all duration-300 ${
            type === 'mixed' ? 'border-neon bg-neon/18 text-neon shadow-[0_0_16px_rgba(0,229,255,0.3)]' : 'border-white/14 bg-white/5 text-slate-300 hover:border-neon/45'
          }`}
          aria-pressed={type === 'mixed'}
        >
          <Dumbbell size={13} aria-hidden /> 综合（全 11 种）
        </button>
        {TYPES.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => {
              playSfx('tick');
              setType(t);
              setSeed((s) => s + 1);
            }}
            className={`min-h-[44px] rounded-full border px-3.5 py-2 text-xs transition-all duration-300 ${
              type === t ? 'border-violet bg-violet/20 text-white shadow-[0_0_16px_rgba(124,77,255,0.35)]' : 'border-white/14 bg-white/5 text-slate-300 hover:border-violet/50'
            }`}
            aria-pressed={type === t}
          >
            {TYPE_LABELS[t]}
          </button>
        ))}
      </div>

      {/* 题目 */}
      <QuestionRunner key={`${type}-${seed}`} questions={questions} heading={type === 'mixed' ? '综合训练' : TYPE_LABELS[type]} />

      <div className="flex justify-end">
        <NeonButton
          variant="ghost"
          size="sm"
          onClick={() => {
            playSfx('reveal');
            setSeed((s) => s + 1);
          }}
        >
          <ListRestart size={14} aria-hidden /> 换一批题
        </NeonButton>
      </div>

      {/* 分题型成绩 */}
      <section>
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
          <BarChart3 size={15} className="text-neon" aria-hidden /> 分题型成绩
        </div>
        <StaggerGroup className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.04}>
          {TYPES.map((t) => {
            const s = stats[t] ?? { total: 0, correct: 0 };
            const pct = s.total ? Math.round((s.correct / s.total) * 100) : 0;
            return (
              <StaggerItem key={t}>
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="text-slate-300">{TYPE_LABELS[t]}</span>
                    <span className={`tabular-nums ${pct >= 80 ? 'text-success' : pct >= 50 ? 'text-warn' : 'text-slate-400'}`}>
                      {s.total ? `${pct}%` : '未练习'}
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/8">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-neon to-violet"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.7 }}
                    />
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </section>

      <p className="text-xs text-slate-400">
        目标线：单题型正确率 ≥ 80%。达标意味着这套「音 → 形 → 义」通路已自动化，可以换更难的词继续练（实战演练页）。
      </p>
    </div>
  );
}
