import { motion } from 'framer-motion';
import { Volume2, Lightbulb } from 'lucide-react';
import { useMotionTier } from '@/hooks/useMotionTier';
import { useSpeech } from '@/hooks/useSpeech';
import { playSfx } from '@/hooks/useSfx';
import { getDemo } from '../demoConfig';
import type { Method } from '@/types';

/**
 * 步 3：规则演示 —— 音节块 + 重音批注 + 点击朗读。
 * 重读是功能状态：批注红承载（含「重音」形状标签），纹样与颜色同时编码；
 * 背景脉冲与辉光已除，内容动画（音节块入场、量条推进）保留。
 */
export default function RuleStep({ method }: { method: Method }) {
  const tier = useMotionTier();
  const { speak, supported } = useSpeech();
  const demo = getDemo(method.id).rule;
  const stressedIpa = demo ? demo.syllableIpa[demo.stress].replace(/\//g, '') : '';

  if (!demo) {
    return (
      <ol className="flex flex-col divide-y divide-rule border-y border-rule">
        {method.principles.map((p, i) => (
          <li key={i} className="flex items-start gap-3 px-1 py-3">
            <span className="font-serif text-sm font-bold text-rubric">{i + 1}</span>
            <p className="text-[14.5px] leading-[1.85] text-paperink">{p}</p>
          </li>
        ))}
      </ol>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* 规则标题 + 朗读（词典发音行） */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="flex items-center gap-2 text-[13px] font-semibold text-cobalt">
          <Lightbulb size={13} aria-hidden /> {demo.ruleTitle}
        </span>
        <button
          type="button"
          onClick={() => {
            playSfx('tick');
            speak(demo.word);
          }}
          disabled={!supported}
          className="inline-flex min-h-[36px] items-center gap-1.5 rounded-full border border-[rgba(22,19,15,0.35)] px-3 py-1 text-xs text-paperink transition-colors hover:border-rubric hover:text-rubric disabled:opacity-40"
          aria-label={`播放 ${demo.word} 的发音`}
        >
          <Volume2 size={13} aria-hidden /> 朗读 {demo.word}（点击可听）
        </button>
        <span className="ipa text-sm text-colophon">{demo.ipa}</span>
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
              initial={tier === 'off' ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: stressed ? 1 : 0.6, y: 0 }}
              transition={{ delay: 0.1 + i * 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => {
                playSfx(stressed ? 'correct' : 'tick');
                speak(syl);
              }}
              className={`relative flex flex-col items-center gap-1 rounded-[4px] border px-5 py-4 transition-colors duration-200 hover:opacity-100 ${
                stressed ? 'border-rubric bg-rubric/[0.07]' : 'border-rule bg-bone2/50'
              }`}
              aria-label={`${syl}${stressed ? '（重读音节）' : ''}，点击朗读`}
            >
              <span className={`font-serif text-xl font-bold ${stressed ? 'text-rubric' : 'text-paperink'}`}>{syl}</span>
              <span className="ipa text-xs text-colophon">{demo.syllableIpa[i]}</span>
              {stressed && (
                <span
                  className={`absolute -top-3 left-1/2 -translate-x-1/2 rounded-[2px] bg-rubric px-2 py-0.5 text-xs font-bold text-[#FBF6EC] ${
                    tier === 'off' ? '' : 'edu-stamp'
                  }`}
                  style={tier === 'off' ? { transform: 'rotate(-8deg)' } : undefined}
                >
                  重音
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* 规则文字：双细线夹注 */}
      <div className="border-y-[3px] border-double border-rule py-3 text-[14.5px] leading-[1.85] text-paperink">
        {demo.ruleText}
      </div>

      {/* 对比：重读 vs 弱读（发丝线分栏，量条为数据非装饰） */}
      <div className="grid gap-x-6 gap-y-4 border-t border-rule pt-4 md:grid-cols-2">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-rubric">重读音节：/{stressedIpa}/</div>
          <div className="h-1.5 w-full bg-rule">
            <motion.div
              className="h-full bg-rubric"
              initial={tier === 'off' ? false : { width: 0 }}
              animate={{ width: '82%' }}
              transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          <p className="mt-2 text-xs text-colophon">音量更大、音长更长、音高更突出</p>
        </div>
        <div>
          <div className="mb-2 text-xs font-semibold text-colophon">非重读音节：弱读为 /ə/ 或短元音</div>
          <div className="h-1.5 w-full bg-rule">
            <motion.div
              className="h-full bg-colophon/50"
              initial={tier === 'off' ? false : { width: 0 }}
              animate={{ width: '34%' }}
              transition={{ delay: 0.65, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          <p className="mt-2 text-xs text-colophon">con 的 o、tion 的 e，都不读“饱满”</p>
        </div>
      </div>
    </div>
  );
}
