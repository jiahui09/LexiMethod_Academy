import { useEffect, useRef } from 'react';

export type StepMeta = { n: number; label: string; done: boolean };

/**
 * 步位打孔轨：桌面悬挂左边距（sticky），窄屏降级为顶内横向贴条。
 * 三态 = 打孔形状（实心已达成 / 半环进行 / 空位未到）+ 文字，从不只靠颜色。
 * 步位元数据由页面从进度推导后传入。
 */
export default function StepRail({
  metas,
  active,
  onSelect,
}: {
  metas: StepMeta[];
  active: number;
  onSelect: (n: number) => void;
}) {
  const label = (m: StepMeta) => (m.done ? '已达成' : m.n === active ? '进行中' : '未到');
  const stripRef = useRef<HTMLOListElement | null>(null);

  // 窄屏贴条：当前步保持在视野内——即时滚动，不加缓动
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const chip = strip.querySelector<HTMLElement>('[aria-current="step"]');
    if (!chip) return;
    strip.scrollLeft = Math.max(0, chip.offsetLeft - strip.clientWidth / 2 + chip.offsetWidth / 2);
  }, [active]);

  return (
    <>
      {/* 桌面：左边距悬挂打孔轨 */}
      <nav aria-label="课内步位" className="hidden lg:block">
        <ol className="sticky top-24 flex flex-col gap-1">
          {metas.map((m) => {
            const on = m.n === active;
            return (
              <li key={m.n}>
                <button
                  type="button"
                  onClick={() => onSelect(m.n)}
                  aria-current={on ? 'step' : undefined}
                  aria-label={`第 ${m.n + 1} 步 ${m.label}，${label(m)}`}
                  className={`hinge flex min-h-[44px] w-full items-center gap-2 rounded-[3px] border px-2 text-left ${
                    on ? 'border-ink bg-under font-bold text-ink' : 'border-transparent text-ink2 hover:text-ink'
                  }`}
                >
                  <span
                    className={`punch ${m.done ? 'punch-done' : on ? 'punch-active' : ''}`}
                    aria-hidden
                  />
                  <span className="machine text-[12px]">{m.label}</span>
                  <span className="machine ml-auto text-[11px] text-ink2" aria-hidden>
                    {m.done ? '✓' : on ? '▶' : ''}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* 窄屏：顶内横向贴条 */}
      <nav aria-label="课内步位" className="-mx-1 lg:hidden">
        <ol ref={stripRef} className="edu-scroll relative flex gap-1.5 overflow-x-auto px-1 pb-1">
          {metas.map((m) => {
            const on = m.n === active;
            return (
              <li key={m.n}>
                <button
                  type="button"
                  onClick={() => onSelect(m.n)}
                  aria-current={on ? 'step' : undefined}
                  aria-label={`第 ${m.n + 1} 步 ${m.label}，${label(m)}`}
                  className={`hinge flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-[3px] border px-3 text-[13px] ${
                    on ? 'border-ink bg-under font-bold text-ink' : 'border-rule bg-leaf text-ink2'
                  }`}
                >
                  <span
                    className={`punch ${m.done ? 'punch-done' : on ? 'punch-active' : ''}`}
                    aria-hidden
                  />
                  <span className="machine text-[12px]">{m.label}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
