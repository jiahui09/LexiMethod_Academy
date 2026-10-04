import { useCallback, useEffect, useRef, useState } from 'react';
import { useSettings } from '@/store/settingsStore';

/* ---------------------------------------------------------------
   Web Speech API 封装：英式/美式音色、常速/慢速、音标回退读例词
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

/** 播放一段英文；返回是否成功启动 */
export function speakText(text: string, opts: SpeakOptions = {}): boolean {
  if (!speechSupported() || !text) return false;
  const s = useSettings.getState();
  try {
    window.speechSynthesis.cancel();
  } catch {
    /* noop */
  }
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
  emitSpeakEvent(true);
  u.onend = () => emitSpeakEvent(false);
  u.onerror = () => emitSpeakEvent(false);
  return true;
}

export function stopSpeech() {
  if (!speechSupported()) return;
  try {
    window.speechSynthesis.cancel();
  } catch {
    /* noop */
  }
  emitSpeakEvent(false);
}

/* 简易事件总线：让任意组件显示“正在朗读”波形 */
type Listener = (speaking: boolean) => void;
const listeners = new Set<Listener>();
function emitSpeakEvent(v: boolean) {
  listeners.forEach((l) => l(v));
}

export function useSpeaking(): boolean {
  const [speaking, setSpeaking] = useState(false);
  useEffect(() => {
    const l: Listener = (v) => setSpeaking(v);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);
  return speaking;
}

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
