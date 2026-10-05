import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, PartyPopper, ListChecks } from 'lucide-react';
import type { Method, QuestionType } from '@/types';
import { getDemo } from '../demoConfig';
import QuestionRunner from '@/components/practice/QuestionRunner';
import TokenPlacer from '../TokenPlacer';
import ConfettiBurst from '@/components/fx/ConfettiBurst';
import { playSfx } from '@/hooks/useSfx';
import { useMotionTier } from '@/hooks/useMotionTier';
import { quizBanks } from '@/data/quizBanks';
import { words } from '@/data/words';
import { metacogChecklist } from '@/data/tools';
import { SpeakButton } from '@/components/ui/Bits';

const TYPES_BY_METHOD: Record<string, QuestionType[]> = {
  'phonetic-spelling': ['listenChoosePhoneme', 'phonemeChooseSpelling', 'spellingChoosePhoneme', 'minimalPair'],
  'phonics-syllables': ['syllableSplit', 'stressPosition', 'spellingChoosePhoneme'],
  'roots-affixes': ['affixAssemble', 'contextChoice', 'wordChoosePhoneme'],
  mnemonics: ['wordChoosePhoneme', 'contextChoice', 'listenChoosePhoneme'],
  'context-embedding': ['contextChoice', 'wordChoosePhoneme', 'wordChoosePhoneme'],
  'spaced-repetition': ['contextChoice', 'spellingChoosePhoneme', 'wordChoosePhoneme'],
  'active-output': ['contextChoice', 'affixAssemble', 'listenWriteWord'],
  metacognition: ['wordChoosePhoneme', 'contextChoice', 'syllableSplit'],
};

/** 按方法抽取 4 道题 */
function pickQuestions(methodId: string, seed: number) {
  const types = TYPES_BY_METHOD[methodId] ?? ['wordChoosePhoneme', 'contextChoice'];
  const pool = types.flatMap((t) => quizBanks[t] ?? []);
  const picked = [];
  for (let i = 0; i < Math.min(4, pool.length); i++) picked.push(pool[(seed + i * 3) % pool.length]);
  // 去重
  const seen = new Set<string>();
  return picked.filter((q) => (seen.has(q.id) ? false : (seen.add(q.id), true)));
}

/** Step 5：互动练习 —— 按方法形态分流（音节拖拽 / 词缀拼装 / 选择题 / 自查清单） */
export default function PracticeStep({ method }: { method: Method }) {
  const demo = getDemo(method.id).practice ?? { kind: 'quiz' as const };
  const tier = useMotionTier();
  const [seed, setSeed] = useState(1);
  // hooks 必须在任何分支之前调用
  const questions = useMemo(() => pickQuestions(method.id, seed), [method.id, seed]);

  if (demo.kind === 'syllable') return <SyllablePractice />;
  if (demo.kind === 'affix') return <AffixPractice wordId={demo.word ?? 'uncomfortable'} />;
  if (demo.kind === 'checklist') return <ChecklistPractice />;

  return (
    <div className="flex flex-col gap-3">
      <QuestionRunner questions={questions} heading={method.title} />
      <div className="flex justify-end">
        <button
          type="button"
          className="text-xs text-slate-400 transition hover:text-neon"
          onClick={() => {
            playSfx('click');
            setSeed((s) => s + 7);
          }}
        >
          换一组题 ↻
        </button>
      </div>
      {tier === 'off' && <p className="text-xs text-slate-400">（已开启减少动态：动画以静态方式呈现）</p>}
    </div>
  );
}

