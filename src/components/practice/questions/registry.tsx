import type { CourseQuestionType } from '@/data/courseSchema';
import type { BodyComponent, BodyProps } from './types';
import ChoiceBody from './ChoiceBody';
import WriteBody from './WriteBody';
import ClassifyBody from './ClassifyBody';
import ConstructBody from './ConstructBody';
import StressBody from './StressBody';
import PlacerBody from './PlacerBody';

/** 缺数据时的兜底：有选项走选择，没选项走填写，任何题型都不崩 */
const fallback: BodyComponent = (p: BodyProps) =>
  p.q.choices && p.q.choices.length > 0 ? <ChoiceBody {...p} /> : <WriteBody {...p} />;

/** 有选项才用专用体，缺数据回落到填写 */
function choiceOrWrite(Body: BodyComponent): BodyComponent {
  return (p: BodyProps) =>
    p.q.choices && p.q.choices.length > 0 ? <Body {...p} /> : <WriteBody {...p} />;
}

/** 结构题（音节块 / 词缀块）缺数据时回落兜底 */
function structuredOrFallback(Body: BodyComponent): BodyComponent {
  return (p: BodyProps) => {
    const hasUnits =
      (p.q.syllableUnits?.length ?? 0) > 0 || (p.q.affixUnits?.length ?? 0) > 0;
    return hasUnits ? <Body {...p} /> : fallback(p);
  };
}

/**
 * 题型 → 作答体注册表：覆盖 CourseQuestionType 全集
 * （QuestionType 11 种 + 重构新增 8 种，共 19 键）。
 */
export const BODY_REGISTRY: Record<CourseQuestionType, BodyComponent> = {
  // 现有选择类
  listenChoosePhoneme: choiceOrWrite(ChoiceBody),
  wordChoosePhoneme: choiceOrWrite(ChoiceBody),
  phonemeChooseSpelling: choiceOrWrite(ChoiceBody),
  spellingChoosePhoneme: choiceOrWrite(ChoiceBody),
  minimalPair: choiceOrWrite(ChoiceBody),
  contextChoice: choiceOrWrite(ChoiceBody),
  // 现有填写类
  listenWritePhoneme: WriteBody,
  listenWriteWord: WriteBody,
  // 现有结构类
  syllableSplit: structuredOrFallback(PlacerBody),
  stressPosition: structuredOrFallback(StressBody),
  affixAssemble: structuredOrFallback(PlacerBody),
  // 重构新增
  choice: choiceOrWrite(ChoiceBody),
  match: choiceOrWrite(ChoiceBody),
  highlight: choiceOrWrite(ChoiceBody),
  classify: choiceOrWrite(ClassifyBody),
  fill: WriteBody,
  construct: choiceOrWrite(ConstructBody),
  selfReveal: choiceOrWrite(ConstructBody),
};

/** 取作答体；未知题型走兜底，绝不崩溃 */
export function getBody(type: CourseQuestionType): BodyComponent {
  return BODY_REGISTRY[type] ?? fallback;
}
