import type { ReactNode } from 'react';

/**
 * 书眉（压膜活页手册）：发丝线压顶 + 可选卡板色 3px 压条（当前章色）。
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
  /** 当前章卡板色（hex），给下缘 3px 压条；缺省为墨色 */
  accent?: string;
  className?: string;
}) {
  return (
    <div className={`border-b border-rule ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 py-3 md:px-8">
        <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-[13px] font-medium text-ink2">{left}</div>
        {right && <div className="flex flex-wrap items-center gap-2">{right}</div>}
      </div>
      <div aria-hidden className="h-[3px]" style={{ background: accent ?? '#17140E' }} />
    </div>
  );
}
