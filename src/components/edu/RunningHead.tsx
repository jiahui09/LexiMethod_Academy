import type { ReactNode } from 'react';

/**
 * 书眉：双细线压顶（词典 running head）。
 * 左载「我是哪一卷、第几义项」，右载本页动作——读者永远知道自己在哪。
 */
export default function EduRunningHead({
  left,
  right,
  className = '',
}: {
  left: ReactNode;
  right?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b-[3px] border-double border-rule px-5 py-3 md:px-8 ${className}`}
    >
      <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-[13px] font-medium text-colophon">{left}</div>
      {right && <div className="flex flex-wrap items-center gap-2">{right}</div>}
    </div>
  );
}
