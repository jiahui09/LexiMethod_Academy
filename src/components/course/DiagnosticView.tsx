import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { Diagnostic } from '@/data/courseSchema';
import CourseQuestionRunner from '@/components/practice/CourseQuestionRunner';
import BandsReport, { pickBand } from '@/components/course/BandsReport';
import { useProgress } from '@/store/progressStore';

/**
 * 开场诊断（step 0）：引导语 → 逐题当场揭晓 → 分数带报告 + 错题勘误。
 * P0-5：成绩写进本机进度（diagnosticResults），主行动跟随命中分数带的 route
 * （带 route=uN → 直接去该单元；否则回退「进入 U1」）。
 */
export default function DiagnosticView({
  opening,
  courseId,
  onEnterStep,
}: {
  opening: Diagnostic;
  courseId: string;
  onEnterStep: (n: number) => void;
}) {
  const [report, setReport] = useState<{ score: number; total: number } | null>(null);
  const wrongIds = useRef<Set<string>>(new Set());

  const handleDone = (score: number, total: number) => {
    setReport({ score, total });
    useProgress.getState().markDiagnosticTaken(courseId);
    useProgress.getState().recordDiagnosticResult(courseId, score, total);
  };

  const wrongs = report
    ? opening.questions.filter((q) => wrongIds.current.has(q.id))
    : undefined;

  if (report) {
    return (
      <div>
        <BandsReport
          score={report.score}
          total={report.total}
          bands={opening.bands}
          wrongs={wrongs}
          courseId={courseId}
          title="开场诊断报告"
        />
        <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
          {(() => {
            const band = pickBand(report.score, opening.bands);
            const m = /^u([1-6])$/i.exec(band.route ?? '');
            const target = m ? Number(m[1]) : 1;
            return (
              <button
                type="button"
                onClick={() => onEnterStep(target)}
                data-testid="diag-enter-u1"
                className="hinge inline-flex min-h-[44px] items-center gap-2 bg-ink px-5 py-2.5 font-display text-sm font-bold text-milk press shadow-hard hover:bg-ink2"
              >
                {m ? `按分数带直接去 U${target}` : '进入 U1'}{' '}
                <ArrowRight size={15} className="text-errata" aria-hidden />
              </button>
            );
          })()}
        </div>
      </div>
    );
  }

  return (
    <div>
      <header className="border-b border-rule pb-4">
        <p className="machine text-[12px] text-ink2">开场诊断</p>
        <h2 className="mt-1 font-display text-[22px] font-extrabold leading-snug text-ink md:text-[26px]">
          一分钟快测
        </h2>
        <p className="mt-2 max-w-[68ch] text-[15px] leading-[1.85] text-ink2">{opening.lead}</p>
      </header>
      <CourseQuestionRunner
        questions={opening.questions}
        mode="diagnostic"
        onDone={handleDone}
        onAnswered={(qid: string, correct: boolean) => {
          if (!correct) wrongIds.current.add(qid);
        }}
      />
      <div className="mt-6 flex justify-start">
        <Link
          to="/methods"
          className="hinge inline-flex min-h-[44px] items-center border-2 border-ink px-4 text-[13px] text-ink hover:bg-under"
        >
          回课程总目
        </Link>
      </div>
    </div>
  );
}
