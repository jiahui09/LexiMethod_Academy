import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scissors,
  ArrowUpDown,
  StickyNote,
  Repeat,
  Send,
  BrainCircuit,
  Search,
  Shuffle,
  Volume2,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  syllableGuides,
  stressGuides,
  contextNotes,
  metacogChecklist,
  strategyTuning,
  reviewRhythm,
  outputDrills,
} from '@/data/tools';
import { prefixes, suffixes, roots } from '@/data/affixes';
import { words } from '@/data/words';
import { syllabify, stressMarked } from '@/lib/syllabify';
import { SpeakButton } from '@/components/ui/Bits';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import NeonButton from '@/components/ui/NeonButton';
import { playSfx } from '@/hooks/useSfx';
import { useMotionTier } from '@/hooks/useMotionTier';

type TabKey = 'syllable' | 'stress' | 'affix' | 'context' | 'rhythm' | 'output' | 'metacog';

const TABS: { key: TabKey; label: string; icon: typeof Scissors }[] = [
  { key: 'syllable', label: '音节划分器', icon: Scissors },
  { key: 'stress', label: '重音查询', icon: ArrowUpDown },
  { key: 'affix', label: '词根词缀检索', icon: Search },
  { key: 'context', label: '语境笔记', icon: StickyNote },
  { key: 'rhythm', label: '复习节奏', icon: Repeat },
  { key: 'output', label: '输出训练', icon: Send },
  { key: 'metacog', label: '元认知清单', icon: BrainCircuit },
];

/** 分区块：发丝线方块（纸面唯一容器形态，块内条目只用发丝线分隔，不叠卡） */
const PANEL = 'rounded-[3px] border border-rule bg-bone2/50 p-5';

