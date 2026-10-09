import { Link, useLocation } from 'react-router-dom';
import { BookOpen, AudioLines, Settings } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type Item = { to: string; label: string; icon: LucideIcon; end?: boolean; match?: string };

/** 与顶栏主导航同名同序（Single Focus Rule：同目的地），标签 12px 起 */
const ITEMS: Item[] = [
  { to: '/methods', label: '总目', icon: BookOpen },
  { to: '/lab/phonemes', label: '实验室', icon: AudioLines, match: '/lab' },
  { to: '/settings', label: '设置', icon: Settings },
];

/**
 * 移动端底部导航：小屏下最容易丢方向，主目的地常驻、当前项高亮。
 * 桌面端（≥1024px）由顶部导航承担，本条隐藏。
 * 灰场地带（与报头、页脚同灰），满宽铺开不收窄。
 */
export default function BottomNav() {
  const { pathname } = useLocation();
  const active = (item: Item) => {
    const base = item.match ?? item.to;
    return item.end ? pathname === base : pathname === base || pathname.startsWith(base + '/');
  };

  return (
    <nav
      aria-label="底部导航"
      data-testid="bottom-nav"
      className="paper-chrome fixed inset-x-0 bottom-0 z-40 border-t-2 border-ink bg-under lg:hidden"
    >
      <ul className="grid w-full grid-cols-3">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          const on = active(item);
          return (
            <li key={item.to}>
              <Link
                to={item.to}
                aria-current={on ? 'page' : undefined}
                className={`relative flex min-h-[44px] flex-col items-center justify-center gap-0.5 py-2.5 text-xs transition-colors ${
                  on ? 'font-bold text-ink' : 'text-ink2 hover:text-ink'
                }`}
              >
                <Icon size={18} aria-hidden />
                {item.label}
                {/* 形状通道：3px 红标（指路），当前项不只靠颜色 */}
                {on && <span aria-hidden className="absolute inset-x-3 bottom-0 h-[3px] bg-errata" />}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
