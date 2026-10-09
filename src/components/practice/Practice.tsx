import { useState } from 'react';
import { Check } from 'lucide-react';
import type { Practice as PracticeData } from '@/data/courseSchema';
import { KIND_REGISTRY } from './kinds';

/**
 * 微练习渲染器（契约 §2，A 调用）。
 * 结构 = title（黑体）+ prompt（衬线正文 ≤68ch）+ 按 kind 分发的互动体 + debrief 收口行。
 * onDone 在互动体收口时触发（可多次，A 自行幂等）；收口后先做一句自我解释（P1-8），
 * 写完才亮出 debrief 讲评——让收口从「读陈述句」变成「先产出再对答案」。
 * 未识别 kind 降级为 title + prompt + debrief 的面板：须勾「已按流程做完」才可收口（P0-4），
 * 绝不崩溃，也不再一键即过。
 */
export function Practice({
  practice,
  onDone,
  courseId,
}: {
  practice: PracticeData;
  onDone?: () => void;
  /** 所属课程 id（成绩门用：指针型练习据此查诊断/出门条成绩） */
  courseId?: string;
}) {
  const [done, setDone] = useState(false);
  const [attested, setAttested] = useState(false);
  const [note, setNote] = useState('');
  const [explained, setExplained] = useState(false);
  const Kind = KIND_REGISTRY[practice.kind];

  const handleDone = () => {
    setDone(true);
    onDone?.();
  };

  const needExplain = done && !explained && !!practice.debrief;

  return (
    <section className="leaf my-4 border-2 border-ink p-4 sm:p-5" aria-label={`练习，${practice.title}`}>
      <div className="mb-2 flex items-center gap-2">
        <span className="machine bg-ink px-1.5 py-0.5 text-[12px] text-milk" aria-hidden>
          练
        </span>
        <h3 className="font-display text-[17px] font-bold text-ink">{practice.title}</h3>
      </div>

      <p className="mb-4 max-w-[68ch] text-[16px] leading-[1.8] text-ink">{practice.prompt}</p>

      {Kind ? (
        <Kind practice={practice} onDone={handleDone} courseId={courseId} />
      ) : (
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleDone}
            disabled={!attested}
            className="hinge inline-flex min-h-[44px] items-center gap-2 bg-ink px-4 font-display text-sm font-bold text-milk press shadow-hard hover:bg-ink2 disabled:opacity-40"
          >
            <Check size={15} strokeWidth={3} aria-hidden />
            做完了
          </button>
          <label className="flex cursor-pointer items-center gap-2 text-[13px] text-ink2">
            <input
              type="checkbox"
              checked={attested}
              onChange={(e) => setAttested(e.target.checked)}
              className="h-4 w-4 accent-[#111]"
            />
            我已按上面的流程实际做了一遍（勾上才能收口）
          </label>
        </div>
      )}

      {/* P1-8 自我解释：收口后先写一句自己的话，再亮 debrief 讲评 */}
      <div aria-live="polite">
        {needExplain && (
          <div className="mt-4 border-t border-rule pt-4">
            <label className="mb-1.5 block text-[14px] font-bold text-ink" htmlFor={`explain-${practice.title}`}>
              先别看讲评：用一句话写下这个练习你练到了什么？
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <input
                id={`explain-${practice.title}`}
                type="text"
                value={note}
                maxLength={60}
                onChange={(e) => setNote(e.target.value)}
                placeholder="我刚才练的是……（至少 8 个字）"
                className="h-11 w-full max-w-[46ch] border-2 border-ink bg-leaf px-3 text-[15px] placeholder:text-ink2 focus:border-ink"
              />
              <button
                type="button"
                onClick={() => {
                  if (note.trim().length >= 8) setExplained(true);
                }}
                disabled={note.trim().length < 8}
                className="hinge inline-flex min-h-[44px] items-center gap-1.5 bg-ink px-4 font-display text-sm font-bold text-milk press shadow-hard hover:bg-ink2 disabled:opacity-40"
              >
                写好了，看讲评
              </button>
            </div>
            <p className="mt-1.5 text-[12px] text-ink2" aria-live="polite">
              {note.trim().length > 0 && note.trim().length < 8
                ? `还差 ${8 - note.trim().length} 个字——用自己的话说才算提取。`
                : '写满 8 个字才能看讲评。'}
            </p>
          </div>
        )}
        {done && explained && practice.debrief && (
          <p className="hinge mt-4 flex items-start gap-2 border-t border-rule pt-3 text-[14px] font-bold text-ink">
            <span className="punch punch-done mt-1.5" aria-hidden />
            <span className="max-w-[68ch]">{practice.debrief}</span>
          </p>
        )}
      </div>
    </section>
  );
}

export default Practice;
