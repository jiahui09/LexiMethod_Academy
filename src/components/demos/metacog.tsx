import React, { useState } from 'react';
import { Bar, DemoPanel, Btn, OptionBtn, PunchRow, Verdict, Token } from './_shared';
import { metacogChecklist, strategyTuning } from '@/data/tools';

/* 课程 08 元认知的教学演示（6 个 ref） */

/** 报告卡逐维点亮，哪条裂缝一眼可见 */
const DIMS = [
  { k: '听觉', score: 40, cracks: ['θ 与 s 混', 'v 与 w 混'] },
  { k: '对应', score: 55, cracks: ['-tion 读音记错'] },
  { k: '拆词', score: 80, cracks: [] },
  { k: '调用', score: 65, cracks: ['搭配会背不会用'] },
];
function DiagnosticReveal() {
  const [open, setOpen] = useState(0);
  return (
    <DemoPanel label="报告卡 · 四维">
      <div className="mb-3 flex items-center gap-2">
        <PunchRow total={4} done={1} active={0} />
        <span className="machine text-[13px] text-ink2">本单元 40 题</span>
      </div>
      <ul className="space-y-1.5">
        {DIMS.map((d, i) => (
          <li key={d.k}>
            <button
              type="button"
              onClick={() => setOpen(i)}
              aria-expanded={open === i}
              className={`hinge flex min-h-[44px] w-full items-center gap-3 rounded-[3px] border px-3 text-left ${
                open === i ? 'border-ink bg-leaf' : 'border-ink/30 bg-leaf hover:bg-under'
              }`}
            >
              <span className="machine w-8 text-[14px] font-bold">{d.k}</span>
              <span className="h-3 flex-1 rounded-[2px] border border-ink/30 bg-milk">
                <span
                  className="block h-full rounded-[2px]"
                  style={{ width: `${d.score}%`, background: d.score < 60 ? '#E34234' : '#137574' }}
                />
              </span>
              <span className="machine w-10 text-right text-[14px]">{d.score}</span>
            </button>
            {open === i && (
              <p className="hinge ml-6 mt-1 text-[14px] text-ink2">
                {d.cracks.length ? `裂缝：${d.cracks.join('、')}` : '这一维没有裂缝，先放着。'}
              </p>
            )}
          </li>
        ))}
      </ul>
      <div className="mt-3 border-t border-rule pt-3">
        <Bar label="最低维（先修）" value={40} max={100} suffix=" 分" hue="#E34234" />
        <p className="mt-2 text-[14px] font-bold">听觉维最低，先修听觉再补对应。</p>
      </div>
    </DemoPanel>
  );
}

/** 四段自查表逐项打勾，勾不满就留下一轮的记号 */
const CHECK_SECTIONS = ['识别', '计划', '监控', '复盘'] as const;
function ChecklistFill() {
  const [n, setN] = useState(0);
  const items = metacogChecklist.slice(0, 8);
  const total = items.length;
  return (
    <DemoPanel label="自查表 · 四段八项">
      <div className="mb-3 flex items-center gap-3">
        <PunchRow total={total} done={n} active={n < total ? n : undefined} />
        <span className="machine text-[13px] text-ink2">{n}/{total} 勾</span>
      </div>
      <ul className="space-y-1.5">
        {items.map((it, i) => (
          <li key={it.id}>
            <label className="flex min-h-[44px] cursor-pointer items-center gap-3 rounded-[3px] border border-ink/30 bg-leaf px-3 hover:bg-under">
              <input
                type="checkbox"
                checked={i < n}
                onChange={() => setN((c) => (i < c ? c : c + 1))}
                className="h-5 w-5 accent-[#17140E]"
                aria-label={it.label}
              />
              <span className="flex-1 text-[14px]">{it.label}</span>
              <span className="machine text-[13px] text-ink2">
                {(CHECK_SECTIONS as readonly string[]).includes(it.group) ? it.group : '识别'}
              </span>
            </label>
          </li>
        ))}
      </ul>
      <div className="mt-3 border-t border-rule pt-3">
        <Bar label="本环勾满" value={n} max={total} suffix={`/${total}`} />
      </div>
      <div className="mt-2" aria-live="polite">
        {n === total ? <Verdict ok>八项勾满，这一环放行</Verdict> : <p className="text-[14px] text-ink2">没勾满的项就是下一轮的记号。</p>}
      </div>
    </DemoPanel>
  );
}

