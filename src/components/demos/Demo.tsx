import React from 'react';
import { phonicsDemos } from './phonics';
import { rootsDemos } from './roots';
import { contextDemos } from './context';
import { mnemonicsDemos } from './mnemonics';
import { srsDemos } from './srs';
import { outputDemos } from './output';
import { metacogDemos } from './metacog';

/** 全书 47 个教学演示的注册表：ref（kebab-case）→ 组件 */
const REGISTRY: Record<string, React.FC> = {
  ...phonicsDemos,
  ...rootsDemos,
  ...contextDemos,
  ...mnemonicsDemos,
  ...srsDemos,
  ...outputDemos,
  ...metacogDemos,
};

/** 已注册演示名（数据层校验用：课程 ref 必须全部命中，注册表不得有死项） */
export const DEMO_NAMES: string[] = Object.keys(REGISTRY);

/**
 * 演示块渲染器（A 调用）：name = 课程数据里的 demo ref。
 * 未识别 ref 不崩，降级为 caption 文本行（教学信息不丢）。
 * caption 来自数据，始终渲染在演示体下方作 figcaption。
 */
export function Demo({ name, caption }: { name: string; caption?: string }) {
  const Comp = REGISTRY[name];

  if (!Comp) {
    return (
      <figure className="my-4" data-demo={name} data-demo-unknown="true">
        {caption && <figcaption className="text-[15px] text-ink2">{caption}</figcaption>}
      </figure>
    );
  }

  return (
    <figure className="my-4" data-demo={name}>
      <Comp />
      {caption && (
        <figcaption className="mt-2 border-t border-rule pt-2 text-[14px] leading-relaxed text-ink2">{caption}</figcaption>
      )}
    </figure>
  );
}

export default Demo;
