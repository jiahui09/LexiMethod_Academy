import { useSettings } from '@/store/settingsStore';

export type SfxKind = 'click' | 'correct' | 'wrong' | 'reveal' | 'complete' | 'tick';

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  if (!ctx) {
    try {
      ctx = new AC();
    } catch {
      return null;
    }
  }
  if (ctx.state === 'suspended') void ctx.resume().catch(() => undefined);
  return ctx;
}

function tone(freq: number, start: number, dur: number, gain: number, type: OscillatorType = 'sine') {
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, c.currentTime + start);
  g.gain.setValueAtTime(0.0001, c.currentTime + start);
  g.gain.exponentialRampToValueAtTime(gain, c.currentTime + start + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + start + dur);
  osc.connect(g);
  g.connect(c.destination);
  osc.start(c.currentTime + start);
  osc.stop(c.currentTime + start + dur + 0.05);
}

/** UI 音效（可在设置中关闭） */
export function playSfx(kind: SfxKind) {
  const s = useSettings.getState();
  if (s.sound === 'off') return;
  if (s.motionTier === 'off') {
    // 关闭动态时仍允许极轻音效
  }
  switch (kind) {
    case 'click':
      tone(660, 0, 0.07, 0.05, 'triangle');
      break;
    case 'tick':
      tone(880, 0, 0.04, 0.03, 'square');
      break;
    case 'correct':
      tone(659.25, 0, 0.12, 0.07, 'sine');
      tone(987.77, 0.09, 0.18, 0.07, 'sine');
      break;
    case 'wrong':
      tone(196, 0, 0.18, 0.07, 'sawtooth');
      tone(146.83, 0.08, 0.2, 0.05, 'sawtooth');
      break;
    case 'reveal':
      tone(523.25, 0, 0.1, 0.05, 'triangle');
      break;
    case 'complete':
      [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.09, 0.25, 0.07, 'sine'));
      break;
  }
}
