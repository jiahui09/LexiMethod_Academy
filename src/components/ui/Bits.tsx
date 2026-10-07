import { motion } from 'framer-motion';
import { Volume2, Loader2 } from 'lucide-react';
import { useSpeech, useSpeaking } from '@/hooks/useSpeech';
import { speakPhoneme } from '@/hooks/usePhonemeAudio';
import { wordAudioUrl } from '@/data/phonemeAudio';
import { useMotionTier } from '@/hooks/useMotionTier';
import { playSfx } from '@/hooks/useSfx';

/** 区块标题 */
export function SectionHeading({
  title,
  desc,
  align = 'left',
  as = 'h2',
}: {
  title: string;
  desc?: string;
  align?: 'left' | 'center';
  /** 标题层级：页面级标题（PageIntro）传 h1，区块标题默认 h2 —— 每路由恰好一个 h1 */
  as?: 'h1' | 'h2';
}) {
  const tier = useMotionTier();
  const anim =
    tier === 'off'
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
        };
  const Tag = as;
  return (
    <motion.div className={`mb-6 ${align === 'center' ? 'text-center' : ''}`} {...anim}>
      <Tag className="text-2xl font-bold text-paperink md:text-3xl">{title}</Tag>
      {desc && <p className="mt-2 max-w-3xl text-sm leading-relaxed text-colophon md:text-base">{desc}</p>}
    </motion.div>
  );
}

/** 朗读按钮：支持慢速/常速；传 phonemeId 时播放该音标的离线发音 */
export function SpeakButton({
  text,
  phonemeId,
  slow = false,
  label,
  size = 'md',
  className = '',
  tone = 'paper',
}: {
  text: string;
  phonemeId?: string;
  slow?: boolean;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  /** 视面：整站已统一辞书纸面（默认 'paper'：结构蓝描边，朗读中转批注红，无辉光） */
  tone?: 'dark' | 'paper';
}) {
  const { speak, supported } = useSpeech();
  const speaking = useSpeaking();
  const dim = size === 'sm' ? 'h-7 w-7' : size === 'lg' ? 'h-11 w-11' : 'h-9 w-9';
  const icon = size === 'sm' ? 14 : size === 'lg' ? 20 : 16;
  const offlineReady = !!phonemeId || !!wordAudioUrl(text);
  const ariaLabel =
    label ?? (phonemeId ? (slow ? '慢速播放音标发音' : '播放音标发音') : slow ? `慢速朗读 ${text}` : `朗读 ${text}`);
  const hint = phonemeId
    ? slow
      ? '慢速播放音标发音'
      : '播放音标发音（离线音频）'
    : supported || offlineReady
      ? slow
        ? '慢速播放'
        : '播放发音'
      : '当前浏览器不支持语音合成';

  return (
    <motion.button
      type="button"
      disabled={!supported && !offlineReady}
      aria-label={ariaLabel}
      title={hint}
      onClick={(e) => {
        e.stopPropagation();
        playSfx('tick');
        if (!(phonemeId && speakPhoneme(phonemeId, { slow }))) {
          speak(text, { slow });
        }
      }}
      whileTap={{ scale: 0.88 }}
      className={`inline-flex ${dim} shrink-0 items-center justify-center rounded-full border transition-colors duration-300 disabled:opacity-40 ${className}`}
      style={
        tone === 'paper'
          ? {
              borderColor: speaking ? 'rgba(179,49,30,0.6)' : slow ? 'rgba(30,75,122,0.55)' : 'rgba(30,75,122,0.45)',
              background: speaking ? 'rgba(179,49,30,0.07)' : 'rgba(30,75,122,0.06)',
              color: speaking ? '#B3311E' : '#1E4B7A',
              boxShadow: 'none',
            }
          : {
              borderColor: slow ? 'rgba(255,179,0,0.5)' : 'rgba(0,229,255,0.45)',
              background: slow ? 'rgba(255,179,0,0.12)' : 'rgba(0,229,255,0.12)',
              color: slow ? '#FFB300' : '#00E5FF',
              boxShadow: speaking ? '0 0 16px rgba(0,229,255,0.4)' : 'none',
            }
      }
    >
      {speaking ? <Loader2 size={icon} className="animate-spin" /> : <Volume2 size={icon} />}
    </motion.button>
  );
}
