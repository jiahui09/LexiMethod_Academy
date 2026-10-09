import React, { useState } from 'react';
import { Bar, DemoPanel, Btn, PunchRow, Verdict, Token } from './_shared';
import { SpeakButton } from '@/components/edu/Speak';

/* 课程 07 主动输出的教学演示（6 个 ref） */

/** 你认识的词只有一小部分能在说话写作时被当场用出来 */
const PASSIVE = [
  { w: 'recognize', read: true, use: true },
  { w: 'substantial', read: true, use: false },
  { w: 'delicate', read: true, use: false },
  { w: 'make a decision', read: true, use: true },
  { w: 'reluctant', read: true, use: false },
  { w: 'take over', read: true, use: true },
  { w: 'compensate', read: true, use: false },
  { w: 'give up', read: true, use: true },
];
function PassiveActiveRatio() {
  const [mode, setMode] = useState<'read' | 'use'>('read');
  const useCount = PASSIVE.filter((p) => p.use).length;
  return (
    <DemoPanel label="认出与用出 · 8 个样本">
      <div className="mb-3 flex gap-2">
        <Btn pressed={mode === 'read'} onClick={() => setMode('read')}>
          认得出
        </Btn>
        <Btn pressed={mode === 'use'} onClick={() => setMode('use')}>
          当场用得出
        </Btn>
      </div>
      <div className="flex flex-wrap gap-2">
        {PASSIVE.map((p) => {
          const show = mode === 'read' || p.use;
          return (
            <Token key={p.w} hue={mode === 'use' && p.use ? '#357A1E' : undefined} className="machine text-[15px]">
              {show ? p.w : '▓▓▓'}
            </Token>
          );
        })}
      </div>
      <div className="mt-4 space-y-2 border-t border-rule pt-3">
        <Bar label="认得出" value={8} max={8} suffix=" 个" />
        <Bar label="用得出" value={useCount} max={8} suffix=" 个" hue="#357A1E" />
      </div>
      <p className="mt-3 text-[14px]">说话写作时调不出来的词，还不算学会。</p>
    </DemoPanel>
  );
}

/** 自己产出的句子比读过的例句记得牢，写错了当场就能看见 */
function GenerationEffect() {
  const [track, setTrack] = useState<'read' | 'make' | null>(null);
  return (
    <DemoPanel label="产出 vs 读过 · transformation">
      <div className="mb-3 flex flex-wrap gap-2">
        <Btn
          pressed={track === 'read'}
          onClick={() => setTrack('read')}
        >
          读一遍例句
        </Btn>
        <Btn pressed={track === 'make'} onClick={() => setTrack('make')}>
          自己造一句
        </Btn>
      </div>
      <div className="under-leaf p-4">
        <p className="machine text-[16px] leading-relaxed">
          The transformation of the industry took twenty years.
        </p>
        <div className="hinge mt-3" aria-live="polite">
          {track === 'read' && <p className="text-[14px] text-ink2">读着顺，但这是别人的句子，你的大脑只做了识别。</p>}
          {track === 'make' && (
            <div className="space-y-2 text-[14px]">
              <p>写出你自己的句子，写完当场就看得到问题。</p>
              <p className="text-errata">
                样例错处，transformation 后面接 of 不接 to，冠词和介词就是被当场抓出来的。
              </p>
            </div>
          )}
          {track === null && <p className="text-[14px] text-ink2">先选一条路，比较两条路的差别。</p>}
        </div>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <SpeakButton text="The transformation of the industry took twenty years." label="朗读例句" />
        <span className="text-[14px] text-ink2">自己产出的句子记得牢，写错了当场能看见。</span>
      </div>
    </DemoPanel>
  );
}

