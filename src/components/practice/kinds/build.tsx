import React, { useState } from 'react';
import type { KindComp } from './types';
import { Btn, PunchRow, Verdict, Token } from '@/components/demos/_shared';
import { SpeakButton } from '@/components/edu/Speak';
import { playSfx } from '@/hooks/useSfx';

/* 课程 03/04/07 组装与建造族练习体（7 个 kind） */

/* ---------- affixAssemble：6 个前缀投进语义家族，全对线通 ---------- */
const AFFIX_FAMILIES = [
  { id: 'neg', name: '否定反向' },
  { id: 'again', name: '再与重' },
  { id: 'across', name: '跨越转变' },
  { id: 'under', name: '在下从属' },
  { id: 'before', name: '在前预先' },
  { id: 'out', name: '向外出去' },
];
const AFFIX_CELLS: { text: string; fam: string; hint: string }[] = [
  { text: 'un-', fam: 'neg', hint: '不、未，如 unhappy' },
  { text: 're-', fam: 'again', hint: '再来一次，如 rewrite' },
  { text: 'trans-', fam: 'across', hint: '跨过去，如 transport' },
  { text: 'sub-', fam: 'under', hint: '在下面，如 subway' },
  { text: 'pre-', fam: 'before', hint: '在前面，如 preview' },
  { text: 'ex-', fam: 'out', hint: '往外去，如 export' },
];
const AffixAssemble: KindComp = ({ onDone }) => {
  const [sel, setSel] = useState<string | null>(null);
  const [placed, setPlaced] = useState<Record<string, string>>({});
  const [mark, setMark] = useState<null | boolean>(null);
  const remain = AFFIX_CELLS.filter((c) => !(c.text in placed));
  const drop = (fam: string) => {
    if (!sel) return;
    const cell = AFFIX_CELLS.find((c) => c.text === sel);
    if (!cell) return;
    const ok = cell.fam === fam;
    setMark(ok);
    if (!ok) {
      playSfx('wrong');
      setSel(null);
      return;
    }
    playSfx('correct');
    setPlaced((p) => ({ ...p, [cell.text]: fam }));
    setSel(null);
    if (Object.keys(placed).length + 1 >= AFFIX_CELLS.length) {
      playSfx('complete');
      onDone();
    }
  };
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="machine text-[13px] text-ink2">待投料</span>
        {remain.length === 0 && <span className="text-[13px] text-ink2">六件全部入位</span>}
        {remain.map((c) => (
          <button
            key={c.text}
            type="button"
            aria-pressed={sel === c.text}
            onClick={() => setSel(sel === c.text ? null : c.text)}
            title={c.hint}
            className={`hinge machine min-h-[44px] border px-3 text-[15px] font-bold ${
              sel === c.text ? 'border-ink bg-ink text-milk' : 'border-ink/40 bg-leaf hover:bg-under'
            }`}
          >
            {c.text}
          </button>
        ))}
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {AFFIX_FAMILIES.map((f) => {
          const mine = AFFIX_CELLS.filter((c) => placed[c.text] === f.id);
          return (
            <div key={f.id} className="under-leaf p-2.5">
              <div className="mb-1.5 flex items-center gap-2">
                <span className="machine text-[14px] font-bold">{f.name}</span>
                <span className="machine text-[12px] text-ink2">{mine.length}/1</span>
              </div>
              <div className="flex min-h-[44px] flex-wrap items-center gap-1.5 border border-dashed border-ink/30 px-2">
                {mine.length === 0 && <span className="text-[12px] text-ink2">先点上方前缀，再点这块板</span>}
                {mine.map((c) => (
                  <Token key={c.text} className="machine text-[15px]">
                    {c.text}
                  </Token>
                ))}
              </div>
              <Btn className="mt-1.5 w-full" onClick={() => drop(f.id)} disabled={!sel}>
                投进这块
              </Btn>
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex items-center gap-3">
        <PunchRow total={6} done={Object.keys(placed).length} />
        <span className="machine text-[13px] text-ink2">{Object.keys(placed).length}/6</span>
      </div>
      <div className="mt-2" aria-live="polite">
        {mark === false && <Verdict ok={false}>投错家族了，按语义重新想一遍</Verdict>}
        {Object.keys(placed).length >= 6 && <Verdict ok>六件全部入位，这条送料线通了</Verdict>}
      </div>
    </div>
  );
};

/* ---------- wordFamilyTree：种下 spect，长五个同根词枝 ---------- */
const WF_BRANCHES = [
  { word: 'inspect', mean: '往里看 → 检查' },
  { word: 'respect', mean: '回头看 → 尊重' },
  { word: 'expect', mean: '向外看 → 期待' },
  { word: 'prospect', mean: '往前看 → 前景' },
  { word: 'spectator', mean: '看的人 → 观众' },
];
const WordFamilyTree: KindComp = ({ onDone }) => {
  const [grown, setGrown] = useState(0);
  const grow = () => {
    const next = grown + 1;
    setGrown(next);
    playSfx('click');
    if (next >= WF_BRANCHES.length) {
      playSfx('complete');
      onDone();
    }
  };
  return (
    <div>
      <div className="flex justify-center">
        <Token hue="#2A4BD7" className="machine text-[15px] font-bold">
          spect 看
        </Token>
      </div>
      <ul className="mt-2 space-y-1.5">
        {WF_BRANCHES.map((b, i) => (
          <li
            key={b.word}
            className={`hinge flex items-center gap-3 border px-3 py-1.5 ${
              i < grown ? 'border-ink/40 bg-leaf' : 'border-rule'
            }`}
            style={{ marginLeft: `${Math.min(i, 3) * 8}px`, minHeight: 44 }}
          >
            <span aria-hidden className="machine text-ink2">
              └
            </span>
            <span className="machine text-[15px] font-bold">{b.word}</span>
            <span className="ml-auto flex items-center gap-2">
              <span className="text-[14px]">{i < grown ? b.mean : '▓▓▓'}</span>
              {i < grown && <SpeakButton text={b.word} size="sm" />}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <Btn variant="primary" onClick={grow} disabled={grown >= WF_BRANCHES.length}>
          种下一枝
        </Btn>
        <PunchRow total={5} done={grown} />
        <span className="machine text-[13px] text-ink2">{grown}/5 枝</span>
      </div>
      <div className="mt-2" aria-live="polite">
        {grown >= 5 && <Verdict ok>五枝全长齐，每枝词义都说得出</Verdict>}
      </div>
    </div>
  );
};

/* ---------- sentenceBlocks：三类块分别上色并整块跟读 ---------- */
const SB_SENT = [
  { w: 'take', type: '搭配' },
  { w: 'a', type: '搭配' },
  { w: 'serious', type: '修饰' },
  { w: 'interest', type: '搭配' },
  { w: 'in', type: '介词' },
  { w: 'the', type: '介词' },
  { w: 'project.', type: '介词' },
] as { w: string; type: '搭配' | '修饰' | '介词' }[];
const SB_HUE: Record<string, string> = { 搭配: '#2A4BD7', 修饰: '#F2B700', 介词: '#137574' };
const SB_TYPES = ['搭配', '修饰', '介词'] as const;
const SentenceBlocks: KindComp = ({ onDone }) => {
  const [brush, setBrush] = useState<(typeof SB_TYPES)[number]>('搭配');
  const [colors, setColors] = useState<Record<number, string>>({});
  const [mark, setMark] = useState<null | boolean>(null);
  const paint = (i: number) => setColors((c) => ({ ...c, [i]: brush }));
  const check = () => {
    const ok = SB_SENT.every((t, i) => colors[i] === t.type);
    setMark(ok);
    if (ok) {
      playSfx('complete');
      onDone();
    } else playSfx('wrong');
  };
  const all = Object.keys(colors).length === SB_SENT.length;
  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-2">
        {SB_TYPES.map((t) => (
          <Btn
            key={t}
            pressed={brush === t}
            onClick={() => setBrush(t)}
            ariaLabel={`选${t}色笔`}
          >
            <span
              aria-hidden
              className="inline-block h-3 w-3 border border-ink/40"
              style={{ background: brush === t ? SB_HUE[t] : '#FFFFFF' }}
            />
            {t}
          </Btn>
        ))}
      </div>
      <div className="under-leaf flex flex-wrap gap-1.5 p-3">
        {SB_SENT.map((t, i) => {
          const c = colors[i];
          return (
            <button
              key={i}
              type="button"
              onClick={() => paint(i)}
              aria-label={`${t.w}，${c ? `已涂${c}` : '未上色'}`}
              className="hinge machine px-2 py-1.5 text-[16px]"
              style={{
                background: c ? SB_HUE[c] : '#FFFFFF',
                color: c ? '#FFFFFF' : '#111111',
                border: `1px solid ${c ? SB_HUE[c] : 'rgba(17,17,17,0.3)'}`,
              }}
            >
              {t.w}
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <Btn variant="primary" onClick={check} disabled={!all}>
          核对三块
        </Btn>
        <Btn onClick={() => { setColors({}); setMark(null); }}>重涂</Btn>
        <SpeakButton text="take a serious interest in the project." size="sm" label="整块跟读" />
      </div>
      <div className="mt-2" aria-live="polite">
        {mark === false && <Verdict ok={false}>有一块圈错了，看出句里谁跟谁是一伙的</Verdict>}
        {mark && <Verdict ok>三块全圈对，整块调用不现拼</Verdict>}
      </div>
    </div>
  );
};

/* ---------- sentenceBuilder：造句过规则再过三问，安全句打回 ---------- */
const SBG_QUESTIONS = [
  '这句是完整的一句（有主语有动作）吗？',
  '句里用的是现成的搭配块吗？',
  '这句话你自己真的会这样说吗？',
];
const SentenceBuilder: KindComp = ({ practice, onDone }) => {
  const target = /(?:visible|plant)/i.exec(practice.prompt)?.[0];
  const needTarget = Boolean(target);
  const [text, setText] = useState('');
  const [checks, setChecks] = useState<boolean[]>([false, false, false]);
  const [verdict, setVerdict] = useState<null | 'blocked' | 'pass'>(null);
  const words = text.trim().split(/\s+/).filter(Boolean);
  const longEnough = words.length >= 4;
  const hasTarget = !needTarget || (target ? new RegExp(`\\b${target}\\b`, 'i').test(text) : true);
  const allChecks = checks.every(Boolean);
  const submit = () => {
    if (!longEnough || !hasTarget) {
      setVerdict('blocked');
      playSfx('wrong');
      return;
    }
    if (!allChecks) {
      setVerdict('blocked');
      playSfx('wrong');
      return;
    }
    setVerdict('pass');
    playSfx('complete');
    onDone();
  };
  return (
    <div>
      <label htmlFor="sb-input" className="mb-1 block text-[14px] text-ink2">
        {target ? `用 ${target} 造一个至少 4 个词的句子` : '写一个至少 4 个词的句子'}
      </label>
      <textarea
        id="sb-input"
        rows={2}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setVerdict(null);
        }}
        placeholder="Write your sentence here."
        className="w-full border border-ink/40 bg-leaf px-3 py-2 text-[15px] placeholder:text-ink2 focus:border-ink"
      />
      <div className="mt-2 flex flex-wrap gap-2">
        <span className={`machine border px-2 py-1 text-[13px] ${longEnough ? 'border-ink bg-ink text-milk' : 'border-ink/30 text-ink2'}`}>
          词数 {words.length}/4
        </span>
        {needTarget && (
          <span className={`machine border px-2 py-1 text-[13px] ${hasTarget ? 'border-ink bg-ink text-milk' : 'border-ink/30 text-ink2'}`}>
            含 {target} {hasTarget ? '是' : '否'}
          </span>
        )}
      </div>
      <p className="mb-1.5 mt-3 text-[14px] font-bold">三问自检</p>
      <ul className="space-y-1.5">
        {SBG_QUESTIONS.map((q, i) => (
          <li key={i}>
            <label className="flex min-h-[44px] cursor-pointer items-center gap-3 border border-ink/30 bg-leaf px-3 hover:bg-under">
              <input
                type="checkbox"
                checked={checks[i]}
                onChange={() => {
                  setChecks((c) => c.map((v, j) => (j === i ? !v : v)));
                  setVerdict(null);
                }}
                className="h-5 w-5 accent-[#111111]"
              />
              <span className="flex-1 text-[14px]">{q}</span>
            </label>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <Btn variant="primary" onClick={submit}>
          过线提交
        </Btn>
        <span className="text-[13px] text-ink2">安全句会被打回重写</span>
      </div>
      <div className="mt-2" aria-live="polite">
        {verdict === 'blocked' && (
          <Verdict ok={false}>
            {!longEnough ? '不足 4 个词，打回' : !hasTarget ? `句子里没有 ${target}，打回` : '三问没全勾，退回重写'}
          </Verdict>
        )}
        {verdict === 'pass' && <Verdict ok>规则和三问都过了，这句收下</Verdict>}
      </div>
    </div>
  );
};

/* ---------- collocationFill：L1 听音拼词再 L2 补搭配 ---------- */
const CF_WORDS = ['transformation', 'ambulance', 'reluctant'];
const CF_COLLOCS: { head: string; tail: string; ans: string; hint: string }[] = [
  { head: 'make a', tail: 'decision', ans: 'final', hint: '做出一个……的决定' },
  { head: 'take a serious', tail: 'in the project', ans: 'interest', hint: '对项目产生……' },
];
const CollocationFill: KindComp = ({ onDone }) => {
  const [dict, setDict] = useState<string[]>(['', '', '']);
  const [fills, setFills] = useState<string[]>(['', '']);
  const [stage, setStage] = useState<0 | 1>(0);
  const [m1, setM1] = useState<null | boolean>(null);
  const [m2, setM2] = useState<null | boolean>(null);
  const l1ok = dict.every((v, i) => v.trim().toLowerCase() === CF_WORDS[i]);
  const step1 = () => {
    setM1(l1ok);
    if (!l1ok) {
      playSfx('wrong');
      return;
    }
    playSfx('correct');
    setStage(1);
  };
  const l2ok = fills.every((v, i) => v.trim().toLowerCase() === CF_COLLOCS[i].ans);
  const step2 = () => {
    setM2(l2ok);
    if (!l2ok) {
      playSfx('wrong');
      return;
    }
    playSfx('complete');
    onDone();
  };
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        {['L1 听音拼词', 'L2 补搭配'].map((l, i) => (
          <span
            key={l}
            className={`machine border px-2.5 py-1.5 text-[13px] ${
              i === stage ? 'border-ink bg-ink text-milk' : 'border-rule text-ink2'
            }`}
          >
            {l}
          </span>
        ))}
      </div>
      {stage === 0 ? (
        <ul className="space-y-2">
          {CF_WORDS.map((w, i) => (
            <li key={i} className="flex items-center gap-2">
              <span className="machine w-6 text-[13px] text-ink2">{i + 1}</span>
              <SpeakButton text={w} size="sm" label={`播第 ${i + 1} 词`} />
              <input
                type="text"
                value={dict[i]}
                onChange={(e) => setDict((v) => v.map((x, j) => (j === i ? e.target.value : x)))}
                aria-label={`听写词 ${i + 1}`}
                className="machine h-11 w-48 border border-ink/40 bg-leaf px-3 text-[15px] focus:border-ink"
              />
              {m1 !== null && (
                <span className={l1ok ? 'text-ink' : 'text-errata'}>{dict[i].trim().toLowerCase() === w ? '✓' : '✗'}</span>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <ul className="space-y-3">
          {CF_COLLOCS.map((c, i) => (
            <li key={i} className="under-leaf p-3">
              <p className="machine text-[15px]">
                {c.head}{' '}
                <input
                  type="text"
                  value={fills[i]}
                  onChange={(e) => setFills((v) => v.map((x, j) => (j === i ? e.target.value : x)))}
                  aria-label={`搭配缺词 ${i + 1}`}
                  className="machine h-9 w-36 border border-ink/40 bg-milk px-2 text-[15px] focus:border-ink"
                />{' '}
                {c.tail}
              </p>
              <p className="mt-1 text-[13px] text-ink2">{c.hint}</p>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-3 flex items-center gap-3">
        <Btn variant="primary" onClick={stage === 0 ? step1 : step2}>
          {stage === 0 ? '核 L1' : '核 L2'}
        </Btn>
        <PunchRow total={2} done={stage} />
        <span className="machine text-[13px] text-ink2">L1、L2 全对才放行</span>
      </div>
      <div className="mt-2" aria-live="polite">
        {stage === 0 && m1 === false && <Verdict ok={false}>L1 有错，回听音再拼一次</Verdict>}
        {stage === 1 && m2 === false && <Verdict ok={false}>L2 有错，看搭配整体再补一次</Verdict>}
        {m2 && <Verdict ok>两级全对，放行</Verdict>}
      </div>
    </div>
  );
};

/* ---------- retellScaffold：开头句起头写满 3 句，目标词落进一句 ---------- */
const RS_OPENING = 'The village changed a lot after the mine closed.';
const RS_TARGET = 'transformation';
const RetellScaffold: KindComp = ({ onDone }) => {
  const [lines, setLines] = useState(['', '', '']);
  const filled = lines.every((l) => l.trim().split(/\s+/).filter(Boolean).length >= 3);
  const hasTarget = lines.some((l) => l.toLowerCase().includes(RS_TARGET));
  const pass = filled && hasTarget;
  const check = () => {
    if (!pass) {
      playSfx('wrong');
      return;
    }
    playSfx('complete');
    onDone();
  };
  return (
    <div>
      <div className="under-leaf mb-3 p-3">
        <span className="machine text-[15px]">{RS_OPENING}</span>
        <p className="mt-1 text-[13px] text-ink2">开头句，接着写满三句，至少一句含 {RS_TARGET}。</p>
      </div>
      <ol className="space-y-2">
        {lines.map((l, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="machine w-5 shrink-0 text-[13px] text-ink2">{i + 1}</span>
            <input
              type="text"
              value={l}
              onChange={(e) => setLines((ls) => ls.map((v, j) => (j === i ? e.target.value : v)))}
              aria-label={`复述第 ${i + 1} 句`}
              placeholder={i === 1 ? `含 ${RS_TARGET} 的那句` : '接着写'}
              className="h-11 w-full border border-ink/40 bg-leaf px-3 text-[15px] placeholder:text-ink2 focus:border-ink"
            />
          </li>
        ))}
      </ol>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <PunchRow total={3} done={lines.filter((l) => l.trim()).length} />
        <span className="machine text-[13px] text-ink2">目标词 {hasTarget ? '已落句中' : '还没出现'}</span>
        <Btn variant="primary" className="ml-auto" onClick={check}>
          交复述
        </Btn>
      </div>
      <div className="mt-2" aria-live="polite">
        {lines.some((l) => l.trim()) && !pass && (
          <Verdict ok={false}>{filled ? '三句写满了，还差目标词落进其中一句' : '每句至少 3 个词，写满三句'}</Verdict>
        )}
        {pass && <Verdict ok>三句写满，目标词在句中，收工</Verdict>}
      </div>
    </div>
  );
};

/* ---------- construct：三个新词各排 1/3/7/14/30 时刻表并写清日期 ---------- */
const CON_SLOTS = [1, 3, 7, 14, 30];
const CON_WORDS = ['reluctant', 'articulate', 'scrutiny'];
const Construct: KindComp = ({ onDone }) => {
  const [slots, setSlots] = useState<(number | null)[]>([null, null, null]);
  const [dates, setDates] = useState<string[]>(['', '', '']);
  const all = slots.every((s) => s !== null) && dates.every((d) => d.trim().length > 0);
  const submit = () => {
    if (!all) {
      playSfx('wrong');
      return;
    }
    playSfx('complete');
    onDone();
  };
  return (
    <div>
      <ul className="space-y-3">
        {CON_WORDS.map((w, i) => (
          <li key={w} className="under-leaf p-3">
            <div className="mb-2 flex items-center gap-2">
              <span className="machine text-[16px] font-bold">{w}</span>
              <SpeakButton text={w} size="sm" />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {CON_SLOTS.map((d) => (
                <button
                  key={d}
                  type="button"
                  aria-pressed={slots[i] === d}
                  onClick={() => setSlots((s) => s.map((v, j) => (j === i ? d : v)))}
                  className={`hinge machine min-h-[44px] border px-2.5 text-[14px] ${
                    slots[i] === d ? 'border-ink bg-ink text-milk' : 'border-ink/30 bg-leaf hover:bg-under'
                  }`}
                >
                  {d} 天
                </button>
              ))}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <label htmlFor={`con-date-${i}`} className="text-[13px] text-ink2">
                首次复习日期
              </label>
              <input
                id={`con-date-${i}`}
                type="date"
                value={dates[i]}
                onChange={(e) => setDates((d) => d.map((v, j) => (j === i ? e.target.value : v)))}
                className="machine h-11 border border-ink/40 bg-leaf px-2 text-[14px] focus:border-ink"
              />
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <Btn variant="primary" onClick={submit} disabled={!all}>
          三张表一起交
        </Btn>
        <span className="machine text-[13px] text-ink2">
          {slots.filter((s) => s !== null).length}/3 档 · {dates.filter((d) => d.trim()).length}/3 日期
        </span>
      </div>
      <div className="mt-2" aria-live="polite">
        {!all && slots.some((s) => s !== null) && <Verdict ok={false}>每张表都要选档并写清日期</Verdict>}
        {all && <Verdict ok>三张时刻表排好，照着执行就行</Verdict>}
      </div>
    </div>
  );
};

export const buildKinds: Record<string, KindComp> = {
  affixAssemble: AffixAssemble,
  wordFamilyTree: WordFamilyTree,
  sentenceBlocks: SentenceBlocks,
  sentenceBuilder: SentenceBuilder,
  collocationFill: CollocationFill,
  retellScaffold: RetellScaffold,
  construct: Construct,
};
