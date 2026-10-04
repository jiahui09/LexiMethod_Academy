import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, ChevronRight, Eye, PenLine, BookOpenCheck, PartyPopper, RotateCcw } from 'lucide-react';
import type { WordExample } from '@/types';
import { words } from '@/data/words';
import { playSfx } from '@/hooks/useSfx';
import { useMotionTier } from '@/hooks/useMotionTier';
import { useProgress } from '@/store/progressStore';
import { useSpeech } from '@/hooks/useSpeech';
import NeonButton from '@/components/ui/NeonButton';
import ConfettiBurst from '@/components/fx/ConfettiBurst';
import { SpeakButton } from '@/components/ui/Bits';

type StepDef = {
  key: string;
  title: string;
  question: string;
  hint: string;
  input: 'choice' | 'text' | 'longtext' | 'reveal';
  options?: string[];
  placeholder?: string;
};

const STEPS: StepDef[] = [
  {
    key: 'pos',
    title: '① 判断词性',
    question: '这个词最可能是什么词性？（决定它在句子里的位置）',
    hint: '看词尾：-tion/-ness/-ity 多为名词；-ful/-ous/-ive 多为形容词；-ly 多为副词；-ize/-ate 常为动词。再看它在句子里会充当什么成分。',
    input: 'choice',
    options: ['名词 n.', '动词 v.', '形容词 adj.', '副词 adv.'],
  },
  {
    key: 'syllable',
    title: '② 划音节、标重音',
    question: '按“元音核心”划分音节，并标出你认为的重读音节（用 - 分隔，重读前加 ˈ）',
    hint: '先数元音核心（字母组合算一个），有几个元音就有几个音节；再用 VCCV / VCV 规则分配辅音；-tion 结尾重音在倒数第二音节。',
    input: 'text',
    placeholder: '例：in-com-pre-hen-si-ble（ˈ重音写在音节前）',
  },
  {
    key: 'morpheme',
    title: '③ 拆词根词缀',
    question: '把它拆成前缀 / 词根 / 后缀，并写出每一部分的意思',
    hint: '先找熟的：un-/in-/re-/trans-/dis- 是前缀；-tion/-able/-ness/-ity 是后缀；剩下的核心多半是词根，联想你认识的同源词。',
    input: 'text',
    placeholder: '例：in-（不）+ prehen（抓）+ -sible（能…的）',
  },
  {
    key: 'guess',
    title: '④ 猜意思',
    question: '根据上面的拆解，写出你推测的中文意思（大胆猜，允许不完美）',
    hint: '把各部分的意思拼起来：方向（前缀）+ 核心（词根）+ 词性（后缀）。不确定时写出“最可能的两种理解”。',
    input: 'text',
    placeholder: '我的推测：…',
  },
  {
    key: 'verify',
    title: '⑤ 查词典验证',
    question: '打开你的词典核对（内置词典只覆盖示例词库）。对比你的猜测与真实释义，标出猜错的部分。',
    hint: '重点不是“对没对”，而是“哪一步推理出了偏差”——是词性判断错、词根认错，还是忽略了前缀方向？',
    input: 'reveal',
  },
  {
    key: 'output',
    title: '⑥ 造句输出',
    question: '用这个词造一个自己生活里的句子（把被动词汇变成主动词汇）',
    hint: '句子要包含一个搭配（collocation），并尽量用刚学的音节/重音读出来一次。',
    input: 'longtext',
    placeholder: 'I believe ...',
  },
];

type Props = {
  wordId: string;
  compact?: boolean;
  onDone?: () => void;
};

