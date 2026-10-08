import React, { useState } from 'react';
import type { KindComp } from './types';
import { Btn, OptionBtn, PunchRow, Verdict, Timer } from '@/components/demos/_shared';
import { SpeakButton } from '@/components/edu/Speak';
import { playSfx } from '@/hooks/useSfx';

/* 课程 02 拼读拆词族练习体（4 个 kind） */

/* ---------- vowelCore：圈元音核心，核心数与音节数对上 ---------- */
type VCWord = { word: string; cores: number[]; chunks: string[]; ipa: string };
const VC_WORDS: VCWord[] = [
  { word: 'construction', cores: [1, 6, 9], chunks: ['c', 'o', 'n', 's', 't', 'r', 'u', 'c', 't', 'io', 'n'], ipa: '/kənˈstrʌkʃn/' },
  { word: 'hesitate', cores: [1, 2, 3, 4], chunks: ['h', 'e', 'si', 'ta', 'te'], ipa: '/ˈhezɪteɪt/' },
  { word: 'electricity', cores: [0, 1, 3, 4, 5], chunks: ['e', 'le', 'c', 'tri', 'ci', 'ty'], ipa: '/ˌelekˈtrɪsəti/' },
];
const VowelCore: KindComp = ({ onDone }) => {
  const [wi, setWi] = useState(0);
  const [picked, setPicked] = useState<number[]>([]);
  const [mark, setMark] = useState<null | boolean>(null);
  const w = VC_WORDS[wi];
  const check = () => {
    const ok = picked.length === w.cores.length && picked.every((i) => w.cores.includes(i));
    setMark(ok);
    if (!ok) {
      playSfx('wrong');
      return;
    }
    playSfx('correct');
    const next = wi + 1;
    setPicked([]);
    setMark(null);
    setWi(next);
    if (next >= VC_WORDS.length) {
      playSfx('complete');
      onDone();
    }
  };
  if (wi >= VC_WORDS.length) return <Verdict ok>三个词的元音核心全部圈对</Verdict>;
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <span className="machine text-[18px] font-bold">{w.word}</span>
        <SpeakButton text={w.word} size="sm" label={`听 ${w.word}`} />
        <span className="machine text-[13px] text-ink2">{w.ipa}</span>
        <span className="machine ml-auto text-[13px] text-ink2">
          第 {wi + 1}/{VC_WORDS.length} 词
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {w.chunks.map((c, i) => {
          const on = picked.includes(i);
          return (
            <button
              key={`${w.word}-${i}`}
              type="button"
              aria-pressed={on}
              aria-label={`${c}${on ? '，已圈为核心' : ''}`}
              onClick={() => setPicked((p) => (on ? p.filter((x) => x !== i) : [...p, i]))}
              className={`hinge machine flex min-h-[44px] min-w-[44px] items-center justify-center rounded-[3px] border-2 px-2 text-[16px] font-bold ${
                on ? 'border-ink bg-ink text-milk' : 'border-ink/30 bg-leaf hover:bg-under'
              }`}
            >
              {c}
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <Btn variant="primary" onClick={check} disabled={picked.length === 0}>
          核心数与音节数对一下
        </Btn>
        <span className="machine text-[13px] text-ink2">已圈 {picked.length} 个</span>
        <span className="ml-auto">
          <PunchRow total={VC_WORDS.length} done={wi} />
        </span>
      </div>
      <div className="mt-2" aria-live="polite">
        {mark === false && (
          <Verdict ok={false}>{picked.length !== w.cores.length ? '核心数和音节数对不上，再数一遍' : '圈错位置了，看哪个字母在出声'}</Verdict>
        )}
      </div>
    </div>
  );
};

/* ---------- syllableSplit：音块归槽拼回原词，后一节能起音 ---------- */
type SSWord = { word: string; answer: string[]; bank: string[] };
const SS_WORDS: SSWord[] = [
  { word: 'construction', answer: ['con', 'struc', 'tion'], bank: ['tion', 'con', 'struc'] },
  { word: 'transportation', answer: ['trans', 'por', 'ta', 'tion'], bank: ['ta', 'tion', 'trans', 'por'] },
];
const SyllableSplit: KindComp = ({ onDone }) => {
  const [wi, setWi] = useState(0);
  const [slot, setSlot] = useState<string[]>([]);
  const [mark, setMark] = useState<null | boolean>(null);
  const w = SS_WORDS[wi];
  const put = (b: string) => {
    if (slot.includes(b)) return;
    const next = [...slot, b];
    setSlot(next);
    if (next.length === w.answer.length) {
      const ok = next.every((x, i) => x === w.answer[i]);
      setMark(ok);
      if (!ok) {
        playSfx('wrong');
        return;
      }
      playSfx('correct');
      const n = wi + 1;
      setSlot([]);
      setMark(null);
      setWi(n);
      if (n >= SS_WORDS.length) {
        playSfx('complete');
        onDone();
      }
    }
  };
  if (wi >= SS_WORDS.length) return <Verdict ok>两个词都切完，后一节都能起音</Verdict>;
  return (
    <div>
      <div className="under-leaf mb-3 flex flex-wrap items-center gap-3 rounded-[3px] p-3">
        <span className="machine text-[17px] font-bold">{w.word}</span>
        <span className="machine text-[13px] text-ink2">切 {w.answer.length} 块</span>
        <span className="machine ml-auto text-[13px] text-ink2">
          第 {wi + 1}/{SS_WORDS.length} 词
        </span>
      </div>
      <div className="mb-3 flex min-h-[52px] flex-wrap items-center gap-1.5 rounded-[3px] border-2 border-dashed border-ink/30 p-2">
        {slot.length === 0 && <span className="px-1 text-[13px] text-ink2">点下方音块，按顺序放进槽位</span>}
        {slot.map((b, i) => (
          <span key={b} className="machine rounded-[3px] bg-ink px-2 py-1.5 text-[16px] text-milk">
            {b}
            {i > 0 && <span aria-hidden className="ml-1 opacity-60">·</span>}
          </span>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {w.bank.map((b) => (
          <button
            key={b}
            type="button"
            disabled={slot.includes(b)}
            onClick={() => put(b)}
            className="hinge machine min-h-[44px] rounded-[3px] border border-ink/40 bg-leaf px-3 text-[16px] font-bold hover:bg-under disabled:opacity-30"
          >
            {b}
          </button>
        ))}
        <Btn onClick={() => { setSlot([]); setMark(null); }}>重摆</Btn>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <PunchRow total={SS_WORDS.length} done={wi} />
        <span className="text-[14px] text-ink2">切完读一遍，后一节要能起音。</span>
      </div>
      <div className="mt-2" aria-live="polite">
        {mark === false && <Verdict ok={false}>顺序不对，后一节要能直接起音，重摆</Verdict>}
      </div>
    </div>
  );
};

/* ---------- stressPosition：点重读音节并说出线索 ---------- */
type SPWord = { parts: string[]; ans: number; clues: string[]; clueAns: number; word: string };
const SP_WORDS: SPWord[] = [
  { word: 'record', parts: ['re', 'cord'], ans: 1, clues: ['名前动后，这里是动词', '名前动后，这里是名词', '后缀 -cord 决定重音'], clueAns: 0 },
  { word: 'construction', parts: ['con', 'struc', 'tion'], ans: 1, clues: ['-tion 前一格落重音', '首音节一律最重', '双写辅音前落重音'], clueAns: 0 },
];
const StressPosition: KindComp = ({ onDone }) => {
  const [wi, setWi] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [clue, setClue] = useState<number | null>(null);
  const w = SP_WORDS[wi];
  const right = picked === w.ans && clue === w.clueAns;
  const submit = () => {
    if (picked === null || clue === null) return;
    if (!right) {
      playSfx('wrong');
      return;
    }
    playSfx('correct');
    setPicked(null);
    setClue(null);
    const n = wi + 1;
    setWi(n);
    if (n >= SP_WORDS.length) {
      playSfx('complete');
      onDone();
    }
  };
  if (wi >= SP_WORDS.length) return <Verdict ok>两个词点对，线索也说得出</Verdict>;
  return (
    <div>
      <div className="under-leaf mb-3 flex flex-wrap items-center gap-3 rounded-[3px] p-3">
        <span className="machine text-[17px] font-bold">{w.word}</span>
        <SpeakButton text={w.word} size="sm" label={`听 ${w.word}`} />
        <span className="machine ml-auto text-[13px] text-ink2">
          第 {wi + 1}/{SP_WORDS.length} 词
        </span>
      </div>
      <div className="mb-3 flex flex-wrap gap-1.5">
        {w.parts.map((p, i) => (
          <button
            key={i}
            type="button"
            aria-pressed={picked === i}
            aria-label={`${p}${picked === i ? '，已点为重读' : ''}`}
            onClick={() => setPicked(i)}
            className={`hinge machine min-h-[44px] rounded-[3px] border px-3 text-[16px] font-bold ${
              picked === i ? 'border-ink bg-ink text-milk' : 'border-ink/30 bg-leaf hover:bg-under'
            }`}
          >
            {picked === i ? `ˈ${p}` : p}
          </button>
        ))}
      </div>
      <p className="mb-1.5 text-[14px] font-bold">你用的是哪条线索？</p>
      <ul className="space-y-1.5">
        {w.clues.map((c, i) => (
          <li key={c}>
            <OptionBtn state={clue === i ? (right ? 'right' : 'wrong') : 'idle'} onClick={() => setClue(i)}>
              {c}
            </OptionBtn>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <Btn variant="primary" onClick={submit} disabled={picked === null || clue === null}>
          交这词
        </Btn>
        <span className="ml-auto">
          <PunchRow total={SP_WORDS.length} done={wi} />
        </span>
      </div>
      <div className="mt-2" aria-live="polite">
        {picked !== null && clue !== null && !right && <Verdict ok={false}>点位或线索对不上，回想名前动后那条</Verdict>}
      </div>
    </div>
  );
};

/* ---------- algorithmRun：连跑生词，划分、重音、读出声三拍 ---------- */
type ARWord = {
  word: string;
  blocks: string[];
  answers: { cores: number; cut: number; stress: number };
  coreOptions: number[];
  cutOptions: number[];
};
const AR_WORDS: ARWord[] = [
  {
    word: 'transportation',
    blocks: ['trans', 'por', 'ta', 'tion'],
    answers: { cores: 4, cut: 3, stress: 2 },
    coreOptions: [3, 4, 5],
    cutOptions: [1, 2, 3],
  },
  {
    word: 'decision',
    blocks: ['de', 'ci', 'sion'],
    answers: { cores: 3, cut: 1, stress: 1 },
    coreOptions: [2, 3, 4],
    cutOptions: [1, 2, 3],
  },
  {
    word: 'contradiction',
    blocks: ['con', 'tra', 'dic', 'tion'],
    answers: { cores: 4, cut: 2, stress: 2 },
    coreOptions: [3, 4, 5],
    cutOptions: [1, 2, 3],
  },
];
const AlgorithmRun: KindComp = ({ onDone }) => {
  const [wi, setWi] = useState(0);
  const [step, setStep] = useState(0);
  const [cores, setCores] = useState<number | null>(null);
  const [cut, setCut] = useState<number | null>(null);
  const [stress, setStress] = useState<number | null>(null);
  const [mark, setMark] = useState<null | boolean>(null);
  const w = AR_WORDS[wi];
  const [done, setDone] = useState(false);
  if (done) return <Verdict ok>三个生词连跑完成，划分、重音、发声都过了</Verdict>;
  const allPicked = cores !== null && cut !== null && stress !== null;
  const submit = () => {
    if (!allPicked) return;
    const ok = cores === w.answers.cores && cut === w.answers.cut && stress === w.answers.stress;
    setMark(ok);
    if (!ok) {
      playSfx('wrong');
      setStep(0);
      setCores(null);
      setCut(null);
      setStress(null);
      return;
    }
    playSfx('correct');
    const n = wi + 1;
    setStep(0);
    setCores(null);
    setCut(null);
    setStress(null);
    setMark(null);
    setWi(n);
    if (n >= AR_WORDS.length) {
      playSfx('complete');
      setDone(true);
      onDone();
    }
  };
  return (
    <div>
      <div className="under-leaf mb-3 flex flex-wrap items-center gap-3 rounded-[3px] p-3">
        <span className="machine text-[17px] font-bold">{w.word}</span>
        <SpeakButton text={w.word} size="sm" label={`读出声 ${w.word}`} />
        <Timer className="ml-auto" />
        <span className="machine text-[13px] text-ink2">
          第 {wi + 1}/{AR_WORDS.length} 词
        </span>
      </div>

      <p className="mb-1.5 text-[14px] font-bold">
        {step === 0 ? '一拍，数元音核心（10 秒内）' : step === 1 ? '二拍，切口落在哪' : '三拍，重音标在第几节'}
      </p>
      {step === 0 && (
        <div className="flex flex-wrap gap-2">
          {w.coreOptions.map((n) => (
            <OptionBtn key={n} state={cores === n ? 'selected' : 'idle'} onClick={() => setCores(n)}>
              <span className="machine">{n} 个核心</span>
            </OptionBtn>
          ))}
        </div>
      )}
      {step === 1 && (
        <div className="flex flex-wrap gap-2">
          {w.cutOptions.map((n) => (
            <OptionBtn key={n} state={cut === n ? 'selected' : 'idle'} onClick={() => setCut(n)}>
              <span className="machine">第 {n} 块后切</span>
            </OptionBtn>
          ))}
        </div>
      )}
      {step === 2 && (
        <div className="flex flex-wrap gap-1.5">
          {w.blocks.map((b, i) => (
            <button
              key={i}
              type="button"
              aria-pressed={stress === i}
              onClick={() => setStress(i)}
              className={`hinge machine min-h-[44px] rounded-[3px] border px-3 text-[16px] font-bold ${
                stress === i ? 'border-ink bg-ink text-milk' : 'border-ink/30 bg-leaf hover:bg-under'
              }`}
            >
              {stress === i ? `ˈ${b}` : b}
            </button>
          ))}
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <Btn variant="primary" onClick={() => (step < 2 ? setStep(step + 1) : submit())} disabled={step === 0 && cores === null}>
          {step < 2 ? '过这一拍' : '交这个词'}
        </Btn>
        <Btn onClick={() => { setStep(0); setCores(null); setCut(null); setStress(null); }}>重跑</Btn>
        <span className="ml-auto">
          <PunchRow total={AR_WORDS.length} done={wi} />
        </span>
      </div>
      <div className="mt-2" aria-live="polite">
        {mark === false && <Verdict ok={false}>三拍里有一拍错了，回到第一拍重新数</Verdict>}
      </div>
    </div>
  );
};

export const phonicsKinds: Record<string, KindComp> = {
  vowelCore: VowelCore,
  syllableSplit: SyllableSplit,
  stressPosition: StressPosition,
  algorithmRun: AlgorithmRun,
};
