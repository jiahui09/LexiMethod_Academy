import type { ReactNode } from 'react';

/**
 * 纸页：辞书版式的世界地。
 * 深色导航壳之外摊开的一册可读之书——纸面内一切由发丝线、墨与两支笔色统治。
 */
export default function EduSheet({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`edu-sheet relative rounded-[4px] ${className}`}>{children}</div>;
}
