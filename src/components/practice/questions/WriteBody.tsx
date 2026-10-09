import { useState, type FormEvent } from 'react';
import { Check } from 'lucide-react';
import type { BodyProps } from './types';
import { judgeCourseAnswer, letterFeedback } from './judge';

const PLACEHOLDERS: Record<string, string> = {
  listenWriteWord: '写出你听到的单词',
  listenWritePhoneme: '写出你听到的音标',
  fill: '把答案写在这里',
};

/**
 * 填写作答体：fill / listenWriteWord / listenWritePhoneme。
 * 提交前可反复改写，提交即揭晓；听写词带逐字母批改（形状 + 颜色 + 屏读文字三通道）。
 */
export default function WriteBody({ q, given, revealed, onSubmit }: BodyProps) {
  const [text, setText] = useState('');
  const isDictation = q.type === 'listenWriteWord';
  const mono = q.type === 'listenWriteWord' || q.type === 'listenWritePhoneme';

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (revealed || !text.trim()) return;
    onSubmit(text, judgeCourseAnswer(q, text));
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          className={`edu-input min-h-[44px] flex-1 ${mono ? 'font-mono text-base' : ''}`}
          value={revealed ? given : text}
          onChange={(e) => setText(e.target.value)}
          disabled={revealed}
          placeholder={PLACEHOLDERS[q.type] ?? '写下你的答案'}
          aria-label="你的答案"
          autoComplete="off"
          spellCheck={false}
        />
        <button
          type="submit"
          disabled={revealed || !text.trim()}
          className="hinge min-h-[44px] shrink-0 bg-ink px-5 py-2.5 font-display text-sm font-bold text-milk transition-colors hover:bg-ink2 disabled:opacity-40"
        >
          {revealed ? '已批改' : '提交'}
        </button>
      </div>

      {revealed && isDictation && (
        <div className="flex flex-wrap items-center gap-1.5" aria-label="逐字母批改结果">
          {letterFeedback(given, q.answer).map((l, i) => (
            <span
              key={`${l.char}-${i}`}
              title={l.status === 'same' ? '写对了' : l.status === 'wrong' ? '写错了' : '漏写了'}
              className={`flex h-9 min-w-[34px] items-center justify-center border-2 px-1.5 font-mono text-sm font-bold ${
                l.status === 'same'
                  ? 'border-ink text-ink'
                  : l.status === 'wrong'
                    ? 'border-errata text-errata'
                    : 'border-rule text-ink2'
              }`}
            >
              {l.char}
              <span className="sr-only">
                {l.status === 'same' ? ' 写对了' : l.status === 'wrong' ? ' 写错了' : ' 漏写了'}
              </span>
            </span>
          ))}
          <Check size={16} className="ml-1 text-ink" aria-hidden />
        </div>
      )}
    </form>
  );
}
