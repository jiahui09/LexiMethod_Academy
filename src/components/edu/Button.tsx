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
  'hinge inline-flex items-center justify-center gap-2 border-2 font-medium min-h-[44px] disabled:cursor-not-allowed disabled:opacity-45';
const variants = {
  default: 'border-ink bg-transparent text-ink hover:bg-ink hover:text-milk',
  primary: 'border-ink bg-ink text-milk hover:bg-ink2 hover:border-ink2 shadow-hard press',
  ghost: 'border-transparent bg-transparent text-ink2 hover:border-rule hover:text-ink',
};
const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2 text-sm' };

/**
 * 瑞士×狂野按钮：方正无圆角、2px 实黑描边；primary 带硬偏移影并可按压
 * （hover 抬起 / active 压回，90ms 硬跳）；每页唯一主行动才是 primary，朱红不作按钮底。
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
