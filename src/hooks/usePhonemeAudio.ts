import { useSettings } from '@/store/settingsStore';
import { phonemeAudioUrl } from '@/data/phonemeAudio';
import { playClip, preloadClip } from '@/lib/audioBus';

/** 当前慢速设置（与 TTS 慢速一致） */
function slowRate(): number {
  return useSettings.getState().ttsSlowRate;
}

/**
 * 播放音标孤立发音（离线 mp3，与页面同源）。
 * 返回 false = 该音标无离线资源，调用方应回退 speak(ttsWord)。
 */
export function speakPhoneme(id: string, opts: { slow?: boolean } = {}): boolean {
  const url = phonemeAudioUrl(id);
  if (!url) return false;
  return playClip(url, { rate: opts.slow ? slowRate() : 1 });
}

/** 预载某个音标的音频（音标页切换时调用，正式播放走缓存） */
export function preloadPhoneme(id: string): void {
  const url = phonemeAudioUrl(id);
  if (url) preloadClip(url);
}
