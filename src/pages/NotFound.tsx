import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import Breadcrumbs from '@/components/layout/Breadcrumbs';

export default function NotFound() {
  return (
    <div className="flex min-h-[55vh] flex-col items-center justify-center gap-4 text-center">
      <Breadcrumbs tone="paper" items={[{ label: '学习地图', to: '/' }, { label: '未找到页面' }]} />
      <div className="flex h-20 w-20 items-center justify-center rounded-[3px] border border-rule bg-bone2 text-rubric">
        <Compass size={34} aria-hidden />
      </div>
      <h1 className="text-3xl font-bold text-paperink">404 · 这条路没有词</h1>
      <p className="max-w-md text-sm text-colophon">
        页面不存在，或链接已过期。回到学习地图，从 8 个方法模块继续。
      </p>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <Link
          to="/"
          className="inline-flex min-h-[44px] items-center rounded-[3px] border border-rubric bg-rubric px-5 py-2.5 text-sm font-semibold text-bone transition-colors hover:border-[#9C2919] hover:bg-[#9C2919]"
        >
          回到学习地图
        </Link>
        <Link
          to="/methods/phonics-syllables"
          className="inline-flex min-h-[44px] items-center rounded-[3px] border border-rule px-5 py-2.5 text-sm text-paperink transition-colors hover:bg-bone2"
        >
          直接进入旗舰课
        </Link>
      </div>
    </div>
  );
}
