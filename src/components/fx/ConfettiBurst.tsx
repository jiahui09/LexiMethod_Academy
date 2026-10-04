import { useEffect, useRef } from 'react';
import { useMotionTier } from '@/hooks/useMotionTier';

type Props = { fireKey: number; count?: number };

type Particle = {
  x: number; y: number; vx: number; vy: number; rot: number; vr: number;
  w: number; h: number; color: string; life: number; ttl: number;
};

const PALETTE = ['#00E5FF', '#7C4DFF', '#FF4D9D', '#00E676', '#FFB300'];

/** 成功彩带 / 粒子爆发：fireKey 变化即触发一次 */
export default function ConfettiBurst({ fireKey, count = 80 }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const tier = useMotionTier();

  useEffect(() => {
    if (fireKey <= 0) return;
    if (tier === 'off') return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const n = tier === 'light' ? Math.round(count * 0.5) : count;
    const ps: Particle[] = Array.from({ length: n }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2.5 + Math.random() * 7;
      return {
        x: w / 2,
        y: h / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.4,
        w: 5 + Math.random() * 7,
        h: 3 + Math.random() * 5,
        color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
        life: 1,
        ttl: 0.9 + Math.random() * 0.7,
      };
    });

    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      ctx.clearRect(0, 0, w, h);
      let alive = false;
      for (const p of ps) {
        p.life -= dt / p.ttl;
        if (p.life <= 0) continue;
        alive = true;
        p.vy += 14 * dt;
        p.vx *= 0.99;
        p.x += p.vx * dt * 60 * 0.35;
        p.y += p.vy * dt * 60 * 0.35;
        p.rot += p.vr;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
      if (alive) raf = requestAnimationFrame(loop);
      else ctx.clearRect(0, 0, w, h);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [fireKey, count, tier]);

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 z-20 h-full w-full" />;
}
