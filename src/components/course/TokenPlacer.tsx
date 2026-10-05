import { useEffect, useState, type DragEvent as ReactDragEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMotionTier } from '@/hooks/useMotionTier';
import { playSfx } from '@/hooks/useSfx';
import { LightWave } from './FeedbackFx';

export type Piece = { id: string; text: string; hint?: string };

type Props = {
  pieces: Piece[];                 // 可用块（会自动打乱）
  slotCount: number;
  answer: string;                  // 用 "-" 连接的正确顺序
  gapToken?: string;               // 槽位之间的分隔符（如 "-"）
  instructions: string;
  onResult?: (correct: boolean, given: string) => void;
  /** 全部就位后的提示文案 */
  ruleHint: string;
};

function shuffle<T extends { id: string }>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  // 避免刚好是正确顺序
  if (a.length > 2 && a.every((p, i) => p.id === arr[i].id)) return shuffle(arr);
  return a;
}

/**
 * 拖拽/点选拼块：桌面支持原生拖拽，移动端点击“选中→放入”（键盘可达）
 * 全部就位即判定：正确 = 绿色光波 + 粒子，错误 = 红色抖动 + 规则提示
 */
export default function TokenPlacer({
  pieces,
  slotCount,
  answer,
  gapToken = '-',
  instructions,
  onResult,
  ruleHint,
}: Props) {
  const tier = useMotionTier();
  // pieces 每次渲染可能是新数组：用稳定 key 决定是否重置，避免无限洗牌
  const piecesKey = pieces.map((p) => p.id).join('|');
  const [pool, setPool] = useState<Piece[]>(() => shuffle(pieces));
  const [currentKey, setCurrentKey] = useState(piecesKey);
  useEffect(() => {
    if (piecesKey !== currentKey) {
      setCurrentKey(piecesKey);
      setPool(shuffle(pieces));
      setSlots(Array(slotCount).fill(null));
      setStatus('idle');
      setGiven('');
      setPicked(null);
    }
  }, [piecesKey, currentKey, pieces, slotCount]);
  const [slots, setSlots] = useState<(Piece | null)[]>(Array(slotCount).fill(null));
  const [picked, setPicked] = useState<{ from: 'pool' | number; piece: Piece } | null>(null);
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [given, setGiven] = useState('');
  const [attempts, setAttempts] = useState(0);

  const reset = () => {
    setPool(shuffle(pieces));
    setSlots(Array(slotCount).fill(null));
    setPicked(null);
    setStatus('idle');
    setGiven('');
  };

  const evaluate = (nextSlots: (Piece | null)[]) => {
    if (nextSlots.some((s) => !s)) return;
    const str = nextSlots.map((s) => s!.text).join(gapToken);
    const correct = str === answer;
    setGiven(str);
    setStatus(correct ? 'correct' : 'wrong');
    setAttempts((a) => a + 1);
    playSfx(correct ? 'correct' : 'wrong');
    onResult?.(correct, str);
    if (correct) window.setTimeout(reset, 2400);
  };

  const placePiece = (piece: Piece, from: 'pool' | number, slotIdx: number) => {
    const nextSlots = [...slots];
    const existing = nextSlots[slotIdx];
    let nextPool = [...pool];

    if (from === 'pool') {
      nextPool = nextPool.filter((p) => p.id !== piece.id);
      if (existing) nextPool.push(existing);
    } else {
      nextSlots[from] = null;
      if (existing) nextPool.push(existing);
    }
    nextSlots[slotIdx] = piece;
    setPool(nextPool);
    setSlots(nextSlots);
    setPicked(null);
    if (status !== 'idle') setStatus('idle');
    playSfx('tick');
    evaluate(nextSlots);
  };

  const removeFromSlot = (slotIdx: number) => {
    const piece = slots[slotIdx];
    if (!piece) return;
    const nextSlots = [...slots];
    nextSlots[slotIdx] = null;
    setSlots(nextSlots);
    setPool((p) => [...p, piece]);
    setPicked(null);
    playSfx('tick');
  };

  const handlePick = (piece: Piece, from: 'pool' | number) => {
    if (picked && picked.piece.id === piece.id) {
      setPicked(null);
      return;
    }
    setPicked({ from, piece });
    playSfx('tick');
  };

  const handleSlotClick = (idx: number) => {
    if (picked) placePiece(picked.piece, picked.from, idx);
    else if (slots[idx]) removeFromSlot(idx);
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-slate-300/85">
        <span className="mr-2 rounded-md bg-neon/15 px-2 py-0.5 text-xs font-bold text-neon">练习</span>
        {instructions}
      </p>

      {/* 槽位 */}
      <div className={`relative flex flex-wrap items-center justify-center gap-2 ${status === 'wrong' ? 'animate-shake' : ''}`}>
        {slots.map((piece, i) => (
          <div key={i} className="flex items-center gap-2">
            <motion.button
              type="button"
              onClick={() => handleSlotClick(i)}
              onDragOver={(e) => {
                (e as unknown as ReactDragEvent).preventDefault();
              }}
              onDrop={(e) => {
                const evt = e as unknown as ReactDragEvent;
                evt.preventDefault();
                const raw = evt.dataTransfer?.getData('text/plain');
                const poolPiece = pool.find((p) => p.id === raw);
                if (poolPiece) placePiece(poolPiece, 'pool', i);
              }}
              animate={
                status === 'correct'
                  ? { boxShadow: '0 0 26px rgba(0,230,118,0.6)', borderColor: 'rgba(0,230,118,0.9)' }
                  : status === 'wrong'
                    ? { x: [0, -5, 5, -4, 0] }
                    : { boxShadow: '0 0 0 rgba(0,0,0,0)' }
              }
              transition={{ duration: 0.4 }}
              className={`relative flex min-w-[76px] items-center justify-center rounded-2xl border px-4 py-4 font-display text-lg font-semibold backdrop-blur-md transition-colors ${
                piece
                  ? 'border-neon/50 bg-neon/10 text-white'
                  : 'border-dashed border-white/25 bg-white/[0.04] text-slate-400'
              } ${picked && !piece ? 'border-solid border-neon/70 bg-neon/10 ring-2 ring-neon/30' : ''}`}
              aria-label={`第 ${i + 1} 个槽位${piece ? `：${piece.text}` : '（空）'}`}
            >
              {piece ? piece.text : '?'}
            </motion.button>
            {i < slots.length - 1 && <span className="text-slate-400">{gapToken === '-' ? '·' : gapToken}</span>}
          </div>
        ))}
        {status === 'correct' && <LightWave />}
      </div>

      {/* 可用拼块 */}
      <div className="flex flex-wrap items-center justify-center gap-2" aria-label="可选拼块">
        <AnimatePresence mode="popLayout">
          {pool.map((piece) => (
            <motion.button
              key={piece.id}
              type="button"
              layout
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
              draggable
              onDragStart={(e) => {
                const evt = e as unknown as ReactDragEvent;
                if (evt.dataTransfer) {
                  evt.dataTransfer.setData('text/plain', piece.id);
                  evt.dataTransfer.effectAllowed = 'move';
                }
              }}
              onClick={() => handlePick(piece, 'pool')}
              className={`cursor-grab rounded-xl border px-4 py-2.5 font-display text-base font-semibold backdrop-blur-md transition-all active:cursor-grabbing ${
                picked?.piece.id === piece.id
                  ? 'border-neon bg-neon/20 text-white shadow-neon'
                  : 'border-white/15 bg-white/[0.06] text-slate-200 hover:border-neon/50 hover:-translate-y-0.5'
              }`}
              aria-pressed={picked?.piece.id === piece.id}
            >
              {piece.text}
            </motion.button>
          ))}
        </AnimatePresence>
        {pool.length === 0 && <span className="text-xs text-slate-400">（拼块已全部放入，点击槽位可取回）</span>}
      </div>

      {/* 反馈 */}
      <AnimatePresence>
        {status !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`rounded-2xl border px-4 py-3 text-sm ${
              status === 'correct'
                ? 'border-success/45 bg-success/10 text-[#B9FFD9]'
                : 'border-danger/45 bg-danger/10 text-[#FFC9D2]'
            }`}
            role="status"
          >
            <strong className="mr-2">{status === 'correct' ? '✓ 正确！' : '✕ 还不对'}</strong>
            {status === 'correct' ? ruleHint : (
              <>
                你的答案：<code className="font-mono text-white/90">{given}</code> ·{' '}
                <button type="button" onClick={reset} className="underline hover:text-white">
                  重来
                </button>
                <div className="mt-1 text-xs text-slate-300/80">提示：{ruleHint}</div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>尝试次数：{attempts}</span>
        <button type="button" onClick={reset} className="min-h-[44px] rounded-lg border border-white/12 px-3 py-1 hover:border-neon/50 hover:text-neon transition">
          重新出题
        </button>
      </div>
    </div>
  );
}
