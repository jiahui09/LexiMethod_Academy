import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, Check, Lightbulb, X } from 'lucide-react';
import type { CourseQuestion } from '@/data/courseSchema';
import { getBody } from '@/components/practice/questions/registry';
import { answerDisplay } from '@/components/practice/questions/judge';
import { useSpeech } from '@/hooks/useSpeech';
import { SpeakButton } from '@/components/edu/Speak';
import { COURSE_TYPE_LABELS } from '@/lib/answers';

export type CourseQuestionRunnerProps = {
  questions: CourseQuestion[];
  /** diagnostic=诊断开场；exit=出门条（当场快测） */
  mode: 'diagnostic' | 'exit';
  onDone: (score: number, total: number) => void;
  onAnswered?: (qid: string, correct: boolean) => void;
};

const pad2 = (n: number) => String(n).padStart(2, '0');

/**
 * 课程题运行器（瑞士世界）。
 * 逐题一屏，机器计数 + 方块进度，提交即当场揭晓（决策点4）。
 * 错题走朱红勘误条（errata 只给错误），对题走墨色短确认。
 * 收口只做 plain 计数回调 onDone，分数带报告由课程页接管；无彩带无连击无奖励音。
 */
export default function CourseQuestionRunner({ questions, mode, onDone, onAnswered }: CourseQuestionRunnerProps) {
  const [idx, setIdx] = useState(0);
  const [status, setStatus] = useState<'idle' | 'revealed'>('idle');
  const [given, setGiven] = useState('');
  const [correct, setCorrect] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [finished, setFinished] = useState(false);
  // P1-1 错题归因（必须选一个才能推进）；P1-2 反馈后合上答案重测一次；P1-9 看提示留痕
  const [tag, setTag] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(1);
  const [retryOk, setRetryOk] = useState<boolean | null>(null);
  const hintQids = useRef<Set<string>>(new Set());
  const retryQids = useRef<Set<string>>(new Set());
  const submitLock = useRef(false);
  const doneCalled = useRef(false);
  const { speak, stop } = useSpeech();

  const total = questions.length;
  const q: CourseQuestion | undefined = questions[idx];

  // 换题复位
  useEffect(() => {
    setStatus('idle');
    setGiven('');
    setCorrect(false);
    setShowHint(false);
    setTag(null);
    setAttempt(1);
    setRetryOk(null);
    submitLock.current = false;
  }, [q?.id]);

  // 听音题进场自动播题（换题时触发一次；离线音频 / 语音合成，零外部请求）
  useEffect(() => {
    if (!q?.speak) return;
    const isListening = q.type.startsWith('listen') || q.type === 'minimalPair';
    if (!isListening) return;
    const t = window.setTimeout(
      () => speak(q.speak!, { slow: q.speakSlow, audioKey: q.speakAudio }),
      350,
    );
    return () => {
      window.clearTimeout(t);
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q?.id]);

  // 收口：汇总一出现就回调一次（只回调一次，A 侧幂等也安全）
  useEffect(() => {
    if (finished && !doneCalled.current && total > 0) {
      doneCalled.current = true;
      onDone(results.filter(Boolean).length, total);
    }
  }, [finished, results, total, onDone]);

  const handleSubmit = useCallback(
    (g: string, ok: boolean) => {
      if (!q || submitLock.current) return;
      submitLock.current = true;
      setGiven(g);
      setCorrect(ok);
      setStatus('revealed');
      if (attempt === 1) {
        setResults((r) => [...r, ok]); // 首答计入成绩
        onAnswered?.(q.id, ok);
      } else {
        setRetryOk(ok); // 重测只记是否提取出来，不改首答成绩
        retryQids.current.add(q.id);
      }
    },
    [q, onAnswered, attempt],
  );

  /** P1-2：看过反馈与归因后，合上答案再提取一次 */
  const startRetest = () => {
    if (tag === null || !q) return;
    setAttempt(2);
    setStatus('idle');
    setGiven('');
    setCorrect(false);
    setRetryOk(null);
    submitLock.current = false;
  };

  const next = () => {
    stop();
    if (idx + 1 >= total) setFinished(true);
    else setIdx((i) => i + 1);
  };

  if (!total || !q) return null;

  // 结束汇总：plain 计数，无彩带无百分比评级
  if (finished) {
    const score = results.filter(Boolean).length;
    return (
      <section className=" border-2 border-ink bg-leaf p-6 text-center" data-testid="course-runner-summary">
        <p className="machine text-[13px] text-ink2">{mode === 'exit' ? '出门条' : '诊断'} · 批改完毕</p>
        <p className="mt-3 font-display text-5xl font-extrabold tabular-nums text-ink">
          {score} / {total}
        </p>
        <p className="mt-2 text-sm text-ink2">
          共 {total} 题，答对 {score} 题
        </p>
        {(hintQids.current.size > 0 || retryQids.current.size > 0) && (
          <p className="mt-1 text-[13px] text-ink2">
            留痕：{hintQids.current.size > 0 && `看过提示 ${hintQids.current.size} 题`}
            {hintQids.current.size > 0 && retryQids.current.size > 0 && ' · '}
            {retryQids.current.size > 0 && `反馈后重测 ${retryQids.current.size} 题`}
          </p>
        )}
      </section>
    );
  }

  const Body = getBody(q.type);
  const isSelfGrade = q.type === 'construct' || q.type === 'selfReveal';
  const verdictYes = isSelfGrade ? (q.type === 'selfReveal' ? '回忆对了' : '自评达标') : '答对了';
  const verdictNo = isSelfGrade ? (q.type === 'selfReveal' ? '没想起来' : '自评还差一步') : '这题没答对';
  const answerLabel = isSelfGrade ? '参考' : '正确答案';

  return (
    <section
      className=" border-2 border-ink bg-leaf p-5 md:p-6"
      aria-label={mode === 'exit' ? '出门条测验' : '诊断测验'}
      data-testid="course-question-runner"
    >
      {/* 机器计数 + 方块进度（三重编码：形状 + 颜色 + 屏读文字） */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-rule pb-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="machine text-[13px] font-bold text-ink">
            {pad2(idx + 1)} / {pad2(total)}
          </span>
          <span className="machine border-2 border-ink px-2 py-0.5 text-[12px] text-ink2">
            {COURSE_TYPE_LABELS[q.type] ?? '练习'}
          </span>
          {mode === 'exit' && <span className="machine text-[12px] text-ink2">成绩记在本机，刷新后仍在</span>}
          {hintQids.current.has(q.id) && (
            <span className="machine border border-ink px-1.5 py-0.5 text-[11px] text-ink2">本题看过提示</span>
          )}
        </div>
        <ol className="flex items-center gap-1.5" aria-label="答题进度">
          {questions.map((qq, i) => {
            const st =
              results[i] === undefined ? (i === idx ? 'current' : 'todo') : results[i] ? 'right' : 'wrong';
            return (
              <li key={qq.id} className="flex">
                <span
                  className={`punch ${st === 'current' ? 'punch-active' : st === 'right' ? 'punch-done' : ''}`}
                  style={st === 'wrong' ? { background: '#E34234', borderColor: '#E34234' } : undefined}
                  aria-hidden
                />
                <span className="sr-only">
                  第 {i + 1} 题
                  {st === 'right' ? ' 答对了' : st === 'wrong' ? ' 答错了' : st === 'current' ? ' 当前题' : ' 未作答'}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      {/* 题干 */}
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-[68ch]">
          <h2 className="font-serif text-lg font-bold leading-snug text-ink md:text-xl">{q.prompt}</h2>
          {q.narration && <p className="mt-1.5 text-[13px] leading-relaxed text-ink2">{q.narration}</p>}
        </div>
        {q.speak && (
          <div className="flex shrink-0 items-center gap-2">
            <SpeakButton text={q.speak} size="lg" label="播放题目发音" audioKey={q.speakAudio} />
            <SpeakButton text={q.speak} size="lg" slow label="慢速播放题目发音" audioKey={q.speakAudio} />
          </div>
        )}
      </div>

      {/* 作答体（按题型分发） */}
      <Body key={q.id} q={q} given={given} revealed={status === 'revealed'} onSubmit={handleSubmit} />

      {/* 讲评区，揭晓即播报 */}
      <div className="mt-4" aria-live="polite">
        {status === 'revealed' &&
          (correct ? (
            <div className="flex gap-2.5 border-2 border-ink bg-under p-4">
              <Check size={17} strokeWidth={2.5} className="mt-0.5 shrink-0 text-ink" aria-hidden />
              <div>
                <p className="font-display text-sm font-bold text-ink">
                  {attempt === 2 ? '重测想出来了' : verdictYes}
                </p>
                {attempt === 2 && (
                  <p className="mt-1 text-[13px] leading-relaxed text-ink2">
                    合上答案自己提取出来了——这次是你的记忆在出力（首答仍记错，重测只做留痕）。
                  </p>
                )}
                {q.explain && <p className="mt-1 text-[13px] leading-relaxed text-ink2">{q.explain}</p>}
              </div>
            </div>
          ) : (
            <div className=" border-2 border-errata bg-errata-deep p-4 text-white">
              <div className="flex items-center gap-2 font-display text-sm font-bold">
                <X size={17} strokeWidth={2.5} aria-hidden />{' '}
                {attempt === 2 ? (retryOk ? '重测想出来了' : '重测还是没想起来') : verdictNo}
              </div>
              {attempt === 1 ? (
                <>
                  <p className="mt-1.5 text-[13px]">
                    {answerLabel} <span className="machine font-bold">{answerDisplay(q)}</span>
                  </p>
                  {q.explain && <p className="mt-1.5 text-[13px] leading-relaxed">{q.explain}</p>}
                </>
              ) : (
                <p className="mt-1.5 text-[13px]">
                  {retryOk
                    ? '合上答案自己提取出来了——这次是你的记忆在出力。'
                    : '还没提取出来，把这条错处记进本机错题本，换一题继续。'}
                </p>
              )}
              {/* P1-1 强制归因：错题必须归因才能推进 */}
              {attempt === 1 && (
                <div className="mt-3 border-t border-white/30 pt-2.5">
                  <p className="text-[13px] font-bold">这题为什么错？（选一个才能进下一题）</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5" role="group" aria-label="错题归因">
                    {['听辨错', '对应错', '粗心'].map((k) => (
                      <button
                        key={k}
                        type="button"
                        aria-pressed={tag === k}
                        onClick={() => setTag(k)}
                        className={`hinge min-h-[36px] border-2 border-white px-3 text-[13px] font-bold ${
                          tag === k ? 'bg-white text-errata-deep' : 'text-white hover:bg-white/15'
                        }`}
                      >
                        {k}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {attempt === 1 && tag !== null && (
                <button
                  type="button"
                  onClick={startRetest}
                  className="hinge mt-3 inline-flex min-h-[40px] items-center gap-1.5 border-2 border-white bg-white px-4 text-[13px] font-bold text-errata-deep hover:bg-white/90"
                >
                  合上答案再试一次
                </button>
              )}
              {tag !== null && (
                <p className="mt-2 text-[12px] text-white/85">归因：{tag}</p>
              )}
            </div>
          ))}
      </div>

      {/* 提示与推进 */}
      <div className="mt-5 flex flex-wrap items-end justify-between gap-3 border-t border-rule pt-4">
        {status === 'idle' && q.hint ? (
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                if (!showHint && q) hintQids.current.add(q.id); // 看过提示就留痕
                setShowHint((v) => !v);
              }}
              aria-expanded={showHint}
              className="hinge inline-flex min-h-[44px] items-center gap-1.5 self-start border-2 border-ink px-3.5 py-2 text-[13px] font-bold text-ink transition-colors hover:bg-under"
            >
              <Lightbulb size={14} aria-hidden /> {showHint ? '收起提示' : '看提示'}
            </button>
            {showHint && (
              <p className="max-w-[60ch] border-2 border-ink bg-under p-3 text-[13px] leading-relaxed text-ink2">
                {q.hint}
              </p>
            )}
          </div>
        ) : (
          <span aria-hidden />
        )}
        <button
          type="button"
          onClick={next}
          disabled={status !== 'revealed' || (!correct && attempt === 1)}
          className="inline-flex min-h-[44px] items-center gap-1.5 bg-ink px-5 py-2.5 font-display text-sm font-bold text-milk transition-colors press shadow-hard hover:bg-ink2 disabled:opacity-40"
        >
          {idx + 1 >= total ? '批改完成' : '下一题'} <ArrowRight size={14} aria-hidden />
        </button>
      </div>
    </section>
  );
}
