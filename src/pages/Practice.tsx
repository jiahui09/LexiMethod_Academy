import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Dumbbell, ListRestart, BarChart3, Check, X } from 'lucide-react';
import type { Question, QuestionType } from '@/types';
import { quizBanks } from '@/data/quizBanks';
import { words } from '@/data/words';
import { phonemes } from '@/data/phonemes';
import { spellingPatterns } from '@/data/spellingPatterns';
import QuestionRunner from '@/components/practice/QuestionRunner';
import PageIntro from '@/components/layout/PageIntro';
import { StaggerGroup, StaggerItem } from '@/components/ui/Cards';
import { EduButton } from '@/components/edu';
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
        title="互动训练：11 种题型，练的是方法不是手速"
        desc="听音选音标、看口型猜音标、音标⇄拼写双向、听音写音标/单词（逐字母反馈）、音节划分、重音定位、最小对立对、词缀组装、语境选词 —— 每道题都附带原理讲解，错题自动进复习中心。"
        next={{ label: '复习中心（到期卡片）', to: '/review' }}
      />

      {/* 概览 */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-[3px] border border-rule bg-bone2/50 p-5">
          <div className="text-xs text-colophon">累计作答</div>
          <div className="font-serif text-3xl font-bold text-paperink tabular-nums">{totalAnswered}</div>
          <div className="text-xs text-colophon">正确 {totalCorrect}</div>
        </div>
        <div className="rounded-[3px] border border-rule bg-bone2/50 p-5">
          <div className="text-xs text-colophon">总正确率</div>
          <div className="font-serif text-3xl font-bold text-cobalt tabular-nums">
            {totalAnswered ? Math.round((totalCorrect / totalAnswered) * 100) : 0}%
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-rule">
            <motion.div
              className="h-full rounded-full bg-cobalt"
              initial={{ width: 0 }}
              animate={{ width: `${totalAnswered ? (totalCorrect / totalAnswered) * 100 : 0}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
        </div>
        <div className="rounded-[3px] border border-rule bg-bone2/50 p-5">
          <div className="text-xs text-colophon">覆盖题型</div>
          <div className="font-serif text-3xl font-bold text-paperink tabular-nums">
            {TYPES.filter((t) => (stats[t]?.total ?? 0) > 0).length}
            <span className="text-base text-colophon"> / 11</span>
          </div>
          <div className="text-xs text-colophon">全题型都练过 = 方法闭环</div>
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
          className={`flex min-h-[44px] items-center gap-1.5 rounded-[3px] border px-4 py-2 text-xs font-medium transition-colors duration-200 ${
            type === 'mixed'
              ? 'border-rubric bg-rubric text-bone'
              : 'border-rule bg-transparent text-paperink hover:bg-bone2'
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
            className={`min-h-[44px] rounded-[3px] border px-3.5 py-2 text-xs transition-colors duration-200 ${
              type === t
                ? 'border-rubric bg-rubric text-bone'
                : 'border-rule bg-transparent text-paperink hover:bg-bone2'
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
        <EduButton
          variant="default"
          size="sm"
          onClick={() => {
            playSfx('reveal');
            setSeed((s) => s + 1);
          }}
        >
          <ListRestart size={14} aria-hidden /> 换一批题
        </EduButton>
      </div>

      {/* 分题型成绩 */}
      <section>
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-paperink">
          <BarChart3 size={15} className="text-rubric" aria-hidden /> 分题型成绩
        </div>
        <StaggerGroup className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.04}>
          {TYPES.map((t) => {
            const s = stats[t] ?? { total: 0, correct: 0 };
            const pct = s.total ? Math.round((s.correct / s.total) * 100) : 0;
            return (
              <StaggerItem key={t}>
                <div className="rounded-[3px] border border-rule bg-bone2/50 px-4 py-3">
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="text-paperink">{TYPE_LABELS[t]}</span>
                    <span
                      className={`flex items-center gap-1 tabular-nums ${
                        !s.total
                          ? 'text-colophon'
                          : pct >= 80
                            ? 'text-cobalt'
                            : pct >= 50
                              ? 'text-colophon'
                              : 'text-rubric'
                      }`}
                    >
                      {/* 状态不只靠颜色：达标上勾、掉档打叉 */}
                      {s.total > 0 && pct >= 80 && <Check size={13} strokeWidth={2.5} aria-hidden />}
                      {s.total > 0 && pct < 50 && <X size={13} strokeWidth={2.5} aria-hidden />}
                      {s.total ? `${pct}%` : '未练习'}
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-rule">
                    <motion.div
                      className="h-full rounded-full bg-cobalt"
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

      <p className="text-xs text-colophon">
        目标线：单题型正确率 ≥ 80%。达标意味着这套「音 → 形 → 义」通路已自动化，可以换更难的词继续练（实战演练页）。
      </p>
    </div>
  );
}
