import { useMotionTier } from '@/hooks/useMotionTier';

/**
 * 批注章：辞书版式的签名瞬间。
 * 红色双环印章斜落在纸上——朗读在盖、完成也在盖。
 * 全站唯一的编排动作；motion tier 为 off 时静态呈现。
 */
export default function EduStamp({
  label,
  size = 72,
  className = '',
}: {
  label: string;
  size?: number;
  className?: string;
}) {
  const tier = useMotionTier();
  return (
    <span
      aria-hidden
      className={`inline-flex shrink-0 items-center justify-center rounded-full border-[3px] border-double text-center font-serif text-[15px] font-bold leading-tight ${className} ${
        tier === 'off' ? '' : 'edu-stamp'
      }`}
      style={{
        width: size,
        height: size,
        color: '#B3311E',
        borderColor: '#B3311E',
        transform: 'rotate(-8deg)',
        opacity: 0.92,
      }}
    >
      {label}
    </span>
  );
}
