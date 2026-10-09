import React, { useState } from 'react';
import { Eye, EyeOff, Lightbulb } from 'lucide-react';
import { DemoPanel, Btn, OptionBtn, PunchRow, Verdict, Bar, Token } from './_shared';
import { SpeakButton } from '@/components/edu/Speak';
import { spellingPatterns } from '@/data/spellingPatterns';
import { phonemeById } from '@/data/phonemes';

/* 课程 01 音形对应 + 课程 02 拼读拆词的教学演示（12 个 ref） */

/* ---------- 01 ---------- */

/** 错题按裂缝归档，点开每题看它属于哪条缝 */
const CRACKS = [
  { q: '听 write 选音标', pick: '/r/', right: '/r/', crack: '对应裂缝', why: '音听对了，拼写没落到笔上' },
  { q: '听 think 选音标', pick: '/s/', right: '/θ/', crack: '听觉裂缝', why: 'θ 与 s 的动作差没做出来' },
  { q: '看 -tion 选读音', pick: '/tʃən/', right: '/ʃn/', crack: '对应裂缝', why: '组合读音记成了字母名' },
  { q: '听 very 选音标', pick: '/w/', right: '/v/', crack: '听觉裂缝', why: '上齿没有碰下唇' },
];
function DiagnosticReport() {
  const [open, setOpen] = useState<number | null>(null);
  const heard = CRACKS.filter((c) => c.crack === '听觉裂缝').length;
  return (
    <DemoPanel label="诊断报告 · 4 题样例">
      <ul className="mb-3 space-y-1.5">
        {CRACKS.map((c, i) => (
          <li key={i}>
            <button
              type="button"
              onClick={() => setOpen(open === i ? null : i)}
              aria-expanded={open === i}
              className="hinge flex min-h-[44px] w-full items-center gap-3 border-2 border-ink bg-leaf px-3 text-left text-[14px] hover:bg-under"
            >
              <span aria-hidden className="machine text-ink2">
                {i + 1}
              </span>
              <span className="flex-1">{c.q}</span>
              <span className="machine text-[13px] text-errata">
                {c.pick} ≠ {c.right}
              </span>
            </button>
            {open === i && (
              <div className="hinge under-leaf ml-6 p-3 text-[14px]">
                <span className="machine text-[13px] text-ink2">{c.crack}</span>
                <p className="mt-1">{c.why}</p>
              </div>
            )}
          </li>
        ))}
      </ul>
      <div className="space-y-2 border-t border-rule pt-3">
        <Bar label="听觉裂缝" value={heard} max={4} suffix=" 题" />
        <Bar label="对应裂缝" value={4 - heard} max={4} suffix=" 题" />
      </div>
      <p className="mt-3 text-[14px] font-bold">报告按维度汇总，哪条缝多先修哪条。</p>
    </DemoPanel>
  );
}

/** 听写判分后逐处标听觉错或对应错，两类分开修 */
const DICTATION = [
  { got: 'rite', want: 'write', fix: '听觉错' as const },
  { got: 'sink', want: 'think', fix: '听觉错' as const },
  { got: 'foto', want: 'photo', fix: '对应错' as const },
];
function DictationDimensions() {
  const [tagged, setTagged] = useState<Record<number, '听觉错' | '对应错' | null>>({});
  return (
    <DemoPanel label="听写判分 · 逐处归因">
      <ul className="space-y-2">
        {DICTATION.map((d, i) => {
          const t = tagged[i] ?? null;
          return (
            <li key={i} className="under-leaf p-3">
              <div className="flex flex-wrap items-center gap-2 text-[15px]">
                <span className="machine text-errata">{d.got}</span>
                <span aria-hidden className="text-ink2">≠</span>
                <span className="machine font-bold">{d.want}</span>
                <span className="machine ml-auto text-[13px] text-ink2">{t ? `${t}已标` : '选一个错因'}</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {(['听觉错', '对应错'] as const).map((k) => (
                  <Btn key={k} pressed={t === k} onClick={() => setTagged((s) => ({ ...s, [i]: k }))}>
                    {t === k && k === d.fix ? '✓ ' : t === k && k !== d.fix ? '✗ ' : ''}
                    {k}
                  </Btn>
                ))}
              </div>
            </li>
          );
        })}
      </ul>
      <div className="mt-3" aria-live="polite">
        {Object.values(tagged).every(Boolean) && (
          <Verdict ok={Object.entries(tagged).every(([k, v]) => DICTATION[Number(k)].fix === v)}>
            听觉错回辨音，对应错回规则，两类分开修
          </Verdict>
        )}
      </div>
    </DemoPanel>
  );
}

