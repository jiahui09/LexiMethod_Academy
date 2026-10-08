import { Component, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { RotateCcw, RefreshCw, GraduationCap } from 'lucide-react';
import EduButton from '@/components/edu/Button';

type Props = { children: ReactNode };
type State = { error: Error | null };

/**
 * 路由级错误边界：懒加载失败 / 渲染崩溃 → 同风格降级页，绝不白屏。
 * 由调用方以 key={pathname} 挂载：切换路由即自动复位。
 * 降级页是纸面纸片（不透底），无论落在纸面地还是遗留深色地都可读。
 */
export default class RouteErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error) {
    // 保留给控制台排障；不上报（零追踪约束）
    console.error('[RouteErrorBoundary]', error);
  }

  render() {
    if (this.state.error) {
      return (
        <section
          role="alert"
          className="paper-chrome mx-auto flex max-w-xl flex-col items-center gap-4 rounded-[4px] border border-rule bg-bone p-8 text-center"
        >
          <h1 className="text-2xl font-bold text-paperink">这一页没能打开</h1>
          <p className="max-w-md text-sm leading-relaxed text-colophon">
            学习内容渲染时出了点问题。你的进度只存在内存里，刷新即回到课程，不必担心数据。
          </p>
          <code className="max-w-full overflow-x-auto rounded-[3px] border border-rule bg-bone2 px-3 py-1.5 text-xs text-colophon">
            {this.state.error.message || 'Unknown error'}
          </code>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <EduButton variant="primary" onClick={() => this.setState({ error: null })}>
              <RotateCcw size={15} aria-hidden /> 重试
            </EduButton>
            <EduButton variant="ghost" onClick={() => window.location.reload()}>
              <RefreshCw size={15} aria-hidden /> 刷新页面
            </EduButton>
            <Link
              to="/methods"
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-[3px] border border-paperink/60 px-5 py-2 text-sm font-medium text-paperink transition-colors hover:bg-paperink hover:text-bone"
            >
              <GraduationCap size={15} aria-hidden /> 回课程
            </Link>
          </div>
        </section>
      );
    }
    return this.props.children;
  }
}
