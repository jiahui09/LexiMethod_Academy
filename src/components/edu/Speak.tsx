import React from 'react';
import { Volume2, Loader2 } from 'lucide-react';
import { useSpeech, useSpeaking } from '@/hooks/useSpeech';
import { speakPhoneme } from '@/hooks/usePhonemeAudio';
import { wordAudioUrl } from '@/data/phonemeAudio';
import { playSfx } from '@/hooks/useSfx';

/**
 * 朗读钮（压膜活页手册）：静止 = 墨线描边小圆钮；朗读中 = 墨色实心（状态=形状）。
 * 慢速模式 = 下层页底提示；朱红不参与（只给错误）。
 * 接线与全站一致：站内离线音频优先，句子回退浏览器语音合成。
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
      className={`hinge inline-flex ${dim} shrink-0 items-center justify-center rounded-full border disabled:opacity-40 ${className}`}
      style={{
        borderColor: speaking ? '#17140E' : slow ? 'rgba(23, 20, 14, 0.55)' : 'rgba(23, 20, 14, 0.55)',
        background: speaking ? '#17140E' : slow ? '#EDE8DA' : 'transparent',
        color: speaking ? '#F4F1E7' : slow ? '#57503F' : '#17140E',
      }}
    >
      {speaking ? <Loader2 size={icon} className="animate-spin" aria-hidden /> : <Volume2 size={icon} aria-hidden />}
    </button>
  );
}

/** 手册芯片：单选/过滤的行内小控件。选中 = 墨色实心（打孔语义），未选 = 墨线描边。 */
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
      className={`hinge inline-flex min-h-[36px] items-center gap-1.5 rounded-[3px] border px-3 py-1 text-xs font-medium ${className}`}
      style={{
        borderColor: active ? '#17140E' : 'rgba(23, 20, 14, 0.45)',
        background: active ? '#17140E' : 'transparent',
        color: active ? '#F4F1E7' : '#57503F',
      }}
    >
      {children}
    </Tag>
  );
}
