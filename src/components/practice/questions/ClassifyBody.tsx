import { Check, X } from 'lucide-react';
import type { BodyProps } from './types';
import { normChoice } from './judge';

/**
 * 归类作答体：把情境装进一个类别（错因归类、真假拆解）。
 * 类别是箱子钮，点选即提交；揭晓 = ✓ 正确类别 + ✗ 你的归入处 + 屏读文字，不靠颜色单通道。
 */
export default function ClassifyBody({ q, given, revealed, onSubmit }: BodyProps) {
  const choices = q.choices ?? [];
  if (!choices.length) return null;

  return (
    <div className="flex flex-col gap-2.5" role="group" aria-label="类别">
      <p className="text-[13px] text-ink2">点一个类别，把这道情境归进去</p>
      <div className="flex flex-wrap gap-2.5">
        {choices.map((c) => {
          const chosen = revealed && normChoice(given) === normChoice(c.label);
          const right = revealed && c.correct;
          const wrongPick = revealed && chosen && !c.correct;
          return (
            <button
              key={c.label}
              type="button"
              disabled={revealed}
              onClick={() => onSubmit(c.label, c.correct)}
              className={`hinge flex min-h-[44px] items-center gap-2.5 border px-4 py-3 text-left font-serif font-bold ${
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
              {c.label}
              {right && <Check size={16} strokeWidth={2.5} aria-hidden />}
              {wrongPick && <X size={16} strokeWidth={2.5} aria-hidden />}
              <span className="sr-only">
                {right ? '，正确类别' : ''}
                {wrongPick ? '，你归到这里，归错了' : ''}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
