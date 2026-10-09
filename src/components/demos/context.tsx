import React, { useState } from 'react';
import { Check, X, Volume2 } from 'lucide-react';
import { DemoPanel, Btn, PunchRow, Verdict, Token } from './_shared';
import { SpeakButton } from '@/components/edu/Speak';

/* 课程 04 语境存入的教学演示（6 个 ref） */

/** 同一个句子读两遍，一遍逐词对照，一遍整句连读 */
const READ_SENT = [
  { w: 'The committee', g: '委员会', role: '主语块' },
  { w: 'made a final decision', g: '做出了最终决定', role: '谓语搭配块' },
  { w: 'yesterday.', g: '昨天', role: '时间块' },
];
function VisibleReadAloud() {
  const [mode, setMode] = useState<'word' | 'block'>('word');
  return (
    <DemoPanel label="朗读对照 · 两遍制">
      <div className="mb-3 flex gap-2">
        <Btn pressed={mode === 'word'} onClick={() => setMode('word')}>
          <Volume2 size={15} aria-hidden /> 逐词对照
        </Btn>
        <Btn pressed={mode === 'block'} onClick={() => setMode('block')}>
          <Volume2 size={15} aria-hidden /> 整句连读
        </Btn>
      </div>
      <div className="under-leaf p-4">
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          {READ_SENT.map((b) => (
            <span key={b.w} className="hinge">
              <span className="machine text-[16px]">{b.w}</span>
              {mode === 'word' && <span className="ml-1 text-[13px] text-ink2">（{b.g}）</span>}
            </span>
          ))}
        </div>
        <p className="mt-3 text-[14px] text-ink2">
          {mode === 'word' ? '逐词对照，词词有着落，但读得慢。' : '整块连读，按意群一口气读完，读完再回头看词。'}
        </p>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <SpeakButton text="The committee made a final decision yesterday." label="朗读整句" />
        <span className="text-[14px]">两遍都读，比谁先反应过来。</span>
      </div>
    </DemoPanel>
  );
}

/** 两个场景并排摆着，点句看义项怎么随场景切换 */
const PLANT_SCENES = [
  { kind: '工厂场景', sentence: 'The car plant employs two thousand workers.', sense: '工厂（名词）', chunk: 'car plant 汽车厂' },
  { kind: '种植场景', sentence: 'We plant tomatoes behind the kitchen every spring.', sense: '种植（动词）', chunk: 'plant tomatoes 种西红柿' },
];
function PlantTwoScenes() {
  const [open, setOpen] = useState(0);
  return (
    <DemoPanel label="一词两景 · plant">
      <div className="grid gap-3 sm:grid-cols-2">
        {PLANT_SCENES.map((s, i) => (
          <button
            key={s.kind}
            type="button"
            onClick={() => setOpen(i)}
            aria-pressed={open === i}
            className={`hinge border p-3 text-left ${
              open === i ? 'border-ink bg-leaf' : 'border-ink/30 bg-leaf hover:bg-under'
            }`}
          >
            <span className="machine mb-1 block text-[13px] text-ink2">{s.kind}</span>
            <span className="machine block text-[15px] leading-relaxed">{s.sentence}</span>
            <span className="mt-2 block text-[13px] text-ink2">
              {s.chunk}，句里读 {s.sense}
            </span>
          </button>
        ))}
      </div>
      <div className="hinge mt-3 flex flex-wrap items-center gap-2" aria-live="polite">
        <Token hue="#137574" className="machine text-[13px]">
          {PLANT_SCENES[open].sense}
        </Token>
        <span className="text-[14px]">义项随场景切换，把句和景一起存。</span>
        <SpeakButton text={PLANT_SCENES[open].sentence} size="sm" label="朗读该句" />
      </div>
    </DemoPanel>
  );
}