/** 听音落笔，音到形的输出当场暴露拼写漏洞 */
function FunnelL1Dictation() {
  const [val, setVal] = useState('');
  const [checked, setChecked] = useState(false);
  const ok = val.trim().toLowerCase() === 'weather';
  return (
    <DemoPanel label="漏斗 L1 · 听写">
      <div className="mb-3 flex items-center gap-2">
        {['L1 听写', 'L2 搭配', 'L3 造句', 'L4 复述'].map((l, i) => (
          <React.Fragment key={l}>
            <span
              className={`machine border px-2 py-1.5 text-[13px] ${
                i === 0 ? 'border-ink bg-ink text-milk' : i === 1 ? 'border-ink bg-leaf font-bold' : 'border-rule text-ink2'
              }`}
            >
              {l}
            </span>
            {i < 3 && (
              <span aria-hidden className="text-ink2">
                ›
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <SpeakButton text="weather" label="播听写词" />
        <span className="text-[14px] text-ink2">听音落笔，按音节拼，不从字母表硬凑。</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <input
          type="text"
          value={val}
          onChange={(e) => {
            setVal(e.target.value);
            setChecked(false);
          }}
          aria-label="听写输入框"
          placeholder="听到什么写什么"
          className="machine h-11 min-w-[180px] border border-ink/40 bg-leaf px-3 text-[16px] placeholder:text-ink2 focus:border-ink"
        />
        <Btn variant="primary" onClick={() => setChecked(true)} disabled={!val.trim()}>
          判分
        </Btn>
      </div>
      <div className="mt-3" aria-live="polite">
        {checked && (
          <Verdict ok={ok}>{ok ? '拼对了，音到形这级通了' : '正确拼写是 weather，th 在这里读浊音 /ð/，按音节回推'}</Verdict>
        )}
      </div>
      <p className="mt-3 border-t border-rule pt-2 text-[14px] text-ink2">音到形的输出当场暴露拼写漏洞。</p>
    </DemoPanel>
  );
}

/** 少于 4 个词或不含目标词的句子提交不了，安全句被当场拦下 */
function SentenceGate() {
  const [text, setText] = useState('');
  const [verdict, setVerdict] = useState<null | 'pass' | 'block'>(null);
  const words = text.trim().split(/\s+/).filter(Boolean);
  const hasTarget = /\btransformation\b/i.test(text);
  const longEnough = words.length >= 4;
  const canSubmit = longEnough && hasTarget;
  return (
    <DemoPanel label="造句闸 · transformation">
      <label htmlFor="gate-input" className="mb-1 block text-[14px] text-ink2">
        用 transformation 造一个至少 4 个词的句子
      </label>
      <textarea
        id="gate-input"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setVerdict(null);
        }}
        rows={2}
        placeholder="Write your sentence here."
        className="w-full border border-ink/40 bg-leaf px-3 py-2 text-[15px] placeholder:text-ink2 focus:border-ink"
      />
      <div className="mt-2 flex flex-wrap gap-2">
        <span className={`machine border px-2 py-1 text-[13px] ${longEnough ? 'border-ink bg-ink text-milk' : 'border-ink/30 text-ink2'}`}>
          词数 {words.length}/{4}
        </span>
        <span className={`machine border px-2 py-1 text-[13px] ${hasTarget ? 'border-ink bg-ink text-milk' : 'border-ink/30 text-ink2'}`}>
          含目标词 {hasTarget ? '是' : '否'}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <Btn
          variant="primary"
          disabled={!canSubmit}
          onClick={() => setVerdict('pass')}
          title={canSubmit ? undefined : '安全句提交不了'}
        >
          提交
        </Btn>
        <Btn onClick={() => setVerdict('block')}>硬提交试试</Btn>
      </div>
      <div className="mt-3" aria-live="polite">
        {verdict === 'block' && (
          <Verdict ok={false}>
            {longEnough ? '句子里没有 transformation，打回' : '少于 4 个词，安全句被当场拦下'}
          </Verdict>
        )}
        {verdict === 'pass' && <Verdict ok>过线，这句收下</Verdict>}
      </div>
    </DemoPanel>
  );
}

/** 开头句给你，剩下三句自己写，目标词必须落进其中一句 */
function RetellScaffold() {
  const [lines, setLines] = useState(['', '', '']);
  const target = 'transformation';
  const filled = lines.every((l) => l.trim().split(/\s+/).filter(Boolean).length > 0);
  const hasTarget = lines.some((l) => l.toLowerCase().includes(target));
  const done = filled && hasTarget;
  return (
    <DemoPanel label="三句话复述 · 开头已给">
      <div className="under-leaf mb-3 p-3">
        <span className="machine text-[15px]">The village changed a lot after the mine closed.</span>
        <p className="mt-1 text-[13px] text-ink2">开头句，接着写三句。</p>
      </div>
      <ol className="space-y-2">
        {lines.map((l, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="machine w-6 shrink-0 text-[13px] text-ink2">{i + 1}</span>
            <input
              type="text"
              value={l}
              onChange={(e) => setLines((ls) => ls.map((v, j) => (j === i ? e.target.value : v)))}
              aria-label={`复述第 ${i + 1} 句`}
              placeholder={i === 1 ? `含 ${target} 的那句写在这里` : '接着写'}
              className="h-11 w-full border border-ink/40 bg-leaf px-3 text-[15px] placeholder:text-ink2 focus:border-ink"
            />
          </li>
        ))}
      </ol>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <PunchRow total={3} done={lines.filter((l) => l.trim()).length} />
        <span className="machine text-[13px] text-ink2">目标词 {hasTarget ? '已落句中' : '还没出现'}</span>
      </div>
      <div className="mt-2" aria-live="polite">
        {lines.some((l) => l.trim()) && (
          <Verdict ok={done}>{done ? '三句写满，目标词在句中，收工' : filled ? '写满了，还差目标词落进其中一句' : '接着写满三句'}</Verdict>
        )}
      </div>
    </DemoPanel>
  );
}

/** 输出量按次数计不按时长计，亲手写一句就是一次提取 */
const DAILY = [
  { item: '默读词汇表 40 分钟', count: 0, ok: false },
  { item: '抄写单词三遍', count: 0, ok: false },
  { item: '口头造句', count: 4, ok: true },
  { item: '一分钟复述', count: 2, ok: true },
  { item: '听写核对', count: 3, ok: true },
];
function DailyOutputRatio() {
  const [show, setShow] = useState(false);
  const total = DAILY.reduce((s, d) => s + d.count, 0);
  return (
    <DemoPanel label="日输出计次 · 15 分钟配比">
      <Btn variant="primary" pressed={show} onClick={() => setShow((s) => !s)} className="mb-3">
        {show ? '收起计数' : '按次数清点'}
      </Btn>
      <ul className="space-y-1.5">
        {DAILY.map((d) => (
          <li key={d.item} className="under-leaf flex items-center gap-3 px-3 py-2">
            <span className="flex-1 text-[15px]">{d.item}</span>
            <span className="machine text-[13px] text-ink2">{d.ok ? '算输出' : '只算输入'}</span>
            <span className={`machine w-10 text-right text-[15px] ${d.ok ? 'font-bold' : 'text-ink2'}`}>
              {show ? `${d.count} 次` : '—'}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-3 border-t border-rule pt-3">
        <Bar label="今日输出量" value={show ? total : 0} max={10} suffix=" 次" hue="#357A1E" />
      </div>
      <p className="mt-2 text-[14px]">读和抄记时长不记次，亲手写一句才算一次提取。</p>
    </DemoPanel>
  );
}

export const outputDemos: Record<string, React.FC> = {
  'passive-active-ratio': PassiveActiveRatio,
  'generation-effect': GenerationEffect,
  'funnel-l1-dictation': FunnelL1Dictation,
  'sentence-gate': SentenceGate,
  'retell-scaffold': RetellScaffold,
  'daily-output-ratio': DailyOutputRatio,
};
