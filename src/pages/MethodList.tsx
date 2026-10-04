import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AudioLines,
  Sparkles,
  Target,
  BookOpenText,
  Layers,
  Trophy,
  ArrowRight,
  Dumbbell,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { methods } from '@/data/methods';
import { useProgress, useOverallProgress } from '@/store/progressStore';
import ProgressRing from '@/components/ui/ProgressRing';
import NeonButton from '@/components/ui/NeonButton';
import PageIntro from '@/components/layout/PageIntro';
import { StaggerGroup, StaggerItem } from '@/components/ui/Cards';
import { playSfx } from '@/hooks/useSfx';

const ICONS: Record<string, LucideIcon> = {
  AudioLines,
  Sparkles,
  Target,
  BookOpenText,
  Layers,
  Trophy,
};

/** 方法课程列表页 */
export default function MethodList() {
  const navigate = useNavigate();
  const progress = useProgress();
  const overall = useOverallProgress(methods.length);

  const next = methods.find((m) => !progress.completedMethods.includes(m.id)) ?? methods[0];

  return (
    <div className="flex flex-col gap-8">
      <PageIntro
        crumbs={[{ label: '学习地图', to: '/' }, { label: '方法课程' }]}
        kicker="Method Courses"
        title="方法课程：8 个模块，全部可看、可练、可衡量"
        desc="每门课固定六段结构：原理讲解 → 分步动画演示 → 互动练习 → 实战分析 → 常见误区 → 掌握标准。全部学完，你得到的是一套可以迁移到任何新单词上的方法。"
        next={{ label: `开始《${next.title.split('：')[0]}》`, to: `/methods/${next.id}` }}
      />

      <div className="glass flex flex-wrap items-center gap-6 p-5">
        <ProgressRing value={overall} size={120} label="总进度" />
        <div className="flex flex-1 flex-wrap gap-x-8 gap-y-3 text-sm">
          <div>
            <div className="text-2xl font-bold text-white tabular-nums">{progress.completedMethods.length}/{methods.length}</div>
            <div className="text-xs text-slate-400">模块完成</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-neon tabular-nums">{progress.xp}</div>
            <div className="text-xs text-slate-400">累计 XP</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-warn tabular-nums">{progress.streakCurrent} 天</div>
            <div className="text-xs text-slate-400">连续学习</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <NeonButton
            onClick={() => {
              playSfx('click');
              navigate(`/methods/${next.id}`);
            }}
          >
            {progress.completedMethods.length === 0 ? '开始第一课' : `继续：${next.title}`} <ArrowRight size={15} aria-hidden />
          </NeonButton>
          <NeonButton variant="ghost" onClick={() => { playSfx('click'); navigate('/practice'); }}>
            <Dumbbell size={15} aria-hidden /> 直接训练
          </NeonButton>
        </div>
      </div>

      <StaggerGroup className="grid gap-5 md:grid-cols-2 xl:grid-cols-3" stagger={0.07}>
        {methods.map((m, i) => {
          const done = progress.completedMethods.includes(m.id);
          const steps = progress.completedSteps[m.id] ?? [];
          const pct = Math.round((steps.length / m.steps.length) * 100);
          const Icon = ICONS[m.category] ?? Sparkles;
          return (
            <StaggerItem key={m.id}>
              <motion.article
                whileHover={{ y: -7 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md transition-shadow duration-500 hover:shadow-[0_0_34px_rgba(0,229,255,0.2)]"
              >
                <div
                  className="absolute -right-10 -top-10 h-32 w-32 rounded-full blur-3xl"
                  style={{ background: `${m.accent}3A` }}
                  aria-hidden
                />
                <div className="relative mb-3 flex items-start gap-3">
                  <span
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border"
                    style={{ borderColor: `${m.accent}66`, background: `${m.accent}18`, color: m.accent }}
                  >
                    <Icon size={20} />
                  </span>
                  <div className="min-w-0">
                    <div className="mb-0.5 flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold tabular-nums text-slate-500">模块 {i + 1}</span>
                      <span className="rounded-full border border-white/12 px-2 py-0.5 text-[10px] text-slate-400">{m.category}</span>
                      {done && <span className="rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-bold text-success">✓ 已完成</span>}
                    </div>
                    <h3 className="font-display text-lg font-bold leading-tight text-white">{m.title}</h3>
                  </div>
                </div>

                <p className="relative mb-3 flex-1 text-xs leading-relaxed text-slate-400">{m.subtitle}</p>

                <ul className="relative mb-4 flex flex-wrap gap-1.5">
                  {m.principles.slice(0, 3).map((p, k) => (
                    <li key={k} className="max-w-full truncate rounded-lg border border-white/10 bg-white/[0.05] px-2 py-1 text-[11px] text-slate-400">
                      {p}
                    </li>
                  ))}
                </ul>

                <div className="relative mb-3">
                  <div className="mb-1 flex items-center justify-between text-[11px] text-slate-500">
                    <span>{steps.length}/{m.steps.length} 步</span>
                    <span className="tabular-nums">{pct}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/8">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${m.accent}, #7C4DFF)` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                </div>

                <Link
                  to={`/methods/${m.id}`}
                  className="relative inline-flex items-center justify-center gap-2 rounded-xl border border-white/12 px-4 py-2.5 text-sm font-medium text-slate-200 transition-all duration-300 hover:border-neon/70 hover:bg-neon/10 hover:text-neon"
                >
                  {pct > 0 ? `继续第 ${steps.length + 1 > m.steps.length ? m.steps.length : steps.length + 1} 步` : '进入课程'}
                  <ArrowRight size={14} aria-hidden />
                </Link>
              </motion.article>
            </StaggerItem>
          );
        })}
      </StaggerGroup>
    </div>
  );
}
