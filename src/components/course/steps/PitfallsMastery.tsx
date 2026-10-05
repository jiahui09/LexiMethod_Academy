import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertOctagon, Check, PartyPopper, ArrowRight, ShieldCheck } from 'lucide-react';
import type { Method } from '@/types';
import { useMotionTier } from '@/hooks/useMotionTier';
import { playSfx } from '@/hooks/useSfx';
import NeonButton from '@/components/ui/NeonButton';
import ConfettiBurst from '@/components/fx/ConfettiBurst';
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

/** Step 7：常见误区 —— 翻牌揭示 */
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
      <div className="flex items-center gap-2 text-sm font-semibold text-warn">
        <AlertOctagon size={16} aria-hidden /> 点击卡片查看“怎么改”
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {method.pitfalls.map((p, i) => {
          const open = flipped.has(i);
          return (
            <motion.button
              key={i}
              type="button"
              onClick={() => toggle(i)}
              initial={tier === 'off' ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4 }}
              className="relative overflow-hidden rounded-2xl border p-4 text-left transition-colors duration-300"
              style={{
                borderColor: open ? 'rgba(0,230,118,0.45)' : 'rgba(255,77,109,0.3)',
                background: open ? 'rgba(0,230,118,0.07)' : 'rgba(255,77,109,0.06)',
              }}
              aria-expanded={open}
            >
              <div className="mb-1.5 flex items-center gap-2 text-xs font-semibold text-danger">
                <span className="flex h-5 w-5 items-center justify-center rounded-md bg-danger/20 text-xs">
                  {i + 1}
                </span>
                误区
              </div>
              <p className="text-sm leading-relaxed text-slate-200">{p}</p>
              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: tier === 'off' ? 0 : 0.32 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 flex items-start gap-2 border-t border-success/25 pt-3 text-xs leading-relaxed text-[#B9FFD9]">
                      <ShieldCheck size={14} className="mt-0.5 shrink-0 text-success" aria-hidden />
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

/** Step 8：掌握标准 —— 达成清单 + 结课彩蛋 */
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
    <div className="relative overflow-hidden rounded-3xl border border-white/12 bg-white/[0.04] p-5 backdrop-blur-xl md:p-6">
      <ConfettiBurst fireKey={burst} count={110} />
      <div className="mb-4 flex items-center gap-2 font-display text-lg font-bold text-white">
        <Check className="text-success" size={18} aria-hidden /> 达到以下标准，才算“学会方法”
      </div>

      <ul className="flex flex-col gap-2.5">
        {method.masteryCriteria.map((c, i) => {
          const on = checked.has(i);
          return (
            <li key={i}>
              <motion.button
                type="button"
                onClick={() => toggle(i)}
                whileTap={{ scale: 0.99 }}
                className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left transition-all duration-300 ${
                  on ? 'border-success/60 bg-success/12' : 'border-white/12 bg-white/[0.04] hover:border-neon/45'
                }`}
                aria-pressed={on}
              >
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all ${
                    on ? 'border-success bg-success/30 text-success' : 'border-white/25'
                  }`}
                >
                  {on && <Check size={13} aria-hidden />}
                </span>
                <span className={`text-sm leading-relaxed ${on ? 'text-white' : 'text-slate-300'}`}>{c}</span>
              </motion.button>
            </li>
          );
        })}
      </ul>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-slate-400">
          完成度 <span className="text-neon tabular-nums">{checked.size}</span> / {method.masteryCriteria.length}
        </div>
        <AnimatePresence>
          {all && (
            <motion.div
              initial={tier === 'off' ? false : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-3"
            >
              <span className="flex items-center gap-1.5 rounded-full border border-success/50 bg-success/12 px-3 py-1.5 text-xs font-semibold text-success">
                <PartyPopper size={13} aria-hidden /> 全部掌握标准达标
              </span>
              {onNextMethod && (
                <NeonButton size="sm" onClick={onNextMethod}>
                  下一模块 <ArrowRight size={14} aria-hidden />
                </NeonButton>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="mt-4 border-t border-white/8 pt-3 text-xs leading-relaxed text-slate-400">
        掌握的定义是“在没有提示的陌生材料上也能做到”。建议：立刻到{' '}
        <span className="text-neon">实战演练</span> 找一个没学过的词走一遍全流程。
      </p>
    </div>
  );
}
