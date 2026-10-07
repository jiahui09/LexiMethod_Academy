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
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
};

/** 主形态：批注红实底米白字（无辉光、无渐变、无硬阴影）；次形态：发丝线描边纸面钮 */
const variants: Record<NonNullable<Props['variant']>, string> = {
  neon: 'border-rubric bg-rubric text-bone hover:bg-[#9C2919] hover:border-[#9C2919]',
  solid: 'border-rubric bg-rubric text-bone hover:bg-[#9C2919] hover:border-[#9C2919]',
  ghost: 'border border-rule text-paperink hover:bg-bone2',
};

const base =
  'relative inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[3px] border font-medium transition-colors duration-200 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-45';

/** 纸面按钮：沿用原导出名与全部 props API，内部改为辞书纸面（发丝线 / 批注红 / 方正圆角） */
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
      if (sfx) playSfx('click');
      onClick?.(e);
    },
    [onClick, sfx],
  );

  return (
    <motion.button
      ref={ref}
      type="button"
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      whileTap={tier === 'off' ? undefined : { scale: 0.97 }}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
