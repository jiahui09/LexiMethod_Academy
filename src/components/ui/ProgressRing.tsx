import { motion } from 'framer-motion';
import { useMotionTier } from '@/hooks/useMotionTier';

type Props = {
  /** 0~1 */
  value: number;
  size?: number;
  stroke?: number;
  color?: string;
  track?: string;
  label?: string;
  sub?: string;
  delay?: number;
};

/** 进度环 */
export default function ProgressRing({
  value,
  size = 132,
  stroke = 10,
  color = '#00E5FF',
  track = 'rgba(255,255,255,0.08)',
  label,
  sub,
  delay = 0,
}: Props) {
  const tier = useMotionTier();
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(1, value));

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <defs>
          <linearGradient id={`ring-grad-${label ?? 'x'}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor="#7C4DFF" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} stroke={track} strokeWidth={stroke} fill="none" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={`url(#ring-grad-${label ?? 'x'})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          initial={{ strokeDashoffset: tier === 'off' ? c * (1 - v) : c }}
          whileInView={{ strokeDashoffset: c * (1 - v) }}
          viewport={{ once: true }}
          transition={{ duration: tier === 'off' ? 0 : 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
          style={{ filter: `drop-shadow(0 0 8px ${color}88)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-2xl font-bold text-white tabular-nums">
          {Math.round(v * 100)}%
        </span>
        {label && <span className="mt-0.5 text-xs text-slate-300/70">{label}</span>}
        {sub && <span className="text-xs text-slate-400/70">{sub}</span>}
      </div>
    </div>
  );
}
