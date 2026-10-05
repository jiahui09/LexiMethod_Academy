import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Pause, RotateCcw, Check } from 'lucide-react';
import EduButton from '@/components/edu/Button';
import { useMotionTier } from '@/hooks/useMotionTier';
import { playSfx } from '@/hooks/useSfx';

export const AUTOPLAY_MS = 7000;

type Props = {
  index: number;
  total: number;
  autoplay: boolean;
  completed: number[];
  /** 回退 / 直接跳转：不记完成（步跳主责在义项导轨，这里保底可退） */
  onChange: (i: number) => void;
  /** 前进（下一步 / 自动播放 / →）：由父组件决定先记完成再跳 */
  onNext?: () => void;
  /** 最后一步的「完成本课」：完成时刻（批注章/祝贺由此触发） */
  onFinish?: () => void;
  onToggleAutoplay: () => void;
  onReplay: () => void;
  /** 页脚提示（默认为课程导轨文案；实验室复用时传无导轨版本） */
  hint?: string;
};

/** 页脚刻线导览：上一步 / 下一步 / 完成本课 / 自动播放 / 重播 + 页码 */
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
  hint = '提示：可用键盘 ← / → 翻页；导轨（小屏在页顶）可直接跳到任意一步；开启“自动播放”按时间线自动推进。',
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
    <div className="mt-7 flex flex-col gap-4 border-t border-rule pt-4">
      {/* 自动播放刻线：读秒即进度 */}
      <div className="h-[3px] w-full overflow-hidden bg-rule" aria-hidden="true">
        <motion.div
          key={`${index}-${autoplay ? 'a' : 'm'}`}
          ref={barRef}
          className="h-full bg-rubric"
          initial={{ width: autoplay ? '0%' : `${(index / Math.max(1, total - 1)) * 100}%` }}
          animate={{ width: autoplay ? '100%' : `${(index / Math.max(1, total - 1)) * 100}%` }}
          transition={autoplay && tier !== 'off' ? { duration: AUTOPLAY_MS / 1000, ease: 'linear' } : { duration: 0.35 }}
          style={{ opacity: autoplay ? 1 : 0.4 }}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <EduButton size="sm" variant="ghost" onClick={() => onChange(index - 1)} disabled={index === 0} aria-label="上一步">
            <ChevronLeft size={15} aria-hidden /> 上一步
          </EduButton>
          {isLast ? (
            onFinish ? (
              <EduButton
                size="sm"
                variant="primary"
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
              </EduButton>
            ) : (
              /* 无 onFinish 的复用方（如音标实验室）：末步不渲染死按钮，完成态由其自身逻辑接管 */
              null
            )
          ) : (
            <EduButton size="sm" onClick={() => onNext?.()} aria-label="下一步">
              下一步 <ChevronRight size={15} aria-hidden />
            </EduButton>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <EduButton size="sm" variant="ghost" onClick={onToggleAutoplay} aria-pressed={autoplay}>
            {autoplay ? (
              <>
                <Pause size={14} aria-hidden /> 暂停自动播放
              </>
            ) : (
              <>
                <Play size={14} aria-hidden /> 自动播放
              </>
            )}
          </EduButton>
          <EduButton size="sm" variant="ghost" onClick={onReplay} aria-label="重播本步动画">
            <RotateCcw size={14} aria-hidden /> 重播
          </EduButton>
        </div>

        <span className="text-xs tabular-nums text-colophon">
          {index + 1} / {total}
        </span>
      </div>

      <p className="text-xs text-colophon">
        {hint}
      </p>
    </div>
  );
}
