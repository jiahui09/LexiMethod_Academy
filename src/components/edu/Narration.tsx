/**
 * 旁白（辞书版式）：动画之外的信息载体。
 * 阅读栏的正文本体——68ch 恒静，行内小标「讲解」领起，不做任何装饰。
 */
export default function EduNarration({ text, className = '' }: { text: string; className?: string }) {
  return (
    <p className={`max-w-[68ch] text-[16px] leading-[1.9] text-paperink ${className}`}>
      <span className="mr-2 text-[13px] font-semibold text-cobalt">讲解</span>
      {text}
    </p>
  );
}
