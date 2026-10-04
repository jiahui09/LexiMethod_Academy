import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Pause, RotateCcw, Check } from 'lucide-react';
import NeonButton from '@/components/ui/NeonButton';
import { useMotionTier } from '@/hooks/useMotionTier';
import { playSfx } from '@/hooks/useSfx';

export const AUTOPLAY_MS = 7000;

type Props = {
  index: number;
  total: number;
  autoplay: boolean;
  completed: number[];
  /** 圆点/回退：直接跳转，不记完成 */
  onChange: (i: number) => void;
  /** 前进（下一步 / 自动播放 / →）：由父组件决定先记完成再跳 */
  onNext?: () => void;
  /** 最后一步的「完成本课」：完成时刻（彩带/祝贺由此触发） */
  onFinish?: () => void;
  onToggleAutoplay: () => void;
  onReplay: () => void;
};

/** 课程控制条：上一步 / 下一步 / 完成本课 / 自动播放 / 重播 + 步骤圆点 */
export default function StepControls({
  index,
  total,
  autoplay,
  completed,
  onChange,
  onNext,
  onFinish,
  onToggleAutoplay,
  onReplay,
}: Props) {
  const tier = useMotionTier();
  const barRef = useRef<HTMLDivElement>(null);
  const isLast = index === total - 1;
  const allDone = completed.length >= total;

  // 自动播放：按时间线自动推进
  useEffect(() => {
    if (!autoplay) return;
    const timer = window.setTimeout(() => {
      if (index < total - 1) {
        playSfx('tick');
        onNext?.();
      } else {
        onToggleAutoplay();
      }
    }, AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [autoplay, index, total, onNext, onToggleAutoplay]);

  // 键盘 ←/→ 控制（→ = 前进走 onNext，← = 回退走 onChange）
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA'].includes(target.tagName)) return;
      if (e.key === 'ArrowRight' && index < total - 1) onNext?.();
      if (e.key === 'ArrowLeft' && index > 0) onChange(index - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, total, onNext, onChange]);

  return (
    <div className="glass mt-5 flex flex-col gap-4 p-4 md:p-5">
      {/* 自动播放进度条 */}
      <div className="h-1 w-full overflow-hidden rounded-full bg-white/8" aria-hidden="true">
        <motion.div
          key={`${index}-${autoplay ? 'a' : 'm'}`}
          ref={barRef}
          className="h-full rounded-full bg-gradient-to-r from-neon via-violet to-pink"
          initial={{ width: autoplay ? '0%' : `${(index / Math.max(1, total - 1)) * 100}%` }}
          animate={{ width: autoplay ? '100%' : `${(index / Math.max(1, total - 1)) * 100}%` }}
          transition={autoplay && tier !== 'off' ? { duration: AUTOPLAY_MS / 1000, ease: 'linear' } : { duration: 0.35 }}
          style={{ opacity: autoplay ? 1 : 0.55 }}
        />
      </div>

      {/* 步骤圆点 */}
      <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="课程步骤">
        {Array.from({ length: total }).map((_, i) => {
          const done = completed.includes(i);
          const activeDot = i === index;
          return (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={activeDot}
              aria-label={`第 ${i + 1} 步${done ? '（已完成）' : ''}`}
              onClick={() => {
                playSfx('click');
                onChange(i);
              }}
              className="group flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] transition-all duration-300"
              style={{
                borderColor: activeDot ? 'rgba(0,229,255,0.75)' : done ? 'rgba(0,230,118,0.4)' : 'rgba(255,255,255,0.14)',
                background: activeDot ? 'rgba(0,229,255,0.16)' : 'rgba(255,255,255,0.04)',
                color: activeDot ? '#00E5FF' : done ? '#00E676' : 'rgba(203,213,225,0.75)',
                boxShadow: activeDot ? '0 0 14px rgba(0,229,255,0.35)' : 'none',
              }}
            >
              {done && !activeDot ? <Check size={11} aria-hidden /> : null}
              {i + 1}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <NeonButton size="sm" variant="ghost" onClick={() => onChange(index - 1)} disabled={index === 0} aria-label="上一步">
            <ChevronLeft size={15} aria-hidden /> 上一步
          </NeonButton>
          {isLast ? (
            onFinish ? (
              <NeonButton
                size="sm"
                onClick={() => onFinish?.()}
                disabled={allDone}
                aria-label="完成本课"
                data-testid="finish-course"
              >
                {allDone ? (
                  <>
                    <Check size={15} aria-hidden /> 本课已完成
                  </>
                ) : (
                  <>完成本课</>
                )}
              </NeonButton>
            ) : (
              /* 无 onFinish 的复用方（如音标实验室）：末步不渲染死按钮，完成态由其自身逻辑接管 */
              null
            )
          ) : (
            <NeonButton
              size="sm"
              onClick={() => {
                onNext?.();
              }}
              aria-label="下一步"
            >
              下一步 <ChevronRight size={15} aria-hidden />
            </NeonButton>
          )}
        </div>

        <div className="flex items-center gap-2">
          <NeonButton size="sm" variant="ghost" onClick={onToggleAutoplay} aria-pressed={autoplay}>
            {autoplay ? (
              <>
                <Pause size={14} aria-hidden /> 暂停自动播放
              </>
            ) : (
              <>
                <Play size={14} aria-hidden /> 自动播放
              </>
            )}
          </NeonButton>
          <NeonButton size="sm" variant="ghost" onClick={onReplay} aria-label="重播本步动画">
            <RotateCcw size={14} aria-hidden /> 重播
          </NeonButton>
        </div>

        <span className="text-xs tabular-nums text-slate-400">
          {index + 1} / {total}
        </span>
      </div>

      <p className="text-[11px] text-slate-500">提示：可用键盘 ← / → 翻页；开启“自动播放”将按时间线自动推进每一步。</p>
    </div>
  );
}