/** 实战分析向导：只给方法和提示，不直接给答案 */
export default function WordAnalysisWizard({ wordId, compact = false, onDone }: Props) {
  const tier = useMotionTier();
  const { speak } = useSpeech();
  const addAnalyzedWord = useProgress((s) => s.addAnalyzedWord);
  const dict: WordExample | undefined = useMemo(() => words.find((w) => w.id === wordId), [wordId]);
  const word = dict?.word ?? wordId;

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [hints, setHints] = useState<Record<string, boolean>>({});
  const [revealed, setRevealed] = useState(false);
  const [burst, setBurst] = useState(0);
  const [finished, setFinished] = useState(false);

  const def = STEPS[step];
  const value = answers[def?.key ?? ''] ?? '';

  const setAnswer = (k: string, v: string) => setAnswers((a) => ({ ...a, [k]: v }));

  const canNext =
    def?.input === 'reveal' ? revealed : def?.input === 'choice' ? Boolean(value) : value.trim().length > 0;

  const goNext = () => {
    if (!def) return;
    playSfx('click');
    if (step + 1 >= STEPS.length) {
      setFinished(true);
      setBurst((b) => b + 1);
      playSfx('complete');
      addAnalyzedWord(word);
      onDone?.();
    } else {
      setStep((s) => s + 1);
    }
  };

  if (finished) {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-success/40 bg-success/[0.07] p-6">
        <ConfettiBurst fireKey={burst} count={90} />
        <div className="flex items-center gap-2 font-display text-lg font-bold text-white">
          <PartyPopper className="text-success" aria-hidden /> 分析完成
        </div>
        <div className="mt-4 grid gap-2 text-sm">
          {STEPS.slice(0, 4).map((s) => (
            <div key={s.key} className="flex flex-wrap gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2">
              <span className="text-slate-400">{s.title}</span>
              <span className="text-white">{answers[s.key] || '（未填）'}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <NeonButton
            size="sm"
            variant="ghost"
            onClick={() => {
              setStep(0);
              setFinished(false);
              setAnswers({});
              setRevealed(false);
              setHints({});
            }}
          >
            <RotateCcw size={13} aria-hidden /> 再分析一个
          </NeonButton>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/12 bg-white/[0.04] p-5 backdrop-blur-xl md:p-6">
      <ConfettiBurst fireKey={burst} count={70} />

      {/* 头部 */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="rounded-md bg-pink/15 px-2 py-0.5 font-semibold text-pink">实战演练</span>
          <span>生词：</span>
          <span className="font-display text-base font-semibold text-white">{word}</span>
          {dict && <span className="ipa">{dict.phoneticUK}</span>}
          <SpeakButton text={word} size="sm" />
        </div>
        <div className="flex items-center gap-1" aria-label="分析进度">
          {STEPS.map((s, i) => (
            <span
              key={s.key}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: i === step ? 22 : 10,
                background: i < step ? '#00E676' : i === step ? '#00E5FF' : 'rgba(255,255,255,0.16)',
              }}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={def.key}
          initial={tier === 'off' ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={tier === 'off' ? undefined : { opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-4"
        >
          <div>
            <h4 className="font-display text-lg font-bold text-white">{def.title}</h4>
            <p className="mt-1 text-sm text-slate-300/90">{def.question}</p>
          </div>

          {/* 输入区 */}
          {def.input === 'choice' && (
            <div className="flex flex-wrap gap-2">
              {def.options!.map((o) => (
                <motion.button
                  key={o}
                  type="button"
                  whileHover={{ y: -2 }}
                  onClick={() => {
                    playSfx('tick');
                    setAnswer(def.key, o);
                  }}
                  className={`rounded-xl border px-4 py-2.5 text-sm transition-all ${
                    value === o
                      ? 'border-neon bg-neon/15 text-white shadow-neon'
                      : 'border-white/15 bg-white/[0.05] text-slate-300 hover:border-neon/50'
                  }`}
                  aria-pressed={value === o}
                >
                  {o}
                </motion.button>
              ))}
            </div>
          )}

          {(def.input === 'text' || def.input === 'longtext') &&
            (def.input === 'longtext' ? (
              <textarea
                className="input-neon min-h-[96px] resize-y font-sans"
                value={value}
                onChange={(e) => setAnswer(def.key, e.target.value)}
                placeholder={def.placeholder}
                aria-label={def.question}
              />
            ) : (
              <input
                className="input-neon font-mono"
                value={value}
                onChange={(e) => setAnswer(def.key, e.target.value)}
                placeholder={def.placeholder}
                aria-label={def.question}
              />
            ))}

          {def.input === 'reveal' && (
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap gap-2">
                <NeonButton
                  size="sm"
                  onClick={() => {
                    setRevealed(true);
                    playSfx('reveal');
                  }}
                  disabled={revealed}
                >
                  <Eye size={14} aria-hidden /> {revealed ? '已核对' : '对照内置词典'}
                </NeonButton>
                {dict && <SpeakButton text={dict.word} label="播放发音" />}
              </div>

              <AnimatePresence>
                {revealed && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="rounded-2xl border border-neon/35 bg-neon/[0.07] p-4 text-sm">
                      <div className="mb-1 flex items-center gap-2 font-semibold text-neon">
                        <BookOpenCheck size={14} aria-hidden /> 词典核对
                      </div>
                      {dict ? (
                        <div className="flex flex-col gap-1.5 text-slate-200">
                          <div>
                            <span className="ipa text-neon">{dict.phoneticUK}</span>
                            <span className="ml-2 text-slate-400">{dict.partOfSpeech}</span>
                          </div>
                          <div>词典释义：{dict.meaningCN}</div>
                          <div className="text-xs text-slate-400">你的猜测：{answers.guess || '（未填写）'}</div>
                          <div className="text-xs text-slate-400">
                            拆解核对：{dict.roots.map((r) => `${r.text}(${r.meaning})`).join(' + ')}
                          </div>
                          <div className="text-xs text-slate-400">
                            你拆的结构：{answers.morpheme || '（未填写）'}
                          </div>
                        </div>
                      ) : (
                        <p className="text-slate-300">
                          内置词典未收录 <b className="text-white">{word}</b>（这正是本课的目的：分析方法可迁移）。请用
                          纸质 / 在线词典查证，把真实释义抄写在下一行：
                          <input
                            className="input-neon mt-2"
                            value={answers.dictReal ?? ''}
                            onChange={(e) => setAnswer('dictReal', e.target.value)}
                            placeholder="词典真实释义…"
                          />
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* 提示（只给方法，不给答案） */}
          <div className="flex flex-wrap items-start gap-3">
            <button
              type="button"
              onClick={() => {
                playSfx('reveal');
                setHints((h) => ({ ...h, [def.key]: true }));
              }}
              className="flex items-center gap-1.5 rounded-xl border border-warn/40 bg-warn/10 px-3 py-2 text-xs text-warn transition hover:bg-warn/20"
            >
              <Lightbulb size={13} aria-hidden /> {hints[def.key] ? '提示已展开' : '要提示吗？'}
            </button>
            <AnimatePresence>
              {hints[def.key] && (
                <motion.p
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 border-l-2 border-warn/60 pl-3 text-xs leading-relaxed text-slate-300"
                >
                  {def.hint}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* 导航 */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              disabled={step === 0}
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              className="text-xs text-slate-400 transition hover:text-neon disabled:opacity-30"
            >
              ← 上一步
            </button>
            <NeonButton onClick={goNext} disabled={!canNext}>
              {step + 1 >= STEPS.length ? '完成分析' : '下一步'} <ChevronRight size={14} aria-hidden />
            </NeonButton>
          </div>

          {!compact && (
            <p className="flex items-start gap-1.5 text-[11px] text-slate-500">
              <PenLine size={12} className="mt-0.5 shrink-0" aria-hidden />
              全程不直接给出答案：网站只提供方法、步骤与提示，结论由你自己产出后再核对。
            </p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
