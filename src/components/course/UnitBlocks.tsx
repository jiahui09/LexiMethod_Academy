import { FlaskConical, TriangleAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Block, Unit } from '@/data/courseSchema';
import { SpeakButton } from '@/components/edu/Speak';
import { Demo } from '@/components/demos/Demo';
import { Practice } from '@/components/practice/Practice';

/** 例句块：面板 + 朗读钮 + IPA 机器嗓音 */
function ExampleBlock({ b }: { b: Extract<Block, { kind: 'example' }> }) {
  return (
    <figure className="border-2 border-ink bg-leaf px-4 py-3.5">
      <div className="flex flex-wrap items-start gap-x-3 gap-y-1.5">
        {b.speak && <SpeakButton text={b.speak} size="sm" />}
        <div className="min-w-0 flex-1">
          <p className="max-w-[68ch] text-[16px] leading-[1.85] text-ink">{b.text}</p>
          {b.ipa && <p className="machine mt-1 text-ink2">{b.ipa}</p>}
        </div>
      </div>
      {b.note && (
        <figcaption className="mt-2 max-w-[68ch] border-t border-rule pt-2 text-[13px] leading-[1.75] text-ink2">
          {b.note}
        </figcaption>
      )}
    </figure>
  );
}

/** 警示块：下层页面色，警示语不是错误，不用朱红 */
function WarningBlock({ b }: { b: Extract<Block, { kind: 'warning' }> }) {
  return (
    <p className="under-leaf flex gap-2.5 px-4 py-3 text-[14px] leading-[1.8] text-ink">
      <TriangleAlert size={16} className="mt-1 shrink-0 text-ink2" aria-hidden />
      <span className="max-w-[68ch]">{b.text}</span>
    </p>
  );
}

/** 方块列表块 */
function ListBlock({ b }: { b: Extract<Block, { kind: 'list' }> }) {
  return (
    <ul className="flex flex-col gap-2">
      {b.items.map((item, i) => (
        <li key={i} className="flex gap-2.5 text-[15px] leading-[1.8] text-ink">
          <span className="punch mt-2" aria-hidden />
          <span className="max-w-[68ch]">{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** 内容块渲染器（A 名下）：按 Block.kind 分发 */
export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="mt-4 flex flex-col gap-4">
      {blocks.map((b, i) => {
        if (b.kind === 'example') return <ExampleBlock key={i} b={b} />;
        if (b.kind === 'warning') return <WarningBlock key={i} b={b} />;
        if (b.kind === 'list') return <ListBlock key={i} b={b} />;
        return <Demo key={i} name={b.ref} caption={b.caption} />;
      })}
    </div>
  );
}

/**
 * 单元叶视图：claim → blocks → 微练习 → 自检收口 → 实验室深链。
 * 完成条件 = 勾掉自检（completeUnit），练习可重复、不设门槛。
 */
export function UnitView({
  unit,
  done,
  onToggleCheck,
  onPracticeDone,
  practiced,
}: {
  unit: Unit;
  done: boolean;
  onToggleCheck: () => void;
  onPracticeDone: () => void;
  practiced: boolean;
}) {
  return (
    <div>
      <header className="border-b border-rule pb-4">
        <p className="machine text-[12px] text-ink2">
          U{unit.id.replace('u', '')} · {unit.durationMin} 分钟
        </p>
        <h2 className="mt-1 font-display text-[22px] font-extrabold leading-snug text-ink md:text-[26px]">
          {unit.title}
        </h2>
        <p className="mt-3 max-w-[68ch] font-display text-[17px] font-bold leading-[1.7] text-ink">
          {unit.claim}
        </p>
      </header>

      <Blocks blocks={unit.blocks} />

      {unit.practice && (
        <section className="mt-6" aria-label={`微练习 ${unit.practice.title}`}>
          <Practice practice={unit.practice} onDone={onPracticeDone} />
          {practiced && !done && unit.check && (
            <p className="machine mt-2 text-[12px] text-ink2">练过了，勾掉下面的自检就能收口。</p>
          )}
        </section>
      )}

      {unit.check && (
        <div className="mt-6 border-t border-rule pt-4">
          <p className="machine text-[12px] text-ink2">自检</p>
          <button
            type="button"
            role="checkbox"
            aria-checked={done}
            disabled={done}
            onClick={onToggleCheck}
            data-testid="unit-check"
            className={`hinge mt-1.5 flex min-h-[44px] w-full items-center gap-3 border-2 px-3 py-2.5 text-left ${
              done
                ? 'border-ink bg-under text-ink'
                : 'border-ink bg-leaf text-ink hover:bg-under'
            }`}
          >
            <span className={`punch ${done ? 'punch-done' : ''}`} aria-hidden />
            <span className="max-w-[68ch] text-[15px] leading-[1.75]">{unit.check}</span>
            <span className="machine ml-auto shrink-0 text-[12px] text-ink2">
              {done ? '已达成' : '勾选达成'}
            </span>
          </button>
        </div>
      )}

      {unit.labLink && (
        <div className="mt-4">
          <Link
            to={`/lab/${unit.labLink.tab}`}
            className="hinge inline-flex min-h-[44px] items-center gap-2 border-2 border-ink px-3.5 text-[13px] text-ink hover:bg-under"
          >
            <FlaskConical size={14} aria-hidden />
            {unit.labLink.label}
          </Link>
        </div>
      )}
    </div>
  );
}
