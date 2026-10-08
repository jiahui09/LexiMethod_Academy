import { useMemo, useRef } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { Check, Play } from 'lucide-react';
import { methods } from '@/data/methods';
import { useProgress } from '@/store/progressStore';
import { playSfx } from '@/hooks/useSfx';
import { STATE_CLASS, type TabState, shortTitle } from '@/components/layout/ThumbIndex';

/** 上层：全站功能页切口贴（书口脊契约——功能页切口贴常驻每一页右缘；削减后只剩实验室与设置） */
const SECTIONS = [
  { to: '/lab/phonemes', label: '实验室' },
  { to: '/settings', label: '设置' },
] as const;

/** 下层步位刻痕（三态）：实心 = 已学、描边 = 进行中（当前步）、空 = 未到 */
const STEP_CLASS: Record<'done' | 'active' | 'todo', string> = {
  done: 'border-cobalt bg-cobalt text-bone hover:border-[#163B5E] hover:bg-[#163B5E]',
  active: 'border-rubric text-rubric bg-bone2 hover:border-[#9C2919] hover:bg-[#EBDBC3]',
  todo: 'border-rule text-colophon hover:bg-bone2/70',
};

const stateLabel: Record<TabState, string> = {
  done: '已学',
  active: '当前',
  started: '进行中',
  todo: '未到',
};

/**
 * 全站书口脊（阶段三签名件）：每页右缘常驻的一条书口。
 * 上层 = 功能页切口贴（全站跳转，当前页批注红实底，本会话到过的结构蓝 ✓）；
 * 下层 = 书的结构在「你现在这一页」的映射——
 *   /methods        → 8 门方法切口（沿用阶段二四态，唯一红实底 = 续学课）；
 *   /methods/:id    → 该课 8 道步位刻痕（?step= 为当前步，缺省取第一个未完成步）；
 *   其余页          → 续学课的 8 道步位刻痕（零进度时下层空置，不造口径）。
 * 状态从不只靠颜色：底/描边 + 形状（✓/▶/▷/空位）+ 文字色三重编码；触控 ≥44px。
 * 窄屏（<xl）不渲染：功能页由页眉/底导可达，步位由页内行内贴条降级。
 */
