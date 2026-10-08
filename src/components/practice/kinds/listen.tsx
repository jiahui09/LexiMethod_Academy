import React, { useState } from 'react';
import { Play, X } from 'lucide-react';
import type { KindComp } from './types';
import { Btn, OptionBtn, PunchRow, Verdict, Timer } from '@/components/demos/_shared';
import { SpeakButton } from '@/components/edu/Speak';
import { speakPhoneme } from '@/hooks/usePhonemeAudio';
import { playSfx } from '@/hooks/useSfx';

/* 课程 01 听辨族练习体（5 个 kind） */

/* ---------- listenChoosePhoneme：先听音做出口型再选音标，连对三题 ---------- */
type LPCItem = { word: string; target: string; options: string[] };
const LPC_ITEMS: LPCItem[] = [
  { word: 'think', target: 'θ', options: ['θ', 's', 'f'] },
  { word: 'very', target: 'v', options: ['v', 'w', 'b'] },
  { word: 'ship', target: 'ʃ', options: ['ʃ', 'tʃ', 's'] },
];
const ListenChoosePhoneme: KindComp = ({ onDone }) => {
  const [streak, setStreak] = useState(0);
  const [mark, setMark] = useState<null | boolean>(null);
  const item = LPC_ITEMS[streak];
  if (!item) return null;
  const pick = (id: string) => {
    const ok = id === item.target;
    setMark(ok);
    if (!ok) {
      playSfx('wrong');
      return;
    }
    playSfx('correct');
    const next = streak + 1;
    setStreak(next);
    if (next >= 3) {
      playSfx('complete');
      onDone();
    }
  };
  return (
    <div>
      <div className="under-leaf mb-3 flex flex-wrap items-center gap-3 rounded-[3px] p-3">
        <span className="machine text-[17px] font-bold">{item.word}</span>
        <Btn onClick={() => speakPhoneme(item.target)} ariaLabel={`播音标 ${item.target}`}>
          <Play size={15} aria-hidden /> 听音标
        </Btn>
        <SpeakButton text={item.word} label="听这个词" />
        <span className="machine ml-auto text-[13px] text-ink2">
          第 {streak + 1}/3 题
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {item.options.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => pick(o)}
            className="hinge machine min-h-[44px] min-w-[52px] rounded-[3px] border border-ink/40 bg-leaf px-3 text-[17px] font-bold hover:bg-under"
          >
            {o}
          </button>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-3">
        <PunchRow total={3} done={streak} active={streak < 3 ? streak : undefined} />
        <span className="machine text-[13px] text-ink2">{streak}/3 连对</span>
      </div>
      <div className="mt-2" aria-live="polite">
        {mark === false && <Verdict ok={false}>这个动作还没立住，把嘴型做出来再听一遍</Verdict>}
        {streak >= 3 && <Verdict ok>三题连对，这个口型动作立住了</Verdict>}
      </div>
    </div>
  );
};