/** 方法工具箱（辞书纸面版式） */
export default function Toolbox() {
  const tier = useMotionTier();
  const [tab, setTab] = useState<TabKey>('syllable');

  return (
    <div className="flex flex-col gap-6">
      {/* 卷首题名：面包屑 + 词头 h1（纸面上方绝不做眉标）+ 唯一去向 */}
      <header className="border-b border-rule pb-5">
        <Breadcrumbs tone="paper" items={[{ label: '学习地图', to: '/' }, { label: '方法工具箱' }]} />
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold leading-tight text-paperink md:text-3xl">
              方法工具箱：把方法做成顺手的工具
            </h1>
            <p className="mt-2 max-w-[68ch] text-[15px] leading-[1.85] text-colophon">
              七个工具对应七个学习动作：划音节、定重音、拆词缀、写语境笔记、按节奏复习、逼自己输出、元认知复盘。工具只提供结构，判断仍由你完成。
            </p>
          </div>
          <Link
            to="/practice"
            className="inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-[3px] border border-rule px-4 py-2.5 text-sm text-paperink transition-colors hover:bg-bone2"
          >
            下一步 · 去互动训练 <ArrowRight size={14} aria-hidden />
          </Link>
        </div>
      </header>

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="工具箱分组">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => {
              playSfx('click');
              setTab(t.key);
            }}
            className={`flex min-h-[44px] items-center gap-2 rounded-[3px] border px-4 py-2.5 text-sm transition-colors duration-300 ${
              tab === t.key
                ? 'border-rubric bg-rubric/[0.07] font-semibold text-rubric'
                : 'border-rule text-colophon hover:border-paperink hover:text-paperink'
            }`}
          >
            <t.icon size={15} aria-hidden />
            {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={tier === 'off' ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={tier === 'off' ? undefined : { opacity: 0, y: -10 }}
          transition={{ duration: 0.32 }}
        >
          {tab === 'syllable' && <SyllableTool />}
          {tab === 'stress' && <StressTool />}
          {tab === 'affix' && <AffixTool />}
          {tab === 'context' && <ContextTool />}
          {tab === 'rhythm' && <RhythmTool />}
          {tab === 'output' && <OutputTool />}
          {tab === 'metacog' && <MetacogTool />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ---------------- 音节划分器 ---------------- */
function SyllableTool() {
  const [input, setInput] = useState('construction');
  const parts = useMemo(() => syllabify(input), [input]);
  const stress = useMemo(() => {
    const w = input.trim().toLowerCase().replace(/[^a-z]/g, '');
    const known = words.find((x) => x.id === w);
    if (known) return known.stressIndex;
    // 启发式：两音节动词后重音，名词前重音
    return parts.length >= 3 ? parts.length - 3 : parts.length > 1 ? 0 : 0;
  }, [input, parts]);

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div className={PANEL}>
        <div className="mb-3 text-sm font-semibold text-paperink">输入单词，自动划音节</div>
        <div className="mb-4 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="edu-input flex-1"
            placeholder="输入任意英文单词"
            aria-label="要划分的单词"
            spellCheck={false}
          />
          <NeonButton
            variant="ghost"
            onClick={() => {
              playSfx('tick');
              setInput(words[Math.floor(Math.random() * words.length)].word);
            }}
          >
            <Shuffle size={14} aria-hidden /> 随机
          </NeonButton>
        </div>

        <div className="mb-4 flex min-h-[72px] flex-wrap items-center gap-2 rounded-[3px] border border-rule bg-[#FDFBF5] p-4">
          {parts.map((p, i) => (
            <motion.span
              key={`${p}-${i}`}
              initial={{ opacity: 0, y: 14, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: i * 0.07, type: 'spring', stiffness: 280, damping: 22 }}
              className={`rounded-[3px] border px-3 py-2 font-serif text-lg font-bold ${
                i === stress ? 'border-rubric bg-rubric/[0.07] text-rubric' : 'border-rule bg-transparent text-paperink'
              }`}
              aria-label={`第 ${i + 1} 音节 ${p}${i === stress ? ' 重读' : ''}`}
            >
              {i === stress && <span className="mr-0.5 text-sm">ˈ</span>}
              {p}
            </motion.span>
          ))}
        </div>

        <p className="text-xs leading-relaxed text-colophon">
          标记形式：<span className="ipa text-rubric">{stressMarked(parts, stress)}</span>
          <br />
          算法：找元音核心 → 辅音串里能当“起音”的部分归下个音节 → 剩下的闭音节。
          <span className="text-rubric"> 例外词（如 psychology、queue）仍需人工判断。</span>
        </p>
      </div>

      <div className={PANEL}>
        <div className="mb-3 text-sm font-semibold text-paperink">划分指南</div>
        <div className="flex flex-col">
          {syllableGuides.map((g) => (
            <div key={g.id} className="border-t border-rule py-3 first:border-t-0 first:pt-0">
              <div className="mb-1 text-sm font-semibold text-cobalt">{g.title}</div>
              <p className="mb-1.5 text-xs leading-relaxed text-colophon">{g.rule}</p>
              <div className="flex flex-wrap gap-1.5">
                {g.examples.map((e) => (
                  <span key={e} className="ipa rounded-[2px] border border-rule px-2 py-0.5 text-xs text-colophon">
                    {e}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- 重音查询 ---------------- */
function StressTool() {
  const [q, setQ] = useState('');
  const hits = useMemo(
    () => (q.trim() ? words.filter((w) => w.word.includes(q.trim().toLowerCase())) : words),
    [q],
  );

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
      <div className={PANEL}>
        <div className="mb-3 flex items-center gap-2">
          <Search size={15} className="text-colophon" aria-hidden />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="edu-input flex-1"
            placeholder="搜索词库（30 词）看音节与重音"
            aria-label="搜索单词"
          />
        </div>
        <div className="flex flex-col divide-y divide-rule">
          {hits.length === 0 && <p className="py-2 text-sm text-colophon">没有匹配的词。</p>}
          {hits.map((w) => (
            <div key={w.id} className="flex flex-wrap items-center gap-3 px-0 py-3">
              <span className="font-serif text-base font-semibold text-paperink">{w.word}</span>
              <SpeakButton text={w.word} size="sm" tone="paper" className="min-h-[44px] min-w-[44px]" />
              <span className="ipa text-xs text-rubric">{w.phoneticUK}</span>
              <div className="flex gap-1">
                {w.syllables.map((s, i) => (
                  <span
                    key={i}
                    className={`rounded-[2px] border px-2 py-0.5 text-xs ${
                      i === w.stressIndex
                        ? 'border-rubric bg-rubric/[0.07] font-bold text-rubric'
                        : 'border-rule text-colophon'
                    }`}
                  >
                    {i === w.stressIndex && 'ˈ'}
                    {s}
                  </span>
                ))}
              </div>
              <span className="ml-auto flex items-center gap-1.5 text-xs text-colophon">
                <Volume2 size={11} aria-hidden /> {w.partOfSpeech} · {w.meaningCN}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className={`${PANEL} h-fit`}>
        <div className="mb-3 text-sm font-semibold text-paperink">重音规则速查</div>
        <div className="flex flex-col">
          {stressGuides.map((g) => (
            <div key={g.id} className="border-t border-rule py-3 first:border-t-0 first:pt-0">
              <div className="mb-1 text-sm font-semibold text-cobalt">{g.title}</div>
              <p className="mb-1.5 text-xs leading-relaxed text-colophon">{g.rule}</p>
              <div className="flex flex-wrap gap-1.5">
                {g.examples.map((e) => (
                  <span key={e} className="rounded-[2px] border border-rule px-2 py-0.5 text-xs text-colophon">
                    {e}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- 词根词缀检索 ---------------- */
function AffixTool() {
  const [q, setQ] = useState('');
  const query = q.trim().toLowerCase();

  const hit = <T extends { text?: string; meaning?: string; examples?: string[] }>(arr: T[], keys: (keyof T)[]) =>
    query
      ? arr.filter((x) =>
          keys.some((k) => String(x[k] ?? '').toLowerCase().includes(query)),
        )
      : arr;

  const pHits = hit(prefixes, ['text', 'meaning']);
  const sHits = hit(suffixes, ['text', 'meaning']);
  const rHits = hit(roots, ['text', 'meaning']);

  const Card = ({ text, meaning, examples }: { text: string; meaning: string; examples?: string[] }) => (
    <div className="rounded-[3px] border border-rule p-3.5 transition-colors hover:border-paperink">
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="font-serif text-base font-bold text-paperink">
          {text}
        </span>
        <span className="text-xs text-colophon">{meaning}</span>
      </div>
      {examples && examples.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {examples.slice(0, 4).map((e) => (
            <span key={e} className="rounded-[2px] border border-rule px-2 py-0.5 text-xs text-colophon">
              {e}
            </span>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3 rounded-[3px] border border-rule bg-bone2/50 p-4">
        <Search size={16} className="text-colophon" aria-hidden />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="edu-input flex-1"
          placeholder="搜索含义或形式，如 spect / 看、-tion / 名词"
          aria-label="搜索词根词缀"
        />
        <span className="text-xs text-colophon tabular-nums">
          前缀 {pHits.length} · 后缀 {sHits.length} · 词根 {rHits.length}
        </span>
      </div>

      <section>
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-paperink">
          <span className="rounded-[2px] border border-cobalt/50 px-2 py-0.5 text-xs font-semibold text-cobalt">前缀</span>{' '}
          改变词义
        </div>
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {pHits.map((p, i) => (
            <Card key={`${p.text}-${i}`} text={p.text} meaning={p.meaning} examples={p.examples} />
          ))}
        </div>
      </section>

      <section>
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-paperink">
          <span className="rounded-[2px] border border-cobalt/50 px-2 py-0.5 text-xs font-semibold text-cobalt">后缀</span>{' '}
          改变词性 / 引申义
        </div>
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {sHits.map((p, i) => (
            <Card key={`${p.text}-${i}`} text={p.text} meaning={p.meaning} examples={p.examples} />
          ))}
        </div>
      </section>

      <section>
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-paperink">
          <span className="rounded-[2px] border border-cobalt/50 px-2 py-0.5 text-xs font-semibold text-cobalt">词根</span>{' '}
          决定核心义
        </div>
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {rHits.map((p, i) => (
            <Card key={`${p.text}-${i}`} text={p.text} meaning={p.meaning} examples={p.examples} />
          ))}
        </div>
      </section>
    </div>
  );
}

/* ---------------- 语境笔记（零存储：仅存内存，刷新即清空） ---------------- */
function ContextTool() {
  const [note, setNote] = useState('');

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div className={PANEL}>
        <div className="mb-3 text-sm font-semibold text-paperink">我的语境笔记（本次会话）</div>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={8}
          className="edu-input w-full resize-y"
          placeholder={'写下你今天遇到的词 + 它出现的真实句子，例如：\nI couldn\'t make out his handwriting.\nmake out = 辨认出（不是“制作出”）'}
          aria-label="语境笔记"
        />
        <div className="mt-3 flex items-center gap-3">
          <span className="text-xs text-colophon">
            {note ? `已记录 ${note.length} 字` : '还没有内容'} · 零存储，刷新即清空（本站不写浏览器存储）
          </span>
        </div>
      </div>

      <div className={PANEL}>
        <div className="mb-3 text-sm font-semibold text-paperink">语境记忆 5 条操作法</div>
        <div className="flex flex-col">
          {contextNotes.map((n) => (
            <div key={n.id} className="border-t border-rule py-3 first:border-t-0 first:pt-0">
              <div className="mb-1 text-sm font-semibold text-cobalt">{n.title}</div>
              <p className="text-xs leading-relaxed text-colophon">{n.note}</p>
              <p className="mt-1.5 border-t border-rule pt-1.5 text-xs text-colophon">
                {n.example}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- 复习节奏 ---------------- */
function RhythmTool() {
  const gaps = [1, 6, 15, 29];
  return (
    <div className="flex flex-col gap-5">
      <div className={PANEL}>
        <div className="mb-4 text-sm font-semibold text-paperink">间隔重复时间轴（今天 = 第 0 天）</div>
        <div className="relative mb-2 h-14">
          <div className="absolute left-0 right-0 top-6 h-px bg-rule" aria-hidden />
          {[0, ...gaps].map((d, i) => (
            <div key={d} className="absolute top-0 flex -translate-x-1/2 flex-col items-center" style={{ left: `${(i / 4) * 100}%` }}>
              <span
                className={`rounded-[2px] px-2 py-0.5 text-xs font-bold ${
                  i === 0 ? 'bg-rubric text-bone' : 'border border-rule text-colophon'
                }`}
              >
                第 {d} 天
              </span>
              <span
                className={`mt-1.5 h-3 w-3 rounded-full ${i === 0 ? 'bg-rubric' : 'bg-paperink'}`}
                aria-hidden
              />
            </div>
          ))}
        </div>
        <p className="text-xs text-colophon">间隔天数为 1 / 3 / 7 / 14 / 30 天（共 5 档），到期卡片进入「复习中心」。</p>
      </div>

      <div className="grid gap-3 md:grid-cols-5">
        {reviewRhythm.map((r) => (
          <div key={r.id} className="rounded-[3px] border border-rule bg-bone2/50 p-4">
            <div className="mb-1 font-serif text-lg font-bold text-paperink">第 {r.day} 天</div>
            <div className="mb-1.5 text-xs font-semibold text-cobalt">{r.focus}</div>
            <p className="text-xs leading-relaxed text-colophon">{r.action}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- 输出训练 ---------------- */
function OutputTool() {
  const [drill, setDrill] = useState(() => outputDrills[0]);
  const [sentence, setSentence] = useState('');

  const roll = () => {
    playSfx('reveal');
    setDrill(outputDrills[Math.floor(Math.random() * outputDrills.length)]);
  };

  const used = useMemo(() => {
    const n = (sentence.match(/[A-Za-z']+/g) ?? []).length;
    return n;
  }, [sentence]);

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div className={PANEL}>
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="text-sm font-semibold text-paperink">今日输出任务</span>
          <NeonButton size="sm" variant="ghost" onClick={roll}>
            <Shuffle size={13} aria-hidden /> 换一个
          </NeonButton>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={drill.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="border-t border-rule pt-3"
          >
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-[2px] border border-rule px-2 py-0.5 text-xs text-colophon">
                {drill.difficulty}
              </span>
              <span className="text-sm font-semibold text-paperink">{drill.title}</span>
            </div>
            <p className="text-sm leading-relaxed text-colophon">{drill.prompt}</p>
          </motion.div>
        </AnimatePresence>

        <textarea
          value={sentence}
          onChange={(e) => setSentence(e.target.value)}
          rows={5}
          className="edu-input mt-4 w-full resize-y"
          placeholder="在这里写你的句子 / 造句 / 复述…"
          aria-label="输出内容"
        />
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className={used >= 4 ? 'text-cobalt' : 'text-colophon'}>
            当前 {used} 词 {used >= 4 ? '✓ 达标（≥4 词）' : '· 建议至少 4 词'}
          </span>
          <NeonButton
            size="sm"
            disabled={used < 4}
            onClick={() => {
              playSfx('complete');
              setSentence('');
            }}
          >
            完成输出 +1
          </NeonButton>
        </div>
      </div>

      <div className={PANEL}>
        <div className="mb-3 text-sm font-semibold text-paperink">输出强度阶梯</div>
        <div className="flex flex-col">
          {outputDrills.map((d) => (
            <div
              key={d.id}
              className={`border-t border-rule py-3 first:border-t-0 first:pt-0 ${
                d.id === drill.id ? 'border-l-2 border-l-rubric pl-2.5' : ''
              }`}
            >
              <div className="mb-0.5 flex items-center gap-2 text-sm">
                <span className={d.id === drill.id ? 'font-semibold text-rubric' : 'font-semibold text-paperink'}>
                  {d.title}
                </span>
                <span className="text-xs text-colophon">{d.difficulty}</span>
              </div>
              <p className="text-xs leading-relaxed text-colophon">{d.prompt}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- 元认知 ---------------- */
function MetacogTool() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const groups: Array<'识别'|'计划'|'监控'|'复盘'> = ['识别', '计划', '监控', '复盘'];
  const total = metacogChecklist.length;
  const done = Object.values(checked).filter(Boolean).length;

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div className={PANEL}>
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-semibold text-paperink">学习前后自查清单</span>
          <span className={`text-xs tabular-nums ${done === total ? 'text-cobalt' : 'text-colophon'}`}>
            {done} / {total}
          </span>
        </div>
        <div className="mb-4 h-1.5 overflow-hidden bg-rule">
          <motion.div
            className="h-full bg-cobalt"
            animate={{ width: `${(done / total) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        <div className="flex flex-col gap-4">
          {groups.map((g) => {
            const items = metacogChecklist.filter((m) => m.group === g);
            if (!items.length) return null;
            return (
              <div key={g}>
                <div className="mb-1.5 text-xs font-semibold text-cobalt">{g}</div>
                <div className="flex flex-col divide-y divide-rule">
                  {items.map((m) => (
                    <label
                      key={m.id}
                      className="flex cursor-pointer items-start gap-2.5 px-0 py-2.5 text-xs text-paperink transition-colors hover:text-rubric"
                    >
                      <input
                        type="checkbox"
                        checked={Boolean(checked[m.id])}
                        onChange={() => {
                          playSfx('tick');
                          setChecked((c) => ({ ...c, [m.id]: !c[m.id] }));
                        }}
                        className="mt-0.5 accent-[#1E4B7A]"
                      />
                      <span className={checked[m.id] ? 'text-colophon line-through' : ''}>{m.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={PANEL}>
        <div className="mb-3 text-sm font-semibold text-paperink">策略调优：出现这个信号 → 怎么改</div>
        <div className="flex flex-col">
          {strategyTuning.map((s) => (
            <div key={s.id} className="border-t border-rule py-3 first:border-t-0 first:pt-0">
              <div className="mb-1 flex items-start gap-2 text-xs">
                <span className="rounded-[2px] border border-rubric px-2 py-0.5 font-semibold text-rubric">信号</span>
                <span className="text-colophon">{s.signal}</span>
              </div>
              <div className="mb-1 flex items-start gap-2 text-xs">
                <span className="rounded-[2px] border border-rule px-2 py-0.5 font-semibold text-paperink">诊断</span>
                <span className="text-colophon">{s.diagnosis}</span>
              </div>
              <div className="flex items-start gap-2 text-xs">
                <span className="rounded-[2px] border border-cobalt px-2 py-0.5 font-semibold text-cobalt">调整</span>
                <span className="text-colophon">{s.fix}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
