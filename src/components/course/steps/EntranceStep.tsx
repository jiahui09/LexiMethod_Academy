import type { Method } from '@/types';
import { ParticleConverge } from '../FeedbackFx';
import { motion } from 'framer-motion';
import { useMotionTier } from '@/hooks/useMotionTier';
import { Target, Clock3 } from 'lucide-react';

/** Step 1：方法登场 —— 标题从粒子中汇聚，背景光晕脉冲 */
export default function EntranceStep({ method }: { method: Method }) {
  const tier = useMotionTier();
  const letters = method.title.split('');
  const accent = method.accent ?? '#00E5FF';

  return (
    <div className="relative flex min-h-[330px] flex-col items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] px-5 py-10 text-center">
      {/* 背景光晕脉冲 */}
      <motion.div
        aria-hidden
        className="absolute h-72 w-72 rounded-full blur-3xl"
        style={{ background: `radial-gradient(circle, ${accent}55, transparent 70%)` }}
        animate={tier === 'off' ? {} : { scale: [1, 1.14, 1], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <ParticleConverge active={tier !== 'off'} color={accent} />

      <div className="relative z-10 flex flex-col items-center gap-5">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span
            className="rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-widest"
            style={{ color: accent, borderColor: `${accent}66`, background: `${accent}1A` }}
          >
            方法模块
          </span>
          {method.durationMin && (
            <span className="flex items-center gap-1 rounded-full border border-white/12 bg-white/5 px-3 py-1 text-xs text-slate-300">
              <Clock3 size={12} aria-hidden /> 约 {method.durationMin} 分钟
            </span>
          )}
        </div>

        {/* 标题字母逐个汇聚（h2：页面 h1 属于 MethodCourse 的课程标题） */}
        <h2 className="flex flex-wrap items-center justify-center gap-x-1 font-display text-3xl font-bold leading-tight text-white md:text-5xl">
          {letters.map((ch, i) => (
            <motion.span
              key={`${ch}-${i}`}
              className="inline-block"
              initial={tier === 'off' ? false : { opacity: 0, y: 28, scale: 0.6, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              transition={{ delay: 0.15 + i * 0.05, type: 'spring', stiffness: 260, damping: 20 }}
              style={{
                textShadow: `0 0 26px ${accent}88`,
              }}
            >
              {ch === ' ' ? ' ' : ch}
            </motion.span>
          ))}
        </h2>

        <motion.p
          initial={tier === 'off' ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="max-w-2xl text-sm leading-relaxed text-slate-300/90 md:text-base"
        >
          <span className="mr-2 inline-flex items-center gap-1 rounded-md bg-neon/15 px-2 py-0.5 text-xs font-bold text-neon">
            <Target size={11} aria-hidden /> 你将学会
          </span>
          {method.subtitle}
        </motion.p>

        <motion.div
          initial={tier === 'off' ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400"
        >
          {method.principles.slice(0, 3).map((p, i) => (
            <span key={i} className="rounded-lg border border-white/12 bg-white/5 px-3 py-1.5">
              {p}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
