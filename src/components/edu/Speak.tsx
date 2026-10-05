import React from 'react';
import { Volume2, Loader2 } from 'lucide-react';
import { useSpeech, useSpeaking } from '@/hooks/useSpeech';
import { speakPhoneme } from '@/hooks/usePhonemeAudio';
import { wordAudioUrl } from '@/data/phonemeAudio';
import { playSfx } from '@/hooks/useSfx';

/**
 * 朗读钮（辞书版式）：词典里的发音小喇叭。
 * 接线与全站一致：站内离线音频优先，句子回退浏览器语音合成。
 * 朗读中 = 批注红实心（唯一功能色），静止 = 发丝线描边。
 */
export function SpeakButton({
  text,
  phonemeId,
  slow = false,
  label,
  size = 'md',
  className = '',
  onSpeak,
}: {
  text: string;
  phonemeId?: string;
  slow?: boolean;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  /** 朗读真正被触发时回调（供词头盖章等签名交互挂载） */
  onSpeak?: () => void;
}) {
  const { speak, supported } = useSpeech();
  const speaking = useSpeaking();
  const dim = size === 'sm' ? 'h-7 w-7' : size === 'lg' ? 'h-11 w-11' : 'h-9 w-9';
  const icon = size === 'sm' ? 13 : size === 'lg' ? 20 : 16;
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
        onSpeak?.();
      }}
      className={`inline-flex ${dim} shrink-0 items-center justify-center rounded-full border transition-colors duration-200 active:translate-y-px disabled:opacity-40 ${className}`}
      style={{
        borderColor: speaking ? '#B3311E' : slow ? 'rgba(30, 75, 122, 0.55)' : 'rgba(22, 19, 15, 0.35)',
        background: speaking ? '#B3311E' : slow ? 'rgba(30, 75, 122, 0.08)' : 'transparent',
        color: speaking ? '#F7F2E8' : slow ? '#1E4B7A' : '#16130F',
      }}
    >
      {speaking ? <Loader2 size={icon} className="animate-spin" aria-hidden /> : <Volume2 size={icon} aria-hidden />}
    </button>
  );
}

/** 纸面芯片：单选/过滤的行内小控件。选中 = 批注红实心（当前），未选 = 发丝线描边。 */
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
      className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors duration-200 ${className}`}
      style={{
        borderColor: active ? '#B3311E' : 'rgba(22, 19, 15, 0.28)',
        background: active ? '#B3311E' : 'transparent',
        color: active ? '#F7F2E8' : '#4A443B',
      }}
    >
      {children}
    </Tag>
  );
}
