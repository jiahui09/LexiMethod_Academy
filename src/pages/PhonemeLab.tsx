import { useState } from 'react';
import { NavLink, Navigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AudioLines, ArrowLeftRight, Headphones } from 'lucide-react';
import PhonemeChart from '@/components/phonics/PhonemeChart';
import PhonemeStage from '@/components/phonics/PhonemeStage';
import SpellingMapDrill from '@/components/phonics/SpellingMapDrill';
import DictationTrainer from '@/components/phonics/DictationTrainer';
import { phonemes } from '@/data/phonemes';
import { useProgress } from '@/store/progressStore';
import { useMotionTier } from '@/hooks/useMotionTier';
import PageIntro from '@/components/layout/PageIntro';

const TABS = [
  { key: 'phonemes', label: '音标发音教学', icon: AudioLines, desc: '48 个音标 · 口型 / 舌位 / 气流 / 声带动画' },
  { key: 'mapping', label: '音标拼写对应', icon: ArrowLeftRight, desc: '音标 ⇄ 字母组合 双向训练 + 规则动画' },
  { key: 'dictation', label: '听音拼写训练', icon: Headphones, desc: '先写音标，再写单词 · 逐字母反馈' },
];

/** 音标实验室：三个子模块 */
export default function PhonemeLab() {
  const { tab = 'phonemes' } = useParams();
  const tier = useMotionTier();
  const learned = useProgress((s) => s.phonemesLearned);
  const [selectedId, setSelectedId] = useState(phonemes[0]?.id ?? '');
  const [chartKey, setChartKey] = useState(0);

  if (!TABS.some((t) => t.key === tab)) return <Navigate to="/lab/phonemes" replace />;

  const selected = phonemes.find((p) => p.id === selectedId) ?? phonemes[0];

  return (
    <div className="flex flex-col gap-6">
      {/* 页头 */}
      <div>
        <PageIntro
          crumbs={[
            { label: '学习地图', to: '/' },
            { label: '音标实验室', to: '/lab/phonemes' },
            { label: TABS.find((t) => t.key === tab)?.label ?? '音标实验室' },
          ]}
          kicker="Phoneme Lab"
          title="音标实验室"
          desc="不是背 48 个符号，而是掌握 48 套“发音动作”。每个音标都有口型、舌位、气流、声带动画与分步讲解，配合听音拼写把声音和拼写绑在一起。"
          next={{ label: '去互动训练', to: '/practice' }}
        />
        <div className="flex flex-wrap gap-2">
          {TABS.map((t) => (
            <NavLink
              key={t.key}
              to={`/lab/${t.key}`}
              className={`group flex items-center gap-2.5 rounded-2xl border px-4 py-3 transition-all duration-300 ${
                tab === t.key
                  ? 'border-neon bg-neon/12 shadow-[0_0_22px_rgba(0,229,255,0.25)]'
                  : 'border-white/12 bg-white/[0.04] hover:border-neon/50'
              }`}
              aria-current={tab === t.key ? 'page' : undefined}
            >
              <t.icon size={17} className={tab === t.key ? 'text-neon' : 'text-slate-400'} aria-hidden />
              <span className="flex flex-col leading-tight">
                <span className={`text-sm font-semibold ${tab === t.key ? 'text-white' : 'text-slate-300'}`}>{t.label}</span>
                <span className="text-xs text-slate-400">{t.desc}</span>
              </span>
            </NavLink>
          ))}
        </div>
      </div>

      {tab === 'phonemes' && (
        <motion.div
          key={`phonemes-${chartKey}`}
          initial={tier === 'off' ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-6"
        >
          {/* 学习进度 */}
          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs text-slate-400">
            <span>
              已学音标：<b className="text-neon tabular-nums">{learned.length}</b> / 48
            </span>
            <div className="h-1.5 min-w-[120px] flex-1 overflow-hidden rounded-full bg-white/8">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-neon to-violet"
                animate={{ width: `${(learned.length / 48) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <span className="text-slate-400">选中音标 → 播放例词 → 走完 7 步讲解 → 标记已学</span>
          </div>

          <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
            <aside className="glass h-fit p-4 xl:sticky xl:top-24">
              <PhonemeChart
                selected={selectedId}
                learned={learned}
                onSelect={(p) => {
                  setSelectedId(p.id);
                  setChartKey((k) => k + 1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </aside>
            <section>
              <PhonemeStage key={selected.id} phoneme={selected} onSelect={(p) => setSelectedId(p.id)} />
            </section>
          </div>
        </motion.div>
      )}

      {tab === 'mapping' && <SpellingMapDrill key="mapping" />}
      {tab === 'dictation' && <DictationTrainer key="dictation" />}
    </div>
  );
}
