import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  AudioLines,
  ArrowRight,
  Trophy,
  Target,
  BookOpenText,
  Layers,
  MessagesSquare,
  Minus,
  Plus,
  RotateCcw,
  MapPin,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { methods } from '@/data/methods';
import { useProgress, useOverallProgress } from '@/store/progressStore';
import { useReview } from '@/store/reviewStore';
import ProgressRing from '@/components/ui/ProgressRing';
import NeonButton from '@/components/ui/NeonButton';
import { ParticleConverge } from '@/components/course/FeedbackFx';
import { SectionHeading } from '@/components/ui/Bits';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { StaggerGroup, StaggerItem } from '@/components/ui/Cards';
import { useMotionTier } from '@/hooks/useMotionTier';
import { playSfx } from '@/hooks/useSfx';

const ICONS: Record<string, LucideIcon> = {
  AudioLines,
  Sparkles,
  Target,
  BookOpenText,
  Layers,
  Trophy,
};

/** 首页 / 学习地图 */
export default function Home() {
  const tier = useMotionTier();
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

  const title = 'LexiMethod Academy';
  /** 按词分组（词内逐字入场、词间不拆断）：移动端 Academy 不再断成 Aca/demy；i 为全局字符位，保持原延迟节奏 */
  const titleWords = (() => {
    const words = title.split(' ');
    let offset = 0;
    return words.map((word) => {
      const chars = word.split('').map((ch, ci) => ({ ch, i: offset + ci }));
      offset += word.length + 1;
      return chars;
    });
  })();

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

  return (
    <div className="flex flex-col gap-10 pb-6">
      <Breadcrumbs items={[{ label: '学习地图' }]} />

      {/* ---------- HERO ---------- */}
      <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] px-6 py-12 md:py-16">
        <div
          className="absolute left-1/2 top-1/2 h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(0,229,255,0.35), rgba(124,77,255,0.2) 55%, transparent 75%)' }}
          aria-hidden
        />
        <ParticleConverge active={tier !== 'off'} count={34} />

        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <motion.div
            initial={tier === 'off' ? false : { opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-neon/40 bg-neon/10 px-4 py-1.5 text-xs text-neon"
          >
            <Sparkles size={13} aria-hidden /> 授人以渔 · 教方法，而不是堆词表
          </motion.div>

          {/* 标题逐字弹入（按词分组，词内不拆断） */}
          <h1 className="flex flex-wrap items-baseline justify-center gap-x-2.5 font-display text-4xl font-bold leading-tight md:gap-x-4 md:text-6xl">
            {titleWords.map((word, wi) => (
              <span key={wi} className="inline-block whitespace-nowrap">
                {word.map(({ ch, i }) => (
                  <motion.span
                    key={i}
                    className={`inline-block ${i < 11 ? 'text-white' : 'text-gradient'}`}
                    initial={tier === 'off' ? false : { opacity: 0, y: 34, scale: 0.7, rotate: -6 }}
                    animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2 + i * 0.045, type: 'spring', stiffness: 300, damping: 20 }}
                    style={{ textShadow: '0 0 32px rgba(0,229,255,0.35)' }}
                  >
                    {ch}
                  </motion.span>
                ))}
              </span>
            ))}
          </h1>

          <motion.p
            initial={tier === 'off' ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-slate-300/90 md:text-base"
          >
            学会后你能：<b className="text-neon">看到生词读出来</b> · <b className="text-violet">听到发音拼出来</b> ·{' '}
            <b className="text-pink">拆开词根猜意思</b> · 用科学的复习与输出把被动词汇变成主动词汇。
          </motion.p>

          <motion.div
            initial={tier === 'off' ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.5 }}
            className="mt-7 flex flex-wrap items-center justify-center gap-3"
          >
            <NeonButton size="lg" onClick={() => { playSfx('click'); navigate(heroTarget); }} data-testid="hero-resume">
              {heroLabel} <ArrowRight size={16} aria-hidden />
            </NeonButton>
            <NeonButton size="lg" variant="ghost" onClick={() => { playSfx('click'); navigate('/lab/phonemes'); }}>
              <AudioLines size={16} aria-hidden /> 进入音标实验室
            </NeonButton>
          </motion.div>
        </div>
      </section>

      {/* ---------- 数据条（首访空态不渲染，避免一屏 0/0/0/0 的空账本） ---------- */}
      {!isFirstVisit && (
      <section className="grid gap-4 md:grid-cols-[repeat(4,1fr)]">
        <div className="glass flex items-center gap-4 p-5">
          <ProgressRing value={overall} size={104} label="总进度" delay={0.1} />
          <div>
            <div className="text-xs uppercase tracking-widest text-slate-400">方法课程</div>
            <div className="font-display text-xl font-bold text-white">
              {progress.completedMethods.length}
              <span className="text-sm text-slate-500"> / {methods.length}</span>
            </div>
            <div className="text-[11px] text-slate-500">模块已完成</div>
          </div>
        </div>

        <div className="glass flex flex-col justify-center gap-1 p-5">
          <div className="flex items-center gap-2 text-success">
            <AudioLines size={18} aria-hidden />
            <span className="font-display text-3xl font-bold tabular-nums">{progress.phonemesLearned.length}</span>
            <span className="text-xs text-slate-400">/48 音标已学</span>
          </div>
          <div className="text-xs text-slate-400">实战分析过 {progress.analyzedWords.length} 个词</div>
        </div>

        <div className="glass flex flex-col justify-center gap-1 p-5">
          <div className="flex items-center gap-2 text-warn">
            <Target size={18} aria-hidden />
            <span className="font-display text-3xl font-bold tabular-nums">{mistakeCount}</span>
            <span className="text-xs text-slate-400">道错题待订正</span>
          </div>
          <div className="text-xs text-slate-400">复习中心会按遗忘曲线排期</div>
        </div>

        <div className="glass flex flex-col justify-center gap-1 p-5">
          <div className="flex items-center gap-2 text-neon">
            <BookOpenText size={18} aria-hidden />
            <span className="font-display text-3xl font-bold tabular-nums">{dueCount}</span>
            <span className="text-xs text-slate-400">张到期复习卡</span>
          </div>
          <div className="text-[11px] text-slate-500">
            <Link to="/review" className="text-neon underline">
              去复习中心 →
            </Link>
          </div>
        </div>
      </section>
      )}

      {/* ---------- 我的进度 · 继续学习（唯一进度调节入口） ---------- */}
      <section
        className="glass relative overflow-hidden p-5 md:p-6"
        data-testid="progress-panel"
        aria-labelledby="progress-panel-title"
      >
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">My Progress</div>
            <h2 id="progress-panel-title" className="font-display text-xl font-bold text-white">
              我的进度 · 继续学习
            </h2>
          </div>
          <p className="max-w-md text-[11px] leading-relaxed text-slate-400">
            <b className="text-neon">本站零存储</b>：不写浏览器存储、不自动续学，刷新后回到 0。
            把节数调到你上次学到的位置，从那里接着往下走。
          </p>
        </div>

        {/* 首访引导：三步上手（浅色描边，CTA 为描边款，不是发光主按钮） */}
        {isFirstVisit && (
          <div className="mb-4 flex flex-wrap items-center gap-x-5 gap-y-3 rounded-2xl border border-white/15 bg-white/[0.03] px-4 py-3.5">
            <ol className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-300">
              <li className="flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-neon/50 text-xs font-bold text-neon">1</span>
                看方法课
              </li>
              <li aria-hidden className="text-slate-600">→</li>
              <li className="flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-neon/50 text-xs font-bold text-neon">2</span>
                做对应训练
              </li>
              <li aria-hidden className="text-slate-600">→</li>
              <li className="flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-neon/50 text-xs font-bold text-neon">3</span>
                到期复习
              </li>
            </ol>
            <p className="basis-full text-xs leading-relaxed text-slate-400 md:basis-auto">
              进度只存在这次会话里：学过的内容会自动排进复习队列，刷新即归零、不上传任何个人数据。
            </p>
            <Link
              to="/methods"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-neon/45 bg-neon/10 px-4 py-2.5 text-sm font-medium text-neon transition-all hover:-translate-y-0.5 hover:bg-neon/15"
            >
              去看方法课 <ArrowRight size={14} aria-hidden />
            </Link>
          </div>
        )}

        {/* 首访时空库的「继续学习」大卡与 hero 主 CTA 重复，隐藏它（进度行仍全部保留） */}
        <div className={`grid gap-5 ${isFirstVisit ? '' : 'lg:grid-cols-[minmax(0,330px)_minmax(0,1fr)]'}`}>
          {/* 左：当前位置 + 继续学习 */}
          {!isFirstVisit && (
          <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <div className="flex items-center gap-4">
              <ProgressRing value={overall} size={104} label="总进度" />
              <div className="min-w-0">
                <div className="text-xs text-slate-400">当前推进到</div>
                <div className="font-display text-lg font-bold text-white" data-testid="resume-title">
                  {nextPos.finished ? '全部课程完成' : shortTitle(nextPos.method)}
                </div>
                <div className="text-[11px] text-slate-500" data-testid="resume-step">
                  {nextPos.finished
                    ? '反复实战 + 费曼关，把方法变成手感'
                    : `第 ${nextPos.step + 1} 步 / 共 ${nextPos.method.steps.length} 步 · ${
                        nextPos.method.steps[nextPos.step]?.title ?? ''
                      }`}
                </div>
              </div>
            </div>

            <NeonButton
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
            </NeonButton>

            <p className="text-[11px] leading-relaxed text-slate-500">
              指哪学哪：进度由你自己调节，站点不替你猜。调完直接跳到那一节。
            </p>
          </div>
          )}

          {/* 右：逐课调节（每门课 = 前 n 节已完成） */}
          <div className="grid gap-2 sm:grid-cols-2">
            {methods.map((m, i) => {
              const done = progress.completedSteps[m.id]?.length ?? 0;
              const total = m.steps.length;
              const pct = Math.round((done / total) * 100);
              return (
                <div
                  key={m.id}
                  data-method-row={m.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2"
                >
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-xs text-white">
                      <span className="mr-1.5 text-[10px] font-bold tabular-nums text-slate-500">
                        0{i + 1}
                      </span>
                      {shortTitle(m)}
                    </div>
                    <div className="mt-1.5 h-1 w-full rounded-full bg-white/10" aria-hidden>
                      <div
                        className="h-1 rounded-full transition-all duration-300"
                        style={{ width: `${pct}%`, background: m.accent }}
                      />
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      data-step-dec={i}
                      aria-label={`减少《${shortTitle(m)}》已完成节数`}
                      onClick={() => {
                        playSfx('tick');
                        progress.setMethodProgress(m.id, Math.max(0, done - 1), total);
                      }}
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/12 bg-white/5 text-slate-300 transition hover:border-white/30 hover:text-white disabled:opacity-30"
                      disabled={done === 0}
                    >
                      <Minus size={13} aria-hidden />
                    </button>
                    <span className="w-11 text-center text-[11px] tabular-nums text-slate-300" data-step-count={i}>
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
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/12 bg-white/5 text-slate-300 transition hover:border-white/30 hover:text-white disabled:opacity-30"
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
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/12 bg-white/5 text-slate-400 transition hover:border-danger/50 hover:text-danger"
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

      {/* ---------- 学习地图 ---------- */}
      <section>
        <SectionHeading
          kicker="Learning Map"
          title="学习地图：8 个方法模块，一条路径走通"
          desc="按顺序学习：发音与拼写 → 音节与重读 → 词根词缀 → 记忆策略 → 语境输入 → 间隔复习 → 主动输出 → 元认知。每一步都有原理、动画演示、练习、实战、误区与掌握标准。"
        />

        <div className="relative">
          {/* 路径线 */}
          <svg className="pointer-events-none absolute inset-0 hidden h-full w-full md:block" aria-hidden preserveAspectRatio="none">
            <defs>
              <linearGradient id="path-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.55" />
                <stop offset="50%" stopColor="#7C4DFF" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#FF4D9D" stopOpacity="0.45" />
              </linearGradient>
            </defs>
            <motion.path
              d="M 0 40 C 120 40, 260 62, 480 62"
              fill="none"
              stroke="url(#path-grad)"
              strokeWidth={3}
              strokeDasharray="10 8"
              initial={tier === 'off' ? undefined : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.6, ease: 'easeInOut' }}
              style={{ display: 'none' }}
            />
          </svg>

          <StaggerGroup className="grid gap-4 md:grid-cols-2" stagger={0.06}>
            {methods.map((m, i) => {
              const done = progress.completedMethods.includes(m.id);
              const steps = progress.completedSteps[m.id] ?? [];
              const pct = Math.round((steps.length / m.steps.length) * 100);
              const Icon = ICONS[m.category] ?? Sparkles;
              const locked = i > 0 && !progress.completedMethods.includes(methods[i - 1].id) && !done && steps.length === 0;
              return (
                <StaggerItem key={m.id}>
                  <motion.div
                    whileHover={{ y: -6 }}
                    className="group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md transition-all duration-500 hover:border-[color:var(--acc)] hover:shadow-[0_0_30px_rgba(0,229,255,0.18)]"
                    style={{ ['--acc' as string]: m.accent }}
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span
                          className="flex h-11 w-11 items-center justify-center rounded-2xl border"
                          style={{ borderColor: `${m.accent}66`, background: `${m.accent}18`, color: m.accent }}
                        >
                          <Icon size={19} />
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold tabular-nums text-slate-500">0{i + 1}</span>
                            {done && (
                              <span className="rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-bold text-success">已完成</span>
                            )}
                            {!done && steps.length > 0 && (
                              <span className="rounded-full bg-neon/15 px-2 py-0.5 text-[10px] font-bold text-neon">进行中</span>
                            )}
                            {!done && !nextPos.finished && nextPos.method.id === m.id && (
                              <span
                                className="flex items-center gap-1 rounded-full border border-neon/40 bg-neon/10 px-2 py-0.5 text-[10px] font-bold text-neon"
                                data-testid="map-you-are-here"
                              >
                                <MapPin size={10} aria-hidden /> 你在这里
                              </span>
                            )}
                          </div>
                          <h3 className="font-display text-lg font-bold text-white group-hover:text-[color:var(--acc)]">
                            {m.title}
                          </h3>
                        </div>
                      </div>
                      <span className={`text-[11px] ${locked ? 'text-slate-600' : 'text-slate-500'}`}>
                        {locked ? '建议按顺序' : `${m.durationMin ?? 20} 分钟`}
                      </span>
                    </div>

                    <p className="mb-3 text-xs leading-relaxed text-slate-400">{m.subtitle}</p>

                    <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-white/8">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: `linear-gradient(90deg, ${m.accent}, #7C4DFF)` }}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">
                        {steps.length} / {m.steps.length} 步 · {m.pitfalls.length} 个误区清单
                      </span>
                      <Link
                        to={`/methods/${m.id}`}
                        className="inline-flex items-center gap-1 rounded-xl border border-white/12 px-3 py-1.5 text-xs text-slate-300 transition group-hover:border-[color:var(--acc)] group-hover:text-white"
                      >
                        {pct > 0 ? '继续学习' : '进入课程'} <ArrowRight size={12} aria-hidden />
                      </Link>
                    </div>
                  </motion.div>
                </StaggerItem>
              );
            })}
          </StaggerGroup>
        </div>
      </section>

      {/* ---------- 底部 CTA ---------- */}
      <section className="glass relative overflow-hidden p-6 text-center md:p-10">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-2xl font-bold text-white md:text-3xl">
            今天就用 <span className="text-gradient">一个生词</span> 检验方法
          </h2>
          <p className="mt-3 text-sm text-slate-300/85">
            打开「实战演练」，输入任何没学过的词：网站只给步骤与提示，答案由你自己推导，最后再与词典核对。
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <NeonButton onClick={() => { playSfx('click'); navigate('/analyze'); }}>
              <Target size={15} aria-hidden /> 实战演练
            </NeonButton>
            <NeonButton variant="ghost" onClick={() => { playSfx('click'); navigate('/practice'); }}>
              互动训练 11 种题型
            </NeonButton>
            <NeonButton variant="ghost" onClick={() => { playSfx('click'); navigate('/feynman'); }}>
              <MessagesSquare size={15} aria-hidden /> 费曼关 · 讲出来才算会
            </NeonButton>
          </div>
        </div>
      </section>
    </div>
  );
}