/* ---------- minimalPair：听词选义，四组连做 ---------- */
type MPItem = { word: string; ipa: string; options: string[]; ans: number };
const MP_ITEMS: MPItem[] = [
  { word: 'ship', ipa: '/ʃɪp/', options: ['轮船', '绵羊', '衬衫', '商店'], ans: 0 },
  { word: 'sheep', ipa: '/ʃiːp/', options: ['轮船', '绵羊', '共享', '书架'], ans: 1 },
  { word: 'bad', ipa: '/bæd/', options: ['床', '坏的', '背包', '蝙蝠'], ans: 1 },
  { word: 'bed', ipa: '/bed/', options: ['床', '坏的', '鸟', '蜜蜂'], ans: 0 },
];
const MinimalPair: KindComp = ({ onDone }) => {
  const [i, setI] = useState(0);
  const [mark, setMark] = useState<null | boolean>(null);
  const item = MP_ITEMS[i];
  if (!item) return null;
  const pick = (k: number) => {
    const ok = k === item.ans;
    setMark(ok);
    if (!ok) {
      playSfx('wrong');
      return;
    }
    playSfx('correct');
    const next = i + 1;
    setI(next);
    if (next >= 4) {
      playSfx('complete');
      onDone();
    }
  };
  return (
    <div>
      <div className="under-leaf mb-3 flex flex-wrap items-center gap-3 rounded-[3px] p-3">
        <SpeakButton text={item.word} label="听这个词" />
        <span className="machine text-[14px] text-ink2">{item.ipa}</span>
        <span className="machine ml-auto text-[13px] text-ink2">第 {i + 1}/4 组</span>
      </div>
      <ul className="grid gap-2 sm:grid-cols-2">
        {item.options.map((o) => (
          <li key={o}>
            <OptionBtn state="idle" onClick={() => pick(item.options.indexOf(o))}>
              {o}
            </OptionBtn>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex items-center gap-3">
        <PunchRow total={4} done={i} active={i < 4 ? i : undefined} />
        <span className="machine text-[13px] text-ink2">{i}/4 连做</span>
      </div>
      <div className="mt-2" aria-live="polite">
        {mark === false && <Verdict ok={false}>听着像但意思不同，回最小对立对再比一次</Verdict>}
        {i >= 4 && <Verdict ok>四组全对，四条裂缝合上了</Verdict>}
      </div>
    </div>
  );
};

/* ---------- spellingChoosePhoneme：给拼写选读音，四题全对 ---------- */
type SCSItem = { pattern: string; options: string[]; ans: number; word: string };
const SCS_ITEMS: SCSItem[] = [
  { pattern: 'th（think）', options: ['/s/', '/θ/', '/t/'], ans: 1, word: 'think' },
  { pattern: 'ph（photo）', options: ['/f/', '/p/', '/v/'], ans: 0, word: 'photo' },
  { pattern: 'g（giant）', options: ['/ɡ/', '/dʒ/', '/j/'], ans: 1, word: 'giant' },
  { pattern: '-tion（nation）', options: ['/tʃən/', '/ʃn/', '/zən/'], ans: 1, word: 'nation' },
];
const SpellingChoosePhoneme: KindComp = ({ onDone }) => {
  const [right, setRight] = useState<boolean[]>([false, false, false, false]);
  const [mark, setMark] = useState<null | boolean>(null);
  const done = right.every(Boolean);
  const pick = (i: number, k: number) => {
    const ok = SCS_ITEMS[i].ans === k;
    setMark(ok);
    if (!ok) {
      playSfx('wrong');
      return;
    }
    playSfx('correct');
    const next = right.map((v, j) => (j === i ? true : v));
    setRight(next);
    if (next.every(Boolean)) {
      playSfx('complete');
      onDone();
    }
  };
  return (
    <div>
      <ul className="space-y-2">
        {SCS_ITEMS.map((it, i) => (
          <li key={it.pattern} className="under-leaf rounded-[3px] p-3">
            <div className="mb-2 flex flex-wrap items-center gap-3">
              <span className="machine text-[16px] font-bold">{it.pattern}</span>
              <SpeakButton text={it.word} size="sm" label={`听 ${it.word}`} />
              <span aria-hidden className={`punch ml-auto ${right[i] ? 'punch-done' : ''}`} />
            </div>
            <div className="flex flex-wrap gap-2">
              {it.options.map((o, k) => (
                <OptionBtn key={o} state={right[i] && k === it.ans ? 'right' : 'idle'} onClick={() => pick(i, k)}>
                  <span className="machine">{o}</span>
                </OptionBtn>
              ))}
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex items-center gap-3">
        <PunchRow total={4} done={right.filter(Boolean).length} />
        <span className="machine text-[13px] text-ink2">{right.filter(Boolean).length}/4</span>
      </div>
      <div className="mt-2" aria-live="polite">
        {mark === false && <Verdict ok={false}>再听一遍，别按字母名读</Verdict>}
        {done && <Verdict ok>四题全对，这些拼写都能读出声</Verdict>}
      </div>
    </div>
  );
};

/* ---------- listenWriteWord：听音写词，错处标听觉错或对应错 ---------- */
const LWW_WORDS = ['nation', 'motion', 'section', 'relation', 'caution'];
const ListenWriteWord: KindComp = ({ onDone }) => {
  const [vals, setVals] = useState<string[]>(['', '', '', '', '']);
  const [checked, setChecked] = useState(false);
  const [tags, setTags] = useState<Record<number, '听觉错' | '对应错'>>({});
  const correct = vals.filter((v, i) => v.trim().toLowerCase() === LWW_WORDS[i]).length;
  const wrongIdx = LWW_WORDS.map((_, i) => i).filter((i) => vals[i].trim().toLowerCase() !== LWW_WORDS[i]);
  const acc = correct / LWW_WORDS.length;
  const tagged = wrongIdx.every((i) => i in tags);
  const pass = checked && acc >= 0.8 && tagged;
  return (
    <div>
      <ul className="space-y-2">
        {LWW_WORDS.map((w, i) => (
          <li key={i} className="flex flex-wrap items-center gap-2">
            <span className="machine w-6 text-[13px] text-ink2">{i + 1}</span>
            <Btn onClick={() => speakPhoneme(w, { slow: true })} ariaLabel={`播第 ${i + 1} 个词`}>
              <Play size={15} aria-hidden />
            </Btn>
            <input
              type="text"
              value={vals[i]}
              onChange={(e) => {
                setVals((v) => v.map((x, j) => (j === i ? e.target.value : x)));
                setChecked(false);
              }}
              aria-label={`第 ${i + 1} 个听写词`}
              className="machine h-11 w-40 rounded-[3px] border border-ink/40 bg-leaf px-3 text-[15px] outline-none focus:border-ink"
            />
            {checked && (
              <span className={`machine text-[14px] ${vals[i].trim().toLowerCase() === w ? 'text-ink' : 'text-errata'}`}>
                {vals[i].trim().toLowerCase() === w ? '✓' : `✗ ${w}`}
              </span>
            )}
            {checked && vals[i].trim().toLowerCase() !== w && (
              <span className="flex gap-1.5">
                {(['听觉错', '对应错'] as const).map((k) => (
                  <Btn key={k} pressed={tags[i] === k} onClick={() => setTags((t) => ({ ...t, [i]: k }))} className="px-2">
                    {k}
                  </Btn>
                ))}
              </span>
            )}
          </li>
        ))}
      </ul>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <Btn variant="primary" onClick={() => setChecked(true)} disabled={vals.some((v) => !v.trim())}>
          判分
        </Btn>
        <span className="machine text-[13px] text-ink2">
          {checked ? `正确率 ${Math.round(acc * 100)}%，80% 过线` : '先写完五个词'}
        </span>
      </div>
      <div className="mt-2" aria-live="polite">
        {checked && acc < 0.8 && <Verdict ok={false}>正确率不到 80%，把错处归因后再听一遍</Verdict>}
        {checked && acc >= 0.8 && !tagged && <Verdict ok={false}>每个错处标成听觉错或对应错</Verdict>}
        {pass && <Verdict ok>正确率过线，错处也归了因</Verdict>}
      </div>
    </div>
  );
};

/* ---------- matchPairs：音标与拼写限时配对，八对翻完 ---------- */
const MATCH_8: { ipa: string; sp: string }[] = [
  { ipa: '/θ/', sp: 'th' },
  { ipa: '/ʃ/', sp: 'sh' },
  { ipa: '/f/', sp: 'ph' },
  { ipa: '/eɪ/', sp: 'a-e' },
  { ipa: '/aɪ/', sp: 'i-e' },
  { ipa: '/ʃn/', sp: 'tion' },
  { ipa: '/əʊ/', sp: 'o-e' },
  { ipa: '/ŋ/', sp: 'ng' },
];
const MatchPairs: KindComp = ({ onDone }) => {
  const [left, setLeft] = useState<string | null>(null);
  const [done, setDone] = useState<string[]>([]);
  const [miss, setMiss] = useState(false);
  const hit = (f: (typeof MATCH_8)[number]) => {
    if (!left) return;
    if (left === f.ipa) {
      const next = [...done, left];
      setDone(next);
      setMiss(false);
      if (next.length >= 8) {
        playSfx('complete');
        onDone();
      }
    } else {
      setMiss(true);
      playSfx('wrong');
    }
    setLeft(null);
  };
  const remain = MATCH_8.filter((f) => !done.includes(f.ipa));
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <PunchRow total={8} done={done.length} />
        <span className="machine text-[13px] text-ink2">{done.length}/8 对</span>
        <Timer className="ml-auto" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <ul className="space-y-2">
          {remain.map((f) => (
            <li key={f.ipa}>
              <OptionBtn state={left === f.ipa ? 'selected' : 'idle'} onClick={() => setLeft(f.ipa)}>
                <span className="machine">{f.ipa}</span>
              </OptionBtn>
            </li>
          ))}
        </ul>
        <ul className="space-y-2">
          {remain.map((f) => (
            <li key={f.ipa}>
              <OptionBtn state={miss ? 'wrong' : 'idle'} onClick={() => hit(f)}>
                <span className="machine">{f.sp}</span>
              </OptionBtn>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-3" aria-live="polite">
        {done.length >= 8 ? (
          <Verdict ok>八对全部翻完，再进出门条</Verdict>
        ) : (
          <p className="text-[14px] text-ink2">
            {miss ? (
              <span className="text-errata">
                <X size={14} className="mr-1 inline" aria-hidden />
                这对不配，重新点
              </span>
            ) : (
              '先点左栏音标，再点右栏拼写。'
            )}
          </p>
        )}
      </div>
    </div>
  );
};

export const listenKinds: Record<string, KindComp> = {
  listenChoosePhoneme: ListenChoosePhoneme,
  minimalPair: MinimalPair,
  spellingChoosePhoneme: SpellingChoosePhoneme,
  listenWriteWord: ListenWriteWord,
  matchPairs: MatchPairs,
};
