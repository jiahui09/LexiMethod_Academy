import { motion } from 'framer-motion';
import { Volume2, Lightbulb, Zap } from 'lucide-react';
import { useMotionTier } from '@/hooks/useMotionTier';
import { useSpeech } from '@/hooks/useSpeech';
import { playSfx } from '@/hooks/useSfx';
import { getDemo } from '../demoConfig';
import type { Method } from '@/types';

/** Step 3：规则演示 —— 音节划分 + 重音脉冲 + 点击朗读 */
export default function RuleStep({ method }: { method: Method }) {
  const tier = useMotionTier();
  const { speak, supported } = useSpeech();
  const demo = getDemo(method.id).rule;
  const stressedIpa = demo ? demo.syllableIpa[demo.stress].replace(/\//g, '') : '';

  if (!demo) {
    return (
      <div className="flex flex-col gap-3">
        {method.principles.map((p, i) => (
          <motion.div
            key={i}
            initial={tier === 'off' ? false : { opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3"
          >
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-violet/20 text-xs font-bold text-violet-lit">
              {i + 1}
            </span>
            <p className="text-sm leading-relaxed text-slate-200">{p}</p>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* 规则标题 */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="flex items-center gap-2 rounded-full border border-violet/40 bg-violet/12 px-3 py-1 text-xs font-semibold text-violet-lit">
          <Lightbulb size={12} aria-hidden /> {demo.ruleTitle}
        </span>
        <button
          type="button"
          onClick={() => {
            playSfx('tick');
            speak(demo.word);
          }}
          disabled={!supported}
          className="flex items-center gap-2 rounded-full border border-neon/40 bg-neon/10 px-3 py-1 text-xs text-neon transition hover:bg-neon/20 disabled:opacity-40"
          aria-label={`播放 ${demo.word} 的发音`}
        >
          <Volume2 size={13} aria-hidden /> 朗读 {demo.word}（点击可听）
        </button>
        <span className="ipa text-sm text-slate-400">{demo.ipa}</span>
      </div>

      {/* 音节块 */}
      <div className="flex flex-wrap items-center gap-3" role="list" aria-label={`${demo.word} 的音节划分`}>
        {demo.syllables.map((syl, i) => {
          const stressed = i === demo.stress;
          return (
            <motion.button
              key={`${syl}-${i}`}
              type="button"
              role="listitem"
              initial={tier === 'off' ? false : { opacity: 0, y: 24, scale: 0.86 }}
              animate={{ opacity: stressed ? 1 : 0.62, y: 0, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.12, type: 'spring', stiffness: 260, damping: 24 }}
              onClick={() => {
                playSfx(stressed ? 'correct' : 'tick');
                speak(syl);
              }}
              className={`group relative flex flex-col items-center gap-1 rounded-2xl border px-5 py-4 backdrop-blur-md transition-all duration-300 hover:opacity-100 ${
                stressed ? 'stress-pulse border-neon/70 bg-neon/15' : 'border-white/15 bg-white/[0.05]'
              }`}
              aria-label={`${syl}${stressed ? '（重读音节）' : ''}，点击朗读`}
              whileHover={{ opacity: 1 }}
            >
              <span
                className={`font-display text-xl font-bold ${stressed ? 'text-neon' : 'text-slate-200'}`}
                style={stressed && tier !== 'off' ? { textShadow: '0 0 18px rgba(0,229,255,0.75)' } : undefined}
              >
                {syl}
              </span>
              <span className="ipa text-xs text-slate-400">{demo.syllableIpa[i]}</span>
              {stressed && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-neon px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-[#04121c]">
                  重音
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* 规则文字 */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm leading-relaxed text-slate-300">
        {demo.ruleText}
      </div>

      {/* 对比条：重读 vs 弱读 */}
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-neon/25 bg-neon/[0.06] p-4">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-neon">
            <Zap size={13} aria-hidden /> 重读音节：/{stressedIpa}/
          </div>
          <div className="h-2 rounded-full bg-white/8">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-neon to-violet"
              initial={tier === 'off' ? false : { width: 0 }}
              animate={{ width: '82%' }}
              transition={{ delay: 0.7, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          <p className="mt-2 text-xs text-slate-400">音量更大、音长更长、音高更突出</p>
        </div>
        <div className="rounded-2xl border border-white/12 bg-white/[0.04] p-4">
          <div className="mb-2 text-xs font-semibold text-slate-300">非重读音节：弱读为 /ə/ 或短元音</div>
          <div className="h-2 rounded-full bg-white/8">
            <motion.div
              className="h-full rounded-full bg-slate-500/70"
              initial={tier === 'off' ? false : { width: 0 }}
              animate={{ width: '34%' }}
              transition={{ delay: 0.85, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          <p className="mt-2 text-xs text-slate-400">con 的 o、tion 的 e，都不读“饱满”</p>
        </div>
      </div>
    </div>
  );
}
