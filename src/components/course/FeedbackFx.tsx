import { motion } from 'framer-motion';
import { useMotionTier } from '@/hooks/useMotionTier';

/** 发音波形（播放时跳动）—— 使用方都在音标实验室；按调用方笔色平涂，不加辉光。
 *
 * 契约注记（docs/ui-rebuild-contracts.md）：入场动画已退役，元素硬切直出（无 initial 淡入/位移）。
 * 这里只保留持续性律动，且必须接 useMotionTier：tier off 或非朗读状态一律停在静止终态（A2）。
 * A3：随机关键帧取自模块级常量序列，只生成一次，渲染期间不重掷——波形是稳定律动而非无规律抖动。
 */

/** 模块级稳定随机峰值序列（A3）：整个会话只掷一次，所有波形条循环取用 */
const BAR_PEAKS: readonly number[] = Array.from({ length: 64 }, () => 0.5 + Math.random() * 0.5);

export function Waveform({ active, bars = 24, color = '#111111' }: { active: boolean; bars?: number; color?: string }) {
  const tier = useMotionTier();
  // 只在朗读/说话时律动；tier off（或未朗读）→ 静止终态，不产生逐帧动效
  const pulsing = active && tier !== 'off';

  return (
    <div className="flex h-10 items-center justify-center gap-[3px]" aria-hidden>
      {Array.from({ length: bars }).map((_, i) => (
        <motion.span
          key={i}
          className="w-[3px]"
          style={{ background: color, height: '100%' }}
          animate={
            pulsing
              ? { scaleY: [0.18, BAR_PEAKS[i % BAR_PEAKS.length], 0.25], opacity: [0.5, 1, 0.6] }
              : { scaleY: 0.18, opacity: 0.35 }
          }
          transition={
            pulsing
              ? { duration: 0.5 + (i % 5) * 0.1, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }
              : { duration: 0 }
          }
        />
      ))}
    </div>
  );
}
