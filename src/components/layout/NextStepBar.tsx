import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';

type Target = { label: string; to: string };

/** 只依赖 pathname 的「下一步」推导：不引课程数据，避免把内容分包拉进首屏 */
function derive(pathname: string): { primary: Target; secondary: Target } {
  if (pathname === '/' || pathname === '/methods') {
    return {
      primary: { label: '开始第一课：音形对应', to: '/methods/phonetic-spelling' },
      secondary: { label: '音标实验室', to: '/lab/phonemes' },
    };
  }
  if (pathname.startsWith('/methods/')) {
    return {
      primary: { label: '去音标实验室练听辨', to: '/lab/phonemes' },
      secondary: { label: '课程总目', to: '/methods' },
    };
  }
  if (pathname.startsWith('/lab')) {
    // 次要去向指向「下一台」，不在本台自指
    const nextLab =
      pathname === '/lab/phonemes'
        ? { label: '拼写对应练习', to: '/lab/mapping' }
        : pathname === '/lab/mapping'
          ? { label: '听写训练', to: '/lab/dictation' }
          : { label: '音标发音教学', to: '/lab/phonemes' };
    return { primary: { label: '回课程总目', to: '/methods' }, secondary: nextLab };
  }
  if (pathname === '/settings') {
    return {
      primary: { label: '回课程总目', to: '/methods' },
      secondary: { label: '音标实验室', to: '/lab/phonemes' },
    };
  }
  return { primary: { label: '课程总目', to: '/methods' }, secondary: { label: '音标实验室', to: '/lab/phonemes' } };
}

/**
 * 页面底部的「下一步去哪儿」：每页一个主推进（ink 实底，全页唯一主行动）
 * + 一个相关去向 + 回总目，保证任何一页都有明确去向（The Single Focus Rule）。
 * 指路红只上两处：前缀短线与主行动箭头，不动按钮实底。
 */
export default function NextStepBar() {
  const { pathname } = useLocation();
  const { primary, secondary } = derive(pathname);
  // 主/次已指向总目时不再追加第三枚回总目（同屏同目标只留一枚）
  const dockHasMethods = primary.to === '/methods' || secondary.to === '/methods';

  return (
    <div
      className="paper-chrome mt-8 flex flex-wrap items-center justify-between gap-3 border-t-2 border-ink bg-milk px-4 py-3"
      data-testid="next-step-bar"
      aria-label="下一步引导"
    >
      <span className="flex items-center gap-2 machine text-[12px] text-ink2">
        <span className="h-px w-5 bg-errata" aria-hidden />
        下一步去哪儿
      </span>
      <div className="flex flex-wrap items-center gap-2">
        <Link
          to={primary.to}
          className="inline-flex min-h-[44px] items-center gap-1.5 bg-ink px-4 py-2 font-display text-[13px] font-bold text-milk transition-colors press shadow-hard hover:bg-ink2"
        >
          {primary.label} <ArrowRight size={13} className="text-errata" aria-hidden />
        </Link>
        <Link
          to={secondary.to}
          className="hinge inline-flex min-h-[44px] items-center gap-1.5 border-2 border-ink px-3.5 py-2 text-[13px] text-ink transition-colors hover:bg-under"
        >
          {secondary.label}
        </Link>
        {pathname !== '/methods' && !dockHasMethods && (
          <Link
            to="/methods"
            className="hinge inline-flex min-h-[44px] items-center gap-1.5 px-3 py-2 text-[13px] text-ink2 transition-colors hover:text-ink"
          >
            <BookOpen size={13} aria-hidden /> 课程总目
          </Link>
        )}
      </div>
    </div>
  );
}
