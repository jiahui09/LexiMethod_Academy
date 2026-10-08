import { create } from 'zustand';
import type { Accent, AnimationTier } from '@/types';

type SoundMode = 'on' | 'off';

type SettingsState = {
  accent: Accent;                 // 英式 / 美式
  motionTier: AnimationTier | 'auto'; // auto = 跟随系统 prefers-reduced-motion
  sound: SoundMode;               // UI 音效
  ttsRate: number;                // 常速语速
  ttsSlowRate: number;            // 慢速语速
  particleDensity: 'auto' | 'low' | 'high';
  setAccent: (a: Accent) => void;
  setMotionTier: (t: AnimationTier | 'auto') => void;
  toggleSound: () => void;
  setTtsRate: (r: number) => void;
  setTtsSlowRate: (r: number) => void;
  setParticleDensity: (p: 'auto' | 'low' | 'high') => void;
};

/** 计算实际生效的动画档位（auto 时读取系统偏好） */
export function resolveMotionTier(pref: AnimationTier | 'auto'): AnimationTier {
  if (pref !== 'auto') return pref;
  if (typeof window === 'undefined' || !window.matchMedia) return 'full';
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'off' : 'full';
}

/**
 * 站点零数据存储：本 store 只存在于内存，**不写 localStorage / sessionStorage**。
 * 刷新或关闭页面即回到默认值。
 */
export const useSettings = create<SettingsState>()((set) => ({
  accent: 'uk',
  motionTier: 'auto',
  sound: 'on',
  ttsRate: 0.95,
  ttsSlowRate: 0.55,
  particleDensity: 'auto',
  setAccent: (accent) => set({ accent }),
  setMotionTier: (motionTier) => {
    set({ motionTier });
    applyMotionTier(motionTier);
  },
  toggleSound: () => set((s) => ({ sound: s.sound === 'on' ? 'off' : 'on' })),
  setTtsRate: (ttsRate) => set({ ttsRate }),
  setTtsSlowRate: (ttsSlowRate) => set({ ttsSlowRate }),
  setParticleDensity: (particleDensity) => set({ particleDensity }),
}));

/** 把动画档位写到 <html data-motion>，供 CSS 降级使用 */
export function applyMotionTier(pref: AnimationTier | 'auto') {
  if (typeof document === 'undefined') return;
  const tier = resolveMotionTier(pref);
  document.documentElement.dataset.motion = tier;
}
