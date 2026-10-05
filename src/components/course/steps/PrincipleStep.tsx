import { motion } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { useMotionTier } from '@/hooks/useMotionTier';
import { getDemo } from '../demoConfig';
import type { Method } from '@/types';

/**
 * 步 2：原理讲解 —— 字符串 vs 音节块，音节从字母串中裂开飞入槽位。
 * 对错用「纹样 + 颜色」双重编码：误区 = 批注红框 + ✗，正解 = 结构蓝框 + ✓；
 * 卡片一律发丝线，入场只动 opacity / x / scale，无模糊、无辉光。
 */
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
        {/* 错误做法：批注红发丝线框 + ✗ 领起 */}
        <motion.div
          initial={tier === 'off' ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-[4px] border border-rubric/50 bg-bone2/60 p-5"
        >
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-rubric">
            <X size={15} aria-hidden /> {demo.wrongLabel}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {demo.wrong.map((ch, i) => (
              <motion.span
                key={`${ch}-${i}`}
                initial={tier === 'off' ? false : { opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * stagger, duration: 0.3 }}
                className="flex h-10 min-w-[34px] items-center justify-center rounded-[4px] border border-rule bg-bone px-1.5 font-serif text-sm text-colophon"
              >
                {ch}
              </motion.span>
            ))}
          </div>
          <p className="mt-3 text-xs leading-[1.8] text-colophon">
            逐个字符排队，顺序是“任意”的：漏一个、错一位，整条链就断。回忆时要从头重放，慢且易崩。
          </p>
        </motion.div>

        {/* 正确做法：结构蓝发丝线框 + ✓ 领起 */}
        <motion.div
          initial={tier === 'off' ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-[4px] border border-cobalt/45 bg-bone2/70 p-5"
        >
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-cobalt">
            <Check size={15} aria-hidden /> {demo.rightLabel}
          </div>

          {/* 裂开：字母块从左侧“挤出”飞入槽位 */}
          <div className="flex flex-wrap items-center gap-2">
            {demo.right.map((block, i) => {
              const offset = demo.right.slice(0, i).reduce((a, b) => a + b.length * 30, 0);
              return (
                <div key={`${block}-${i}`} className="relative">
                  <motion.span
                    initial={tier === 'off' ? false : { opacity: 0, x: -offset, scale: 0.85 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ delay: 0.55 + i * 0.18, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="flex h-11 items-center justify-center rounded-[4px] border border-cobalt/45 bg-bone px-4 font-serif text-base font-bold text-paperink"
                  >
                    {block}
                  </motion.span>
                  {/* 槽位底座 */}
                  <motion.span
                    initial={tier === 'off' ? false : { opacity: 0, scaleX: 0.3 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ delay: 0.5 + i * 0.18, duration: 0.35 }}
                    className="absolute -bottom-1.5 left-1/2 h-[2px] w-4/5 -translate-x-1/2 bg-cobalt/50"
                    aria-hidden
                  />
                </div>
              );
            })}
          </div>

          <p className="mt-4 text-xs leading-[1.8] text-colophon">{demo.note}</p>
        </motion.div>
      </div>

      {/* 结论条：横线分区，结构性小标走结构蓝 */}
      <motion.div
        initial={tier === 'off' ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.5 }}
        className="rounded-[4px] border border-rule bg-bone2/60 px-4 py-3 text-[14.5px] leading-[1.85] text-paperink"
      >
        <strong className="font-semibold text-cobalt">核心原理：</strong>
        {method.principles[0]}
      </motion.div>
    </div>
  );
}
