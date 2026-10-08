import { Volume2, Loader2 } from 'lucide-react';
import { useSpeech, useSpeaking } from '@/hooks/useSpeech';
import { speakPhoneme } from '@/hooks/usePhonemeAudio';
import { wordAudioUrl } from '@/data/phonemeAudio';
import { playSfx } from '@/hooks/useSfx';

/** 区块标题：黑体承题，无入场编排（Hinge Step Rule） */
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
  const Tag = as;
  return (
    <div className={`mb-6 ${align === 'center' ? 'text-center' : ''}`}>
      <Tag className="font-display text-2xl font-bold text-ink md:text-3xl">{title}</Tag>
      {desc && <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink2 md:text-base">{desc}</p>}
    </div>
  );
}

/** 朗读按钮：支持慢速/常速；传 phonemeId 时播放该音标的离线发音。
 *  手册世界单一样式：静止 = 墨线描边，朗读中 = 墨色实心（状态=形状），慢速 = 下层页底。 */
export function SpeakButton({
  text,
  phonemeId,
  slow = false,
  label,
  size = 'md',
  className = '',
}: {
  text: string;
  phonemeId?: string;
  slow?: boolean;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  /** 兼容旧调用方的视面参数；全站已统一手册面，忽略 */
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
    <button
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
      className={`hinge inline-flex ${dim} shrink-0 items-center justify-center rounded-full border disabled:opacity-40 ${className}`}
      style={{
        borderColor: speaking ? '#17140E' : 'rgba(23,20,14,0.55)',
        background: speaking ? '#17140E' : slow ? '#EDE8DA' : 'transparent',
        color: speaking ? '#F4F1E7' : slow ? '#57503F' : '#17140E',
      }}
    >
      {speaking ? <Loader2 size={icon} className="animate-spin" aria-hidden /> : <Volume2 size={icon} aria-hidden />}
    </button>
  );
}
