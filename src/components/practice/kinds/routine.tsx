import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import type { KindComp } from './types';
import { Btn, OptionBtn, PunchRow, Verdict, Timer } from '@/components/demos/_shared';
import { SpeakButton } from '@/components/edu/Speak';
import { playSfx } from '@/hooks/useSfx';

/* 常规流程族练习体（9 个 kind） */

/* ---------- diagnostic / exitTicket：指针型，跳到本课第 0 / 7 步 ---------- */
function StepPointer({ step, label, note }: { step: 0 | 7; label: string; note: string }) {
  const [clicked, setClicked] = useState(false);
  return (
    <div className="flex flex-wrap items-center gap-3">
      <a
        href={`?step=${step}`}
        onClick={() => {
          setClicked(true);
          playSfx('click');
        }}
        className="hinge inline-flex min-h-[44px] items-center gap-2 bg-ink px-4 font-display text-sm font-bold text-milk press shadow-hard hover:bg-ink2"
      >
        {label}
        <ArrowRight size={15} strokeWidth={3} aria-hidden />
      </a>
      <span className="text-[13px] text-ink2">{note}</span>
      {clicked && (
        <span className="hinge machine border-2 border-ink px-2 py-1 text-[12px]">
          新页面做完记得回来收口
        </span>
      )}
    </div>
  );
}
const Diagnostic: KindComp = ({ practice, onDone }) => (
  <div className="space-y-3">
    <StepPointer step={0} label="去诊断台" note="7 到 10 道题一次做完，当场看分数带" />
    <Btn variant="ghost" onClick={onDone}>
      <Check size={15} strokeWidth={3} aria-hidden />
      我做完了
    </Btn>
    <p className="text-[13px] text-ink2">诊断题在第 0 步，做完回来点上面的收口。</p>
    <span className="sr-only">{practice.title}</span>
  </div>
);
const ExitTicket: KindComp = ({ practice, onDone }) => (
  <div className="space-y-3">
    <StepPointer step={7} label="去出门条" note="出门条加离场自测，答完看分流结果" />
    <Btn variant="ghost" onClick={onDone}>
      <Check size={15} strokeWidth={3} aria-hidden />
      我做完了
    </Btn>
    <p className="text-[13px] text-ink2">出门条在第 7 步，成绩只用来分流。</p>
    <span className="sr-only">{practice.title}</span>
  </div>
);

