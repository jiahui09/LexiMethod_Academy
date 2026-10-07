import { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import AppShell from '@/components/layout/AppShell';
import PageTransition, { RouteLoading } from '@/components/layout/PageTransition';
import RouteErrorBoundary from '@/components/layout/RouteErrorBoundary';
import NextStepBar from '@/components/layout/NextStepBar';
import ForeEdge from '@/components/layout/ForeEdge';

const Home = lazy(() => import('@/pages/Home'));
const MethodList = lazy(() => import('@/pages/MethodList'));
const MethodCourse = lazy(() => import('@/pages/MethodCourse'));
const PhonemeLab = lazy(() => import('@/pages/PhonemeLab'));
const Practice = lazy(() => import('@/pages/Practice'));
const Analyze = lazy(() => import('@/pages/Analyze'));
const Feynman = lazy(() => import('@/pages/Feynman'));
const Toolbox = lazy(() => import('@/pages/Toolbox'));
const Review = lazy(() => import('@/pages/Review'));
const Stats = lazy(() => import('@/pages/Stats'));
const Settings = lazy(() => import('@/pages/Settings'));
const NotFound = lazy(() => import('@/pages/NotFound'));

/** 路由 → 页面（懒加载，避免首屏包过大） */
function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/methods" element={<MethodList />} />
      <Route path="/methods/:methodId" element={<MethodCourse />} />
      <Route path="/lab" element={<PhonemeLab />} />
      <Route path="/lab/:tab" element={<PhonemeLab />} />
      <Route path="/practice" element={<Practice />} />
      <Route path="/analyze" element={<Analyze />} />
      <Route path="/feynman" element={<Feynman />} />
      <Route path="/toolbox" element={<Toolbox />} />
      <Route path="/review" element={<Review />} />
      <Route path="/stats" element={<Stats />} />
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
        className="paper-chrome sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-[3px] focus:bg-rubric focus:px-4 focus:py-2 focus:text-[#FBF6EC]"
      >
        跳到主要内容
      </a>
      <AppShell>
        {/* 整站一整块连续纸面（阶段三：双地判定退役）；书口脊常驻右缘，正文 flex-1 */}
        <div className="container-page flex items-start gap-6 py-6 md:py-10">
          <div id="main-content" className="min-w-0 flex-1">
            <AnimatePresence mode="wait">
              {/* key 使每次路由切换都整棵重挂：旧页退场动画 + 新页懒加载占位；
                  边界在 Suspense 外侧，懒加载失败与渲染崩溃都会落进降级页 */}
              <RouteErrorBoundary key={location.pathname}>
                <Suspense fallback={<RouteLoading />}>
                  <PageTransition>
                    <Router />
                  </PageTransition>
                </Suspense>
              </RouteErrorBoundary>
            </AnimatePresence>
            {/* 每页底部统一「下一步去哪儿」引导 */}
            <NextStepBar />
          </div>
          {/* 全站书口脊：7 枚功能页切口贴 + 课内步位刻痕（xl+ 常驻；<xl 由页眉/底导/页内贴条降级） */}
          <ForeEdge />
        </div>
      </AppShell>
    </>
  );
}
