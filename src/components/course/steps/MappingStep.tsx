import { motion } from 'framer-motion';
import { AlertTriangle, Link2, Volume2 } from 'lucide-react';
import { useMotionTier } from '@/hooks/useMotionTier';
import { useSpeech } from '@/hooks/useSpeech';
import { playSfx } from '@/hooks/useSfx';
import { getDemo } from '../demoConfig';
import type { Method } from '@/types';
import { useState } from 'react';

/** Step 4：拼写与发音对应 —— 高亮规则 + 同规则词 + 动画连线 */
export default function MappingStep({ method }: { method: Method }) {
  const tier = useMotionTier();
  const { speak, supported } = useSpeech();
  const demo = getDemo(method.id).mapping;
  const [hover, setHover] = useState<number | null>(null);

  if (!demo) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-sm leading-relaxed text-slate-300">
        本节没有专门的拼写对应演示，请结合上方规则记忆：
        {method.principles.slice(0, 2).join('；')}。
      </div>
    );
  }

  const dur = tier === 'off' ? 0 : 0.7;

  return (
    <div className="flex flex-col gap-5">
      {/* 拼写块 → 发音块 */}
      <div className="flex flex-col items-center gap-3 rounded-3xl border border-white/10 bg-white/[0.03] p-5 md:flex-row md:justify-center md:gap-6">
        <motion.div
          initial={tier === 'off' ? false : { opacity: 0, scale: 0.75 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 22 }}
          className="rounded-2xl border border-pink/50 bg-pink/12 px-6 py-4 text-center shadow-[0_0_26px_rgba(255,77,157,0.25)]"
        >
          <div className="text-xs uppercase tracking-widest text-pink-lit/80">拼写</div>
          <div className="font-display text-3xl font-bold text-white">{demo.pattern}</div>
        </motion.div>

        {/* 动画连线 */}
        <div className="flex min-w-[90px] flex-col items-center gap-1" aria-hidden>
          <motion.div
            className="h-0.5 w-full origin-left rounded-full bg-gradient-to-r from-pink via-violet to-neon"
            initial={tier === 'off' ? false : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: dur }}
          />
          <motion.div
            initial={tier === 'off' ? false : { opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + dur * 0.8 }}
            className="text-neon"
          >
            <Link2 size={16} />
          </motion.div>
        </div>

        <motion.div
          initial={tier === 'off' ? false : { opacity: 0, scale: 0.75 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9, type: 'spring', stiffness: 260, damping: 22 }}
          className="rounded-2xl border border-neon/50 bg-neon/12 px-6 py-4 text-center shadow-[0_0_26px_rgba(0,229,255,0.25)]"
        >
          <div className="text-xs uppercase tracking-widest text-neon/80">发音</div>
          <div className="ipa text-3xl font-bold text-white">{demo.sound}</div>
        </motion.div>
      </div>

      {/* 同规则词 */}
      <div>
        <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">同规则词（连线 = 同一读音）</div>
        <div className="flex flex-col gap-2">
          {demo.family.map((f, i) => (
            <motion.button
              key={f.word}
              type="button"
              initial={tier === 'off' ? false : { opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 + i * 0.1, duration: 0.4 }}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              onClick={() => {
                playSfx('tick');
                speak(f.word);
              }}
              className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left transition-all duration-300 hover:border-neon/45 hover:bg-neon/[0.07]"
              aria-label={`朗读 ${f.word}，${f.ipa}`}
            >
              <span className="w-32 shrink-0 font-display text-base font-semibold text-white">{f.word}</span>
              <span className="ipa w-28 shrink-0 text-xs text-slate-400">{f.ipa}</span>

              {/* 高亮的拼写块 */}
              <span className="rounded-md border border-pink/45 bg-pink/12 px-2 py-0.5 text-xs font-semibold text-pink-lit">
                {demo.pattern}
              </span>

              {/* 动态连线 */}
              <span className="relative h-0.5 flex-1 overflow-hidden rounded-full bg-white/10" aria-hidden>
                <motion.span
                  className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-gradient-to-r from-pink to-neon"
                  initial={tier === 'off' ? false : { scaleX: 0 }}
                  animate={{ scaleX: hover === i ? 1 : 0.55, opacity: hover === i ? 1 : 0.5 }}
                  transition={{ duration: 0.5, delay: tier === 'off' ? 0 : 1.35 + i * 0.1 }}
                />
              </span>

              <span className="ipa rounded-md border border-neon/45 bg-neon/12 px-2 py-0.5 text-xs font-semibold text-neon">
                {demo.sound}
              </span>
              <Volume2 size={14} className="shrink-0 text-slate-400 transition group-hover:text-neon" aria-hidden />
            </motion.button>
          ))}
        </div>
      </div>

      {/* 例外提示 */}
      {demo.exceptions.length > 0 && (
        <motion.div
          initial={tier === 'off' ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.9, duration: 0.45 }}
          className="rounded-2xl border border-warn/35 bg-warn/[0.07] p-4"
        >
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-warn">
            <AlertTriangle size={14} aria-hidden /> 例外提示：规则不是 100%，遇到例外单独记
          </div>
          <div className="flex flex-col gap-1.5 text-sm text-slate-300">
            {demo.exceptions.map((ex) => (
              <div key={ex.word} className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => speak(ex.word)}
                  className="font-display font-semibold text-white underline decoration-warn/50 underline-offset-4 hover:text-warn"
                >
                  {ex.word}
                </button>
                <span className="ipa text-neon">{ex.ipa}</span>
                <span className="text-xs text-slate-400">→ {ex.note}</span>
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-slate-400">{demo.ruleText}</p>
        </motion.div>
      )}
    </div>
  );
}
