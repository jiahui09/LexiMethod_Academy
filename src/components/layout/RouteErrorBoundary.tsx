import { Component, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { RotateCcw, RefreshCw, BookOpen } from 'lucide-react';

type Props = { children: ReactNode };
type State = { error: Error | null };

/**
 * 路由级错误边界：懒加载失败 / 渲染崩溃 → 勘误页降级，绝不白屏。
 * 由调用方以 key={pathname} 挂载：切换路由即自动复位。
 * 错误态用朱红勘误（勘误语义保留）；行动按钮仍是 ink 主钮。齐左排，不居中。
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
        <section role="alert" className="container-page flex min-h-[60vh] flex-col items-start justify-center gap-4 py-16">
          <div className="w-full max-w-2xl border-2 border-errata bg-leaf p-6 md:p-8">
            <h1 className="font-display text-2xl font-bold text-ink">这一页没能打开</h1>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-ink2">
              学习内容渲染时出了点问题。你的进度只存在内存里，刷新即回到课程，不必担心数据。
            </p>
            <code className="machine mt-4 block max-w-full overflow-x-auto bg-errata-deep px-3 py-1.5 text-xs text-[#FFF6F0]">
              {this.state.error.message || 'Unknown error'}
            </code>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => this.setState({ error: null })}
                className="inline-flex min-h-[44px] items-center gap-1.5 bg-ink px-5 py-2 font-display text-sm font-bold text-milk transition-colors press shadow-hard hover:bg-ink2"
              >
                <RotateCcw size={15} aria-hidden /> 重试
              </button>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="hinge inline-flex min-h-[44px] items-center gap-1.5 border-2 border-ink px-5 py-2 text-sm text-ink transition-colors hover:bg-under"
              >
                <RefreshCw size={15} aria-hidden /> 刷新页面
              </button>
              <Link
                to="/methods"
                className="hinge inline-flex min-h-[44px] items-center gap-1.5 px-3 py-2 text-sm text-ink2 underline decoration-rule underline-offset-4 transition-colors hover:text-ink hover:decoration-ink"
              >
                <BookOpen size={15} aria-hidden /> 回课程总目
              </Link>
            </div>
          </div>
        </section>
      );
    }
    return this.props.children;
  }
}
