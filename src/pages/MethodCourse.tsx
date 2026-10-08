import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Route as RouteIcon, FlaskConical } from 'lucide-react';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { getMethod, methods } from '@/data/methods';
import StepHost from '@/components/course/StepHost';
import StepControls from '@/components/course/StepControls';
import { ANIMATION_LABELS } from '@/components/course/demoConfig';
import {
  EduSheet,
  EduRunningHead,
  EduRail,
  EduNarration,
  EduButton,
  EduStamp,
} from '@/components/edu';
import { useProgress } from '@/store/progressStore';
import { useReview } from '@/store/reviewStore';
import { playSfx } from '@/hooks/useSfx';
import NotFound from './NotFound';

const EMPTY_STEPS: number[] = [];

/**
 * 方法课程页（辞书版式）：一部可读可练的书。
 * 书眉定「我在第几义项」，左导轨是装订线，中栏是恒静阅读面，右栏外是页边批注。
 */
export default function MethodCourse() {
  const { methodId } = useParams();
  const navigate = useNavigate();
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
  const completeStep = useProgress((s) => s.completeStep);
  const ensureCard = useReview((s) => s.ensureCard);

  // 进入某步只登记复习卡；完成由「前进 / 完成本课」显式记账（载入深链只定位，不改进度）
  useEffect(() => {
    if (!method) return;
    ensureCard('method', `${method.id}-${index}`, `${method.title} · ${method.steps[index]?.title ?? ''}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, method?.id]);

  // 自动播放时滚回顶部
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [index]);

  if (!method) return <NotFound />;

  const total = method.steps.length;
  const step = method.steps[index];
  const nextMethod = methods[(methods.indexOf(method) + 1) % methods.length];
  const donePct = Math.round((completed.length / total) * 100);
  const finished = completed.length >= total;

  const goTo = (i: number) => {
    setIndex(i);
    setReplayKey((k) => k + 1);
  };

  /** 前进（下一步 / 自动播放 / →）：先记当前步完成，再跳下一节 */
  const advance = () => {
    if (index >= total - 1) return;
    completeStep(method.id, index, total);
    goTo(index + 1);
  };

  /** 完成本课：真正的完成时刻 —— 记账 + 批注章落纸 + 祝贺音 */
  const finish = () => {
    completeStep(method.id, index, total);
    playSfx('complete');
  };

  return (
    <EduSheet className="overflow-hidden">
      {/* 书眉：面包屑 + 本页动作；右上刻线进度永远回答「我在第几义项」 */}
      <EduRunningHead
        left={
          <>
            <Breadcrumbs
              tone="paper"
              items={[
                { label: '方法课程', to: '/methods' },
                { label: method.title.split('：')[0] },
              ]}
            />
          </>
        }
        right={
          <>
            <span className="hidden items-center gap-2 sm:flex" aria-hidden>
              <span className="relative block h-[3px] w-28 bg-rule">
                <span
                  className="absolute left-0 top-0 h-[3px] bg-cobalt transition-[width] duration-500 ease-out-expo"
                  style={{ width: `${donePct}%` }}
                />
              </span>
            </span>
            <span className="text-xs font-semibold tabular-nums text-paperink" data-testid="course-step">
              第 {index + 1} 步 / 共 {total} 步
            </span>
            <EduButton
              size="sm"
              variant="ghost"
              onClick={() => {
                playSfx('click');
                navigate(`/methods/${nextMethod.id}`);
                setIndex(0);
              }}
              aria-label={`前往下一方法：${nextMethod.title}`}
            >
              <RouteIcon size={14} aria-hidden /> 下一方法
            </EduButton>
          </>
        }
      />

      <div className="grid grid-cols-[minmax(0,1fr)] md:grid-cols-[minmax(0,168px)_minmax(0,1fr)] xl:grid-cols-[minmax(0,168px)_minmax(0,1fr)_minmax(0,232px)]">
        {/* 义项导轨：装订线（唯一的进度轴线），小屏横排 */}
        <aside className="min-w-0 border-b border-rule px-3 py-3 md:border-b-0 md:border-r md:px-2 md:py-5">
          <EduRail
            labels={method.steps.map((s) => ANIMATION_LABELS[s.animation])}
            titles={method.steps.map((s) => s.title)}
            index={index}
            completed={completed}
            onChange={goTo}
          />
        </aside>

        {/* 阅读栏：卷首题名 → 步题词条 → 讲解 → 刻线导览 */}
        <div className="min-w-0 px-5 py-6 md:px-8 md:py-8">
          <header className="mb-6 border-b border-rule pb-5">
            <h1 className="text-[26px] font-bold leading-tight text-paperink md:text-[32px]">{method.title}</h1>
            <p className="mt-2 max-w-[68ch] text-[15px] leading-[1.85] text-colophon">{method.subtitle}</p>
            <p className="mt-2 text-[13px] text-cobalt">
              卷：{method.category} · 共 {total} 步 · 约 {method.durationMin} 分钟
            </p>
          </header>

          <section aria-live="polite">
            <StepHost
              method={method}
              stepIndex={index}
              replayKey={replayKey}
              onNextMethod={() => navigate(`/methods/${nextMethod.id}`)}
            />

            {/* 旁白文本：动画之外的信息载体 */}
            <div className="mt-5">
              <EduNarration text={step.content} />
            </div>

            {/* 页脚刻线导览 */}
            <StepControls
              index={index}
              total={total}
              autoplay={autoplay}
              completed={completed}
              onChange={goTo}
              onNext={advance}
              onFinish={finish}
              onToggleAutoplay={() => setAutoplay((a) => !a)}
              onReplay={() => {
                playSfx('reveal');
                setReplayKey((k) => k + 1);
              }}
            />

            {/* 完成时刻：批注章落纸（全课走完才出现） */}
            {finished && (
              <div
                className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[4px] border border-cobalt/45 bg-bone2/70 px-4 py-3"
                role="status"
                data-testid="course-finished"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <EduStamp label="已读" size={64} />
                  <p className="text-sm leading-relaxed text-paperink">
                    本课完成：{total} / {total} 步已走完。下一步去音标实验室把听辨拼验收一遍，才算真的会。
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <EduButton
                    size="sm"
                    variant="primary"
                    onClick={() => {
                      playSfx('click');
                      navigate('/lab/phonemes');
                    }}
                  >
                    <FlaskConical size={14} aria-hidden /> 去实验室
                  </EduButton>
                  <EduButton
                    size="sm"
                    onClick={() => {
                      playSfx('click');
                      navigate(`/methods/${nextMethod.id}`);
                    }}
                  >
                    <RouteIcon size={14} aria-hidden /> 下一方法
                  </EduButton>
                </div>
              </div>
            )}
          </section>

          {/* 本课要点：发丝线清单，不装盒 */}
          <section className="mt-8 border-t border-rule pt-5">
            <h3 className="mb-2.5 text-[13px] font-semibold text-cobalt">本课要点</h3>
            <ul className="max-w-[68ch] list-disc space-y-1.5 pl-5 text-[14.5px] leading-[1.85] text-colophon marker:text-rubric">
              {method.principles.slice(0, 3).map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </section>
        </div>

        {/* 栏外 apparatus：页边批注 */}
        <aside className="hidden border-l border-rule px-5 py-6 xl:block">
          <div className="sticky top-24 flex flex-col gap-5">
            <div className="border-t border-rule pt-2.5 text-[13px] leading-[1.85] text-colophon">
              <b className="mr-1.5 font-semibold text-cobalt">键位</b>
              键盘 ← / → 可翻页；开启「自动播放」按时间线走完本课。
            </div>
            <div className="border-t border-rule pt-2.5 text-[13px] leading-[1.85] text-colophon">
              <b className="mr-1.5 font-semibold text-cobalt">读法</b>
              先读右栏步题与讲解，再点开演示动手做；动画看懂了不等于会，练习做对才算数。
            </div>
            <div className="border-t border-rule pt-2.5 text-[13px] leading-[1.85] text-colophon">
              <b className="mr-1.5 font-semibold text-cobalt">发音</b>
              词目与例词旁的小喇叭播的是站内离线音频；句子走浏览器朗读兜底，断网也能上这一页。
            </div>
            <div className="border-t border-rule pt-2.5 text-[13px] leading-[1.85] text-colophon">
              <b className="mr-1.5 font-semibold text-cobalt">进度</b>
              走完本课 {total} 步后到
              <Link to="/lab/phonemes" className="text-cobalt underline underline-offset-4 hover:text-rubric">
                音标实验室
              </Link>
              三个分卷里验收听辨拼，再进下一门课。
            </div>
          </div>
        </aside>
      </div>
    </EduSheet>
  );
}
