import { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Gauge, Sparkles, Accessibility, RotateCcw, ShieldCheck, Monitor, Check } from 'lucide-react';
import { useSettings, resolveMotionTier, applyMotionTier } from '@/store/settingsStore';
import { useProgress } from '@/store/progressStore';
import { useReview } from '@/store/reviewStore';
import { useSpeech, speechSupported } from '@/hooks/useSpeech';
import { useReduced, useIsMobile } from '@/hooks/useMotionTier';
import { EduButton, EduChip } from '@/components/edu';
import PageIntro from '@/components/layout/PageIntro';
import { playSfx } from '@/hooks/useSfx';

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
      <PageIntro
        crumbs={[{ label: '学习地图', to: '/' }, { label: '设置' }]}
        title="设置：让工具适应你"
        desc="发音口音、动画强度、音效与语速都可调；本站零数据存储——这些偏好只存在于当前会话。"
        next={{ label: '回到学习地图', to: '/' }}
      />

      <div className="grid gap-5 lg:grid-cols-2">
        {/* 口音 */}
        <section className="rounded-[3px] border border-rule bg-bone2/50 p-5">
          <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-paperink">
            <Volume2 size={15} className="text-rubric" aria-hidden /> 发音口音
          </div>
          <p className="mb-3 text-xs text-colophon">
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
                className={`rounded-[3px] border p-4 text-left transition-colors duration-200 ${
                  s.accent === o.key
                    ? 'border-rubric bg-rubric/[0.06]'
                    : 'border-rule bg-transparent hover:border-paperink'
                }`}
                aria-pressed={s.accent === o.key}
              >
                <div
                  className={`flex items-center gap-1.5 text-sm font-semibold ${
                    s.accent === o.key ? 'text-rubric' : 'text-paperink'
                  }`}
                >
                  {o.label}
                  {s.accent === o.key && <Check size={15} strokeWidth={2.5} aria-hidden />}
                </div>
                <div className="ipa mt-1 text-xs text-colophon">{o.sample}</div>
              </button>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <EduButton
              variant="default"
              size="sm"
              onClick={() => speak(s.accent === 'uk' ? 'The early bird catches the worm' : 'Practice makes perfect')}
            >
              试听
            </EduButton>
            {!speechSupported() && <span className="text-xs text-rubric">当前浏览器不支持语音合成</span>}
          </div>
        </section>

        {/* 语速 */}
        <section className="rounded-[3px] border border-rule bg-bone2/50 p-5">
          <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-paperink">
            <Gauge size={15} className="text-rubric" aria-hidden /> 朗读语速
          </div>
          <p className="mb-4 text-xs text-colophon">慢速用于听清结构（拼写/音标题），常速用于自然语流。</p>

          <label className="mb-4 block">
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="text-paperink">常速</span>
              <span className="ipa text-cobalt tabular-nums">×{s.ttsRate.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min={0.6}
              max={1.3}
              step={0.05}
              value={s.ttsRate}
              onChange={(e) => s.setTtsRate(Number(e.target.value))}
              onMouseUp={() => speak('speed test', { slow: false })}
              className="w-full accent-cobalt"
              aria-label="常速语速"
            />
          </label>

          <label className="block">
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="text-paperink">慢速</span>
              <span className="ipa text-rubric tabular-nums">×{s.ttsSlowRate.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min={0.3}
              max={0.9}
              step={0.05}
              value={s.ttsSlowRate}
              onChange={(e) => s.setTtsSlowRate(Number(e.target.value))}
              onMouseUp={() => speak('slow test', { slow: true })}
              className="w-full accent-cobalt"
              aria-label="慢速语速"
            />
          </label>
        </section>

        {/* 动画 */}
        <section className="rounded-[3px] border border-rule bg-bone2/50 p-5">
          <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-paperink">
            <Accessibility size={15} className="text-colophon" aria-hidden /> 动画强度
          </div>
          <p className="mb-3 text-xs text-colophon">
            系统检测：{reduced ? '已开启“减弱动态效果”' : '未开启减弱动态效果'} · {isMobile ? '移动端（粒子自动降密度）' : '桌面端'}
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
                className={`rounded-[3px] border p-3.5 text-left transition-colors duration-200 ${
                  s.motionTier === o.key
                    ? 'border-rubric bg-rubric/[0.06]'
                    : 'border-rule bg-transparent hover:border-paperink'
                }`}
                aria-pressed={s.motionTier === o.key}
              >
                <div
                  className={`flex items-center gap-1.5 text-sm font-semibold ${
                    s.motionTier === o.key ? 'text-rubric' : 'text-paperink'
                  }`}
                >
                  {o.label}
                  {s.motionTier === o.key && <Check size={15} strokeWidth={2.5} aria-hidden />}
                </div>
                <div className="mt-0.5 text-xs leading-snug text-colophon">{o.desc}</div>
              </button>
            ))}
          </div>
          <div className="mt-3 text-xs text-colophon">
            当前生效档位：<EduChip>{resolveMotionTier(s.motionTier)}</EduChip>（写入 &lt;html data-motion&gt;，CSS 动画同步降级）
          </div>
        </section>

        {/* 音效与粒子 */}
        <section className="rounded-[3px] border border-rule bg-bone2/50 p-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-paperink">
            <Sparkles size={15} className="text-colophon" aria-hidden /> 音效与背景
          </div>

          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-y border-rule py-3">
            <div>
              <div className="text-sm text-paperink">UI 音效</div>
              <div className="text-xs text-colophon">点击 / 答对 / 答错 / 完成的提示音</div>
            </div>
            <button
              type="button"
              onClick={() => {
                s.toggleSound();
                playSfx('click');
              }}
              className={`flex h-11 w-16 items-center rounded-[3px] border px-1 transition-colors ${
                s.sound === 'on' ? 'justify-end border-cobalt bg-cobalt/[0.08]' : 'justify-start border-rule bg-bone'
              }`}
              role="switch"
              aria-checked={s.sound === 'on'}
              aria-label="UI 音效开关"
            >
              <motion.span
                layout
                className="flex h-7 w-7 items-center justify-center rounded-[2px] border border-rule bg-bone2 text-paperink"
              >
                {s.sound === 'on' ? <Volume2 size={14} /> : <VolumeX size={14} />}
              </motion.span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-colophon">背景粒子密度：</span>
            {(['auto', 'low', 'high'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => {
                  playSfx('tick');
                  s.setParticleDensity(p);
                }}
                className={`inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-1 rounded-[3px] border px-3 py-1.5 transition-colors ${
                  s.particleDensity === p
                    ? 'border-rubric bg-rubric/[0.06] text-rubric'
                    : 'border-rule text-paperink hover:border-paperink'
                }`}
                aria-pressed={s.particleDensity === p}
              >
                {s.particleDensity === p && <Check size={13} strokeWidth={2.5} aria-hidden />}
                {p === 'auto' ? '自动' : p === 'low' ? '低' : '高'}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-colophon">
            <Monitor size={11} className="mr-1 inline" aria-hidden />
            “自动”= 桌面 ≤120 粒子 / 移动 ≤40；关闭动画档位时粒子为 0。
          </p>
        </section>
      </div>

      {/* 数据与隐私：零存储声明 */}
      <section className="rounded-[3px] border border-rule bg-bone2/50 p-5" data-testid="zero-storage-note">
        <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-paperink">
          <ShieldCheck size={15} className="text-cobalt" aria-hidden /> 数据与隐私：零存储
        </div>
        <p className="mb-4 text-xs text-colophon">
          本站不写任何浏览器存储（localStorage / sessionStorage 一律为空），也不上传任何数据：
          下面这些数字、复习卡、错题与设置只活在当前标签页里，刷新或关闭即回到初始状态。
          想继续上次的学习，到首页「我的进度」把手动进度调到你上次学到的位置，再点「继续学习」。
        </p>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-[3px] bg-bone px-4 py-3 text-xs text-colophon">
            步骤 <b className="text-paperink">{Object.values(progress.completedSteps).flat().length}</b> · 课程{' '}
            <b className="text-paperink">{progress.completedMethods.length}</b> · 音标{' '}
            <b className="text-paperink">{progress.phonemesLearned.length}</b>
          </div>
          <div className="rounded-[3px] bg-bone px-4 py-3 text-xs text-colophon">
            复习卡 <b className="text-paperink">{review.cards.length}</b> · 错题{' '}
            <b className="text-rubric">{review.mistakes.length}</b> · 实战词{' '}
            <b className="text-paperink">{progress.analyzedWords.length}</b>
          </div>
          <div className="rounded-[3px] bg-bone px-4 py-3 text-xs text-colophon">
            费曼讲解 <b className="text-cobalt">{progress.feynmanRecords.length}</b> 次 · 其中通过{' '}
            <b className="text-cobalt">{progress.feynmanRecords.filter((r) => r.passed).length}</b> 次
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          {!confirmReset ? (
            <EduButton variant="default" size="sm" onClick={() => setConfirmReset(true)}>
              <RotateCcw size={14} aria-hidden /> 清空本次会话…
            </EduButton>
          ) : (
            <div className="flex flex-wrap items-center gap-2 border-y border-rubric py-2">
              <span className="text-xs text-rubric">确认清空进度、复习卡、错题与讲解记录？不可撤销。</span>
              <button
                type="button"
                onClick={() => {
                  playSfx('wrong');
                  progress.resetAll();
                  review.reset();
                  setConfirmReset(false);
                }}
                className="min-h-[44px] rounded-[3px] border border-rubric bg-rubric px-3 text-xs font-semibold text-bone transition-colors hover:bg-[#9C2919]"
              >
                确认重置
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="min-h-[44px] rounded-[3px] border border-rule px-3 text-xs text-paperink transition-colors hover:bg-bone2"
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
