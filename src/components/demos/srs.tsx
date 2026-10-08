import React, { useState } from 'react';
import { DemoPanel, Btn, PunchRow, Verdict, Token } from './_shared';
import { SpeakButton } from '@/components/edu/Speak';

/* 课程 06 间隔复习的教学演示（5 个 ref） */

/* 遗忘曲线的两点共用 SVG：指数衰减，快掉后平 */
function CurveSvg({ marks, height = 130 }: { marks?: { x: number; label: string; on: boolean }[]; height?: number }) {
  const w = 320;
  const pts: string[] = [];
  for (let i = 0; i <= 40; i++) {
    const t = i / 40;
    const y = 110 - 95 * Math.exp(-3.2 * t);
    pts.push(`${10 + t * (w - 20)},${y}`);
  }
  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="w-full" role="img" aria-label="遗忘曲线，先快后慢">
      <line x1="10" y1="110" x2={w - 10} y2="110" stroke="#17140E" strokeWidth="1.5" />
      <line x1="10" y1="10" x2="10" y2="110" stroke="#17140E" strokeWidth="1.5" />
      <polyline points={pts.join(' ')} fill="none" stroke="#2A4BD7" strokeWidth="2.5" />
      <text x={w - 12} y="125" textAnchor="end" className="machine" fontSize="10" fill="#57503F">
        时间
      </text>
      <text x="14" y="20" className="machine" fontSize="10" fill="#57503F">
        记住量
      </text>
      {marks?.map((m) => (
        <g key={m.label}>
          <circle cx={m.x} cy={110} r="4" fill={m.on ? '#2A4BD7' : '#FBF9F2'} stroke="#17140E" strokeWidth="1.5" />
          <text x={m.x} y={124} textAnchor="middle" className="machine" fontSize="9" fill="#57503F">
            {m.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

/** 刚学完的几小时掉得最快，往后曲线越来越平缓 */
function ForgettingCurve() {
  const [lit, setLit] = useState(0);
  const stages = [
    { t: '刚学完', d: '记住量接近满格，此时测自己永远是满分，测不出问题。' },
    { t: '头几小时', d: '曲线最陡，掉得最快，第一次复习要赶在这一段里。' },
    { t: '往后几天', d: '曲线越来越平缓，间隔可以越拉越长。' },
  ];
  return (
    <DemoPanel label="遗忘曲线 · 先快后慢">
      <CurveSvg />
      <ul className="mt-2 space-y-1.5">
        {stages.map((s, i) => (
          <li key={s.t}>
            <button
              type="button"
              onClick={() => setLit(i + 1)}
              aria-expanded={lit > i}
              className={`hinge flex min-h-[44px] w-full items-center gap-3 rounded-[3px] border px-3 text-left text-[14px] ${
                lit > i ? 'border-ink bg-leaf' : 'border-ink/30 bg-leaf hover:bg-under'
              }`}
            >
              <span aria-hidden className={`punch ${lit > i ? 'punch-done' : ''}`} />
              <span className="font-bold">{s.t}</span>
            </button>
            {lit > i && <p className="hinge ml-6 mt-1 text-[14px] text-ink2">{s.d}</p>}
          </li>
        ))}
      </ul>
      <div className="mt-3" aria-live="polite">
        {lit === 3 && <Verdict ok>三段看完，第一次复习赶在最陡那一段</Verdict>}
      </div>
    </DemoPanel>
  );
}

/** 太早复习太轻松，太晚复习要重学，中间那段最省力 */
const ZONES = [
  { t: '太早', d: '刚听完就复习，全程轻松，大脑没做提取，等于白复习。', ok: false },
  { t: '甜点', d: '快忘还没忘，想起来要费点劲，这一段最省力。', ok: true },
  { t: '太晚', d: '已经忘光，要当新词重学一遍，时间翻倍。', ok: false },
];
function DesirableDifficulty() {
  const [pick, setPick] = useState<number | null>(null);
  return (
    <DemoPanel label="合意难度 · 三个区">
      <div className="grid gap-2 sm:grid-cols-3">
        {ZONES.map((z, i) => (
          <button
            key={z.t}
            type="button"
            onClick={() => setPick(i)}
            aria-pressed={pick === i}
            className={`hinge rounded-[3px] border p-3 text-left ${
              pick === i ? 'border-ink bg-leaf' : 'border-ink/30 bg-leaf hover:bg-under'
            }`}
          >
            <span className="mb-1 flex items-center gap-2">
              <span aria-hidden className={`punch ${pick === i ? 'punch-done' : ''}`} />
              <span className="machine text-[15px] font-bold">{z.t}</span>
            </span>
            <span className="block text-[13px] text-ink2">{z.d}</span>
          </button>
        ))}
      </div>
      <div className="mt-3" aria-live="polite">
        {pick !== null && (
          <Verdict ok={ZONES[pick].ok}>{ZONES[pick].ok ? '中间那段最省力，复习排在这个位置' : '这个区不划算，往甜点区挪'}</Verdict>
        )}
      </div>
      <div className="mt-3 border-t border-rule pt-3">
        <CurveSvg height={110} marks={[{ x: 60, label: '太早', on: pick === 0 }, { x: 150, label: '甜点', on: pick === 1 }, { x: 250, label: '太晚', on: pick === 2 }]} />
      </div>
    </DemoPanel>
  );
}

/** 同一组词，先遮住再想和直接再看一遍，效果差得明显 */
const CR_WORD = 'reluctant';
function RecallVsReread() {
  const [track, setTrack] = useState<'none' | 'recall' | 'reread'>('none');
  const [revealed, setRevealed] = useState(false);
  return (
    <DemoPanel label="回忆 vs 重读 · 同词对照">
      <div className="mb-3 flex flex-wrap gap-2">
        <Btn
          pressed={track === 'recall'}
          onClick={() => {
            setTrack('recall');
            setRevealed(false);
          }}
        >
          先遮住再想
        </Btn>
        <Btn
          pressed={track === 'reread'}
          onClick={() => {
            setTrack('reread');
            setRevealed(true);
          }}
        >
          直接再看一遍
        </Btn>
      </div>
      <div className="under-leaf rounded-[3px] p-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="machine text-[22px] font-bold">{CR_WORD}</span>
          <span className="text-[14px] text-ink2">不情愿的</span>
          <SpeakButton text={CR_WORD} size="sm" />
        </div>
        <div className="hinge mt-3" aria-live="polite">
          {track === 'none' && <p className="text-[14px] text-ink2">选一条路走一遍。</p>}
          {track === 'recall' && !revealed && (
            <p className="text-[15px]">
              词义和读音被遮住了，先在心里把它们说出来，说出来了再点「揭示核对」。
            </p>
          )}
          {track === 'recall' && revealed && (
            <p className="text-[15px] font-bold">
              核对：不情愿的 /rɪˈlʌktənt/。想出来才算提取，卡壳的那几秒正是练的地方。
            </p>
          )}
          {track === 'reread' && (
            <p className="text-[15px]">
              词义直接摆在眼前，读着很顺，但合上就没了。重读给的是完成感，不是记忆。
            </p>
          )}
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        {track === 'recall' && !revealed && (
          <Btn variant="primary" onClick={() => setRevealed(true)}>
            揭示核对
          </Btn>
        )}
        <Btn onClick={() => { setTrack('none'); setRevealed(false); }} disabled={track === 'none'}>
          换条路
        </Btn>
      </div>
    </DemoPanel>
  );
}

/** 新词今天入表，答对往后推一档，答错回到今天 */
const SLOTS = [1, 3, 7, 14, 30];
function SrsTimeline() {
  const [stage, setStage] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const advance = () => {
    setStage((s) => Math.min(4, s + 1));
    setResult('答对，往后推一档');
  };
  const reset = () => {
    setStage(0);
    setResult('答错，回到今天');
  };
  return (
    <DemoPanel label="排期时间轴 · 一个词">
      <div className="mb-3 flex items-center gap-1.5">
        {SLOTS.map((d, i) => (
          <React.Fragment key={d}>
            <span
              className={`machine flex h-11 flex-1 items-center justify-center rounded-[3px] border text-[14px] ${
                i < stage
                  ? 'border-rule text-ink2 line-through'
                  : i === stage
                    ? 'border-2 border-ink bg-ink font-bold text-milk'
                    : 'border-ink/30 bg-leaf text-ink2'
              }`}
            >
              {d}天
            </span>
            {i < SLOTS.length - 1 && (
              <span aria-hidden className="text-ink2">
                ›
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <span className="under-leaf machine rounded-[3px] px-3 py-2 text-[15px]">reluctant</span>
        <span className="machine text-[13px] text-ink2">现处第 {SLOTS[stage]} 天档</span>
        <SpeakButton text="reluctant" size="sm" />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Btn variant="primary" onClick={advance} disabled={stage === 4}>
          这次想出来了
        </Btn>
        <Btn onClick={reset}>没想起来</Btn>
      </div>
      <div className="mt-3" aria-live="polite">
        {result && (
          <p className="flex items-center gap-2 text-[14px] font-bold">
            <span aria-hidden className={`punch ${stage === 0 && result.startsWith('答错') ? '' : 'punch-done'}`} />
            {result}
          </p>
        )}
        {stage === 4 && result === '答对，往后推一档' && <Verdict ok>走到 30 天档，这个词可以收档了</Verdict>}
      </div>
    </DemoPanel>
  );
}

/** 给三个新词各排一张 30 天时刻表，答错自动退回今天 */
const SCHED_WORDS = ['reluctant', 'articulate', 'scrutiny'];
function ScheduleBuilder() {
  const [rows, setRows] = useState<number[]>([0, 0, 0]);
  const [touched, setTouched] = useState<boolean[]>([false, false, false]);
  const all = touched.every(Boolean);
  const bump = (ri: number) => {
    setRows((r) => r.map((v, i) => (i === ri ? Math.min(4, v + 1) : v)));
    setTouched((t) => t.map((v, i) => (i === ri ? true : v)));
  };
  const demote = (ri: number) => {
    setRows((r) => r.map((v, i) => (i === ri ? 0 : v)));
  };
  return (
    <DemoPanel label="排你的时刻表 · 三张">
      <ul className="space-y-3">
        {SCHED_WORDS.map((w, ri) => (
          <li key={w} className="under-leaf rounded-[3px] p-3">
            <div className="mb-2 flex items-center gap-2">
              <span className="machine text-[16px] font-bold">{w}</span>
              <SpeakButton text={w} size="sm" />
              <span className="machine ml-auto text-[13px] text-ink2">第 {SLOTS[rows[ri]]} 天档</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SLOTS.map((d, i) => (
                <span
                  key={d}
                  className={`machine rounded-[3px] border px-2 py-1.5 text-[13px] ${
                    i === rows[ri] ? 'border-ink bg-ink text-milk' : i < rows[ri] ? 'border-rule text-ink2' : 'border-ink/30 text-ink2'
                  }`}
                >
                  {d}天
                </span>
              ))}
            </div>
            <div className="mt-2 flex gap-2">
              <Btn variant="primary" onClick={() => bump(ri)} disabled={rows[ri] === 4}>
                这次答对
              </Btn>
              <Btn onClick={() => demote(ri)} disabled={rows[ri] === 0}>
                答错退回今天
              </Btn>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex items-center gap-3 border-t border-rule pt-3">
        <PunchRow total={3} done={touched.filter(Boolean).length} />
        <span className="text-[14px] text-ink2">三张表都动过一档才算排好，站内刷新后不保留。</span>
      </div>
      <div className="mt-2" aria-live="polite">
        {all && <Verdict ok>三张时刻表排好，接下来七天照着执行</Verdict>}
      </div>
    </DemoPanel>
  );
}

export const srsDemos: Record<string, React.FC> = {
  'forgetting-curve': ForgettingCurve,
  'desirable-difficulty': DesirableDifficulty,
  'recall-vs-reread': RecallVsReread,
  'srs-timeline': SrsTimeline,
  'schedule-builder': ScheduleBuilder,
};
