import { useEffect, useState, type DragEvent as ReactDragEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMotionTier } from '@/hooks/useMotionTier';
import { playSfx } from '@/hooks/useSfx';

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
  /** 视面：保留对外 API（历史深色面分支已整体迁入辞书纸面，两面同视） */
  tone?: 'dark' | 'paper';
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
 * 全部就位即判定：错误 = 红色抖动 + 规则提示；正确 = 结构蓝描边（辞书纸面）
 */
export default function TokenPlacer({
  pieces,
  slotCount,
  answer,
  gapToken = '-',
  instructions,
  onResult,
  ruleHint,
  tone = 'dark',
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
      <p className="text-sm text-ink">
        <span className="mr-2 text-xs font-semibold text-board-deconstruct">练习</span>
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
                  ? { borderColor: 'rgba(30,75,122,0.95)', x: 0 }
                  : status === 'wrong'
                    ? { x: [0, -5, 5, -4, 0] }
                    : { x: 0 }
              }
              transition={{ duration: 0.4 }}
              className={`relative flex min-w-[76px] min-h-[56px] items-center justify-center border px-4 py-4 font-serif text-lg font-semibold transition-colors ${
                piece
                  ? 'border-ink/55 bg-leaf text-ink'
                  : 'border-dashed border-rule bg-transparent ink2/70'
              } ${picked && !piece ? 'border-ink bg-under' : ''}`}
              aria-label={`第 ${i + 1} 个槽位${piece ? `：${piece.text}` : '（空）'}`}
            >
              {piece ? piece.text : '?'}
            </motion.button>
            {i < slots.length - 1 && <span className="text-ink2">{gapToken === '-' ? '·' : gapToken}</span>}
          </div>
        ))}

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
              className={`min-h-[44px] cursor-grab border px-4 py-2.5 font-serif text-base font-semibold transition-colors active:cursor-grabbing ${
                picked?.piece.id === piece.id
                  ? 'border-ink bg-under text-errata-deep'
                  : 'border-rule bg-leaf text-ink hover:border-ink'
              }`}
              aria-pressed={picked?.piece.id === piece.id}
            >
              {piece.text}
            </motion.button>
          ))}
        </AnimatePresence>
        {pool.length === 0 && (
          <span className="text-xs text-ink2">（拼块已全部放入，点击槽位可取回）</span>
        )}
      </div>

      {/* 反馈 */}
      <AnimatePresence>
        {status !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={` border px-4 py-3 text-sm ${
              status === 'correct' ? 'border-ink/60 bg-leaf text-ink' : 'border-errata bg-leaf text-ink'
            }`}
            role="status"
          >
            <strong className={`mr-2 ${status === 'correct' ? 'text-board-deconstruct' : 'text-errata-deep'}`}>
              {status === 'correct' ? '✓ 正确！' : '✕ 还不对'}
            </strong>
            {status === 'correct' ? ruleHint : (
              <>
                你的答案 <code className="font-mono text-ink">{given}</code> ·{' '}
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex min-h-[44px] items-center underline underline-offset-4 transition-colors hover:text-ink"
                >
                  重来
                </button>
                <div className="mt-1 text-xs text-ink2">提示 · {ruleHint}</div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between text-xs text-ink2">
        <span>尝试次数：{attempts}</span>
        <button
          type="button"
          onClick={reset}
          className="min-h-[44px] border border-rule px-3 py-1 transition-colors hover:border-ink hover:text-ink"
        >
          重新出题
        </button>
      </div>
    </div>
  );
}
