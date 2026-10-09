import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { getCourse } from '@/data/courses';
import type { Course } from '@/data/courses';
import { useProgress } from '@/store/progressStore';
import { STAGE_META, type StageId } from '@/lib/stages';
import { pickBand } from '@/components/course/BandsReport';
import { EduRunningHead } from '@/components/edu';
import StepRail from '@/components/course/StepRail';
import type { StepMeta } from '@/components/course/StepRail';
import DiagnosticView from '@/components/course/DiagnosticView';
import ExitView from '@/components/course/ExitView';
import { UnitView } from '@/components/course/UnitBlocks';
import NotFound from './NotFound';

const EMPTY: string[] = [];

/** 段 → 实验室分台（页边深链；同段共用一台仪器） */
const LAB_BY_STAGE: Record<StageId, { to: string; label: string }> = {
  pathway: { to: '/lab/phonemes', label: '音标发音' },
  deconstruct: { to: '/lab/phonemes', label: '音标发音' },
  encode: { to: '/lab/mapping', label: '拼写对应' },
  retrieve: { to: '/lab/dictation', label: '听写训练' },
  capstone: { to: '/lab/dictation', label: '听写训练' },
};

/** 缺省步位的唯一口径：诊断 → 诊断分数带的 route（P0-5：分数带改路径）→ 第一个未完成单元 → 出门条 → 回 U1 */
function defaultStep(
  course: Course,
  completed: string[],
  taken: boolean,
  exited: boolean,
  result?: { score: number; total: number },
): number {
  if (!taken) return 0;
  if (result) {
    const band = pickBand(result.score, course.opening.bands);
    const m = /^u([1-6])$/i.exec(band.route ?? '');
    if (m) {
      const idx = Number(m[1]) - 1;
      const target = course.units[idx];
      if (target && !completed.includes(target.id)) return idx + 1;
    }
  }
  const i = course.units.findIndex((u) => !completed.includes(u.id));
  if (i !== -1) return i + 1;
  if (!exited) return 7;
  return 1;
}

