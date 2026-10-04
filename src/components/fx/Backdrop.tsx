import { useMotionTier } from '@/hooks/useMotionTier';

/** 网格 + 噪点 + 极光光斑 三层静态背景 */
export default function Backdrop() {
  const tier = useMotionTier();
  const anim = tier === 'full' ? 'animate-aurora' : '';
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* 极光光斑 */}
      <div
        className={`aurora-blob absolute -left-[18%] -top-[12%] h-[52vh] w-[52vw] rounded-full ${anim}`}
        style={{ background: 'radial-gradient(circle, rgba(124,77,255,0.55), transparent 65%)' }}
      />
      <div
        className={`aurora-blob absolute -right-[15%] top-[8%] h-[46vh] w-[44vw] rounded-full ${anim}`}
        style={{ background: 'radial-gradient(circle, rgba(0,229,255,0.42), transparent 65%)', animationDelay: '-6s' }}
      />
      <div
        className={`aurora-blob absolute bottom-[-18%] left-[30%] h-[46vh] w-[52vw] rounded-full ${anim}`}
        style={{ background: 'radial-gradient(circle, rgba(255,77,157,0.3), transparent 65%)', animationDelay: '-12s' }}
      />
      {/* 网格 */}
      <div className="grid-layer absolute inset-0" />
      {/* 噪点 */}
      <div className="noise-layer absolute inset-0" />
      {/* 顶部渐隐，保证导航可读 */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#0B1020]/80 to-transparent" />
    </div>
  );
}
