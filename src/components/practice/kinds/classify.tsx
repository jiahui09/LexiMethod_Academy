import React, { useState } from 'react';
import type { KindComp } from './types';
import { Btn, OptionBtn, PunchRow, Verdict } from '@/components/demos/_shared';
import { playSfx } from '@/hooks/useSfx';

/* 课程 08 归类诊断族练习体（5 个 kind） */

/* ---------- morphemeJudge：划出的块判真词素还是假词素 ---------- */
const MJ_ITEMS: { block: string; word: string; real: boolean; why: string }[] = [
  { block: '-tion', word: 'construction', real: true, why: '成批出现，能换词根，读音稳定为 /ʃn/' },
  { block: 'fing', word: 'feeling', real: false, why: '只是切错位置，拿不到别的词里去' },
  { block: 're-', word: 'rewrite', real: true, why: '能换词根，语义「再」始终带着' },
  { block: 'blu', word: 'blue', real: false, why: '词里凑巧的字母，没构词能力' },
  { block: '-able', word: 'portable', real: true, why: '能换词根，稳定表「能……的」' },
  { block: 'cond', word: 'condition', real: false, why: '切口不齐，不是能单拿的构词单位' },
];
const MorphemeJudge: KindComp = ({ onDone }) => {
  const [verdicts, setVerdicts] = useState<Record<number, boolean>>({});
  const [mark, setMark] = useState<null | boolean>(null);
  const all = Object.keys(verdicts).length === MJ_ITEMS.length;
  const rightCount = MJ_ITEMS.filter((it, i) => verdicts[i] === it.real).length;
  const check = () => {
    const ok = rightCount === MJ_ITEMS.length;
    setMark(ok);
    if (ok) {
      playSfx('complete');
      onDone();
    } else playSfx('wrong');
  };
  return (
    <div>
      <ul className="space-y-2">
        {MJ_ITEMS.map((it, i) => {
          const v = verdicts[i];
          return (
            <li key={i} className="under-leaf rounded-[3px] p-3">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="machine rounded-[3px] border-2 border-ink px-1.5 py-0.5 text-[15px] font-bold">{it.block}</span>
                <span className="machine text-[13px] text-ink2">在 {it.word} 里</span>
                <span aria-hidden className={`punch ml-auto ${v === undefined ? '' : v === it.real ? 'punch-done' : ''}`} />
              </div>
              <div className="flex flex-wrap gap-2">
                <OptionBtn state={v === undefined ? 'idle' : v === it.real ? 'right' : 'wrong'} onClick={() => setVerdicts((s) => ({ ...s, [i]: it.real }))}>
                  真词素
                </OptionBtn>
                <OptionBtn state={v === undefined ? 'idle' : v !== it.real ? 'right' : 'wrong'} onClick={() => setVerdicts((s) => ({ ...s, [i]: !it.real }))}>
                  假词素
                </OptionBtn>
              </div>
              {v !== undefined && v !== it.real && <p className="hinge mt-1.5 text-[13px] text-errata">{it.why}</p>}
            </li>
          );
        })}
      </ul>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <Btn variant="primary" onClick={check} disabled={!all}>
          过质检
        </Btn>
        <PunchRow total={6} done={Object.keys(verdicts).length} />
        <span className="machine text-[13px] text-ink2">{rightCount}/{MJ_ITEMS.length} 判对</span>
      </div>
      <div className="mt-2" aria-live="polite">
        {mark === false && <Verdict ok={false}>有判错的，看它能不能换词根、读音稳不稳</Verdict>}
        {mark && <Verdict ok>六块全部判对，质检通过</Verdict>}
      </div>
    </div>
  );
};