/* ---------- choice：按 prompt 匹配六套选择内容，阈值过关 ---------- */
type ChoiceSet = {
  match: RegExp;
  need: number;
  items: { q: string; options: string[]; ans: number }[];
};
const CHOICE_SETS: ChoiceSet[] = [
  {
    match: /主动输出/,
    need: 1,
    items: [{ q: '四条练法里，哪条算主动输出？', options: ['默读词汇表四十分钟', '把单词抄写三遍', '用英文口头造句四句', '把错题本排个版'], ans: 2 }],
  },
  {
    match: /该造联想/,
    need: 6,
    items: [
      { q: 'onomatopoeia，造联想还是多读多用？', options: ['造联想', '多读多用'], ans: 0 },
      { q: 'ambulance，造联想还是多读多用？', options: ['造联想', '多读多用'], ans: 0 },
      { q: 'diagnosis，造联想还是多读多用？', options: ['造联想', '多读多用'], ans: 0 },
      { q: 'water，造联想还是多读多用？', options: ['造联想', '多读多用'], ans: 1 },
      { q: 'garden，造联想还是多读多用？', options: ['造联想', '多读多用'], ans: 1 },
      { q: 'comfortable，造联想还是多读多用？', options: ['造联想', '多读多用'], ans: 1 },
    ],
  },
  {
    match: /假复习/,
    need: 3,
    items: [
      { q: '把词汇表从头到尾再看一遍', options: ['真复习', '假复习'], ans: 1 },
      { q: '合上书先把昨天的词写出来，再翻开对答案', options: ['真复习', '假复习'], ans: 0 },
      { q: '听写昨天的词，错处标出错因', options: ['真复习', '假复习'], ans: 0 },
      { q: '只抄写三遍，全程不遮不测', options: ['真复习', '假复习'], ans: 1 },
    ],
  },
  {
    match: /升档|降档|保持/,
    need: 4,
    items: [
      { q: '这次想得又快又全对', options: ['升档', '降档', '保持'], ans: 0 },
      { q: '卡了一阵才想起来，最后对了', options: ['升档', '降档', '保持'], ans: 2 },
      { q: '完全想不起来，等于没见过', options: ['升档', '降档', '保持'], ans: 1 },
      { q: '连续三次都轻松全对', options: ['升档', '降档', '保持'], ans: 0 },
    ],
  },
  {
    match: /备路/,
    need: 1,
    items: [
      {
        q: '四条记法里，哪条备路最多？',
        options: ['只抄写十遍', '只看中文释义', '拆音节加画面，再写进两个不同句子', '跟着读音默念'],
        ans: 2,
      },
    ],
  },
  {
    match: /词尾判词性/,
    need: 6,
    items: [
      { q: 'quickly 的词性', options: ['名词', '动词', '形容词', '副词'], ans: 3 },
      { q: 'creation 的词性', options: ['名词', '动词', '形容词', '副词'], ans: 0 },
      { q: 'joyful 的词性', options: ['名词', '动词', '形容词', '副词'], ans: 2 },
      { q: 'summarise 的词性', options: ['名词', '动词', '形容词', '副词'], ans: 1 },
      { q: 'peaceful 的词性', options: ['名词', '动词', '形容词', '副词'], ans: 2 },
      { q: 'danger 的词性', options: ['名词', '动词', '形容词', '副词'], ans: 0 },
    ],
  },
];
const FALLBACK_SET: ChoiceSet = {
  match: /./,
  need: 1,
  items: [{ q: '按 prompt 的要求完成这一步', options: ['完成', '再看一遍'], ans: 0 }],
};
const Choice: KindComp = ({ practice, onDone }) => {
  const set = CHOICE_SETS.find((s) => s.match.test(practice.prompt)) ?? FALLBACK_SET;
  const [picked, setPicked] = useState<Record<number, number>>({});
  const [mark, setMark] = useState<null | boolean>(null);
  const right = set.items.filter((it, i) => picked[i] === it.ans).length;
  const allPicked = Object.keys(picked).length === set.items.length;
  const submit = () => {
    const ok = right >= set.need;
    setMark(ok);
    if (ok) {
      playSfx('complete');
      onDone();
    } else playSfx('wrong');
  };
  return (
    <div className="space-y-3">
      <ul className="space-y-3">
        {set.items.map((it, i) => (
          <li key={i}>
            <p className="mb-1.5 text-[15px] font-bold">
              <span className="machine mr-2 text-[13px] text-ink2">{i + 1}</span>
              {it.q}
            </p>
            <div className="flex flex-wrap gap-2">
              {it.options.map((o, k) => (
                <OptionBtn
                  key={o}
                  className="w-auto"
                  state={picked[i] === undefined ? 'idle' : k === it.ans ? 'right' : picked[i] === k ? 'wrong' : 'idle'}
                  onClick={() => setPicked((p) => ({ ...p, [i]: k }))}
                >
                  {o}
                </OptionBtn>
              ))}
            </div>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap items-center gap-3">
        <Btn variant="primary" onClick={submit} disabled={!allPicked}>
          交
        </Btn>
        <PunchRow total={set.items.length} done={Object.keys(picked).length} />
        <span className="machine text-[13px] text-ink2">
          对 {right}/{set.items.length}，{set.need} 过线
        </span>
      </div>
      <div aria-live="polite">
        {mark === false && <Verdict ok={false}>没过线，把每条重新想过一遍再交</Verdict>}
        {mark && <Verdict ok>过线了</Verdict>}
      </div>
    </div>
  );
};

/* ---------- contextChoice：三道语境选义一次做完 ---------- */
const CC_ITEMS: { sentence: string; word: string; options: string[]; ans: number }[] = [
  { sentence: 'The car plant employs two thousand workers.', word: 'plant', options: ['工厂', '种植', '植物'], ans: 0 },
  { sentence: 'He recorded the whole song on his phone.', word: 'recorded', options: ['记录下来', '唱片', '回忆'], ans: 0 },
  { sentence: 'She took a real interest in the project.', word: 'interest', options: ['兴趣', '利息', '利益'], ans: 0 },
];
const ContextChoice: KindComp = ({ onDone }) => {
  const [picked, setPicked] = useState<Record<number, number>>({});
  const [mark, setMark] = useState<null | boolean>(null);
  const right = CC_ITEMS.filter((it, i) => picked[i] === it.ans).length;
  const allPicked = Object.keys(picked).length === CC_ITEMS.length;
  const submit = () => {
    const ok = right === CC_ITEMS.length;
    setMark(ok);
    if (ok) {
      playSfx('complete');
      onDone();
    } else playSfx('wrong');
  };
  return (
    <div className="space-y-3">
      <ul className="space-y-3">
        {CC_ITEMS.map((it, i) => (
          <li key={i} className="under-leaf p-3">
            <div className="mb-1.5 flex flex-wrap items-center gap-2">
              <span className="machine text-[15px]">{it.sentence}</span>
              <SpeakButton text={it.sentence} size="sm" label="朗读" />
            </div>
            <div className="flex flex-wrap gap-2">
              {it.options.map((o, k) => (
                <OptionBtn
                  key={o}
                  className="w-auto"
                  state={picked[i] === undefined ? 'idle' : k === it.ans ? 'right' : picked[i] === k ? 'wrong' : 'idle'}
                  onClick={() => setPicked((p) => ({ ...p, [i]: k }))}
                >
                  {o}
                </OptionBtn>
              ))}
            </div>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap items-center gap-3">
        <Btn variant="primary" onClick={submit} disabled={!allPicked}>
          交三题
        </Btn>
        <span className="machine text-[13px] text-ink2">{right}/3</span>
      </div>
      <div aria-live="polite">
        {mark === false && <Verdict ok={false}>搭配在定方向，放回句子里再看一次</Verdict>}
        {mark && <Verdict ok>三题全对，看得出搭配在定方向</Verdict>}
      </div>
    </div>
  );
};

/* ---------- fakeContext：两轮挑病句并指病灶 ---------- */
type FCRound = {
  sentences: { text: string; sick: boolean }[];
  sickIndex: number;
  wounds: string[];
  woundAns: number;
  why: string;
};
const FC_ROUNDS: FCRound[] = [
  {
    sentences: [
      { text: 'I really like studying English words.', sick: false },
      { text: 'I very like to study English words.', sick: true },
      { text: 'She made a decision after thinking it over.', sick: false },
      { text: 'He takes a serious interest in painting.', sick: false },
    ],
    sickIndex: 1,
    wounds: ['时态没加', '按中文语序套英文', '拼写有漏'],
    woundAns: 1,
    why: 'very 不能修饰 like，副词用 really；按中文语序直译，词进去了句法没进去。',
  },
  {
    sentences: [
      { text: 'make a final decision', sick: true },
      { text: 'We make plans every Sunday.', sick: false },
      { text: 'The plan worked out well.', sick: false },
      { text: 'They took over the project.', sick: false },
    ],
    sickIndex: 0,
    wounds: ['搭配被拆开，缺了冠词', '动词没变形', '主语放错位置'],
    woundAns: 0,
    why: 'make a decision 是整块，孤零零两个词不成句，冠词属于这块的一部分。',
  },
];
const FakeContext: KindComp = ({ onDone }) => {
  const [round, setRound] = useState(0);
  const [sickPick, setSickPick] = useState<number | null>(null);
  const [wound, setWound] = useState<number | null>(null);
  const r = FC_ROUNDS[round];
  const resolved = sickPick === r.sickIndex && wound === r.woundAns;
  const next = () => {
    if (round + 1 >= FC_ROUNDS.length) {
      playSfx('complete');
      onDone();
      setRound(round); // 保持最后一轮展示
      return;
    }
    playSfx('correct');
    setRound(round + 1);
    setSickPick(null);
    setWound(null);
  };
  const [finished, setFinished] = useState(false);
  const finish = () => {
    setFinished(true);
    playSfx('complete');
    onDone();
  };
  if (finished) return <Verdict ok>两轮全对，病句和病灶都指得出</Verdict>;
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className="machine text-[13px] text-ink2">第 {round + 1}/2 轮</span>
        <PunchRow total={2} done={round} />
      </div>
      <ul className="space-y-1.5">
        {r.sentences.map((s, i) => (
          <li key={i}>
            <OptionBtn
              state={sickPick === null ? 'idle' : i === r.sickIndex ? 'right' : sickPick === i ? 'wrong' : 'idle'}
              onClick={() => {
                setSickPick(i);
                setWound(null);
              }}
            >
              <span className="machine text-[14px]">{s.text}</span>
            </OptionBtn>
          </li>
        ))}
      </ul>
      {sickPick !== null && (
        <div className="hinge">
          <p className="mb-1.5 text-[14px] font-bold">指出病灶</p>
          <div className="flex flex-wrap gap-2">
            {r.wounds.map((w, i) => (
              <OptionBtn
                key={w}
                className="w-auto"
                state={wound === null ? 'idle' : i === r.woundAns ? 'right' : wound === i ? 'wrong' : 'idle'}
                onClick={() => setWound(i)}
              >
                {w}
              </OptionBtn>
            ))}
          </div>
        </div>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <Btn variant="primary" disabled={!resolved} onClick={round + 1 >= FC_ROUNDS.length ? finish : next}>
          {round + 1 >= FC_ROUNDS.length ? '收工' : '进下一轮'}
        </Btn>
        <span className="text-[13px] text-ink2">两轮全对才收工</span>
      </div>
      <div aria-live="polite">
        {wound !== null && !resolved && <Verdict ok={false}>病句或病灶有一个没指对，再看一眼</Verdict>}
        {resolved && <Verdict ok>{r.why}</Verdict>}
      </div>
    </div>
  );
};

/* ---------- associationFault：读联想找断环，两题全对 ---------- */
const AF_ITEMS: { story: string; options: string[]; ans: number; fix: string }[] = [
  {
    story: 'ambulance → 一辆救护车闪着灯开过来，一路按着喇叭。',
    options: ['缺音近', '缺义通', '缺动感'],
    ans: 0,
    fix: '画面生动但没借音，回去补「俺不能死」那一环。',
  },
  {
    story: 'transformation → 转形没莫省（四个字的顺口溜，没有画面）。',
    options: ['缺音近', '缺义通', '缺动感'],
    ans: 2,
    fix: '只有顺口溜没人没动作，补一个能演出来的画面。',
  },
];
const AssociationFault: KindComp = ({ onDone }) => {
  const [i, setI] = useState(0);
  const [right, setRight] = useState(0);
  const [mark, setMark] = useState<null | boolean>(null);
  const item = AF_ITEMS[i];
  if (!item) return <Verdict ok>两题全对，断掉的环节都找到了</Verdict>;
  const pick = (k: number) => {
    const ok = k === item.ans;
    setMark(ok);
    if (!ok) {
      playSfx('wrong');
      return;
    }
    playSfx('correct');
    const nr = right + 1;
    setRight(nr);
    if (nr >= 2) {
      playSfx('complete');
      onDone();
      setI(2);
      return;
    }
    setI(i + 1);
    setMark(null);
  };
  return (
    <div className="space-y-3">
      <div className="under-leaf p-3">
        <p className="text-[15px]">{item.story}</p>
      </div>
      <p className="mb-1.5 text-[14px] font-bold">断掉的是哪一环？</p>
      <div className="flex flex-wrap gap-2">
        {item.options.map((o, k) => (
          <OptionBtn key={o} className="w-auto" state={mark === null ? 'idle' : k === item.ans ? 'right' : 'wrong'} onClick={() => pick(k)}>
            {o}
          </OptionBtn>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <PunchRow total={2} done={right} />
        <span className="machine text-[13px] text-ink2">第 {i + 1}/2 题</span>
      </div>
      <div aria-live="polite">
        {mark === false && <Verdict ok={false}>再读一遍，看三要素里哪个没出现</Verdict>}
        {mark && <Verdict ok>{item.fix}</Verdict>}
      </div>
    </div>
  );
};

/* ---------- revealSelf：三张卡先回忆再揭示，如实打记得或忘了 ---------- */
const RS_CARDS: { word: string; mean: string }[] = [
  { word: 'reluctant', mean: '不情愿的' },
  { word: 'transformation', mean: '转变' },
  { word: 'scrutiny', mean: '仔细审查' },
];
const RevealSelf: KindComp = ({ onDone }) => {
  const [i, setI] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [rated, setRated] = useState<boolean[]>([false, false, false]);
  const card = RS_CARDS[i];
  const rate = (remember: boolean) => {
    const next = rated.map((v, j) => (j === i ? true : v));
    setRated(next);
    playSfx(remember ? 'correct' : 'wrong');
    if (next.every(Boolean)) {
      playSfx('complete');
      onDone();
      setI(3);
      return;
    }
    const n = i + 1;
    setI(n);
    setRevealed(false);
  };
  if (!card || i >= 3) return <Verdict ok>三张卡都过了，记得忘了都如实标了</Verdict>;
  return (
    <div className="space-y-3">
      <div className="under-leaf flex min-h-[72px] items-center justify-center p-4">
        {revealed ? (
          <div className="text-center">
            <p className="machine text-[22px] font-bold">{card.word}</p>
            <p className="mt-1 text-[15px]">{card.mean}</p>
            <div className="mt-1 flex justify-center">
              <SpeakButton text={card.word} size="sm" label="听发音" />
            </div>
          </div>
        ) : (
          <p className="text-[15px] text-ink2">卡面遮住了，先在心里说出词义和发音，说完了再揭示。</p>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {!revealed ? (
          <Btn variant="primary" onClick={() => { setRevealed(true); playSfx('reveal'); }}>
            揭示核对
          </Btn>
        ) : (
          <>
            <Btn onClick={() => rate(true)}>记得</Btn>
            <Btn onClick={() => rate(false)}>忘了</Btn>
          </>
        )}
        <PunchRow total={3} done={rated.filter(Boolean).length} />
        <span className="machine text-[13px] text-ink2">第 {i + 1}/3 张</span>
      </div>
    </div>
  );
};

/* ---------- recallTiming：点曲线甜点区并说得出理由 ---------- */
function RecallTimingSvg() {
  const w = 320;
  const pts: string[] = [];
  for (let t = 0; t <= 40; t++) {
    const x = t / 40;
    pts.push(`${10 + x * (w - 20)},${110 - 95 * Math.exp(-3.2 * x)}`);
  }
  return (
    <svg viewBox={`0 0 ${w} 130`} className="w-full" role="img" aria-label="遗忘曲线与三个复习时机区">
      <line x1="10" y1="110" x2={w - 10} y2="110" stroke="#111111" strokeWidth="1.5" />
      <line x1="10" y1="10" x2="10" y2="110" stroke="#111111" strokeWidth="1.5" />
      <polyline points={pts.join(' ')} fill="none" stroke="#2A4BD7" strokeWidth="2.5" />
      <text x={w - 12} y="125" textAnchor="end" fontSize="10" fill="#555555" className="machine">
        时间
      </text>
      <text x="14" y="20" fontSize="10" fill="#555555" className="machine">
        记住量
      </text>
    </svg>
  );
}
const RT_ZONES = [
  { id: 'early', name: '太早', why: '刚听完就复习，全程轻松，大脑没做提取' },
  { id: 'sweet', name: '甜点', why: '快忘还没忘，想起来要费点劲' },
  { id: 'late', name: '太晚', why: '已经忘光，要当新词重学' },
];
const RT_REASONS = [
  { text: '想起来要费点劲，这几秒正是提取在发生', ok: true },
  { text: '因为刚学完最轻松，不容易出错', ok: false },
];
const RecallTiming: KindComp = ({ onDone }) => {
  const [zone, setZone] = useState<string | null>(null);
  const [reason, setReason] = useState<number | null>(null);
  const done = zone === 'sweet' && reason !== null && RT_REASONS[reason].ok;
  const submit = () => {
    if (done) {
      playSfx('complete');
      onDone();
    } else playSfx('wrong');
  };
  return (
    <div className="space-y-3">
      <RecallTimingSvg />
      <div className="flex flex-wrap gap-2">
        {RT_ZONES.map((z) => (
          <button
            key={z.id}
            type="button"
            aria-pressed={zone === z.id}
            onClick={() => { setZone(z.id); setReason(null); playSfx('click'); }}
            className={`hinge machine min-h-[44px] border-2 px-3 text-[15px] font-bold ${
              zone === z.id ? 'border-ink bg-ink text-milk' : 'border-ink bg-leaf hover:bg-under'
            }`}
          >
            {z.name}区
          </button>
        ))}
      </div>
      <div aria-live="polite">
        {zone && !done && <p className="text-[14px] text-ink2">{RT_ZONES.find((z) => z.id === zone)?.why}。</p>}
        {zone === 'sweet' && (
          <div className="hinge">
            <p className="mb-1.5 text-[14px] font-bold">说出你选它的理由</p>
            <div className="flex flex-wrap gap-2">
              {RT_REASONS.map((r, i) => (
                <OptionBtn
                  key={r.text}
                  state={reason === null ? 'idle' : r.ok ? 'right' : 'wrong'}
                  onClick={() => setReason(i)}
                >
                  {r.text}
                </OptionBtn>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Btn variant="primary" disabled={reason === null} onClick={submit}>
          交
        </Btn>
        <span className="text-[13px] text-ink2">点中甜点区并说得出理由算过</span>
      </div>
      {done && <Verdict ok>正中甜点区，理由也站得住</Verdict>}
      {reason !== null && !RT_REASONS[reason].ok && <Verdict ok={false}>这条理由撑不住，轻松不等于练到</Verdict>}
    </div>
  );
};

/* ---------- loopTimer：三生词连跑拆、猜、核三拍 ---------- */
const LT_WORDS: { word: string; parts: string[]; guess: string; leap: string; options: string[]; ans: number }[] = [
  {
    word: 'contemplate',
    parts: ['con', 'tem', 'plate'],
    guess: '反复想、沉思',
    leap: '一块铁板（plate）被看住 → 反复琢磨',
    options: ['从「盘子」到「沉思」这一步', '从「con」到「一起」这一步', '没有跳跃，一一对应'],
    ans: 0,
  },
  {
    word: 'benevolent',
    parts: ['be', 'ne', 'vol', 'ent'],
    guess: '善意的、乐善好施的',
    leap: '希望别人好 → 善意',
    options: ['从「希望」到「善意」这一步', '从「be」到「是」这一步', '没有跳跃，一一对应'],
    ans: 0,
  },
  {
    word: 'resilient',
    parts: ['re', 'sil', 'ient'],
    guess: '有弹性的、能迅速恢复的',
    leap: '弹回去 → 恢复力',
    options: ['从「弹回」到「恢复」这一步', '从「re」到「再」这一步', '没有跳跃，一一对应'],
    ans: 0,
  },
];
const LT_BEATS = ['拆', '猜', '核'] as const;
const LoopTimer: KindComp = ({ onDone }) => {
  const [wi, setWi] = useState(0);
  const [beat, setBeat] = useState(0);
  const [guess, setGuess] = useState('');
  const [leapAns, setLeapAns] = useState<number | null>(null);
  const [mark, setMark] = useState<null | boolean>(null);
  const [done, setDone] = useState(false);
  if (done) return <Verdict ok>三个生词全部出货，语义跳跃都说得出</Verdict>;
  const w = LT_WORDS[wi];
  const advance = () => {
    if (beat < 2) {
      setBeat(beat + 1);
      playSfx('tick');
      return;
    }
    // 核拍：语义跳跃题必须答对才出货
    const ok = leapAns === w.ans;
    setMark(ok);
    if (!ok) {
      playSfx('wrong');
      return;
    }
    playSfx('correct');
    const nwi = wi + 1;
    if (nwi >= LT_WORDS.length) {
      setDone(true);
      playSfx('complete');
      onDone();
      return;
    }
    setWi(nwi);
    setBeat(0);
    setGuess('');
    setLeapAns(null);
    setMark(null);
  };
  const ready = beat < 2 || (guess.trim().length > 0 && leapAns !== null);
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <PunchRow total={3} done={wi} active={wi} />
        <Timer className="ml-auto" />
        <span className="machine text-[13px] text-ink2">
          第 {wi + 1}/3 词 · 拍 {LT_BEATS[beat]}
        </span>
      </div>
      <div className="under-leaf p-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="machine text-[19px] font-bold">{w.word}</span>
          <SpeakButton text={w.word} size="sm" label={`听 ${w.word}`} />
        </div>
        {beat === 0 && (
          <p className="mt-2 flex flex-wrap gap-1.5">
            {w.parts.map((p, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span aria-hidden className="text-ink2">·</span>}
                <span className="machine border-2 border-ink px-1.5 py-0.5 text-[15px]">{p}</span>
              </React.Fragment>
            ))}
          </p>
        )}
        {beat === 1 && (
          <div className="mt-2">
            <label htmlFor="lt-guess" className="mb-1 block text-[13px] text-ink2">
              先猜它是什么意思
            </label>
            <input
              id="lt-guess"
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="用中文写猜的意思"
              className="h-11 w-full border-2 border-ink bg-milk px-3 text-[15px] placeholder:text-ink2 focus:border-ink"
            />
          </div>
        )}
        {beat === 2 && (
          <div className="mt-2 space-y-2">
            <p className="text-[14px]">
              核词典，<span className="text-ink2">你猜的「{guess || '（空）'}」对上了吗</span>，真义是「{w.guess}」。
            </p>
            <p className="text-[14px] font-bold">语义跳跃在哪一步？</p>
            <div className="space-y-1.5">
              {w.options.map((o, i) => (
                <OptionBtn
                  key={o}
                  state={leapAns === null ? 'idle' : i === w.ans ? 'right' : leapAns === i ? 'wrong' : 'idle'}
                  onClick={() => setLeapAns(i)}
                >
                  {o}
                </OptionBtn>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Btn variant="primary" onClick={advance} disabled={!ready}>
          {beat < 2 ? `过「${LT_BEATS[beat]}」拍` : '核完出货'}
        </Btn>
        <span className="text-[13px] text-ink2">三拍都要走，核拍要答语义跳跃</span>
      </div>
      <div aria-live="polite">
        {mark === false && <Verdict ok={false}>没对上，说出词义是从哪一步跳过去的</Verdict>}
      </div>
    </div>
  );
};

export const routineKinds: Record<string, KindComp> = {
  diagnostic: Diagnostic,
  exitTicket: ExitTicket,
  choice: Choice,
  contextChoice: ContextChoice,
  fakeContext: FakeContext,
  associationFault: AssociationFault,
  revealSelf: RevealSelf,
  recallTiming: RecallTiming,
  loopTimer: LoopTimer,
};
