import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clapperboard,
  Quote,
  ArrowDown,
  BrainCircuit,
  CalendarRange,
  BarChart3,
  Mic2,
  PenLine,
  ListChecks,
  ScrollText,
} from 'lucide-react';
import type { Method } from '@/types';
import { useMotionTier } from '@/hooks/useMotionTier';
import { playSfx } from '@/hooks/useSfx';
import { SpeakButton } from '@/components/ui/Bits';
import NeonButton from '@/components/ui/NeonButton';
import { words } from '@/data/words';
import { strategyTuning, metacogChecklist } from '@/data/tools';

const fade = (tier: string, delay = 0) =>
  tier === 'off'
    ? {}
    : {
        initial: { opacity: 0, y: 18, scale: 0.97 },
        animate: { opacity: 1, y: 0, scale: 1 },
        transition: { delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
      };

/* ---------------- 联想记忆法：单词 → 图像 → 故事 ---------------- */
export function MemoryChainStep({ method }: { method: Method }) {
  const tier = useMotionTier();
  const [stage, setStage] = useState(0);

  const chain = [
    { label: '单词', value: 'ambulance', sub: '/ˈæmbjələns/ 救护车', color: '#00E5FF', icon: Quote },
    { label: '图像', value: '蓝灯闪烁的白色车', sub: '在脑海里生成清晰、夸张、有动作的画面', color: '#7C4DFF', icon: Clapperboard },
    { label: '谐音钩子（仅作辅助）', value: '“俺不能死”', sub: '用母语发音搭建临时钩子，粤语/普通话都行', color: '#FFB300', icon: BrainCircuit },
    { label: '故事场景', value: '“俺不能死”→ 抢救 → 救护车', sub: '把钩子编成 3 秒故事，画面越荒诞越好记', color: '#FF4D9D', icon: Clapperboard },
    { label: '回归', value: '读准 /ˈæmbjələns/ + 放进句子', sub: '联想只是钩子，最终必须回到发音与语境', color: '#00E676', icon: Quote },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-300">
          <span className="mr-2 rounded-md bg-warn/15 px-2 py-0.5 text-[11px] font-bold text-warn">联想链</span>
          按顺序构建：单词 → 图像 → 故事 → 回归发音与语境
        </p>
        <NeonButton
          size="sm"
          variant="ghost"
          onClick={() => {
            playSfx('reveal');
            setStage(0);
            let i = 0;
            const id = window.setInterval(() => {
              i += 1;
              setStage(i);
              if (i >= chain.length) window.clearInterval(id);
            }, 700);
            window.setTimeout(() => window.clearInterval(id), 5000);
          }}
        >
          ▶ 播放联想链
        </NeonButton>
      </div>

      <div className="flex flex-col gap-2.5">
        {chain.map((c, i) => {
          const Icon = c.icon;
          const active = i < stage;
          return (
            <motion.div key={c.label} {...fade(tier, 0.08 * i)} animate={tier === 'off' ? {} : { opacity: active ? 1 : 0.35, x: active ? 0 : -8 }}>
              <div
                className="flex flex-wrap items-center gap-3 rounded-2xl border px-4 py-3 backdrop-blur-md transition-all duration-500"
                style={{
                  borderColor: active ? `${c.color}88` : 'rgba(255,255,255,0.1)',
                  background: active ? `${c.color}14` : 'rgba(255,255,255,0.03)',
                  boxShadow: active ? `0 0 24px ${c.color}33` : 'none',
                }}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: `${c.color}22`, color: c.color }}>
                  <Icon size={17} aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: c.color }}>
                    {c.label}
                  </div>
                  <div className="font-display text-base font-semibold text-white">{c.value}</div>
                  <div className="text-xs text-slate-400">{c.sub}</div>
                </div>
                {i === 0 && <SpeakButton text="ambulance" size="sm" />}
              </div>
            </motion.div>
          );
        })}
      </div>

      <p className="rounded-xl border border-warn/30 bg-warn/[0.07] px-3 py-2 text-xs text-[#FFE7BD]">
        方法边界：谐音联想只是“提取钩子”，发音不准、脱离语境的联想会越记越歪。每个联想词都要回到标准发音 + 一个真实句子里读三遍。
      </p>
    </div>
  );
}

