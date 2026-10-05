import type { ReactNode } from 'react';

/**
 * 辨析 / 警示框：词典「用法说明」的家。
 * 完整 1px 发丝线盒 + 一档更深的纸色；标题走行内，绝不做眉标。
 */
export default function EduCallout({
  tone = 'note',
  label,
  children,
  className = '',
  'data-testid': testid,
}: {
  tone?: 'note' | 'warn';
  label?: string;
  children: ReactNode;
  className?: string;
  'data-testid'?: string;
}) {
  return (
    <div
      data-testid={testid}
      className={`rounded-[4px] border border-rule bg-bone2/70 px-4 py-3 text-[15px] leading-[1.85] text-paperink ${className}`}
    >
      {label && (
        <b className={`mr-1.5 font-semibold ${tone === 'warn' ? 'text-rubric' : 'text-cobalt'}`}>{label}</b>
      )}
      {children}
    </div>
  );
}
