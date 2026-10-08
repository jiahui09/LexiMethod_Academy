import type { ReactElement } from 'react';
import type { CourseQuestion } from '@/data/courseSchema';

/**
 * 题型作答体的统一签名。
 * 作答体只管作答控件与提交，揭晓后的讲评区由 CourseQuestionRunner 统一渲染。
 */
export type BodyProps = {
  q: CourseQuestion;
  /** 已提交的答案（revealed 后用于标出所选） */
  given: string;
  /** 是否已揭晓：作答体锁定输入、标出正误形状 */
  revealed: boolean;
  /** 提交（作答体自己判或带自评结果） */
  onSubmit: (given: string, correct: boolean) => void;
};

export type BodyComponent = (props: BodyProps) => ReactElement | null;
