import type { Method, StepAnimation } from '@/types';
import { ANIMATION_LABELS, getDemo } from './demoConfig';
import EntranceStep from './steps/EntranceStep';
import PrincipleStep from './steps/PrincipleStep';
import RuleStep from './steps/RuleStep';
import MappingStep from './steps/MappingStep';
import PracticeStep from './steps/PracticeStep';
import WordAnalysisWizard from '@/components/analyze/WordAnalysisWizard';
import { PitfallsStep, MasteryStep } from './steps/PitfallsMastery';
import RootsStep from './steps/RootsStep';
import { MemoryChainStep, ContextStep, SrsTimelineStep, OutputFunnelStep, MetacogStep, GenericStep } from './steps/VariedSteps';

type Props = {
  method: Method;
  stepIndex: number;
  replayKey: number;
  onNextMethod?: () => void;
};

/** 按 animation 键分发渲染器 */
export default function StepHost({ method, stepIndex, replayKey, onNextMethod }: Props) {
  const step = method.steps[stepIndex];
  if (!step) return null;
  const demo = getDemo(method.id);
  const anim: StepAnimation = step.animation;

  const render = () => {
    switch (anim) {
      case 'entrance':
        return <EntranceStep method={method} />;
      case 'principle':
        return <PrincipleStep method={method} />;
      case 'rule':
        return <RuleStep method={method} />;
      case 'mapping':
        return <MappingStep method={method} />;
      case 'practice':
        return <PracticeStep method={method} />;
      case 'application':
        return (
          <div className="flex flex-col gap-3">
            <WordAnalysisWizard wordId={demo.applicationWord ?? 'construction'} compact />
            <p className="text-[11px] text-slate-500">
              每一步都可以点“要提示吗”，但网站不会替你作答 —— 这正是实战与背单词的区别。
            </p>
          </div>
        );
      case 'pitfalls':
        return <PitfallsStep method={method} />;
      case 'mastery':
        return <MasteryStep method={method} onNextMethod={onNextMethod} />;
      case 'roots':
        return <RootsStep />;
      case 'memoryChain':
        return <MemoryChainStep method={method} />;
      case 'context':
        return <ContextStep />;
      case 'srsTimeline':
        return <SrsTimelineStep />;
      case 'outputFunnel':
        return <OutputFunnelStep />;
      case 'metacog':
        return <MetacogStep />;
      case 'generic':
      default:
        return <GenericStep method={method} stepIndex={stepIndex} />;
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 步骤标题条 */}
      <div className="flex flex-wrap items-center gap-3">
        <span
          className="rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-widest"
          style={{ color: method.accent ?? '#00E5FF', borderColor: `${method.accent ?? '#00E5FF'}66`, background: `${method.accent ?? '#00E5FF'}1A` }}
        >
          Step {stepIndex + 1} · {ANIMATION_LABELS[anim]}
        </span>
        <h2 className="font-display text-xl font-bold text-white md:text-2xl">{step.title}</h2>
      </div>

      {/* 分步动画演示（replayKey 变化即重播） */}
      <div key={`${stepIndex}-${replayKey}`}>{render()}</div>
    </div>
  );
}