export default function ForeEdge() {
  const location = useLocation();
  const [params] = useSearchParams();
  const completedMethods = useProgress((s) => s.completedMethods);
  const completedSteps = useProgress((s) => s.completedSteps);

  /** 本会话到过的功能页（内存即零存储：刷新即忘，不做持久化） */
  const visitedRef = useRef<Set<string>>(new Set());
  const path = location.pathname;
  visitedRef.current.add(path);

  /** 续学口径（与课程目录同源：第一个未学完方法的第一个未完成步） */
  const nextPos = useMemo(() => {
    for (const m of methods) {
      const done = completedSteps[m.id] ?? [];
      if (done.length >= m.steps.length) continue;
      const firstMissing = m.steps.findIndex((_, i) => !done.includes(i));
      return { method: m, step: firstMissing === -1 ? 0 : firstMissing, finished: false };
    }
    return { method: methods[methods.length - 1], step: 0, finished: true };
  }, [completedSteps]);

  const onMap = path === '/methods';
  const courseMatch = /^\/methods\/([^/]+)$/.exec(path);
  const course = courseMatch ? methods.find((m) => m.id === courseMatch[1]) : undefined;
  const anyProgress = methods.some((m) => (completedSteps[m.id] ?? []).length > 0);

  /** 下层内容：课程目录 = 方法贴；课页/其余 = 步位刻痕 */
  let lower:
    | { kind: 'methods'; currentId?: string }
    | { kind: 'steps'; method: (typeof methods)[number]; activeStep: number }
    | null = null;
  if (onMap) {
    lower = { kind: 'methods', currentId: nextPos.finished ? undefined : nextPos.method.id };
  } else if (course) {
    const doneList = completedSteps[course.id] ?? [];
    const queryStep = Number(params.get('step'));
    const fallback = course.steps.findIndex((_, i) => !doneList.includes(i));
    const active = Number.isInteger(queryStep) && queryStep >= 0 && queryStep < course.steps.length
      ? queryStep
      : fallback === -1 ? 0 : fallback;
    lower = { kind: 'steps', method: course, activeStep: active };
  } else if (anyProgress && !nextPos.finished) {
    lower = { kind: 'steps', method: nextPos.method, activeStep: nextPos.step };
  }

  return (
    <aside className="hidden w-24 shrink-0 self-start xl:block" aria-label="书口索引">
      <nav
        aria-label="书口：功能页与步位"
        className="edu-scroll sticky top-24 flex max-h-[calc(100vh-7.5rem)] flex-col gap-1.5 overflow-y-auto pb-4"
      >
        {SECTIONS.map((s) => {
          const on = path === s.to;
          const seen = visitedRef.current.has(s.to);
          return (
            <Link
              key={s.to}
              to={s.to}
              aria-current={on ? 'page' : undefined}
              onClick={() => playSfx('click')}
              className={[
                'flex min-h-[44px] items-center justify-center gap-1.5 rounded-l-[3px] border-y border-l px-2.5 text-[13px] leading-tight transition-colors',
                on
                  ? 'border-rubric bg-rubric text-bone hover:border-[#9C2919] hover:bg-[#9C2919]'
                  : seen
                    ? 'border-cobalt text-cobalt hover:bg-bone2/70'
                    : 'border-rule text-colophon hover:bg-bone2/70',
              ].join(' ')}
            >
              <span className="flex w-3.5 shrink-0 items-center justify-center" aria-hidden>
                {on ? (
                  <Play size={11} className="fill-current" />
                ) : seen ? (
                  <Check size={14} strokeWidth={2.5} />
                ) : null}
              </span>
              <span className={on ? 'font-medium' : undefined}>{s.label}</span>
            </Link>
          );
        })}

        {lower && (
          <div className="mt-1 flex flex-col gap-1.5 border-t border-rule pt-1.5">
            {lower.kind === 'methods'
              ? methods.map((m) => {
                  const done = completedMethods.includes(m.id);
                  const started = (completedSteps[m.id] ?? []).length > 0;
                  const state: TabState = done
                    ? 'done'
                    : m.id === lower.currentId
                      ? 'active'
                      : started
                        ? 'started'
                        : 'todo';
                  return (
                    <Link
                      key={m.id}
                      to={`/methods/${m.id}`}
                      aria-label={`${shortTitle(m)}：${stateLabel[state]}`}
                      onClick={() => playSfx('click')}
                      className={[
                        'flex min-h-[44px] items-center gap-1.5 rounded-l-[3px] border-y border-l px-2.5 text-[13px] leading-tight transition-colors',
                        STATE_CLASS[state],
                      ].join(' ')}
                    >
                      <span className="flex w-3.5 shrink-0 items-center justify-center" aria-hidden>
                        {state === 'done' && <Check size={14} strokeWidth={2.5} />}
                        {state === 'active' && <Play size={11} className="fill-current" />}
                        {state === 'started' && <Play size={11} />}
                      </span>
                      <span className={state === 'active' ? 'font-medium' : undefined}>
                        {shortTitle(m)}
                      </span>
                    </Link>
                  );
                })
              : lower.method.steps.map((_, i) => {
                  const done = (completedSteps[lower.kind === 'steps' ? lower.method.id : ''] ?? []).includes(i);
                  const state = done ? 'done' : i === lower.activeStep ? 'active' : 'todo';
                  return (
                    <Link
                      key={i}
                      to={`/methods/${lower.kind === 'steps' ? lower.method.id : ''}?step=${i}`}
                      aria-label={`第 ${i + 1} 步：${done ? '已学' : state === 'active' ? '当前' : '未到'}`}
                      onClick={() => playSfx('click')}
                      className={[
                        'flex min-h-[44px] items-center gap-1.5 rounded-l-[3px] border-y border-l px-2.5 text-[13px] leading-tight transition-colors',
                        STEP_CLASS[state],
                      ].join(' ')}
                    >
                      <span className="flex w-3.5 shrink-0 items-center justify-center" aria-hidden>
                        {state === 'done' && <Check size={14} strokeWidth={2.5} />}
                        {state === 'active' && <Play size={11} className="fill-current" />}
                      </span>
                      <span className={`font-serif ${state === 'done' ? 'font-medium' : ''}`}>{i + 1}</span>
                    </Link>
                  );
                })}
          </div>
        )}
      </nav>
    </aside>
  );
}
