import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, AudioLines, Settings as SettingsIcon, Menu, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import BottomNav from '@/components/layout/BottomNav';
import { playSfx } from '@/hooks/useSfx';
import { useIsMobile } from '@/hooks/useMotionTier';

export type NavItem = { to: string; label: string; icon: LucideIcon; end?: boolean };

/** 主导航（削减后全站只剩课程 + 实验室两块内容，设置作次级入口）；与底部导航同名同序 */
export const NAV_ITEMS: NavItem[] = [
  { to: '/methods', label: '课程', icon: GraduationCap },
  { to: '/lab/phonemes', label: '实验室', icon: AudioLines },
];

/** 全部目的地：移动菜单与页脚使用，保证主导航之外的入口仍然一键可达 */
export const ALL_NAV_ITEMS: NavItem[] = [...NAV_ITEMS, { to: '/settings', label: '设置', icon: SettingsIcon }];

function Logo() {
  return (
    <NavLink to="/methods" className="group flex min-h-[44px] min-w-[44px] items-center justify-center gap-2.5" aria-label="LexiMethod Academy 首页">
      <span className="relative flex h-9 w-9 items-center justify-center rounded-[2px] border border-rule bg-bone2">
        <span className="font-display text-sm font-bold text-rubric">Lx</span>
        <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-rubric" />
      </span>
      <span className="hidden flex-col leading-none sm:flex">
        <span className="font-display text-[15px] font-bold tracking-tight text-paperink group-hover:text-rubric transition-colors">
          LexiMethod
        </span>
        <span className="text-xs uppercase tracking-[0.28em] text-colophon">Academy</span>
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
      {/* 顶栏书眉：骨白纸地 + 双细线压顶，当前项批注红 3px 下划线（辞书版式 running head） */}
      <header className="paper-chrome sticky top-0 z-50 border-b-[3px] border-double border-rule bg-bone">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo />
          </div>

          <nav className="hidden h-16 items-stretch gap-1 lg:flex" aria-label="主导航">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const on = active(item.to, item.end);
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={`relative flex h-full items-center gap-1.5 whitespace-nowrap px-3 text-[13px] transition-colors ${
                    on ? 'font-bold text-paperink' : 'text-colophon hover:text-paperink'
                  }`}
                  aria-current={on ? 'page' : undefined}
                >
                  <Icon size={15} aria-hidden />
                  {item.label}
                  {on && <span aria-hidden className="absolute inset-x-0 bottom-0 h-[3px] bg-rubric" />}
                </NavLink>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            {/* 纸面主行动：批注红实底米白字（Two Pens：书眉右侧唯一主动作） */}
            <Link
              to="/methods"
              onClick={() => playSfx('click')}
              className="hidden min-h-[44px] items-center gap-1.5 rounded-[3px] border border-rubric bg-rubric px-4 py-2 text-sm font-medium text-[#FBF6EC] transition-colors hover:border-[#9C2919] hover:bg-[#9C2919] active:translate-y-px sm:inline-flex"
            >
              开始学习
            </Link>
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-[3px] border border-paperink/60 bg-transparent text-paperink transition-colors hover:bg-paperink hover:text-bone lg:hidden"
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
              className="overflow-hidden border-t border-rule bg-bone lg:hidden"
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
                      className={`flex min-h-[44px] items-center gap-2 rounded-[3px] border-b-[3px] px-3 py-3 text-sm transition ${
                        on
                          ? 'border-b-rubric bg-bone2 font-bold text-paperink'
                          : 'border-b-transparent text-colophon hover:text-paperink'
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

      {/* 页脚 colophon：细线压顶、衬线刊记、结构蓝链接 */}
      <footer className="paper-chrome mt-16 border-t border-rule bg-bone">
        <div className="container-page flex flex-col gap-3 py-8 text-xs text-colophon md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-1">
            <span className="font-serif text-sm font-semibold text-paperink">LexiMethod Academy</span>
            <span>授人以渔：发音 · 音标拼写 · 自然拼读 · 词根词缀 · 记忆方法</span>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <NavLink to="/methods" className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center text-cobalt transition-colors hover:text-paperink">方法课程</NavLink>
            <NavLink to="/lab/phonemes" className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center text-cobalt transition-colors hover:text-paperink">音标实验室</NavLink>
            <NavLink to="/settings" className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center text-cobalt transition-colors hover:text-paperink">设置</NavLink>
            <span className="text-colophon">纯前端 · 零数据存储</span>
          </div>
        </div>
      </footer>

      {/* 移动端底部导航：小屏常驻，保证随时知道自己在哪、下一站去哪 */}
      <BottomNav />
    </div>
  );
}
