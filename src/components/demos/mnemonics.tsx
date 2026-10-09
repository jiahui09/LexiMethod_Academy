import React, { useState } from 'react';
import { DemoPanel, Btn, PunchRow, Verdict, Bar, Token } from './_shared';
import { SpeakButton } from '@/components/edu/Speak';

/* 课程 05 联想课的教学演示（6 个 ref） */

/** 发音 → 谐音俺不能死 → 追车喊叫的画面 → 收回英文句子 */
const CHAIN = [
  { step: '发音', body: 'ambulance /ˈæmbjələns/', note: '先听三遍，抓准节奏' },
  { step: '谐音', body: '俺不能死', note: '音近，只借声音不借字义' },
  { step: '画面', body: '救护车里的人追着车喊「俺不能死」', note: '动感，画面里有动作有声音' },
  { step: '收回', body: 'An ambulance rushed him to the hospital.', note: '放回英文句子，钩子收回发音' },
];
function AmbulanceChain() {
  const [step, setStep] = useState(1);
  return (
    <DemoPanel label="联想链 · ambulance">
      <div className="mb-3 flex items-center gap-3">
        <PunchRow total={4} done={step} active={step < 4 ? step : undefined} />
        <span className="machine text-[13px] text-ink2">环 {step}/4</span>
      </div>
      <ol className="space-y-2">
        {CHAIN.map((c, i) => (
          <li
            key={c.step}
            className={`hinge border-2 px-3 py-2 ${
              i < step ? 'border-ink bg-leaf' : 'border-ink opacity-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="machine w-10 shrink-0 text-[13px] text-ink2">{c.step}</span>
              <span className="flex-1 text-[15px]">{i < step ? c.body : '▓▓▓ 未到这一环'}</span>
            </div>
            {i < step && <p className="mt-1 ml-12 text-[13px] text-ink2">{c.note}</p>}
          </li>
        ))}
      </ol>
      <div className="mt-3 flex gap-2">
        <Btn onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1}>
          回上一环
        </Btn>
        <Btn variant="primary" onClick={() => setStep((s) => Math.min(4, s + 1))} disabled={step === 4}>
          {step === 4 ? '收回完成' : '进下一环'}
        </Btn>
      </div>
      {step === 4 && (
        <div className="hinge mt-3 flex items-center gap-3 border-t border-rule pt-3">
          <SpeakButton text="An ambulance rushed him to the hospital." label="朗读收回句" />
          <span className="text-[14px] font-bold">四环扣死，最后一环必须收回英文句子。</span>
        </div>
      )}
    </DemoPanel>
  );
}

/** 同一个词从字形、发音、画面三个方向各进一次 */
const PATHS = [
  { dir: '字形', entry: 'ambulance 的拼写分块 am·bu·lance', pull: '看到词形 → 想起分块与词义' },
  { dir: '发音', entry: '听到 /ˈæmbjələns/ → 谐音俺不能死', pull: '听到声音 → 拉出画面' },
  { dir: '画面', entry: '追车喊叫的场景', pull: '想到场景 → 说出词与发音' },
];
function ThreeRetrievalPaths() {
  const [lit, setLit] = useState<boolean[]>([false, false, false]);
  const all = lit.every(Boolean);
  return (
    <DemoPanel label="三条检索路径 · ambulance">
      <div className="grid gap-2 sm:grid-cols-3">
        {PATHS.map((p, i) => (
          <button
            key={p.dir}
            type="button"
            onClick={() => setLit((l) => l.map((v, j) => (j === i ? !v : v)))}
            aria-pressed={lit[i]}
            className={`hinge border-2 p-3 text-left ${
              lit[i] ? 'border-ink bg-leaf' : 'border-ink bg-leaf hover:bg-under'
            }`}
          >
            <span className="mb-1 flex items-center gap-2">
              <span aria-hidden className={`punch ${lit[i] ? 'punch-done' : ''}`} />
              <span className="machine text-[14px] font-bold">{p.dir}</span>
            </span>
            <span className="block text-[14px]">{lit[i] ? p.entry : '点开看这条路径'}</span>
          </button>
        ))}
      </div>
      <div className="mt-3 space-y-1.5 border-t border-rule pt-3">
        {PATHS.map((p, i) => (
          <p key={p.dir} className="text-[14px] text-ink2">
            {lit[i] ? p.pull : ''}
          </p>
        ))}
      </div>
      <div className="mt-2" aria-live="polite">
        {all ? <Verdict ok>三向各进一次，任一端都能拉出整链</Verdict> : <p className="text-[14px] text-ink2">三条路径逐条点亮。</p>}
      </div>
    </DemoPanel>
  );
}

/** 给一条联想逐项打分，缺哪项补哪项，补不上就换画面 */
const SCORE_ITEMS = [
  { k: '音近', q: '「俺不能死」和 /ˈæmbjələns/ 像不像？' },
  { k: '义通', q: '画面和「救护车」这层意思接得上吗？' },
  { k: '动感', q: '画面里有人、有动作、有声音吗？' },
];
function AssociationChecklist() {
  const [scores, setScores] = useState<Record<string, boolean>>({});
  const done = SCORE_ITEMS.every((i) => i.k in scores);
  const low = SCORE_ITEMS.filter((i) => scores[i.k] === false);
  return (
    <DemoPanel label="质检清单 · 打分">
      <ul className="space-y-2">
        {SCORE_ITEMS.map((it) => {
          const v = scores[it.k];
          return (
            <li key={it.k} className="under-leaf p-3">
              <p className="text-[15px] font-bold">{it.k}</p>
              <p className="mt-0.5 text-[14px] text-ink2">{it.q}</p>
              <div className="mt-2 flex gap-2">
                <Btn pressed={v === true} onClick={() => setScores((s) => ({ ...s, [it.k]: true }))}>
                  过得去
                </Btn>
                <Btn pressed={v === false} onClick={() => setScores((s) => ({ ...s, [it.k]: false }))}>
                  缺这项
                </Btn>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="mt-3" aria-live="polite">
        {done &&
          (low.length === 0 ? (
            <Verdict ok>三项都过得去，这条联想可以入库</Verdict>
          ) : (
            <p className="flex items-start gap-2 text-[14px] text-errata">
              <span aria-hidden className="mt-0.5 inline-block h-4 w-4 shrink-0 border-2 border-errata" />
              <span className="font-bold">缺「{low.map((l) => l.k).join('、')}」，对着原句补；补不上就换画面重来。</span>
            </p>
          ))}
      </div>
    </DemoPanel>
  );
}

/** 先抓读音找谐音，再造画面，最后写一句英文把它收回 */
const BUILD_STAGES = [
  { t: '抓读音', body: 'diagnosis /ˌdaɪəɡˈnəʊsɪs/，抓后半段 nog 的音', hint: '先听，不动笔' },
  { t: '找谐音', body: 'nog ≈ 「闹个死」', hint: '音近就行，字义随便借' },
  { t: '造画面', body: '医生闹着说「不治好我就不死」，画面压在诊断台上', hint: '有人有动作' },
  { t: '收回英文', body: 'The diagnosis took three days.', hint: '放进真句，钩子收回发音' },
];
function AssociationBuilder() {
  const [stage, setStage] = useState(1);
  return (
    <DemoPanel label="联想搭建台 · diagnosis">
      <ol className="space-y-2">
        {BUILD_STAGES.map((s, i) => (
          <li key={s.t} className={`hinge border-2 p-3 ${i < stage ? 'border-ink bg-leaf' : 'border-ink opacity-50'}`}>
            <div className="flex items-center gap-3">
              <span aria-hidden className={`punch ${i < stage ? 'punch-done' : ''}`} />
              <span className="machine text-[14px] font-bold">{s.t}</span>
              <span className="ml-auto machine text-[13px] text-ink2">{s.hint}</span>
            </div>
            <p className="mt-1 text-[15px]">{i < stage ? s.body : '▓▓▓ 还没到这一步'}</p>
          </li>
        ))}
      </ol>
      <div className="mt-3 flex items-center gap-3">
        <Btn variant="primary" onClick={() => setStage((s) => Math.min(4, s + 1))} disabled={stage === 4}>
          {stage === 4 ? '四步走完' : `推进到第 ${stage + 1} 步`}
        </Btn>
        <PunchRow total={4} done={stage} />
      </div>
      {stage === 4 && <p className="hinge mt-3 text-[14px] font-bold">读音起步，句子收尾，顺序不能倒。</p>}
    </DemoPanel>
  );
}

/** 遮画面说词义 → 读发音回拼写 → 一周后不靠画面直接反应 */
const SCAFFOLD = [
  { t: '遮画面说词义', d: '把「俺不能死」遮住，看 ambulance 要能说出「救护车」。' },
  { t: '读发音回拼写', d: '听到 /ˈæmbjələns/，不看词要能拼出来。' },
  { t: '一周后直接反应', d: '画面撤掉，看到词直接蹦出词义和发音。' },
];
function ScaffoldRemoval() {
  const [gone, setGone] = useState<boolean[]>([false, false, false]);
  const all = gone.every(Boolean);
  return (
    <DemoPanel label="撤拐三步 · ambulance">
      <ul className="space-y-2">
        {SCAFFOLD.map((s, i) => (
          <li key={s.t} className="under-leaf p-3">
            <div className="flex items-center gap-3">
              <span aria-hidden className={`punch ${gone[i] ? 'punch-done' : ''}`} />
              <span className="text-[15px] font-bold">{s.t}</span>
              <span className="machine ml-auto text-[13px] text-ink2">第 {i + 1} 步</span>
            </div>
            <p className="mt-1 text-[14px] text-ink2">{s.d}</p>
            <div className="mt-2">
              <Btn
                pressed={gone[i]}
                onClick={() => setGone((g) => g.map((v, j) => (j === i ? !v : v)))}
                ariaLabel={`切换「${s.t}」完成状态`}
              >
                {gone[i] ? '已撤' : '还在拄拐'}
              </Btn>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-3" aria-live="polite">
        {all ? <Verdict ok>三拐全撤，词已经能直接反应</Verdict> : <p className="text-[14px] text-ink2">撤一步，测一步，反应不出来就退回去。</p>}
      </div>
    </DemoPanel>
  );
}

/** 把新词分成两堆，够得着的直接读用，够不着的进联想台 */
const RATIO_WORDS = [
  { w: 'water', easy: true },
  { w: 'beautiful', easy: true },
  { w: 'ambulance', easy: false },
  { w: 'diagnosis', easy: false },
  { w: 'garden', easy: true },
  { w: 'onomatopoeia', easy: false },
];
function AssociationRatio() {
  const [sort, setSort] = useState(false);
  const easy = RATIO_WORDS.filter((r) => r.easy);
  const hard = RATIO_WORDS.filter((r) => !r.easy);
  return (
    <DemoPanel label="两堆分流 · 新词 6 个">
      <div className="mb-3 flex gap-2">
        <Btn variant="primary" onClick={() => setSort(true)} pressed={sort}>
          分堆
        </Btn>
        <Btn onClick={() => setSort(false)}>打散重来</Btn>
      </div>
      {!sort ? (
        <div className="flex flex-wrap gap-2">
          {RATIO_WORDS.map((r) => (
            <Token key={r.w} className="machine text-[15px]">
              {r.w}
            </Token>
          ))}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="under-leaf p-3">
            <p className="machine mb-2 text-[13px] text-ink2">直接读用 · {easy.length} 个</p>
            <div className="flex flex-wrap gap-2">
              {easy.map((r) => (
                <Token key={r.w} className="machine text-[15px]">
                  {r.w}
                </Token>
              ))}
            </div>
            <p className="mt-2 text-[13px] text-ink2">高频、一眼熟，多读多用就够。</p>
          </div>
          <div className="under-leaf p-3">
            <p className="machine mb-2 text-[13px] text-ink2">进联想台 · {hard.length} 个</p>
            <div className="flex flex-wrap gap-2">
              {hard.map((r) => (
                <Token key={r.w} hue="#2A4BD7" className="machine text-[15px]">
                  {r.w}
                </Token>
              ))}
            </div>
            <p className="mt-2 text-[13px] text-ink2">卡壳的难词才值得花时间造联想。</p>
          </div>
        </div>
      )}
      <div className="mt-4 space-y-2 border-t border-rule pt-3">
        <Bar label="直接读用" value={easy.length} max={6} suffix=" 个" />
        <Bar label="进联想台" value={hard.length} max={6} suffix=" 个" hue="#2A4BD7" />
      </div>
    </DemoPanel>
  );
}

export const mnemonicsDemos: Record<string, React.FC> = {
  'ambulance-chain': AmbulanceChain,
  'three-retrieval-paths': ThreeRetrievalPaths,
  'association-checklist': AssociationChecklist,
  'association-builder': AssociationBuilder,
  'scaffold-removal': ScaffoldRemoval,
  'association-ratio': AssociationRatio,
};
