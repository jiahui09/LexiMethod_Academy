import { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Gauge, Sparkles, Accessibility, RotateCcw, ShieldCheck, Monitor } from 'lucide-react';
import { useSettings, resolveMotionTier, applyMotionTier } from '@/store/settingsStore';
import { useProgress } from '@/store/progressStore';
import { useReview } from '@/store/reviewStore';
import { useSpeech, speechSupported } from '@/hooks/useSpeech';
import { useReduced, useIsMobile } from '@/hooks/useMotionTier';
import { Chip } from '@/components/ui/Bits';
import PageIntro from '@/components/layout/PageIntro';
import NeonButton from '@/components/ui/NeonButton';
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
        kicker="Settings"
        title="设置：让工具适应你"
        desc="发音口音、动画强度、音效与语速都可调；本站零数据存储——这些偏好只存在于当前会话。"
        next={{ label: '回到学习地图', to: '/' }}
      />

      <div className="grid gap-5 lg:grid-cols-2">
        {/* 口音 */}
        <section className="glass p-5">
          <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-white">
            <Volume2 size={15} className="text-neon" aria-hidden /> 发音口音
          </div>
          <p className="mb-3 text-xs text-slate-400">影响所有朗读与听力题的发音风格（系统语音包支持范围内）。</p>
          <div className="grid grid-cols-2 gap-2.5">
            {accentOptions.map((o) => (
              <button
                key={o.key}
                type="button"
                onClick={() => {
                  playSfx('click');
                  s.setAccent(o.key);
                }}
                className={`rounded-2xl border p-4 text-left transition-all duration-300 ${
                  s.accent === o.key ? 'border-neon bg-neon/12 shadow-[0_0_18px_rgba(0,229,255,0.25)]' : 'border-white/12 bg-white/[0.04] hover:border-neon/45'
                }`}
                aria-pressed={s.accent === o.key}
              >
                <div className={`text-sm font-semibold ${s.accent === o.key ? 'text-neon' : 'text-slate-300'}`}>{o.label}</div>
                <div className="ipa mt-1 text-[11px] text-slate-500">{o.sample}</div>
              </button>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <NeonButton size="sm" variant="ghost" onClick={() => speak(s.accent === 'uk' ? 'The early bird catches the worm' : 'Practice makes perfect')}>
              试听
            </NeonButton>
            {!speechSupported() && <span className="text-[11px] text-warn">当前浏览器不支持语音合成</span>}
          </div>
        </section>

        {/* 语速 */}
        <section className="glass p-5">
          <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-white">
            <Gauge size={15} className="text-violet" aria-hidden /> 朗读语速
          </div>
          <p className="mb-4 text-xs text-slate-400">慢速用于听清结构（拼写/音标题），常速用于自然语流。</p>

          <label className="mb-4 block">
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="text-slate-300">常速</span>
              <span className="ipa text-neon tabular-nums">×{s.ttsRate.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min={0.6}
              max={1.3}
              step={0.05}
              value={s.ttsRate}
              onChange={(e) => s.setTtsRate(Number(e.target.value))}
              onMouseUp={() => speak('speed test', { slow: false })}
              className="w-full accent-[#00E5FF]"
              aria-label="常速语速"
            />
          </label>

          <label className="block">
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="text-slate-300">慢速</span>
              <span className="ipa text-warn tabular-nums">×{s.ttsSlowRate.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min={0.3}
              max={0.9}
              step={0.05}
              value={s.ttsSlowRate}
              onChange={(e) => s.setTtsSlowRate(Number(e.target.value))}
              onMouseUp={() => speak('slow test', { slow: true })}
              className="w-full accent-[#FFB300]"
              aria-label="慢速语速"
            />
          </label>
        </section>

        {/* 动画 */}
        <section className="glass p-5">
          <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-white">
            <Accessibility size={15} className="text-success" aria-hidden /> 动画强度
          </div>
          <p className="mb-3 text-xs text-slate-400">
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
                className={`rounded-2xl border p-3.5 text-left transition-all duration-300 ${
                  s.motionTier === o.key ? 'border-success bg-success/12' : 'border-white/12 bg-white/[0.04] hover:border-success/50'
                }`}
                aria-pressed={s.motionTier === o.key}
              >
                <div className={`text-sm font-semibold ${s.motionTier === o.key ? 'text-success' : 'text-slate-300'}`}>{o.label}</div>
                <div className="mt-0.5 text-[11px] leading-snug text-slate-500">{o.desc}</div>
              </button>
            ))}
          </div>
          <div className="mt-3 text-[11px] text-slate-500">
            当前生效档位：<Chip tone="green">{resolveMotionTier(s.motionTier)}</Chip>（写入 &lt;html data-motion&gt;，CSS 动画同步降级）
          </div>
        </section>

        {/* 音效与粒子 */}
        <section className="glass p-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
            <Sparkles size={15} className="text-pink" aria-hidden /> 音效与背景
          </div>

          <div className="mb-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
            <div>
              <div className="text-sm text-slate-200">UI 音效</div>
              <div className="text-[11px] text-slate-500">点击 / 答对 / 答错 / 完成的提示音</div>
            </div>
            <button
              type="button"
              onClick={() => {
                s.toggleSound();
                playSfx('click');
              }}
              className={`flex h-9 w-16 items-center rounded-full border px-1 transition-all ${
                s.sound === 'on' ? 'border-neon bg-neon/20 justify-end' : 'border-white/15 bg-white/5 justify-start'
              }`}
              role="switch"
              aria-checked={s.sound === 'on'}
              aria-label="UI 音效开关"
            >
              <motion.span layout className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#0B1020]">
                {s.sound === 'on' ? <Volume2 size={14} /> : <VolumeX size={14} />}
              </motion.span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400">背景粒子密度：</span>
            {(['auto', 'low', 'high'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => {
                  playSfx('tick');
                  s.setParticleDensity(p);
                }}
                className={`rounded-lg border px-3 py-1.5 transition ${
                  s.particleDensity === p ? 'border-pink bg-pink/15 text-pink' : 'border-white/12 text-slate-300 hover:border-pink/50'
                }`}
                aria-pressed={s.particleDensity === p}
              >
                {p === 'auto' ? '自动' : p === 'low' ? '低' : '高'}
              </button>
            ))}
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            <Monitor size={11} className="mr-1 inline" aria-hidden />
            “自动”= 桌面 ≤120 粒子 / 移动 ≤40；关闭动画档位时粒子为 0。
          </p>
        </section>
      </div>

      {/* 数据与隐私：零存储声明 */}
      <section className="glass p-5" data-testid="zero-storage-note">
        <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-white">
          <ShieldCheck size={15} className="text-neon" aria-hidden /> 数据与隐私：零存储
        </div>
        <p className="mb-4 text-xs text-slate-400">
          本站不写任何浏览器存储（localStorage / sessionStorage 一律为空），也不上传任何数据：
          下面这些数字、复习卡、错题与设置只活在当前标签页里，刷新或关闭即回到初始状态。
          想继续上次的学习，到首页「我的进度」把手动进度调到你上次学到的位置，再点「继续学习」。
        </p>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs text-slate-400">
            经验值 <b className="text-neon">{progress.xp}</b> · 步骤 <b className="text-white">{Object.values(progress.completedSteps).flat().length}</b> · 音标{' '}
            <b className="text-white">{progress.phonemesLearned.length}</b>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs text-slate-400">
            复习卡 <b className="text-white">{review.cards.length}</b> · 错题 <b className="text-warn">{review.mistakes.length}</b> · 实战词{' '}
            <b className="text-white">{progress.analyzedWords.length}</b>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs text-slate-400">
            成就 <b className="text-success">{progress.achievements.length}</b> · 连续{' '}
            <b className="text-warn">{progress.streakCurrent}</b> 天
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          {!confirmReset ? (
            <NeonButton size="sm" variant="ghost" onClick={() => setConfirmReset(true)}>
              <RotateCcw size={14} aria-hidden /> 清空本次会话…
            </NeonButton>
          ) : (
            <div className="flex flex-wrap items-center gap-2 rounded-xl border border-danger/45 bg-danger/10 px-3 py-2">
              <span className="text-xs text-danger">确认清空进度、复习卡、错题与成就？不可撤销。</span>
              <button
                type="button"
                onClick={() => {
                  playSfx('wrong');
                  progress.resetAll();
                  review.reset();
                  setConfirmReset(false);
                }}
                className="rounded-lg border border-danger bg-danger/20 px-3 py-1 text-xs font-semibold text-danger"
              >
                确认重置
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="rounded-lg border border-white/15 px-3 py-1 text-xs text-slate-300"
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
