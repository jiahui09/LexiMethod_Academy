import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Flame, Target, TrendingUp, AudioLines, BookOpenCheck, ListChecks } from 'lucide-react';
import { methods } from '@/data/methods';
import { useProgress, useOverallProgress } from '@/store/progressStore';
import { TYPE_LABELS } from '@/lib/answers';
import type { QuestionType } from '@/types';
import ProgressRing from '@/components/ui/ProgressRing';
import PageIntro from '@/components/layout/PageIntro';
import { StaggerGroup, StaggerItem } from '@/components/ui/Cards';
import { useMotionTier } from '@/hooks/useMotionTier';

const DAY = 86400000;

/** 统计页：进度 / 正确率 / 活跃度热力图 */
export default function Stats() {
  const tier = useMotionTier();
  const progress = useProgress();
  const overall = useOverallProgress(methods.length);

  const types = Object.keys(TYPE_LABELS) as QuestionType[];
  const totalAttempts = types.reduce((s, t) => s + (progress.stats[t]?.total ?? 0), 0);
  const totalCorrect = types.reduce((s, t) => s + (progress.stats[t]?.correct ?? 0), 0);
  const accuracy = totalAttempts ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

  // 最近 8 周热力图
  const heatmap = useMemo(() => {
    const cells: { date: string; count: number }[] = [];
    const today = new Date();
    for (let i = 55; i >= 0; i--) {
      const d = new Date(today.getTime() - i * DAY);
      const key = d.toISOString().slice(0, 10);
      cells.push({ date: key, count: progress.activity[key] ?? 0 });
    }
    return cells;
  }, [progress.activity]);
  const maxAct = Math.max(1, ...heatmap.map((c) => c.count));

  // 最近 14 天柱状
  const bars = heatmap.slice(-14);

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
        kicker="Analytics"
        title="统计：看的是“方法使用”，不是背词量"
        desc="关注四个信号：各方法完成度、题型正确率、连续学习天数、复习与输出的执行情况。零数据存储：这些数字只统计本次会话，刷新后回到起点。"
        next={{ label: '回到学习地图', to: '/' }}
      />

      {/* KPI */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="glass flex items-center gap-4 p-5">
          <ProgressRing value={overall} size={100} label="总进度" />
          <div>
            <div className="text-xs uppercase tracking-widest text-slate-400">课程完成</div>
            <div className="font-display text-2xl font-bold text-white tabular-nums">
              {progress.completedMethods.length}/{methods.length}
            </div>
          </div>
        </div>

        <div className="glass flex flex-col justify-center gap-1 p-5">
          <div className="flex items-center gap-2 text-warn">
            <Flame size={18} aria-hidden />
            <span className="font-display text-3xl font-bold tabular-nums">{progress.streakCurrent}</span>
            <span className="text-xs text-slate-400">天连续</span>
          </div>
          <div className="text-[11px] text-slate-500">最长 {progress.streakLongest} 天</div>
        </div>

        <div className="glass flex flex-col justify-center gap-1 p-5">
          <div className="flex items-center gap-2 text-neon">
            <Target size={18} aria-hidden />
            <span className="font-display text-3xl font-bold tabular-nums">{accuracy}%</span>
          </div>
          <div className="text-[11px] text-slate-500">总正确率 · 作答 {totalAttempts} 次</div>
        </div>

        <div className="glass flex flex-col justify-center gap-1 p-5">
          <div className="flex items-center gap-2 text-success">
            <TrendingUp size={18} aria-hidden />
            <span className="font-display text-3xl font-bold tabular-nums">{progress.xp}</span>
            <span className="text-xs text-slate-400">XP</span>
          </div>
          <div className="text-[11px] text-slate-500">
            音标 {progress.phonemesLearned.length}/48 · 实战词 {progress.analyzedWords.length}
          </div>
        </div>
      </div>

      {/* 热力图 + 14 天柱 */}
      <section className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <div className="glass p-5">
          <div className="mb-3 flex items-center justify-between text-sm font-semibold text-white">
            <span>活跃热力图（近 8 周）</span>
            <span className="text-xs font-normal text-slate-500">颜色越亮 = 当天练习越多</span>
          </div>
          <div className="grid grid-flow-col grid-rows-7 gap-1 overflow-x-auto pb-1" role="img" aria-label="最近 8 周学习活跃度热力图">
            {heatmap.map((c) => {
              const alpha = c.count === 0 ? 0.06 : 0.25 + (c.count / maxAct) * 0.75;
              return (
                <span
                  key={c.date}
                  title={`${c.date} · ${c.count} 次`}
                  className="h-4 w-4 rounded-[4px]"
                  style={{ background: `rgba(0,229,255,${alpha})`, boxShadow: c.count ? '0 0 6px rgba(0,229,255,0.35)' : 'none' }}
                />
              );
            })}
          </div>
          <div className="mt-3 flex flex-wrap gap-4 text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <ListChecks size={11} aria-hidden /> 今日 {progress.activity[new Date().toISOString().slice(0, 10)] ?? 0} 次
            </span>
            <span className="flex items-center gap-1.5">
              <AudioLines size={11} aria-hidden /> 音标已学 {progress.phonemesLearned.length}
            </span>
            <span className="flex items-center gap-1.5">
              <BookOpenCheck size={11} aria-hidden /> 实战分析 {progress.analyzedWords.length} 词
            </span>
          </div>
        </div>

        <div className="glass p-5">
          <div className="mb-3 text-sm font-semibold text-white">近 14 天练习量</div>
          <div className="flex h-40 items-end gap-1.5">
            {bars.map((b) => (
              <div key={b.date} className="group flex flex-1 flex-col items-center gap-1.5" title={`${b.date}: ${b.count}`}>
                <span className="text-[9px] text-slate-500 tabular-nums">{b.count || ''}</span>
                <motion.div
                  className="w-full rounded-t-md bg-gradient-to-t from-violet to-neon"
                  initial={tier === 'off' ? false : { height: 3 }}
                  animate={{ height: Math.max(3, (b.count / maxAct) * 110) }}
                  transition={{ duration: 0.6, delay: 0.03 * bars.indexOf(b) }}
                  style={{ minHeight: 3 }}
                />
                <span className="text-[9px] text-slate-500">{b.date.slice(8)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 各方法进度 */}
      <section>
        <div className="mb-3 text-sm font-semibold text-white">各方法完成度</div>
        <StaggerGroup className="grid gap-2.5 sm:grid-cols-2" stagger={0.05}>
          {perMethod.map(({ m, pct }) => (
            <StaggerItem key={m.id}>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="text-slate-300">{m.title}</span>
                  <span className="tabular-nums" style={{ color: m.accent }}>
                    {pct}%
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/8">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${m.accent}, #7C4DFF)` }}
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
        <div className="mb-3 text-sm font-semibold text-white">题型表现（按作答量排序）</div>
        {topTypes.length === 0 && (
          <p className="rounded-2xl border border-dashed border-white/15 px-4 py-6 text-center text-sm text-slate-500">
            还没有作答记录 —— 去「互动训练」完成第一轮。
          </p>
        )}
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {topTypes.map(({ t, pct, attempts }) => (
            <div key={t} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="text-slate-300">{TYPE_LABELS[t]}</span>
                <span className={`tabular-nums ${pct >= 80 ? 'text-success' : pct >= 50 ? 'text-warn' : 'text-danger'}`}>{pct}%</span>
              </div>
              <div className="mb-1 h-1.5 overflow-hidden rounded-full bg-white/8">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-neon to-success"
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.7 }}
                />
              </div>
              <div className="text-[10px] text-slate-500">作答 {attempts} 次</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
