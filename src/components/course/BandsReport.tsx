import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { CourseQuestion, ScoreBand } from '@/data/courseSchema';
import { getCourse } from '@/data/courses';

/** bands 按分数从高到低排列（until 为该带下限）：取第一个 `until <= score` 的带；越界兜底最后一档 */
export function pickBand(score: number, bands: ScoreBand[]): ScoreBand {
  return bands.find((b) => score >= b.until) ?? bands[bands.length - 1];
}

/** 路由串三态：u2 类单元步 / 课程 id / 纯文字建议 */
function RouteHint({ route, courseId }: { route?: string; courseId: string }) {
  if (!route) return null;
  const unit = /^u([1-6])$/i.exec(route);
  const other = getCourse(route);
  if (unit) {
    return (
      <Link
        to={`/methods/${courseId}?step=${unit[1]}`}
        className="hinge inline-flex min-h-[44px] items-center gap-1.5 rounded-[3px] border border-ink/40 px-3 text-[13px] text-ink hover:bg-under"
      >
        去 {route.toUpperCase()} <ArrowRight size={13} aria-hidden />
      </Link>
    );
  }
  if (other && other.id !== courseId) {
    return (
      <Link
        to={`/methods/${other.id}`}
        className="hinge inline-flex min-h-[44px] items-center gap-1.5 rounded-[3px] border border-ink/40 px-3 text-[13px] text-ink hover:bg-under"
      >
        去 {String(other.order).padStart(2, '0')} {other.title} <ArrowRight size={13} aria-hidden />
      </Link>
    );
  }
  return (
    <p className="max-w-[68ch] text-[14px] leading-[1.8] text-ink2">
      <span className="machine mr-2 text-[12px] text-ink">路线</span>
      {route}
    </p>
  );
}

/**
 * 分数带报告（诊断 / 出门条共用）：机器嗓音计数 + 一句诊断 + 路线。
 * 错题走勘误式列出，朱红只出现在错题标记上（Errata Rule）。
 */
export default function BandsReport({
  score,
  total,
  bands,
  wrongs,
  courseId,
  title,
}: {
  score: number;
  total: number;
  bands: ScoreBand[];
  wrongs?: CourseQuestion[];
  courseId: string;
  title: string;
}) {
  const band = pickBand(score, bands);
  return (
    <section aria-label={title} className="mt-6 border-t border-rule pt-5">
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
        <p className="machine text-[40px] font-bold leading-none text-ink" data-testid="band-score">
          {String(score).padStart(2, '0')}
          <span className="text-ink2"> / {String(total).padStart(2, '0')}</span>
        </p>
        <p className="machine text-[12px] text-ink2">{title}</p>
      </div>

      <p className="mt-3 max-w-[68ch] text-[16px] leading-[1.85] text-ink" aria-live="polite">
        {band.verdict}
      </p>
      <div className="mt-3">
        <RouteHint route={band.route} courseId={courseId} />
      </div>

      {wrongs && wrongs.length > 0 && (
        <div className="mt-5">
          <p className="machine text-[12px] text-ink2">错题勘误 {wrongs.length} 题</p>
          <ol className="mt-2 flex flex-col gap-2">
            {wrongs.map((q) => (
              <li
                key={q.id}
                className="border-l-[3px] border-errata bg-leaf px-3 py-2.5"
              >
                <p className="max-w-[68ch] text-[14px] leading-[1.75] text-ink">
                  <span aria-hidden className="machine mr-2 text-[12px] text-errata-deep">
                    ✗
                  </span>
                  {q.prompt}
                </p>
                <p className="mt-1 max-w-[68ch] text-[13px] leading-[1.75] text-ink2">
                  <span className="machine mr-2 text-[12px] text-ink">正解</span>
                  {q.answer}
                </p>
                <p className="mt-1 max-w-[68ch] text-[13px] leading-[1.75] text-ink2">{q.explain}</p>
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}
