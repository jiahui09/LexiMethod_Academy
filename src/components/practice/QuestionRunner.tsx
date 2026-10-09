import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Lightbulb, ArrowRight, RefreshCw, Headphones, Turtle } from 'lucide-react';
import type { Question } from '@/types';
import { judgeAnswer, letterFeedback, isWriteType, TYPE_LABELS } from '@/lib/answers';
import { useSpeech } from '@/hooks/useSpeech';
import { playSfx } from '@/hooks/useSfx';
import { useMotionTier } from '@/hooks/useMotionTier';
import { useProgress } from '@/store/progressStore';
import { useReview } from '@/store/reviewStore';
import { SpeakButton } from '@/components/ui/Bits';
import { EduButton } from '@/components/edu';
import TokenPlacer from '@/components/course/TokenPlacer';

type Props = {
  questions: Question[];
  onFinish?: (score: { correct: number; total: number }) => void;
  onAnswered?: (q: Question, correct: boolean, given: string) => void;
  record?: boolean;
  trackMistakes?: boolean;
  heading?: string;
  /** 视面：全站已切辞书纸面；保留 tone 以兼容既有调用，仅透传给朗读钮/拼块器 */
  tone?: 'dark' | 'paper';
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** 通用题目运行器：11 种题型 / 对错反馈 / 完成盖章 / 错题记录（辞书纸面版式） */
export default function QuestionRunner({
  questions,
  onFinish,
  onAnswered,
  record = true,
  trackMistakes = true,
  heading,
  tone = 'paper',
}: Props) {
  const tier = useMotionTier();
  const { speak, stop, supported } = useSpeech();
  const recordAnswer = useProgress((s) => s.recordAnswer);
  const addMistake = useReview((s) => s.addMistake);

  const [idx, setIdx] = useState(0);
  const [given, setGiven] = useState('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [results, setResults] = useState<{ correct: boolean; given: string }[]>([]);
  const [done, setDone] = useState(false);
  const [burst, setBurst] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const q = questions[idx];
  const total = questions.length;

  const order = useMemo(() => (q?.choices ? shuffle(q.choices) : undefined), [q]);

  const reset = useCallback((next?: Question[]) => {
    setIdx(0);
    setGiven('');
    setStatus('idle');
    setResults([]);
    setDone(false);
    if (next) setBurst((b) => b); // no-op，保持引用
  }, []);

  // 换题时自动朗读 + 重置状态
  useEffect(() => {
    setStatus('idle');
    setGiven('');
    if (!q) return;
    if (q.speak) {
      const t = window.setTimeout(() => speak(q.speak!, { slow: q.speakSlow }), 350);
      return () => window.clearTimeout(t);
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, q?.id]);

  useEffect(() => {
    if (isWriteType(q?.type ?? '')) inputRef.current?.focus();
  }, [idx, q?.type]);

  const finish = useCallback(
    (rs: { correct: boolean; given: string }[]) => {
      const correct = rs.filter((r) => r.correct).length;
      setDone(true);
      playSfx('complete');
      // 完成时刻的彩带：整组全对才放（设计规则：只有完成时刻允许彩带）
      if (rs.length > 0 && correct === rs.length) setBurst((b) => b + 1);
      onFinish?.({ correct, total: rs.length });
    },
    [onFinish, total],
  );

  const commit = useCallback(
    (value: string) => {
      if (!q || status !== 'idle') return;
      const ok = judgeAnswer(q, value);
      setStatus(ok ? 'correct' : 'wrong');
      setGiven(value);
      playSfx(ok ? 'correct' : 'wrong');
      if (record) recordAnswer(q.type, ok);
      if (!ok && trackMistakes) addMistake(q, value);
      onAnswered?.(q, ok, value);
      setResults((r) => [...r, { correct: ok, given: value }]);
    },
    [q, status, record, trackMistakes, addMistake, onAnswered],
  );

  const next = useCallback(() => {
    stop();
    if (idx + 1 >= total) {
      finish(results);
    } else {
      setIdx((i) => i + 1);
    }
  }, [idx, total, finish, results, stop]);

  if (!q) return null;

  if (done) {
    const correct = results.filter((r) => r.correct).length;
    const pct = results.length ? Math.round((correct / results.length) * 100) : 0;
    const wrongList = questions.filter((_, i) => results[i] && !results[i].correct);
    return (
      <div className="relative border border-rule bg-under/60 p-6 text-center">
        <div className="mb-3 flex items-center justify-center gap-2">
          <span className="punch punch-done" aria-hidden />
          <span className="machine text-ink2">已阅</span>
        </div>
        <div className="font-serif text-4xl font-bold tabular-nums text-ink">{pct}%</div>
        <p className="mt-1 text-sm text-ink2">
          答对 <span className="text-board-deconstruct">{correct}</span> / {results.length}（正确率{' '}
          <span className="tabular-nums text-board-deconstruct">{pct}%</span>）
        </p>
        {wrongList.length > 0 && (
          <div className="mx-auto mt-4 max-w-xl border border-errata/45 bg-errata/[0.05] p-4 text-left text-xs text-ink2">
            <div className="mb-1.5 font-semibold text-errata-deep">错题已排入间隔重复队列，稍后重现</div>
            <ul className="space-y-1">
              {wrongList.slice(0, 4).map((wq) => (
                <li key={wq.id} className="flex flex-wrap gap-2">
                  <span className="text-ink">{wq.prompt.slice(0, 30)}</span>
                  <span className="ipa text-board-deconstruct">{wq.answer}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <EduButton
            variant="primary"
            onClick={() => {
              playSfx('click');
              reset();
              setIdx(0);
            }}
          >
            <RefreshCw size={14} aria-hidden /> 再来一组
          </EduButton>
        </div>
      </div>
    );
  }

  const isChoice = Boolean(q.choices);
  const writeType = isWriteType(q.type);

  return (
    <div className="relative border border-rule bg-under/60 p-5 md:p-6">
      {/* 头部：题号 / 题型 */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-ink2">
          <span className=" border border-board-deconstruct/45 px-2 py-0.5 font-semibold text-board-deconstruct">
            {TYPE_LABELS[q.type]}
          </span>
          <span className="tabular-nums">
            {idx + 1} / {total}
          </span>
          {heading && <span className="hidden sm:inline">· {heading}</span>}
        </div>
        <div className="flex items-center gap-3">
          {q.speak && supported && (
            <div className="flex items-center gap-1.5">
              <SpeakButton text={q.speak} label="常速播放" tone={tone} className="min-h-[44px] min-w-[44px]" />
              <SpeakButton text={q.speak} slow label="慢速播放" tone={tone} className="min-h-[44px] min-w-[44px]" />
            </div>
          )}
        </div>
      </div>

      {/* 进度条 */}
      <div className="mb-5 h-1.5 overflow-hidden bg-rule" aria-hidden>
        <motion.div
          className="h-full bg-board-deconstruct"
          animate={{ width: `${((idx + (status !== 'idle' ? 1 : 0)) / total) * 100}%` }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      {/* 题干 */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-lg font-semibold text-ink md:text-xl">{q.prompt}</p>
          <p className="mt-1 text-xs text-ink2">{q.narration}</p>
        </div>
        {q.speak && !isChoice && (
          <button
            type="button"
            onClick={() => speak(q.speak!, { slow: q.speakSlow })}
            className="flex min-h-[44px] items-center gap-1.5 border border-rule px-3 py-2 text-xs text-ink2 transition-colors hover:border-ink hover:text-ink"
          >
            <Headphones size={14} aria-hidden /> 播放
          </button>
        )}
      </div>

      {/* 作答区 */}
      <div className="relative">
        {isChoice && order && (
          <div className="grid gap-2.5 sm:grid-cols-2">
            {order.map((c, i) => {
              const chosen = norm(given) === norm(c.label);
              const reveal = status !== 'idle';
              const isRight = c.correct;
              return (
                <motion.button
                  key={`${c.label}-${i}`}
                  type="button"
                  disabled={reveal}
                  onClick={() => commit(c.label)}
                  initial={tier === 'off' ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={reveal ? undefined : { scale: 1.015, y: -2 }}
                  whileTap={reveal ? undefined : { scale: 0.98 }}
                  className={`relative flex min-h-[44px] items-center justify-between gap-3 overflow-hidden border px-4 py-3.5 text-left transition-colors duration-300 ${
                    reveal && isRight
                      ? 'border-board-deconstruct bg-board-deconstruct/[0.07]'
                      : reveal && chosen
                        ? 'border-errata bg-errata/[0.07] animate-shake'
                        : reveal
                          ? 'border-rule bg-transparent'
                          : 'border-rule bg-leaf hover:border-board-deconstruct hover:bg-board-deconstruct/[0.04]'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="flex h-6 w-6 items-center justify-center border border-rule bg-under text-xs font-bold text-board-deconstruct">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className={`font-semibold text-ink ${c.sub ? '' : 'ipa text-base'}`}>{c.label}</span>
                    {c.sub && <span className="text-xs text-ink2">{c.sub}</span>}
                  </span>
                  {reveal && isRight && <Check size={17} className="text-board-deconstruct" aria-hidden />}
                  {reveal && chosen && !isRight && <X size={17} className="text-errata-deep" aria-hidden />}
                </motion.button>
              );
            })}
          </div>
        )}

        {writeType && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              commit(given);
            }}
            className="flex flex-col gap-3"
          >
            <div className="flex gap-2">
              <input
                ref={inputRef}
                className={`edu-input min-w-0 flex-1 font-mono text-base ${
                  status === 'correct' ? 'border-board-deconstruct' : status === 'wrong' ? 'border-errata' : ''
                }`}
                value={given}
                onChange={(e) => setGiven(e.target.value)}
                disabled={status !== 'idle'}
                placeholder={q.type === 'listenWritePhoneme' ? '输入音标，如 /θɪŋk/' : '输入你听到的单词'}
                aria-label={q.prompt}
                autoComplete="off"
                spellCheck={false}
              />
              <EduButton
                type="submit"
                variant="primary"
                className="shrink-0 whitespace-nowrap"
                disabled={status !== 'idle' || !given.trim()}
              >
                {status === 'idle' ? '提交' : status === 'correct' ? '正确' : '已批改'}
              </EduButton>
            </div>

            {/* 逐字母反馈 */}
            {status !== 'idle' && q.type === 'listenWriteWord' && (
              <div className="flex flex-wrap items-center gap-1.5" aria-label="逐字母批改结果">
                {letterFeedback(given, q.answer).map((l, i) => (
                  <motion.span
                    key={i}
                    initial={tier === 'off' ? false : { scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.06 }}
                    className={`flex h-9 w-8 items-center justify-center border font-mono text-sm font-semibold ${
                      l.status === 'same'
                        ? 'border-board-deconstruct bg-board-deconstruct/[0.08] text-board-deconstruct'
                        : 'border-errata bg-errata/[0.08] text-errata-deep animate-shake'
                    }`}
                  >
                    {l.char}
                  </motion.span>
                ))}
              </div>
            )}
          </form>
        )}

        {q.type === 'syllableSplit' && q.syllableUnits && (
          <TokenPlacer
            key={q.id}
            pieces={q.syllableUnits.map((t, i) => ({ id: `${t}-${i}-${q.id}`, text: t }))}
            slotCount={q.syllableUnits.length}
            answer={q.answer}
            instructions="点击（或拖拽）上方拼块，按正确顺序放入下方槽位。"
            ruleHint={q.hint}
            tone={tone}
            onResult={(ok, g) => commit(ok ? q.answer : g)}
          />
        )}

        {q.type === 'affixAssemble' && q.affixUnits && (
          <TokenPlacer
            key={q.id}
            pieces={q.affixUnits.map((u) => ({ id: `${u.text}-${u.type}`, text: u.text, hint: u.meaning }))}
            slotCount={q.affixUnits.length}
            answer={q.answer}
            instructions="把前缀、词根、后缀按构词顺序放入槽位（悬停可看含义）。"
            ruleHint={q.hint}
            tone={tone}
            onResult={(ok, g) => commit(ok ? q.answer : g)}
          />
        )}

        {q.type === 'stressPosition' && q.syllableUnits && (
          <div className="flex flex-wrap items-center gap-2.5" role="group" aria-label="选择重音音节">
            {q.syllableUnits.map((s, i) => {
              const chosen = Number(given) === i;
              const reveal = status !== 'idle';
              const right = reveal && Number(q.answer) === i;
              return (
                <div key={`${s}-${i}`} className="flex items-center gap-2.5">
                  <motion.button
                    type="button"
                    disabled={reveal}
                    onClick={() => commit(String(i))}
                    whileHover={reveal ? undefined : { y: -3 }}
                    className={`inline-flex min-h-[44px] items-center gap-2 border px-5 py-4 text-lg font-bold transition-colors ${
                      right
                        ? 'border-board-deconstruct bg-board-deconstruct/[0.08] text-board-deconstruct'
                        : reveal && chosen
                          ? 'border-errata bg-errata/[0.08] text-errata-deep animate-shake'
                          : 'border-rule bg-leaf text-ink hover:border-board-deconstruct'
                    }`}
                    aria-label={`第 ${i + 1} 音节 ${s}${right ? ' 正确' : ''}`}
                  >
                    {s}
                    {right && <Check size={16} strokeWidth={2.5} aria-hidden />}
                    {reveal && chosen && !right && <X size={16} strokeWidth={2.5} aria-hidden />}
                  </motion.button>
                  <span className="text-xs text-ink2">#{i}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 提交后反馈：就地印在题下，不弹模态、不加 toast */}
      <AnimatePresence>
        {status !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`mt-4 border p-4 text-sm text-ink ${
              status === 'correct' ? 'border-board-deconstruct/60 bg-board-deconstruct/[0.06]' : 'border-errata/60 bg-errata/[0.06]'
            }`}
            role="status"
            aria-live="polite"
          >
            <div className="mb-1 flex items-center gap-2 font-semibold">
              {status === 'correct' ? (
                <>
                  <Check size={15} className="text-board-deconstruct" /> 回答正确
                </>
              ) : (
                <>
                  <X size={15} className="text-errata-deep" /> 正确答案：
                  <span className="ipa text-ink">{q.answer}</span>
                </>
              )}
            </div>
            {status === 'wrong' && (
              <div className="mb-1.5 flex items-start gap-1.5 text-xs">
                <Lightbulb size={13} className="mt-0.5 shrink-0 text-errata-deep" aria-hidden />
                {q.hint}
              </div>
            )}
            <p className="text-xs leading-relaxed opacity-90">{q.explain}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 操作 */}
      <div className="mt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => speak(q.speak ?? q.prompt, { slow: true })}
          disabled={!supported}
          className="flex min-h-[44px] items-center gap-1.5 text-xs text-ink2 transition-colors hover:text-ink disabled:opacity-40"
        >
          <Turtle size={13} aria-hidden /> 慢速再听一遍
        </button>
        <EduButton variant="primary" onClick={next} disabled={status === 'idle'}>
          {idx + 1 >= total ? '查看结果' : '下一题'} <ArrowRight size={14} aria-hidden />
        </EduButton>
      </div>
    </div>
  );
}

function norm(s: string): string {
  return s.trim().toLowerCase();
}
