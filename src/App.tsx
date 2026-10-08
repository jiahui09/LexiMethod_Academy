import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AppShell from '@/components/layout/AppShell';
import PageTransition, { RouteLoading } from '@/components/layout/PageTransition';
import RouteErrorBoundary from '@/components/layout/RouteErrorBoundary';
import NextStepBar from '@/components/layout/NextStepBar';
import ForeEdge from '@/components/layout/ForeEdge';

const MethodList = lazy(() => import('@/pages/MethodList'));
const MethodCourse = lazy(() => import('@/pages/MethodCourse'));
const PhonemeLab = lazy(() => import('@/pages/PhonemeLab'));
const Settings = lazy(() => import('@/pages/Settings'));
const NotFound = lazy(() => import('@/pages/NotFound'));

/** 路由 → 页面（懒加载，避免首屏包过大）：全站只保留课程与音标实验室两块内容 */
function Router() {
  return (
    <Routes>
      {/* 站点削减后无独立首页：根路径直接落进课程目录 */}
      <Route path="/" element={<Navigate to="/methods" replace />} />
      <Route path="/methods" element={<MethodList />} />
      <Route path="/methods/:methodId" element={<MethodCourse />} />
      <Route path="/lab" element={<PhonemeLab />} />
      <Route path="/lab/:tab" element={<PhonemeLab />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  const location = useLocation();

  return (
    <>
      <a
        href="#main-content"
        className="paper-chrome sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-[3px] focus:bg-ink focus:px-4 focus:py-2 focus:text-milk"
      >
        跳到主要内容
      </a>
      <AppShell>
        {/* 一整块连续压膜地（压膜活页手册）：书口阶梯轨常驻右缘，正文 flex-1 */}
        <div className="container-page flex items-start gap-6 py-6 md:py-10">
          <div id="main-content" className="min-w-0 flex-1">
            {/* key 使每次路由切换整棵重挂；世界无页面进入动效（Hinge Step Rule），直接呈现 */}
            <RouteErrorBoundary key={location.pathname}>
              <Suspense fallback={<RouteLoading />}>
                <PageTransition>
                  <Router />
                </PageTransition>
              </Suspense>
            </RouteErrorBoundary>
            {/* 每页底部统一「下一步去哪儿」引导 */}
            <NextStepBar />
          </div>
          {/* 全站书口阶梯轨：功能页贴 + 8 门课阶梯贴（xl+ 常驻） */}
          <ForeEdge />
        </div>
      </AppShell>
    </>
  );
}
