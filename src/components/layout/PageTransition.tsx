import { motion } from 'framer-motion';
import { useMotionTier } from '@/hooks/useMotionTier';

/** 页面转场：淡入 + 上移 + 轻微模糊 */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const tier = useMotionTier();
  if (tier === 'off') return <>{children}</>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -12, filter: 'blur(6px)' }}
      transition={{ duration: tier === 'light' ? 0.25 : 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/**
 * 路由懒加载占位：骨白纸地上的单一转轮（批注红弧 + 发丝线弧，内圈结构蓝），
 * 无深色分支、无霓虹——全站只此一枚浅色转轮。
 */
export function RouteLoading() {
  return (
    <div
      className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-colophon"
      role="status"
      aria-live="polite"
    >
      <div className="relative h-14 w-14">
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-rubric border-r-rule"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-2 rounded-full border-2 border-transparent border-b-cobalt"
          animate={{ rotate: -360 }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
        />
      </div>
      <p className="text-sm text-colophon">正在载入课程…</p>
    </div>
  );
}
