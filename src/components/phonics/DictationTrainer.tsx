import { useEffect, useMemo, useRef, useState } from 'react';
import { PencilLine, Timer, ListRestart, Info, Ear } from 'lucide-react';
import type { Question } from '@/types';
import { words } from '@/data/words';
import QuestionRunner from '@/components/practice/QuestionRunner';
import { EduButton } from '@/components/edu';
import { listenWriteIpaQ, listenWriteWordQ, shuffleArr } from '@/lib/questionFactory';
import { useProgress } from '@/store/progressStore';
import { useReview } from '@/store/reviewStore';
import { playSfx } from '@/hooks/useSfx';

type Mode = 'ipa-then-word' | 'ipa' | 'word';

const MODES: { key: Mode; label: string; desc: string }[] = [
  { key: 'ipa-then-word', label: '先写音标 → 再写单词', desc: '听音 → 音标 → 拼写，逐字母反馈' },
  { key: 'ipa', label: '只写音标', desc: '训练音标速记与重音符号' },
  { key: 'word', label: '只写单词', desc: '训练音节拼写，错误字母红色抖动并显示正确字母' },
];

/** 听音拼写训练 */
export default function DictationTrainer() {
  const [mode, setMode] = useState<Mode>('ipa-then-word');
  const [count, setCount] = useState(6);
  const [seed, setSeed] = useState(1);
  const [onlyTag, setOnlyTag] = useState<string | null>(null);
  /** P1-3 聚焦模式：只出这些词 id（null = 常规出题） */
  const [focusIds, setFocusIds] = useState<string[] | null>(null);
  /** 最近一轮「听写完成后」的错词 id——「只练这些」入口由此生成 */
  const [roundWrong, setRoundWrong] = useState<string[]>([]);
  /** 本轮是否已走完（听写完成才弹「只练这些」） */
  const [roundDone, setRoundDone] = useState(false);
  /** 本轮（同一轮 QuestionRunner 会话内）累计错词，onFinish 时一次性交给上面的 state */
  const roundWrongRef = useRef<string[]>([]);
  const dictationCount = useProgress((s) => s.labDictationCount);
  const mistakes = useReview((s) => s.mistakes);

  const tags = useMemo(() => Array.from(new Set(words.flatMap((w) => w.tags))).slice(0, 10), []);

  const questions = useMemo(() => {
    const pool = focusIds
      ? words.filter((w) => focusIds.includes(w.id))
      : onlyTag
        ? words.filter((w) => w.tags.includes(onlyTag))
        : words;
    // 聚焦模式不吃题量、也不回落到全库：错词一个都不能被 slice 掉
    const chosen = focusIds ? pool : shuffleArr(pool.length ? pool : words).slice(0, count);
    return chosen.flatMap((w) => {
      const list = [];
      if (mode !== 'word') list.push(listenWriteIpaQ(w));
      if (mode !== 'ipa') list.push(listenWriteWordQ(w));
      return list;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, count, seed, onlyTag, focusIds]);

  // 换模式 / 题量 / 标签 / 聚焦集合 = 开新一轮：清掉上一轮的错词统计
  useEffect(() => {
    roundWrongRef.current = [];
    setRoundWrong([]);
    setRoundDone(false);
  }, [mode, count, seed, onlyTag, focusIds]);

  /** 逐题记录本轮错项（P1-3）：错的那题来自哪个词 */
  const handleAnswered = (q: Question, ok: boolean) => {
    if (ok) return;
    const wordId = q.tags?.[1];
    if (wordId && !roundWrongRef.current.includes(wordId)) roundWrongRef.current.push(wordId);
  };
  /** 听写完成 → 从本次错项生成「只练这些」聚焦入口 */
  const handleFinish = () => {
    setRoundDone(true);
    setRoundWrong([...roundWrongRef.current]);
  };

  const wordText = (id: string) => words.find((w) => w.id === id)?.word ?? id;
  const wrongWords = roundWrong.map(wordText);
  const focusWords = (focusIds ?? []).map(wordText);

  const enterFocus = () => {
    const ids = roundWrong.filter((id) => words.some((w) => w.id === id));
    if (!ids.length) return;
    playSfx('reveal');
    setOnlyTag(null);
    setFocusIds(ids);
    setSeed((s) => s + 1);
  };
  const exitFocus = () => {
    playSfx('tick');
    setFocusIds(null);
    setRoundWrong([]);
    setRoundDone(false);
    roundWrongRef.current = [];
    setSeed((s) => s + 1);
  };

  const listenMistakes = mistakes.filter((m) => m.type === 'listenWriteWord' || m.type === 'listenWritePhoneme');

  return (
    <div className="flex flex-col gap-6">
      {/* 模式 */}
      <div className="grid gap-2.5 md:grid-cols-3">
        {MODES.map((m) => (
          <button
            key={m.key}
            type="button"
            onClick={() => {
              playSfx('click');
              setMode(m.key);
              setSeed((s) => s + 1);
            }}
            className={` border-2 p-4 text-left transition-colors duration-200 ${
              mode === m.key ? 'border-ink bg-ink' : 'border-ink bg-under/50 hover:border-ink'
            }`}
            aria-pressed={mode === m.key}
          >
            <div className={`mb-1 flex items-center gap-1.5 text-sm font-semibold ${mode === m.key ? 'text-milk' : 'text-ink'}`}>
              {/* 模式切换钮 = 书写侧语义图标（PencilLine），喇叭/耳机只留给真正出声的播放动作 */}
              <PencilLine size={14} className={mode === m.key ? 'text-milk' : 'text-ink2'} aria-hidden />
              {m.label}
            </div>
            <div className={`text-xs leading-relaxed ${mode === m.key ? 'text-milk' : 'text-ink2'}`}>{m.desc}</div>
          </button>
        ))}
      </div>

      {/* 控制条 */}
      <div className="flex flex-wrap items-center gap-3 border-2 border-ink bg-under/60 px-4 py-3">
        <span className="flex items-center gap-1.5 text-xs text-ink2">
          <Timer size={13} aria-hidden /> 题量
        </span>
        {[4, 6, 10].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => {
              playSfx('tick');
              setCount(n);
              setSeed((s) => s + 1);
            }}
            className={`min-h-[44px] border-2 px-3 py-1 text-xs transition-colors duration-200 ${
              count === n ? 'border-ink bg-ink text-milk' : 'border-ink text-ink2 hover:border-ink hover:text-ink'
            }`}
            aria-pressed={count === n}
          >
            {n} 词
          </button>
        ))}
        <span className="mx-1 h-4 w-px bg-rule" aria-hidden />
        <button
          type="button"
          onClick={() => {
            playSfx('tick');
            setOnlyTag(null);
            setFocusIds(null); // 退出「只练这些」，回到全部词
            setSeed((s) => s + 1);
          }}
          className={`min-h-[44px] border-2 px-3 py-1 text-xs transition-colors duration-200 ${
            !onlyTag && !focusIds ? 'border-ink bg-ink text-milk' : 'border-ink text-ink2 hover:border-ink hover:text-ink'
          }`}
          aria-pressed={!onlyTag && !focusIds}
        >
          全部词
        </button>
        {tags.slice(0, 5).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => {
              playSfx('tick');
              setOnlyTag(t);
              setFocusIds(null); // 换标签 = 换出题池，聚焦随之退出
              setSeed((s) => s + 1);
            }}
            className={`min-h-[44px] border-2 px-3 py-1 text-xs transition-colors duration-200 ${
              onlyTag === t ? 'border-ink bg-ink text-milk' : 'border-ink text-ink2 hover:border-ink hover:text-ink'
            }`}
            aria-pressed={onlyTag === t}
          >
            {t}
          </button>
        ))}
        <EduButton
          size="sm"
          variant="ghost"
          className="ml-auto"
          onClick={() => {
            playSfx('reveal');
            setSeed((s) => s + 7);
          }}
        >
          <ListRestart size={13} aria-hidden /> 重新出题
        </EduButton>
      </div>

      {/* 训练 */}
      <QuestionRunner
        key={`${mode}-${count}-${seed}-${onlyTag ?? 'all'}-${focusIds ? `focus:${focusIds.join('_')}` : 'nofocus'}`}
        questions={questions}
        heading={focusIds ? '听音拼写训练 · 只练这些' : '听音拼写训练'}
        tone="paper"
        onAnswered={handleAnswered}
        onFinish={handleFinish}
      />

      {/* P1-3 只练这些：一轮听写完成后，从本次错项生成聚焦入口（只重练错词的循环） */}
      {focusIds && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-2 border-ink bg-ink px-4 py-3">
          <span className="text-xs font-semibold text-milk">
            聚焦模式：只练这 {focusIds.length} 个错词
            {roundDone && roundWrong.length === 0 && '（本轮全对，收口）'}
          </span>
          <span className="ipa text-xs text-milk/80">{focusWords.join('、')}</span>
          <EduButton
            size="sm"
            variant="ghost"
            className="ml-auto border-milk/60 text-milk hover:border-milk hover:text-milk"
            onClick={exitFocus}
          >
            退出聚焦，回全部词
          </EduButton>
        </div>
      )}
      {roundWrong.length > 0 && (
        <div className="border-2 border-errata/45 bg-errata/[0.05] px-4 py-3">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="text-xs font-semibold text-errata-deep">本轮错词 {roundWrong.length} 个</span>
            <span className="ipa text-xs text-ink2">{wrongWords.join('、')}</span>
            <EduButton size="sm" variant="primary" className="ml-auto" onClick={enterFocus}>
              <Ear size={13} aria-hidden /> 只练这些
            </EduButton>
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-ink2">
            {focusIds
              ? '聚焦内再来一轮：仍错的词会继续留在这张单子里，直到这轮全对。'
              : '点「只练这些」只重练上面这些错词；一轮下来全对即收口，还有错就继续缩圈。'}
          </p>
        </div>
      )}

      {/* 统计与错题 */}
      <div className="grid gap-3 md:grid-cols-2">
        <div className=" border-2 border-ink bg-under/60 p-4">
          <div className="mb-1 flex items-center gap-2 text-xs font-semibold text-ink">
            <Info size={13} aria-hidden /> 训练要点
          </div>
          <ul className="flex flex-col gap-1.5 text-xs leading-relaxed text-ink2">
            <li>· 慢速听结构 → 常速听流利度；两次播放后再落笔。</li>
            <li>· 先写音标，把声音固化成符号再映射到拼写，正确率更高。</li>
            <li>· 逐字母核对，错在哪一节就说明哪个“拼写 ↔ 发音”规则没掌握。</li>
            <li>· 站内不调度复习：错题只记在本机，不会按 1/3/7/14/30 天自动重现；想间隔重复就把错题抄进自己的日历或 Anki。</li>
          </ul>
        </div>
        <div className=" border-2 border-ink bg-under/60 p-4">
          <div
            className={`mb-2 flex items-center gap-2 text-xs font-semibold ${
              listenMistakes.length > 0 ? 'text-errata-deep' : 'text-ink2'
            }`}
          >
            <ListRestart size={13} aria-hidden /> 听写相关错题（{listenMistakes.length}）
          </div>
          <div className="flex max-h-40 flex-col gap-1.5 overflow-y-auto pr-1">
            {listenMistakes.length === 0 && <p className="text-xs text-ink2">暂无错题，继续保持。</p>}
            {listenMistakes.slice(0, 8).map((m) => (
              <div key={m.id} className="flex flex-wrap items-center gap-2 border-2 border-ink px-3 py-2 text-xs">
                <span className="text-ink2">{m.prompt.slice(0, 26)}</span>
                <span className="ipa text-errata-deep">你的答案 {m.given || '（空）'}</span>
                <span className="ipa font-semibold text-ink">标准答案 {m.answer}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="text-xs text-ink2">累计听写训练 {dictationCount} 次（在题目中作答自动累计）</p>
    </div>
  );
}
