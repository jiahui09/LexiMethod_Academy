import type { ReactNode } from 'react';

/**
 * 栏外边注（apparatus）：老师写在页边的批注——术语、出处、提示。
 * 只用一条发丝线与正文分隔，不装盒。
 */
export default function EduNote({ label, children }: { label?: string; children: ReactNode }) {
  return (
    <aside className="border-t border-rule pt-2.5 text-[13px] leading-[1.85] text-colophon">
      {label && <b className="mr-1.5 font-semibold text-cobalt">{label}</b>}
      {children}
    </aside>
  );
}
