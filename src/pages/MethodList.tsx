import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { courses } from '@/data/courses';
import type { Course } from '@/data/courses';
import { useProgress } from '@/store/progressStore';
import { STAGE_META, STAGE_ORDER, deepen, textOn } from '@/lib/stages';
import { EduRunningHead } from '@/components/edu';
import { playSfx } from '@/hooks/useSfx';

type State = {
  completedUnits: Record<string, string[]>;
  diagnosticTaken: string[];
  exitResults: Record<string, { score: number; total: number }>;
};

/** 课的收口判定，与右缘索引轨同口径：出门条已交或六单元全勾 */
function isCourseDone(c: Course, s: State): boolean {
  return s.exitResults[c.id] != null || (s.completedUnits[c.id]?.length ?? 0) >= c.units.length;
}

function unitStepIndex(c: Course, s: State): number {
  const done = s.completedUnits[c.id] ?? [];
  const i = c.units.findIndex((u) => !done.includes(u.id));
  return i === -1 ? -1 : i + 1; // 1..6
}

/** 「下一步去哪」的唯一口径：诊断 → 单元 → 出门条 → 收口 */
function nextTarget(c: Course, s: State): { step: number; kind: 'diag' | 'unit' | 'exit' | 'done' } {
  if (!s.diagnosticTaken.includes(c.id)) return { step: 0, kind: 'diag' };
  const u = unitStepIndex(c, s);
  if (u > 0) return { step: u, kind: 'unit' };
  if (s.exitResults[c.id] == null) return { step: 7, kind: 'exit' };
  return { step: 7, kind: 'done' };
}

function primaryLabel(c: Course, t: ReturnType<typeof nextTarget>): string {
  if (t.kind === 'diag') return c.order === 1 ? '开始第一课' : `进入第 ${c.order} 课`;
  if (t.kind === 'unit') return `继续 U${t.step}`;
  if (t.kind === 'exit') return '再做出门条';
  return '回第一课';
}

const stageRange = (list: Course[]) => {
  const first = String(list[0].order).padStart(2, '0');
  const last = String(list[list.length - 1].order).padStart(2, '0');
  return first === last ? first : `${first}–${last}`;
};

/**
 * 课程总目（瑞士排印世界）：第一屏就是目录文档本身。
 * 四段路径按段色细条分章，每课一行；状态三重编码（形状 + 颜色 + 文字）。
 */
