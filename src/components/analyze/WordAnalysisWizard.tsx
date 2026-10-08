import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, ChevronRight, Eye, PenLine, BookOpenCheck, RotateCcw } from 'lucide-react';
import type { WordExample } from '@/types';
import { words } from '@/data/words';
import { playSfx } from '@/hooks/useSfx';
import { useMotionTier } from '@/hooks/useMotionTier';
import { useProgress } from '@/store/progressStore';
import { useSpeech } from '@/hooks/useSpeech';
import EduButton from '@/components/edu/Button';
import EduStamp from '@/components/edu/Stamp';
import { SpeakButton as EduSpeakButton } from '@/components/edu/Speak';

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
  /** 保留对外 API（历史深色面分支已整体迁入辞书纸面，两面同视） */
  tone?: 'dark' | 'paper';
};

/** 实战分析向导：只给方法和提示，不直接给答案（辞书纸面版式） */
export default function WordAnalysisWizard({ wordId, compact = false, onDone, tone = 'dark' }: Props) {
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
      <div className="relative overflow-hidden rounded-[4px] border border-cobalt/45 bg-bone2/60 p-6">
        <div className="flex items-center gap-2 text-lg font-bold text-paperink">
          <EduStamp label="析毕" size={64} className="mr-1" />
          分析完成
        </div>
        <div className="mt-4 grid gap-2 text-sm">
          {STEPS.slice(0, 4).map((s) => (
            <div key={s.key} className="flex flex-wrap gap-2 border-b border-rule px-3 py-2 last:border-b-0">
              <span className="text-colophon">{s.title}</span>
              <span className="text-paperink">{answers[s.key] || '（未填）'}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <EduButton
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
          </EduButton>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-[4px] border border-rule bg-bone2/40 p-5 md:p-6">
      {/* 头部 */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-colophon">
          <span className="text-xs font-semibold text-cobalt">实战分析</span>
          <span>生词：</span>
          <span className="font-serif text-base font-semibold text-paperink">{word}</span>
          {dict && <span className="ipa">{dict.phoneticUK}</span>}
          <EduSpeakButton text={word} size="sm" className="min-h-[44px] min-w-[44px]" />
        </div>
        <div className="flex items-center gap-1" aria-label="分析进度">
          {STEPS.map((s, i) => (
            <span
              key={s.key}
              className={`h-1.5 rounded-full transition-all duration-300`}
              style={{
                width: i === step ? 22 : 10,
                background: i < step ? '#1E4B7A' : i === step ? '#B3311E' : '#D8CFBC',
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
            <h4 className="text-lg font-bold text-paperink">{def.title}</h4>
            <p className="mt-1 text-sm text-colophon">{def.question}</p>
          </div>

          {/* 输入区 */}
          {def.input === 'choice' && (
            <div className="flex flex-wrap gap-2">
              {def.options!.map((o) => (
                <motion.button
                  key={o}
                  type="button"
                  onClick={() => {
                    playSfx('tick');
                    setAnswer(def.key, o);
                  }}
                  className={`min-h-[44px] rounded-[3px] border px-4 py-2.5 text-sm transition-colors ${
                    value === o
                      ? 'border-rubric bg-rubric/[0.07] font-semibold text-rubric'
                      : 'border-rule bg-[#FDFBF5] text-colophon hover:border-paperink'
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
                className="edu-input resize-y font-sans"
                value={value}
                onChange={(e) => setAnswer(def.key, e.target.value)}
                placeholder={def.placeholder}
                aria-label={def.question}
              />
            ) : (
              <input
                className="edu-input font-mono"
                value={value}
                onChange={(e) => setAnswer(def.key, e.target.value)}
                placeholder={def.placeholder}
                aria-label={def.question}
              />
            ))}

          {def.input === 'reveal' && (
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap gap-2">
                <EduButton
                  size="sm"
                  onClick={() => {
                    setRevealed(true);
                    playSfx('reveal');
                  }}
                  disabled={revealed}
                >
                  <Eye size={14} aria-hidden /> {revealed ? '已核对' : '对照内置词典'}
                </EduButton>
                {dict && (
                  <EduSpeakButton text={dict.word} label="播放发音" className="min-h-[44px] min-w-[44px]" />
                )}
              </div>

              <AnimatePresence>
                {revealed && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="rounded-[4px] border border-rule bg-[#FDFBF5] p-4 text-sm">
                      <div className="mb-1 flex items-center gap-2 font-semibold text-cobalt">
                        <BookOpenCheck size={14} aria-hidden /> 词典核对
                      </div>
                      {dict ? (
                        <div className="flex flex-col gap-1.5 text-paperink">
                          <div>
                            <span className="ipa text-rubric">{dict.phoneticUK}</span>
                            <span className="ml-2 text-colophon">{dict.partOfSpeech}</span>
                          </div>
                          <div>词典释义：{dict.meaningCN}</div>
                          <div className="text-xs text-colophon">
                            你的猜测：{answers.guess || '（未填写）'}
                          </div>
                          <div className="text-xs text-colophon">
                            拆解核对：{dict.roots.map((r) => `${r.text}(${r.meaning})`).join(' + ')}
                          </div>
                          <div className="text-xs text-colophon">
                            你拆的结构：{answers.morpheme || '（未填写）'}
                          </div>
                        </div>
                      ) : (
                        <p className="text-paperink">
                          内置词典未收录{' '}
                          <b className="font-serif text-rubric">{word}</b>
                          （这正是本课的目的：分析方法可迁移）。请用纸质 / 在线词典查证，把真实释义抄写在下一行：
                          <input
                            className="edu-input mt-2"
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
              className="flex min-h-[44px] items-center gap-1.5 rounded-[3px] border border-rule px-3 py-2 text-xs text-cobalt transition-colors hover:border-cobalt"
            >
              <Lightbulb size={13} aria-hidden /> {hints[def.key] ? '提示已展开' : '要提示吗？'}
            </button>
            <AnimatePresence>
              {hints[def.key] && (
                <motion.p
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 border-t border-rule pt-1.5 text-xs leading-relaxed text-colophon"
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
              className="min-h-[44px] text-xs text-colophon transition-colors hover:text-paperink disabled:opacity-30"
            >
              ← 上一步
            </button>
            <EduButton onClick={goNext} disabled={!canNext} variant={step + 1 >= STEPS.length ? 'primary' : 'default'}>
              {step + 1 >= STEPS.length ? '完成分析' : '下一步'} <ChevronRight size={14} aria-hidden />
            </EduButton>
          </div>

          {!compact && (
            <p className="flex items-start gap-1.5 text-xs text-colophon">
              <PenLine size={12} className="mt-0.5 shrink-0" aria-hidden />
              全程不直接给出答案：网站只提供方法、步骤与提示，结论由你自己产出后再核对。
            </p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