/** 学生的卡壳信号对上诊断，再对上解法 */
function SignalMatch() {
  const [si, setSi] = useState(0);
  const row = strategyTuning[si];
  const [open, setOpen] = useState(false);
  return (
    <DemoPanel label="信号与诊断 · 对上号">
      <ul className="space-y-2">
        {strategyTuning.map((r, i) => (
          <li key={r.signal}>
            <button
              type="button"
              onClick={() => {
                setSi(i);
                setOpen(true);
              }}
              aria-expanded={si === i && open}
              className={`hinge flex min-h-[44px] w-full items-center gap-3 rounded-[3px] border px-3 text-left text-[14px] ${
                si === i && open ? 'border-ink bg-leaf' : 'border-ink/30 bg-leaf hover:bg-under'
              }`}
            >
              <span aria-hidden className={`punch ${si === i && open ? 'punch-done' : ''}`} />
              <span className="font-bold">{r.signal}</span>
            </button>
            {si === i && open && (
              <div className="hinge ml-6 mt-1 space-y-1 rounded-[3px] border border-rule p-3 text-[14px]">
                <p>
                  <span className="machine text-[13px] text-ink2">诊断</span> {r.diagnosis}
                </p>
                <p>
                  <span className="machine text-[13px] text-ink2">修法</span> {r.fix}
                </p>
              </div>
            )}
          </li>
        ))}
      </ul>
      <div className="mt-3 flex items-center gap-3 border-t border-rule pt-3">
        <Token hue="#F2B700" className="machine text-[13px]">
          {row.signal}
        </Token>
        <span className="text-[14px] text-ink2">先认信号，再对诊断，修法才有落点。</span>
      </div>
    </DemoPanel>
  );
}