/** 两词连播，标出动作差的位置 */
const PAIRS = [
  { a: 'think', b: 'sink', ipaA: '/θɪŋk/', ipaB: '/sɪŋk/', diffA: 'θ', diffB: 's', move: 'θ 要把舌尖放到齿间，s 的舌尖停在齿龈' },
  { a: 'bat', b: 'pat', ipaA: '/bæt/', ipaB: '/pæt/', diffA: 'b', diffB: 'p', move: 'b 是浊音声带先振，p 是清音靠爆破' },
];
function MinimalPairContrast() {
  const [pi, setPi] = useState(0);
  const [show, setShow] = useState(false);
  const p = PAIRS[pi];
  return (
    <DemoPanel label="最小对立对 · 动作差">
      <div className="flex flex-wrap items-center gap-3">
        {[p.a, p.b].map((w, i) => (
          <div key={w} className="under-leaf flex items-center gap-2 px-3 py-2">
            <span className="machine text-[15px] font-bold">{w}</span>
            <span className="machine text-[13px] text-ink2">{i === 0 ? p.ipaA : p.ipaB}</span>
            <SpeakButton text={w} size="sm" />
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Btn onClick={() => setShow((s) => !s)}>
          {show ? <EyeOff size={15} aria-hidden /> : <Eye size={15} aria-hidden />} 标出动作差
        </Btn>
        <Btn
          onClick={() => {
            setPi((i) => (i + 1) % PAIRS.length);
            setShow(false);
          }}
        >
          换一对
        </Btn>
      </div>
      <div className="hinge mt-3" aria-live="polite">
        {show ? (
          <p className="text-[15px]">
            <span className="machine border-2 border-ink px-1.5 py-0.5 font-bold">{p.diffA}</span>
            <span aria-hidden className="mx-2 text-ink2">对</span>
            <span className="machine border-2 border-ink px-1.5 py-0.5 font-bold">{p.diffB}</span>
            <span className="mt-1 block">{p.move}</span>
          </p>
        ) : (
          <p className="text-[14px] text-ink2">先连播两词，让眼睛和耳朵同时对齐。</p>
        )}
      </div>
    </DemoPanel>
  );
}

/** 48 音按发音部位归五家族，点代表音看口型说明 */
const FAMILIES = [
  { name: '双唇', ids: ['p', 'b', 'm', 'w'], move: '上下唇合拢再放开' },
  { name: '唇齿', ids: ['f', 'v'], move: '上齿咬住下唇，留缝出气' },
  { name: '齿间', ids: ['θ', 'ð'], move: '舌尖伸到上下齿之间' },
  { name: '齿龈', ids: ['t', 'd', 'n', 's', 'z', 'l'], move: '舌尖顶住上齿龈' },
  { name: '舌面与声门', ids: ['ʃ', 'ʒ', 'k', 'h', 'tʃ', 'dʒ'], move: '舌面抬起或声门送气' },
];
function MouthActionFamily() {
  const [fi, setFi] = useState(2);
  const [id, setId] = useState('θ');
  const f = FAMILIES[fi];
  const p = phonemeById[id];
  return (
    <DemoPanel label="口型家族 · 48 音归位">
      <div className="flex flex-wrap gap-2">
        {FAMILIES.map((fam, i) => (
          <Btn
            key={fam.name}
            pressed={i === fi}
            onClick={() => {
              setFi(i);
              setId(fam.ids[0]);
            }}
          >
            {fam.name}
          </Btn>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {f.ids.map((pid) => (
          <button
            key={pid}
            type="button"
            onClick={() => setId(pid)}
            aria-pressed={pid === id}
            className={`hinge machine min-h-[44px] min-w-[44px] border-2 px-3 text-[16px] font-bold ${
              pid === id ? 'border-ink bg-ink text-milk' : 'border-ink bg-leaf hover:bg-under'
            }`}
          >
            {phonemeById[pid]?.symbol ?? pid}
          </button>
        ))}
      </div>
      <div className="under-leaf mt-3 p-3">
        <p className="text-[15px] font-bold">
          {f.name}家族，{f.move}
        </p>
        <p className="mt-1 text-[14px] text-ink2">
          {p?.mouthShape} {p?.airflow}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-[14px]">
          <span>例词</span>
          {p?.exampleWords.slice(0, 3).map((w) => (
            <span key={w} className="flex items-center gap-1">
              <span className="machine">{w}</span>
              <SpeakButton text={w} size="sm" />
            </span>
          ))}
        </div>
      </div>
    </DemoPanel>
  );
}

/** 一条对应带出一族例词，例外单独标出来 */
function SpellingSoundMap() {
  const [si, setSi] = useState(0);
  const s = spellingPatterns[si];
  return (
    <DemoPanel label="音形对应带">
      <div className="flex flex-wrap gap-2">
        {spellingPatterns.slice(0, 6).map((sp, i) => (
          <Btn key={sp.id} pressed={i === si} onClick={() => setSi(i)}>
            {sp.pattern} → {sp.phoneme}
          </Btn>
        ))}
      </div>
      <ul className="mt-3 flex flex-wrap gap-2">
        {s.examples.map((e) => {
          const w = e.split(' ')[0];
          return (
            <li key={e}>
              <span className="under-leaf machine inline-flex items-center gap-1 px-2 py-1.5 text-[13px]">
                {e}
                <SpeakButton text={w} size="sm" />
              </span>
            </li>
          );
        })}
      </ul>
      {s.exceptions.length > 0 && (
        <p className="mt-2 text-[14px]">
          <span className="machine border-2 border-errata px-1.5 py-0.5 text-[13px] text-errata">例外</span>{' '}
          <span className="machine text-[14px]">{s.exceptions.join('、')}</span>
          <span className="text-ink2">，单独标出来记。</span>
        </p>
      )}
      <p className="mt-3 border-t border-rule pt-2 text-[14px]">{s.rule}</p>
    </DemoPanel>
  );
}

/** 音标与拼写两栏配对，八对翻完 */
const FLIP = [
  { ipa: '/θ/', sp: 'th' },
  { ipa: '/ʃ/', sp: 'sh' },
  { ipa: '/f/', sp: 'ph' },
  { ipa: '/eɪ/', sp: 'a-e' },
  { ipa: '/aɪ/', sp: 'i-e' },
  { ipa: '/ʃn/', sp: 'tion' },
  { ipa: '/əʊ/', sp: 'o-e' },
  { ipa: '/ŋ/', sp: 'ng' },
];
function BidirectionalFlip() {
  const [left, setLeft] = useState<string | null>(null);
  const [done, setDone] = useState<string[]>([]);
  const hit = (f: (typeof FLIP)[number]) => {
    if (!left) return;
    if (left === f.ipa) setDone((d) => [...d, left]);
    setLeft(null);
  };
  const remaining = FLIP.filter((f) => !done.includes(f.ipa));
  return (
    <DemoPanel label="双向配对 · 8 对">
      <div className="mb-3 flex items-center gap-3">
        <PunchRow total={8} done={done.length} />
        <span className="machine text-[13px] text-ink2">{done.length}/8</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <ul className="space-y-2">
          {remaining.map((f) => (
            <li key={f.ipa}>
              <OptionBtn state={left === f.ipa ? 'selected' : 'idle'} onClick={() => setLeft(f.ipa)}>
                <span className="machine">{f.ipa}</span>
              </OptionBtn>
            </li>
          ))}
        </ul>
        <ul className="space-y-2">
          {remaining.map((f) => (
            <li key={f.ipa}>
              <OptionBtn state="idle" onClick={() => hit(f)}>
                <span className="machine">{f.sp}</span>
              </OptionBtn>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-3" aria-live="polite">
        {done.length === 8 ? (
          <Verdict ok>八对全部翻完，双向都通</Verdict>
        ) : (
          <p className="text-[14px] text-ink2">先点左栏音标，再点右栏拼写。</p>
        )}
      </div>
    </DemoPanel>
  );
}

/* ---------- 02 ---------- */

/** decision 左排 8 字母右排 3 音节块，记忆量对比 */
function LetterVsBlockContrast() {
  const letters = ['d', 'e', 'c', 'i', 's', 'i', 'o', 'n'];
  const blocks = ['de', 'ci', 'sion'];
  return (
    <DemoPanel label="字母块对比 · decision">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="machine mb-2 text-[13px] text-ink2">按字母 · 8 个单元</p>
          <div className="flex flex-wrap gap-1">
            {letters.map((l, i) => (
              <span
                key={i}
                className="machine flex h-9 w-9 items-center justify-center border-2 border-ink text-[15px]"
              >
                {l}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="machine mb-2 text-[13px] text-ink2">按音节 · 3 个单元</p>
          <div className="flex flex-wrap gap-2">
            {blocks.map((b) => (
              <Token key={b} className="machine text-[16px] font-bold">
                {b}
              </Token>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4 space-y-2 border-t border-rule pt-3">
        <Bar label="背字母要记" value={8} max={8} suffix=" 格" />
        <Bar label="背音节只要" value={3} max={8} suffix=" 格" hue="#137574" />
      </div>
    </DemoPanel>
  );
}

/** construction 圈核心：o、u、io 三个核心 */
const CORE_WORD = ['c', 'o', 'n', 's', 't', 'r', 'u', 'c', 't', 'io', 'n'];
const CORE_ANS = [1, 6, 9];
function VowelCoreCounter() {
  const [picked, setPicked] = useState<number[]>([]);
  const all = picked.length === CORE_ANS.length;
  const right = all && picked.every((i) => CORE_ANS.includes(i));
  return (
    <DemoPanel label="圈元音核心 · construction">
      <div className="flex flex-wrap gap-1.5">
        {CORE_WORD.map((c, i) => {
          const on = picked.includes(i);
          return (
            <button
              key={i}
              type="button"
              aria-pressed={on}
              aria-label={`${c}${on ? '，已圈为核心' : ''}`}
              onClick={() => setPicked((p) => (on ? p.filter((x) => x !== i) : [...p, i]))}
              className={`hinge machine flex min-h-[44px] min-w-[44px] items-center justify-center border-2 px-2 text-[17px] font-bold ${
                on ? 'border-ink bg-ink text-milk' : 'border-ink bg-leaf hover:bg-under'
              }`}
            >
              {c}
            </button>
          );
        })}
      </div>
      <p className="mt-3 machine text-[14px]">核心 {picked.length} 个，音节 {picked.length} 个</p>
      <div className="mt-2" aria-live="polite">
        {all && (
          <Verdict ok={right}>{right ? 'o、u、io 三个核心，音节数对上了' : '再看一眼，-tion 的 o 不发音，不算核心'}</Verdict>
        )}
      </div>
    </DemoPanel>
  );
}

/** str 整体给后一节，三块成形 */
const SPLIT_STEPS = [
  '词面上 12 个字母，先别急着下刀。',
  '数元音核心：o、u、io，3 个核心就是 3 个音节。',
  'str 能整体起音，切口落在它前头。',
];
function ConsonantSplitStr() {
  const [step, setStep] = useState(0);
  return (
    <DemoPanel label="辅音连缀归位 · construction">
      <div className="mb-3 flex items-center gap-3">
        <PunchRow total={3} done={step} active={step < 3 ? step : undefined} />
        <span className="machine text-[13px] text-ink2">步 {step}/3</span>
      </div>
      <div className="under-leaf p-4 text-center">
        <div className="flex justify-center gap-3">
          {step < 2 ? (
            <span className="machine text-[22px] font-bold">construction</span>
          ) : (
            ['con', 'struc', 'tion'].map((b, i) => (
              <React.Fragment key={b}>
                {i > 0 && (
                  <span aria-hidden className="machine self-center text-[18px] text-ink2">
                    ·
                  </span>
                )}
                <Token hue={i === 1 ? '#2A4BD7' : undefined} className="machine text-[20px] font-bold">
                  {b}
                </Token>
              </React.Fragment>
            ))
          )}
        </div>
        <p className="mt-3 text-[14px] text-ink2">{SPLIT_STEPS[step]}</p>
      </div>
      <div className="mt-3 flex gap-2">
        <Btn onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
          上一步
        </Btn>
        <Btn variant="primary" onClick={() => setStep((s) => Math.min(3, s + 1))} disabled={step === 3}>
          {step === 3 ? '三块成形' : '下一步'}
        </Btn>
      </div>
      {step === 3 && <p className="hinge mt-3 text-[14px] font-bold">切口在 str 前头，后一节 struc 能直接起音。</p>}
    </DemoPanel>
  );
}

/** record 名前动后，三条线索逐条点亮 */
const CLUES = [
  { t: '词性线索', d: '名词 record（唱片）重第一音节，动词 record（记录）重第二音节。' },
  { t: '句法线索', d: 'the record 在主语位是名词，to record 后面跟宾语是动词。' },
  { t: '后缀线索', d: '同形词看句中接的是冠词还是不定式，读音跟着词性走。' },
];
function StressThreeClues() {
  const [lit, setLit] = useState(0);
  return (
    <DemoPanel label="重音三线索 · record">
      <div className="mb-3 flex flex-wrap gap-3">
        <div className="under-leaf flex items-center gap-2 px-3 py-2">
          <span className="machine text-[16px] font-bold">ˈrecord</span>
          <span className="text-[13px] text-ink2">名词，唱片</span>
          <SpeakButton text="record" audioKey="record-noun" size="sm" label="播放 ˈrecord（名词，重音在首音节）" />
        </div>
        <div className="under-leaf flex items-center gap-2 px-3 py-2">
          <span className="machine text-[16px] font-bold">reˈcord</span>
          <span className="text-[13px] text-ink2">动词，记录</span>
          <SpeakButton text="record" audioKey="record-verb" size="sm" label="播放 reˈcord（动词，重音在第二音节）" />
        </div>
      </div>
      <p className="mt-2 text-[13px] text-ink2">
        两个喇叭各播对应读音：名词重音落在 ˈre，动词重音落在 cord——同一拼写，两段音频。
      </p>
      <ul className="space-y-2">
        {CLUES.map((c, i) => (
          <li key={c.t}>
            <button
              type="button"
              onClick={() => setLit(i + 1)}
              aria-expanded={lit > i}
              className={`hinge flex min-h-[44px] w-full items-center gap-3 border-2 px-3 text-left text-[14px] ${
                lit > i ? 'border-ink bg-leaf' : 'border-ink bg-leaf hover:bg-under'
              }`}
            >
              <span aria-hidden className={`punch ${lit > i ? 'punch-done' : ''}`} />
              <span className="font-bold">{c.t}</span>
              <Lightbulb size={15} aria-hidden className={`ml-auto ${lit > i ? 'text-ink' : 'text-ink2'}`} />
            </button>
            {lit > i && <p className="hinge ml-6 mt-1 text-[14px] text-ink2">{c.d}</p>}
          </li>
        ))}
      </ul>
      <div className="mt-3" aria-live="polite">
        {lit === 3 && <Verdict ok>三条线索全部点亮</Verdict>}
      </div>
    </DemoPanel>
  );
}

/** -tion 族三个词同读 /ʃn/，重音同落前一节 */
const TION_WORDS = [
  { parts: ['con', 'struc', 'tion'], stress: 1, ipa: '/kənˈstrʌkʃn/' },
  { parts: ['in', 'for', 'ma', 'tion'], stress: 2, ipa: '/ˌɪnfəˈmeɪʃn/' },
  { parts: ['e', 'du', 'ca', 'tion'], stress: 2, ipa: '/ˌedʒuˈkeɪʃn/' },
];
function TionFamilyMap() {
  return (
    <DemoPanel label="-tion 族谱 · /ʃn/">
      <ul className="space-y-2">
        {TION_WORDS.map((row) => (
          <li key={row.ipa} className="under-leaf flex flex-wrap items-center gap-2 px-3 py-2">
            <span className="flex gap-1">
              {row.parts.map((p, i) => (
                <span
                  key={i}
                  className={`machine px-1.5 py-1 text-[16px] ${
                    i === row.stress ? 'bg-ink font-bold text-milk' : 'border-2 border-ink'
                  }`}
                >
                  {p}
                </span>
              ))}
            </span>
            <span className="machine ml-auto text-[13px] text-ink2">{row.ipa}</span>
            <SpeakButton text={row.parts.join('')} size="sm" />
          </li>
        ))}
      </ul>
      <p className="mt-3 border-t border-rule pt-2 text-[14px]">
        <span className="machine font-bold">-tion</span> 读 <span className="machine font-bold">/ʃn/</span>
        ，实心块是重音，三个词都落在它前一节。
      </p>
    </DemoPanel>
  );
}

/** transportation 三步连跑，数核心、分辅音、定重音一次做完 */
const ALGO_STEPS = [
  { t: '数核心', d: 'a、o、a、o 四个核心（-tion 的 o 不发音）→ 4 个音节。' },
  { t: '分辅音', d: 'trans 结尾的 n、s 各归一边，切口落在辅元接缝。' },
  { t: '定重音', d: '-tion 前两格，重音落在 ta，次重音在 trans。' },
];
function AlgorithmFullRun() {
  const [step, setStep] = useState(0);
  const blocks = ['trans', 'por', 'ta', 'tion'];
  return (
    <DemoPanel label="算法三步 · transportation">
      <div className="mb-3 flex items-center gap-3">
        <PunchRow total={3} done={step} active={step < 3 ? step : undefined} />
        <span className="machine text-[13px] text-ink2">
          步 {step}/3 · {step < 3 ? ALGO_STEPS[step].t : '完成'}
        </span>
      </div>
      <div className="under-leaf p-4">
        <div className="flex flex-wrap justify-center gap-2">
          {step === 0 ? (
            <span className="machine text-[22px] font-bold">transportation</span>
          ) : (
            blocks.map((b, i) => (
              <Token key={b} hue={step === 2 && i === 2 ? '#2A4BD7' : undefined} className="machine text-[18px] font-bold">
                {step === 2 && i === 2 ? `ˈ${b}` : b}
              </Token>
            ))
          )}
        </div>
        <p className="mt-3 text-center text-[14px]" aria-live="polite">
          {step === 0 ? '先数元音核心，别急着切。' : ALGO_STEPS[step - 1].d}
        </p>
      </div>
      <div className="mt-3 flex gap-2">
        <Btn onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
          回退
        </Btn>
        <Btn variant="primary" onClick={() => setStep((s) => Math.min(3, s + 1))} disabled={step === 3}>
          {step === 3 ? '一次做完' : '跑一步'}
        </Btn>
      </div>
      {step === 3 && <p className="hinge mt-3 text-[14px] font-bold">数核心、分辅音、定重音，一次做完。</p>}
    </DemoPanel>
  );
}

export const phonicsDemos: Record<string, React.FC> = {
  'diagnostic-report': DiagnosticReport,
  'dictation-dimensions': DictationDimensions,
  'minimal-pair-contrast': MinimalPairContrast,
  'mouth-action-family': MouthActionFamily,
  'spelling-sound-map': SpellingSoundMap,
  'bidirectional-flip': BidirectionalFlip,
  'letter-vs-block-contrast': LetterVsBlockContrast,
  'vowel-core-counter': VowelCoreCounter,
  'consonant-split-str': ConsonantSplitStr,
  'stress-three-clues': StressThreeClues,
  'tion-family-map': TionFamilyMap,
  'algorithm-full-run': AlgorithmFullRun,
};
