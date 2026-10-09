import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, AudioLines, Settings as SettingsIcon, Menu, X, ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import BottomNav from '@/components/layout/BottomNav';
import { playSfx } from '@/hooks/useSfx';

export type NavItem = { to: string; label: string; icon: LucideIcon; end?: boolean; match?: string };

/** 主导航（全站两块内容：课程 + 实验室；设置作次级入口）；与底部导航同名同序。
 *  match 用于「实验室」整卷高亮（/lab 下三个卷都算当前）。 */
export const NAV_ITEMS: NavItem[] = [
  { to: '/methods', label: '课程总目', icon: BookOpen },
  { to: '/lab/phonemes', label: '音标实验室', icon: AudioLines, match: '/lab' },
];

/** 全部目的地：移动菜单与页脚使用 */
export const ALL_NAV_ITEMS: NavItem[] = [...NAV_ITEMS, { to: '/settings', label: '设置', icon: SettingsIcon }];

/** 字标印记：信号红方块反白 Lx（进门第一眼的指路红标，字级 ≥19px 特粗走大字级 3:1） */
function Logo() {
  return (
    <Link
      to="/methods"
      className="group flex min-h-[44px] min-w-[44px] items-center justify-center gap-2.5"
      aria-label="LexiMethod Academy 课程总目"
    >
      <span className="flex h-10 w-10 items-center justify-center bg-errata shadow-hard">
        <span className="font-display text-[19px] font-extrabold leading-none text-milk">Lx</span>
      </span>
      <span className="hidden flex-col leading-tight sm:flex">
        <span className="font-display text-[15px] font-bold text-ink underline decoration-transparent decoration-2 underline-offset-4 transition-colors group-hover:decoration-ink">
          LexiMethod
        </span>
        <span className="machine text-[12px] uppercase tracking-[0.24em] text-ink2">Academy</span>
      </span>
    </Link>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [location.pathname]);

  const active = (item: NavItem) => {
    const base = item.match ?? item.to;
    return item.end ? location.pathname === base : location.pathname === base || location.pathname.startsWith(base + '/');
  };

  return (
    <div className="relative z-10 flex min-h-screen flex-col pb-[66px] lg:pb-0">
      {/* 报头：灰场地带（图底分层）+ 下缘 2px 实黑线；当前项 3px 红标（指路） */}
      <header className="paper-chrome sticky top-0 z-50 border-b-2 border-ink bg-under">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo />
          </div>

          {/* 桌面主导航：纯字体（瑞士报头不用图标），icon 留给移动菜单与底导 */}
          <nav className="hidden h-16 items-stretch gap-1 lg:flex" aria-label="主导航">
            {NAV_ITEMS.map((item) => {
              const on = active(item);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`relative flex h-full items-center whitespace-nowrap px-3 font-display text-sm font-bold transition-colors ${
                    on ? 'text-ink' : 'text-ink2 hover:text-ink'
                  }`}
                  aria-current={on ? 'page' : undefined}
                >
                  {item.label}
                  {on && <span aria-hidden className="absolute inset-x-0 bottom-0 h-[3px] bg-errata" />}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            {/* 每屏唯一主行动（报头右）：ink 实底 milk 字，红只上箭头（指路），不充当按钮底 */}
            <Link
              to="/methods"
              onClick={() => playSfx('click')}
              className="hidden min-h-[44px] items-center gap-1.5 bg-ink px-4 py-2 font-display text-sm font-bold text-milk transition-colors press shadow-hard hover:bg-ink2 sm:inline-flex"
            >
              继续学习
              <ArrowRight size={15} className="text-errata" aria-hidden />
            </Link>
            <button
              type="button"
              className="press shadow-hard flex h-11 w-11 items-center justify-center border-2 border-ink bg-transparent text-ink transition-colors hover:bg-ink hover:text-milk lg:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? '关闭菜单' : '打开菜单'}
              aria-expanded={open}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* 移动端菜单：铰链步进（无淡入，世界唯一过渡）；下缘 2px 实黑收口 */}
        {open && (
          <nav className="hinge border-b-2 border-ink bg-under lg:hidden" aria-label="移动导航">
            <div className="container-page grid grid-cols-2 gap-2 py-3">
              {ALL_NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const on = active(item);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    aria-current={on ? 'page' : undefined}
                    className={`hinge flex min-h-[44px] items-center gap-2 border-b-[3px] px-3 py-3 font-display text-sm font-bold ${
                      on ? 'border-b-errata bg-milk text-ink' : 'border-b-transparent text-ink2 hover:text-ink'
                    }`}
                  >
                    <Icon size={16} aria-hidden />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>
        )}
      </header>

      <main className="flex-1">{children}</main>

      {/* 页脚：灰场收尾（与报头同灰）+ 2px 实黑压顶，机器嗓音刊记 */}
      <footer className="paper-chrome mt-16 border-t-2 border-ink bg-under">
        <div className="container-page flex flex-col gap-3 py-8 text-sm text-ink2 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-1">
            <span className="font-display text-[32px] font-extrabold leading-none tracking-[-0.02em] text-ink md:text-[48px]">
              LEXIMETHOD
            </span>
            <span className="font-display text-sm font-bold text-ink">LexiMethod Academy · 英语词汇方法课</span>
            <span className="text-[13px]">授人以渔：音形对应 · 拼读拆词 · 语境存入 · 间隔复习 · 主动输出</span>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/methods" className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center text-ink2 underline decoration-rule underline-offset-4 transition-colors hover:text-ink hover:decoration-ink">课程总目</Link>
            <Link to="/lab/phonemes" className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center text-ink2 underline decoration-rule underline-offset-4 transition-colors hover:text-ink hover:decoration-ink">音标实验室</Link>
            <Link to="/settings" className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center text-ink2 underline decoration-rule underline-offset-4 transition-colors hover:text-ink hover:decoration-ink">设置</Link>
            <span className="machine text-[12px] text-ink2">纯前端 · 零数据存储</span>
          </div>
        </div>
      </footer>

      {/* 移动端底部导航：小屏常驻方向感 */}
      <BottomNav />
    </div>
  );
}
