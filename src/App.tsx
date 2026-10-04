import { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import AppShell from '@/components/layout/AppShell';
import PageTransition, { RouteLoading } from '@/components/layout/PageTransition';
import NextStepBar from '@/components/layout/NextStepBar';
import Backdrop from '@/components/fx/Backdrop';
import ParticleField from '@/components/fx/ParticleField';

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
      <Backdrop />
      <ParticleField />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-neon focus:px-4 focus:py-2 focus:text-[#04121c]"
      >
        跳到主要内容
      </a>
      <AppShell>
        <div id="main-content" className="container-page py-6 md:py-10">
          <AnimatePresence mode="wait">
            {/* key 使每次路由切换都整棵重挂：旧页退场动画 + 新页懒加载占位 */}
            <Suspense key={location.pathname} fallback={<RouteLoading />}>
              <PageTransition>
                <Router />
              </PageTransition>
            </Suspense>
          </AnimatePresence>
          {/* 每页底部统一「下一步去哪儿」引导 */}
          <NextStepBar />
        </div>
      </AppShell>
    </>
  );
}
