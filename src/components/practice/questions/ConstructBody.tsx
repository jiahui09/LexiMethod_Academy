import { useState } from 'react';
import type { BodyProps } from './types';

/**
 * 开放题作答体：construct（造句）/ selfReveal（回忆→揭示→自评）。
 * 流程三拍，先写，再对照参考，最后自己判达标与否（开放题没有机器判法，由作答者自评）。
 */
export default function ConstructBody({ q, given, revealed, onSubmit }: BodyProps) {
  const [text, setText] = useState('');
  const [peek, setPeek] = useState(false);
  const isRecall = q.type === 'selfReveal';

  const peekLabel = isRecall ? '揭示答案' : '对照参考';
  const gradeLabels = isRecall ? ['回忆对了', '没想起来'] : ['写到位了', '还差一步'];

  if (revealed) {
    return (
      <div className="under-leaf border border-rule p-4">
        <p className="machine text-[12px] text-ink2">你写的</p>
        <p className="mt-1 whitespace-pre-wrap font-serif text-[15px] text-ink">{given}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <textarea
        className="edu-input min-h-[112px] w-full"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={isRecall ? '先凭记忆写下来，再揭示对照' : '先写下你现在的答案'}
        aria-label="你的作答"
        rows={4}
      />

      {!peek && (
        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            disabled={!text.trim()}
            onClick={() => setPeek(true)}
            className="hinge min-h-[44px] border border-ink/40 px-4 py-2.5 font-display text-sm font-bold text-ink transition-colors hover:bg-under disabled:opacity-40"
          >
            {peekLabel}
          </button>
        </div>
      )}

      {peek && (
        <div className="flex flex-col gap-3">
          <div className="under-leaf border border-rule p-4">
            <p className="machine text-[12px] text-ink2">参考</p>
            <p className="mt-1 font-serif text-[15px] text-ink">{q.answer}</p>
          </div>
          <div className="flex flex-wrap gap-2.5" role="group" aria-label="对照参考后自评">
            <button
              type="button"
              onClick={() => onSubmit(text, true)}
              className="hinge min-h-[44px] bg-ink px-5 py-2.5 font-display text-sm font-bold text-milk transition-colors hover:bg-ink2"
            >
              {gradeLabels[0]}
            </button>
            <button
              type="button"
              onClick={() => onSubmit(text, false)}
              className="hinge min-h-[44px] border border-ink/40 px-5 py-2.5 font-display text-sm font-bold text-ink transition-colors hover:bg-under"
            >
              {gradeLabels[1]}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
