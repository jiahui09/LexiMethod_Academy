import { useEffect, useRef, useState } from 'react';
import { Volume2, Turtle, Loader2 } from 'lucide-react';
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
 *  瑞士世界单一样式：静止 = 墨线描边，朗读中 = 墨色实心 + Loader2（状态=形状），
 *  图标词汇：常速 = Volume2、慢速 = Turtle（与 edu/Speak.tsx 同步维护）。 */
export function SpeakButton({
  text,
  phonemeId,
  audioKey,
  slow = false,
  label,
  size = 'md',
  className = '',
}: {
  text: string;
  phonemeId?: string;
  /** 离线音频键（WORD_AUDIO key）：与 text 不一致时按此取音频（同形异读词用） */
  audioKey?: string;
  slow?: boolean;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  /** 兼容旧调用方的视面参数；全站已统一瑞士面，忽略 */
  tone?: 'dark' | 'paper';
}) {
  const { speak, supported } = useSpeech();
  const speaking = useSpeaking();
  /* 朗读中反馈（可见）：点击即点亮本钮，不等音频总线回音；总线报静默复位，
     起播无回音（失败）由兜底计时器撤回。与 edu/Speak.tsx 保持同一实现。 */
  const [firing, setFiring] = useState(false);
  const busRef = useRef(speaking);
  const guardRef = useRef<number | undefined>(undefined);
  useEffect(() => {
    busRef.current = speaking;
    if (!speaking) setFiring(false);
  }, [speaking]);
  useEffect(() => () => window.clearTimeout(guardRef.current), []);
  const playing = firing || speaking;

  const dim = size === 'sm' ? 'h-7 w-7' : size === 'lg' ? 'h-11 w-11' : 'h-9 w-9';
  const icon = size === 'sm' ? 14 : size === 'lg' ? 20 : 16;
  const offlineReady = !!phonemeId || !!wordAudioUrl(audioKey ?? text);
  const ariaLabel =
    label ?? (phonemeId ? (slow ? '慢速播放音标发音' : '播放音标发音') : slow ? `慢速朗读 ${text}` : `朗读 ${text}`);
  /* hint 与实际音源一致：离线 mp3 标注离线；词库外回退浏览器语音合成；两者皆无才禁用 */
  const hint = phonemeId
    ? slow
      ? '慢速播放音标发音（离线音频）'
      : '播放音标发音（离线音频）'
    : offlineReady
      ? slow
        ? '慢速朗读（离线音频）'
        : '播放发音（离线音频）'
      : supported
        ? slow
          ? '慢速播放（浏览器语音合成）'
          : '播放发音（浏览器语音合成）'
        : '当前浏览器不支持语音合成，且该文本无离线音频';

  return (
    <button
      type="button"
      disabled={!supported && !offlineReady}
      aria-label={ariaLabel}
      aria-busy={playing}
      title={hint}
      onClick={(e) => {
        e.stopPropagation();
        playSfx('tick');
        const started = phonemeId && speakPhoneme(phonemeId, { slow }) ? true : speak(text, { slow, audioKey });
        if (started) {
          setFiring(true);
          window.clearTimeout(guardRef.current);
          guardRef.current = window.setTimeout(() => {
            if (!busRef.current) setFiring(false);
          }, 1500);
        }
      }}
      className={`hinge inline-flex ${dim} shrink-0 items-center justify-center border-2 disabled:opacity-40 ${className}`}
      style={{
        borderColor: playing ? '#111111' : 'rgba(17,17,17,0.55)',
        background: playing ? '#111111' : slow ? '#F1F1F1' : 'transparent',
        color: playing ? '#FFFFFF' : slow ? '#555555' : '#111111',
      }}
    >
      {playing ? (
        <Loader2 size={icon} className="animate-spin" aria-hidden />
      ) : slow ? (
        <Turtle size={icon} aria-hidden />
      ) : (
        <Volume2 size={icon} aria-hidden />
      )}
    </button>
  );
}
