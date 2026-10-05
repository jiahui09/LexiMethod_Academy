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
import NeonButton from '@/components/ui/NeonButton';
import { SpeakButton } from '@/components/ui/Bits';
import ConfettiBurst from '@/components/fx/ConfettiBurst';
import { LightWave } from '@/components/course/FeedbackFx';
import TokenPlacer from '@/components/course/TokenPlacer';

type Props = {
  questions: Question[];
  onFinish?: (score: { correct: number; total: number }) => void;
  onAnswered?: (q: Question, correct: boolean, given: string) => void;
  record?: boolean;
  trackMistakes?: boolean;
  heading?: string;
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** 通用题目运行器：11 种题型 / 对错反馈 / 完成彩带 / 错题记录 */
export default function QuestionRunner({
  questions,
  onFinish,
  onAnswered,
  record = true,
  trackMistakes = true,
  heading,
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
      <div className="relative overflow-hidden rounded-3xl border border-neon/30 bg-white/[0.04] p-6 text-center">
        <ConfettiBurst fireKey={burst} count={70} />
        <div className="font-display text-4xl font-bold text-white tabular-nums">{pct}%</div>
        <p className="mt-1 text-sm text-slate-300">
          答对 <span className="text-success">{correct}</span> / {results.length}（正确率{' '}
          <span className="text-success tabular-nums">{pct}%</span>）
        </p>
        {wrongList.length > 0 && (
          <div className="mx-auto mt-4 max-w-xl rounded-2xl border border-warn/30 bg-warn/[0.07] p-4 text-left text-xs text-slate-300">
            <div className="mb-1.5 font-semibold text-warn">错题已加入复习中心（间隔重复队列）</div>
            <ul className="space-y-1">
              {wrongList.slice(0, 4).map((wq) => (
                <li key={wq.id} className="flex flex-wrap gap-2">
                  <span className="text-white">{wq.prompt.slice(0, 30)}</span>
                  <span className="ipa text-neon">{wq.answer}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <NeonButton
            onClick={() => {
              playSfx('click');
              reset();
              setIdx(0);
            }}
          >
            <RefreshCw size={14} aria-hidden /> 再来一组
          </NeonButton>
        </div>
      </div>
    );
  }

  const isChoice = Boolean(q.choices);
  const writeType = isWriteType(q.type);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/12 bg-white/[0.04] p-5 backdrop-blur-xl md:p-6">
      {/* 头部：题号 / 题型 */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="rounded-md bg-neon/15 px-2 py-0.5 font-semibold text-neon">{TYPE_LABELS[q.type]}</span>
          <span className="tabular-nums">
            {idx + 1} / {total}
          </span>
          {heading && <span className="hidden sm:inline">· {heading}</span>}
        </div>
        <div className="flex items-center gap-3">
          {q.speak && supported && (
            <div className="flex items-center gap-1.5">
              <SpeakButton text={q.speak} label="常速播放" className="min-h-[44px] min-w-[44px]" />
              <SpeakButton text={q.speak} slow label="慢速播放" className="min-h-[44px] min-w-[44px]" />
            </div>
          )}
        </div>
      </div>

      {/* 进度条 */}
      <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-white/8" aria-hidden>
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-neon via-violet to-pink"
          animate={{ width: `${((idx + (status !== 'idle' ? 1 : 0)) / total) * 100}%` }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      {/* 题干 */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-lg font-semibold text-white md:text-xl">{q.prompt}</p>
          <p className="mt-1 text-xs text-slate-400">{q.narration}</p>
        </div>
        {q.speak && !isChoice && (
          <button
            type="button"
            onClick={() => speak(q.speak!, { slow: q.speakSlow })}
            className="flex min-h-[44px] items-center gap-1.5 rounded-xl border border-neon/40 bg-neon/10 px-3 py-2 text-xs text-neon hover:bg-neon/20 transition"
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
                  className={`relative flex items-center justify-between gap-3 overflow-hidden rounded-2xl border px-4 py-3.5 text-left transition-all duration-300 ${
                    reveal && isRight
                      ? 'border-success/70 bg-success/12 shadow-[0_0_20px_rgba(0,230,118,0.25)]'
                      : reveal && chosen
                        ? 'border-danger/70 bg-danger/12 animate-shake'
                        : reveal
                          ? 'border-white/10 bg-white/[0.03] opacity-60'
                          : 'border-white/15 bg-white/[0.05] hover:border-neon/55 hover:bg-neon/[0.07]'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/8 text-xs font-bold text-slate-300">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className={`font-display font-semibold text-white ${c.sub ? '' : 'ipa text-base'}`}>{c.label}</span>
                    {c.sub && <span className="text-xs text-slate-400">{c.sub}</span>}
                  </span>
                  {reveal && isRight && <Check size={17} className="text-success" aria-hidden />}
                  {reveal && chosen && !isRight && <X size={17} className="text-danger" aria-hidden />}
                  {status === 'correct' && chosen && <LightWave />}
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
                className={`input-neon font-mono text-base ${
                  status === 'correct' ? 'is-correct' : status === 'wrong' ? 'is-wrong' : ''
                }`}
                value={given}
                onChange={(e) => setGiven(e.target.value)}
                disabled={status !== 'idle'}
                placeholder={q.type === 'listenWritePhoneme' ? '输入音标，如 /θɪŋk/' : '输入你听到的单词'}
                aria-label={q.prompt}
                autoComplete="off"
                spellCheck={false}
              />
              <NeonButton type="submit" disabled={status !== 'idle' || !given.trim()}>
                {status === 'idle' ? '提交' : status === 'correct' ? '正确' : '已批改'}
              </NeonButton>
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
                    className={`flex h-9 w-8 items-center justify-center rounded-lg border font-mono text-sm font-semibold ${
                      l.status === 'same'
                        ? 'border-success/70 bg-success/15 text-success shadow-[0_0_12px_rgba(0,230,118,0.35)]'
                        : 'border-danger/70 bg-danger/12 text-danger animate-shake'
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
                    className={`rounded-2xl border px-5 py-4 font-display text-lg font-bold transition-all ${
                      right
                        ? 'border-success bg-success/15 text-success'
                        : reveal && chosen
                          ? 'border-danger bg-danger/12 text-danger animate-shake'
                          : 'border-white/18 bg-white/[0.05] text-slate-200 hover:border-neon/60 hover:shadow-neon'
                    }`}
                    aria-label={`第 ${i + 1} 音节 ${s}${right ? ' 正确' : ''}`}
                  >
                    {s}
                  </motion.button>
                  <span className="text-xs text-slate-400">#{i}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 提交后反馈 */}
      <AnimatePresence>
        {status !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`mt-4 rounded-2xl border p-4 text-sm ${
              status === 'correct'
                ? 'border-success/45 bg-success/10 text-[#B9FFD9]'
                : 'border-warn/40 bg-warn/[0.08] text-[#FFE7BD]'
            }`}
            role="status"
            aria-live="polite"
          >
            <div className="mb-1 flex items-center gap-2 font-semibold">
              {status === 'correct' ? (
                <>
                  <Check size={15} className="text-success" /> 回答正确
                </>
              ) : (
                <>
                  <X size={15} className="text-warn" /> 正确答案：<span className="ipa text-white">{q.answer}</span>
                </>
              )}
            </div>
            {status === 'wrong' && (
              <div className="mb-1.5 flex items-start gap-1.5 text-xs">
                <Lightbulb size={13} className="mt-0.5 shrink-0 text-warn" aria-hidden />
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
          className="flex min-h-[44px] items-center gap-1.5 text-xs text-slate-400 transition hover:text-neon disabled:opacity-40"
        >
          <Turtle size={13} aria-hidden /> 慢速再听一遍
        </button>
        <NeonButton onClick={next} disabled={status === 'idle'}>
          {idx + 1 >= total ? '查看结果' : '下一题'} <ArrowRight size={14} aria-hidden />
        </NeonButton>
      </div>
    </div>
  );
}

function norm(s: string): string {
  return s.trim().toLowerCase();
}
