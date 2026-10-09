import React, { useEffect, useRef, useState } from 'react';
import { Check, X } from 'lucide-react';

/* ============================================================
   演示共享件（瑞士世界世界）
   面板 = .leaf/.under-leaf + border-rule；数字计时 = .machine；
   状态过渡只用 .hinge（90ms steps(2)）；errata 只给错误元素。
   ============================================================ */

/** 演示面板：顶层透明页，四角 4px，发丝线描边 */
export function DemoPanel({
  children,
  label,
  className = '',
}: {
  children: React.ReactNode;
  /** 左上机器标签（如「算法 · 步 2」） */
  label?: string;
  className?: string;
}) {
  return (
    <div className={`leaf relative p-4 sm:p-5 ${className}`}>
      {label && (
        <div className="machine mb-3 flex items-center gap-2 text-ink2">
          <span aria-hidden className="h-px w-4 bg-rule" />
          {label}
        </div>
      )}
      {children}
    </div>
  );
}

/** 机器标签（小号等宽） */
export function Tag({ children, tone = 'ink' }: { children: React.ReactNode; tone?: 'ink' | 'stage' | 'errata' }) {
  const color = tone === 'errata' ? 'text-errata' : tone === 'stage' ? 'text-board-deconstruct' : 'text-ink2';
  return <span className={`machine text-[13px] ${color}`}>{children}</span>;
}

/** 按钮：主钮 ink 实底；ghost 发丝描边；全部 ≥44 高 */
export function Btn({
  children,
  onClick,
  variant = 'ghost',
  pressed,
  disabled,
  className = '',
  ariaLabel,
  title,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'ghost';
  pressed?: boolean;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
  title?: string;
}) {
  const base =
    'hinge inline-flex min-h-[44px] items-center justify-center gap-1.5 px-4 text-[14px] font-display font-bold disabled:opacity-40';
  const skin =
    variant === 'primary'
      ? 'bg-ink text-milk press shadow-hard hover:bg-ink2'
      : pressed
        ? 'border-2 border-ink bg-ink text-milk'
        : 'border-2 border-ink text-ink hover:bg-under';
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={pressed}
      aria-label={ariaLabel}
      title={title}
      className={`${base} ${skin} ${className}`}
    >
      {children}
    </button>
  );
}

/** 选项按钮（单选用）：选中 = 实心方块 + 加粗（形状通道），对错 = ✓/✗ + 文字 */
export function OptionBtn({
  children,
  state = 'idle',
  onClick,
  disabled,
  className = '',
}: {
  children: React.ReactNode;
  state?: 'idle' | 'selected' | 'right' | 'wrong';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  const skin =
    state === 'right'
      ? 'border-2 border-ink bg-leaf'
      : state === 'wrong'
        ? 'border-2 border-errata bg-leaf'
        : state === 'selected'
          ? 'border-2 border-ink bg-leaf'
          : 'border-2 border-ink bg-leaf hover:bg-under';
  const dot =
    state === 'right' ? (
      <Check size={14} strokeWidth={3} aria-hidden />
    ) : state === 'wrong' ? (
      <X size={14} strokeWidth={3} className="text-errata" aria-hidden />
    ) : state === 'selected' ? (
      <span aria-hidden className="punch punch-done" />
    ) : (
      <span aria-hidden className="punch" />
    );
  const sr = state === 'right' ? '（答对）' : state === 'wrong' ? '（答错）' : state === 'selected' ? '（已选）' : '';
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={`${typeof children === 'string' ? children : '选项'}${sr}`}
      className={`hinge flex min-h-[44px] w-full items-center gap-2.5 px-3 py-2 text-left text-[15px] disabled:opacity-50 ${skin} ${className}`}
    >
      <span className="flex w-4 shrink-0 items-center justify-center">{dot}</span>
      <span className="flex-1">{children}</span>
    </button>
  );
}

/** 揭示面：遮住 → 点开（hinge 换面，无淡入）。默认遮，revealed 显示答案 */
export function RevealBox({
  hidden,
  onReveal,
  children,
  revealLabel = '揭示答案',
  hideLabel = '遮回去',
}: {
  hidden?: boolean;
  onReveal?: () => void;
  children?: React.ReactNode;
  revealLabel?: string;
  hideLabel?: string;
}) {
  const [open, setOpen] = useState(!hidden);
  const toggle = () => {
    setOpen((v) => !v);
    onReveal?.();
  };
  return (
    <div>
      <div className="hinge" aria-live="polite">
        {open ? (
          <div className="under-leaf p-3">{children}</div>
        ) : (
          <div className="under-leaf flex min-h-[56px] items-center gap-3 p-3">
            <span aria-hidden className="machine text-ink2">▓▓▓</span>
            <span className="text-[14px] text-ink2">已遮住，先自己想</span>
          </div>
        )}
      </div>
      <div className="mt-2">
        <Btn onClick={toggle} variant="ghost">
          {open ? hideLabel : revealLabel}
        </Btn>
      </div>
    </div>
  );
}

