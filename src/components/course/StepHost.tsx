import type { Method, StepAnimation } from '@/types';
import { getDemo } from './demoConfig';
import EntranceStep from './steps/EntranceStep';
import PrincipleStep from './steps/PrincipleStep';
import RuleStep from './steps/RuleStep';
import MappingStep from './steps/MappingStep';
import PracticeStep from './steps/PracticeStep';
import WordAnalysisWizard from '@/components/analyze/WordAnalysisWizard';
import { PitfallsStep, MasteryStep } from './steps/PitfallsMastery';
import RootsStep from './steps/RootsStep';
import { MemoryChainStep, ContextStep, SrsTimelineStep, OutputFunnelStep, MetacogStep, GenericStep } from './steps/VariedSteps';
import { EduEntry } from '@/components/edu';
import { wordById } from '@/data/words';

type Props = {
  method: Method;
  stepIndex: number;
  replayKey: number;
  onNextMethod?: () => void;
};

/** 按 animation 键分发渲染器；步题以词条行（义项编号 + 题头）登场 */
export default function StepHost({ method, stepIndex, replayKey, onNextMethod }: Props) {
  const step = method.steps[stepIndex];
  if (!step) return null;
  const demo = getDemo(method.id);
  const anim: StepAnimation = step.animation;
  /** 本课教学词目：实战分析生词即全课词头（词典一页一词头，步是它的义项） */
  const headword = demo.applicationWord ? wordById[demo.applicationWord] : undefined;

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
            <WordAnalysisWizard wordId={demo.applicationWord ?? 'construction'} compact tone="paper" />
            <p className="text-xs text-colophon">
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
      {/* 步题词条行：义项编号 + 题头 + 教学词目（词头 + IPA + 朗读钮；朗读即盖章） */}
      <EduEntry
        key={stepIndex}
        sense={stepIndex + 1}
        title={step.title}
        word={headword?.word}
        ipa={headword?.phoneticUK}
      />

      {/* 分步动画演示（replayKey 变化即重播） */}
      <div key={`${stepIndex}-${replayKey}`}>{render()}</div>
    </div>
  );
}
