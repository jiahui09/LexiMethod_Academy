import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { Diagnostic } from '@/data/courseSchema';
import CourseQuestionRunner from '@/components/practice/CourseQuestionRunner';
import BandsReport from '@/components/course/BandsReport';
import { useProgress } from '@/store/progressStore';

/**
 * 开场诊断（step 0）：引导语 → 逐题当场揭晓 → 分数带报告 + 错题勘误。
 * 报告后本步唯一主行动是「进入 U1」（决策点 4：裂缝当场可见）。
 */
export default function DiagnosticView({
  opening,
  courseId,
  onEnterU1,
}: {
  opening: Diagnostic;
  courseId: string;
  onEnterU1: () => void;
}) {
  const [report, setReport] = useState<{ score: number; total: number } | null>(null);
  const wrongIds = useRef<Set<string>>(new Set());

  const handleDone = (score: number, total: number) => {
    setReport({ score, total });
    useProgress.getState().markDiagnosticTaken(courseId);
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
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onEnterU1}
            data-testid="diag-enter-u1"
            className="hinge inline-flex min-h-[44px] items-center gap-2 bg-ink px-5 py-2.5 font-display text-sm font-bold text-milk hover:bg-ink2 active:translate-y-px"
          >
            进入 U1 <ArrowRight size={15} className="text-errata" aria-hidden />
          </button>
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
          className="hinge inline-flex min-h-[44px] items-center border border-ink/40 px-4 text-[13px] text-ink hover:bg-under"
        >
          回课程总目
        </Link>
      </div>
    </div>
  );
}
