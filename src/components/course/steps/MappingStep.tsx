import { motion } from 'framer-motion';
import { Link2, Volume2 } from 'lucide-react';
import { useMotionTier } from '@/hooks/useMotionTier';
import { useSpeech } from '@/hooks/useSpeech';
import { playSfx } from '@/hooks/useSfx';
import { getDemo } from '../demoConfig';
import type { Method } from '@/types';
import { useState } from 'react';
import { EduCallout } from '@/components/edu';

/**
 * 步 4：拼写与发音对应 —— 高亮规则 + 同规则词 + 动画连线。
 * 连线改扁平单色（结构蓝），规则高亮走批注红强调；
 * 例外提示归入 EduCallout（用法说明），无辉光无渐变。
 */
export default function MappingStep({ method }: { method: Method }) {
  const tier = useMotionTier();
  const { speak, supported } = useSpeech();
  const demo = getDemo(method.id).mapping;
  const [hover, setHover] = useState<number | null>(null);

  if (!demo) {
    return (
      <div className="rounded-[4px] border border-rule bg-bone2/60 p-5 text-sm leading-[1.85] text-colophon">
        本节没有专门的拼写对应演示，请结合上方规则记忆：
        {method.principles.slice(0, 2).join('；')}。
      </div>
    );
  }

  const dur = tier === 'off' ? 0 : 0.7;

  return (
    <div className="flex flex-col gap-5">
      {/* 拼写块 → 发音块（发丝线框，连线为扁平单色） */}
      <div className="flex flex-col items-center gap-3 rounded-[4px] border border-rule bg-bone2/60 p-5 md:flex-row md:justify-center md:gap-6">
        <motion.div
          initial={tier === 'off' ? false : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-[4px] border border-rule bg-bone px-6 py-4 text-center"
        >
          <div className="mb-1 text-xs font-semibold text-cobalt">拼写</div>
          <div className="font-serif text-3xl font-bold text-paperink">{demo.pattern}</div>
        </motion.div>

        {/* 动画连线 */}
        <div className="flex min-w-[90px] flex-col items-center gap-1" aria-hidden>
          <motion.div
            className="h-0.5 w-full origin-left bg-cobalt"
            initial={tier === 'off' ? false : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: dur }}
          />
          <motion.div
            initial={tier === 'off' ? false : { opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + dur * 0.8, duration: 0.4 }}
            className="text-cobalt"
          >
            <Link2 size={16} />
          </motion.div>
        </div>

        <motion.div
          initial={tier === 'off' ? false : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-[4px] border border-rule bg-bone px-6 py-4 text-center"
        >
          <div className="mb-1 text-xs font-semibold text-cobalt">发音</div>
          <div className="ipa text-3xl font-bold text-paperink">{demo.sound}</div>
        </motion.div>
      </div>

      {/* 同规则词 */}
      <div>
        <div className="mb-2 text-xs font-semibold text-cobalt">同规则词（连线 = 同一读音）</div>
        <div className="flex flex-col gap-2">
          {demo.family.map((f, i) => (
            <motion.button
              key={f.word}
              type="button"
              initial={tier === 'off' ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + i * 0.1, duration: 0.4 }}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              onClick={() => {
                playSfx('tick');
                speak(f.word);
              }}
              className="group flex items-center gap-3 rounded-[4px] border border-rule bg-bone2/60 px-4 py-3 text-left transition-colors duration-200 hover:border-cobalt/50 hover:bg-bone2"
              aria-label={`朗读 ${f.word}，${f.ipa}`}
            >
              <span className="w-32 shrink-0 font-serif text-base font-semibold text-paperink">{f.word}</span>
              <span className="ipa w-28 shrink-0 text-xs text-colophon">{f.ipa}</span>

              {/* 规则高亮：批注红 = 强调 */}
              <span className="rounded-[4px] border border-rubric/60 bg-rubric/[0.07] px-2 py-0.5 text-xs font-semibold text-rubric">
                {demo.pattern}
              </span>

              {/* 动态连线（扁平单色量条） */}
              <span className="relative h-px flex-1 overflow-hidden bg-rule" aria-hidden>
                <motion.span
                  className="absolute inset-y-0 left-0 w-full origin-left bg-cobalt"
                  initial={tier === 'off' ? false : { scaleX: 0 }}
                  animate={{ scaleX: hover === i ? 1 : 0.55, opacity: hover === i ? 1 : 0.5 }}
                  transition={{ duration: 0.5, delay: tier === 'off' ? 0 : 1.35 + i * 0.1 }}
                />
              </span>

              <span className="ipa rounded-[4px] border border-rule bg-bone px-2 py-0.5 text-xs font-semibold text-paperink">
                {demo.sound}
              </span>
              <Volume2 size={14} className="shrink-0 text-colophon transition-colors group-hover:text-cobalt" aria-hidden />
            </motion.button>
          ))}
        </div>
      </div>

      {/* 例外提示：词典「用法说明」框，批注红领起 */}
      {demo.exceptions.length > 0 && (
        <motion.div
          initial={tier === 'off' ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.9, duration: 0.45 }}
        >
          <EduCallout tone="warn" label="例外提示：规则不是 100%，遇到例外单独记">
            <span className="block text-[14.5px] leading-[1.85]">
              {demo.exceptions.map((ex) => (
                <span key={ex.word} className="mb-1.5 flex flex-wrap items-center gap-2 last:mb-0">
                  <button
                    type="button"
                    onClick={() => speak(ex.word)}
                    className="font-serif font-semibold text-paperink underline decoration-rule underline-offset-4 transition-colors hover:text-rubric"
                  >
                    {ex.word}
                  </button>
                  <span className="ipa text-cobalt">{ex.ipa}</span>
                  <span className="text-xs text-colophon">→ {ex.note}</span>
                </span>
              ))}
            </span>
            <span className="mt-2 block text-xs leading-[1.8] text-colophon">{demo.ruleText}</span>
          </EduCallout>
        </motion.div>
      )}
    </div>
  );
}
