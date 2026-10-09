import { useState } from 'react';
import { Volume2, VolumeX, Gauge, Sparkles, Accessibility, RotateCcw, ShieldCheck, Monitor, Check, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettings, resolveMotionTier, applyMotionTier } from '@/store/settingsStore';
import { useProgress } from '@/store/progressStore';
import { useReview } from '@/store/reviewStore';
import { useSpeech, speechSupported } from '@/hooks/useSpeech';
import { useReduced, useIsMobile } from '@/hooks/useMotionTier';
import { EduButton, EduChip } from '@/components/edu';
import { playSfx } from '@/hooks/useSfx';

/** 选项卡通用外壳（面板 + 发丝线；选中 = 墨描边 + 勾形，从不只靠颜色） */
const optionCard = (on: boolean) =>
  `hinge border p-4 text-left ${on ? 'border-ink bg-under' : 'border-rule bg-leaf hover:border-ink'}`;

/** 设置页 */
export default function Settings() {
  const s = useSettings();
  const progress = useProgress();
  const review = useReview();
  const { speak } = useSpeech();
  const reduced = useReduced();
  const isMobile = useIsMobile();
  const [confirmReset, setConfirmReset] = useState(false);

  const accentOptions: { key: 'uk' | 'us'; label: string; sample: string }[] = [
    { key: 'uk', label: '英式发音', sample: 'photograph /ˈfəʊtəɡrɑːf/' },
    { key: 'us', label: '美式发音', sample: 'photograph /ˈfoʊtəɡræf/' },
  ];

  const motionOptions: { key: 'auto' | 'full' | 'light' | 'off'; label: string; desc: string }[] = [
    { key: 'auto', label: '自动', desc: '跟随系统“减弱动态效果”设置' },
    { key: 'full', label: '完整', desc: '粒子、3D、时间线动画全部开启' },
    { key: 'light', label: '轻量', desc: '保留过渡，粒子与重动画降频（省电/流畅）' },
    { key: 'off', label: '关闭', desc: '仅保留颜色与状态反馈，零动画' },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* 路径行（面包屑）+ 单一 h1 + 一句说明；推进引导统一交给 next-step-bar */}
      <header className="flex flex-col gap-3 border-b border-rule pb-5">
        <nav aria-label="面包屑" className="flex flex-wrap items-center gap-1.5 text-xs text-ink2">
          <span>
            <Link to="/methods" className="inline-flex min-h-[44px] items-center transition-colors hover:text-ink">
              课程总目
            </Link>
          </span>
          <span aria-hidden className="text-ink2/60">
            <ChevronRight size={11} />
          </span>
          <span aria-current="page" className="font-semibold text-ink">
            设置
          </span>
        </nav>
        <div>
          <h1 className="font-display text-[26px] font-extrabold leading-tight text-ink md:text-[32px]">设置</h1>
          <p className="mt-2 max-w-[68ch] text-[15px] leading-[1.8] text-ink2">
            发音口音、动画强度、音效与语速都可调。本站零数据存储，这些偏好只存在于当前会话。
          </p>
        </div>
      </header>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* 口音 */}
        <section className=" border border-rule bg-leaf p-5">
          <div className="mb-1 flex items-center gap-2 font-display text-sm font-bold text-ink">
            <Volume2 size={15} className="text-ink2" aria-hidden /> 发音口音
          </div>
          <p className="mb-3 text-xs text-ink2">
            影响所有朗读与听力题的发音风格（系统语音包支持范围内）。48 个音标本体使用内置离线音频（美式），不随口音切换。
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            {accentOptions.map((o) => (
              <button
                key={o.key}
                type="button"
                onClick={() => {
                  playSfx('click');
                  s.setAccent(o.key);
                }}
                className={optionCard(s.accent === o.key)}
                aria-pressed={s.accent === o.key}
              >
                <div className="flex items-center gap-1.5 font-display text-sm font-bold text-ink">
                  {o.label}
                  {s.accent === o.key && <Check size={15} strokeWidth={2.5} aria-hidden />}
                </div>
                <div className="machine mt-1 text-xs text-ink2">{o.sample}</div>
              </button>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <EduButton
              variant="default"
              size="sm"
              onClick={() => speak(s.accent === 'uk' ? 'The early bird catches the worm' : 'Practice makes perfect')}
            >
              试听
            </EduButton>
            {!speechSupported() && <span className="text-xs text-errata-deep">当前浏览器不支持语音合成</span>}
          </div>
        </section>

        {/* 语速 */}
        <section className=" border border-rule bg-leaf p-5">
          <div className="mb-1 flex items-center gap-2 font-display text-sm font-bold text-ink">
            <Gauge size={15} className="text-ink2" aria-hidden /> 朗读语速
          </div>
          <p className="mb-4 text-xs text-ink2">慢速用于听清结构（拼写/音标题），常速用于自然语流。</p>

          <label className="mb-4 block">
            <div className="mb-1.5 flex items-baseline justify-between text-xs">
              <span className="text-ink">常速</span>
              <span className="machine text-ink tabular-nums">×{s.ttsRate.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min={0.6}
              max={1.3}
              step={0.05}
              value={s.ttsRate}
              onChange={(e) => s.setTtsRate(Number(e.target.value))}
              onMouseUp={() => speak('speed test', { slow: false })}
              className="w-full"
              style={{
                background: `linear-gradient(to right, var(--ink) ${((s.ttsRate - 0.6) / 0.7) * 100}%, var(--rule) ${((s.ttsRate - 0.6) / 0.7) * 100}%)`,
              }}
              aria-label="常速语速"
            />
          </label>

          <label className="block">
            <div className="mb-1.5 flex items-baseline justify-between text-xs">
              <span className="text-ink">慢速</span>
              <span className="machine text-ink tabular-nums">×{s.ttsSlowRate.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min={0.3}
              max={0.9}
              step={0.05}
              value={s.ttsSlowRate}
              onChange={(e) => s.setTtsSlowRate(Number(e.target.value))}
              onMouseUp={() => speak('slow test', { slow: true })}
              className="w-full"
              style={{
                background: `linear-gradient(to right, var(--ink) ${((s.ttsSlowRate - 0.3) / 0.6) * 100}%, var(--rule) ${((s.ttsSlowRate - 0.3) / 0.6) * 100}%)`,
              }}
              aria-label="慢速语速"
            />
          </label>
        </section>

        {/* 动画 */}
        <section className=" border border-rule bg-leaf p-5">
          <div className="mb-1 flex items-center gap-2 font-display text-sm font-bold text-ink">
            <Accessibility size={15} className="text-ink2" aria-hidden /> 动画强度
          </div>
          <p className="mb-3 text-xs text-ink2">
            系统检测 · {reduced ? '已开启“减弱动态效果”' : '未开启减弱动态效果'} · {isMobile ? '移动端（粒子自动降密度）' : '桌面端'}
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            {motionOptions.map((o) => (
              <button
                key={o.key}
                type="button"
                onClick={() => {
                  playSfx('click');
                  s.setMotionTier(o.key);
                  applyMotionTier(o.key);
                }}
                className={`hinge border p-3.5 text-left ${
                  s.motionTier === o.key
                    ? 'border-ink bg-under'
                    : 'border-rule bg-leaf hover:border-ink'
                }`}
                aria-pressed={s.motionTier === o.key}
              >
                <div className="flex items-center gap-1.5 font-display text-sm font-bold text-ink">
                  {o.label}
                  {s.motionTier === o.key && <Check size={15} strokeWidth={2.5} aria-hidden />}
                </div>
                <div className="mt-0.5 text-xs leading-snug text-ink2">{o.desc}</div>
              </button>
            ))}
          </div>
          <div className="mt-3 text-xs text-ink2">
            当前生效档位为 <EduChip>{resolveMotionTier(s.motionTier)}</EduChip>，写入 &lt;html data-motion&gt;，CSS 动画同步降级
          </div>
        </section>

        {/* 音效与粒子 */}
        <section className=" border border-rule bg-leaf p-5">
          <div className="mb-3 flex items-center gap-2 font-display text-sm font-bold text-ink">
            <Sparkles size={15} className="text-ink2" aria-hidden /> 音效与背景
          </div>

          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-y border-rule py-3">
            <div>
              <div className="font-display text-sm font-bold text-ink">UI 音效</div>
              <div className="text-xs text-ink2">点击 / 答对 / 答错 / 完成的提示音</div>
            </div>
            <button
              type="button"
              onClick={() => {
                s.toggleSound();
                playSfx('click');
              }}
              className={`hinge flex h-11 w-16 items-center border px-1 transition-transform ${
                s.sound === 'on' ? 'justify-end border-ink bg-ink' : 'justify-start border-rule bg-under'
              }`}
              role="switch"
              aria-checked={s.sound === 'on'}
              aria-label="UI 音效开关"
            >
              <span
                className={`hinge flex h-7 w-7 items-center justify-center border ${
                  s.sound === 'on' ? 'border-ink bg-leaf text-ink' : 'border-rule bg-leaf text-ink2'
                }`}
              >
                {s.sound === 'on' ? <Volume2 size={14} /> : <VolumeX size={14} />}
              </span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-ink2">背景粒子密度</span>
            {(['auto', 'low', 'high'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => {
                  playSfx('tick');
                  s.setParticleDensity(p);
                }}
                className={`hinge inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-1 border px-3 py-1.5 ${
                  s.particleDensity === p
                    ? 'border-ink bg-under text-ink'
                    : 'border-rule text-ink hover:border-ink'
                }`}
                aria-pressed={s.particleDensity === p}
              >
                {s.particleDensity === p && <Check size={13} strokeWidth={2.5} aria-hidden />}
                {p === 'auto' ? '自动' : p === 'low' ? '低' : '高'}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-ink2">
            <Monitor size={11} className="mr-1 inline" aria-hidden />
            “自动”= 桌面 ≤120 粒子 / 移动 ≤40；关闭动画档位时粒子为 0。
          </p>
        </section>
      </div>

      {/* 数据与隐私：零存储声明 */}
      <section className=" border border-rule bg-leaf p-5" data-testid="zero-storage-note">
        <div className="mb-1 flex items-center gap-2 font-display text-sm font-bold text-ink">
          <ShieldCheck size={15} className="text-ink2" aria-hidden /> 数据与隐私，零存储
        </div>
        <p className="machine mb-2 text-ink">localStorage · sessionStorage · cookies 全部为空，刷新即归零</p>
        <p className="mb-4 text-xs text-ink2">
          本站不写任何浏览器存储，也不上传任何数据。下面这些数字、复习卡、错题与设置只活在当前标签页里，刷新或关闭即回到初始状态。
        </p>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className=" bg-under px-4 py-3 text-xs text-ink2">
            步骤 <b className="text-ink">{Object.values(progress.completedSteps).flat().length}</b> · 课程{' '}
            <b className="text-ink">{progress.completedMethods.length}</b> · 音标{' '}
            <b className="text-ink">{progress.phonemesLearned.length}</b>
          </div>
          <div className=" bg-under px-4 py-3 text-xs text-ink2">
            复习卡 <b className="text-ink">{review.cards.length}</b> · 错题{' '}
            <b className="text-errata-deep">{review.mistakes.length}</b> · 分析词{' '}
            <b className="text-ink">{progress.analyzedWords.length}</b>
          </div>
          <div className=" bg-under px-4 py-3 text-xs text-ink2">
            听写训练 <b className="text-ink">{progress.labDictationCount}</b> 次
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          {!confirmReset ? (
            <EduButton variant="default" size="sm" onClick={() => setConfirmReset(true)}>
              <RotateCcw size={14} aria-hidden /> 清空本次会话…
            </EduButton>
          ) : (
            <div className="flex flex-wrap items-center gap-2 border-y border-errata py-2">
              <span className="text-xs text-errata-deep">确认清空进度、复习卡与错题？不可撤销。</span>
              <button
                type="button"
                onClick={() => {
                  playSfx('wrong');
                  progress.resetAll();
                  review.reset();
                  setConfirmReset(false);
                }}
                className="hinge min-h-[44px] border border-errata bg-leaf px-3 text-xs font-semibold text-errata-deep transition-colors hover:bg-errata/[0.08]"
              >
                确认重置
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="hinge min-h-[44px] border border-ink/40 px-3 text-xs text-ink transition-colors hover:bg-under"
              >
                取消
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
