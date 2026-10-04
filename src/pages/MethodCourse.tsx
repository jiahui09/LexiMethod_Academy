import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Route as RouteIcon, MessagesSquare } from 'lucide-react';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { getMethod, methods } from '@/data/methods';
import StepHost from '@/components/course/StepHost';
import StepControls from '@/components/course/StepControls';
import { Narration } from '@/components/ui/Bits';
import { useProgress } from '@/store/progressStore';
import { useReview } from '@/store/reviewStore';
import { useMotionTier } from '@/hooks/useMotionTier';
import { playSfx } from '@/hooks/useSfx';
import { evaluateAchievements } from '@/lib/achievements';
import NotFound from './NotFound';

const EMPTY_STEPS: number[] = [];

/** 方法课程页：分步动画讲解（上一步 / 下一步 / 自动播放 / 重播） */
export default function MethodCourse() {
  const { methodId } = useParams();
  const navigate = useNavigate();
  const tier = useMotionTier();
  const method = useMemo(() => getMethod(methodId), [methodId]);

  // 支持 /methods/:id?step=n —— 供首页「继续学习」定位到上次学到的那一节
  const [search] = useSearchParams();
  const [index, setIndex] = useState(() => {
    const raw = Number(search.get('step'));
    if (!method || !Number.isFinite(raw)) return 0;
    const max = Math.max(0, method.steps.length - 1);
    return Math.min(Math.max(0, Math.floor(raw)), max);
  });
  const [autoplay, setAutoplay] = useState(false);
  const [replayKey, setReplayKey] = useState(0);

  const completed = useProgress((s) => (method ? s.completedSteps[method.id] ?? EMPTY_STEPS : EMPTY_STEPS));
  const completedMethods = useProgress((s) => s.completedMethods);
  const completeStep = useProgress((s) => s.completeStep);
  const ensureCard = useReview((s) => s.ensureCard);

  // 进入某步即记为「看过这一节」（仅记在内存里，刷新即清零）
  useEffect(() => {
    if (!method) return;
    completeStep(method.id, index, method.steps.length);
    ensureCard('method', `${method.id}-${index}`, `${method.title} · ${method.steps[index]?.title ?? ''}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, method?.id]);

  // 结课成就（method1 / all-methods 等由统一评估器判定）
  useEffect(() => {
    if (!method) return;
    if (completedMethods.includes(method.id)) {
      if (evaluateAchievements().length > 0) playSfx('complete');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completedMethods, method?.id]);

  // 自动播放时滚回顶部
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [index]);

  if (!method) return <NotFound />;

  const total = method.steps.length;
  const step = method.steps[index];
  const nextMethod = methods[(methods.indexOf(method) + 1) % methods.length];
  const donePct = Math.round((completed.length / total) * 100);

  const goTo = (i: number) => {
    setIndex(i);
    setReplayKey((k) => k + 1);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* 页头 */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          {/* 方向感：我在哪 —— 地图 › 方法课程 › 这一门 › 第几步 */}
          <Breadcrumbs
            items={[
              { label: '学习地图', to: '/' },
              { label: '方法课程', to: '/methods' },
              { label: method.title.split('：')[0] },
              { label: `第 ${index + 1} 步 / 共 ${total} 步` },
            ]}
          />
          <h1 className="mt-2 flex flex-wrap items-center gap-3 font-display text-2xl font-bold text-white md:text-3xl">
            {method.title}
            <span
              className="rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest"
              style={{ color: method.accent, borderColor: `${method.accent}66`, background: `${method.accent}18` }}
            >
              {method.category}
            </span>
          </h1>
          <p className="mt-1.5 max-w-3xl text-sm text-slate-300/85">{method.subtitle}</p>
        </div>

        <div className="glass flex flex-wrap items-center gap-3 px-4 py-3">
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-widest text-slate-400">本课进度</div>
            <div className="font-display text-xl font-bold text-neon tabular-nums">{donePct}%</div>
            <div className="text-[11px] text-slate-400 tabular-nums" data-testid="course-step">
              第 {index + 1} 步 / 共 {total} 步
            </div>
          </div>
          <div className="flex gap-1" aria-hidden>
            {method.steps.map((_, i) => (
              <span
                key={i}
                className="w-1.5 rounded-full transition-all duration-300"
                style={{
                  height: completed.includes(i) ? 22 : 12,
                  background: completed.includes(i) ? '#00E676' : i === index ? '#00E5FF' : 'rgba(255,255,255,0.18)',
                  boxShadow: i === index ? '0 0 8px #00E5FF' : 'none',
                }}
              />
            ))}
          </div>
          <Link
            to={`/feynman?method=${method.id}`}
            onClick={() => playSfx('reveal')}
            className="flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs transition hover:-translate-y-0.5"
            style={{ color: method.accent ?? '#00E5FF', borderColor: `${method.accent ?? '#00E5FF'}66`, background: `${method.accent ?? '#00E5FF'}14` }}
            aria-label={`进入费曼关：${method.title}`}
          >
            <MessagesSquare size={13} aria-hidden /> 费曼关
          </Link>
          <button
            type="button"
            onClick={() => {
              playSfx('click');
              navigate(`/methods/${nextMethod.id}`);
              setIndex(0);
            }}
            className="flex items-center gap-1.5 rounded-xl border border-white/12 px-3 py-2 text-xs text-slate-300 transition hover:border-neon/50 hover:text-neon"
            aria-label={`前往下一方法：${nextMethod.title}`}
          >
            <RouteIcon size={13} aria-hidden /> 下一方法
          </button>
        </div>
      </div>

      {/* 步骤主体 */}
      <motion.section
        className="glass p-5 md:p-7"
        initial={tier === 'off' ? false : { opacity: 0, y: 20, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        aria-live="polite"
      >
        <StepHost method={method} stepIndex={index} replayKey={replayKey} onNextMethod={() => navigate(`/methods/${nextMethod.id}`)} />

        {/* 旁白文本：不依赖动画传达信息 */}
        <div className="mt-5">
          <Narration text={step.content} />
        </div>

        {/* 控制条 */}
        <StepControls
          index={index}
          total={total}
          autoplay={autoplay}
          completed={completed}
          onChange={goTo}
          onToggleAutoplay={() => setAutoplay((a) => !a)}
          onReplay={() => {
            playSfx('reveal');
            setReplayKey((k) => k + 1);
          }}
        />
      </motion.section>

      {/* 方法要点速览 */}
      <section className="grid gap-3 md:grid-cols-3">
        {method.principles.slice(0, 3).map((p, i) => (
          <motion.div
            key={i}
            initial={tier === 'off' ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05, duration: 0.45 }}
            className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-300"
          >
            <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest" style={{ color: method.accent }}>
              原理 {i + 1}
            </span>
            {p}
          </motion.div>
        ))}
      </section>
    </div>
  );
}
