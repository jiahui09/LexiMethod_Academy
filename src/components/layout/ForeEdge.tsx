import { Link, useLocation } from 'react-router-dom';
import { Check, FlaskConical, Settings } from 'lucide-react';
import { courses } from '@/data/courses';
import { useProgress } from '@/store/progressStore';
import { STAGE_META, deepen } from '@/lib/stages';

/** 功能页签（索引轨顶）：实验室与设置，全站可达 */
const SECTIONS = [
  { to: '/lab/phonemes', label: '实验室', icon: FlaskConical },
  { to: '/settings', label: '设置', icon: Settings },
] as const;

/**
 * 右缘索引轨（瑞士页签）：每页右缘常驻的阶梯签。
 * 上层 = 功能页签；下层 = 全书结构——8 门课一签，高度与课时成正比（The Extent Rule），
 * 当前课的签取所属段导色（点缀只上页签小面积），已完成（出门条已交）带 ✓。
 * 状态三重编码：形状（✓ / 当前）+ 颜色 + 文字（aria-label / title），从不只靠颜色。
 * 窄屏（<xl）不渲染：页内阶梯条由各页自行降级。
 */
export default function ForeEdge() {
  const location = useLocation();
  const completedUnits = useProgress((s) => s.completedUnits);
  const exitResults = useProgress((s) => s.exitResults);
  const path = location.pathname;

  const courseMatch = /^\/methods\/([^/]+)$/.exec(path);
  const currentId = courseMatch?.[1];

  return (
    <aside className="hidden w-28 shrink-0 self-start xl:block" aria-label="课程索引">
      <nav
        aria-label="索引：功能页与全书课程"
        className="edu-scroll sticky top-24 flex max-h-[calc(100vh-7.5rem)] flex-col gap-2 overflow-y-auto pb-4"
      >
        {/* 上层：功能页签 */}
        <ul className="flex flex-col gap-1.5">
          {SECTIONS.map((s) => {
            const on = path === s.to || path.startsWith(s.to + '/');
            const Icon = s.icon;
            return (
              <li key={s.to}>
                <Link
                  to={s.to}
                  title={s.label}
                  className={`hinge flex min-h-[44px] items-center gap-1.5 border-2 border-ink px-2.5 text-[13px] ${
                    on ? 'bg-ink font-bold text-milk' : 'bg-leaf text-ink2 hover:bg-under hover:text-ink'
                  }`}
                  aria-current={on ? 'page' : undefined}
                >
                  <Icon size={14} aria-hidden />
                  {s.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2 px-1" aria-hidden>
          <span className="h-px flex-1 bg-rule" />
          <span className="machine text-[12px] text-ink2">VOL.</span>
          <span className="h-px flex-1 bg-rule" />
        </div>

        {/* 下层：8 门课的阶梯签（高度 ∝ 课时） */}
        <ul className="flex flex-col gap-1.5">
          {courses.map((c) => {
            const on = c.id === currentId;
            const done = (exitResults[c.id] != null) || (completedUnits[c.id]?.length ?? 0) >= c.units.length;
            const stage = STAGE_META[c.stage];
            // The Extent Rule：签高与课时成正比（35–38 分钟 → 48–57px，均 ≥44 触控底线）
            const h = 44 + (c.durationMin - 30) * 1.5;
            const exit = exitResults[c.id];
            const state = done
              ? exit
                ? `已完成 · 出门条 ${exit.score}/${exit.total}`
                : '已完成'
              : on
                ? '当前'
                : '未学';
            return (
              <li key={c.id}>
                <Link
                  to={`/methods/${c.id}`}
                  title={`${String(c.order).padStart(2, '0')} ${c.title} · ${c.durationMin} 分钟 · ${state}`}
                  style={{
                    height: `${h}px`,
                    background: on ? stage.hue : '#FFFFFF',
                    borderBottomColor: on ? deepen(stage.hue) : undefined,
                  }}
                  className={`hinge flex items-center gap-1.5 border-2 border-r-0 border-ink border-b-[3px] pl-2 pr-1.5 ${
                    on ? 'font-bold' : 'hover:bg-under'
                  }`}
                  aria-current={on ? 'page' : undefined}
                  aria-label={`第 ${c.order} 课 ${c.title}，${state}`}
                >
                  <span className={`machine text-[12px] ${on ? STAGE_META[c.stage].onBand : 'text-ink2'}`}>
                    {String(c.order).padStart(2, '0')}
                  </span>
                  <span
                    className={`hinge flex h-4 w-4 items-center justify-center border-2 ${
                      done ? 'border-ink bg-ink text-milk' : on ? 'border-ink/60 bg-milk/40' : 'border-ink'
                    }`}
                    aria-hidden
                  >
                    {done && <Check size={10} strokeWidth={3.5} />}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
