import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Map as MapIcon } from 'lucide-react';

type Target = { label: string; to: string };

/** 只依赖 pathname 的“下一步”推导：不引入课程数据，避免把内容分包拉进首屏 */
function derive(pathname: string): { primary: Target; secondary: Target } {
  if (pathname === '/') {
    return {
      primary: { label: '开始第一门课', to: '/methods' },
      secondary: { label: '音标实验室', to: '/lab/phonemes' },
    };
  }
  if (pathname.startsWith('/methods/')) {
    const id = pathname.split('/')[2] ?? '';
    return {
      primary: { label: '用费曼关检验这一课', to: `/feynman?method=${id}` },
      secondary: { label: '方法课程总览', to: '/methods' },
    };
  }
  if (pathname === '/methods') {
    return {
      primary: { label: '开始旗舰课：音节与重音', to: '/methods/phonics-syllables' },
      secondary: { label: '先去看看方法工具箱', to: '/toolbox' },
    };
  }
  if (pathname.startsWith('/lab')) {
    return {
      primary: { label: '去互动训练（11 种题型）', to: '/practice' },
      secondary: { label: '回方法课程', to: '/methods' },
    };
  }
  if (pathname === '/practice') {
    return {
      primary: { label: '复习中心（到期卡片）', to: '/review' },
      secondary: { label: '实战演练', to: '/analyze' },
    };
  }
  if (pathname === '/analyze') {
    return {
      primary: { label: '费曼关：用自己的话讲一遍', to: '/feynman' },
      secondary: { label: '规则速查', to: '/toolbox' },
    };
  }
  if (pathname === '/toolbox') {
    return {
      primary: { label: '去互动训练', to: '/practice' },
      secondary: { label: '方法课程', to: '/methods' },
    };
  }
  if (pathname === '/review') {
    return {
      primary: { label: '继续互动训练', to: '/practice' },
      secondary: { label: '学习统计', to: '/stats' },
    };
  }
  if (pathname === '/stats') {
    return {
      primary: { label: '回到学习地图', to: '/' },
      secondary: { label: '设置', to: '/settings' },
    };
  }
  if (pathname === '/settings') {
    return {
      primary: { label: '回到学习地图', to: '/' },
      secondary: { label: '学习统计', to: '/stats' },
    };
  }
  if (pathname === '/feynman') {
    return {
      primary: { label: '复习中心', to: '/review' },
      secondary: { label: '方法课程', to: '/methods' },
    };
  }
  return { primary: { label: '学习地图', to: '/' }, secondary: { label: '方法课程', to: '/methods' } };
}

/**
 * 页面底部统一的「下一步去哪儿」引导条：
 * 一个主推进 + 一个相关练习 + 回学习地图，保证每页都有明确去向。
 */
export default function NextStepBar() {
  const { pathname } = useLocation();
  const { primary, secondary } = derive(pathname);

  return (
    <div
      className="glass mt-8 flex flex-wrap items-center justify-between gap-3 px-4 py-3"
      data-testid="next-step-bar"
      aria-label="下一步引导"
    >
      <span className="flex items-center gap-2 text-xs text-slate-400">
        <span className="h-px w-5 bg-neon/60" aria-hidden />
        下一步去哪儿？
      </span>
      <div className="flex flex-wrap items-center gap-2">
        <Link
          to={primary.to}
          className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-neon/40 bg-neon/10 px-3.5 py-2 text-[13px] font-medium text-neon transition-all hover:-translate-y-0.5 hover:bg-neon/15"
        >
          {primary.label} <ArrowRight size={13} aria-hidden />
        </Link>
        <Link
          to={secondary.to}
          className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-white/12 bg-white/5 px-3.5 py-2 text-[13px] text-slate-300 transition hover:border-white/30 hover:text-white"
        >
          {secondary.label}
        </Link>
        <Link
          to="/"
          className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl px-3 py-2 text-[13px] text-slate-400 transition hover:text-white"
        >
          <MapIcon size={13} aria-hidden /> 回学习地图
        </Link>
      </div>
    </div>
  );
}
