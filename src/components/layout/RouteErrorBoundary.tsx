import { Component, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { RotateCcw, RefreshCw, Map } from 'lucide-react';
import NeonButton from '@/components/ui/NeonButton';

type Props = { children: ReactNode };
type State = { error: Error | null };

/**
 * 路由级错误边界：懒加载失败 / 渲染崩溃 → 同风格降级页，绝不白屏。
 * 由调用方以 key={pathname} 挂载：切换路由即自动复位。
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
          className="glass mx-auto flex max-w-xl flex-col items-center gap-4 rounded-3xl p-8 text-center"
        >
          <div className="text-xs font-bold uppercase tracking-widest text-warn">Route Error</div>
          <h1 className="text-2xl font-bold text-white">这一页没能打开</h1>
          <p className="max-w-md text-sm leading-relaxed text-slate-300">
            学习内容渲染时出了点问题。你的进度只存在内存里，刷新即回到学习地图，不必担心数据。
          </p>
          <code className="max-w-full overflow-x-auto rounded-lg border border-white/12 bg-white/[0.05] px-3 py-1.5 text-xs text-slate-400">
            {this.state.error.message || 'Unknown error'}
          </code>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <NeonButton onClick={() => this.setState({ error: null })}>
              <RotateCcw size={15} aria-hidden /> 重试
            </NeonButton>
            <NeonButton variant="ghost" onClick={() => window.location.reload()}>
              <RefreshCw size={15} aria-hidden /> 刷新页面
            </NeonButton>
            <Link
              to="/"
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-white/14 px-5 py-2 text-sm font-medium text-slate-300 transition hover:border-neon/45 hover:text-white"
            >
              <Map size={15} aria-hidden /> 回学习地图
            </Link>
          </div>
        </section>
      );
    }
    return this.props.children;
  }
}
