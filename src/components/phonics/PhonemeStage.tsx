import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Ear, Layers, TriangleAlert, Link2, Volume2, CheckCircle2 } from 'lucide-react';
import type { Phoneme } from '@/types';
import { phonemeById, phonemes } from '@/data/phonemes';
import MouthSideView from './MouthSideView';
import StepControls from '@/components/course/StepControls';
import { ParticleConverge, Waveform } from '@/components/course/FeedbackFx';
import { MinimalPairJudge, ListenChooseDrill } from './PhonemeDrills';
import { SpeakButton, Chip } from '@/components/ui/Bits';
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

/** 单个音标的分步教学舞台（7 步动画讲解） */
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
          <div className="relative flex min-h-[300px] flex-col items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] text-center">
            <motion.div
              className="absolute h-56 w-56 rounded-full blur-3xl"
              style={{ background: 'radial-gradient(circle, rgba(0,229,255,0.5), transparent 70%)' }}
              animate={tier === 'off' ? {} : { scale: [1, 1.15, 1], opacity: [0.5, 0.85, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <ParticleConverge active={tier !== 'off'} />
            <div className="relative z-10 flex flex-col items-center gap-3">
              <motion.div
                key={`sym-${replay}`}
                initial={tier === 'off' ? false : { scale: 0.5, opacity: 0, filter: 'blur(10px)' }}
                animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                transition={{ type: 'spring', stiffness: 240, damping: 20 }}
                className="ipa text-6xl font-bold text-white drop-shadow-[0_0_28px_rgba(0,229,255,0.75)] md:text-7xl"
              >
                {phoneme.symbol}
              </motion.div>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Chip tone="cyan">{phoneme.type === 'vowel' ? '单元音' : phoneme.type === 'diphthong' ? '双元音' : '辅音'}</Chip>
                <Chip tone={phoneme.voiced ? 'green' : 'amber'}>{phoneme.voiced ? '浊音 · 声带振动' : '清音 · 声带静止'}</Chip>
                <Chip tone="violet">{phoneme.geo.place}</Chip>
              </div>
              <p className="max-w-md px-4 text-sm text-slate-300">{phoneme.hintCN}</p>
              <div className="flex items-center gap-2">
                <SpeakButton text={phoneme.ttsWord ?? phoneme.exampleWords[0]} phonemeId={phoneme.id} label={`播放 ${phoneme.symbol} 发音`} className="min-h-[44px] min-w-[44px]" />
                <SpeakButton text={phoneme.ttsWord ?? phoneme.exampleWords[0]} phonemeId={phoneme.id} slow label={`慢速播放 ${phoneme.symbol}`} className="min-h-[44px] min-w-[44px]" />
                <Waveform active={speaking} bars={20} />
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr]">
            <MouthSideView geo={phoneme.geo} voiced={phoneme.voiced} playing />
            <div className="flex flex-col gap-3">
              <InfoCard title="口型（正面 + 侧面）" text={phoneme.mouthShape} tone="#00E5FF" />
              <InfoCard title="舌位" text={phoneme.tonguePosition} tone="#FF4D9D" />
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-xs text-slate-400">
                观察要点：下颌开合度 = <b className="text-white">{phoneme.geo.jawOpen.toFixed(2)}</b> · 舌高 ={' '}
                <b className="text-white">{phoneme.geo.tongueHigh.toFixed(2)}</b> · 舌前后 ={' '}
                <b className="text-white">{phoneme.geo.tongueFront.toFixed(2)}</b> · 唇圆度 ={' '}
                <b className="text-white">{phoneme.geo.lipRound.toFixed(2)}</b>（0–1，随发音实时插值）
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr]">
            <MouthSideView geo={phoneme.geo} voiced={phoneme.voiced} playing />
            <div className="flex flex-col gap-3">
              <InfoCard title="气流路径" text={phoneme.airflow} tone="#A98BFF" />
              <div
                className="rounded-2xl border p-4"
                style={{
                  borderColor: phoneme.voiced ? 'rgba(0,230,118,0.4)' : 'rgba(255,179,0,0.35)',
                  background: phoneme.voiced ? 'rgba(0,230,118,0.07)' : 'rgba(255,179,0,0.06)',
                }}
              >
                <div className={`mb-1 text-sm font-semibold ${phoneme.voiced ? 'text-success' : 'text-warn'}`}>
                  声带：{phoneme.voiced ? '振动（浊音）' : '不振动（清音）'}
                </div>
                <Waveform active={speaking && phoneme.voiced} bars={22} color={phoneme.voiced ? '#00E676' : '#64748B'} />
                <p className="mt-1 text-xs text-slate-400">
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
            <p className="text-sm text-slate-300">
              和它最容易混的音对比口型 / 舌位（点击可直接切换到该音标）：
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              {contrast.map((c) => (
                <div key={c.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="ipa text-lg font-bold text-white">
                      {phoneme.symbol} <span className="text-slate-400">vs</span> {c.symbol}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        playSfx('tick');
                        onSelect(c);
                      }}
                      className="flex min-h-[44px] min-w-[44px] items-center gap-1 rounded-lg border border-neon/40 bg-neon/10 px-2 py-1 text-xs text-neon hover:bg-neon/20"
                    >
                      <Link2 size={11} aria-hidden /> 切换到 {c.symbol}
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <MiniMouth phoneme={phoneme} />
                    <MiniMouth phoneme={c} />
                  </div>
                  <p className="mt-2 text-xs text-slate-400">
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
              <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">例词（点击朗读）</div>
              <div className="flex flex-wrap gap-2">
                {phoneme.exampleWords.map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => {
                      playSfx('tick');
                      speak(w);
                    }}
                    className="flex items-center gap-2 rounded-xl border border-neon/35 bg-neon/[0.08] px-4 py-2.5 font-display font-semibold text-white transition hover:border-neon/70 hover:shadow-glow-sm"
                  >
                    {w} <Volume2 size={13} className="text-neon" aria-hidden />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
                <Layers size={12} className="mr-1 inline" aria-hidden /> 常见拼写对应
              </div>
              <div className="flex flex-wrap gap-2">
                {phoneme.commonSpellings.map((s) => (
                  <span
                    key={s}
                    className="ipa min-h-[44px] min-w-[44px] rounded-lg border border-pink/45 bg-pink/10 px-3 py-1.5 text-sm font-semibold text-pink-lit"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {longShort && (
              <div className="rounded-2xl border border-violet/35 bg-violet/[0.08] p-4">
                <div className="mb-2 text-xs font-semibold text-violet-lit">长短音对比</div>
                <div className="flex flex-wrap items-center gap-4">
                  {[phoneme, longShort].map((p) => (
                    <div key={p.id} className="flex items-center gap-2">
                      <span className="ipa text-xl font-bold text-white">{p.symbol}</span>
                      <span className="text-xs text-slate-400">{p.exampleWords[0]}</span>
                      <SpeakButton text={p.ttsWord ?? p.exampleWords[0]} phonemeId={p.id} label={`播放 ${p.symbol} 发音`} size="sm" className="min-h-[44px] min-w-[44px]" />
                      <SpeakButton text={p.ttsWord ?? p.exampleWords[0]} phonemeId={p.id} slow label={`慢速播放 ${p.symbol}`} size="sm" className="min-h-[44px] min-w-[44px]" />
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-xs text-slate-400">{longShort.hintCN}</p>
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
      {/* 分步播放器 */}
      <section className="glass p-4 md:p-6" aria-live="polite">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="ipa text-3xl font-bold text-white">{phoneme.symbol}</span>
              <span className="rounded-md border border-neon/40 bg-neon/10 px-2 py-0.5 text-xs text-neon">
                {STEP_TITLES[index]}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">{phoneme.hintCN}</p>
          </div>
          <div className="flex items-center gap-2">
            <SpeakButton text={phoneme.ttsWord ?? phoneme.exampleWords[0]} phonemeId={phoneme.id} label={`播放 ${phoneme.symbol} 发音`} className="min-h-[44px] min-w-[44px]" />
            <SpeakButton text={phoneme.ttsWord ?? phoneme.exampleWords[0]} phonemeId={phoneme.id} slow label={`慢速播放 ${phoneme.symbol}`} className="min-h-[44px] min-w-[44px]" />
            <button
              type="button"
              onClick={() => {
                playSfx('correct');
                markLearned(phoneme.id);
              }}
              className="flex min-h-[44px] items-center gap-1 rounded-xl border border-success/45 bg-success/12 px-3 py-2 text-xs text-success transition hover:bg-success/20"
            >
              <CheckCircle2 size={13} aria-hidden /> 标记已学
            </button>
          </div>
        </div>

        <div key={`${phoneme.id}-${index}-${replay}`}>{panel()}</div>

        <div className="mt-4">
          <StepControls
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

      {/* 要点速查 */}
      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <InfoCard title="口型" text={phoneme.mouthShape} tone="#00E5FF" />
        <InfoCard title="舌位" text={phoneme.tonguePosition} tone="#FF4D9D" />
        <InfoCard title="气流" text={phoneme.airflow} tone="#A98BFF" />
        <div className="rounded-2xl border border-warn/30 bg-warn/[0.06] p-4">
          <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-warn">
            <TriangleAlert size={13} aria-hidden /> 中文母语者易犯错误
          </div>
          <ul className="flex flex-col gap-1.5 text-xs leading-relaxed text-slate-300">
            {phoneme.commonMistakes.map((m, i) => (
              <li key={i}>· {m}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* 拼写对应 + 对比跳转 */}
      <section className="grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-slate-400">
            <Ear size={12} aria-hidden /> 常见拼写
          </div>
          <div className="flex flex-wrap gap-2">
            {phoneme.commonSpellings.map((s) => (
              <span key={s} className="ipa rounded-lg border border-pink/45 bg-pink/10 px-3 py-1.5 text-sm text-pink-lit">
                {s}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-slate-400">
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
                  className="ipa min-h-[44px] min-w-[44px] rounded-lg border border-neon/35 bg-neon/[0.08] px-3 py-1.5 text-sm text-neon transition hover:border-neon/70"
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

function InfoCard({ title, text, tone }: { title: string; text: string; tone: string }) {
  return (
    <div className="rounded-2xl border p-4" style={{ borderColor: `${tone}44`, background: `${tone}0F` }}>
      <div className="mb-1.5 text-xs font-semibold" style={{ color: tone }}>
        {title}
      </div>
      <p className="text-xs leading-relaxed text-slate-300">{text}</p>
    </div>
  );
}

function MiniMouth({ phoneme }: { phoneme: Phoneme }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10">
      <div className="px-2 pt-1 text-center text-xs font-bold text-slate-400">{phoneme.symbol}</div>
      <MouthSideView geo={phoneme.geo} voiced={phoneme.voiced} showFront={false} />
    </div>
  );
}
