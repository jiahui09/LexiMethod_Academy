import { useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { GitBranch, Volume2, ZoomIn } from 'lucide-react';
import { words } from '@/data/words';
import { useMotionTier } from '@/hooks/useMotionTier';
import { useSpeech } from '@/hooks/useSpeech';
import { playSfx } from '@/hooks/useSfx';
import { SpeakButton } from '@/components/ui/Bits';

/**
 * 词根词缀步骤：色块飞入拼装（GSAP 时间线）+ 词族树 SVG 路径生长
 */
export default function RootsStep() {
  const tier = useMotionTier();
  const { speak } = useSpeech();
  const scope = useRef<HTMLDivElement>(null);
  const treeRef = useRef<SVGSVGElement>(null);
  const word = words.find((w) => w.id === 'inspect') ?? words[0];
  const [assembled, setAssembled] = useState(false);

  useLayoutEffect(() => {
    if (tier === 'off') {
      setAssembled(true);
      return;
    }
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from('.morph-block', {
        x: (i: number) => [-160, 170, -120][i % 3],
        y: (i: number) => [-40, 60, -80][i % 3],
        opacity: 0,
        rotate: (i: number) => [-8, 6, -5][i % 3],
        duration: 0.7,
        stagger: 0.16,
      })
        .to('.morph-block', {
          boxShadow: '0 0 34px rgba(255,77,157,0.55)',
          duration: 0.28,
          yoyo: true,
          repeat: 1,
          onComplete: () => {
            setAssembled(true);
            playSfx('correct');
          },
        })
        .from(
          '.tree-path',
          {
            strokeDashoffset: (i: number, el: SVGPathElement) => Number(el.getAttribute('data-len') ?? 200),
            duration: 0.8,
            stagger: 0.14,
          },
          '-=0.1',
        )
        .from(
          '.tree-node',
          {
            scale: 0.4,
            opacity: 0,
            duration: 0.45,
            stagger: 0.1,
            ease: 'back.out(2)',
          },
          '-=0.9',
        );
    }, scope);
    return () => ctx.revert();
  }, [tier, word.id]);

  const family = word.wordFamily;
  const nodes = [{ word: word.word, pos: word.partOfSpeech.split(' ')[0], meaning: word.meaningCN }, ...family];

  return (
    <div ref={scope} className="flex flex-col gap-5">
      {/* 拼装 */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
        <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <span className="flex items-center gap-1.5 rounded-md bg-pink/15 px-2 py-0.5 font-semibold text-pink">
            <ZoomIn size={12} aria-hidden /> 色块拼装
          </span>
          <span className="font-display text-base font-semibold text-white">{word.word}</span>
          <span className="ipa">{word.phoneticUK}</span>
          <SpeakButton text={word.word} size="sm" />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {word.roots.map((r) => (
            <div
              key={`${r.text}-${r.type}`}
              className="morph-block flex flex-col items-center gap-1 rounded-2xl border px-5 py-4 backdrop-blur-md"
              style={{ borderColor: `${r.color}88`, background: `${r.color}1A` }}
            >
              <span className="font-display text-xl font-bold" style={{ color: r.color }}>
                {r.text}
              </span>
              <span className="text-[11px] text-slate-300">{r.meaning}</span>
              <span
                className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                style={{ background: `${r.color}2A`, color: r.color }}
              >
                {r.type === 'prefix' ? '前缀' : r.type === 'suffix' ? '后缀' : '词根'}
              </span>
            </div>
          ))}
          <span className="text-2xl text-slate-500" aria-hidden>
            =
          </span>
          <motion.div
            initial={tier === 'off' ? false : { opacity: 0, scale: 0.85 }}
            animate={assembled ? { opacity: 1, scale: 1 } : {}}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="flex flex-col items-center gap-1 rounded-2xl border border-success/50 bg-success/12 px-6 py-4 shadow-[0_0_28px_rgba(0,230,118,0.25)]"
          >
            <span className="font-display text-lg font-bold text-white">{word.word}</span>
            <span className="text-[11px] text-[#B9FFD9]">{word.meaningCN}</span>
          </motion.div>
        </div>

        <p className="mt-4 text-center text-xs text-slate-400">
          {word.roots.map((r) => `${r.text}（${r.meaning}）`).join(' + ')} → 拆开每一块，生词就变成了三个已知零件
        </p>
      </div>

      {/* 词族树 */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
          <GitBranch size={13} aria-hidden /> 词族树：一个词根，一串同源词
        </div>
        <div className="overflow-x-auto">
          <svg ref={treeRef} viewBox="0 0 640 260" className="h-[240px] w-full min-w-[560px]" role="img" aria-label={`${word.word} 的词族树`}>
            {/* 连接路径 */}
            {nodes.slice(1).map((_, i) => {
              const x = 70 + ((i + 1) % 4) * 150;
              const y = 180 + Math.floor((i + 1) / 4) * 70;
              const d = `M 320 70 C 320 120, ${x} 120, ${x} ${y - 24}`;
              return (
                <path
                  key={i}
                  className="tree-path"
                  d={d}
                  fill="none"
                  stroke="url(#tree-grad)"
                  strokeWidth={2}
                  strokeDasharray={400}
                  data-len={400}
                  opacity={0.75}
                />
              );
            })}
            <defs>
              <linearGradient id="tree-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF4D9D" />
                <stop offset="100%" stopColor="#00E5FF" />
              </linearGradient>
            </defs>

            {/* 根节点 */}
            <g className="tree-node">
              <rect x={248} y={40} width={144} height={54} rx={16} fill="rgba(255,77,157,0.16)" stroke="#FF4D9D" strokeWidth={1.5} />
              <text x={320} y={64} textAnchor="middle" fill="#FF9BC6" fontSize={13} fontWeight={700} fontFamily="system-ui, sans-serif">
                {word.roots.find((r) => r.type === 'root')?.text ?? word.word}
              </text>
              <text x={320} y={83} textAnchor="middle" fill="#94A3B8" fontSize={11}>
                {word.roots.find((r) => r.type === 'root')?.meaning ?? '核心'}
              </text>
            </g>

            {/* 家族节点 */}
            {nodes.slice(1).map((f, i) => {
              const x = 70 + ((i + 1) % 4) * 150;
              const y = 180 + Math.floor((i + 1) / 4) * 70;
              return (
                <g key={f.word} className="tree-node" style={{ cursor: 'pointer' }} onClick={() => { playSfx('tick'); speak(f.word); }}>
                  <rect x={x - 62} y={y - 24} width={124} height={48} rx={14} fill="rgba(0,229,255,0.10)" stroke="rgba(0,229,255,0.55)" strokeWidth={1.2} />
                  <text x={x} y={y - 4} textAnchor="middle" fill="#CFFAFE" fontSize={13} fontWeight={600} fontFamily="system-ui, sans-serif">
                    {f.word}
                  </text>
                  <text x={x} y={y + 13} textAnchor="middle" fill="#94A3B8" fontSize={10.5}>
                    {f.meaning}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <Volume2 size={11} aria-hidden /> 点击树上任意节点可听发音
          </span>
          <span>· 同词根 → 核心含义相同；前后缀改变方向与词性</span>
        </div>
      </div>
    </div>
  );
}
