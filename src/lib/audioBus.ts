/* ---------------------------------------------------------------
   音频总线：离线音频片段（音标/例词 mp3）+ 朗读状态事件
   - 与 Web Speech API 互斥：起播前 cancel TTS；TTS 起播前由 useSpeech 调 stopClip
   - speaking 状态事件供 Waveform / SpeakButton 使用（原 useSpeech 总线迁此）
   - 仅用浏览器 API，不 import 其他模块 → 无循环依赖
   --------------------------------------------------------------- */
import { useEffect, useState } from 'react';

type Source = 'tts' | 'clip' | null;
type Listener = (speaking: boolean) => void;

let source: Source = null;
const listeners = new Set<Listener>();

export function claimSource(s: 'tts' | 'clip'): void {
  source = s;
}

export function currentSource(): Source {
  return source;
}

export function releaseSource(s: 'tts' | 'clip'): void {
  if (source === s) source = null;
}

/** 朗读/音频状态事件（true = 正在出声） */
export function emitSpeaking(v: boolean): void {
  listeners.forEach((l) => l(v));
}

/** 组件 hook：正在朗读/播放音频 */
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

/* ---------------- 离线音频片段 ---------------- */

/**
 * 片段元素池：每个 URL 一个 Audio，src 一经设置永不改写。
 * - 切换/停止只 pause，不中止在途请求（避免 ERR_ABORTED 破坏网络审计）
 * - 预载也走池子，元素被引用不会被 GC 半途回收
 */
const clips = new Map<string, HTMLAudioElement>();
let active: HTMLAudioElement | null = null;

function getClip(url: string): HTMLAudioElement {
  let a = clips.get(url);
  if (!a) {
    a = new Audio();
    a.preload = 'auto';
    const finish = () => {
      if (active === a) {
        active = null;
        if (currentSource() === 'clip') {
          releaseSource('clip');
          emitSpeaking(false);
        }
      }
    };
    a.addEventListener('ended', finish);
    a.addEventListener('error', finish);
    a.src = url;
    clips.set(url, a);
  }
  return a;
}

/** 停止离线音频（若在播；仅暂停，保留已加载数据供重播） */
export function stopClip(): void {
  if (active) {
    active.pause();
    try {
      active.currentTime = 0;
    } catch {
      /* noop */
    }
    active = null;
  }
  if (currentSource() === 'clip') {
    releaseSource('clip');
    emitSpeaking(false);
  }
}

/** 播放离线音频片段；起播前取消 TTS，保证同一时间仅一路出声 */
export function playClip(url: string, opts: { rate?: number } = {}): boolean {
  if (typeof window === 'undefined' || !url) return false;
  try {
    window.speechSynthesis?.cancel();
  } catch {
    /* noop */
  }
  /* 暂停其它在播片段（不改 src，不中止请求） */
  for (const [k, a] of clips) {
    if (k !== url && !a.paused) a.pause();
  }
  const a = getClip(url);
  active = a;
  claimSource('clip');
  try {
    a.currentTime = 0;
  } catch {
    /* noop */
  }
  a.playbackRate = Math.max(0.3, Math.min(1.6, opts.rate ?? 1));
  /* 慢速播放必须保音高：音标学习里降调会改变元音音质（旧 Safari/WebKit 前缀分支） */
  if ('preservesPitch' in a) {
    a.preservesPitch = true;
  } else {
    (a as HTMLMediaElement & { webkitPreservesPitch?: boolean }).webkitPreservesPitch = true;
  }
  const p = a.play();
  if (p) {
    p.then(() => emitSpeaking(true)).catch(() => {
      if (active === a) {
        active = null;
        if (currentSource() === 'clip') {
          releaseSource('clip');
          emitSpeaking(false);
        }
      }
    });
  }
  return true;
}

/** 预载音频（进入页面/切换音标时 warm up，正式播放走同一元素） */
export function preloadClip(url: string): void {
  if (typeof window === 'undefined' || !url) return;
  getClip(url);
}
