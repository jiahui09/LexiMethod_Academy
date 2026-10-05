import { useCallback, useEffect, useRef, useState } from 'react';
import { useSettings } from '@/store/settingsStore';
import { wordAudioUrl } from '@/data/phonemeAudio';
import {
  claimSource,
  currentSource,
  emitSpeaking,
  playClip,
  releaseSource,
  stopClip,
} from '@/lib/audioBus';

/* ---------------------------------------------------------------
   朗读：离线例词音频优先 → Web Speech API 兜底
   （音标本体播放走 @/hooks/usePhonemeAudio）
   --------------------------------------------------------------- */

let cachedVoices: SpeechSynthesisVoice[] = [];
let voicesReady = false;

function loadVoices(cb?: (v: SpeechSynthesisVoice[]) => void) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  const sync = () => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length) {
      cachedVoices = voices;
      voicesReady = true;
      cb?.(voices);
    }
  };
  sync();
  window.speechSynthesis.addEventListener('voiceschanged', sync);
}

export function speechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
}

function pickVoice(accent: 'uk' | 'us'): SpeechSynthesisVoice | undefined {
  if (!cachedVoices.length) loadVoices();
  const en = cachedVoices.filter((v) => v.lang?.toLowerCase().startsWith('en'));
  if (!en.length) return undefined;
  const want = accent === 'uk' ? 'gb' : 'us';
  const primary = en.filter((v) => v.lang.toLowerCase().includes(want));
  const natural = primary.find((v) => /natural|neural|premium/i.test(v.name));
  return natural ?? primary[0] ?? en.find((v) => /google|siri|samantha|daniel/i.test(v.name)) ?? en[0];
}

export type SpeakOptions = { slow?: boolean; forceAccent?: 'uk' | 'us'; rate?: number };

let currentUtterance: SpeechSynthesisUtterance | null = null;

/** TTS 播放结束（仅当当前声源仍是 TTS 时复位状态，避免与音频片段互相踩状态） */
function endTts() {
  if (currentSource() === 'tts') {
    releaseSource('tts');
    emitSpeaking(false);
  }
}

/** 播放一段英文：优先离线例词音频，回退浏览器 TTS；返回是否成功启动 */
export function speakText(text: string, opts: SpeakOptions = {}): boolean {
  if (!text) return false;

  /* 例词命中离线音频 → 直接播放（同源 mp3，无外部请求） */
  const clipUrl = wordAudioUrl(text);
  if (clipUrl) {
    const s = useSettings.getState();
    return playClip(clipUrl, { rate: opts.rate ?? (opts.slow ? s.ttsSlowRate : 1) });
  }

  if (!speechSupported()) return false;
  stopClip();
  claimSource('tts');
  const s = useSettings.getState();
  const voice = pickVoice(opts.forceAccent ?? s.accent);
  const base = opts.rate ?? (opts.slow ? s.ttsSlowRate : s.ttsRate);
  const u = new SpeechSynthesisUtterance(text);
  if (voice) {
    u.voice = voice;
    u.lang = voice.lang;
  } else {
    u.lang = opts.forceAccent === 'us' || s.accent === 'us' ? 'en-US' : 'en-GB';
  }
  u.rate = Math.max(0.3, Math.min(1.6, base));
  u.pitch = 1;
  u.volume = 1;
  currentUtterance = u;
  window.speechSynthesis.speak(u);
  if (currentSource() === 'tts') emitSpeaking(true);
  u.onend = endTts;
  u.onerror = endTts;
  return true;
}

export function stopSpeech() {
  stopClip();
  if (!speechSupported()) return;
  try {
    window.speechSynthesis.cancel();
  } catch {
    /* noop */
  }
  endTts();
}

/* 朗读状态事件与 hook 统一在音频总线维护 */
export { useSpeaking } from '@/lib/audioBus';

/** 组件 hook：拿到绑定好的 speak / stop 与支持状态 */
export function useSpeech() {
  const accent = useSettings((s) => s.accent);
  const ttsRate = useSettings((s) => s.ttsRate);
  const ttsSlowRate = useSettings((s) => s.ttsSlowRate);
  const [supported, setSupported] = useState(true);
  const voiceNameRef = useRef<string>('');

  useEffect(() => {
    setSupported(speechSupported());
    loadVoices((v) => {
      const picked = pickVoice(useSettings.getState().accent);
      voiceNameRef.current = picked?.name ?? '';
    });
  }, []);

  const speak = useCallback(
    (text: string, opts: SpeakOptions = {}) => speakText(text, opts),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [accent, ttsRate, ttsSlowRate],
  );

  const stop = useCallback(() => stopSpeech(), []);

  return { speak, stop, supported, accent };
}
