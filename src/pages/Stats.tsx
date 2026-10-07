import { motion } from 'framer-motion';
import { Target, AudioLines, MessageSquareText, ArrowRight, Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { methods } from '@/data/methods';
import { useProgress, useOverallProgress } from '@/store/progressStore';
import { TYPE_LABELS } from '@/lib/answers';
import type { QuestionType } from '@/types';
import PageIntro from '@/components/layout/PageIntro';
import { StaggerGroup, StaggerItem } from '@/components/ui/Cards';

/** 统计页：课程完成度 / 题型正确率 / 费曼关记录 */
export default function Stats() {
  const progress = useProgress();
  const overall = useOverallProgress(methods.length);

  const types = Object.keys(TYPE_LABELS) as QuestionType[];
  const totalAttempts = types.reduce((s, t) => s + (progress.stats[t]?.total ?? 0), 0);
  const totalCorrect = types.reduce((s, t) => s + (progress.stats[t]?.correct ?? 0), 0);
  const accuracy = totalAttempts ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

  const feynmanRecords = progress.feynmanRecords ?? [];
  const feynmanPassed = feynmanRecords.filter((r) => r.passed).length;

  /** 首访空态：本次会话没有任何学习痕迹时，只给一行说明与一个去处 */
  const isEmpty =
    totalAttempts === 0 &&
    progress.completedMethods.length === 0 &&
    progress.phonemesLearned.length === 0 &&
    progress.analyzedWords.length === 0 &&
    feynmanRecords.length === 0;

  const perMethod = methods.map((m) => {
    const done = progress.completedSteps[m.id]?.length ?? 0;
    return { m, pct: Math.round((done / m.steps.length) * 100) };
  });

  const topTypes = [...types]
    .map((t) => {
      const s = progress.stats[t] ?? { total: 0, correct: 0 };
      return { t, pct: s.total ? Math.round((s.correct / s.total) * 100) : -1, attempts: s.total };
    })
    .filter((x) => x.attempts > 0)
    .sort((a, b) => b.attempts - a.attempts)
    .slice(0, 6);

  return (
    <div className="flex flex-col gap-6">
      <PageIntro
        crumbs={[{ label: '学习地图', to: '/' }, { label: '学习统计' }]}
        title="统计：看的是“方法使用”，不是背词量"
        desc="关注三个信号：课程完成度、题型正确率、讲解与输出的执行情况。零数据存储：这些数字只统计本次会话，刷新后回到起点。"
        next={{ label: '回到学习地图', to: '/' }}
      />

      {isEmpty && (
        /* 首访空态：一行说明 + 唯一去处（描边，不放彩带、不放重复发光 CTA） */
        <div className="flex flex-col items-center gap-4 rounded-[3px] border border-dashed border-rule px-6 py-10 text-center">
          <p className="max-w-md text-sm leading-relaxed text-colophon">
            还没有可统计的内容：完成课程步骤、做一组训练、讲一次费曼关之后，正确率与完成度会在这里逐项出现。
          </p>
          <Link
            to="/practice"
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-[3px] border border-rule px-4 py-2.5 text-sm font-medium text-paperink transition-colors hover:bg-bone2"
          >
            去做第一组训练 <ArrowRight size={14} aria-hidden />
          </Link>
        </div>
      )}

      {!isEmpty && (
        <>
          {/* KPI */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-[3px] border border-rule bg-bone2/50 p-5">
              <div className="text-xs text-colophon">课程完成</div>
              <div className="font-serif text-2xl font-bold text-paperink tabular-nums">
                {progress.completedMethods.length}/{methods.length}
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-colophon">
                <span>总进度</span>
                <span className="tabular-nums">{Math.round(overall * 100)}%</span>
              </div>
              <span className="mt-1.5 block h-[3px] w-full bg-rule" aria-hidden>
                <span className="block h-[3px] bg-cobalt" style={{ width: `${Math.round(overall * 100)}%` }} />
              </span>
            </div>

            <div className="flex flex-col justify-center gap-1 rounded-[3px] border border-rule bg-bone2/50 p-5">
              <div className="flex items-center gap-2 text-cobalt">
                <Target size={18} aria-hidden />
                <span className="font-serif text-3xl font-bold tabular-nums">{accuracy}%</span>
              </div>
              <div className="text-xs text-colophon">总正确率 · 作答 {totalAttempts} 次</div>
            </div>

            <div className="flex flex-col justify-center gap-1 rounded-[3px] border border-rule bg-bone2/50 p-5">
              <div className="flex items-center gap-2 text-cobalt">
                <MessageSquareText size={18} aria-hidden />
                <span className="font-serif text-3xl font-bold tabular-nums">
                  {feynmanPassed}/{feynmanRecords.length}
                </span>
              </div>
              <div className="text-xs text-colophon">费曼关通过 / 讲解次数</div>
            </div>

            <div className="flex flex-col justify-center gap-1 rounded-[3px] border border-rule bg-bone2/50 p-5">
              <div className="flex items-center gap-2 text-cobalt">
                <AudioLines size={18} aria-hidden />
                <span className="font-serif text-3xl font-bold tabular-nums">{progress.phonemesLearned.length}</span>
              </div>
              <div className="text-xs text-colophon">
                音标已学 /48 · 实战词 {progress.analyzedWords.length}
              </div>
            </div>
          </div>

          {/* 费曼关记录 */}
          {feynmanRecords.length > 0 && (
            <section className="rounded-[3px] border border-rule bg-bone2/50 p-5">
              <div className="mb-3 text-sm font-semibold text-paperink">费曼关讲解记录</div>
              <ul className="flex flex-col gap-1.5 text-xs text-colophon">
                {feynmanRecords.slice(0, 5).map((r) => (
                  <li key={r.at} className="flex items-center justify-between gap-2">
                    <span className="truncate">
                      {new Date(r.at).toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })} ·{' '}
                      {methods.find((m) => m.id === r.methodId)?.title.split('：')[0] ?? r.methodId}
                    </span>
                    <span className={`flex shrink-0 items-center gap-1 ${r.passed ? 'text-cobalt' : 'text-rubric'}`}>
                      {r.passed ? <Check size={13} strokeWidth={2.5} aria-hidden /> : <X size={13} strokeWidth={2.5} aria-hidden />}
                      {r.passed ? '通过' : '未过'} · 关键词 {r.hits}/{r.total}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

      {/* 各方法进度 */}
      <section>
        <div className="mb-3 text-sm font-semibold text-paperink">各方法完成度</div>
        <StaggerGroup className="grid gap-2.5 sm:grid-cols-2" stagger={0.05}>
          {perMethod.map(({ m, pct }) => (
            <StaggerItem key={m.id}>
              <div className="rounded-[3px] border border-rule bg-bone2/50 px-4 py-3">
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="text-paperink">{m.title}</span>
                  <span className="tabular-nums text-cobalt">{pct}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-rule">
                  <motion.div
                    className="h-full rounded-full bg-cobalt"
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      {/* 题型表现 */}
      <section>
        <div className="mb-3 text-sm font-semibold text-paperink">题型表现（按作答量排序）</div>
        {topTypes.length === 0 && (
          <p className="rounded-[3px] border border-dashed border-rule px-4 py-6 text-center text-sm text-colophon">
            还没有作答记录 —— 去「互动训练」完成第一轮。
          </p>
        )}
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {topTypes.map(({ t, pct, attempts }) => (
            <div key={t} className="rounded-[3px] border border-rule bg-bone2/50 px-4 py-3">
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="text-paperink">{TYPE_LABELS[t]}</span>
                <span
                  className={`flex items-center gap-1 tabular-nums ${
                    pct >= 80 ? 'text-cobalt' : pct >= 50 ? 'text-colophon' : 'text-rubric'
                  }`}
                >
                  {/* 状态不只靠颜色：达标上勾、掉档打叉 */}
                  {pct >= 80 && <Check size={13} strokeWidth={2.5} aria-hidden />}
                  {pct < 50 && <X size={13} strokeWidth={2.5} aria-hidden />}
                  {pct}%
                </span>
              </div>
              <div className="mb-1 h-1.5 overflow-hidden rounded-full bg-rule">
                <motion.div
                  className="h-full rounded-full bg-cobalt"
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.7 }}
                />
              </div>
              <div className="text-xs text-colophon">作答 {attempts} 次</div>
            </div>
          ))}
        </div>
      </section>
        </>
      )}
    </div>
  );
}
