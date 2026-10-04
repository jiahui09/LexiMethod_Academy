import React, { useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { playSfx } from '@/hooks/useSfx';
import { useMotionTier } from '@/hooks/useMotionTier';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'neon' | 'ghost' | 'solid';
  size?: 'sm' | 'md' | 'lg';
  sfx?: boolean;
  children: React.ReactNode;
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm rounded-xl',
  md: 'px-5 py-2.5 text-sm rounded-[14px]',
  lg: 'px-7 py-3.5 text-base rounded-2xl',
};

/** 霓虹按钮：渐变描边 + hover 光晕 + 点击 ripple + 按压回弹 */
export default function NeonButton({
  variant = 'neon',
  size = 'md',
  sfx = true,
  className = '',
  children,
  onClick,
  onDrag: _onDrag,
  onDragStart: _onDragStart,
  onDragEnd: _onDragEnd,
  onAnimationStart: _onAnimationStart,
  onAnimationEnd: _onAnimationEnd,
  onTransitionEnd: _onTransitionEnd,
  ...rest
}: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  const tier = useMotionTier();

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const el = ref.current;
      if (el && tier !== 'off') {
        const rect = el.getBoundingClientRect();
        const dot = document.createElement('span');
        const d = Math.max(rect.width, rect.height);
        dot.className = 'ripple-dot';
        dot.style.width = `${d}px`;
        dot.style.height = `${d}px`;
        dot.style.left = `${e.clientX - rect.left - d / 2}px`;
        dot.style.top = `${e.clientY - rect.top - d / 2}px`;
        el.appendChild(dot);
        window.setTimeout(() => dot.remove(), 620);
      }
      if (sfx) playSfx('click');
      onClick?.(e);
    },
    [onClick, sfx, tier],
  );

  const base =
    variant === 'neon'
      ? 'btn-neon'
      : variant === 'ghost'
        ? 'btn-ghost'
        : 'rounded-[14px] px-5 py-2.5 text-sm font-semibold text-[#071022] bg-gradient-to-r from-[#00E5FF] to-[#7C4DFF] shadow-glow-sm transition hover:brightness-110 active:scale-95 cursor-pointer border-0';

  return (
    <motion.button
      ref={ref}
      type="button"
      className={`${base} ${sizes[size]} relative overflow-hidden inline-flex items-center justify-center gap-2 ${className}`}
      whileTap={tier === 'off' ? undefined : { scale: 0.95 }}
      whileHover={tier === 'off' ? undefined : { y: -1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