/** 句中三色圈块，搭配、修饰、介词各占一色，整块高亮后跟着读 */
const BLOCK_SENT = [
  { w: 'take', type: '搭配' as const },
  { w: 'a', type: '搭配' as const },
  { w: 'serious', type: '修饰' as const },
  { w: 'interest', type: '搭配' as const },
  { w: 'in', type: '介词' as const },
  { w: 'the', type: '介词' as const },
  { w: 'project.', type: '介词' as const },
];
const BLOCK_HUE: Record<string, string> = { 搭配: '#2A4BD7', 修饰: '#F2B700', 介词: '#137574' };
function ThreeColorBlocks() {
  const [mark, setMark] = useState<Record<string, boolean>>({ 搭配: false, 修饰: false, 介词: false });
  const all = Object.values(mark).every(Boolean);
  return (
    <DemoPanel label="三色圈块 · take responsibility">
      <div className="flex flex-wrap gap-1.5">
        {BLOCK_SENT.map((b, i) => {
          const on = mark[b.type];
          return (
            <span
              key={i}
              className="machine px-2 py-1.5 text-[16px]"
              style={{
                background: on ? BLOCK_HUE[b.type] : '#FFFFFF',
                color: on ? '#FFFFFF' : '#111111',
                border: `1px solid ${on ? BLOCK_HUE[b.type] : 'rgba(17,17,17,0.3)'}`,
              }}
            >
              {b.w}
            </span>
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {(['搭配', '修饰', '介词'] as const).map((t) => (
          <Btn key={t} pressed={mark[t]} onClick={() => setMark((m) => ({ ...m, [t]: !m[t] }))} ariaLabel={`切换${t}块上色`}>
            <span
              aria-hidden
              className="inline-block h-3 w-3 border border-ink/40"
              style={{ background: mark[t] ? BLOCK_HUE[t] : '#FFFFFF' }}
            />
            {t}
          </Btn>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-3">
        <SpeakButton text="take a serious interest in the project." label="整块跟读" />
        <span className="text-[14px] text-ink2">三块各上一色，整块高亮后跟着读。</span>
      </div>
      <div className="mt-2" aria-live="polite">
        {all && <Verdict ok>三块全部圈出，整块调用不现拼</Verdict>}
      </div>
    </DemoPanel>
  );
}

/** 三问各打一个勾才放行，缺一勾就退回重写 */
const GATE_QUESTIONS = [
  { q: '这句是完整的一句吗（有主语有动作）？', why: '碎片读着顺，但说不出口。' },
  { q: '句里用的是现成的搭配块吗？', why: '搭配整块出手，用不着句中现拼。' },
  { q: '这句话你自己真的会这样说吗？', why: '翻译腔句子存进场景也调不出来。' },
];
function SentenceBuilderGate() {
  const [checked, setChecked] = useState<boolean[]>([false, false, false]);
  const [verdict, setVerdict] = useState<null | boolean>(null);
  const all = checked.every(Boolean);
  return (
    <DemoPanel label="放行闸 · 三问">
      <div className="under-leaf p-3 text-[15px]">
        <span className="machine">make a serious face</span>
        <span className="ml-2 text-[13px] text-ink2">（示例句）</span>
      </div>
      <ul className="mt-3 space-y-2">
        {GATE_QUESTIONS.map((g, i) => (
          <li key={i}>
            <label className="flex min-h-[44px] cursor-pointer items-center gap-3 border border-ink/30 bg-leaf px-3 hover:bg-under">
              <input
                type="checkbox"
                checked={checked[i]}
                onChange={() => {
                  setChecked((c) => c.map((v, j) => (j === i ? !v : v)));
                  setVerdict(null);
                }}
                className="h-5 w-5 accent-[#111111]"
              />
              <span className="flex-1 text-[15px]">{g.q}</span>
              <span className="machine text-[13px] text-ink2">{i + 1}/3</span>
            </label>
            {checked[i] && <p className="hinge ml-6 mt-1 text-[13px] text-ink2">{g.why}</p>}
          </li>
        ))}
      </ul>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <Btn variant="primary" onClick={() => setVerdict(all)}>
          {all ? '放行' : `还差 ${checked.filter((v) => !v).length} 个勾`}
        </Btn>
        <span className="text-[14px] text-ink2">缺一勾就退回重写。</span>
      </div>
      <div className="mt-2" aria-live="polite">
        {verdict !== null && <Verdict ok={verdict}>{verdict ? '三勾齐全，放行' : '有一问没勾上，退回重写'}</Verdict>}
      </div>
    </DemoPanel>
  );
}

/** make up 落在故事、脸、损失三个场景里，点句看是哪个搭配把它按住 */
const MAKEUP = [
  { scene: '故事', sentence: 'She made up an excuse about the train.', chunk: 'make up an excuse 编借口', mark: 'made up' },
  { scene: '脸', sentence: 'He made up his face for the play.', chunk: 'make up one’s face 化妆', mark: 'made up' },
  { scene: '损失', sentence: 'We must make up for the lost time.', chunk: 'make up for 弥补', mark: 'make up for' },
];
function MakeUpThreeScenes() {
  const [i, setI] = useState(0);
  const m = MAKEUP[i];
  const at = m.sentence.indexOf(m.mark);
  return (
    <DemoPanel label="搭配按义 · make up">
      <div className="flex flex-wrap gap-2">
        {MAKEUP.map((x, idx) => (
          <Btn key={x.scene} pressed={i === idx} onClick={() => setI(idx)}>
            {x.scene}
          </Btn>
        ))}
      </div>
      <div className="under-leaf mt-3 p-4">
        <p className="machine text-[17px] leading-relaxed">
          {m.sentence.slice(0, at)}
          <span className=" bg-ink px-1 py-0.5 text-milk">{m.mark}</span>
          {m.sentence.slice(at + m.mark.length)}
        </p>
        <p className="mt-2 text-[14px] text-ink2">{m.chunk}</p>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <SpeakButton text={m.sentence} label="朗读该句" />
        <span className="text-[14px]">是 {m.chunk.split(' ')[0]} 这块把它按住的。</span>
      </div>
    </DemoPanel>
  );
}

/** 假语境与直译句摆在现场，点开看它病在哪，再对照改好的版本 */
const AUTOPSY = [
  {
    bad: 'I very like to study English words.',
    sick: '直译句',
    why: '按中文语序套英文，词进去了，句法没进去。',
    good: 'I really like studying English words.',
    fix: 'like 后接 -ing，副词 really 修饰动词。',
  },
  {
    bad: 'make decision（孤零零两个词）',
    sick: '空句',
    why: '搭配被拆开，缺了冠词 a，场景没进去。',
    good: 'make a decision after thinking it over.',
    fix: 'make a decision 是整块，冠词属于这块的一部分。',
  },
];
function FakeContextAutopsy() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <DemoPanel label="假语境验尸台">
      <ul className="space-y-3">
        {AUTOPSY.map((a, i) => (
          <li key={i} className="under-leaf p-3">
            <div className="flex items-center gap-2">
              <X size={16} className="shrink-0 text-errata" strokeWidth={3} aria-hidden />
              <span className="machine text-[15px] text-errata">{a.bad}</span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <Btn onClick={() => setOpen(open === i ? null : i)} pressed={open === i}>
                {open === i ? '收起诊断' : '看它病在哪'}
              </Btn>
              <SpeakButton text={a.good} size="sm" label="朗读改好的版本" />
            </div>
            {open === i && (
              <div className="hinge mt-2 space-y-1.5 border border-rule bg-leaf p-3 text-[14px]">
                <p>
                  <span className="machine border border-errata px-1.5 py-0.5 text-[13px] text-errata">
                    {a.sick}
                  </span>{' '}
                  <span className="ml-1">{a.why}</span>
                </p>
                <p className="flex items-start gap-2">
                  <Check size={16} className="mt-1 shrink-0 text-ink" strokeWidth={3} aria-hidden />
                  <span className="machine text-[15px]">{a.good}</span>
                </p>
                <p className="text-ink2">{a.fix}</p>
              </div>
            )}
          </li>
        ))}
      </ul>
      <div className="mt-3 flex items-center gap-3">
        <PunchRow total={2} done={open === null ? 0 : 1} />
        <span className="text-[14px] text-ink2">先看现场，再对照改好的版本。</span>
      </div>
    </DemoPanel>
  );
}

export const contextDemos: Record<string, React.FC> = {
  'visible-read-aloud': VisibleReadAloud,
  'plant-two-scenes': PlantTwoScenes,
  'three-color-blocks': ThreeColorBlocks,
  'sentence-builder-gate': SentenceBuilderGate,
  'make-up-three-scenes': MakeUpThreeScenes,
  'fake-context-autopsy': FakeContextAutopsy,
};