/* ---------- errorClassify：真实错题归进三分类 ---------- */
const EC_CLASSES = ['知识缺口', '粗心', '时间不足'] as const;
const EC_ITEMS: { q: string; cls: (typeof EC_CLASSES)[number] }[] = [
  { q: 'think 写成 sink', cls: '知识缺口' },
  { q: 'very 写成 wery', cls: '知识缺口' },
  { q: '-tion 写成 -chon', cls: '知识缺口' },
  { q: 'transporation 漏写 t', cls: '粗心' },
  { q: 'reluctant 写成 reluctent', cls: '粗心' },
  { q: 'decision 写成 decition', cls: '知识缺口' },
  { q: 'write 的 e 忘了', cls: '粗心' },
  { q: '抄行时掉了一个字母', cls: '粗心' },
  { q: '交卷前只剩 2 分钟，最后一题蒙了答案', cls: '时间不足' },
];
const ErrorClassify: KindComp = ({ onDone }) => {
  const [pick, setPick] = useState<Record<number, string>>({});
  const [mark, setMark] = useState<null | boolean>(null);
  const all = Object.keys(pick).length === EC_ITEMS.length;
  const rightCount = EC_ITEMS.filter((it, i) => pick[i] === it.cls).length;
  const check = () => {
    const ok = rightCount === EC_ITEMS.length;
    setMark(ok);
    if (ok) {
      playSfx('complete');
      onDone();
    } else playSfx('wrong');
  };
  return (
    <div>
      <ul className="space-y-2">
        {EC_ITEMS.map((it, i) => (
          <li key={i} className="under-leaf rounded-[3px] p-2.5">
            <p className="machine mb-1.5 text-[14px]">
              <span className="mr-2 text-ink2">{i + 1}</span>
              {it.q}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {EC_CLASSES.map((c) => (
                <OptionBtn
                  key={c}
                  className="w-auto"
                  state={pick[i] === undefined ? 'idle' : pick[i] === c && c === it.cls ? 'right' : pick[i] === c ? 'wrong' : 'idle'}
                  onClick={() => setPick((p) => ({ ...p, [i]: c }))}
                >
                  {c}
                </OptionBtn>
              ))}
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <Btn variant="primary" onClick={check} disabled={!all}>
          交归类
        </Btn>
        <PunchRow total={9} done={Object.keys(pick).length} />
        <span className="machine text-[13px] text-ink2">{rightCount}/9 对</span>
      </div>
      <div className="mt-2" aria-live="polite">
        {mark === false && <Verdict ok={false}>至少一题归错，回知识缺口、粗心、时间不足三处各想一遍</Verdict>}
        {mark && <Verdict ok>九题全对，说出理由才算过</Verdict>}
      </div>
    </div>
  );
};

/* ---------- signalMatch：6 条信号连唯一动作 ---------- */
const SM_PAIRS: { signal: string; action: string }[] = [
  { signal: '听不出 θ 和 s', action: '回齿间与齿龈的口型对比' },
  { signal: '音标会认但拼不出', action: '做音到形的听写漏斗' },
  { signal: '单词会背但句中调不出', action: '把词放回两个场景的句子里' },
  { signal: '重音总是点错', action: '回去背名前动后那条规则' },
  { signal: '复习时全认识，考时想不起', action: '把重看改成合上书先回忆' },
  { signal: '造的句子自己都觉得别扭', action: '对照真句查搭配，整块替换' },
];
const SignalMatch: KindComp = ({ onDone }) => {
  const [sel, setSel] = useState<number | null>(null);
  const [done, setDone] = useState<number[]>([]);
  const [mark, setMark] = useState<null | boolean>(null);
  const hit = (i: number) => {
    if (sel === null) return;
    const ok = sel === i;
    setMark(ok);
    if (!ok) {
      playSfx('wrong');
      setSel(null);
      return;
    }
    playSfx('correct');
    const next = [...done, i];
    setDone(next);
    setSel(null);
    setMark(null);
    if (next.length >= SM_PAIRS.length) {
      playSfx('complete');
      onDone();
    }
  };
  const remainActions = SM_PAIRS.map((_, i) => i).filter((i) => !done.includes(i));
  return (
    <div>
      <ul className="mb-3 space-y-1.5">
        {SM_PAIRS.map((p, i) => (
          <li
            key={p.signal}
            className={`flex items-center gap-3 rounded-[3px] border px-3 py-2 text-[14px] ${
              done.includes(i) ? 'border-ink/40 bg-leaf' : 'border-rule'
            }`}
          >
            <span aria-hidden className={`punch ${done.includes(i) ? 'punch-done' : ''}`} />
            <span className="font-bold">{p.signal}</span>
            {done.includes(i) && <span className="machine ml-auto text-[13px] text-ink2">→ {p.action}</span>}
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-1.5">
        {remainActions.map((i) => (
          <button
            key={i}
            type="button"
            aria-pressed={sel === i}
            onClick={() => setSel(sel === i ? null : i)}
            className={`hinge min-h-[44px] rounded-[3px] border px-2.5 text-left text-[13px] ${
              sel === i ? 'border-ink bg-ink text-milk' : 'border-ink/40 bg-leaf hover:bg-under'
            }`}
          >
            {SM_PAIRS[i].action}
          </button>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-3">
        <Btn variant="primary" onClick={() => sel !== null && hit(sel)} disabled={sel === null}>
          连这一对
        </Btn>
        <PunchRow total={6} done={done.length} />
        <span className="machine text-[13px] text-ink2">{done.length}/6</span>
      </div>
      <div className="mt-2" aria-live="polite">
        {mark === false && <Verdict ok={false}>连不上，信号背后只有一个动作，再对一次</Verdict>}
        {done.length >= 6 && <Verdict ok>六对全连上，信号到动作通了</Verdict>}
      </div>
    </div>
  );
};

/* ---------- checklistFill：学前学中两张清单按今天实况勾 ---------- */
const CF_PRE = ['今天先复习还是先学新内容，心里有数', '今天卡壳的那条缝已经写下来', '打算先修听觉还是先修对应，选定了一条'];
const CF_DURING = [
  { t: '有一段走神了', fault: true },
  { t: '有一处假装会了，其实没懂', fault: true },
  { t: '记了本次卡在哪一格', fault: false },
  { t: '按计划收口，没有拖时间', fault: false },
];
const ChecklistFill: KindComp = ({ onDone }) => {
  const [pre, setPre] = useState<boolean[]>([false, false, false]);
  const [during, setDuring] = useState<boolean[]>([false, false, false, false]);
  const preAll = pre.every(Boolean);
  const duringAll = during.every(Boolean);
  const faultPicked = during[0] || during[1];
  const pass = preAll && duringAll && faultPicked;
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
      <p className="mb-1.5 text-[14px] font-bold">学前清单</p>
      <ul className="space-y-1.5">
        {CF_PRE.map((t, i) => (
          <li key={t}>
            <label className="flex min-h-[44px] cursor-pointer items-center gap-3 rounded-[3px] border border-ink/30 bg-leaf px-3 hover:bg-under">
              <input
                type="checkbox"
                checked={pre[i]}
                onChange={() => setPre((v) => v.map((x, j) => (j === i ? !x : x)))}
                className="h-5 w-5 accent-[#17140E]"
              />
              <span className="flex-1 text-[14px]">{t}</span>
            </label>
          </li>
        ))}
      </ul>
      <p className="mb-1.5 mt-3 text-[14px] font-bold">学中清单（按今天的真实情况）</p>
      <ul className="space-y-1.5">
        {CF_DURING.map((it, i) => (
          <li key={it.t}>
            <label className="flex min-h-[44px] cursor-pointer items-center gap-3 rounded-[3px] border border-ink/30 bg-leaf px-3 hover:bg-under">
              <input
                type="checkbox"
                checked={during[i]}
                onChange={() => setDuring((v) => v.map((x, j) => (j === i ? !x : x)))}
                className="h-5 w-5 accent-[#17140E]"
              />
              <span className="flex-1 text-[14px]">{it.t}</span>
              {it.fault && <span className="machine text-[12px] text-ink2">走神或假装会了</span>}
            </label>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <Btn variant="primary" onClick={check}>
          交清单
        </Btn>
        <span className="machine text-[13px] text-ink2">
          学前 {pre.filter(Boolean).length}/3 · 学中 {during.filter(Boolean).length}/4
        </span>
      </div>
      <div className="mt-2" aria-live="polite">
        {!pass && (
          <Verdict ok={false}>
            {!preAll ? '学前还有没勾的' : !duringAll ? '学中没按实况勾完' : '学中要至少勾出一处走神或假装会了'}
          </Verdict>
        )}
        {pass && <Verdict ok>两张清单按实况勾完，留下的记号就是下一轮的起点</Verdict>}
      </div>
    </div>
  );
};

/* ---------- debriefForm：五栏复盘表填满，每栏一句话 ---------- */
const DF_COLS: { id: string; label: string; hint: string }[] = [
  { id: 'wrong-q', label: '挑你答错的题', hint: '写下题号或题目关键词' },
  { id: 'cause', label: '错因是什么', hint: '知识缺口、粗心还是时间不足，一句话' },
  { id: 'stuck', label: '卡在哪一格', hint: '音节、重音还是调用，一句话' },
  { id: 'fix', label: '下一轮先动哪里', hint: '具体到动作，一句话' },
  { id: 'tomorrow', label: '明天的时间怎么分', hint: '几分钟拆词、几分钟听写' },
];
const DebriefForm: KindComp = ({ onDone }) => {
  const [vals, setVals] = useState<string[]>(DF_COLS.map(() => ''));
  const filled = vals.filter((v) => v.trim().length > 0).length;
  const pass = filled === DF_COLS.length;
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
      <ul className="space-y-2">
        {DF_COLS.map((c, i) => (
          <li key={c.id}>
            <label htmlFor={`df-${c.id}`} className="mb-1 flex items-center gap-2 text-[14px] font-bold">
              <span className="machine text-[13px] text-ink2">{i + 1}</span>
              {c.label}
            </label>
            <input
              id={`df-${c.id}`}
              type="text"
              value={vals[i]}
              onChange={(e) => setVals((v) => v.map((x, j) => (j === i ? e.target.value : x)))}
              placeholder={c.hint}
              className="h-11 w-full rounded-[3px] border border-ink/40 bg-leaf px-3 text-[15px] outline-none placeholder:text-ink2 focus:border-ink"
            />
          </li>
        ))}
      </ul>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <Btn variant="primary" onClick={check}>
          交表
        </Btn>
        <PunchRow total={5} done={filled} />
        <span className="machine text-[13px] text-ink2">{filled}/5 栏</span>
      </div>
      <div className="mt-2" aria-live="polite">
        {!pass && <Verdict ok={false}>五栏每栏一句话，填满才交</Verdict>}
        {pass && <Verdict ok>五栏交齐，最后一栏就是明天的计划</Verdict>}
      </div>
    </div>
  );
};

export const classifyKinds: Record<string, KindComp> = {
  morphemeJudge: MorphemeJudge,
  errorClassify: ErrorClassify,
  signalMatch: SignalMatch,
  checklistFill: ChecklistFill,
  debriefForm: DebriefForm,
};
