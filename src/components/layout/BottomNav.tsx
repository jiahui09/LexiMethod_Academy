import { NavLink, useLocation } from 'react-router-dom';
import { Map, GraduationCap, AudioLines, Dumbbell, History } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type Item = { to: string; label: string; icon: LucideIcon; end?: boolean };

/** 与顶栏主导航同名同序（Single Focus Rule：五格同目的地），标签统一 12px 起 */
const ITEMS: Item[] = [
  { to: '/', label: '地图', icon: Map, end: true },
  { to: '/methods', label: '课程', icon: GraduationCap },
  { to: '/lab/phonemes', label: '实验室', icon: AudioLines },
  { to: '/practice', label: '训练', icon: Dumbbell },
  { to: '/review', label: '复习', icon: History },
];

/**
 * 移动端底部导航：小屏下最容易丢方向，五个主目的地常驻、当前项高亮。
 * 桌面端（≥1024px）由顶部导航承担，本条隐藏。
 */
export default function BottomNav() {
  const { pathname } = useLocation();
  const active = (to: string, end?: boolean) =>
    end ? pathname === to : pathname === to || pathname.startsWith(to + '/');

  return (
    <nav
      aria-label="底部导航"
      data-testid="bottom-nav"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#0B1020]/95 backdrop-blur-xl lg:hidden"
    >
      <ul className="mx-auto grid max-w-lg grid-cols-5">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          const on = active(item.to, item.end);
          return (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                aria-current={on ? 'page' : undefined}
                className={`flex flex-col items-center gap-0.5 py-2.5 text-xs transition-colors ${
                  on ? 'text-neon' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon size={18} aria-hidden />
                {item.label}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
