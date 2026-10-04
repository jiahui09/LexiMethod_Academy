import { useEffect, useRef } from 'react';
import { useMotionTier } from '@/hooks/useMotionTier';
import { useIsMobile } from '@/hooks/useMotionTier';
import { useSettings } from '@/store/settingsStore';

type P = { x: number; y: number; vx: number; vy: number; r: number; hue: number; a: number };

/**
 * 极光粒子背景：canvas 实现
 * 桌面 ≤120 颗，移动 ≤40 颗，动画关闭档 = 0 颗
 */
export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tier = useMotionTier();
  const isMobile = useIsMobile();
  const density = useSettings((s) => s.particleDensity);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const base = isMobile ? 40 : 120;
    const factor = density === 'low' ? 0.5 : density === 'high' ? 1.25 : 1;
    const count = tier === 'off' ? 0 : Math.round(base * factor);
    if (count === 0) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const colors = [187, 196, 268, 318]; // cyan / violet / blue / pink hue
    const ps: P[] = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.24,
      vy: -0.06 - Math.random() * 0.22,
      r: 0.7 + Math.random() * 1.9,
      hue: colors[Math.floor(Math.random() * colors.length)],
      a: 0.16 + Math.random() * 0.42,
    }));

    let raf = 0;
    let running = true;
    let frame = 0;
    const skip = tier === 'light' ? 2 : 1; // light 档：每 2 帧绘制一次，降低 GPU 占用

    const paint = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of ps) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -8) {
          p.y = h + 8;
          p.x = Math.random() * w;
        }
        if (p.x < -8) p.x = w + 8;
        if (p.x > w + 8) p.x = -8;
        ctx.beginPath();
        ctx.fillStyle = `hsla(${p.hue}, 95%, 65%, ${p.a})`;
        ctx.shadowColor = `hsla(${p.hue}, 95%, 60%, 0.85)`;
        ctx.shadowBlur = 8;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    };

    const loop = () => {
      if (!running) return;
      frame++;
      if (frame % skip === 0) paint();
      raf = requestAnimationFrame(loop);
    };

    const onResize = () => resize();
    window.addEventListener('resize', onResize);
    raf = requestAnimationFrame(loop);

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        raf = requestAnimationFrame(loop);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [tier, isMobile, density]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
      style={{ opacity: tier === 'off' ? 0 : 1 }}
    />
  );
}
