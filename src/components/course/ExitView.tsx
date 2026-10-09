import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { RotateCcw } from 'lucide-react';
import type { Course } from '@/data/courses';
import type { CourseQuestion } from '@/data/courseSchema';
import CourseQuestionRunner from '@/components/practice/CourseQuestionRunner';
import BandsReport from '@/components/course/BandsReport';
import { useProgress } from '@/store/progressStore';
import { useReview } from '@/store/reviewStore';

/** P0-6：复测洗牌——重排题目顺序（Fisher–Yates），同题不同序，防同序再认 */
function reshuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** 离场自测卡：5 条是/否，答完登记；不打分不判错，是自评不是考试 */
function SelfCheckCard({
  items,
  answered,
  onAnswer,
  canFinish,
}: {
  items: string[];
  answered: Record<number, string>;
  onAnswer: (i: number, v: string) => void;
  canFinish: boolean;
}) {
  const all = items.every((_, i) => answered[i] != null);
  return (
    <section aria-label="离场自测" className="mt-6 border-t border-rule pt-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="machine text-[12px] text-ink2">离场自测 · 5 条</p>
        <p className="machine text-[12px] text-ink2">
          {Object.keys(answered).length} / {items.length} 已答
        </p>
      </div>
      <ol className="mt-3">
        {items.map((q, i) => (
          <li
            key={i}
            className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-rule py-2.5 last:border-b-0"
          >
            <span className="machine text-[12px] text-ink2" aria-hidden>
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="min-w-0 max-w-[52ch] flex-1 text-[15px] leading-[1.75] text-ink">{q}</span>
            <div className="flex gap-1.5" role="group" aria-label={`第 ${i + 1} 题 ${q}`}>
              {['是', '否'].map((v) => {
                const sel = answered[i] === v;
                return (
                  <button
                    key={v}
                    type="button"
                    aria-pressed={sel}
                    onClick={() => onAnswer(i, v)}
                    className={`hinge min-h-[44px] min-w-[52px] border-2 px-3 text-[14px] ${
                      sel
                        ? 'border-ink bg-under font-bold text-ink'
                        : 'border-ink bg-leaf text-ink2 hover:text-ink'
                    }`}
                  >
                    {v}
                  </button>
                );
              })}
            </div>
          </li>
        ))}
      </ol>
      <p className="machine mt-3 text-[12px] text-ink2" aria-live="polite">
        {all ? '五条都答完了，带回去逐条兑现。' : '答完五条再走。'}
      </p>
      {canFinish && (
        <div className="mt-5 flex justify-end">
          <Link
            to="/methods"
            data-testid="exit-to-catalog"
            className="hinge inline-flex min-h-[44px] items-center gap-2 bg-ink px-5 py-2.5 font-display text-sm font-bold text-milk press shadow-hard hover:bg-ink2"
          >
            回课程总目
          </Link>
        </div>
      )}
    </section>
  );
}

/**
 * 出门条（step 7）：快测当场判分 → 分数带报告 → 离场自测 5 条。
 * 成绩写进本机 localStorage（可在设置页清除），报告旁如实注明（P0-2 持久化口径）。
 * P0-6：复测时题目重排顺序，不再是同题同序。
 */
export default function ExitView({ course }: { course: Course }) {
  const stored = useProgress((s) => s.exitResults[course.id]);
  const selfChecked = useProgress((s) => s.selfChecked.includes(course.id));

  const [fresh, setFresh] = useState<{ score: number; total: number } | null>(null);
  const [rerun, setRerun] = useState(false);
  const [round, setRound] = useState(0);
  const [answered, setAnswered] = useState<Record<number, string>>({});
  const wrongIds = useRef<Set<string>>(new Set());
  const selfRecorded = useRef(false);

  // P0-6：第 0 轮用原序，复测每轮重掷题目顺序
  const runQuestions = useMemo<CourseQuestion[]>(
    () => (round === 0 ? course.exitTicket.questions : reshuffle(course.exitTicket.questions)),
    [round, course],
  );

  const showReport = fresh != null || (rerun ? false : stored != null);
  const score = fresh?.score ?? stored?.score;
  const total = fresh?.total ?? stored?.total;

  const handleDone = (s: number, t: number) => {
    setFresh({ score: s, total: t });
    useProgress.getState().recordExitResult(course.id, s, t);
  };

  const handleAnswer = (i: number, v: string) => {
    setAnswered((prev) => {
      const next = { ...prev, [i]: v };
      if (course.selfCheck.every((_, k) => next[k] != null)) {
        useProgress.getState().markSelfChecked(course.id);
        // P1-4：自评写进本机自评记录（只记一次，站内不调度）
        if (!selfRecorded.current) {
          selfRecorded.current = true;
          course.selfCheck.forEach((item, k) => {
            useReview.getState().recordSelfReview(item, next[k] === '是');
          });
        }
      }
      return next;
    });
  };

  if (!showReport) {
    return (
      <div>
        <header className="border-b border-rule pb-4">
          <p className="machine text-[12px] text-ink2">
            出门条 · {course.exitTicket.questions.length} 题
          </p>
          <h2 className="mt-1 font-display text-[22px] font-extrabold leading-snug text-ink md:text-[26px]">
            当场验收
          </h2>
          <p className="mt-2 max-w-[68ch] text-[15px] leading-[1.85] text-ink2">
            {course.exitTicket.intro}
          </p>
        </header>
        <CourseQuestionRunner
          questions={runQuestions}
          mode="exit"
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

  const wrongs =
    fresh != null ? course.exitTicket.questions.filter((q) => wrongIds.current.has(q.id)) : undefined;

  return (
    <div>
      <p className="machine border-2 border-ink bg-leaf px-3 py-2 text-[12px] text-ink">
        本成绩记在本机，刷新后仍在；可在设置页一键清除。
      </p>
      <BandsReport
        score={score ?? 0}
        total={total ?? course.exitTicket.questions.length}
        bands={course.exitTicket.bands}
        wrongs={wrongs}
        courseId={course.id}
        title="出门条成绩"
      />
      <div className="mt-4 flex justify-start">
        <button
          type="button"
          onClick={() => {
            wrongIds.current.clear();
            setFresh(null);
            setRerun(true);
            setRound((r) => r + 1);
          }}
          className="hinge inline-flex min-h-[44px] items-center gap-2 border-2 border-ink px-4 text-[13px] text-ink hover:bg-under"
        >
          <RotateCcw size={14} aria-hidden /> 再做一次出门条
        </button>
      </div>

      <SelfCheckCard
        items={course.selfCheck}
        answered={answered}
        onAnswer={handleAnswer}
        canFinish={
          course.selfCheck.every((_, i) => answered[i] != null) ||
          (selfChecked && Object.keys(answered).length === 0)
        }
      />
    </div>
  );
}
