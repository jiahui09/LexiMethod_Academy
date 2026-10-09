import { create } from 'zustand';
import type { Accent, AnimationTier } from '@/types';
import {
  clearLearningData,
  readPersistPref,
  saveAllNow,
  writePersistPref,
} from './persistence';

type SoundMode = 'on' | 'off';

type SettingsState = {
  accent: Accent;                 // 英式 / 美式
  motionTier: AnimationTier | 'auto'; // auto = 跟随系统 prefers-reduced-motion
  sound: SoundMode;               // UI 音效
  ttsRate: number;                // 常速语速
  ttsSlowRate: number;            // 慢速语速
  particleDensity: 'auto' | 'low' | 'high';
  /** 学习进度是否持久化到本机 localStorage（默认开；P0-2，用户已拍板） */
  persistProgress: boolean;
  setAccent: (a: Accent) => void;
  setMotionTier: (t: AnimationTier | 'auto') => void;
  toggleSound: () => void;
  setTtsRate: (r: number) => void;
  setTtsSlowRate: (r: number) => void;
  setParticleDensity: (p: 'auto' | 'low' | 'high') => void;
  /** 打开=把当前内存进度立即补写本机；关闭=删掉已存的学习数据（内存态保留，刷新即归零） */
  setPersistProgress: (on: boolean) => void;
};

/** 计算实际生效的动画档位（auto 时读取系统偏好） */
export function resolveMotionTier(pref: AnimationTier | 'auto'): AnimationTier {
  if (pref !== 'auto') return pref;
  if (typeof window === 'undefined' || !window.matchMedia) return 'full';
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'off' : 'full';
}

/**
 * 存储口径（P0-2）：偏好本身仍是会话内存态（刷新回默认），唯二例外是
 * 「进度持久化开关」写在 `leximethod.prefs.v1`（否则关不掉），
 * 开关打开时学习进度/错题写入 `leximethod.progress.v1` / `leximethod.review.v1`。
 * 一律只写本机 localStorage，不上行、不追踪（PRODUCT.md 已改写）。
 */
export const useSettings = create<SettingsState>()((set) => ({
  accent: 'uk',
  motionTier: 'auto',
  sound: 'on',
  ttsRate: 0.95,
  ttsSlowRate: 0.55,
  particleDensity: 'auto',
  persistProgress: readPersistPref(),
  setAccent: (accent) => set({ accent }),
  setMotionTier: (motionTier) => {
    set({ motionTier });
    applyMotionTier(motionTier);
  },
  toggleSound: () => set((s) => ({ sound: s.sound === 'on' ? 'off' : 'on' })),
  setTtsRate: (ttsRate) => set({ ttsRate }),
  setTtsSlowRate: (ttsSlowRate) => set({ ttsSlowRate }),
  setParticleDensity: (particleDensity) => set({ particleDensity }),
  setPersistProgress: (on) => {
    set({ persistProgress: on });
    writePersistPref(on);
    if (on) saveAllNow(); // 打开：把当前内存态立刻补写本机
    else clearLearningData(); // 关闭：删掉已存学习数据，本会话内存态保留
  },
}));

/** 把动画档位写到 <html data-motion>，供 CSS 降级使用 */
export function applyMotionTier(pref: AnimationTier | 'auto') {
  if (typeof document === 'undefined') return;
  const tier = resolveMotionTier(pref);
  document.documentElement.dataset.motion = tier;
}
