import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { History, RotateCcw, Eye, CheckCircle2, AlertTriangle, Trash2, Play, ArrowRight as ArrowRightIcon, Check, X } from 'lucide-react';
import { useReview, REVIEW_INTERVALS, mistakeStats } from '@/store/reviewStore';
import { TYPE_LABELS } from '@/lib/answers';
import type { QuestionType } from '@/types';
import PageIntro from '@/components/layout/PageIntro';
import { StaggerGroup, StaggerItem } from '@/components/ui/Cards';
import { EduButton, EduChip } from '@/components/edu';
import { playSfx } from '@/hooks/useSfx';
import { useMotionTier } from '@/hooks/useMotionTier';

/** 复习中心：SRS 卡片 + 错题本 */
export default function Review() {
  const tier = useMotionTier();
  const cards = useReview((s) => s.cards);
  const mistakes = useReview((s) => s.mistakes);
  const reviewed = useReview((s) => s.reviewed);
  const schedule = useReview((s) => s.schedule);
  const resolveMistake = useReview((s) => s.resolveMistake);
  const clearMistakes = useReview((s) => s.clearMistakes);

  const [session, setSession] = useState(0);
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [burst, setBurst] = useState(0);
  const [doneCount, setDoneCount] = useState(0);

  const due = useMemo(() => cards.filter((c) => c.dueAt <= Date.now()), [cards]);
  const queue = useMemo(() => due.slice(0, 10), [due, session]); // eslint-disable-line react-hooks/exhaustive-deps
  const card = queue[idx];
  const mStats = useMemo(() => mistakeStats(mistakes), [mistakes]);

  const stageBuckets = REVIEW_INTERVALS.map((_, i) => cards.filter((c) => c.stage === i).length);

  const answer = (ok: boolean) => {
    if (!card) return;
    playSfx(ok ? 'correct' : 'wrong');
    schedule(card.kind, card.refId, card.label, ok);
    if (ok) setDoneCount((d) => d + 1);
    setRevealed(false);
    if (idx + 1 >= queue.length) {
      if (ok) setBurst((b) => b + 1);
      setIdx(queue.length); // 结束
    } else {
      setIdx((i) => i + 1);
    }
  };

  const startSession = () => {
    playSfx('reveal');
    setSession((s) => s + 1);
    setIdx(0);
    setRevealed(false);
    setDoneCount(0);
  };

  const finished = session > 0 && idx >= queue.length && queue.length > 0;

  return (
    <div className="relative flex flex-col gap-6">
      <PageIntro
        crumbs={[{ label: '学习地图', to: '/' }, { label: '复习中心' }]}
        title="复习中心：对抗遗忘曲线的指挥部"
        desc="进度、错题、音标卡片都汇到这里，按 1 / 3 / 7 / 14 / 30 天间隔排期。复习的方式是「主动回忆」：先自己想，再揭示答案。卡片只存在于本次会话（零存储），刷新即重新开始。"
        next={{ label: '继续互动训练', to: '/practice' }}
      />

      {/* 概览 */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-[3px] border border-rule bg-bone2/50 p-5">
          <div className="text-xs text-colophon">今日到期</div>
          <div className="font-serif text-3xl font-bold text-rubric tabular-nums">{due.length}</div>
          <div className="text-xs text-colophon">共 {cards.length} 张卡片</div>
        </div>
        <div className="rounded-[3px] border border-rule bg-bone2/50 p-5">
          <div className="text-xs text-colophon">错题本</div>
          <div className="font-serif text-3xl font-bold text-rubric tabular-nums">{mistakes.length}</div>
          <div className="text-xs text-colophon">答错自动收录</div>
        </div>
        <div className="rounded-[3px] border border-rule bg-bone2/50 p-5">
          <div className="text-xs text-colophon">累计复习正确</div>
          <div className="font-serif text-3xl font-bold text-cobalt tabular-nums">{reviewed}</div>
          <div className="text-xs text-colophon">每次正确升一档</div>
        </div>
        <div className="rounded-[3px] border border-rule bg-bone2/50 p-5">
          <div className="text-xs text-colophon">间隔分布</div>
          <div className="mt-2 flex items-end gap-1.5">
            {stageBuckets.map((n, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-xs text-colophon tabular-nums">{n}</span>
                <motion.div
                  className="w-full rounded-t bg-cobalt"
                  initial={tier === 'off' ? false : { height: 4 }}
                  animate={{ height: 6 + Math.min(38, n * 6) }}
                  transition={{ delay: i * 0.06, duration: 0.5 }}
                  style={{ minHeight: 4 }}
                />
                <span className="text-xs text-colophon">{REVIEW_INTERVALS[i]}d</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 复习会话 */}
      <section className="border-t border-rule pt-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-paperink">
            <History size={15} className="text-rubric" aria-hidden /> 主动回忆复习
            {queue.length > 0 && (
              <span className="text-xs font-normal text-colophon">
                {Math.min(idx + 1, queue.length)} / {queue.length}
              </span>
            )}
          </div>
          <EduButton variant="primary" size="sm" onClick={startSession} disabled={queue.length === 0}>
            <Play size={13} aria-hidden /> {session === 0 ? '开始复习' : '重新开始'}
          </EduButton>
        </div>

        {queue.length === 0 && (
          <div className="rounded-[3px] border border-dashed border-rule px-4 py-8 text-center">
            <p className="text-sm text-paperink">还没有复习卡片</p>
            <p className="mt-1.5 text-xs leading-relaxed text-colophon">
              学完一节课程或做完一组训练后，站点会按遗忘曲线把对应内容排进复习队列，到期卡片会出现在这里。
            </p>
            <Link
              to="/methods"
              className="mt-4 inline-flex min-h-[44px] items-center gap-1.5 rounded-[3px] border border-rule px-4 py-2.5 text-sm font-medium text-paperink transition-colors hover:bg-bone2"
            >
              去上方法课 <ArrowRightIcon />
            </Link>
          </div>
        )}

        {session === 0 && queue.length > 0 && (
          <p className="rounded-[3px] border border-rule bg-bone2/50 px-4 py-6 text-center text-sm text-paperink">
            有 {queue.length} 张卡片到期。规则：先在心里回忆答案 → 再揭示 → 如实评价。
          </p>
        )}

        <AnimatePresence mode="wait">
          {session > 0 && card && (
            <motion.div
              key={`${session}-${idx}`}
              initial={tier === 'off' ? false : { opacity: 0, rotateX: -18, y: 24 }}
              animate={{ opacity: 1, rotateX: 0, y: 0 }}
              exit={tier === 'off' ? undefined : { opacity: 0, y: -24 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-[3px] border border-rule bg-bone2/50 p-6 text-center"
            >
              <EduChip>
                {card.kind === 'phoneme' ? '音标卡' : card.kind === 'mistake' ? '错题卡' : card.kind === 'method' ? '方法步骤' : card.kind === 'rule' ? '规则卡' : '单词卡'}
              </EduChip>
              <p className="mt-4 font-serif text-xl font-bold leading-relaxed text-paperink md:text-2xl">{card.label}</p>
              <p className="mt-2 text-xs text-colophon">
                当前档位：第 {card.stage} 档（{REVIEW_INTERVALS[card.stage]} 天后）· 失手 {card.lapses} 次
              </p>

              {!revealed ? (
                <div className="mt-5 flex justify-center gap-3">
                  <EduButton variant="primary" onClick={() => { playSfx('tick'); setRevealed(true); }}>
                    <Eye size={14} aria-hidden /> 揭示答案
                  </EduButton>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
                  <div className="mb-3 flex flex-wrap justify-center gap-2 text-xs">
                    <span className="flex items-center gap-1 rounded-[3px] border border-cobalt/45 bg-cobalt/[0.06] px-3 py-1.5 text-cobalt">
                      <Check size={12} strokeWidth={2.5} aria-hidden /> 记得 → 升一档
                    </span>
                    <span className="flex items-center gap-1 rounded-[3px] border border-rubric/45 bg-rubric/[0.06] px-3 py-1.5 text-rubric">
                      <X size={12} strokeWidth={2.5} aria-hidden /> 忘了 → 降到第 0 档（3 分钟后再来）
                    </span>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2.5">
                    <EduButton variant="primary" size="sm" onClick={() => answer(true)}>
                      <CheckCircle2 size={14} aria-hidden /> 记得
                    </EduButton>
                    <EduButton variant="default" size="sm" onClick={() => answer(false)}>
                      忘了
                    </EduButton>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {finished && (
            <motion.div
              key="done"
              initial={tier === 'off' ? false : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 rounded-[3px] border border-rule bg-bone2/50 p-6 text-center"
            >
              <div className="font-serif text-2xl font-bold text-cobalt">本轮完成 ✓</div>
              <p className="mt-1 text-sm text-paperink">
                主动回忆 {queue.length} 次，其中“记得” {doneCount} 次。记忆强度来自提取，而不是重读。
              </p>
              <p className="mt-1 text-xs text-colophon">
                已按表现重新排期：记得 → {REVIEW_INTERVALS[1]} 天后见；忘了 → 今天稍后再来。
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* 错题本 */}
      <section className="border-t border-rule pt-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-paperink">
            <AlertTriangle size={15} className="text-rubric" aria-hidden /> 错题本（{mistakes.length}）
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(mStats).map(([t, n]) => (
              <span key={t} className="rounded-[3px] border border-rule bg-bone2/50 px-2.5 py-1 text-xs text-paperink">
                {TYPE_LABELS[t as QuestionType] ?? t} <b className="text-rubric">{n}</b>
              </span>
            ))}
            {mistakes.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  playSfx('click');
                  clearMistakes();
                }}
                className="flex min-h-[44px] items-center gap-1 rounded-[3px] border border-rule px-3 text-xs text-rubric transition-colors hover:bg-bone2"
              >
                <Trash2 size={11} aria-hidden /> 清空
              </button>
            )}
          </div>
        </div>

        <StaggerGroup className="grid gap-3 md:grid-cols-2" stagger={0.05}>
          {mistakes.length === 0 && (
            <div className="rounded-[3px] border border-dashed border-rule px-4 py-8 text-center text-sm text-colophon md:col-span-2">
              还没有错题。去「互动训练」做几道题，错的会自动出现在这里并附带原理解释。
            </div>
          )}
          {mistakes.map((m) => (
            <StaggerItem key={m.id}>
              <div className="rounded-[3px] border border-rule bg-bone2/50 p-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <EduChip>{TYPE_LABELS[m.type] ?? m.type}</EduChip>
                  <span className="text-xs text-colophon">
                    {new Date(m.at).toLocaleString('zh-CN')} · 错 {m.count} 次
                  </span>
                </div>
                <p className="mb-2 text-sm text-paperink">{m.prompt}</p>
                <div className="mb-2 flex flex-wrap gap-3 text-xs">
                  <span className="flex items-center gap-1 text-rubric">
                    <X size={12} strokeWidth={2.5} aria-hidden /> 你的：{m.given || '（空）'}
                  </span>
                  <span className="ipa flex items-center gap-1 text-cobalt">
                    <Check size={12} strokeWidth={2.5} aria-hidden /> 正确：{m.answer}
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-colophon">{m.explain}</p>
                <div className="mt-2.5 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      playSfx('correct');
                      resolveMistake(m.id);
                      schedule('mistake', m.questionId, m.prompt, true);
                    }}
                    className="flex min-h-[44px] items-center gap-1 rounded-[3px] border border-rule px-3 text-xs text-paperink transition-colors hover:bg-bone2"
                  >
                    <RotateCcw size={11} aria-hidden /> 我已掌握
                  </button>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>
    </div>
  );
}