export default function MethodList() {
  const completedUnits = useProgress((s) => s.completedUnits);
  const diagnosticTaken = useProgress((s) => s.diagnosticTaken);
  const exitResults = useProgress((s) => s.exitResults);
  const state: State = { completedUnits, diagnosticTaken, exitResults };

  const doneCount = courses.filter((c) => isCourseDone(c, state)).length;
  const totalMin = courses.reduce((a, c) => a + c.durationMin, 0);
  const maxMin = Math.max(...courses.map((c) => c.durationMin));

  // 本页唯一主行动：第一门没走完的课的下一个位置
  const nextCourse = courses.find((c) => !isCourseDone(c, state)) ?? courses[0];
  const target = nextTarget(nextCourse, state);
  const primaryTo =
    target.kind === 'done'
      ? `/methods/${courses[0].id}?step=1`
      : `/methods/${nextCourse.id}?step=${target.step}`;

  /** 黑块面板的机器嗓音前缀：诊断 / 单元 / 出门条 / 已收口 */
  const stepText =
    target.kind === 'diag'
      ? '开场诊断'
      : target.kind === 'unit'
        ? `单元 U${target.step}`
        : target.kind === 'exit'
          ? '出门条'
          : '已收口';

  const grouped = STAGE_ORDER.map((stage) => ({
    stage,
    list: courses.filter((c) => c.stage === stage),
  })).filter((g) => g.list.length > 0);

  return (
    <article className="leaf leaf-active">
      <EduRunningHead
        left={
          <nav aria-label="面包屑" className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
            <span className="font-display font-bold text-ink">英语词汇方法课</span>
            <span aria-hidden className="h-3 w-px bg-rule" />
            <span aria-current="page">课程总目</span>
          </nav>
        }
        right={
          <span className="machine text-ink2">
            {doneCount} / {courses.length} 已收口
          </span>
        }
      />

      <div className="px-5 py-6 md:px-8 md:py-8">
        {/* 首屏题名：海报级字级，文档本身即第一屏 */}
        <header className="border-b border-rule pb-5">
          <p className="machine text-[12px] text-ink2">
            8 门课 · 48 单元 · 约 {totalMin} 分钟
          </p>
          <h1 className="mt-2 font-display text-[44px] font-extrabold leading-[0.95] tracking-[-0.03em] text-balance text-ink md:text-[64px] xl:text-[72px]">
            课程总目
          </h1>
          <p className="mt-3 max-w-[68ch] text-[15px] leading-[1.85] text-ink2">
            八门课沿一条路径排开。每门课先做开场诊断，再走五到六个短单元，最后交一张出门条，学完即收口。
          </p>
        </header>

        {/* 黑块锚点：全页唯一主导色场，眼睛进门的落点——顶缘段色细条 + 巨号课号 + 白底按钮红箭头 */}
        <section aria-label="继续学习" className="mt-5 bg-ink text-milk shadow-hard-lg">
          <div
            aria-hidden
            className="h-2"
            style={{ background: deepen(STAGE_META[nextCourse.stage].hue) }}
          />
          <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8 md:px-6">
            <div className="flex min-w-0 items-center gap-4 md:gap-5">
              <span className="font-display text-[64px] font-extrabold leading-none tracking-[-0.03em] tabular-nums md:text-[72px]">
                {String(nextCourse.order).padStart(2, '0')}
              </span>
              <span
                aria-hidden
                className="machine hidden rotate-[-4deg] border-2 border-errata px-2 py-0.5 text-[12px] font-bold text-milk sm:block"
              >
                继续
              </span>
              <div className="min-w-0">
                <p className="machine text-[12px] text-milk/70">
                  {stepText} · {nextCourse.durationMin} 分钟 · {nextCourse.units.length} 单元
                </p>
                <p className="truncate font-display text-lg font-bold text-milk md:text-[26px]">
                  {nextCourse.title}
                </p>
              </div>
            </div>
            <Link
              to={primaryTo}
              onClick={() => playSfx('click')}
              data-testid="intro-next"
              className="press press-invert shadow-hard-invert inline-flex min-h-[44px] w-full items-center justify-center gap-2 bg-milk px-5 py-2.5 font-display text-sm font-bold text-ink hover:bg-rule sm:w-auto"
            >
              {primaryLabel(nextCourse, target)} <ArrowRight size={15} className="text-errata" aria-hidden />
            </Link>
          </div>
        </section>

        {/* 四段路径分章带（段色细条点缀）+ 课程行 */}
        {grouped.map(({ stage, list }) => {
          const meta = STAGE_META[stage];
          const stageMin = list.reduce((a, c) => a + c.durationMin, 0);
          return (
            <section key={stage} aria-label={`${meta.label}段课程`} className="mt-8 border-2 border-ink shadow-hard">
              {/* 分章带：灰场底墨字（图底分层），段色只上左侧方片与下缘 3px 细条；章题必须压过行题 */}
              <div
                className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 bg-under px-4 py-3"
                style={{ borderBottom: `3px solid ${deepen(meta.hue)}` }}
              >
                <span className="flex items-baseline gap-3">
                  <span aria-hidden className="h-4 w-4 translate-y-px" style={{ background: meta.hue }} />
                  <h2 className="bg-ink px-2.5 py-1.5 font-display text-[26px] font-extrabold leading-none tracking-[-0.02em] text-milk md:text-[32px]">
                    {meta.label}
                  </h2>
                </span>
                <p className="machine text-ink2">
                  {stageRange(list)} · {stageMin} 分钟
                </p>
              </div>

              <ol className="bg-leaf">
                {list.map((c) => {
                  const done = isCourseDone(c, state);
                  const started =
                    (state.completedUnits[c.id]?.length ?? 0) > 0 ||
                    state.diagnosticTaken.includes(c.id);
                  const status = done ? '已收口' : started ? '进行中' : '未到';
                  const t = nextTarget(c, state);
                  return (
                    <li key={c.id} className="border-b border-rule last:border-b-0">
                      <Link
                        to={`/methods/${c.id}?step=${t.step}`}
                        onClick={() => playSfx('click')}
                        data-testid="data-method-row"
                        data-method-row={c.id}
                        className="group block min-h-[44px] px-4 py-4 transition-colors hover:bg-under/60"
                        aria-label={`第 ${c.order} 课 ${c.title}，${status}`}
                      >
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                          <span className="machine text-[18px] font-bold text-ink" aria-hidden>
                            {String(c.order).padStart(2, '0')}
                          </span>
                          <h3 className="font-display text-[17px] font-bold leading-snug text-ink md:text-[19px]">
                            {c.title}
                          </h3>
                          {c.optional && (
                            <span className=" border-2 border-ink px-1.5 py-0.5 text-[12px] text-ink2">
                              可跳过
                            </span>
                          )}

                          <span className="machine ml-auto flex items-center gap-3 text-[12px] text-ink2">
                            <span>{c.durationMin} 分钟</span>
                            <span aria-hidden className="hidden h-px w-8 bg-rule sm:block" />
                            <span className="flex items-center gap-1.5">
                              <span
                                className={`punch ${done ? 'punch-done' : started ? 'punch-active' : ''}`}
                                aria-hidden
                              />
                              <span
                                className={`border-2 px-1.5 py-0.5 font-bold ${
                                  done ? 'border-ink bg-ink text-milk' : started ? '' : 'border-ink bg-milk text-ink2'
                                }`}
                                style={
                                  started && !done
                                    ? { background: meta.hue, borderColor: deepen(meta.hue), color: textOn(meta.hue) }
                                    : undefined
                                }
                              >
                                {status}
                              </span>
                            </span>
                          </span>
                        </div>

                        {/* 长度条 ∝ 课时（The Extent Rule 的目录视图） */}
                        <div className="mt-2 h-[3px] w-full bg-rule" aria-hidden>
                          <div
                            className="h-[3px] bg-ink2"
                            style={{ width: `${Math.round((c.durationMin / maxMin) * 100)}%` }}
                          />
                        </div>

                        <p className="mt-2.5 max-w-[68ch] text-[14px] leading-[1.8] text-ink2">
                          {c.subtitle}
                        </p>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </section>
          );
        })}
      </div>
    </article>
  );
}
