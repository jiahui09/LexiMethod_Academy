import { useEffect, useState } from 'react';
import { resolveMotionTier, useSettings } from '@/store/settingsStore';
import type { AnimationTier } from '@/types';

/** 动画档位：full / light / off（auto 跟随系统 prefers-reduced-motion） */
export function useMotionTier(): AnimationTier {
  const pref = useSettings((s) => s.motionTier);
  const [tier, setTier] = useState<AnimationTier>(() => resolveMotionTier(pref));

  useEffect(() => {
    const compute = () => setTier(resolveMotionTier(pref));
    compute();
    if (!window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = () => compute();
    mq.addEventListener?.('change', handler);
    return () => mq.removeEventListener?.('change', handler);
  }, [pref]);

  return tier;
}

/** 动画是否应大幅简化 */
export function useReduced(): boolean {
  const tier = useMotionTier();
  return tier !== 'full';
}

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia(query).matches;
  });
  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia(query);
    const handler = () => setMatches(mq.matches);
    handler();
    mq.addEventListener?.('change', handler);
    return () => mq.removeEventListener?.('change', handler);
  }, [query]);
  return matches;
}

export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 767px)');
}
