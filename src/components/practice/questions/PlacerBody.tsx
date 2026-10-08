import { useMemo, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import type { BodyProps } from './types';
import { judgeCourseAnswer } from './judge';
import { seededShuffle } from './shuffle';

type Piece = { text: string; hint?: string };

/**
 * 拼块作答体：syllableSplit（音节切块排队）/ affixAssemble（前缀词根后缀拼装）。
 * 点拼块进槽、点槽位取回，装满才提交；顺序即答案，拼块显示序按题 id 播种打乱。
 */
export default function PlacerBody({ q, given, revealed, onSubmit }: BodyProps) {
  const isAffix = q.type === 'affixAssemble';

  const pieces = useMemo<Piece[]>(() => {
    if (isAffix) {
      const units = q.affixUnits ?? [];
      return seededShuffle(
        units.map((u) => ({ text: u.text, hint: u.meaning })),
        q.id,
      );
    }
    const units = q.syllableUnits ?? [];
    return seededShuffle(
      units.map((u) => ({ text: u })),
      q.id,
    );
  }, [isAffix, q]);

  const [slots, setSlots] = useState<(number | null)[]>(() => pieces.map(() => null));

  if (!pieces.length) return null;

  const usedAt = (pieceIdx: number) => slots.indexOf(pieceIdx);
  const filled = slots.every((s) => s !== null);

  const place = (pieceIdx: number) => {
    if (revealed || usedAt(pieceIdx) !== -1) return;
    const next = [...slots];
    const empty = next.indexOf(null);
    if (empty === -1) return;
    next[empty] = pieceIdx;
    setSlots(next);
  };

  const pull = (slot: number) => {
    if (revealed) return;
    const next = [...slots];
    next[slot] = null;
    setSlots(next);
  };

  const submit = () => {
    if (revealed || !filled) return;
    const givenOrder = slots.map((s) => pieces[s ?? 0].text).join('-');
    onSubmit(givenOrder, judgeCourseAnswer(q, givenOrder));
  };

  const clear = () => {
    if (revealed) return;
    setSlots(pieces.map(() => null));
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[13px] text-ink2">点拼块放进槽位，点槽位把拼块取回，排好再提交</p>

      {/* 拼块池 */}
      <div className="flex flex-wrap gap-2.5" aria-label="拼块">
        {pieces.map((p, i) => {
          const used = usedAt(i) !== -1;
          return (
            <button
              key={`${p.text}-${i}`}
              type="button"
              disabled={revealed || used}
              onClick={() => place(i)}
              className={`hinge flex min-h-[44px] flex-col items-center justify-center gap-0.5 rounded-[3px] border px-4 py-2 ${
                used
                  ? 'border-dashed border-rule bg-transparent text-ink2 opacity-50'
                  : 'border-ink/40 bg-leaf font-bold text-ink hover:bg-under'
              }`}
            >
              <span className={isAffix ? 'font-serif text-[15px]' : 'machine text-[15px]'}>{p.text}</span>
              {p.hint && <span className="text-[11px] font-normal text-ink2">{p.hint}</span>}
            </button>
          );
        })}
      </div>

      {/* 槽位 */}
      <div className="flex flex-wrap items-center gap-2" aria-label="槽位">
        {slots.map((pieceIdx, slot) => {
          const p = pieceIdx != null ? pieces[pieceIdx] : null;
          return (
            <button
              key={slot}
              type="button"
              disabled={revealed || p == null}
              onClick={() => pull(slot)}
              aria-label={p ? `第 ${slot + 1} 槽 ${p.text}，点此取回` : `第 ${slot + 1} 槽，空`}
              className={`hinge flex min-h-[44px] min-w-[72px] items-center justify-center rounded-[3px] border-2 px-4 py-2 font-bold ${
                p
                  ? 'border-ink bg-leaf text-ink'
                  : 'border-dashed border-rule bg-transparent text-ink2'
              }`}
            >
              <span className={isAffix ? 'font-serif' : 'machine text-[15px]'}>{p ? p.text : '空槽'}</span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2.5">
        <button
          type="button"
          disabled={revealed || !filled}
          onClick={submit}
          className="hinge min-h-[44px] rounded-[3px] bg-ink px-5 py-2.5 font-display text-sm font-bold text-milk transition-colors hover:bg-ink2 disabled:opacity-40"
        >
          {revealed ? '已批改' : '装好了，提交'}
        </button>
        <button
          type="button"
          disabled={revealed}
          onClick={clear}
          className="hinge inline-flex min-h-[44px] items-center gap-1.5 rounded-[3px] border border-ink/40 px-4 py-2.5 font-display text-sm font-bold text-ink transition-colors hover:bg-under disabled:opacity-40"
        >
          <RotateCcw size={14} aria-hidden /> 全部取回
        </button>
      </div>
    </div>
  );
}
