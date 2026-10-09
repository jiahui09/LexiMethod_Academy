import React, { useEffect, useRef, useState } from 'react';
import { Volume2, Turtle, Loader2 } from 'lucide-react';
import { useSpeech, useSpeaking } from '@/hooks/useSpeech';
import { speakPhoneme } from '@/hooks/usePhonemeAudio';
import { wordAudioUrl } from '@/data/phonemeAudio';
import { playSfx } from '@/hooks/useSfx';

/**
 * 朗读钮（瑞士世界）：静止 = 墨线描边小方钮；朗读中 = 墨色实心 + Loader2 转圈（状态=形状）。
 * 图标词汇（全站映射）：常速 = Volume2，慢速 = Turtle——两个速度一眼可分（纯视觉缺陷修复）。
 * 慢速模式另有下层页底提示；朱红不参与（只给错误）。
 * 接线与全站一致：站内离线音频优先，句子回退浏览器语音合成。
 */
export function SpeakButton({
  text,
  phonemeId,
  audioKey,
  slow = false,
  label,
  size = 'md',
  className = '',
  onSpeak,
}: {
  text: string;
  phonemeId?: string;
  /** 离线音频键（WORD_AUDIO key）：与 text 不一致时按此取音频（同形异读词用） */
  audioKey?: string;
  slow?: boolean;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  /** 朗读真正被触发时回调（供词头盖章等签名交互挂载） */
  onSpeak?: () => void;
}) {
  const { speak, supported } = useSpeech();
  const speaking = useSpeaking();
  /* 朗读中反馈（可见）：点击即点亮本钮，不等音频总线回音；
     总线报「静默」复位；起播迟迟无回音（被浏览器拦下等失败场景）由兜底计时器撤回，
     避免按钮卡死在朗读态。Loader2 = 契约许可的 CSS 关键帧（reduced-motion / data-motion=off 下自动归零，
     此时仍有「墨色实心 + 静态图标」的形状区分）。 */
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
  const icon = size === 'sm' ? 13 : size === 'lg' ? 20 : 16;
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
        onSpeak?.();
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
        borderColor: playing ? '#111111' : 'rgba(17,17,17, 0.55)',
        background: playing ? '#111111' : slow ? '#F1F1F1' : 'transparent',
        color: playing ? '#FFFFFF' : slow ? '#555555' : '#111111',
      }}
    >
      {playing ? <Loader2 size={icon} className="animate-spin" aria-hidden /> : slow ? <Turtle size={icon} aria-hidden /> : <Volume2 size={icon} aria-hidden />}
    </button>
  );
}

/** 选片芯片：单选/过滤的行内小控件。选中 = 墨色实心（实心方块语义），未选 = 墨线描边。 */
export function EduChip({
  children,
  active = false,
  onClick,
  className = '',
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={
        onClick
          ? () => {
              playSfx('click');
              onClick();
            }
          : undefined
      }
      aria-pressed={onClick ? active : undefined}
      className={`hinge inline-flex min-h-[36px] items-center gap-1.5 border-2 px-3 py-1 text-xs font-medium ${className}`}
      style={{
        borderColor: active ? '#111111' : 'rgba(17,17,17, 0.45)',
        background: active ? '#111111' : 'transparent',
        color: active ? '#FFFFFF' : '#555555',
      }}
    >
      {children}
    </Tag>
  );
}
