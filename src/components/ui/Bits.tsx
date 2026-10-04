import React from 'react';
import { motion } from 'framer-motion';
import { Volume2, Loader2 } from 'lucide-react';
import { useSpeech, useSpeaking } from '@/hooks/useSpeech';
import { useMotionTier } from '@/hooks/useMotionTier';
import { playSfx } from '@/hooks/useSfx';

/** 小标签 / 芯片 */
export function Chip({
  children,
  active = false,
  onClick,
  tone = 'cyan',
  className = '',
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  tone?: 'cyan' | 'violet' | 'pink' | 'green' | 'amber';
  className?: string;
}) {
  const tones: Record<string, string> = {
    cyan: '#00E5FF',
    violet: '#7C4DFF',
    pink: '#FF4D9D',
    green: '#00E676',
    amber: '#FFB300',
  };
  const color = tones[tone];
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag
      onClick={
        onClick
          ? () => {
              playSfx('click');
              onClick();
            }
          : undefined
      }
      type={onClick ? 'button' : undefined}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all duration-300 ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''
      } ${className}`}
      style={{
        color: active ? '#04121c' : color,
        background: active ? color : `${color}18`,
        border: `1px solid ${active ? color : `${color}55`}`,
        boxShadow: active ? `0 0 16px ${color}66` : 'none',
      }}
      aria-pressed={onClick ? active : undefined}
    >
      {children}
    </Tag>
  );
}

/** 成就徽章 */
export function Badge({ icon, title, desc, earned }: { icon: React.ReactNode; title: string; desc: string; earned: boolean }) {
  return (
    <div
      className={`glass flex flex-col items-center gap-1.5 p-4 text-center transition-all duration-500 ${
        earned ? 'border-[rgba(0,230,118,0.4)] shadow-[0_0_22px_rgba(0,230,118,0.18)]' : 'opacity-45 grayscale'
      }`}
      title={desc}
      data-testid="achievement-badge"
      data-title={title}
      data-earned={earned ? '1' : '0'}
    >
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
          earned ? 'bg-[rgba(0,230,118,0.14)] text-success' : 'bg-white/5 text-slate-400'
        }`}
      >
        {icon}
      </div>
      <div className="text-xs font-semibold text-white">{title}</div>
      <div className="text-[10px] leading-tight text-slate-400">{desc}</div>
    </div>
  );
}

/** 区块标题 */
export function SectionHeading({
  kicker,
  title,
  desc,
  align = 'left',
}: {
  kicker?: string;
  title: string;
  desc?: string;
  align?: 'left' | 'center';
}) {
  const tier = useMotionTier();
  const anim =
    tier === 'off'
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
        };
  return (
    <motion.div className={`mb-6 ${align === 'center' ? 'text-center' : ''}`} {...anim}>
      {kicker && (
        <div className={`mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-neon ${align === 'center' ? 'justify-center' : ''}`}>
          <span className="h-px w-6 bg-neon/60" />
          {kicker}
          <span className="h-px w-6 bg-neon/60" />
        </div>
      )}
      <h2 className="font-display text-2xl font-bold text-white md:text-3xl">{title}</h2>
      {desc && <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-300/80 md:text-base">{desc}</p>}
    </motion.div>
  );
}

/** 朗读按钮：支持慢速/常速 */
export function SpeakButton({
  text,
  slow = false,
  label,
  size = 'md',
  className = '',
}: {
  text: string;
  slow?: boolean;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const { speak, supported } = useSpeech();
  const speaking = useSpeaking();
  const dim = size === 'sm' ? 'h-7 w-7' : size === 'lg' ? 'h-11 w-11' : 'h-9 w-9';
  const icon = size === 'sm' ? 14 : size === 'lg' ? 20 : 16;

  return (
    <motion.button
      type="button"
      disabled={!supported}
      aria-label={label ?? (slow ? `慢速朗读 ${text}` : `朗读 ${text}`)}
      title={supported ? (slow ? '慢速播放' : '播放发音') : '当前浏览器不支持语音合成'}
      onClick={(e) => {
        e.stopPropagation();
        playSfx('tick');
        speak(text, { slow });
      }}
      whileTap={{ scale: 0.88 }}
      className={`inline-flex ${dim} shrink-0 items-center justify-center rounded-full border transition-colors duration-300 disabled:opacity-40 ${className}`}
      style={{
        borderColor: slow ? 'rgba(255,179,0,0.5)' : 'rgba(0,229,255,0.45)',
        background: slow ? 'rgba(255,179,0,0.12)' : 'rgba(0,229,255,0.12)',
        color: slow ? '#FFB300' : '#00E5FF',
        boxShadow: speaking ? '0 0 16px rgba(0,229,255,0.4)' : 'none',
      }}
    >
      {speaking ? <Loader2 size={icon} className="animate-spin" /> : <Volume2 size={icon} />}
    </motion.button>
  );
}

/** 旁白文本：动画之外的信息载体（可访问性） */
export function Narration({ text, className = '' }: { text: string; className?: string }) {
  return (
    <p className={`border-l-2 border-neon/50 bg-white/[0.04] px-4 py-3 text-sm leading-relaxed text-slate-300/90 ${className}`}>
      <span className="mr-2 text-[10px] font-bold uppercase tracking-wider text-neon/80">讲解</span>
      {text}
    </p>
  );
}
