import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export type Crumb = { label: string; to?: string };

/**
 * 面包屑：回答“我在哪”。
 * 每个页面顶部给出「学习地图 › 当前分区 › 当前页」，末段不可点亮。
 * tone="paper" 服务辞书版式纸面（教程面 / 音标实验室）；默认 dark 服务遗留壳路由。
 */
export default function Breadcrumbs({
  items,
  className = '',
  tone = 'dark',
}: {
  items: Crumb[];
  className?: string;
  tone?: 'dark' | 'paper';
}) {
  if (!items.length) return null;
  const paper = tone === 'paper';
  return (
    <nav
      aria-label="面包屑"
      data-testid="breadcrumbs"
      className={`flex flex-wrap items-center gap-1.5 text-xs ${paper ? 'text-colophon' : 'text-slate-400'} ${className}`}
    >
      {items.map((c, i) => {
        const last = i === items.length - 1;
        return (
          <span key={`${c.label}-${i}`} className="flex items-center gap-1.5">
            {i > 0 && (
              <ChevronRight size={11} className={paper ? 'text-colophon/60' : 'text-slate-400'} aria-hidden />
            )}
            {c.to && !last ? (
              <Link
                to={c.to}
                className={`inline-flex min-h-[44px] items-center transition-colors ${
                  paper ? 'hover:text-cobalt' : 'hover:text-neon'
                }`}
              >
                {c.label}
              </Link>
            ) : (
              <span
                aria-current={last ? 'page' : undefined}
                className={last ? (paper ? 'text-rubric' : 'text-neon') : undefined}
              >
                {c.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
