import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export type Crumb = { label: string; to?: string };

/**
 * 面包屑：回答“我在哪”。
 * 每个页面顶部给出「学习地图 › 当前分区 › 当前页」，末段不可点、用 neon 高亮。
 */
export default function Breadcrumbs({ items, className = '' }: { items: Crumb[]; className?: string }) {
  if (!items.length) return null;
  return (
    <nav
      aria-label="面包屑"
      data-testid="breadcrumbs"
      className={`flex flex-wrap items-center gap-1.5 text-xs text-slate-400 ${className}`}
    >
      {items.map((c, i) => {
        const last = i === items.length - 1;
        return (
          <span key={`${c.label}-${i}`} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight size={11} className="text-slate-400" aria-hidden />}
            {c.to && !last ? (
              <Link to={c.to} className="inline-flex min-h-[44px] items-center transition-colors hover:text-neon">
                {c.label}
              </Link>
            ) : (
              <span aria-current={last ? 'page' : undefined} className={last ? 'text-neon' : undefined}>
                {c.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