/* ---------------- 语境记忆法：句子高亮 + 搭配发光 ---------------- */
export function ContextStep() {
  const tier = useMotionTier();
  const word = words.find((w) => w.id === 'visible') ?? words[0];
  const sentence = word.examples[0];
  const [collected, setCollected] = useState<string[]>([]);

  const chunks = word.collocations;

  return (
    <div className="flex flex-col gap-4">
      {/* 句子高亮 */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <span className="rounded-md bg-success/15 px-2 py-0.5 font-semibold text-success">语境中的词</span>
          <span className="font-display font-semibold text-white">{word.word}</span>
          <span className="ipa">{word.phoneticUK}</span>
          <SpeakButton text={sentence.en} size="sm" />
        </div>
        <p className="text-lg leading-relaxed text-slate-200">
          {sentence.en.split(new RegExp(`\\b${word.word}\\b`, 'i')).map((part, i, arr) => (
            <span key={i}>
              {part}
              {i < arr.length - 1 && (
                <motion.mark
                  key={i}
                  className="rounded-md px-1.5 py-0.5 font-semibold text-[#04121c]"
                  style={{ background: 'linear-gradient(120deg,#00E5FF,#7C4DFF)', boxShadow: '0 0 22px rgba(0,229,255,0.45)' }}
                  initial={tier === 'off' ? false : { scaleX: 0.2, opacity: 0.3 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  {word.word}
                </motion.mark>
              )}
            </span>
          ))}
        </p>
        <p className="mt-2 text-sm text-slate-400">{sentence.cn}</p>
      </div>

      {/* 搭配词发光 + 收集词块 */}
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
          <ListChecks size={13} aria-hidden /> 词块（点击收集到你的词块本）
        </div>
        <div className="flex flex-wrap gap-2">
          {chunks.map((c, i) => {
            const on = collected.includes(c);
            return (
              <motion.button
                key={c}
                type="button"
                initial={tier === 'off' ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.07 }}
                onClick={() => {
                  playSfx(on ? 'tick' : 'reveal');
                  setCollected((prev) => (on ? prev.filter((x) => x !== c) : [...prev, c]));
                }}
                className={`rounded-xl border px-4 py-2.5 text-sm transition-all duration-300 ${
                  on
                    ? 'border-success/70 bg-success/15 text-success shadow-[0_0_18px_rgba(0,230,118,0.3)]'
                    : 'border-neon/35 bg-neon/[0.07] text-slate-200 hover:border-neon/70 hover:shadow-glow-sm'
                }`}
                aria-pressed={on}
              >
                {on ? '✓ ' : '+ '}
                {c}
              </motion.button>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-slate-500">
          孤立单词记的是“释义”，词块记的是“怎么用”。阅读时优先收集 <span className="text-neon">动词+名词 / 形容词+名词 / 动词+副词</span>{' '}
          这类搭配，复习时整块调用。
        </p>
      </div>
    </div>
  );
}

/* ---------------- 间隔重复法：时间轴 + 主动回忆对比 ---------------- */
export function SrsTimelineStep() {
  const tier = useMotionTier();
  const nodes = [
    { day: '第 1 天', action: '首次学习后 10 分钟内自测', fill: 0.9 },
    { day: '第 3 天', action: '遮住释义回忆，再核对', fill: 0.75 },
    { day: '第 7 天', action: '听写 / 造句输出', fill: 0.62 },
    { day: '第 14 天', action: '在新阅读中识别', fill: 0.5 },
    { day: '第 30 天', action: '口头使用 1 次', fill: 0.4 },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* 时间轴 */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
        <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
          <CalendarRange size={13} aria-hidden /> 复习节奏（越往后间隔越长）
        </div>
        <div className="relative">
          <div className="absolute left-0 right-0 top-5 h-0.5 bg-gradient-to-r from-neon/60 via-violet/60 to-pink/60" aria-hidden />
          <div className="relative grid grid-cols-5 gap-1.5">
            {nodes.map((n, i) => (
              <motion.div
                key={n.day}
                {...fade(tier, i * 0.12)}
                className="flex flex-col items-center gap-1.5 text-center"
              >
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-full border text-[10px] font-bold"
                  style={{
                    borderColor: '#00E5FF',
                    background: 'rgba(0,229,255,0.14)',
                    color: '#CFFAFE',
                    boxShadow: '0 0 16px rgba(0,229,255,0.4)',
                  }}
                >
                  {i + 1}
                </span>
                <span className="font-display text-xs font-bold text-white">{n.day}</span>
                <span className="text-[10px] leading-tight text-slate-400">{n.action}</span>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-violet/30 bg-violet/[0.08] px-3 py-2 text-xs text-slate-300">
          <span className="text-violet">↑</span> 忘得最快的阶段在学后 24 小时内，所以第一次复习要“近”，之后逐级拉长。
        </div>
      </div>

      {/* 主动回忆 vs 反复阅读 */}
      <div className="grid gap-3 md:grid-cols-2">
        {[
          { label: '主动回忆（先测后看）', desc: '合上书，先逼自己写出答案，再核对', value: 0.88, color: '#00E676', icon: BrainCircuit },
          { label: '反复阅读（舒适假象）', desc: '把词表从头读到尾，眼熟但调不出来', value: 0.34, color: '#FF4D6D', icon: BarChart3 },
        ].map((b, i) => (
          <motion.div key={b.label} {...fade(tier, 0.5 + i * 0.15)} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <div className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-white">
              <b.icon size={14} style={{ color: b.color }} aria-hidden /> {b.label}
            </div>
            <div className="mb-2 h-2.5 overflow-hidden rounded-full bg-white/8">
              <motion.div
                className="h-full rounded-full"
                style={{ background: b.color, boxShadow: `0 0 12px ${b.color}` }}
                initial={tier === 'off' ? false : { width: 0 }}
                animate={{ width: `${b.value * 100}%` }}
                transition={{ delay: 0.8, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <p className="text-xs text-slate-400">{b.desc}</p>
          </motion.div>
        ))}
      </div>
      <p className="text-xs text-slate-500">测试效应（testing effect）：提取动作本身会加固记忆痕迹，比重复输入更省时、更牢。</p>
    </div>
  );
}

/* ---------------- 主动输出法：输出漏斗 ---------------- */
export function OutputFunnelStep() {
  const tier = useMotionTier();
  const word = words.find((w) => w.id === 'construction') ?? words[0];
  const [sentence, setSentence] = useState('');
  const [stage, setStage] = useState(0);

  const stages = [
    { label: '被动词汇', desc: '看得懂、想起来慢', color: '#64748B', icon: ScrollText },
    { label: '造句', desc: '把词放进自己的句子', color: '#00E5FF', icon: PenLine },
    { label: '口语输出', desc: '读出来 / 说出来 1 次', color: '#7C4DFF', icon: Mic2 },
    { label: '主动词汇', desc: '写作口语中自动调用', color: '#00E676', icon: BrainCircuit },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-center gap-1.5">
        {stages.map((s, i) => (
          <div key={s.label} className="w-full max-w-md">
            <motion.div
              {...fade(tier, i * 0.22)}
              animate={tier === 'off' ? {} : { opacity: i <= stage ? 1 : 0.42 }}
              className="flex items-center gap-3 rounded-2xl border px-4 py-3 backdrop-blur-md"
              style={{
                borderColor: i <= stage ? `${s.color}88` : 'rgba(255,255,255,0.1)',
                background: i <= stage ? `${s.color}14` : 'rgba(255,255,255,0.03)',
              }}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: `${s.color}22`, color: s.color }}>
                <s.icon size={16} aria-hidden />
              </span>
              <div>
                <div className="font-display text-sm font-bold text-white">{s.label}</div>
                <div className="text-xs text-slate-400">{s.desc}</div>
              </div>
            </motion.div>
            {i < stages.length - 1 && (
              <motion.div {...fade(tier, i * 0.22 + 0.1)} className="my-1 flex justify-center text-slate-500" aria-hidden>
                <ArrowDown size={16} />
              </motion.div>
            )}
          </div>
        ))}
      </div>

      {/* 造句练习 */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <span className="rounded-md bg-neon/15 px-2 py-0.5 font-semibold text-neon">现在就输出</span>
          用 <b className="text-white">{word.word}</b> 造一个与你自己有关的句子
          <SpeakButton text={word.word} size="sm" />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            className="input-neon"
            value={sentence}
            onChange={(e) => setSentence(e.target.value)}
            placeholder={`例如：${word.examples[0].en}`}
            aria-label="造句输入"
          />
          <NeonButton
            onClick={() => {
              if (sentence.trim().split(/\s+/).length < 4) {
                playSfx('wrong');
                return;
              }
              playSfx('correct');
              setStage((s) => Math.min(stages.length - 1, s + 1));
            }}
            disabled={sentence.trim().split(/\s+/).length < 4}
          >
            完成输出
          </NeonButton>
        </div>
        <p className="mt-2 text-[11px] text-slate-500">句子 ≥ 4 个词才计入输出；说出来（朗读一遍）效果再 +1。</p>
      </div>
    </div>
  );
}

/* ---------------- 元认知训练：自查 + 策略调整 ---------------- */
export function MetacogStep() {
  const tier = useMotionTier();
  const [log, setLog] = useState('');

  const groups = Array.from(new Set(metacogChecklist.map((c) => c.group)));

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
          <ListChecks size={13} aria-hidden /> 记忆监控自查
        </div>
        <div className="flex flex-col gap-3">
          {groups.map((g, gi) => (
            <div key={g}>
              <div className="mb-1 text-[11px] font-bold" style={{ color: ['#00E5FF', '#7C4DFF', '#FF4D9D', '#00E676'][gi % 4] }}>
                {g}
              </div>
              <ul className="flex flex-col gap-1">
                {metacogChecklist
                  .filter((c) => c.group === g)
                  .slice(0, 3)
                  .map((c, i) => (
                    <motion.li key={c.id} {...fade(tier, 0.05 * i)} className="flex items-start gap-2 text-xs text-slate-300">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-60" style={{ color: '#00E5FF' }} />
                      {c.label}
                    </motion.li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
          <ScrollText size={13} aria-hidden /> 策略调整：症状 → 诊断 → 改法
        </div>
        <div className="flex flex-col gap-2">
          {strategyTuning.slice(0, 5).map((s, i) => (
            <motion.div key={s.id} {...fade(tier, 0.06 * i)} className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2">
              <div className="text-xs font-semibold text-white">{s.signal}</div>
              <div className="text-[11px] text-slate-400">诊断：{s.diagnosis}</div>
              <div className="text-[11px] text-success">改法：{s.fix}</div>
            </motion.div>
          ))}
        </div>
        <div className="mt-3">
          <label className="mb-1 block text-[11px] text-slate-400" htmlFor="meta-log">
            今天的复盘（哪些方法有效 / 哪些词总忘 / 明天怎么调整）
          </label>
          <textarea
            id="meta-log"
            className="input-neon min-h-[76px] resize-y text-sm"
            value={log}
            onChange={(e) => setLog(e.target.value)}
            placeholder="例：音节划分对我有效；/θ/ 老读成 /s/；明天先练 10 个 th 词…"
          />
        </div>
      </div>
    </div>
  );
}

/* ---------------- 通用讲解步 ---------------- */
export function GenericStep({ method, stepIndex }: { method: Method; stepIndex: number }) {
  const tier = useMotionTier();
  const items = method.principles;

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm leading-relaxed text-slate-300">
        {method.steps[stepIndex]?.content}
      </div>
      <div className="grid gap-2.5 md:grid-cols-2">
        {items.map((p, i) => (
          <motion.div
            key={i}
            {...fade(tier, i * 0.07)}
            className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3"
          >
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-violet/20 text-xs font-bold text-violet">
              {i + 1}
            </span>
            <p className="text-sm leading-relaxed text-slate-200">{p}</p>
          </motion.div>
        ))}
      </div>
      <AnimatePresence>
        {tier === 'off' && <p className="text-xs text-slate-500">（减少动态模式：动画内容以静态文本呈现）</p>}
      </AnimatePresence>
    </div>
  );
}
