import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  AudioLines,
  BookOpenText,
  Check,
  MapPin,
  MessagesSquare,
  Minus,
  Plus,
  RotateCcw,
  Target,
} from 'lucide-react';
import { methods } from '@/data/methods';
import { useProgress, useOverallProgress } from '@/store/progressStore';
import { useReview } from '@/store/reviewStore';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import ThumbIndex from '@/components/layout/ThumbIndex';
import { EduSheet, EduRunningHead, EduButton, EduNote } from '@/components/edu';
import { playSfx } from '@/hooks/useSfx';

/**
 * 首页 / 学习地图（辞书版式）：一部词典的门厅页。
 * 书眉定位（面包屑 + 刻线），首屏是续学词条，其下 8 门方法排成词条列表，
 * 右缘 2/12 是切口拇指索引贴（签名件），窄屏降级为列表上方的行内贴条。
 */
export default function Home() {
  const navigate = useNavigate();
  const progress = useProgress();
  const overall = useOverallProgress(methods.length);
  const dueCount = useReview((s) => s.cards.filter((c) => c.dueAt <= Date.now()).length);
  const mistakeCount = useReview((s) => s.mistakes.length);

  /** 首访空态：一次课都没学过 */
  const isFirstVisit = useMemo(
    () => methods.every((m) => (progress.completedSteps[m.id] ?? []).length === 0),
    [progress.completedSteps],
  );

  /**
   * 「上次剩余的学习内容」唯一推算口径：
   * 按课程顺序找第一个未学完的方法，落到它的第一个未完成步骤。
   * 进度完全由用户在下方「我的进度」手动调节，站点不做任何自动记录。
   */
  const nextPos = useMemo(() => {
    for (const m of methods) {
      const done = progress.completedSteps[m.id] ?? [];
      if (done.length >= m.steps.length) continue;
      const firstMissing = m.steps.findIndex((_, i) => !done.includes(i));
      return { method: m, step: firstMissing === -1 ? 0 : firstMissing, started: done.length > 0, finished: false };
    }
    const last = methods[methods.length - 1];
    return { method: last, step: Math.max(0, last.steps.length - 1), started: true, finished: true };
  }, [progress.completedSteps]);

  const shortTitle = (m: (typeof methods)[number]) => m.title.split('：')[0];
  const heroLabel = nextPos.finished
    ? '全部课程完成 · 去实战演练'
    : nextPos.started
      ? `继续上次：《${shortTitle(nextPos.method)}》第 ${nextPos.step + 1} 步`
      : '开始第一课';
  const heroTarget = nextPos.finished ? '/analyze' : `/methods/${nextPos.method.id}?step=${nextPos.step}`;

  /** 续学词条的词头与刻线进度（与 hero 同一口径） */
  const headword = nextPos.finished ? '全部课程完成' : shortTitle(nextPos.method);
  const heroDone = nextPos.finished
    ? nextPos.method.steps.length
    : progress.completedSteps[nextPos.method.id]?.length ?? 0;
  const heroPct = Math.min(100, Math.round((heroDone / nextPos.method.steps.length) * 100));

  return (
    <EduSheet>
      {/* 书眉：我在哪 + 整本书读到哪（刻线 = 8 门总进度） */}
      <EduRunningHead
        left={<Breadcrumbs tone="paper" items={[{ label: '学习地图' }]} />}
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
          {/* ---------- HERO：续学词条 ---------- */}
          <section className="border-b border-rule pb-6">
            <h1 className="font-serif text-[26px] font-bold leading-tight text-paperink md:text-[32px]">
              LexiMethod Academy
            </h1>
            <p className="mt-2 max-w-[68ch] text-[15px] leading-[1.85] text-colophon">
              学会后你能：<b className="font-semibold text-cobalt">看到生词读出来</b> ·{' '}
              <b className="font-semibold text-cobalt">听到发音拼出来</b> ·{' '}
              <b className="font-semibold text-cobalt">拆开词根猜意思</b> · 用科学的复习与输出把被动词汇变成主动词汇。
            </p>

            {/* 词条行：xl 时零存储声明退到页边做栏外批注，窄屏折行到行内 */}
            <div className="mt-5 flex flex-col gap-4 xl:flex-row xl:items-start xl:gap-8">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-rule pt-4">
                  <h2 className="font-serif text-[21px] font-bold leading-snug text-paperink md:text-[25px]">
                    {headword}
                  </h2>
                  <span className="text-sm tabular-nums text-colophon">
                    第 {nextPos.step + 1} 步 / 共 {nextPos.method.steps.length} 步
                  </span>
                </div>

                {/* 进度刻线：发丝线槽 + 结构蓝填充 */}
                <span className="mt-3 block h-[3px] w-full max-w-md bg-rule" aria-hidden>
                  <span
                    className="block h-[3px] bg-cobalt transition-[width] duration-500 ease-out-expo"
                    style={{ width: `${heroPct}%` }}
                  />
                </span>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <EduButton
                    variant="primary"
                    sfx={false}
                    data-testid="hero-resume"
                    onClick={() => {
                      playSfx('click');
                      navigate(heroTarget);
                    }}
                  >
                    {heroLabel} <ArrowRight size={15} aria-hidden />
                  </EduButton>
                </div>
              </div>

              {/* 零存储声明：xl 页边批注 / 窄屏行内 */}
              <div data-testid="zero-storage-note" className="xl:w-64 xl:shrink-0">
                <EduNote>
                  <b className="font-semibold text-cobalt">本站零存储</b>：不写浏览器存储、不自动续学，刷新后回到 0。
                  把节数调到你上次学到的位置，从那里接着往下走。
                </EduNote>
              </div>
            </div>
          </section>

          {/* ---------- 切口贴降级（<xl）：列表上方的行内横排贴条 ---------- */}
          <div className="mt-6 xl:hidden">
            <ThumbIndex currentId={nextPos.method.id} />
          </div>

          {/* ---------- 8 门方法词条列表 ---------- */}
          <section className="mt-8">
            <h2 className="text-[21px] font-bold leading-snug text-paperink md:text-[25px]">
              学习地图：8 个方法模块，一条路径走通
            </h2>
            <p className="mt-2 max-w-[68ch] text-[15px] leading-[1.85] text-colophon">
              按顺序学习：发音与拼写 → 音节与重读 → 词根词缀 → 记忆策略 → 语境输入 → 间隔复习 → 主动输出 → 元认知。每一步都有原理、动画演示、练习、实战、误区与掌握标准。
            </p>

            <ol className="mt-4 border-t border-rule">
              {methods.map((m, i) => {
                const done = progress.completedMethods.includes(m.id);
                const steps = progress.completedSteps[m.id] ?? [];
                const isCurrent = !done && !nextPos.finished && nextPos.method.id === m.id;
                return (
                  <li key={m.id}>
                    <Link
                      to={`/methods/${m.id}`}
                      data-testid="data-method-row"
                      onClick={() => playSfx('click')}
                      className="group flex min-h-[44px] flex-wrap items-center gap-x-3 gap-y-1.5 border-b border-rule px-2 py-2.5 transition-colors hover:bg-bone2/60"
                    >
                      <span className="font-serif text-lg font-bold tabular-nums text-rubric" aria-hidden>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <h3 className="font-serif text-[17px] font-bold leading-snug text-paperink md:text-[19px]">
                        {m.title}
                      </h3>
                      {/* 点线 leaders */}
                      <span
                        className="hidden min-w-10 flex-1 translate-y-[6px] border-b border-dotted border-rule sm:block"
                        aria-hidden
                      />

                      {/* 进度状态纹样：形状 + 颜色 + 数字，从不只靠颜色 */}
                      {isCurrent && (
                        <span
                          data-testid="map-you-are-here"
                          className="flex items-center gap-1 rounded-[2px] border border-rubric px-1.5 py-0.5 text-xs font-medium text-rubric"
                        >
                          <MapPin size={11} aria-hidden /> 你在这里
                        </span>
                      )}
                      <span className="flex shrink-0 items-center gap-1.5 text-xs font-medium">
                        {done ? (
                          <span className="flex items-center gap-1 text-cobalt">
                            <Check size={13} strokeWidth={2.5} aria-hidden />
                            已完成
                          </span>
                        ) : !done && steps.length > 0 ? (
                          <span className="flex items-center gap-1 text-rubric">进行中</span>
                        ) : null}
                        <span
                          className={`tabular-nums ${
                            done ? 'text-cobalt' : isCurrent || steps.length > 0 ? 'text-rubric' : 'text-colophon'
                          }`}
                        >
                          {steps.length}/{m.steps.length}
                        </span>
                      </span>

                      {/* 右缘入口 */}
                      <span
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[3px] border border-rule text-colophon transition-colors group-hover:border-paperink group-hover:bg-bone group-hover:text-paperink"
                        aria-hidden
                      >
                        <ArrowRight size={15} />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </section>

          {/* ---------- 数据条（首访空态不渲染，避免一屏 0/0/0/0 的空账本） ---------- */}
          {!isFirstVisit && (
            <section className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-[4px] border border-rule bg-bone2/50 p-4">
                <div className="text-xs text-colophon">方法课程</div>
                <div className="mt-1 font-serif text-3xl font-bold tabular-nums text-paperink">
                  {progress.completedMethods.length}
                  <span className="text-sm text-colophon"> / {methods.length}</span>
                </div>
                <div className="text-xs text-colophon">模块已完成</div>
              </div>

              <div className="rounded-[4px] border border-rule bg-bone2/50 p-4">
                <div className="flex items-center gap-2 text-cobalt">
                  <AudioLines size={18} aria-hidden />
                  <span className="font-serif text-3xl font-bold tabular-nums">{progress.phonemesLearned.length}</span>
                  <span className="text-xs text-colophon">/48 音标已学</span>
                </div>
                <div className="text-xs text-colophon">实战分析过 {progress.analyzedWords.length} 个词</div>
              </div>

              <div className="rounded-[4px] border border-rule bg-bone2/50 p-4">
                <div className="flex items-center gap-2 text-rubric">
                  <Target size={18} aria-hidden />
                  <span className="font-serif text-3xl font-bold tabular-nums">{mistakeCount}</span>
                  <span className="text-xs text-colophon">道错题待订正</span>
                </div>
                <div className="text-xs text-colophon">复习中心会按遗忘曲线排期</div>
              </div>

              <div className="rounded-[4px] border border-rule bg-bone2/50 p-4">
                <div className="flex items-center gap-2 text-rubric">
                  <BookOpenText size={18} aria-hidden />
                  <span className="font-serif text-3xl font-bold tabular-nums">{dueCount}</span>
                  <span className="text-xs text-colophon">张到期复习卡</span>
                </div>
                <div className="text-xs">
                  <Link
                    to="/review"
                    className="inline-flex min-h-[44px] items-center text-cobalt underline decoration-rule underline-offset-4 transition-colors hover:text-paperink"
                  >
                    去复习中心 →
                  </Link>
                </div>
              </div>
            </section>
          )}

          {/* ---------- 我的进度 · 继续学习（唯一进度调节入口） ---------- */}
          <section
            className="mt-8 rounded-[4px] border border-rule bg-bone2/50 p-4 md:p-5"
            data-testid="progress-panel"
            aria-labelledby="progress-panel-title"
          >
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <h2 id="progress-panel-title" className="text-[21px] font-bold text-paperink">
                我的进度 · 继续学习
              </h2>
              <p className="max-w-md text-xs leading-relaxed text-colophon">
                <b className="font-semibold text-cobalt">本站零存储</b>：不写浏览器存储、不自动续学，刷新后回到 0。
                把节数调到你上次学到的位置，从那里接着往下走。
              </p>
            </div>

            {/* 首访引导：三步上手（发丝线夹行，不做卡中卡；CTA 为描边款，不是主行动） */}
            {isFirstVisit && (
              <div className="mb-4 flex flex-wrap items-center gap-x-5 gap-y-3 border-y border-rule py-3.5">
                <ol className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1 text-xs text-colophon">
                  <li className="flex items-center gap-1.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full border border-cobalt text-xs font-bold tabular-nums text-cobalt">1</span>
                    看方法课
                  </li>
                  <li aria-hidden className="text-colophon">→</li>
                  <li className="flex items-center gap-1.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full border border-cobalt text-xs font-bold tabular-nums text-cobalt">2</span>
                    做对应训练
                  </li>
                  <li aria-hidden className="text-colophon">→</li>
                  <li className="flex items-center gap-1.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full border border-cobalt text-xs font-bold tabular-nums text-cobalt">3</span>
                    到期复习
                  </li>
                </ol>
                <p className="basis-full text-xs leading-relaxed text-colophon md:basis-auto">
                  进度只存在这次会话里：学过的内容会自动排进复习队列，刷新即归零、不上传任何个人数据。
                </p>
                <Link
                  to="/methods"
                  className="inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-[3px] border border-rule px-4 py-2.5 text-sm font-medium text-cobalt transition-colors hover:border-paperink hover:text-paperink"
                >
                  去看方法课 <ArrowRight size={14} aria-hidden />
                </Link>
              </div>
            )}

            {/* 首访时空库的「继续学习」大卡与 hero 主 CTA 重复，隐藏它（进度行仍全部保留） */}
            <div className={`grid gap-5 ${isFirstVisit ? '' : 'lg:grid-cols-[minmax(0,330px)_minmax(0,1fr)]'}`}>
              {/* 左：当前位置 + 继续学习（发丝线分栏，不做卡中卡） */}
              {!isFirstVisit && (
                <div className="flex flex-col gap-4 border-b border-rule pb-4 lg:border-b-0 lg:border-r lg:border-rule lg:pr-5 lg:pb-0">
                  <div className="min-w-0">
                    <div className="text-xs text-colophon">当前推进到</div>
                    <div className="font-serif text-lg font-bold text-paperink" data-testid="resume-title">
                      {nextPos.finished ? '全部课程完成' : shortTitle(nextPos.method)}
                    </div>
                    <div className="text-xs text-colophon" data-testid="resume-step">
                      {nextPos.finished
                        ? '反复实战 + 费曼关，把方法变成手感'
                        : `第 ${nextPos.step + 1} 步 / 共 ${nextPos.method.steps.length} 步 · ${
                            nextPos.method.steps[nextPos.step]?.title ?? ''
                          }`}
                    </div>
                  </div>

                  <EduButton
                    sfx={false}
                    className="w-full"
                    data-testid="resume-btn"
                    onClick={() => {
                      playSfx('click');
                      navigate(heroTarget);
                    }}
                  >
                    <MapPin size={15} aria-hidden />
                    {nextPos.finished ? '去实战演练' : nextPos.started ? `从第 ${nextPos.step + 1} 步继续` : '从这里开始学'}
                    <ArrowRight size={15} aria-hidden />
                  </EduButton>

                  <p className="text-xs leading-relaxed text-colophon">
                    指哪学哪：进度由你自己调节，站点不替你猜。调完直接跳到那一节。
                  </p>
                </div>
              )}

              {/* 右：逐课调节（每门课 = 前 n 节已完成；发丝线行，不做卡中卡） */}
              <div className="grid gap-x-6 sm:grid-cols-2">
                {methods.map((m, i) => {
                  const done = progress.completedSteps[m.id]?.length ?? 0;
                  const total = m.steps.length;
                  const pct = Math.round((done / total) * 100);
                  return (
                    <div
                      key={m.id}
                      data-method-row={m.id}
                      className="border-b border-rule py-2"
                    >
                      <div className="min-w-0">
                        <div className="truncate text-xs text-paperink">
                          <span className="mr-1.5 text-xs font-bold tabular-nums text-colophon">
                            0{i + 1}
                          </span>
                          {shortTitle(m)}
                        </div>
                        <div className="mt-1.5 h-[3px] w-full bg-rule" aria-hidden>
                          <div
                            className="h-[3px] bg-cobalt transition-all duration-300"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>

                      {/* 调节组独占一行：窄屏下 4×44px 控件不挤压标题，也不撑破纸页 */}
                      <div className="mt-2 flex items-center justify-end gap-1">
                        <button
                          type="button"
                          data-step-dec={i}
                          aria-label={`减少《${shortTitle(m)}》已完成节数`}
                          onClick={() => {
                            playSfx('tick');
                            progress.setMethodProgress(m.id, Math.max(0, done - 1), total);
                          }}
                          className="flex h-11 w-11 items-center justify-center rounded-[3px] border border-rule text-colophon transition-colors hover:border-paperink hover:text-paperink disabled:opacity-40"
                          disabled={done === 0}
                        >
                          <Minus size={13} aria-hidden />
                        </button>
                        <span className="w-11 text-center text-xs tabular-nums text-paperink" data-step-count={i}>
                          {done}/{total}
                        </span>
                        <button
                          type="button"
                          data-step-inc={i}
                          aria-label={`增加《${shortTitle(m)}》已完成节数`}
                          onClick={() => {
                            playSfx('tick');
                            progress.setMethodProgress(m.id, Math.min(total, done + 1), total);
                          }}
                          className="flex h-11 w-11 items-center justify-center rounded-[3px] border border-rule text-colophon transition-colors hover:border-paperink hover:text-paperink disabled:opacity-40"
                          disabled={done === total}
                        >
                          <Plus size={13} aria-hidden />
                        </button>
                        <button
                          type="button"
                          data-step-reset={i}
                          aria-label={`清空《${shortTitle(m)}》进度`}
                          onClick={() => {
                            playSfx('wrong');
                            progress.resetMethod(m.id);
                          }}
                          className="flex h-11 w-11 items-center justify-center rounded-[3px] border border-rule text-colophon transition-colors hover:border-rubric hover:text-rubric disabled:opacity-40"
                          disabled={done === 0}
                          title="清空该课进度"
                        >
                          <RotateCcw size={12} aria-hidden />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ---------- 底部入口 ---------- */}
          <section className="mt-8 rounded-[4px] border border-rule bg-bone2/50 p-5 text-center md:p-8">
            <h2 className="text-[21px] font-bold leading-snug text-paperink md:text-[25px]">
              今天就用一个生词检验方法
            </h2>
            <p className="mx-auto mt-2 max-w-[68ch] text-[15px] leading-[1.85] text-colophon">
              打开「实战演练」，输入任何没学过的词：网站只给步骤与提示，答案由你自己推导，最后再与词典核对。
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <EduButton
                sfx={false}
                onClick={() => {
                  playSfx('click');
                  navigate('/analyze');
                }}
              >
                <Target size={15} aria-hidden /> 实战演练
              </EduButton>
              <EduButton
                sfx={false}
                onClick={() => {
                  playSfx('click');
                  navigate('/practice');
                }}
              >
                互动训练 11 种题型
              </EduButton>
              <EduButton
                sfx={false}
                onClick={() => {
                  playSfx('click');
                  navigate('/feynman');
                }}
              >
                <MessagesSquare size={15} aria-hidden /> 费曼关 · 讲出来才算会
              </EduButton>
              <EduButton
                sfx={false}
                onClick={() => {
                  playSfx('click');
                  navigate('/lab/phonemes');
                }}
              >
                <AudioLines size={15} aria-hidden /> 进入音标实验室
              </EduButton>
            </div>
          </section>
        </div>

      </div>
    </EduSheet>
  );
}
