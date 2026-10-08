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
  'hinge inline-flex items-center justify-center gap-2 rounded-[3px] border font-medium min-h-[44px] disabled:cursor-not-allowed disabled:opacity-45 active:translate-y-px';
const variants = {
  default: 'border-ink/60 bg-transparent text-ink hover:bg-ink hover:text-milk',
  primary: 'border-ink bg-ink text-milk hover:bg-ink2 hover:border-ink2',
  ghost: 'border-transparent bg-transparent text-ink2 hover:border-rule hover:text-ink',
};
const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2 text-sm' };

/**
 * 手册按钮：印刷表单里的控件——方正圆角、墨线描边、无辉光。
 * primary 是墨色实底（本页唯一主行动）；朱红不参与按钮。
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
