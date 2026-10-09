import type { ReactNode } from 'react';

/**
 * 章节带（瑞士报头行）：发丝线压顶 + 3px 细条（缺省信号红＝指路索引，课程页传段色）。
 * 左载「我在全书哪里」，右载机器嗓音步数——读者永远知道自己在哪。
 */
export default function EduRunningHead({
  left,
  right,
  accent,
  className = '',
}: {
  left: ReactNode;
  right?: ReactNode;
  /** 当前段导色（hex），给下缘 3px 细条；缺省为信号红（指路索引） */
  accent?: string;
  className?: string;
}) {
  return (
    <div className={`border-b border-rule ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 py-3 md:px-8">
        <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-[13px] font-medium text-ink2">{left}</div>
        {right && <div className="flex flex-wrap items-center gap-2">{right}</div>}
      </div>
      <div aria-hidden className="h-[3px]" style={{ background: accent ?? '#E34234' }} />
    </div>
  );
}
