import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { courses } from '@/data/courses';
import type { Course } from '@/data/courses';
import { useProgress } from '@/store/progressStore';
import { STAGE_META, STAGE_ORDER, deepen } from '@/lib/stages';
import { EduRunningHead } from '@/components/edu';
import { playSfx } from '@/hooks/useSfx';

type State = {
  completedUnits: Record<string, string[]>;
  diagnosticTaken: string[];
  exitResults: Record<string, { score: number; total: number }>;
};

/** 课的收口判定，与书口阶梯轨同口径：出门条已交或六单元全勾 */
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
 * 手册总目（压膜活页手册）：第一屏就是目录文档本身。
 * 四段路径按卡板色分章，每课一行叶行；状态打孔三重编码（形状 + 颜色 + 文字）。
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

  const grouped = STAGE_ORDER.map((stage) => ({
    stage,
    list: courses.filter((c) => c.stage === stage),
  })).filter((g) => g.list.length > 0);

  return (
    <article className="leaf leaf-active">
      <EduRunningHead
        left={
          <nav aria-label="面包屑" className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
            <span className="font-display font-bold text-ink">词汇方法手册</span>
            <span aria-hidden className="h-3 w-px bg-rule" />
            <span aria-current="page">手册总目</span>
          </nav>
        }
        right={
          <span className="machine text-ink2">
            {doneCount} / {courses.length} 已收口
          </span>
        }
      />

      <div className="px-5 py-6 md:px-8 md:py-8">
        {/* 卷首题名：文档本身即第一屏 */}
        <header className="border-b border-rule pb-5">
          <p className="machine text-[12px] text-ink2">
            8 门课 · 48 单元 · 约 {totalMin} 分钟
          </p>
          <h1 className="mt-1.5 font-display text-[26px] font-extrabold leading-tight text-ink md:text-[32px]">
            手册总目
          </h1>
          <p className="mt-2 max-w-[68ch] text-[15px] leading-[1.85] text-ink2">
            八门课沿一条路径排开。每门课先做开场诊断，再走五到六个短单元，最后交一张出门条，学完即收口。
          </p>
        </header>

        {/* 本页唯一主行动 */}
        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-4 border-b border-rule pb-5">
          <Link
            to={primaryTo}
            onClick={() => playSfx('click')}
            data-testid="intro-next"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-[3px] bg-ink px-5 py-2.5 font-display text-sm font-bold text-milk transition-colors hover:bg-ink2 active:translate-y-px"
          >
            {primaryLabel(nextCourse, target)} <ArrowRight size={15} aria-hidden />
          </Link>
          <div className="min-w-0">
            <p className="machine text-[12px] text-ink2">
              {String(nextCourse.order).padStart(2, '0')} · {nextCourse.durationMin} 分钟 ·{' '}
              {nextCourse.units.length} 单元
            </p>
            <p className="truncate font-display text-sm font-bold text-ink">{nextCourse.title}</p>
          </div>
          <p className="machine ml-auto text-[12px] text-ink2">
            已收口 {doneCount} / {courses.length}
          </p>
        </div>

        {/* 四段路径分章卡板带 + 叶行目录 */}
        {grouped.map(({ stage, list }) => {
          const meta = STAGE_META[stage];
          const stageMin = list.reduce((a, c) => a + c.durationMin, 0);
          return (
            <section key={stage} aria-label={`${meta.label}段课程`} className="mt-8">
              {/* 卡板章节带：满强度段色 + 下缘 3px 深一档 */}
              <div
                className={`${meta.bg} flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 rounded-t-[4px] px-4 py-2.5`}
                style={{ borderBottom: `3px solid ${deepen(meta.hue)}` }}
              >
                <h2 className={`font-display text-[17px] font-extrabold ${meta.onBand}`}>
                  {meta.label}
                </h2>
                <p className={`machine ${meta.onBand} opacity-90`}>
                  {stageRange(list)} · {stageMin} 分钟
                </p>
              </div>

              <ol className="rounded-b-[4px] border border-t-0 border-rule bg-leaf">
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
                          <span className="machine text-[15px] font-bold text-ink" aria-hidden>
                            {String(c.order).padStart(2, '0')}
                          </span>
                          <h3 className="font-display text-[17px] font-bold leading-snug text-ink md:text-[19px]">
                            {c.title}
                          </h3>
                          {c.optional && (
                            <span className="rounded-[2px] border border-ink/40 px-1.5 py-0.5 text-[12px] text-ink2">
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
                              {status}
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
