/**
 * 页面转场：压膜活页手册不做页面进入编排（Hinge Step Rule：无淡入无位移）。
 * 路由切换整棵重挂、直接呈现；动效只留给状态反馈与掀角。
 */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

/** 路由懒加载占位：发丝线方框 + 机器嗓音计数文案（状态动效可用，不缓动淡入） */
export function RouteLoading() {
  return (
    <div
      className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-ink2"
      role="status"
      aria-live="polite"
    >
      <div className="hinge relative h-10 w-10 animate-spin rounded-[3px] border-2 border-rule border-t-ink" />
      <p className="machine text-[13px]">正在翻开页面…</p>
    </div>
  );
}
