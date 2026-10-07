import type { ReactNode } from 'react';

/**
 * 纸页：辞书版式的世界地。
 * 整站唯一连续纸面——零抬升，纸页即地——纸面内一切由发丝线、墨与两支笔色统治。
 */
export default function EduSheet({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`edu-sheet relative ${className}`}>{children}</div>;
}
