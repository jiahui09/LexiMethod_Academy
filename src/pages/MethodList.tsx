import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, AudioLines } from 'lucide-react';
import { methods } from '@/data/methods';
import { useProgress, useOverallProgress } from '@/store/progressStore';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import ThumbIndex from '@/components/layout/ThumbIndex';
import { EduSheet, EduRunningHead, EduButton } from '@/components/edu';
import { playSfx } from '@/hooks/useSfx';

/**
 * 方法课程列表页（辞书版式）：目录页 + 书口切口索引。
 * 正文 10/12 是 8 条完整方法词条（词头、点线 leaders、进度纹样、入口），
 * 右缘 2/12 是切口拇指索引（签名件），窄屏降级为列表上方的行内贴条。
 */
export default function MethodList() {
  const navigate = useNavigate();
  const progress = useProgress();
  const overall = useOverallProgress(methods.length);

  const next = methods.find((m) => !progress.completedMethods.includes(m.id)) ?? methods[0];

  return (
    <EduSheet>
      {/* 书眉：面包屑定位 + 刻线标出整本书的长度与当前位置 */}
      <EduRunningHead
        left={<Breadcrumbs tone="paper" items={[{ label: '方法课程' }]} />}
        right={
          <>
            <span className="hidden items-center gap-2 sm:flex" aria-hidden>
              <span className="relative block h-[3px] w-24 bg-rule">
                <span
                  className="absolute left-0 top-0 h-[3px] bg-cobalt transition-[width] duration-500 ease-out-expo"
                  style={{ width: `${Math.round(overall * 100)}%` }}
                />
              </span>
            </span>
            <span className="text-xs font-semibold tabular-nums text-paperink">
              {progress.completedMethods.length}/{methods.length}
            </span>
          </>
        }
      />

      <div>
        {/* 正文 10/12 */}
        <div className="min-w-0 px-5 py-6 md:px-8 md:py-8">
          {/* 卷首题名 */}
          <header className="border-b border-rule pb-5">
            <h1 className="text-[26px] font-bold leading-tight text-paperink md:text-[32px]">
              方法课程：8 个模块，全部可看、可练、可衡量
            </h1>
            <p className="mt-2 max-w-[68ch] text-[15px] leading-[1.85] text-colophon">
              每门课固定六段结构：原理讲解 → 分步动画演示 → 互动练习 → 实战分析 → 常见误区 → 掌握标准。全部学完，你得到的是一套可以迁移到任何新单词上的方法。
            </p>
          </header>

          {/* 全书进度 + 本页唯一主行动（继续/开始） */}
          <div className="mt-5 flex flex-wrap items-center gap-x-8 gap-y-4 rounded-[4px] border border-rule bg-bone2/50 px-4 py-4">
            <div className="min-w-[150px] flex-1 sm:flex-none sm:basis-48">
              <div className="text-xs text-colophon">总进度</div>
              <span className="mt-1.5 block h-[3px] w-full bg-rule" aria-hidden>
                <span
                  className="block h-[3px] bg-cobalt transition-[width] duration-500 ease-out-expo"
                  style={{ width: `${Math.round(overall * 100)}%` }}
                />
              </span>
            </div>

            <div>
              <div className="font-serif text-3xl font-bold tabular-nums text-paperink">
                {progress.completedMethods.length}/{methods.length}
              </div>
              <div className="text-xs text-colophon">已完成门数</div>
            </div>

            <div>
              <div className="font-serif text-3xl font-bold tabular-nums text-cobalt">
                {Math.round(overall * 100)}%
              </div>
              <div className="text-xs text-colophon">整体进度</div>
            </div>

            <div className="flex flex-wrap gap-2 sm:ml-auto">
              <EduButton
                variant="primary"
                sfx={false}
                data-testid="intro-next"
                onClick={() => {
                  playSfx('click');
                  navigate(`/methods/${next.id}`);
                }}
              >
                {progress.completedMethods.length === 0 ? '开始第一课' : `继续：${next.title}`}{' '}
                <ArrowRight size={15} aria-hidden />
              </EduButton>
              <EduButton
                sfx={false}
                onClick={() => {
                  playSfx('click');
                  navigate('/lab/phonemes');
                }}
              >
                <AudioLines size={15} aria-hidden /> 音标实验室
              </EduButton>
            </div>
          </div>

          {/* 切口贴降级（<xl）：列表上方的行内横排贴条 */}
          <div className="mt-6 xl:hidden">
            <ThumbIndex currentId={next.id} />
          </div>

          {/* 8 条完整方法词条 */}
          <ol className="mt-6 border-t border-rule">
            {methods.map((m, i) => {
              const done = progress.completedMethods.includes(m.id);
              const steps = progress.completedSteps[m.id] ?? [];
              const pct = Math.round((steps.length / m.steps.length) * 100);
              return (
                <li key={m.id}>
                  <Link
                    to={`/methods/${m.id}`}
                    data-testid="data-method-row"
                    data-method-row={m.id}
                    onClick={() => playSfx('click')}
                    className="group block min-h-[44px] border-b border-rule px-2 py-4 transition-colors hover:bg-bone2/60"
                  >
                    {/* 词条行：序号 + 词头 + 点线 leaders + 进度纹样 + 入口 */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                      <span className="font-serif text-lg font-bold tabular-nums text-rubric" aria-hidden>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <h2 className="font-serif text-[18px] font-bold leading-snug text-paperink md:text-[21px]">
                        {m.title}
                      </h2>
                      <span
                        className="hidden min-w-10 flex-1 translate-y-[6px] border-b border-dotted border-rule sm:block"
                        aria-hidden
                      />
                      <span className="rounded-[2px] border border-rule px-2 py-0.5 text-xs text-colophon">
                        {m.category}
                      </span>
                      {done && (
                        <span className="rounded-[2px] border border-cobalt px-2 py-0.5 text-xs font-medium text-cobalt">
                          ✓ 已完成
                        </span>
                      )}

                      <span className="flex items-center gap-3 text-xs text-colophon sm:ml-auto">
                        <span className="tabular-nums">
                          {steps.length}/{m.steps.length} 步
                        </span>
                        <span className="tabular-nums">{pct}%</span>
                      </span>

                      <span className="flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-[3px] border border-rule px-3 py-1 text-xs font-medium text-colophon transition-colors group-hover:border-paperink group-hover:text-paperink">
                        {pct > 0
                          ? `继续第 ${steps.length + 1 > m.steps.length ? m.steps.length : steps.length + 1} 步`
                          : '进入课程'}
                        <ArrowRight size={13} aria-hidden />
                      </span>
                    </div>

                    {/* 进度刻线（发丝线槽 + 结构蓝填充） */}
                    <div className="mt-2.5 h-[3px] w-full bg-rule" aria-hidden>
                      <div
                        className="h-[3px] bg-cobalt transition-[width] duration-500 ease-out-expo"
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    <p className="mt-2.5 max-w-[68ch] text-[13px] leading-[1.85] text-colophon">{m.subtitle}</p>

                    <ul className="mt-2 flex flex-wrap gap-1.5">
                      {m.principles.slice(0, 3).map((p, k) => (
                        <li
                          key={k}
                          className="max-w-full break-words rounded-[2px] border border-rule px-2 py-1 text-xs text-colophon"
                        >
                          {p}
                        </li>
                      ))}
                    </ul>
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>

      </div>
    </EduSheet>
  );
}