/**
 * 课程页（瑞士）：一屏一课，宽屏三栏吃满窗口——编号轨 / 阅读主栏 / 页边批注。
 * 章节带载段色 3px 细条与进度计数；左边距悬挂编号步位轨（窄屏降级为顶内刻度条）；
 * 步位 0 诊断、1..6 单元、7 出门条。每步一个主行动。
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
      s.diagnosticResults[course.id],
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
  const totalSteps = String(metas.length).padStart(2, '0');
  const unitIndex = step >= 1 && step <= 6 ? Math.min(step - 1, course.units.length - 1) : -1;
  const unit = unitIndex >= 0 ? course.units[unitIndex] : undefined;
  const unitPct = Math.round((completedUnits.length / course.units.length) * 100);
  const lab = LAB_BY_STAGE[course.stage];

  return (
    <article className="leaf leaf-active">
      <EduRunningHead
        left={
          <nav aria-label="面包屑" className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
            <Link
              to="/methods"
              className="hinge -my-2 inline-flex min-h-[44px] items-center px-1 text-ink2 transition-colors hover:text-ink"
            >
              课程总目
            </Link>
            <span aria-hidden className="h-3 w-px bg-rule" />
            <span className="machine text-ink">{String(course.order).padStart(2, '0')}</span>
            <span className="font-display font-bold text-ink">{course.title}</span>
            {course.optional && (
              <span className="border-2 border-ink px-1.5 py-0.5 text-[12px] text-ink2">
                可跳过
              </span>
            )}
          </nav>
        }
        right={<span className="machine text-ink2">{String(step + 1).padStart(2, '0')} / {totalSteps}</span>}
        accent={stage.hue}
      />

      <div className="px-5 py-6 md:px-8 md:py-8">
        {/* 课题：本路由唯一 h1 */}
        <header className="border-b border-rule pb-5">
          <p className="machine text-[12px] text-ink2">
            {stage.label}段 · {course.durationMin} 分钟 · {course.units.length} 单元
          </p>
          <h1 className="mt-1.5 font-display text-[30px] font-extrabold leading-[1.1] tracking-[-0.02em] text-ink md:text-[40px]">
            {course.title}
          </h1>
          <p className="mt-2 max-w-[68ch] text-[15px] leading-[1.85] text-ink2">{course.subtitle}</p>
          <p className="mt-2 max-w-[68ch] text-[14px] leading-[1.8] text-ink2">
            <span className="machine mr-2 text-[12px] text-ink">目标</span>
            {course.goal}
          </p>
        </header>

        <div className="mt-5 grid grid-cols-1 gap-x-8 gap-y-4 lg:grid-cols-[136px_minmax(0,1fr)] xl:grid-cols-[136px_minmax(0,1fr)_224px]">
          <StepRail metas={metas} active={step} onSelect={goStep} />

          <div className="min-w-0">
            {step === 0 && (
              <DiagnosticView
                opening={course.opening}
                courseId={course.id}
                onEnterStep={goStep}
              />
            )}

            {unit && (
              <>
                <UnitView
                  unit={unit}
                  courseId={course.id}
                  done={completedUnits.includes(unit.id)}
                  practiced={practiced.includes(unit.id)}
                  onPracticeDone={() =>
                    setPracticed((p) => (p.includes(unit.id) ? p : [...p, unit.id]))
                  }
                  onToggleCheck={() => completeUnit(course.id, unit.id)}
                />

                {/* 底部步进：上一步幽灵 + 本步唯一主行动「下一步」 */}
                <div className="mt-8 flex flex-col gap-3 border-t border-rule pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <Link
                    to={`/methods/${course.id}?step=${step > 1 ? step - 1 : 0}`}
                    className="hinge inline-flex min-h-[44px] items-center justify-center gap-1.5 border-2 border-ink px-4 text-[13px] text-ink hover:bg-under"
                  >
                    <ArrowLeft size={14} aria-hidden />
                    {step > 1 ? `上一步 U${step - 1}` : '回诊断'}
                  </Link>
                  <button
                    type="button"
                    onClick={() => goStep(step + 1)}
                    data-testid="step-next"
                    className="hinge inline-flex min-h-[44px] items-center justify-center gap-2 bg-ink px-5 py-2.5 font-display text-sm font-bold text-milk press shadow-hard hover:bg-ink2 sm:ml-auto"
                  >
                    {step === 6 ? '去出门条' : `下一步 U${step + 1}`}
                    <ArrowRight size={15} className="text-errata" aria-hidden />
                  </button>
                </div>
              </>
            )}

            {step === 7 && <ExitView course={course} />}
          </div>

          {/* 页边批注（宽屏右栏）：灰面板边注——重线分隔的事实与深链 */}
          <aside className="hidden xl:block" aria-label="本课页边">
            <div className="sticky top-24 flex flex-col gap-6">
              <div className="bg-under px-4 pb-4 pt-3 border-2 border-ink shadow-hard">
                <p className="machine text-[12px] text-ink2">本课</p>
                <div className="mt-1 flex items-baseline gap-2.5">
                  <span className="font-display text-[44px] font-extrabold leading-none tracking-tight text-ink tabular-nums">
                    {String(course.order).padStart(2, '0')}
                  </span>
                  <span className="flex items-center gap-1.5 text-[13px] font-bold text-ink">
                    <span aria-hidden className="h-3 w-3" style={{ background: stage.hue }} />
                    {stage.label}段
                  </span>
                </div>
              </div>

              <div className="bg-under px-4 pb-4 pt-3 border-2 border-ink shadow-hard">
                <p className="machine text-[12px] text-ink2">进度</p>
                <dl className="mt-2 space-y-1.5 text-[13px]">
                  <div className="flex items-baseline justify-between gap-2">
                    <dt className="text-ink2">诊断</dt>
                    <dd className="machine text-ink">{taken ? '✓' : '—'}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-2">
                    <dt className="text-ink2">单元</dt>
                    <dd className="machine text-ink">
                      {completedUnits.length} / {course.units.length}
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-2">
                    <dt className="text-ink2">出门条</dt>
                    <dd className="machine text-ink">{exited ? '✓' : '—'}</dd>
                  </div>
                </dl>
                <div className="mt-2.5 h-[3px] w-full bg-rule" aria-hidden>
                  <div className="h-[3px] bg-ink" style={{ width: `${unitPct}%` }} />
                </div>
              </div>

              <div className="bg-under px-4 pb-4 pt-3 border-2 border-ink shadow-hard">
                <p className="machine text-[12px] text-ink2">页边深链</p>
                <Link
                  to={lab.to}
                  className="mt-1.5 inline-flex min-h-[36px] items-center text-[13px] font-bold text-ink underline decoration-rule underline-offset-4 transition-colors hover:decoration-ink"
                >
                  音标实验室 · {lab.label}
                </Link>
              </div>

              <div className="bg-under px-4 pb-4 pt-3 border-2 border-ink shadow-hard">
                <p className="machine text-[12px] text-ink2">事实</p>
                <p className="mt-1.5 text-[13px] leading-[1.7] text-ink2">
                  {course.durationMin} 分钟 · {course.units.length} 单元 · {metas.length} 步
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}
