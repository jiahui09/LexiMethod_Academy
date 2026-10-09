import { motion } from 'framer-motion';

/** 绿色光波（判定正确时掠过） */

/** 发音波形（播放时跳动）—— 使用方都在音标实验室；按调用方笔色平涂，不加辉光 */
export function Waveform({ active, bars = 24, color = '#111111' }: { active: boolean; bars?: number; color?: string }) {
  return (
    <div className="flex h-10 items-center justify-center gap-[3px]" aria-hidden>
      {Array.from({ length: bars }).map((_, i) => (
        <motion.span
          key={i}
          className="w-[3px]"
          style={{ background: color, height: '100%' }}
          initial={{ scaleY: 0.2, opacity: 0.4 }}
          animate={
            active
              ? { scaleY: [0.18, 0.5 + Math.random() * 0.5, 0.25], opacity: [0.5, 1, 0.6] }
              : { scaleY: 0.18, opacity: 0.35 }
          }
          transition={
            active
              ? { duration: 0.5 + (i % 5) * 0.1, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }
              : { duration: 0.4 }
          }
        />
      ))}
    </div>
  );
}

