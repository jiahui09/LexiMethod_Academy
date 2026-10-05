import { Check } from 'lucide-react';

type Props = {
  /** 每步的短类型标签（如「方法登场」「规则演示」）——导轨只放短词 */
  labels: string[];
  /** 完整步题，用于 title / aria */
  titles?: string[];
  index: number;
  completed: number[];
  onChange: (i: number) => void;
};

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * 义项导轨：左栏「书脊」上的编号步进 + 一根装订线（全站唯一的进度轴线）。
 * 状态从不只靠颜色：当前 = ▶ 实心三角 + 红号，完成 = ✓，未到 = 空号。
 */
export default function EduRail({ labels, titles, index, completed, onChange }: Props) {
  const total = labels.length;
  const pct = total > 1 ? (index / (total - 1)) * 100 : 0;

  return (
    <nav aria-label="课程步骤" className="edu-scroll relative">
      <ol className="relative flex gap-1 overflow-x-auto pb-1 md:flex-col md:gap-0 md:overflow-visible md:pb-0">
        {/* 装订线：桌面端纵向贯穿（唯一的进度轴线） */}
        <span aria-hidden className="absolute left-[15px] top-2 bottom-2 hidden w-px bg-rule md:block">
          <span
            className="absolute left-0 top-0 w-px bg-cobalt transition-[height] duration-500 ease-out-expo"
            style={{ height: `${pct}%` }}
          />
        </span>

        {labels.map((lbl, i) => {
          const done = completed.includes(i);
          const active = i === index;
          return (
            <li key={i} className="relative">
              <button
                type="button"
                onClick={() => onChange(i)}
                aria-current={active ? 'step' : undefined}
                aria-label={`第 ${i + 1} 步：${titles?.[i] ?? lbl}${done ? '（已完成）' : ''}`}
                title={titles?.[i] ?? lbl}
                className={`flex min-h-[44px] w-full items-center gap-2 whitespace-nowrap rounded-[3px] px-2 py-1.5 text-left transition-colors md:gap-2.5 ${
                  active ? 'bg-bone2' : 'hover:bg-bone2/70'
                }`}
              >
                <span className="relative flex h-7 w-7 shrink-0 items-center justify-center">
                  <span
                    className={`absolute inset-0 rounded-full border ${
                      active ? 'border-rubric bg-[#F7F2E8]' : done ? 'border-cobalt bg-cobalt' : 'border-rule bg-[#F7F2E8]'
                    }`}
                    aria-hidden
                  />
                  <span
                    className={`relative font-serif text-[12px] font-bold tabular-nums ${
                      active ? 'text-rubric' : done ? 'text-[#F7F2E8]' : 'text-colophon'
                    }`}
                  >
                    {pad(i + 1)}
                  </span>
                </span>
                <span
                  className={`hidden truncate text-[12.5px] md:block ${
                    active ? 'font-semibold text-paperink' : done ? 'text-colophon' : 'text-colophon/80'
                  }`}
                >
                  {lbl}
                </span>
                {/* 状态形状：纹样不靠颜色 */}
                {done && !active && <Check size={13} className="shrink-0 text-cobalt" aria-hidden />}
                {active && (
                  <svg width="9" height="10" viewBox="0 0 9 10" className="shrink-0 text-rubric" aria-hidden>
                    <path d="M0 0 L9 5 L0 10 Z" fill="currentColor" />
                  </svg>
                )}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
