import { motion } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { useMotionTier } from '@/hooks/useMotionTier';
import { getDemo } from '../demoConfig';
import type { Method } from '@/types';

/** Step 2：原理讲解 —— 字符串 vs 音节块，音节从字母串中裂开飞入槽位 */
export default function PrincipleStep({ method }: { method: Method }) {
  const tier = useMotionTier();
  const demo = getDemo(method.id).principle ?? {
    wrongLabel: '错误：孤立死记',
    wrong: method.title.replace(/[:：]/g, ' ').split(' ').slice(0, 4),
    rightLabel: '正确：结构化理解',
    right: method.principles.slice(0, 3),
    note: '把要记的内容拆成有含义的结构，记忆负担会成倍下降。',
  };

  const stagger = tier === 'off' ? 0 : 0.07;

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-4 md:grid-cols-2">
        {/* 错误做法 */}
        <motion.div
          initial={tier === 'off' ? false : { opacity: 0, x: -22 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-3xl border border-danger/25 bg-danger/[0.06] p-5 backdrop-blur-md"
        >
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-danger">
            <X size={15} aria-hidden /> {demo.wrongLabel}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {demo.wrong.map((ch, i) => (
              <motion.span
                key={`${ch}-${i}`}
                initial={tier === 'off' ? false : { opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * stagger, duration: 0.3 }}
                className="flex h-10 min-w-[34px] items-center justify-center rounded-lg border border-danger/35 bg-danger/10 px-1.5 font-mono text-sm text-[#FFC9D2]"
              >
                {ch}
              </motion.span>
            ))}
          </div>
          <p className="mt-3 text-xs leading-relaxed text-[#FFC9D2]/80">
            逐个字符排队，顺序是“任意”的：漏一个、错一位，整条链就断。回忆时要从头重放，慢且易崩。
          </p>
        </motion.div>

        {/* 正确做法 */}
        <motion.div
          initial={tier === 'off' ? false : { opacity: 0, x: 22 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-3xl border border-success/30 bg-success/[0.06] p-5 backdrop-blur-md"
        >
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-success">
            <Check size={15} aria-hidden /> {demo.rightLabel}
          </div>

          {/* 裂开：字母块从左侧“挤出”飞入槽位 */}
          <div className="flex flex-wrap items-center gap-2">
            {demo.right.map((block, i) => {
              const offset = demo.right.slice(0, i).reduce((a, b) => a + b.length * 30, 0);
              return (
                <div key={`${block}-${i}`} className="relative">
                  <motion.span
                    initial={tier === 'off' ? false : { opacity: 0, x: -offset, scale: 0.7, filter: 'blur(6px)' }}
                    animate={{ opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' }}
                    transition={{
                      delay: 0.55 + i * 0.18,
                      type: 'spring',
                      stiffness: 240,
                      damping: 22,
                    }}
                    className="flex h-11 items-center justify-center rounded-xl border border-success/50 bg-success/12 px-4 font-display text-base font-bold text-[#B9FFD9] shadow-[0_0_18px_rgba(0,230,118,0.22)]"
                  >
                    {block}
                  </motion.span>
                  {/* 槽位底座 */}
                  <motion.span
                    initial={tier === 'off' ? false : { opacity: 0, scaleX: 0.3 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ delay: 0.5 + i * 0.18, duration: 0.35 }}
                    className="absolute -bottom-1.5 left-1/2 h-1 w-4/5 -translate-x-1/2 rounded-full bg-success/50"
                    aria-hidden
                  />
                </div>
              );
            })}
          </div>

          <p className="mt-4 text-xs leading-relaxed text-[#B9FFD9]/80">{demo.note}</p>
        </motion.div>
      </div>

      {/* 结论条 */}
      <motion.div
        initial={tier === 'off' ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.5 }}
        className="rounded-2xl border border-neon/30 bg-neon/[0.07] px-4 py-3 text-sm text-slate-200"
      >
        <strong className="text-neon">核心原理：</strong>
        {method.principles[0]}
      </motion.div>
    </div>
  );
}
