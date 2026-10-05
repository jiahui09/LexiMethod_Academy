import React, { useCallback } from 'react';
import { playSfx } from '@/hooks/useSfx';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'primary' | 'ghost';
  size?: 'sm' | 'md';
  /** 点击音，默认开（与全站交互一致） */
  sfx?: boolean;
  children: React.ReactNode;
};

const base =
  'inline-flex items-center justify-center gap-2 rounded-[3px] border font-medium transition-colors duration-200 active:translate-y-px min-h-[44px] disabled:cursor-not-allowed disabled:opacity-45';
const variants = {
  default: 'border-paperink/60 bg-transparent text-paperink hover:bg-paperink hover:text-bone',
  primary: 'border-rubric bg-rubric text-[#FBF6EC] hover:bg-[#9C2919] hover:border-[#9C2919]',
  ghost: 'border-transparent bg-transparent text-colophon hover:border-rule hover:text-paperink',
};
const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2 text-sm' };

/**
 * 纸面按钮：印刷表单里的控件——发丝线描边、方正圆角、无辉光。
 * primary（批注红）只给本页唯一的主行动。
 */
export default function EduButton({
  variant = 'default',
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
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (sfx) playSfx('click');
      onClick?.(e);
    },
    [onClick, sfx],
  );

  return (
    <button
      type="button"
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </button>
  );
}
