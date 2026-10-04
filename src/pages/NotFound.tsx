import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import Breadcrumbs from '@/components/layout/Breadcrumbs';

export default function NotFound() {
  return (
    <div className="flex min-h-[55vh] flex-col items-center justify-center gap-4 text-center">
      <Breadcrumbs items={[{ label: '学习地图', to: '/' }, { label: '未找到页面' }]} />
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-white/12 bg-white/[0.05] text-neon shadow-glow-sm">
        <Compass size={34} aria-hidden />
      </div>
      <h1 className="font-display text-3xl font-bold text-white">404 · 这条路没有词</h1>
      <p className="max-w-md text-sm text-slate-400">
        页面不存在，或链接已过期。回到学习地图，从 8 个方法模块继续。
      </p>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <Link
          to="/"
          className="rounded-xl border border-neon/50 bg-neon/12 px-5 py-2.5 text-sm font-semibold text-neon transition hover:bg-neon/20 hover:shadow-glow-sm"
        >
          回到学习地图
        </Link>
        <Link
          to="/methods/phonics-syllables"
          className="rounded-xl border border-white/14 px-5 py-2.5 text-sm text-slate-300 transition hover:border-neon/50 hover:text-neon"
        >
          直接进入旗舰课
        </Link>
      </div>
    </div>
  );
}
