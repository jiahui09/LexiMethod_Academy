import { Check, X } from 'lucide-react';
import type { BodyProps } from './types';

/**
 * 重音定位作答体：给出音节块，点出读得响又长的那块（下标即答案，数据里 answer = 0 起的索引）。
 */
export default function StressBody({ q, given, revealed, onSubmit }: BodyProps) {
  const units = q.syllableUnits ?? [];
  const answerIndex = Number(q.answer);
  const chosenIndex = Number(given);

  if (!units.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-2.5" role="group" aria-label="选择重读音节">
      {units.map((u, i) => {
        const chosen = revealed && chosenIndex === i;
        const right = revealed && answerIndex === i;
        const wrongPick = revealed && chosen && !right;
        return (
          <button
            key={`${u}-${i}`}
            type="button"
            disabled={revealed}
            onClick={() => onSubmit(String(i), i === answerIndex)}
            aria-label={`第 ${i + 1} 音节 ${u}`}
            className={`hinge flex min-h-[44px] items-center gap-2 border-2 px-5 py-3.5 font-serif text-lg font-bold ${
              wrongPick
                ? 'border-2 border-errata bg-leaf text-errata'
                : right
                  ? 'border-2 border-ink bg-leaf text-ink'
                  : 'border-ink/25 bg-leaf text-ink hover:border-ink/60 hover:bg-under'
            }`}
          >
            <span
              className={`punch ${chosen ? 'punch-done' : ''}`}
              style={wrongPick ? { background: '#E34234', borderColor: '#E34234' } : undefined}
              aria-hidden
            />
            {u}
            <span className="machine text-[12px] text-ink2">#{i + 1}</span>
            {right && <Check size={16} strokeWidth={2.5} aria-hidden />}
            {wrongPick && <X size={16} strokeWidth={2.5} aria-hidden />}
            <span className="sr-only">
              {right ? '，重读这里' : ''}
              {wrongPick ? '，你点这里，点错了' : ''}
            </span>
          </button>
        );
      })}
    </div>
  );
}
