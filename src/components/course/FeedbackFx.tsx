import { motion } from 'framer-motion';

/** 绿色光波（判定正确时掠过） */

/** 发音波形（播放时跳动）—— 使用方都在音标实验室；按调用方笔色平涂，不加辉光 */
export function Waveform({ active, bars = 24, color = '#00E5FF' }: { active: boolean; bars?: number; color?: string }) {
  return (
    <div className="flex h-10 items-center justify-center gap-[3px]" aria-hidden>
      {Array.from({ length: bars }).map((_, i) => (
        <motion.span
          key={i}
          className="w-[3px] rounded-full"
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

/** 粒子汇聚（方法登场用）：一圈光点向中心收拢 */
export function ParticleConverge({ active, color = '#00E5FF', count = 26 }: { active: boolean; color?: string; count?: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden>
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * Math.PI * 2;
        const dist = 150 + (i % 4) * 34;
        return (
          <motion.span
            key={i}
            className="absolute h-1.5 w-1.5 rounded-full"
            style={{ background: color, boxShadow: `0 0 8px ${color}` }}
            initial={{ x: Math.cos(angle) * dist, y: Math.sin(angle) * dist, opacity: 0, scale: 1.6 }}
            animate={active ? { x: 0, y: 0, opacity: [0, 1, 0], scale: [1.6, 0.8, 0.2] } : {}}
            transition={{ duration: 1.6, delay: i * 0.03, ease: [0.22, 1, 0.36, 1] }}
          />
        );
      })}
    </div>
  );
}
