import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Ear, Eye, Check, X, Volume2, Radio } from 'lucide-react';
import type { Phoneme } from '@/types';
import { phonemes } from '@/data/phonemes';
import { useSpeech, useSpeaking } from '@/hooks/useSpeech';
import { playSfx } from '@/hooks/useSfx';
import { useProgress } from '@/store/progressStore';
import { useReview } from '@/store/reviewStore';
import NeonButton from '@/components/ui/NeonButton';
import { Waveform } from '@/components/course/FeedbackFx';
import ConfettiBurst from '@/components/fx/ConfettiBurst';
import MouthSideView from './MouthSideView';

function pick<T>(arr: T[], exclude?: T): T[] {
  const pool = exclude ? arr.filter((x) => x !== exclude) : arr;
  return [...pool].sort(() => Math.random() - 0.5);
}

/** 最小对立对判断：听一个词，选你听到的那个 */
export function MinimalPairJudge({ phoneme }: { phoneme: Phoneme }) {
  const { speak } = useSpeech();
  const [pair, setPair] = useState(() => phoneme.minimalPairs[0]);
  const [target, setTarget] = useState<'a' | 'b'>('a');
  const [chosen, setChosen] = useState<'a' | 'b' | null>(null);
  const recordAnswer = useProgress((s) => s.recordAnswer);
  const schedule = useReview((s) => s.schedule);

  useEffect(() => {
    const p = phoneme.minimalPairs[0];
    if (p) {
      setPair(p);
      const t = Math.random() > 0.5 ? 'a' : 'b';
      setTarget(t);
      setChosen(null);
      window.setTimeout(() => speak(p[t]), 350);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phoneme.id]);

  if (!pair) return null;
  const correct = chosen === target;

  const choose = (side: 'a' | 'b') => {
    if (chosen) return;
    setChosen(side);
    const ok = side === target;
    playSfx(ok ? 'correct' : 'wrong');
    recordAnswer('minimalPair', ok);
    schedule('phoneme', phoneme.id, `${phoneme.symbol} 最小对立对`, ok);
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-xs font-semibold text-neon">
          <Ear size={13} aria-hidden /> 最小对立对：听清哪一个
        </span>
        <NeonButton size="sm" variant="ghost" onClick={() => speak(pair[target])}>
          <Volume2 size={13} aria-hidden /> 再听一次
        </NeonButton>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {(['a', 'b'] as const).map((side) => {
          const isRight = chosen && side === target;
          const isWrong = chosen === side && side !== target;
          return (
            <button
              key={side}
              type="button"
              onClick={() => choose(side)}
              disabled={Boolean(chosen)}
              className={`rounded-2xl border px-4 py-3 text-left transition-all ${
                isRight
                  ? 'border-success bg-success/12 shadow-[0_0_18px_rgba(0,230,118,0.3)]'
                  : isWrong
                    ? 'border-danger bg-danger/12 animate-shake'
                    : 'border-white/14 bg-white/[0.05] hover:border-neon/60'
              }`}
              aria-label={`选项 ${pair[side]}`}
            >
              <div className="font-display text-base font-bold text-white">{pair[side]}</div>
              <div className="text-xs text-slate-400">{side === 'a' ? pair.meaningA : pair.meaningB}</div>
              {isRight && <Check size={15} className="mt-1 text-success" aria-hidden />}
              {isWrong && <X size={15} className="mt-1 text-danger" aria-hidden />}
            </button>
          );
        })}
      </div>
      <AnimatePresence>
        {chosen && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 text-xs text-slate-300"
          >
            正确答案：<b className="text-white">{pair[target]}</b>（{target === 'a' ? pair.meaningA : pair.meaningB}）
            。{phoneme.commonMistakes[0]}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/** 听音选音标 */
export function ListenChooseDrill({ phoneme }: { phoneme: Phoneme }) {
  const { speak } = useSpeech();
  const speaking = useSpeaking();
  const [options, setOptions] = useState<Phoneme[]>([]);
  const [target, setTarget] = useState<Phoneme | null>(null);
  const [chosen, setChosen] = useState<string | null>(null);
  const recordAnswer = useProgress((s) => s.recordAnswer);
  const schedule = useReview((s) => s.schedule);

  const roll = () => {
    const all = pick(phonemes.filter((p) => p.type === phoneme.type));
    const t = all[0] ?? phoneme;
    const others = pick(
      phonemes.filter((p) => p.id !== t.id && (p.contrastWith.includes(t.id) || t.contrastWith.includes(p.id))),
    ).slice(0, 3);
    const opts = pick([t, ...others]).slice(0, 4);
    setTarget(t);
    setOptions(opts);
    setChosen(null);
    window.setTimeout(() => speak(t.ttsWord ?? t.exampleWords[0]), 350);
  };

  useEffect(roll, [phoneme.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!target) return null;
  const ok = chosen === target.id;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-xs font-semibold text-neon">
          <Ear size={13} aria-hidden /> 听音选音标
        </span>
        <NeonButton size="sm" variant="ghost" onClick={roll}>
          换一题
        </NeonButton>
      </div>
      <div className="mb-3 flex items-center gap-2">
        <NeonButton size="sm" onClick={() => speak(target.ttsWord ?? target.exampleWords[0])}>
          <Volume2 size={14} aria-hidden /> 播放
        </NeonButton>
        <NeonButton size="sm" variant="ghost" onClick={() => speak(target.ttsWord ?? target.exampleWords[0], { slow: true })}>
          慢速
        </NeonButton>
        <Waveform active={speaking} bars={16} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        {options.map((o) => {
          const chosenThis = chosen === o.id;
          const right = chosen && o.id === target.id;
          return (
            <button
              key={o.id}
              type="button"
              disabled={Boolean(chosen)}
              onClick={() => {
                setChosen(o.id);
                const good = o.id === target.id;
                playSfx(good ? 'correct' : 'wrong');
                recordAnswer('listenChoosePhoneme', good);
                schedule('phoneme', o.id, `${o.symbol} 听音辨认`, good);
              }}
              className={`rounded-xl border px-3 py-3 transition-all ${
                right
                  ? 'border-success bg-success/12 text-success'
                  : chosenThis
                    ? 'border-danger bg-danger/12 animate-shake text-danger'
                    : 'border-white/14 bg-white/[0.05] hover:border-neon/60'
              }`}
            >
              <div className="ipa font-semibold">{o.symbol}</div>
              <div className="text-xs text-slate-400">{o.exampleWords[0]}</div>
            </button>
          );
        })}
      </div>
      <AnimatePresence>
        {chosen && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-3 text-xs text-slate-300">
            {ok ? '✓ 正确！' : `✕ 是 ${target.symbol}（${target.ttsWord ?? target.exampleWords[0]}）。`}
            {target.hintCN}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/** 看口型猜音标 */
export function MouthGuessDrill({ phoneme }: { phoneme: Phoneme }) {
  const [target, setTarget] = useState<Phoneme>(phoneme);
  const [options, setOptions] = useState<Phoneme[]>([]);
  const [chosen, setChosen] = useState<string | null>(null);
  const recordAnswer = useProgress((s) => s.recordAnswer);

  const roll = () => {
    const t = pick(phonemes)[0];
    const others = pick(phonemes.filter((p) => p.id !== t.id)).slice(0, 3);
    setTarget(t);
    setOptions(pick([t, ...others]).slice(0, 4));
    setChosen(null);
  };

  useEffect(() => {
    roll();
  }, [phoneme.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const ok = chosen === target.id;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-xs font-semibold text-violet-lit">
          <Eye size={13} aria-hidden /> 看口型猜音标
        </span>
        <NeonButton size="sm" variant="ghost" onClick={roll}>
          换一题
        </NeonButton>
      </div>
      <div className="mb-3 overflow-hidden rounded-2xl border border-white/10">
        <MouthSideView geo={target.geo} voiced={target.voiced} showFront />
      </div>
      <div className="grid grid-cols-2 gap-2">
        {options.map((o) => {
          const chosenThis = chosen === o.id;
          const right = chosen && o.id === target.id;
          return (
            <button
              key={o.id}
              type="button"
              disabled={Boolean(chosen)}
              onClick={() => {
                setChosen(o.id);
                const good = o.id === target.id;
                playSfx(good ? 'correct' : 'wrong');
                recordAnswer('wordChoosePhoneme', good);
              }}
              className={`ipa rounded-xl border px-3 py-3 text-base font-semibold transition-all ${
                right
                  ? 'border-success bg-success/12 text-success'
                  : chosenThis
                    ? 'border-danger bg-danger/12 animate-shake text-danger'
                    : 'border-white/14 bg-white/[0.05] hover:border-violet/60'
              }`}
            >
              {o.symbol}
            </button>
          );
        })}
      </div>
      <AnimatePresence>
        {chosen && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 text-xs text-slate-300">
            {ok ? '✓ 正确！' : `✕ 正确答案 ${target.symbol}。`}
            要点：{target.tonguePosition}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/** 录音对比（麦克风不可用时自动降级） */
export function RecordCompare({ phoneme }: { phoneme: Phoneme }) {
  const { speak } = useSpeech();
  const [state, setState] = useState<'idle' | 'recording' | 'done' | 'unsupported'>('idle');
  const [url, setUrl] = useState<string | null>(null);
  const [selfOk, setSelfOk] = useState<boolean | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    return () => {
      recorderRef.current?.stream.getTracks().forEach((t) => t.stop());
      if (url) URL.revokeObjectURL(url);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const start = async () => {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setState('unsupported');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = (e) => chunksRef.current.push(e.data);
      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setUrl((old) => {
          if (old) URL.revokeObjectURL(old);
          return URL.createObjectURL(blob);
        });
        setState('done');
        stream.getTracks().forEach((t) => t.stop());
      };
      rec.start();
      recorderRef.current = rec;
      setState('recording');
      playSfx('tick');
      window.setTimeout(() => rec.state !== 'inactive' && rec.stop(), 2200);
    } catch {
      setState('unsupported');
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <div className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-pink-lit">
        <Mic size={13} aria-hidden /> 录音对比：先听原声，再录自己
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <NeonButton size="sm" onClick={() => speak(phoneme.ttsWord ?? phoneme.exampleWords[0])}>
          <Volume2 size={13} aria-hidden /> 听原声
        </NeonButton>
        <NeonButton size="sm" variant="ghost" onClick={start} disabled={state === 'recording'}>
          {state === 'recording' ? <Square size={13} aria-hidden /> : <Mic size={13} aria-hidden />}
          {state === 'recording' ? '录音中…' : '录我的发音'}
        </NeonButton>
        {url && state === 'done' && (
          <audio controls src={url} className="h-9" aria-label="我的录音回放" />
        )}
        {state === 'recording' && <Waveform active bars={14} color="#FF4D9D" />}
      </div>

      {state === 'unsupported' && (
        <p className="mt-3 rounded-xl border border-warn/30 bg-warn/[0.07] px-3 py-2 text-xs text-[#FFE7BD]">
          当前环境不支持麦克风（或权限被拒绝）。降级方案：播放原声 → 跟读 3 遍 → 用“听音选音标”自测。
        </p>
      )}

      {state === 'done' && (
        <div className="mt-3 flex items-center gap-2 text-xs">
          <Radio size={13} className="text-slate-400" aria-hidden />
          <span className="text-slate-400">自评：和原声接近吗？</span>
          <button
            type="button"
            onClick={() => {
              setSelfOk(true);
              playSfx('correct');
            }}
            className={`rounded-lg border px-3 py-1 transition ${selfOk === true ? 'border-success bg-success/15 text-success' : 'border-white/15 hover:border-success/60'}`}
          >
            像
          </button>
          <button
            type="button"
            onClick={() => {
              setSelfOk(false);
              playSfx('wrong');
            }}
            className={`rounded-lg border px-3 py-1 transition ${selfOk === false ? 'border-warn bg-warn/15 text-warn' : 'border-white/15 hover:border-warn/60'}`}
          >
            不像，再练
          </button>
          {selfOk === false && (
            <span className="text-slate-400">重听原声，注意：{phoneme.mouthShape.slice(0, 30)}…</span>
          )}
        </div>
      )}
    </div>
  );
}

/** 三合一练习区（教学页底部） */
export function PhonemeDrills({ phoneme }: { phoneme: Phoneme }) {
  const [burst, setBurst] = useState(0);
  return (
    <div className="relative">
      <ConfettiBurst fireKey={burst} count={50} />
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
        <Check size={15} className="text-success" aria-hidden /> 互动练习（三选一或全部完成）
      </div>
      <div className="grid gap-3 lg:grid-cols-3">
        <ListenChooseDrill phoneme={phoneme} />
        <MouthGuessDrill phoneme={phoneme} />
        <RecordCompare phoneme={phoneme} />
      </div>
    </div>
  );
}
