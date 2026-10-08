import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Ear, Layers, TriangleAlert, Link2, Volume2, CheckCircle2 } from 'lucide-react';
import type { Phoneme } from '@/types';
import { phonemeById, phonemes } from '@/data/phonemes';
import MouthSideView from './MouthSideView';
import StepControls from '@/components/course/StepControls';
import { Waveform } from '@/components/course/FeedbackFx';
import { MinimalPairJudge, ListenChooseDrill } from './PhonemeDrills';
import { SpeakButton, EduChip } from '@/components/edu';
import { useSpeech, useSpeaking } from '@/hooks/useSpeech';
import { speakPhoneme, preloadPhoneme } from '@/hooks/usePhonemeAudio';
import { useMotionTier } from '@/hooks/useMotionTier';
import { useProgress } from '@/store/progressStore';
import { useReview } from '@/store/reviewStore';
import { playSfx } from '@/hooks/useSfx';

const STEP_TITLES = [
  '① 音标登场',
  '② 口型侧面动画',
  '③ 气流与声带',
  '④ 对比音',
  '⑤ 例词与拼写',
  '⑥ 最小对立对',
  '⑦ 互动判断',
];

/** 单个音标的分步教学舞台（7 步动画讲解）——词典里的音标词条页，内容动画保留，辉光与渐变已除 */
export default function PhonemeStage({ phoneme, onSelect }: { phoneme: Phoneme; onSelect: (p: Phoneme) => void }) {
  const tier = useMotionTier();
  const { speak } = useSpeech();
  const speaking = useSpeaking();
  const [index, setIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(false);
  const [replay, setReplay] = useState(0);
  const markLearned = useProgress((s) => s.markPhonemeLearned);
  const ensureCard = useReview((s) => s.ensureCard);

  // 换音标 → 回到第一步 + 预载离线发音
  useEffect(() => {
    setIndex(0);
    setReplay((r) => r + 1);
    setAutoplay(false);
    preloadPhoneme(phoneme.id);
    ensureCard('phoneme', phoneme.id, `${phoneme.symbol} ${phoneme.exampleWords[0]}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phoneme.id]);

  useEffect(() => {
    if (index === STEP_TITLES.length - 1) {
      markLearned(phoneme.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, phoneme.id]);

  const contrast = useMemo(
    () => phoneme.contrastWith.map((id) => phonemeById[id]).filter(Boolean).slice(0, 2),
    [phoneme],
  );
  const longShort = phoneme.longShortPair ? phonemeById[phoneme.longShortPair] : undefined;

  const panel = () => {
    switch (index) {
      case 0:
        return (
          <div className="relative flex min-h-[300px] flex-col items-center justify-center overflow-hidden rounded-[4px] border border-rule bg-bone px-4 py-8 text-center">
            <div className="relative z-10 flex flex-col items-center gap-3">
              <motion.div
                key={`sym-${replay}`}
                initial={tier === 'off' ? false : { scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 240, damping: 20 }}
                className="ipa text-6xl font-bold text-paperink md:text-7xl"
              >
                {phoneme.symbol}
              </motion.div>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <EduChip>{phoneme.type === 'vowel' ? '单元音' : phoneme.type === 'diphthong' ? '双元音' : '辅音'}</EduChip>
                <EduChip>{phoneme.voiced ? '浊音 · 声带振动' : '清音 · 声带静止'}</EduChip>
                <EduChip>{phoneme.geo.place}</EduChip>
              </div>
              <p className="max-w-md px-4 text-sm text-colophon">{phoneme.hintCN}</p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <SpeakButton text={phoneme.ttsWord ?? phoneme.exampleWords[0]} phonemeId={phoneme.id} label={`播放 ${phoneme.symbol} 发音`} className="min-h-[44px] min-w-[44px]" />
                <SpeakButton text={phoneme.ttsWord ?? phoneme.exampleWords[0]} phonemeId={phoneme.id} slow label={`慢速播放 ${phoneme.symbol}`} className="min-h-[44px] min-w-[44px]" />
                <Waveform active={speaking} bars={20} color="#B3311E" />
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr] xl:grid-cols-1">
            <MouthSideView geo={phoneme.geo} voiced={phoneme.voiced} playing />
            <div className="flex flex-col gap-3">
              <InfoCard title="口型（正面 + 侧面）" text={phoneme.mouthShape} />
              <InfoCard title="舌位" text={phoneme.tonguePosition} />
              <div className="rounded-[4px] border border-rule bg-bone2/60 p-4 text-xs leading-relaxed text-colophon">
                观察要点：下颌开合度 = <b className="font-semibold text-paperink">{phoneme.geo.jawOpen.toFixed(2)}</b> · 舌高 ={' '}
                <b className="font-semibold text-paperink">{phoneme.geo.tongueHigh.toFixed(2)}</b> · 舌前后 ={' '}
                <b className="font-semibold text-paperink">{phoneme.geo.tongueFront.toFixed(2)}</b> · 唇圆度 ={' '}
                <b className="font-semibold text-paperink">{phoneme.geo.lipRound.toFixed(2)}</b>（0–1，随发音实时插值）
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr] xl:grid-cols-1">
            <MouthSideView geo={phoneme.geo} voiced={phoneme.voiced} playing />
            <div className="flex flex-col gap-3">
              <InfoCard title="气流路径" text={phoneme.airflow} />
              <div className="rounded-[4px] border border-cobalt/45 bg-bone2/60 p-4">
                <div className="mb-1 text-sm font-semibold text-cobalt">
                  声带：{phoneme.voiced ? '振动（浊音）' : '不振动（清音）'}
                </div>
                <Waveform active={speaking && phoneme.voiced} bars={22} color={phoneme.voiced ? '#1E4B7A' : '#4A443B'} />
                <p className="mt-1 text-xs text-colophon">
                  {phoneme.voiced
                    ? '把手放在喉结上读这个音，应能感到明显振动。'
                    : '手触喉结读这个音，应感觉不到振动——气流只是摩擦而出。'}
                </p>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-colophon">
              和它最容易混的音对比口型 / 舌位（点击可直接切换到该音标）：
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              {contrast.map((c) => (
                <div key={c.id} className="rounded-[4px] border border-rule bg-bone2/50 p-3">
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <span className="ipa text-lg font-bold text-paperink">
                      {phoneme.symbol} <span className="text-colophon">vs</span> {c.symbol}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        playSfx('tick');
                        onSelect(c);
                      }}
                      className="flex min-h-[44px] min-w-[44px] items-center gap-1 rounded-[3px] border border-cobalt/50 px-2 py-1 text-xs text-cobalt transition-colors hover:bg-cobalt/[0.07]"
                    >
                      <Link2 size={11} aria-hidden /> 切换到 {c.symbol}
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <MiniMouth phoneme={phoneme} />
                    <MiniMouth phoneme={c} />
                  </div>
                  <p className="mt-2 text-xs text-colophon">
                    {phoneme.symbol}：{phoneme.tonguePosition.slice(0, 40)}… ／ {c.symbol}：{c.tonguePosition.slice(0, 40)}…
                  </p>
                </div>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="flex flex-col gap-4">
            <div>
              <div className="mb-2 text-xs font-semibold text-cobalt">例词（点击朗读）</div>
              <div className="flex flex-wrap gap-2">
                {phoneme.exampleWords.map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => {
                      playSfx('tick');
                      speak(w);
                    }}
                    className="flex min-h-[44px] items-center gap-2 rounded-[3px] border border-rule bg-bone px-4 py-2.5 font-serif text-sm font-semibold text-paperink transition-colors hover:border-rubric hover:text-rubric"
                  >
                    {w} <Volume2 size={13} className="text-rubric" aria-hidden />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2 text-xs font-semibold text-cobalt">
                <Layers size={12} className="mr-1 inline" aria-hidden /> 常见拼写对应
              </div>
              <div className="flex flex-wrap gap-2">
                {phoneme.commonSpellings.map((s) => (
                  <span
                    key={s}
                    className="ipa inline-flex min-h-[44px] min-w-[44px] items-center rounded-[3px] border border-rule bg-bone2/60 px-3 py-1.5 text-sm font-semibold text-paperink"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {longShort && (
              <div className="rounded-[4px] border border-rule bg-bone2/50 p-4">
                <div className="mb-2 text-xs font-semibold text-cobalt">长短音对比</div>
                <div className="flex flex-wrap items-center gap-4">
                  {[phoneme, longShort].map((p) => (
                    <div key={p.id} className="flex items-center gap-2">
                      <span className="ipa text-xl font-bold text-paperink">{p.symbol}</span>
                      <span className="font-serif text-xs text-colophon">{p.exampleWords[0]}</span>
                      <SpeakButton text={p.ttsWord ?? p.exampleWords[0]} phonemeId={p.id} label={`播放 ${p.symbol} 发音`} size="sm" className="min-h-[44px] min-w-[44px]" />
                      <SpeakButton text={p.ttsWord ?? p.exampleWords[0]} phonemeId={p.id} slow label={`慢速播放 ${p.symbol}`} size="sm" className="min-h-[44px] min-w-[44px]" />
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-xs text-colophon">{longShort.hintCN}</p>
              </div>
            )}
          </div>
        );

      case 5:
        return <MinimalPairJudge phoneme={phoneme} />;

      case 6:
      default:
        return <ListenChooseDrill phoneme={phoneme} />;
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* 分步播放器：词典里的词条装置块 */}
      <section className="rounded-[4px] border border-rule bg-bone2/40 p-4 md:p-6" aria-live="polite">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="ipa text-3xl font-bold text-paperink">{phoneme.symbol}</span>
              <span className="rounded-[3px] border border-rubric bg-rubric/[0.07] px-2 py-0.5 text-xs font-semibold text-rubric">
                {STEP_TITLES[index]}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <SpeakButton text={phoneme.ttsWord ?? phoneme.exampleWords[0]} phonemeId={phoneme.id} label={`播放 ${phoneme.symbol} 发音`} className="min-h-[44px] min-w-[44px]" />
            <SpeakButton text={phoneme.ttsWord ?? phoneme.exampleWords[0]} phonemeId={phoneme.id} slow label={`慢速播放 ${phoneme.symbol}`} className="min-h-[44px] min-w-[44px]" />
            <button
              type="button"
              onClick={() => {
                playSfx('correct');
                markLearned(phoneme.id);
              }}
              className="flex min-h-[44px] items-center gap-1 rounded-[3px] border border-cobalt/50 bg-transparent px-3 py-2 text-xs text-cobalt transition-colors hover:bg-cobalt/[0.07]"
            >
              <CheckCircle2 size={13} aria-hidden /> 标记已学
            </button>
          </div>
        </div>

        <div key={`${phoneme.id}-${index}-${replay}`}>{panel()}</div>

        <div className="mt-4">
          <StepControls
            hint="提示：可用键盘 ← / → 翻页；开启“自动播放”按 7 步时间线自动推进；走完最后一步记得「标记已学」。"
            index={index}
            total={STEP_TITLES.length}
            autoplay={autoplay}
            completed={[]}
            onChange={(i) => {
              setIndex(i);
              setReplay((r) => r + 1);
            }}
            onNext={() => {
              // 前进走 onNext（与 StepControls 的按钮/自动播放/键盘→同一契约）；末步即 markLearned 生效点
              setIndex((i) => Math.min(i + 1, STEP_TITLES.length - 1));
              setReplay((r) => r + 1);
            }}
            onToggleAutoplay={() => setAutoplay((a) => !a)}
            onReplay={() => setReplay((r) => r + 1)}
          />
        </div>
      </section>

      {/* 要点速查：主栏在 xl 被索引表与页边批注夹到 ~600px，四列会把整句中文挤成 2 字宽的竖条——恒为 2 列，宁可两行也不做窄柱 */}
      <section className="grid gap-3 sm:grid-cols-2">
        <InfoCard title="口型" text={phoneme.mouthShape} />
        <InfoCard title="舌位" text={phoneme.tonguePosition} />
        <InfoCard title="气流" text={phoneme.airflow} />
        <div className="rounded-[4px] border border-rubric/45 bg-rubric/[0.05] p-4">
          <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-rubric">
            <TriangleAlert size={13} aria-hidden /> 中文母语者易犯错误
          </div>
          <ul className="flex flex-col gap-1.5 text-[13px] leading-[1.75] text-colophon">
            {phoneme.commonMistakes.map((m, i) => (
              <li key={i}>· {m}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* 拼写对应 + 对比跳转 */}
      <section className="grid gap-3 md:grid-cols-2">
        <div className="rounded-[4px] border border-rule bg-bone2/50 p-4">
          <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-cobalt">
            <Ear size={12} aria-hidden /> 常见拼写
          </div>
          <div className="flex flex-wrap gap-2">
            {phoneme.commonSpellings.map((s) => (
              <span key={s} className="ipa rounded-[3px] border border-rule bg-bone px-3 py-1.5 text-sm text-paperink">
                {s}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-[4px] border border-rule bg-bone2/50 p-4">
          <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-cobalt">
            <Link2 size={12} aria-hidden /> 对比 / 相关音标
          </div>
          <div className="flex flex-wrap gap-2">
            {phonemes
              .filter((p) => phoneme.contrastWith.includes(p.id))
              .map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    playSfx('tick');
                    onSelect(p);
                  }}
                  className="ipa min-h-[44px] min-w-[44px] rounded-[3px] border border-rule bg-bone px-3 py-1.5 text-sm text-cobalt transition-colors hover:border-rubric hover:text-rubric"
                >
                  {p.symbol}
                </button>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/** 要点卡：发丝线框 + 一档纸色，标题走结构蓝，正文走次级墨 */
function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-[4px] border border-rule bg-bone2/50 p-4">
      <div className="mb-1.5 text-[13px] font-semibold text-cobalt">{title}</div>
      <p className="text-[13px] leading-[1.75] text-colophon">{text}</p>
    </div>
  );
}

function MiniMouth({ phoneme }: { phoneme: Phoneme }) {
  return (
    <div className="overflow-hidden rounded-[4px] border border-rule bg-bone">
      <div className="px-2 pt-1 text-center text-xs font-bold text-colophon">{phoneme.symbol}</div>
      <MouthSideView geo={phoneme.geo} voiced={phoneme.voiced} showFront={false} />
    </div>
  );
}
