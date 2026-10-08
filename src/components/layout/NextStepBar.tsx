import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, GraduationCap } from 'lucide-react';

type Target = { label: string; to: string };

/** 只依赖 pathname 的“下一步”推导：不引入课程数据，避免把内容分包拉进首屏 */
function derive(pathname: string): { primary: Target; secondary: Target } {
  if (pathname === '/' || pathname === '/methods') {
    return {
      primary: { label: '开始旗舰课：音节与重音', to: '/methods/phonics-syllables' },
      secondary: { label: '音标实验室', to: '/lab/phonemes' },
    };
  }
  if (pathname.startsWith('/methods/')) {
    return {
      primary: { label: '去音标实验室练听辨', to: '/lab/phonemes' },
      secondary: { label: '方法课程总览', to: '/methods' },
    };
  }
  if (pathname.startsWith('/lab')) {
    return {
      primary: { label: '回方法课程', to: '/methods' },
      secondary: { label: '音标发音教学', to: '/lab/phonemes' },
    };
  }
  if (pathname === '/settings') {
    return {
      primary: { label: '回到方法课程', to: '/methods' },
      secondary: { label: '音标实验室', to: '/lab/phonemes' },
    };
  }
  return { primary: { label: '方法课程', to: '/methods' }, secondary: { label: '音标实验室', to: '/lab/phonemes' } };
}

/**
 * 页面底部统一的「下一步去哪儿」引导条：
 * 一个主推进 + 一个相关去向 + 回课程目录，保证每页都有明确去向。
 */
export default function NextStepBar() {
  const { pathname } = useLocation();
  const { primary, secondary } = derive(pathname);

  return (
    <div
      className="paper-chrome mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-rule bg-bone px-4 py-3"
      data-testid="next-step-bar"
      aria-label="下一步引导"
    >
      <span className="flex items-center gap-2 text-xs text-colophon">
        <span className="h-px w-5 bg-rule" aria-hidden />
        下一步去哪儿？
      </span>
      <div className="flex flex-wrap items-center gap-2">
        <Link
          to={primary.to}
          className="inline-flex min-h-[44px] items-center gap-1.5 rounded-[3px] border border-rubric bg-rubric px-3.5 py-2 text-[13px] font-medium text-[#FBF6EC] transition-colors hover:border-[#9C2919] hover:bg-[#9C2919] active:translate-y-px"
        >
          {primary.label} <ArrowRight size={13} aria-hidden />
        </Link>
        <Link
          to={secondary.to}
          className="inline-flex min-h-[44px] items-center gap-1.5 rounded-[3px] border border-rule px-3.5 py-2 text-[13px] text-cobalt transition-colors hover:border-paperink hover:text-paperink"
        >
          {secondary.label}
        </Link>
        {pathname !== '/methods' && (
          <Link
            to="/methods"
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-[3px] px-3 py-2 text-[13px] text-cobalt transition-colors hover:text-paperink"
          >
            <GraduationCap size={13} aria-hidden /> 课程目录
          </Link>
        )}
      </div>
    </div>
  );
}
