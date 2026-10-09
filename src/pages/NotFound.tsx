import { Link } from 'react-router-dom';
import { ChevronRight, FlaskConical } from 'lucide-react';

/**
 * 404 = 这一页不存在：白底朱边的勘误块是唯一主角，
 * 齐左排（瑞士不居中），主行动回课程总目（ink 实底），次级去实验室。全页单一 h1。
 */
export default function NotFound() {
  return (
    <div className="container-page flex min-h-[55vh] flex-col items-start justify-center px-5 py-10">
      <nav aria-label="面包屑" className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-ink2">
        <span>
          <Link to="/methods" className="inline-flex min-h-[44px] items-center transition-colors hover:text-ink">
            课程总目
          </Link>
        </span>
        <span aria-hidden className="text-ink2/60">
          <ChevronRight size={11} />
        </span>
        <span aria-current="page" className="font-semibold text-ink">
          未找到页面
        </span>
      </nav>

      <div className="w-full max-w-[560px] border-2 border-errata bg-leaf p-6 md:p-8">
        <p className="machine mb-2 text-errata-deep">ERRATA · 缺页</p>
        <h1 className="font-display text-3xl font-extrabold text-ink">404 · 这条路没有词</h1>
        <p className="mt-3 text-sm leading-[1.85] text-ink2">
          这一页不存在，或者链接已经过期。课程一共 8 门课，从课程总目继续走。
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            to="/methods"
            className="inline-flex min-h-[44px] items-center bg-ink px-5 py-2.5 font-display text-sm font-bold text-milk transition-colors press shadow-hard hover:bg-ink2"
          >
            回课程总目
          </Link>
          <Link
            to="/lab/phonemes"
            className="hinge inline-flex min-h-[44px] items-center gap-1.5 border-2 border-ink px-5 py-2.5 text-sm text-ink transition-colors hover:bg-under"
          >
            <FlaskConical size={14} aria-hidden /> 去音标实验室
          </Link>
        </div>
      </div>
    </div>
  );
}
