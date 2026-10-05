import { useState } from 'react';
import { SpeakButton } from '@/components/edu/Speak';
import EduStamp from '@/components/edu/Stamp';

type Props = {
  /** 义项编号（导轨序位），显示为红批数字 */
  sense?: number;
  /** 步题：以词目姿态登场 */
  title: string;
  /** 可朗读的教学词（英文词目）——有它才渲染 IPA 与朗读钮 */
  word?: string;
  ipa?: string;
  /** 右侧的行内元信息（类型标签等），贴在题后，绝不压在题上 */
  meta?: string;
  className?: string;
};

/**
 * 词条行：义项编号 + 题头 +（可选）英文词目 / IPA / 朗读钮。
 * 这是步题在辞书版式里的标准形态——标题自己承载重量，不戴眉标。
 * 签名交互：朗读一响，批注红章落在词尾——像用红笔在词典上做了记号（步进即重置）。
 */
export default function EduEntry({ sense, title, word, ipa, meta, className = '' }: Props) {
  const [stamped, setStamped] = useState(false);
  return (
    <div className={`flex flex-wrap items-baseline gap-x-3 gap-y-1.5 ${className}`}>
      {sense !== undefined && (
        <span className="font-serif text-xl font-bold tabular-nums text-rubric" aria-hidden>
          {String(sense).padStart(2, '0')}
        </span>
      )}
      <h2 className="text-[21px] font-bold leading-snug text-paperink md:text-[25px]">{title}</h2>
      {word && (
        <span className="flex items-baseline gap-2">
          <span className="relative">
            <span className="font-serif text-lg font-semibold italic text-paperink">{word}</span>
            {stamped && (
              <EduStamp
                label="朗读"
                size={44}
                className="pointer-events-none absolute -right-5 -top-3.5 z-10"
              />
            )}
          </span>
          {ipa && (
            <span className="ipa text-[13px] text-colophon">{ipa.startsWith('/') ? ipa : `[${ipa}]`}</span>
          )}
          <SpeakButton text={word} size="md" className="min-h-[44px] min-w-[44px]" onSpeak={() => setStamped(true)} />
        </span>
      )}
      {meta && <span className="text-xs font-medium text-cobalt">{meta}</span>}
    </div>
  );
}
