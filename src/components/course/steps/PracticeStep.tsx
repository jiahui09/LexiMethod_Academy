import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ListChecks } from 'lucide-react';
import type { Method, QuestionType } from '@/types';
import { getDemo } from '../demoConfig';
import QuestionRunner from '@/components/practice/QuestionRunner';
import TokenPlacer from '../TokenPlacer';
import { playSfx } from '@/hooks/useSfx';
import { useMotionTier } from '@/hooks/useMotionTier';
import { quizBanks } from '@/data/quizBanks';
import { words } from '@/data/words';
import { metacogChecklist } from '@/data/tools';
import { SpeakButton, EduStamp } from '@/components/edu';

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

/**
 * 步 5：互动练习 —— 按方法形态分流（音节拖拽 / 词缀拼装 / 选择题 / 自查清单）。
 * 反馈编码：正确 = 结构蓝 + ✓，错误 = 批注红 + ✗/抖动，当前选中 = 批注红描边；
 * 拼块与清单皆发丝线分区，动效只动 opacity / y / scale。
 */
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
      <QuestionRunner questions={questions} heading={method.title} tone="paper" />
      <div className="flex justify-end">
        <button
          type="button"
          className="text-[13px] text-colophon transition-colors hover:text-rubric"
          onClick={() => {
            playSfx('click');
            setSeed((s) => s + 7);
          }}
        >
          换一组题
        </button>
      </div>
      {tier === 'off' && <p className="text-xs text-colophon">（已开启减少动态：动画以静态方式呈现）</p>}
    </div>
  );
}

/* --------------------------------------------------------------- */
/* 音节划分 + 重音 两段式练习（自然拼读课专用）                          */
/* --------------------------------------------------------------- */
function SyllablePractice() {
  const tier = useMotionTier();
  const word = words.find((w) => w.id === 'transportation') ?? {
    word: 'transportation',
    phoneticUK: '/ˌtrænspɔːˈteɪʃn/',
    syllables: ['trans', 'por', 'ta', 'tion'],
    stressIndex: 2,
  };
  const [phase, setPhase] = useState<'split' | 'stress' | 'done'>('split');
  const [wrongPick, setWrongPick] = useState<number | null>(null);

  return (
    <div className="rounded-[4px] border border-rule bg-bone2/60 p-5 md:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-xs text-colophon">
          <span className="rounded-[3px] border border-rule bg-bone px-2.5 py-0.5 font-semibold text-cobalt">
            音节划分 + 重音定位
          </span>
          <span>目标词：</span>
          <span className="font-serif font-semibold text-paperink">{word.word}</span>
          <span className="ipa">{word.phoneticUK}</span>
        </div>
        <SpeakButton text={word.word} label={`朗读 ${word.word}`} />
      </div>

      <AnimatePresence mode="wait">
        {phase === 'split' && (
          <motion.div
            key="split"
            initial={tier === 'off' ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -12 }}
          >
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
            initial={tier === 'off' ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="flex flex-col gap-4"
          >
            <p className="text-sm leading-[1.85] text-paperink">
              <span className="mr-2 rounded-[3px] border border-rule bg-bone px-2 py-0.5 text-xs font-bold text-cobalt">
                第二步
              </span>
              点击你认为的重读音节（名词→动词？想想 -tion 后缀的重音规律）。
            </p>
            <div className="flex flex-wrap items-center gap-2.5">
              {word.syllables.map((s, i) => (
                <button
                  key={`${s}-${i}`}
                  type="button"
                  onClick={() => {
                    const ok = i === word.stressIndex;
                    if (ok) {
                      playSfx('correct');
                      setPhase('done');
                    } else {
                      playSfx('wrong');
                      setWrongPick(i);
                    }
                  }}
                  className={`flex items-center gap-1.5 rounded-[4px] border px-6 py-5 font-serif text-xl font-bold transition-colors duration-200 ${
                    wrongPick === i
                      ? 'animate-shake border-rubric bg-rubric/[0.08] text-rubric'
                      : 'border-rule bg-bone text-paperink hover:border-paperink/50'
                  }`}
                  aria-label={`选择音节 ${s} 为重音`}
                >
                  {wrongPick === i && (
                    <span className="text-sm" aria-hidden>
                      ✗
                    </span>
                  )}
                  {s}
                </button>
              ))}
            </div>
            <p className="text-xs text-colophon">提示：-tion 结尾的词，重音几乎总在它前面那个音节（倒数第二音节）。</p>
          </motion.div>
        )}

        {phase === 'done' && (
          <motion.div
            key="done"
            initial={tier === 'off' ? false : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-3 rounded-[4px] border border-cobalt/45 bg-bone2/70 p-6 text-center"
          >
            <EduStamp label="全对" />
            <p className="text-lg font-bold text-paperink">两步全对！</p>
            <p className="ipa text-sm text-cobalt">
              {word.word} = {word.syllables.join('-')} · 重音 #{word.stressIndex}（{word.syllables[word.stressIndex]}） →{' '}
              {word.phoneticUK}
            </p>
            <p className="text-xs text-colophon">迁移练习：找一个 -tion 结尾的生词，重复这两步。</p>
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

  return (
    <div className="rounded-[4px] border border-rule bg-bone2/60 p-5 md:p-6">
      <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-colophon">
        <span className="rounded-[3px] border border-rule bg-bone px-2.5 py-0.5 font-semibold text-cobalt">词缀拼装</span>
        <span>
          目标词：<span className="font-serif font-semibold text-paperink">{word.word}</span>
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
      />
      <div className="mt-4 flex flex-wrap gap-2">
        {units.map((u) => (
          <span
            key={`${u.text}-${u.type}`}
            className="rounded-[4px] border border-rule bg-bone px-2.5 py-1 text-xs text-colophon"
          >
            <b className="font-semibold text-cobalt">{u.type === 'prefix' ? '前缀' : u.type === 'suffix' ? '后缀' : '词根'}</b>{' '}
            · {u.text} = {u.meaning}
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
  const all = metacogChecklist.slice(0, 6);

  const toggle = (id: string) => {
    playSfx('tick');
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      if (next.size === all.length) playSfx('complete');
      return next;
    });
  };

  return (
    <div className="rounded-[4px] border border-rule bg-bone2/60 p-5 md:p-6">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-paperink">
        <ListChecks size={16} className="text-cobalt" aria-hidden /> 今日学习自查（勾选你真正做到的）
      </div>
      <ul className="flex flex-col gap-2">
        {all.map((item) => {
          const on = checked.has(item.id);
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => toggle(item.id)}
                className={`flex w-full items-center gap-3 rounded-[4px] border px-4 py-3 text-left transition-colors duration-200 ${
                  on ? 'border-cobalt/55 bg-bone' : 'border-rule bg-bone/60 hover:border-colophon/50'
                }`}
                aria-pressed={on}
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-[2px] border ${
                    on ? 'border-cobalt bg-cobalt/[0.12] text-cobalt' : 'border-paperink/40'
                  }`}
                >
                  {on && <Check size={13} aria-hidden />}
                </span>
                <span className={`text-sm ${on ? 'text-paperink' : 'text-colophon'}`}>{item.label}</span>
                <span className="ml-auto text-xs text-colophon">{item.group}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <p className="mt-4 text-xs leading-[1.8] text-colophon">
        元认知要义：不是“学了多久”，而是“是否监控到自己的薄弱点并调整了策略”。
      </p>
    </div>
  );
}
