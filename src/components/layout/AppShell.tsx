import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
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
  Flame,
  MessagesSquare,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import NeonButton from '@/components/ui/NeonButton';
import BottomNav from '@/components/layout/BottomNav';
import { useProgress } from '@/store/progressStore';
import { playSfx } from '@/hooks/useSfx';
import { useIsMobile } from '@/hooks/useMotionTier';

export type NavItem = { to: string; label: string; icon: LucideIcon; end?: boolean; wideOnly?: boolean };

export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: '学习地图', icon: Map, end: true },
  { to: '/methods', label: '方法课程', icon: GraduationCap },
  { to: '/lab/phonemes', label: '音标实验室', icon: AudioLines },
  { to: '/practice', label: '互动训练', icon: Dumbbell },
  { to: '/analyze', label: '实战演练', icon: Target },
  // 顶部空间有限：费曼关只在 ≥1360px 显示，窄屏由课程页入口 / 页脚进入
  { to: '/feynman', label: '费曼关', icon: MessagesSquare, wideOnly: true },
  { to: '/toolbox', label: '方法工具箱', icon: Wrench },
  { to: '/review', label: '复习中心', icon: History },
  { to: '/stats', label: '统计', icon: BarChart3 },
  { to: '/settings', label: '设置', icon: SettingsIcon },
];

function Logo() {
  return (
    <NavLink to="/" className="group flex items-center gap-2.5" aria-label="LexiMethod Academy 首页">
      <span className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-neon/40 bg-neon/10 shadow-glow-sm">
        <span className="font-display text-sm font-bold text-neon">Lx</span>
        <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-pink shadow-[0_0_8px_#FF4D9D]" />
      </span>
      <span className="hidden flex-col leading-none sm:flex">
        <span className="font-display text-[15px] font-bold tracking-tight text-white group-hover:text-neon transition-colors">
          LexiMethod
        </span>
        <span className="text-[10px] uppercase tracking-[0.28em] text-slate-400">Academy</span>
      </span>
    </NavLink>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  const streak = useProgress((s) => s.streakCurrent);
  const xp = useProgress((s) => s.xp);

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
                  className={`${item.wideOnly ? 'relative hidden min-[1360px]:flex' : 'relative flex'} items-center gap-1.5 rounded-xl px-3 py-2 text-[13px] font-medium transition-all duration-300 ${
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
            <div className="hidden items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs sm:flex">
              <span className="flex items-center gap-1 text-warn" title="连续学习天数">
                <Flame size={13} aria-hidden />
                {streak} 天
              </span>
              <span className="h-3 w-px bg-white/15" />
              <span className="text-neon tabular-nums" data-testid="header-xp">{xp} XP</span>
            </div>
            <NeonButton size="sm" className="hidden sm:inline-flex" onClick={() => playSfx('click')}>
              <NavLink to="/practice" className="flex items-center gap-1.5 text-inherit no-underline">
                开始训练
              </NavLink>
            </NeonButton>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-200 lg:hidden"
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
                {NAV_ITEMS.map((item) => {
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
            <NavLink to="/toolbox" className="hover:text-neon transition-colors">规则速查</NavLink>
            <NavLink to="/feynman" className="hover:text-neon transition-colors">费曼关</NavLink>
            <NavLink to="/review" className="hover:text-neon transition-colors">复习中心</NavLink>
            <NavLink to="/stats" className="hover:text-neon transition-colors">学习统计</NavLink>
            <span className="text-slate-500">纯前端 · 零数据存储</span>
          </div>
        </div>
      </footer>

      {/* 移动端底部导航：小屏常驻，保证随时知道自己在哪、下一站去哪 */}
      <BottomNav />
    </div>
  );
}
