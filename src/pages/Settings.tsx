import { useState } from 'react';
import { Volume2, VolumeX, Gauge, Sparkles, Accessibility, RotateCcw, ShieldCheck, Monitor, Check, ChevronRight, HardDrive, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettings, resolveMotionTier, applyMotionTier } from '@/store/settingsStore';
import { useProgress } from '@/store/progressStore';
import { useReview } from '@/store/reviewStore';
import { clearLocalData } from '@/store/persistence';
import { useSpeech, speechSupported } from '@/hooks/useSpeech';
import { useReduced, useIsMobile } from '@/hooks/useMotionTier';
import { EduButton, EduChip } from '@/components/edu';
import { playSfx } from '@/hooks/useSfx';

/** 选项卡通用外壳（面板 + 发丝线；选中 = 墨描边 + 勾形，从不只靠颜色） */
const optionCard = (on: boolean) =>
  `hinge border-2 p-4 text-left ${on ? 'border-ink bg-under' : 'border-ink bg-leaf hover:border-ink'}`;

/** 设置页 */
export default function Settings() {
  const s = useSettings();
  const progress = useProgress();
  const review = useReview();
  const { speak } = useSpeech();
  const reduced = useReduced();
  const isMobile = useIsMobile();
  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

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
            发音口音、动画强度、音效与语速都可调。偏好本身只存在于当前会话；学习进度默认存在本机
            localStorage（开关与清除入口见下方「数据与隐私」），既不上传也不追踪。
          </p>
        </div>
      </header>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* 口音 */}
        <section className=" border-2 border-ink bg-leaf p-5">
          <div className="mb-1 flex items-center gap-2 font-display text-sm font-bold text-ink">
            <Volume2 size={15} className="text-ink2" aria-hidden /> 发音口音
          </div>
          <p className="mb-3 text-xs text-ink2">
            只影响浏览器语音合成（TTS）的朗读与听力题：系统语音包支持范围内才生效，不支持时回落浏览器默认嗓音。
            离线点读音不受影响——48 个音标本体与全部例词的内置 mp3 固定为美音，点开即播，不随口音开关切换。
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
        <section className=" border-2 border-ink bg-leaf p-5">
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
        <section className=" border-2 border-ink bg-leaf p-5">
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
                className={`hinge border-2 p-3.5 text-left ${
                  s.motionTier === o.key
                    ? 'border-ink bg-under'
                    : 'border-ink bg-leaf hover:border-ink'
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
        <section className=" border-2 border-ink bg-leaf p-5">
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
              className={`hinge flex h-11 w-16 items-center border-2 px-1 transition-transform ${
                s.sound === 'on' ? 'justify-end border-ink bg-ink' : 'justify-start border-rule bg-under'
              }`}
              role="switch"
              aria-checked={s.sound === 'on'}
              aria-label="UI 音效开关"
            >
              <span
                className={`hinge flex h-7 w-7 items-center justify-center border-2 ${
                  s.sound === 'on' ? 'border-ink bg-leaf text-ink' : 'border-ink bg-leaf text-ink2'
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
                className={`hinge inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-1 border-2 px-3 py-1.5 ${
                  s.particleDensity === p
                    ? 'border-ink bg-under text-ink'
                    : 'border-ink text-ink hover:border-ink'
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

      {/* 数据与隐私：本机存储开关 + 立即清除 */}
      <section className=" border-2 border-ink bg-leaf p-5" data-testid="zero-storage-note">
        <div className="mb-1 flex items-center gap-2 font-display text-sm font-bold text-ink">
          <ShieldCheck size={15} className="text-ink2" aria-hidden /> 数据与隐私 · 零上传存储
        </div>
        <p className="machine mb-2 text-ink">
          零存储服务器 · 只写本机 localStorage（leximethod.progress.v1 / leximethod.review.v1）· 零追踪
        </p>
        <p className="mb-4 text-xs text-ink2">
          本站没有账号、没有服务端数据库：零存储服务器、零上传，一切数据只留在你这台机器的浏览器里。
          进度持久化开关<strong className="text-ink">打开</strong>时，学习进度与错题写入本机
          localStorage（刷新、关页都在）；<strong className="text-ink">关闭</strong>则不保存——本会话还能用，
          刷新即归零，并删除已存数据。口音、动画、音效等偏好仍只活在当前会话。
        </p>

        {/* 持久化开关 */}
        <div className="mb-4 flex flex-wrap items-center gap-3 border-2 border-ink bg-under/60 px-4 py-3">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-ink">
            <HardDrive size={13} aria-hidden /> 进度存本机
          </span>
          <div className="flex gap-2" role="group" aria-label="进度持久化开关">
            {[
              { on: true, label: '开' },
              { on: false, label: '关' },
            ].map((o) => (
              <button
                key={o.label}
                type="button"
                onClick={() => {
                  playSfx('tick');
                  s.setPersistProgress(o.on);
                }}
                aria-pressed={s.persistProgress === o.on}
                className={`hinge min-h-[44px] min-w-[56px] border-2 px-3 text-xs font-semibold ${
                  s.persistProgress === o.on
                    ? 'border-ink bg-ink text-milk'
                    : 'border-ink bg-leaf text-ink2 hover:text-ink'
                }`}
              >
                {o.on ? '开 · 存本机' : '关 · 不保存'}
              </button>
            ))}
          </div>
          <span className="text-xs text-ink2" aria-live="polite">
            {s.persistProgress
              ? '进度存在本机，清除数据见这一栏。'
              : '当前未保存，刷新即归零。'}
          </span>
        </div>

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

        <p className="mt-3 text-xs text-ink2">
          复习卡与错题只是记录：站内不排复习、不弹提醒，也不会替你安排「明天再来」。想让它们按
          1/3/7/14/30 天重现，请抄进你自己的日历或 Anki。
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          {!confirmReset ? (
            <EduButton variant="default" size="sm" onClick={() => setConfirmReset(true)}>
              <RotateCcw size={14} aria-hidden /> 清空进度与错题…
            </EduButton>
          ) : (
            <div className="flex flex-wrap items-center gap-2 border-y-2 border-errata py-2">
              <span className="text-xs text-errata-deep">确认清空进度、复习卡与错题？不可撤销。</span>
              <button
                type="button"
                onClick={() => {
                  playSfx('wrong');
                  progress.resetAll();
                  review.reset();
                  setConfirmReset(false);
                }}
                className="hinge min-h-[44px] border-2 border-errata bg-leaf px-3 text-xs font-semibold text-errata-deep transition-colors hover:bg-errata/[0.08]"
              >
                确认重置
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="hinge min-h-[44px] border-2 border-ink px-3 text-xs text-ink transition-colors hover:bg-under"
              >
                取消
              </button>
            </div>
          )}
        </div>

        {/* 立即清除本机数据：连 localStorage 里的键一起删干净 */}
        <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-rule pt-4">
          {!confirmClear ? (
            <EduButton variant="ghost" size="sm" onClick={() => setConfirmClear(true)}>
              <Trash2 size={14} aria-hidden /> 立即清除本机数据…
            </EduButton>
          ) : (
            <div className="flex flex-wrap items-center gap-2 border-y-2 border-errata py-2">
              <span className="text-xs text-errata-deep">
                确认删除本机 localStorage 里的全部学习数据（进度、错题、开关本身）？不可撤销。
              </span>
              <button
                type="button"
                onClick={() => {
                  playSfx('wrong');
                  progress.resetAll();
                  review.reset();
                  clearLocalData();
                  setConfirmClear(false);
                }}
                className="hinge min-h-[44px] border-2 border-errata bg-leaf px-3 text-xs font-semibold text-errata-deep transition-colors hover:bg-errata/[0.08]"
              >
                确认清空本机数据
              </button>
              <button
                type="button"
                onClick={() => setConfirmClear(false)}
                className="hinge min-h-[44px] border-2 border-ink px-3 text-xs text-ink transition-colors hover:bg-under"
              >
                取消
              </button>
            </div>
          )}
          <span className="text-xs text-ink2">清除后本机不再有任何键，下次打开站点时开关回到默认「开」，进度从零开始记。</span>
        </div>
      </section>
    </div>
  );
}