/** 计时器：机器嗓音 mm:ss，开始/停止/复位；仅计时本身（状态动效），无装饰动画 */
export function Timer({
  autoStart,
  onTick,
  className = '',
}: {
  autoStart?: boolean;
  onTick?: (sec: number) => void;
  className?: string;
}) {
  const [sec, setSec] = useState(0);
  const [run, setRun] = useState(!!autoStart);
  const ref = useRef<number | null>(null);
  useEffect(() => {
    if (run) {
      ref.current = window.setInterval(() => setSec((s) => s + 1), 1000);
      return () => {
        if (ref.current) window.clearInterval(ref.current);
      };
    }
    return undefined;
  }, [run]);
  useEffect(() => {
    onTick?.(sec);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sec]);
  const mm = String(Math.floor(sec / 60)).padStart(2, '0');
  const ss = String(sec % 60).padStart(2, '0');
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="machine border-2 border-ink bg-under px-3 py-2 text-[15px] tabular-nums text-ink" aria-live="off">
        {mm}:{ss}
      </span>
      <Btn onClick={() => setRun((v) => !v)} variant={run ? 'primary' : 'ghost'} ariaLabel={run ? '停止计时' : '开始计时'}>
        {run ? '停' : '走'}
      </Btn>
      <Btn
        onClick={() => {
          setRun(false);
          setSec(0);
        }}
        ariaLabel="计时复位"
      >
        复位
      </Btn>
      <span className="sr-only" aria-live="polite">
        {run ? '计时中' : '已停止'}，{mm} 分 {ss} 秒
      </span>
    </div>
  );
}

/** 横条图：值 ∝ 宽度，段色或墨色；条端给数值（形状+文字双通道） */
export function Bar({
  label,
  value,
  max,
  hue,
  suffix,
}: {
  label: string;
  value: number;
  max: number;
  hue?: string;
  suffix?: string;
}) {
  const pct = Math.max(2, Math.round((value / Math.max(1, max)) * 100));
  return (
    <div className="flex items-center gap-3">
      <span className="w-24 shrink-0 text-[13px] text-ink2 sm:w-32">{label}</span>
      <span className="h-5 flex-1 border-2 border-ink bg-under" aria-hidden>
        <span className="hinge block h-full" style={{ width: `${pct}%`, background: hue ?? '#111111' }} />
      </span>
      <span className="machine w-16 shrink-0 text-right text-[13px] text-ink">
        {value}
        {suffix ?? ''}
      </span>
    </div>
  );
}

/** 方块进度点列：done 实心 / active 半环 / todo 空（配 sr 文字） */
export function PunchRow({ total, done, active }: { total: number; done: number; active?: number }) {
  return (
    <ul className="flex items-center gap-2" aria-label={`共 ${total} 步，已完成 ${done} 步`}>
      {Array.from({ length: total }, (_, i) => (
        <li
          key={i}
          className={`punch ${i < done ? 'punch-done' : i === active ? 'punch-active' : ''}`}
          aria-hidden
        />
      ))}
    </ul>
  );
}

/** 对错印记：文字 + 图形（双通道），errata 只出现在错项 */
export function Verdict({ ok, children }: { ok: boolean; children?: React.ReactNode }) {
  return (
    <p className={`hinge flex items-start gap-2 text-[14px] ${ok ? 'text-ink' : 'text-errata'}`} role="status">
      <span
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border-2 ${ok ? 'border-ink' : 'border-errata'}`}
        aria-hidden
      >
        {ok ? <Check size={12} strokeWidth={3.5} /> : <X size={12} strokeWidth={3.5} />}
      </span>
      <span className="font-bold">{children ?? (ok ? '对上了' : '这处不对')}</span>
    </p>
  );
}

/** 方角词块（板书用）：mono 或衬线由调用方定 */
export function Token({ children, hue, className = '' }: { children: React.ReactNode; hue?: string; className?: string }) {
  return (
    <span
      className={`inline-flex min-h-[36px] items-center border-2 border-ink px-2.5 py-1 ${className}`}
      style={hue ? { background: hue, borderColor: hue, color: '#FFFFFF' } : { background: '#FFFFFF' }}
    >
      {children}
    </span>
  );
}