/* --------------------------------------------------------------- */
/* 音节划分 + 重音 两段式练习（自然拼读课专用）                          */
/* --------------------------------------------------------------- */
function SyllablePractice() {
  const word = words.find((w) => w.id === 'transportation') ?? {
    word: 'transportation',
    phoneticUK: '/ˌtrænspɔːˈteɪʃn/',
    syllables: ['trans', 'por', 'ta', 'tion'],
    stressIndex: 2,
  };
  const [phase, setPhase] = useState<'split' | 'stress' | 'done'>('split');
  const [burst, setBurst] = useState(0);
  const [wrongPick, setWrongPick] = useState<number | null>(null);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/12 bg-white/[0.04] p-5 backdrop-blur-xl md:p-6">
      <ConfettiBurst fireKey={burst} count={80} />
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="rounded-md bg-neon/15 px-2 py-0.5 font-semibold text-neon">音节划分 + 重音定位</span>
          <span>目标词：</span>
          <span className="font-display font-semibold text-white">{word.word}</span>
          <span className="ipa">{word.phoneticUK}</span>
        </div>
        <SpeakButton text={word.word} label={`朗读 ${word.word}`} />
      </div>

      <AnimatePresence mode="wait">
        {phase === 'split' && (
          <motion.div key="split" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -12 }}>
            <TokenPlacer
              pieces={word.syllables.map((t, i) => ({ id: `${t}-${i}`, text: t }))}
              slotCount={word.syllables.length}
              answer={word.syllables.join('-')}
              instructions="第一步：按“元音核心”把单词划分成音节（点击拼块 → 放入槽位）。"
              ruleHint="规则：数一数元音（字母组合算一个），中间辅音按“后一个音节能读出来”分配。trans-por-ta-tion 共 4 个元音 → 4 个音节。"
              onResult={(ok) => {
                if (ok) window.setTimeout(() => setPhase('stress'), 900);
              }}
            />
          </motion.div>
        )}

        {phase === 'stress' && (
          <motion.div
            key="stress"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="flex flex-col gap-4"
          >
            <p className="text-sm text-slate-300">
              <span className="mr-2 rounded-md bg-violet/15 px-2 py-0.5 text-xs font-bold text-violet-lit">第二步</span>
              点击你认为的重读音节（名词→动词？想想 -tion 后缀的重音规律）。
            </p>
            <div className="flex flex-wrap items-center gap-2.5">
              {word.syllables.map((s, i) => (
                <motion.button
                  key={`${s}-${i}`}
                  type="button"
                  onClick={() => {
                    const ok = i === word.stressIndex;
                    if (ok) {
                      playSfx('correct');
                      setBurst((b) => b + 1);
                      setPhase('done');
                    } else {
                      playSfx('wrong');
                      setWrongPick(i);
                    }
                  }}
                  whileHover={{ y: -4, scale: 1.03 }}
                  className={`rounded-2xl border px-6 py-5 font-display text-xl font-bold transition-all ${
                    wrongPick === i
                      ? 'border-danger bg-danger/12 text-danger animate-shake'
                      : 'border-white/18 bg-white/[0.05] text-white hover:border-neon/60 hover:shadow-neon'
                  }`}
                  aria-label={`选择音节 ${s} 为重音`}
                >
                  {s}
                </motion.button>
              ))}
            </div>
            <p className="text-xs text-slate-400">提示：-tion 结尾的词，重音几乎总在它前面那个音节（倒数第二音节）。</p>
          </motion.div>
        )}

        {phase === 'done' && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-3 rounded-2xl border border-success/45 bg-success/10 p-6 text-center"
          >
            <PartyPopper className="text-success" aria-hidden />
            <p className="font-display text-lg font-bold text-white">两步全对！</p>
            <p className="ipa text-sm text-neon">
              {word.word} = {word.syllables.join('-')} · 重音 #{word.stressIndex}（{word.syllables[word.stressIndex]}） →{' '}
              {word.phoneticUK}
            </p>
            <p className="text-xs text-slate-300">迁移练习：找一个 -tion 结尾的生词，重复这两步。</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* --------------------------------------------------------------- */
/* 词缀拼装练习（词根词缀课专用）                                       */
/* --------------------------------------------------------------- */
function AffixPractice({ wordId }: { wordId: string }) {
  const word = words.find((w) => w.id === wordId) ?? words.find((w) => w.roots.length >= 2)!;
  const units = word.roots;
  const [burst, setBurst] = useState(0);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/12 bg-white/[0.04] p-5 backdrop-blur-xl md:p-6">
      <ConfettiBurst fireKey={burst} count={70} />
      <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-slate-400">
        <span className="rounded-md bg-pink/15 px-2 py-0.5 font-semibold text-pink-lit">词缀拼装</span>
        <span>
          目标词：<span className="font-display font-semibold text-white">{word.word}</span>
        </span>
        <span className="ipa">{word.phoneticUK}</span>
        <SpeakButton text={word.word} size="sm" />
      </div>
      <TokenPlacer
        pieces={units.map((u) => ({ id: `${u.text}-${u.type}`, text: u.text, hint: u.meaning }))}
        slotCount={units.length}
        answer={units.map((u) => u.text).join('-')}
        instructions="把前缀 / 词根 / 后缀按构词顺序放入槽位（顺序错了也能推出词义方向）。"
        ruleHint={`结构：${units.map((u) => `${u.text}（${u.meaning}）`).join(' + ')} → ${word.meaningCN}`}
        onResult={(ok) => {
          if (ok) setBurst((b) => b + 1);
        }}
      />
      <div className="mt-4 flex flex-wrap gap-2">
        {units.map((u) => (
          <span
            key={`${u.text}-${u.type}`}
            className="rounded-lg border px-2.5 py-1 text-xs"
            style={{ borderColor: `${u.color}77`, color: u.color, background: `${u.color}15` }}
          >
            {u.type === 'prefix' ? '前缀' : u.type === 'suffix' ? '后缀' : '词根'} · {u.text} = {u.meaning}
          </span>
        ))}
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- */
/* 元认知自查清单练习                                                  */
/* --------------------------------------------------------------- */
function ChecklistPractice() {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [burst, setBurst] = useState(0);
  const all = metacogChecklist.slice(0, 6);

  const toggle = (id: string) => {
    playSfx('tick');
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      if (next.size === all.length) {
        setBurst((b) => b + 1);
        playSfx('complete');
      }
      return next;
    });
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/12 bg-white/[0.04] p-5 backdrop-blur-xl md:p-6">
      <ConfettiBurst fireKey={burst} count={70} />
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
        <ListChecks size={16} className="text-neon" aria-hidden /> 今日学习自查（勾选你真正做到的）
      </div>
      <ul className="flex flex-col gap-2">
        {all.map((item) => {
          const on = checked.has(item.id);
          return (
            <li key={item.id}>
              <motion.button
                type="button"
                onClick={() => toggle(item.id)}
                whileTap={{ scale: 0.985 }}
                className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all duration-300 ${
                  on ? 'border-success/60 bg-success/10' : 'border-white/12 bg-white/[0.04] hover:border-neon/45'
                }`}
                aria-pressed={on}
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                    on ? 'border-success bg-success/25 text-success' : 'border-white/25'
                  }`}
                >
                  {on && <Check size={13} aria-hidden />}
                </span>
                <span className={`text-sm ${on ? 'text-white' : 'text-slate-300'}`}>{item.label}</span>
                <span className="ml-auto text-xs uppercase tracking-wider text-slate-400">{item.group}</span>
              </motion.button>
            </li>
          );
        })}
      </ul>
      <p className="mt-4 text-xs text-slate-400">
        元认知要义：不是“学了多久”，而是“是否监控到自己的薄弱点并调整了策略”。
      </p>
    </div>
  );
}
