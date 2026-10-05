import { useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { GitBranch, Volume2, ZoomIn } from 'lucide-react';
import { words } from '@/data/words';
import { useMotionTier } from '@/hooks/useMotionTier';
import { useSpeech } from '@/hooks/useSpeech';
import { playSfx } from '@/hooks/useSfx';
import { SpeakButton } from '@/components/edu';

/**
 * 词根词缀步骤：色块飞入拼装（GSAP 时间线）+ 词族树 SVG 路径生长
 * GSAP 动态引入：只有走到这一步才拉取引擎分包。
 * 纸面世界：零件块 = 发丝线框，拼装完成 = 批注红描一下边（原霓虹辉光已除），词族树走结构蓝单色。
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
    let disposed = false;
    let ctx: { revert: () => void } | undefined;
    import('gsap')
      .then(({ default: gsap }) => {
        if (disposed) return;
        ctx = gsap.context(() => {
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
              // 拼装完成的确认动作：批注红描边一闪（替代原盒状辉光）
              borderColor: '#B3311E',
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
                opacity: 0,
                duration: 0.45,
                stagger: 0.1,
              },
              '-=0.9',
            );
        }, scope);
      })
      .catch(() => {
        // 引擎分包拉取失败：跳过动画，直接呈现结果态，不卡死教学步骤
        if (!disposed) setAssembled(true);
      });
    return () => {
      disposed = true;
      ctx?.revert();
    };
  }, [tier, word.id]);

  const family = word.wordFamily;
  const nodes = [{ word: word.word, pos: word.partOfSpeech.split(' ')[0], meaning: word.meaningCN }, ...family];

  return (
    <div ref={scope} className="flex flex-col gap-5">
      {/* 拼装 */}
      <div className="rounded-[4px] border border-rule bg-bone2/60 p-5">
        <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-colophon">
          <span className="inline-flex items-center gap-1.5 rounded-[2px] border border-cobalt/45 px-2 py-0.5 font-semibold text-cobalt">
            <ZoomIn size={12} aria-hidden /> 色块拼装
          </span>
          <span className="font-serif text-base font-semibold text-paperink">{word.word}</span>
          <span className="ipa text-colophon">{word.phoneticUK}</span>
          <SpeakButton text={word.word} size="sm" />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {word.roots.map((r) => (
            <div
              key={`${r.text}-${r.type}`}
              className="morph-block flex flex-col items-center gap-1 rounded-[4px] border border-rule bg-bone2/80 px-5 py-4"
            >
              <span className="font-serif text-xl font-bold text-paperink">{r.text}</span>
              <span className="text-xs text-colophon">{r.meaning}</span>
              <span className="rounded-[3px] border border-cobalt/45 px-2 py-0.5 text-xs font-semibold text-cobalt">
                {r.type === 'prefix' ? '前缀' : r.type === 'suffix' ? '后缀' : '词根'}
              </span>
            </div>
          ))}
          <span className="font-serif text-2xl text-colophon" aria-hidden>
            =
          </span>
          <motion.div
            initial={tier === 'off' ? false : { opacity: 0, y: 10 }}
            animate={assembled ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-1 rounded-[4px] border border-cobalt bg-bone px-6 py-4"
          >
            <span className="font-serif text-lg font-bold text-paperink">{word.word}</span>
            <span className="text-xs text-colophon">{word.meaningCN}</span>
          </motion.div>
        </div>

        <p className="mt-4 text-center text-xs leading-[1.8] text-colophon">
          {word.roots.map((r) => `${r.text}（${r.meaning}）`).join(' + ')} → 拆开每一块，生词就变成了三个已知零件
        </p>
      </div>

      {/* 词族树 */}
      <div className="rounded-[4px] border border-rule bg-bone2/60 p-5">
        <div className="mb-3 flex items-center gap-2 text-[13px] font-semibold text-cobalt">
          <GitBranch size={13} aria-hidden /> 词族树：一个词根，一串同源词
        </div>
        <div className="overflow-x-auto">
          <svg ref={treeRef} viewBox="0 0 640 260" className="h-[240px] w-full min-w-[560px]" role="img" aria-label={`${word.word} 的词族树`}>
            {/* 连接路径（单色发丝线，路径生长动画保留） */}
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
                  stroke="#1E4B7A"
                  strokeWidth={1.5}
                  strokeDasharray={400}
                  data-len={400}
                  opacity={0.55}
                />
              );
            })}

            {/* 根节点 */}
            <g className="tree-node">
              <rect x={248} y={40} width={144} height={54} rx={4} fill="#EFE6D2" stroke="#1E4B7A" strokeWidth={1.5} />
              <text x={320} y={64} textAnchor="middle" fill="#16130F" fontSize={13} fontWeight={700} fontFamily="system-ui, sans-serif">
                {word.roots.find((r) => r.type === 'root')?.text ?? word.word}
              </text>
              <text x={320} y={83} textAnchor="middle" fill="#4A443B" fontSize={11}>
                {word.roots.find((r) => r.type === 'root')?.meaning ?? '核心'}
              </text>
            </g>

            {/* 家族节点 */}
            {nodes.slice(1).map((f, i) => {
              const x = 70 + ((i + 1) % 4) * 150;
              const y = 180 + Math.floor((i + 1) / 4) * 70;
              return (
                <g key={f.word} className="tree-node" style={{ cursor: 'pointer' }} onClick={() => { playSfx('tick'); speak(f.word); }}>
                  <rect x={x - 62} y={y - 24} width={124} height={48} rx={4} fill="#F7F2E8" stroke="#D8CFBC" strokeWidth={1.2} />
                  <text x={x} y={y - 4} textAnchor="middle" fill="#16130F" fontSize={13} fontWeight={600} fontFamily="system-ui, sans-serif">
                    {f.word}
                  </text>
                  <text x={x} y={y + 13} textAnchor="middle" fill="#4A443B" fontSize={10.5}>
                    {f.meaning}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        <div className="mt-2 flex flex-wrap gap-2 text-xs text-colophon">
          <span className="flex items-center gap-1">
            <Volume2 size={11} aria-hidden /> 点击树上任意节点可听发音
          </span>
          <span>· 同词根 → 核心含义相同；前后缀改变方向与词性</span>
        </div>
      </div>
    </div>
  );
}
