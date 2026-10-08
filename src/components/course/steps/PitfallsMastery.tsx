import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertOctagon, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import type { Method } from '@/types';
import { useMotionTier } from '@/hooks/useMotionTier';
import { playSfx } from '@/hooks/useSfx';
import { EduButton } from '@/components/edu';
import { useProgress } from '@/store/progressStore';

const CATEGORY_FIX: Record<string, string> = {
  phonics: '改正：回到「规则演示」步，用正确流程重新拆一遍；朗读时录音自检。',
  roots: '改正：回到「词根拼装」步，先拆已知词验证词根含义，再迁移到生词。',
  memory: '改正：联想完成后必须回到发音与语境，用句子读三遍再放入复习队列。',
  context: '改正：把孤立词放回原句，收集搭配词块，隔天用它造自己的句子。',
  review: '改正：复习时改为“遮住答案主动回忆”，答对才升级间隔。',
  output: '改正：每学一个词，当天至少完成一次造句或口头复述。',
  metacognition: '改正：记录失效的具体场景，明天换一种方法重试并对比效果。',
};

/** Step 7：常见误区 —— 点开词条看页边批注（误区=批注红序号，改正=结构蓝 ✓） */
export function PitfallsStep({ method }: { method: Method }) {
  const tier = useMotionTier();
  const [flipped, setFlipped] = useState<Set<number>>(new Set());

  const toggle = (i: number) => {
    playSfx('reveal');
    setFlipped((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 text-[13px] font-semibold text-rubric">
        <AlertOctagon size={15} aria-hidden /> 点击卡片查看“怎么改”
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {method.pitfalls.map((p, i) => {
          const open = flipped.has(i);
          return (
            <motion.button
              key={i}
              type="button"
              onClick={() => toggle(i)}
              initial={tier === 'off' ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className={`relative rounded-[4px] border p-4 text-left transition-colors duration-300 ${
                open ? 'border-cobalt/45 bg-bone2/70' : 'border-rule bg-bone2/60'
              }`}
              aria-expanded={open}
            >
              <div className="mb-1.5 flex items-center gap-2 text-xs font-semibold text-rubric">
                <span className="flex h-5 w-5 items-center justify-center rounded-[2px] border border-rubric font-serif text-xs font-bold tabular-nums text-rubric">
                  {i + 1}
                </span>
                误区
              </div>
              <p className="text-[14.5px] leading-[1.85] text-paperink">{p}</p>
              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: tier === 'off' ? 0 : 0.32 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 flex items-start gap-2 border-t border-rule pt-3 text-[13px] leading-[1.8] text-cobalt">
                      <ShieldCheck size={14} className="mt-1 shrink-0 text-cobalt" aria-hidden />
                      {CATEGORY_FIX[method.category] ?? CATEGORY_FIX.phonics}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

/** Step 8：掌握标准 —— 达成清单 + 结课批注（勾选达成 = 结构蓝 ✓；彩纸粒子已除，达标徽记随 burst 重新落纸） */
export function MasteryStep({ method, onNextMethod }: { method: Method; onNextMethod?: () => void }) {
  const tier = useMotionTier();
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [burst, setBurst] = useState(0);
  const completeStep = useProgress((s) => s.completeStep);
  const all = checked.size >= method.masteryCriteria.length;

  const toggle = (i: number) => {
    playSfx('tick');
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      if (next.size === method.masteryCriteria.length && prev.size < method.masteryCriteria.length) {
        playSfx('complete');
        setBurst((b) => b + 1);
        completeStep(method.id, method.steps.length - 1, method.steps.length);
      }
      return next;
    });
  };

  return (
    <div className="relative rounded-[4px] border border-rule bg-bone2/60 p-5 md:p-6">
      <div className="mb-4 flex items-center gap-2 text-[15px] font-semibold text-paperink">
        <Check className="text-cobalt" size={17} aria-hidden /> 达到以下标准，才算“学会方法”
      </div>

      <ul className="flex flex-col gap-2.5">
        {method.masteryCriteria.map((c, i) => {
          const on = checked.has(i);
          return (
            <li key={i}>
              <button
                type="button"
                onClick={() => toggle(i)}
                className={`flex w-full items-start gap-3 rounded-[4px] border px-4 py-3 text-left transition-colors duration-300 ${
                  on ? 'border-cobalt/55 bg-bone' : 'border-rule bg-bone2/40 hover:border-paperink/45'
                }`}
                aria-pressed={on}
              >
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-[2px] border transition-colors ${
                    on ? 'border-cobalt bg-cobalt/10 text-cobalt' : 'border-rule'
                  }`}
                >
                  {on && <Check size={13} aria-hidden />}
                </span>
                <span className={`text-[14.5px] leading-[1.85] ${on ? 'text-paperink' : 'text-colophon'}`}>{c}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-colophon">
          完成度 <span className="font-serif font-semibold tabular-nums text-cobalt">{checked.size}</span> / {method.masteryCriteria.length}
        </div>
        <AnimatePresence>
          {all && (
            <motion.div
              key={burst}
              initial={tier === 'off' ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3"
            >
              <span className="inline-flex items-center gap-1.5 rounded-full border border-cobalt/50 px-3 py-1.5 text-xs font-semibold text-cobalt">
                <Check size={13} aria-hidden /> 全部掌握标准达标
              </span>
              {onNextMethod && (
                <EduButton size="sm" onClick={onNextMethod}>
                  下一模块 <ArrowRight size={14} aria-hidden />
                </EduButton>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="mt-4 border-t border-rule pt-3 text-[13px] leading-[1.8] text-colophon">
        掌握的定义是“在没有提示的陌生材料上也能做到”。建议：拿一个没学过的词，把本课的六步全流程自己走一遍。
      </p>
    </div>
  );
}
