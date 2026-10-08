import React, { useState } from 'react';
import { DemoPanel, Btn, OptionBtn, PunchRow, Verdict, Timer, Token } from './_shared';
import { SpeakButton } from '@/components/edu/Speak';
import { prefixes, suffixes, roots } from '@/data/affixes';

/* 课程 03 词根词缀的教学演示（6 个 ref） */

/** 流水线总览：三条送料线供件，组装后过质检再出货 */
const LINES = [
  { id: 'A', name: '前缀', part: 'contra-', role: '定方向：相反、对着', hue: '#F2B700' },
  { id: 'B', name: '词根', part: 'dict', role: '定核心：说', hue: '#2A4BD7' },
  { id: 'C', name: '后缀', part: '-ion', role: '定词性：名词', hue: '#137574' },
];
const STAGES = ['供件', '组装', '质检', '出货'];
function PipelineOverview() {
  const [step, setStep] = useState(0);
  return (
    <DemoPanel label="流水线 · contradiction">
      <ul className="space-y-2">
        {LINES.map((l) => (
          <li key={l.id} className="flex items-center gap-3">
            <span className="machine w-16 shrink-0 text-[13px] text-ink2">送料线 {l.id}</span>
            <Token hue={step >= 1 ? l.hue : undefined} className="machine text-[15px] font-bold">
              {l.part}
            </Token>
            <span className="text-[14px] text-ink2">{l.role}</span>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-rule pt-3">
        {STAGES.map((s, i) => (
          <React.Fragment key={s}>
            <span
              className={`machine rounded-[3px] border px-2.5 py-1.5 text-[13px] ${
                step > i ? 'border-ink bg-ink text-milk' : step === i ? 'border-ink bg-leaf font-bold' : 'border-rule text-ink2'
              }`}
            >
              {s}
            </span>
            {i < STAGES.length - 1 && (
              <span aria-hidden className={`text-ink2 ${step > i ? '' : 'opacity-40'}`}>
                →
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-3">
        <PunchRow total={4} done={step} active={step < 4 ? step : undefined} />
        <Btn variant="primary" onClick={() => setStep((s) => Math.min(4, s + 1))} disabled={step === 4}>
          {step === 4 ? '已出货' : '流下一格'}
        </Btn>
      </div>
      <div className="hinge mt-3" aria-live="polite">
        {step === 4 && (
          <p className="text-[15px] font-bold">
            <span className="machine">contradiction</span>（自相矛盾）= 反着说，组装完必须回词典对答案。
          </p>
        )}
      </div>
    </DemoPanel>
  );
}

/** 前缀家族板：24 个高频前缀按语义分 6 组上墙 */
const PREFIX_FAMILIES = [
  { name: '否定反向', texts: ['un-', 'dis-', 'in-', 'im-', 'non-'] },
  { name: '再与重', texts: ['re-', 'over-', 'de-', 'en-'] },
  { name: '位置方向', texts: ['sub-', 'inter-', 'trans-', 'pre-', 'pro-', 'ex-'] },
  { name: '程度数量', texts: ['mono-', 'multi-', 'semi-', 'under-', 'up-'] },
  { name: '时间关系', texts: ['pre-', 'post-', 'anti-', 'para-'] },
  { name: '方式状态', texts: ['mis-', 'ab-', 'ad-', 'be-'] },
];
function PrefixFamilyBoard() {
  const [gi, setGi] = useState(0);
  const g = PREFIX_FAMILIES[gi];
  const meanings = prefixes.filter((p) => g.texts.includes(p.text));
  return (
    <DemoPanel label="前缀家族板 · 24 高频">
      <div className="flex flex-wrap gap-2">
        {PREFIX_FAMILIES.map((f, i) => (
          <Btn key={f.name} pressed={i === gi} onClick={() => setGi(i)}>
            {f.name}
          </Btn>
        ))}
      </div>
      <ul className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
        {g.texts.map((t) => {
          const m = meanings.find((p) => p.text === t);
          return (
            <li key={t} className="under-leaf flex items-center gap-3 rounded-[3px] px-3 py-2">
              <span className="machine w-16 shrink-0 text-[15px] font-bold">{t}</span>
              <span className="text-[14px]">{m?.meaning ?? '同族'}</span>
              {m?.examples?.[0] && <span className="machine ml-auto text-[13px] text-ink2">{m.examples[0]}</span>}
            </li>
          );
        })}
      </ul>
      <p className="mt-3 border-t border-rule pt-2 text-[14px]">一组一个语义方向，看到新词先问它像哪一组。</p>
    </DemoPanel>
  );
}

/** spect 家族树，从「看」这一根长出五根枝 */
const SPECT = [
  { word: 'inspect', affix: 'in-', mean: '往里看 → 检查' },
  { word: 'respect', affix: 're-', mean: '回头看 → 尊重' },
  { word: 'expect', affix: 'ex-', mean: '向外看 → 期待' },
  { word: 'prospect', affix: 'pro-', mean: '往前看 → 前景' },
  { word: 'spectator', affix: '-or', mean: '看的人 → 观众' },
];
function WordFamilySpect() {
  const [grown, setGrown] = useState(2);
  return (
    <DemoPanel label="词族树 · spect">
      <div className="flex justify-center">
        <Token hue="#2A4BD7" className="machine text-[16px] font-bold">
          spect 看
        </Token>
      </div>
      <ul className="mt-2 space-y-1.5">
        {SPECT.map((b, i) => (
          <li
            key={b.word}
            className={`hinge flex items-center gap-3 rounded-[3px] border px-3 ${
              i < grown ? 'border-ink/40 bg-leaf' : 'border-rule opacity-50'
            }`}
            style={{ minHeight: 44, marginLeft: `${Math.min(i, 3) * 10}px` }}
          >
            <span aria-hidden className="machine text-ink2">
              └
            </span>
            <span className="machine text-[15px] font-bold">{b.word}</span>
            <span className="machine text-[13px] text-ink2">{b.affix}</span>
            <span className="ml-auto text-[14px]">{i < grown ? b.mean : '（长出后可见）'}</span>
            <SpeakButton text={b.word} size="sm" />
          </li>
        ))}
      </ul>
      <div className="mt-3 flex items-center gap-3">
        <PunchRow total={5} done={grown} />
        <Btn variant="primary" onClick={() => setGrown((g) => Math.min(5, g + 1))} disabled={grown === 5}>
          {grown === 5 ? '五枝齐全' : '长一枝'}
        </Btn>
      </div>
      {grown === 5 && <p className="hinge mt-3 text-[14px] font-bold">一根五枝，新词先问它属不属于这棵树。</p>}
    </DemoPanel>
  );
}

/** port 家族树，前缀换方向，搬运这层意思不动 */
const PORT = [
  { word: 'import', affix: 'im-', mean: '搬进来 → 进口', dir: '→' },
  { word: 'export', affix: 'ex-', mean: '搬出去 → 出口', dir: '→' },
  { word: 'transport', affix: 'trans-', mean: '跨越搬运 → 运输', dir: '⇢' },
  { word: 'report', affix: 're-', mean: '搬回来 → 汇报', dir: '←' },
  { word: 'portable', affix: '-able', mean: '能搬的 → 便携', dir: '→' },
];
function WordFamilyPort() {
  const [open, setOpen] = useState(0);
  const r = roots.find((x) => x.text === 'port');
  return (
    <DemoPanel label="词族树 · port">
      <p className="mb-3 text-center text-[14px] text-ink2">词根本身是「{r?.meaning}」，前缀只换方向。</p>
      <ul className="space-y-1.5">
        {PORT.map((b, i) => (
          <li key={b.word}>
            <button
              type="button"
              onClick={() => setOpen(i)}
              aria-expanded={open === i}
              className={`hinge flex min-h-[44px] w-full items-center gap-3 rounded-[3px] border px-3 text-left ${
                open === i ? 'border-ink bg-leaf' : 'border-ink/30 bg-leaf hover:bg-under'
              }`}
            >
              <span aria-hidden className="machine w-6 text-center font-bold">
                {b.dir}
              </span>
              <span className="machine rounded-[3px] border border-ink/30 px-1.5 text-[14px]">{b.affix}</span>
              <span className="machine text-[15px] font-bold">port</span>
              <span className="ml-auto flex items-center gap-2">
                <span className="text-[14px]">{b.mean}</span>
                <SpeakButton text={b.word} size="sm" />
              </span>
            </button>
            {open === i && (
              <p className="hinge ml-6 mt-1 text-[14px] text-ink2">
                {b.affix} 换了方向，「{r?.meaning}」这层意思没动，词义照样猜得出来。
              </p>
            )}
          </li>
        ))}
      </ul>
    </DemoPanel>
  );
}

/** 后缀标签台：词性三选一，先看尾巴再看句子位置 */
const SUFFIX_QUIZ = [
  { word: 'construction', tail: '-tion', ans: '名词', hint: '句子位置：the construction 在主语位' },
  { word: 'quickly', tail: '-ly', ans: '副词', hint: '句子位置：修饰动词 speaks' },
  { word: 'careful', tail: '-ful', ans: '形容词', hint: '句子位置：修饰名词 attention' },
  { word: 'realize', tail: '-ize', ans: '动词', hint: '句子位置：情态动词后 must realize' },
];
const POS = ['名词', '动词', '形容词'];
function SuffixPosTags() {
  const [qi, setQi] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const q = SUFFIX_QUIZ[qi];
  const sfx = suffixes.find((s) => s.text === q.tail);
  const right = picked === q.ans;
  const next = () => {
    setQi((i) => (i + 1) % SUFFIX_QUIZ.length);
    setPicked(null);
  };
  return (
    <DemoPanel label="后缀标签台 · 词性三选一">
      <div className="under-leaf mb-3 flex items-center gap-3 rounded-[3px] p-3">
        <span className="machine text-[20px] font-bold">{q.word}</span>
        <Token className="machine text-[14px]">{q.tail}</Token>
        <span className="ml-auto flex items-center gap-2 text-[13px] text-ink2">
          {sfx?.meaning}
          <SpeakButton text={q.word} size="sm" />
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {POS.map((p) => (
          <OptionBtn
            key={p}
            className="w-auto"
            state={picked === null ? 'idle' : p === q.ans ? 'right' : p === picked ? 'wrong' : 'idle'}
            onClick={() => setPicked(p)}
          >
            {p}
          </OptionBtn>
        ))}
      </div>
      <div className="mt-3 space-y-2" aria-live="polite">
        {picked && (
          <>
            <Verdict ok={right}>{right ? `先看尾巴，${q.tail} → ${q.ans}` : `再看句子位置，${q.hint}`}</Verdict>
            <Btn variant={right ? 'primary' : 'ghost'} onClick={next}>
              换一个词
            </Btn>
          </>
        )}
      </div>
    </DemoPanel>
  );
}

/** 三个陌生词连跑三拍，计时看拆、猜、核的节奏 */
const LOOP_WORDS = ['contemplate', 'benevolent', 'resilient'];
const BEATS = ['拆', '猜', '核'];
function LoopTimerThreeWords() {
  const [wi, setWi] = useState(0);
  const [beats, setBeats] = useState(0);
  const total = wi * 3 + beats;
  const done = total >= 9;
  const step = () => {
    if (beats < 3) setBeats((b) => b + 1);
    if (beats === 2) {
      setBeats(0);
      setWi((w) => Math.min(3, w + 1));
    }
  };
  return (
    <DemoPanel label="闭环计时 · 三词三拍">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <PunchRow total={9} done={total} active={total < 9 ? total : undefined} />
        <Timer />
      </div>
      <div className="under-leaf rounded-[3px] p-4 text-center">
        <p className="machine text-[22px] font-bold">{done ? '三词跑完' : LOOP_WORDS[Math.min(wi, 2)]}</p>
        <div className="mt-3 flex justify-center gap-2">
          {BEATS.map((b, i) => (
            <span
              key={b}
              className={`machine rounded-[3px] border px-3 py-1.5 text-[14px] ${
                i < beats ? 'border-ink bg-ink text-milk' : i === beats && !done ? 'border-ink bg-leaf font-bold' : 'border-rule text-ink2'
              }`}
            >
              {b}
            </span>
          ))}
        </div>
        <p className="mt-3 text-[14px] text-ink2">
          {done ? '拆、猜、核各算一拍，节奏匀速就对了。' : `第 ${Math.min(wi + 1, 3)} 词，拍 ${beats + 1}。先拆块，再猜义，最后核词典。`}
        </p>
      </div>
      <div className="mt-3 flex justify-end">
        <Btn variant="primary" onClick={step} disabled={done}>
          {done ? '全部核完' : `过「${BEATS[beats]}」拍`}
        </Btn>
      </div>
      {done && <p className="hinge mt-3 text-[14px] font-bold">三拍节奏就是闭环，卡在哪拍回哪个单元。</p>}
    </DemoPanel>
  );
}

export const rootsDemos: Record<string, React.FC> = {
  'pipeline-overview': PipelineOverview,
  'prefix-family-board': PrefixFamilyBoard,
  'word-family-spect': WordFamilySpect,
  'word-family-port': WordFamilyPort,
  'suffix-pos-tags': SuffixPosTags,
  'loop-timer-three-words': LoopTimerThreeWords,
};
