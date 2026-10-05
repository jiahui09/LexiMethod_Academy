import { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import AppShell from '@/components/layout/AppShell';
import PageTransition, { RouteLoading } from '@/components/layout/PageTransition';
import RouteErrorBoundary from '@/components/layout/RouteErrorBoundary';
import NextStepBar from '@/components/layout/NextStepBar';

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

/**
 * 纸面地判定（辞书版式）：全站地面是骨白纸，首页 / 方法列表 / 课程页 / 音标实验室
 * 落在纸上；其余路由（训练 / 实战演练 / 费曼关 / 工具箱 / 复习 / 统计 / 设置 / 404）
 * 是遗留深色内容，过渡期整块嵌进纸面壳（阶段三再迁移），见 .impeccable/surfaces。
 */
function hasPaperGround(pathname: string) {
  return (
    pathname === '/' ||
    pathname === '/methods' ||
    pathname.startsWith('/lab') ||
    (/^\/methods\/[^/]+$/.test(pathname) && !pathname.endsWith('/compare'))
  );
}

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
  const paperGround = hasPaperGround(location.pathname);

  return (
    <>
      <a
        href="#main-content"
        className="paper-chrome sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-[3px] focus:bg-rubric focus:px-4 focus:py-2 focus:text-[#FBF6EC]"
      >
        跳到主要内容
      </a>
      <AppShell>
        {/* 遗留功能页没有自己的深色地：过渡期由壳给一整块深色内容地嵌进纸面（阶段三迁移） */}
        <div
          id="main-content"
          className={`container-page py-6 md:py-10 ${paperGround ? '' : 'bg-abyss text-slate-200'}`}
        >
          <AnimatePresence mode="wait">
            {/* key 使每次路由切换都整棵重挂：旧页退场动画 + 新页懒加载占位；
                边界在 Suspense 外侧，懒加载失败与渲染崩溃都会落进降级页 */}
            <RouteErrorBoundary key={location.pathname}>
              <Suspense fallback={<RouteLoading dark={!paperGround} />}>
                <PageTransition>
                  <Router />
                </PageTransition>
              </Suspense>
            </RouteErrorBoundary>
          </AnimatePresence>
          {/* 每页底部统一「下一步去哪儿」引导 */}
          <NextStepBar />
        </div>
      </AppShell>
    </>
  );
}
