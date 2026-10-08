import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { getCourse } from '@/data/courses';
import type { Course } from '@/data/courses';
import { useProgress } from '@/store/progressStore';
import { STAGE_META } from '@/lib/stages';
import { EduRunningHead } from '@/components/edu';
import StepRail from '@/components/course/StepRail';
import type { StepMeta } from '@/components/course/StepRail';
import DiagnosticView from '@/components/course/DiagnosticView';
import ExitView from '@/components/course/ExitView';
import { UnitView } from '@/components/course/UnitBlocks';
import NotFound from './NotFound';

const EMPTY: string[] = [];

/** 缺省步位的唯一口径：诊断 → 第一个未完成单元 → 出门条 → 回 U1 */
function defaultStep(course: Course, completed: string[], taken: boolean, exited: boolean): number {
  if (!taken) return 0;
  const i = course.units.findIndex((u) => !completed.includes(u.id));
  if (i !== -1) return i + 1;
  if (!exited) return 7;
  return 1;
}

/**
 * 课程页（压膜活页手册）：一本书里的一课。
 * 书眉载段色压条，桌面左边距悬挂打孔步位轨（窄屏降级为顶内贴条）；
 * 步位 0 诊断、1..6 单元叶、7 出门条与离场自测。每步一个主行动。
 */
export default function MethodCourse() {
  const { methodId } = useParams();
  const course = useMemo(() => getCourse(methodId), [methodId]);

  const completedUnits = useProgress((s) => (course ? s.completedUnits[course.id] ?? EMPTY : EMPTY));
  const taken = useProgress((s) => (course ? s.diagnosticTaken.includes(course.id) : false));
  const exited = useProgress((s) => (course ? s.exitResults[course.id] != null : false));
  const completeUnit = useProgress((s) => s.completeUnit);

  const [searchParams, setSearchParams] = useSearchParams();
  const raw = searchParams.get('step');

  // 缺省步位：进页时按当时进度算一次，之后进度变化不打断正在读的页
  const [fallback] = useState(() => {
    if (!course) return 0;
    const s = useProgress.getState();
    return defaultStep(
      course,
      s.completedUnits[course.id] ?? EMPTY,
      s.diagnosticTaken.includes(course.id),
      s.exitResults[course.id] != null,
    );
  });

  let step: number;
  if (raw !== null && Number.isFinite(Number(raw))) {
    step = Math.min(7, Math.max(0, Math.floor(Number(raw))));
  } else {
    step = fallback;
  }

  const goStep = (n: number) => {
    setSearchParams({ step: String(n) });
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [step, methodId]);

  const [practiced, setPracticed] = useState<string[]>([]);

  if (!course) return <NotFound />;

  const stage = STAGE_META[course.stage];
  const metas: StepMeta[] = [
    { n: 0, label: '诊断', done: taken },
    ...course.units.map((u, i) => ({
      n: i + 1,
      label: `U${i + 1}`,
      done: completedUnits.includes(u.id),
    })),
    { n: 7, label: '出门条', done: exited },
  ];
  const unitIndex = step >= 1 && step <= 6 ? Math.min(step - 1, course.units.length - 1) : -1;
  const unit = unitIndex >= 0 ? course.units[unitIndex] : undefined;

  return (
    <article className="leaf leaf-active">
      <EduRunningHead
        left={
          <nav aria-label="面包屑" className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
            <Link
              to="/methods"
              className="hinge -my-2 inline-flex min-h-[44px] items-center rounded-[2px] px-1 text-ink2 transition-colors hover:text-ink"
            >
              手册总目
            </Link>
            <span aria-hidden className="h-3 w-px bg-rule" />
            <span className="machine text-ink">{String(course.order).padStart(2, '0')}</span>
            <span className="font-display font-bold text-ink">{course.title}</span>
            {course.optional && (
              <span className="rounded-[2px] border border-ink/40 px-1.5 py-0.5 text-[12px] text-ink2">
                可跳过
              </span>
            )}
          </nav>
        }
        right={<span className="machine text-ink2">{String(step + 1).padStart(2, '0')} / 08</span>}
        accent={stage.hue}
      />

      <div className="px-5 py-6 md:px-8 md:py-8">
        {/* 课题：本路由唯一 h1 */}
        <header className="border-b border-rule pb-5">
          <p className="machine text-[12px] text-ink2">
            {stage.label}段 · {course.durationMin} 分钟 · {course.units.length} 单元
          </p>
          <h1 className="mt-1.5 font-display text-[26px] font-extrabold leading-tight text-ink md:text-[32px]">
            {course.title}
          </h1>
          <p className="mt-2 max-w-[68ch] text-[15px] leading-[1.85] text-ink2">{course.subtitle}</p>
          <p className="mt-2 max-w-[68ch] text-[14px] leading-[1.8] text-ink2">
            <span className="machine mr-2 text-[12px] text-ink">目标</span>
            {course.goal}
          </p>
        </header>

        <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-4 lg:grid-cols-[136px_minmax(0,1fr)]">
          <StepRail metas={metas} active={step} onSelect={goStep} />

          <div className="min-w-0">
            {step === 0 && (
              <DiagnosticView
                opening={course.opening}
                courseId={course.id}
                onEnterU1={() => goStep(1)}
              />
            )}

            {unit && (
              <>
                <UnitView
                  unit={unit}
                  done={completedUnits.includes(unit.id)}
                  practiced={practiced.includes(unit.id)}
                  onPracticeDone={() =>
                    setPracticed((p) => (p.includes(unit.id) ? p : [...p, unit.id]))
                  }
                  onToggleCheck={() => completeUnit(course.id, unit.id)}
                />

                {/* 底部掀角：上一步幽灵 + 本步唯一主行动「下一步」 */}
                <div className="mt-8 flex flex-col gap-3 border-t border-rule pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <Link
                    to={`/methods/${course.id}?step=${step > 1 ? step - 1 : 0}`}
                    className="hinge inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-[3px] border border-ink/40 px-4 text-[13px] text-ink hover:bg-under"
                  >
                    <ArrowLeft size={14} aria-hidden />
                    {step > 1 ? `上一步 U${step - 1}` : '回诊断'}
                  </Link>
                  <button
                    type="button"
                    onClick={() => goStep(step + 1)}
                    data-testid="step-next"
                    className="hinge inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[3px] bg-ink px-5 py-2.5 font-display text-sm font-bold text-milk hover:bg-ink2 active:translate-y-px sm:ml-auto"
                  >
                    {step === 6 ? '去出门条' : `下一步 U${step + 1}`}
                    <ArrowRight size={15} aria-hidden />
                  </button>
                </div>
              </>
            )}

            {step === 7 && <ExitView course={course} />}
          </div>
        </div>
      </div>
    </article>
  );
}
