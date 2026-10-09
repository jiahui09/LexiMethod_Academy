import { useEffect, useRef, useState } from 'react';
import { Mic, Square, Ear, Eye, Check, X, Volume2, Radio } from 'lucide-react';
import type { Phoneme } from '@/types';
import { phonemes } from '@/data/phonemes';
import { useSpeech, useSpeaking } from '@/hooks/useSpeech';
import { speakPhoneme } from '@/hooks/usePhonemeAudio';
import { playSfx } from '@/hooks/useSfx';
import { useProgress } from '@/store/progressStore';
import { useReview } from '@/store/reviewStore';
import { EduButton } from '@/components/edu';
import MouthSideView from './MouthSideView';

function pick<T>(arr: T[], exclude?: T): T[] {
  const pool = exclude ? arr.filter((x) => x !== exclude) : arr;
  return [...pool].sort(() => Math.random() - 0.5);
}

/**
 * 朗读波：扁平短栏。静止 = 发丝线轨低栏，朗读/录音中 = 墨色高低栏图案。
 * 状态只换色与高度（即时，无缓动淡入），不做循环位移动画。
 */
function PaperWave({ active, bars = 16 }: { active: boolean; bars?: number }) {
  return (
    <div className="flex h-8 items-center gap-[3px]" aria-hidden>
      {Array.from({ length: bars }).map((_, i) => (
        <span
          key={i}
          className={`w-[3px] ${active ? 'bg-ink' : 'bg-rule'}`}
          style={{ height: active ? `${34 + ((i * 17) % 60)}%` : '22%' }}
        />
      ))}
    </div>
  );
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
    <div className=" border border-rule bg-under/60 p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-xs font-semibold text-ink">
          <Ear size={13} aria-hidden /> 最小对立对，听清哪一个
        </span>
        <EduButton size="sm" variant="ghost" onClick={() => speak(pair[target])}>
          <Volume2 size={13} aria-hidden /> 再听一次
        </EduButton>
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
              className={` border px-4 py-3 text-left transition-colors duration-200 ${
                isRight
                  ? 'border-ink bg-leaf font-semibold text-ink'
                  : isWrong
                    ? 'border-errata bg-errata/[0.07] animate-shake text-errata-deep'
                    : 'border-rule bg-under/50 text-ink hover:border-ink'
              }`}
              aria-label={`选项 ${pair[side]}`}
            >
              <div className="font-serif text-base font-bold">{pair[side]}</div>
              <div className="text-xs text-ink2">{side === 'a' ? pair.meaningA : pair.meaningB}</div>
              {isRight && <Check size={15} className="mt-1 text-ink" aria-hidden />}
              {isWrong && <X size={15} className="mt-1 text-errata-deep" aria-hidden />}
            </button>
          );
        })}
      </div>
      {chosen && (
        <p className="mt-3 text-xs leading-relaxed text-ink2" aria-live="polite">
          正确答案是
          <b className="font-serif font-semibold text-ink">{pair[target]}</b>（
          {target === 'a' ? pair.meaningA : pair.meaningB}）。{phoneme.commonMistakes[0]}
        </p>
      )}
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
    <div className=" border border-rule bg-under/60 p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-xs font-semibold text-ink">
          <Ear size={13} aria-hidden /> 听音选音标
        </span>
        <EduButton size="sm" variant="ghost" onClick={roll}>
          换一题
        </EduButton>
      </div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <EduButton size="sm" onClick={() => speak(target.ttsWord ?? target.exampleWords[0])}>
          <Volume2 size={14} aria-hidden /> 播放
        </EduButton>
        <EduButton size="sm" variant="ghost" onClick={() => speak(target.ttsWord ?? target.exampleWords[0], { slow: true })}>
          慢速
        </EduButton>
        <PaperWave active={speaking} />
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
              className={` border px-3 py-3 transition-colors duration-200 ${
                right
                  ? 'border-ink bg-leaf font-semibold text-ink'
                  : chosenThis
                    ? 'border-errata bg-errata/[0.07] animate-shake text-errata-deep'
                    : 'border-rule bg-under/50 text-ink hover:border-ink'
              }`}
            >
              <div className="ipa font-semibold">{o.symbol}</div>
              <div className="text-xs text-ink2">{o.exampleWords[0]}</div>
            </button>
          );
        })}
      </div>
      {chosen && (
        <p className="mt-3 text-xs leading-relaxed text-ink2" aria-live="polite">
          {ok ? (
            <b className="text-ink">✓ 正确！</b>
          ) : (
            <b className="text-errata-deep">✕ 是 {target.symbol}（{target.ttsWord ?? target.exampleWords[0]}）。</b>
          )}
          {target.hintCN}
        </p>
      )}
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
    <div className=" border border-rule bg-under/60 p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-xs font-semibold text-ink">
          <Eye size={13} aria-hidden /> 看口型猜音标
        </span>
        <EduButton size="sm" variant="ghost" onClick={roll}>
          换一题
        </EduButton>
      </div>
      <div className="mb-3 overflow-hidden border border-rule">
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
              className={`ipa border px-3 py-3 text-base font-semibold transition-colors duration-200 ${
                right
                  ? 'border-ink bg-leaf font-semibold text-ink'
                  : chosenThis
                    ? 'border-errata bg-errata/[0.07] animate-shake text-errata-deep'
                    : 'border-rule bg-under/50 text-ink hover:border-ink'
              }`}
            >
              {o.symbol}
            </button>
          );
        })}
      </div>
      {chosen && (
        <p className="mt-3 text-xs leading-relaxed text-ink2" aria-live="polite">
          {ok ? <b className="text-ink">✓ 正确！</b> : <b className="text-errata-deep">✕ 正确答案 {target.symbol}。</b>}
          {target.tonguePosition}
        </p>
      )}
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
    <div className=" border border-rule bg-under/60 p-4">
      <div className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-ink">
        <Mic size={13} aria-hidden /> 录音对比，先听原声再录自己
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <EduButton
          size="sm"
          onClick={() => {
            if (!speakPhoneme(phoneme.id)) speak(phoneme.ttsWord ?? phoneme.exampleWords[0]);
          }}
        >
          <Volume2 size={13} aria-hidden /> 听原声
        </EduButton>
        <EduButton size="sm" variant="ghost" onClick={start} disabled={state === 'recording'}>
          {state === 'recording' ? <Square size={13} aria-hidden /> : <Mic size={13} aria-hidden />}
          {state === 'recording' ? '录音中…' : '录我的发音'}
        </EduButton>
        {url && state === 'done' && (
          <audio controls src={url} className="h-9" aria-label="我的录音回放" />
        )}
        {state === 'recording' && <PaperWave active bars={14} />}
      </div>

      {state === 'unsupported' && (
        <p className="mt-3 border border-errata/60 bg-leaf px-3 py-2 text-xs leading-relaxed text-ink2">
          当前环境不支持麦克风，或权限被拒绝。降级路径是播放原声跟读 3 遍，再用「听音选音标」自测。
        </p>
      )}

      {state === 'done' && (
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <Radio size={13} className="text-ink2" aria-hidden />
          <span className="text-ink2">自评，和原声接近吗？</span>
          <button
            type="button"
            onClick={() => {
              setSelfOk(true);
              playSfx('correct');
            }}
            className={`min-h-[44px] border px-3 py-1 transition-colors duration-200 ${
              selfOk === true
                ? 'border-ink bg-under text-ink'
                : 'border-rule text-ink hover:border-ink'
            }`}
          >
            像
          </button>
          <button
            type="button"
            onClick={() => {
              setSelfOk(false);
              playSfx('wrong');
            }}
            className={`min-h-[44px] border px-3 py-1 transition-colors duration-200 ${
              selfOk === false
                ? 'border-errata bg-errata/[0.08] text-errata-deep'
                : 'border-rule text-ink hover:border-errata hover:text-errata-deep'
            }`}
          >
            不像，再练
          </button>
          {selfOk === false && (
            <span className="text-ink2">重听原声对着练，口型动作先做到位，{phoneme.mouthShape.slice(0, 30)}…</span>
          )}
        </div>
      )}
    </div>
  );
}

/** 三合一练习区（教学页底部） */
export function PhonemeDrills({ phoneme }: { phoneme: Phoneme }) {
  return (
    <div className="relative">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink">
        <Check size={15} className="text-ink" aria-hidden /> 互动练习（三选一或全部完成）
      </div>
      <div className="grid gap-3 lg:grid-cols-3">
        <ListenChooseDrill phoneme={phoneme} />
        <MouthGuessDrill phoneme={phoneme} />
        <RecordCompare phoneme={phoneme} />
      </div>
    </div>
  );
}