/** 错题先归类：知识缺口、粗心、时间不足，各占多少条（与 08 课诊断题同源） */
const ERRORS = [
  { q: '听 think 写 sink', cls: '知识缺口' },
  { q: 'transportation 拆成 trans·por·ta·tion 但重音放错', cls: '知识缺口' },
  { q: '交卷前只剩 2 分钟，最后一题蒙了答案', cls: '时间不足' },
  { q: 'record 读音按名词词性套在动词句里', cls: '知识缺口' },
  { q: 'writ 写成 writr', cls: '粗心' },
];
const CLASSES = ['知识缺口', '粗心', '时间不足'];
const CLS_HUE: Record<string, string> = { 知识缺口: '#2A4BD7', 粗心: '#F2B700', 时间不足: '#137574' };
function ErrorClassify() {
  const [pick, setPick] = useState<Record<number, string>>({});
  const done = Object.keys(pick).length === ERRORS.length;
  const right = ERRORS.filter((e, i) => pick[i] === e.cls).length;
  return (
    <DemoPanel label="错因归类 · 5 题">
      <ul className="space-y-3">
        {ERRORS.map((e, i) => (
          <li key={i} className="under-leaf rounded-[3px] p-3">
            <p className="machine text-[15px]">{e.q}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {CLASSES.map((c) => (
                <OptionBtn
                  key={c}
                  className="w-auto"
                  state={pick[i] === undefined ? 'idle' : pick[i] === e.cls && c === e.cls ? 'right' : pick[i] === c && c !== e.cls ? 'wrong' : 'idle'}
                  onClick={() => setPick((p) => ({ ...p, [i]: c }))}
                >
                  {c}
                </OptionBtn>
              ))}
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex flex-wrap gap-2 border-t border-rule pt-3">
        {CLASSES.map((c) => {
          const n = Object.entries(pick).filter(([, v]) => v === c).length;
          return (
            <span key={c} className="machine rounded-[3px] border border-rule px-2 py-1 text-[13px]">
              <span aria-hidden className="mr-1 inline-block h-2 w-2 rounded-[2px]" style={{ background: CLS_HUE[c] }} />
              {c} {n}
            </span>
          );
        })}
      </div>
      <div className="mt-3" aria-live="polite">
        {done && <Verdict ok={right === ERRORS.length}>{'5 题全部归位，落到哪类就改哪一处'}</Verdict>}
      </div>
    </DemoPanel>
  );
}

/** 复盘表四栏，一次学习拆开填，交表时点总数 */
const DEBRIEF_ROWS = [
  { q: '这次卡在哪一格？', a: '音节划分，trans 和 por 的切口拿不准' },
  { q: '卡住的直接原因是什么？', a: '数元音核心时漏了 a，少算一个' },
  { q: '下一轮先动哪里？', a: '先数核心再下刀，抄三个词练' },
  { q: '今天的时间怎么分配？', a: '拆词 10 分钟，听写 5 分钟' },
];
function DebriefForm() {
  const [filled, setFilled] = useState<boolean[]>([false, false, false, false]);
  const all = filled.every(Boolean);
  return (
    <DemoPanel label="复盘表 · 四栏">
      <ul className="space-y-2">
        {DEBRIEF_ROWS.map((r, i) => (
          <li key={i}>
            <button
              type="button"
              onClick={() => setFilled((f) => f.map((v, j) => (j === i ? !v : v)))}
              aria-pressed={filled[i]}
              className={`hinge flex min-h-[44px] w-full items-center gap-3 rounded-[3px] border px-3 text-left ${
                filled[i] ? 'border-ink bg-leaf' : 'border-ink/30 bg-leaf hover:bg-under'
              }`}
            >
              <span aria-hidden className={`punch ${filled[i] ? 'punch-done' : ''}`} />
              <span className="flex-1">
                <span className="block text-[14px] font-bold">{r.q}</span>
                <span className="block text-[14px] text-ink2">{r.a}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex items-center gap-3 border-t border-rule pt-3">
        <PunchRow total={4} done={filled.filter(Boolean).length} />
        <span className="machine text-[13px] text-ink2">交表时点总数 {filled.filter(Boolean).length}/4</span>
        <Btn variant="primary" onClick={() => setFilled([true, true, true, true])} className="ml-auto" disabled={all}>
          交表
        </Btn>
      </div>
      <div className="mt-2" aria-live="polite">
        {all && <Verdict ok>四栏交齐，最后一栏就是明天的计划</Verdict>}
      </div>
    </DemoPanel>
  );
}

/** 学完自测三题，成绩只用来分流，不记分不排名 */
const EXIT_QUESTIONS = [
  { q: 'transformation 的音节数是？', choices: ['3', '4', '5'], a: 2 },
  { q: '-tion 在这里读？', choices: ['/tʃən/', '/ʃn/', '/ʃən/'], a: 1 },
  { q: '重音落在哪一节？', choices: ['trans', 'for', 'ma'], a: 1 },
];
function ExitTicket() {
  const [ans, setAns] = useState<(number | null)[]>([null, null, null]);
  const answered = ans.filter((a) => a !== null).length;
  const right = EXIT_QUESTIONS.filter((q, i) => ans[i] === q.a).length;
  const [turned, setTurned] = useState(false);
  return (
    <DemoPanel label="出口条 · 三题分流">
      <div className="mb-3 flex items-center gap-3">
        <PunchRow total={3} done={answered} active={answered < 3 ? answered : undefined} />
        <span className="machine text-[13px] text-ink2">{answered}/3</span>
      </div>
      <ol className="space-y-3">
        {EXIT_QUESTIONS.map((q, i) => (
          <li key={i}>
            <p className="mb-1.5 text-[15px] font-bold">
              {i + 1}. {q.q}
            </p>
            <div className="flex flex-wrap gap-2">
              {q.choices.map((c, ci) => (
                <OptionBtn
                  key={c}
                  className="w-auto"
                  state={
                    turned ? (ci === q.a ? 'right' : ans[i] === ci ? 'wrong' : 'idle') : ans[i] === ci ? 'selected' : 'idle'
                  }
                  onClick={() => setAns((a) => a.map((v, j) => (j === i ? ci : v)))}
                >
                  <span className="machine">{c}</span>
                </OptionBtn>
              ))}
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <Btn variant="primary" onClick={() => setTurned(true)} disabled={answered < 3}>
          交条分流
        </Btn>
        <Btn onClick={() => { setAns([null, null, null]); setTurned(false); }} disabled={answered === 0 && !turned}>
          重答
        </Btn>
      </div>
      <div className="mt-3" aria-live="polite">
        {turned && (
          <Verdict ok={right === 3}>
            {right === 3 ? '三题全对，进下一段' : `对 ${right}/3，错题对应裂缝先补再往前走`}
          </Verdict>
        )}
      </div>
      {turned && (
        <div className="hinge mt-2 flex gap-2">
          <Token hue={right === 3 ? '#357A1E' : '#E34234'} className="machine text-[13px]">
            {right === 3 ? '分流：进下一段' : '分流：回补裂缝'}
          </Token>
          <span className="text-[13px] text-ink2">成绩只用来分流，不记分不排名。</span>
        </div>
      )}
    </DemoPanel>
  );
}

export const metacogDemos: Record<string, React.FC> = {
  'diagnostic-reveal': DiagnosticReveal,
  'checklist-fill': ChecklistFill,
  'signal-match': SignalMatch,
  'error-classify': ErrorClassify,
  'debrief-form': DebriefForm,
  'exit-ticket': ExitTicket,
};
