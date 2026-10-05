import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Map,
  GraduationCap,
  AudioLines,
  Target,
  Dumbbell,
  Wrench,
  History,
  BarChart3,
  Settings as SettingsIcon,
  Menu,
  X,
  MessagesSquare,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import BottomNav from '@/components/layout/BottomNav';
import { playSfx } from '@/hooks/useSfx';
import { useIsMobile } from '@/hooks/useMotionTier';

export type NavItem = { to: string; label: string; icon: LucideIcon; end?: boolean };

/** 主导航五项（Single Focus Rule：≤5）；与底部导航同名同序，全站目的地叫法一致 */
export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: '地图', icon: Map, end: true },
  { to: '/methods', label: '课程', icon: GraduationCap },
  { to: '/lab/phonemes', label: '实验室', icon: AudioLines },
  { to: '/practice', label: '训练', icon: Dumbbell },
  { to: '/review', label: '复习', icon: History },
];

/** 全部目的地：移动菜单与页脚使用，保证主导航之外的入口仍然一键可达 */
export const ALL_NAV_ITEMS: NavItem[] = [
  ...NAV_ITEMS,
  { to: '/analyze', label: '实战演练', icon: Target },
  { to: '/feynman', label: '费曼关', icon: MessagesSquare },
  { to: '/toolbox', label: '工具箱', icon: Wrench },
  { to: '/stats', label: '统计', icon: BarChart3 },
  { to: '/settings', label: '设置', icon: SettingsIcon },
];

function Logo() {
  return (
    <NavLink to="/" className="group flex min-h-[44px] min-w-[44px] items-center justify-center gap-2.5" aria-label="LexiMethod Academy 首页">
      <span className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-neon/40 bg-neon/10 shadow-glow-sm">
        <span className="font-display text-sm font-bold text-neon">Lx</span>
        <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-pink shadow-[0_0_8px_#FF4D9D]" />
      </span>
      <span className="hidden flex-col leading-none sm:flex">
        <span className="font-display text-[15px] font-bold tracking-tight text-white group-hover:text-neon transition-colors">
          LexiMethod
        </span>
        <span className="text-xs uppercase tracking-[0.28em] text-slate-400">Academy</span>
      </span>
    </NavLink>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();

  useEffect(() => {
    setOpen(false);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [location.pathname]);

  const active = (to: string, end?: boolean) =>
    end ? location.pathname === to : location.pathname === to || location.pathname.startsWith(to + '/');

  return (
    <div className="relative z-10 flex min-h-screen flex-col pb-[66px] lg:pb-0">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0B1020]/70 backdrop-blur-xl">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo />
          </div>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="主导航">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const on = active(item.to, item.end);
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={`relative flex items-center gap-1.5 whitespace-nowrap rounded-xl px-3 py-2 text-[13px] font-medium transition-all duration-300 ${
                    on ? 'text-neon' : 'text-slate-300/75 hover:text-white'
                  }`}
                  aria-current={on ? 'page' : undefined}
                >
                  <Icon size={15} aria-hidden />
                  {item.label}
                  {on && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-neon to-violet shadow-[0_0_8px_#00E5FF]"
                      transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                    />
                  )}
                </NavLink>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            {/* 单一焦点：发光只留给页面自身的主行动点，header 全局入口用次级描边款 */}
            <Link
              to="/practice"
              onClick={() => playSfx('click')}
              className="hidden items-center gap-1.5 rounded-xl border border-neon/40 bg-neon/10 px-4 py-2 text-sm font-medium text-neon transition-all hover:-translate-y-0.5 hover:bg-neon/15 sm:inline-flex"
            >
              开始训练
            </Link>
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-200 lg:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? '关闭菜单' : '打开菜单'}
              aria-expanded={open}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* 移动端菜单 */}
        <AnimatePresence>
          {open && isMobile && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden border-t border-white/10 bg-[#0B1020]/95 backdrop-blur-xl lg:hidden"
              aria-label="移动导航"
            >
              <div className="container-page grid grid-cols-2 gap-2 py-3">
                {ALL_NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const on = active(item.to, item.end);
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      className={`flex items-center gap-2 rounded-xl px-3 py-3 text-sm transition ${
                        on ? 'border border-neon/40 bg-neon/10 text-neon' : 'border border-white/10 bg-white/5 text-slate-300'
                      }`}
                    >
                      <Icon size={16} aria-hidden />
                      {item.label}
                    </NavLink>
                  );
                })}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="mt-16 border-t border-white/10 bg-[#070B18]/70">
        <div className="container-page flex flex-col gap-3 py-8 text-xs text-slate-400 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-1">
            <span className="font-display text-sm font-semibold text-white">LexiMethod Academy</span>
            <span>授人以渔：发音 · 音标拼写 · 自然拼读 · 词根词缀 · 记忆方法</span>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <NavLink to="/analyze" className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center transition-colors hover:text-neon">实战演练</NavLink>
            <NavLink to="/toolbox" className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center transition-colors hover:text-neon">规则速查</NavLink>
            <NavLink to="/feynman" className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center transition-colors hover:text-neon">费曼关</NavLink>
            <NavLink to="/stats" className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center transition-colors hover:text-neon">学习统计</NavLink>
            <NavLink to="/settings" className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center transition-colors hover:text-neon">设置</NavLink>
            <span className="text-slate-400">纯前端 · 零数据存储</span>
          </div>
        </div>
      </footer>

      {/* 移动端底部导航：小屏常驻，保证随时知道自己在哪、下一站去哪 */}
      <BottomNav />
    </div>
  );
}
