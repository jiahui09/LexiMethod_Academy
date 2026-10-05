import { useState } from 'react';
import { Link, NavLink, Navigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AudioLines, ArrowLeftRight, Headphones, ArrowRight } from 'lucide-react';
import PhonemeChart from '@/components/phonics/PhonemeChart';
import PhonemeStage from '@/components/phonics/PhonemeStage';
import SpellingMapDrill from '@/components/phonics/SpellingMapDrill';
import DictationTrainer from '@/components/phonics/DictationTrainer';
import { phonemes } from '@/data/phonemes';
import { useProgress } from '@/store/progressStore';
import { useMotionTier } from '@/hooks/useMotionTier';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { EduSheet, EduRunningHead, EduNote } from '@/components/edu';

const TABS = [
  { key: 'phonemes', label: '音标发音教学', icon: AudioLines, desc: '48 个音标 · 口型 / 舌位 / 气流 / 声带动画' },
  { key: 'mapping', label: '音标拼写对应', icon: ArrowLeftRight, desc: '音标 ⇄ 字母组合 双向训练 + 规则动画' },
  { key: 'dictation', label: '听音拼写训练', icon: Headphones, desc: '先写音标，再写单词 · 逐字母反馈' },
];

/**
 * 音标实验室：三个子模块（辞书版式）。
 * 书眉给面包屑与刻线进度；题名直接开场，不做眉标；
 * 三卷 tab 走发丝线下划线（选中 = 批注红下划线）；主栏读词条页，栏外是页边批注。
 */
export default function PhonemeLab() {
  const { tab = 'phonemes' } = useParams();
  const tier = useMotionTier();
  const learned = useProgress((s) => s.phonemesLearned);
  const [selectedId, setSelectedId] = useState(phonemes[0]?.id ?? '');
  const [chartKey, setChartKey] = useState(0);

  if (!TABS.some((t) => t.key === tab)) return <Navigate to="/lab/phonemes" replace />;

  const selected = phonemes.find((p) => p.id === selectedId) ?? phonemes[0];
  const donePct = Math.round((learned.length / 48) * 100);

  return (
    <EduSheet className="overflow-hidden">
      {/* 书眉：面包屑定位 + 右侧刻线进度（永远回答「我学了几个音标」） */}
      <EduRunningHead
        left={
          <Breadcrumbs
            tone="paper"
            items={[
              { label: '学习地图', to: '/' },
              { label: '音标实验室', to: '/lab/phonemes' },
              { label: TABS.find((t) => t.key === tab)?.label ?? '音标实验室' },
            ]}
          />
        }
        right={
          <>
            <span className="hidden items-center gap-2 sm:flex" aria-hidden>
              <span className="relative block h-[3px] w-24 bg-rule">
                <span
                  className="absolute left-0 top-0 h-[3px] bg-cobalt transition-[width] duration-500 ease-out"
                  style={{ width: `${donePct}%` }}
                />
              </span>
            </span>
            <span className="text-xs font-semibold tabular-nums text-paperink">已学 {learned.length} / 48</span>
            <Link
              to="/practice"
              data-testid="intro-next"
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-[3px] border border-transparent px-3 py-1.5 text-sm font-medium text-colophon transition-colors hover:border-rule hover:text-paperink"
            >
              下一步 · 去互动训练 <ArrowRight size={14} aria-hidden />
            </Link>
          </>
        }
      />

      <div className="px-5 py-6 md:px-8">
        {/* 卷首题名：标题自身压场 */}
        <header className="border-b border-rule pb-5">
          <h1 className="text-[26px] font-bold leading-tight text-paperink md:text-[32px]">音标实验室</h1>
          <p className="mt-2 max-w-[68ch] text-[15px] leading-[1.85] text-colophon">
            不是背 48 个符号，而是掌握 48 套“发音动作”。每个音标都有口型、舌位、气流、声带动画与分步讲解，配合听音拼写把声音和拼写绑在一起。
          </p>
        </header>

        {/* 三卷 tab：发丝线行，选中卷压一条批注红下划线 */}
        <div className="mt-5 flex flex-wrap items-stretch gap-x-6 gap-y-1 border-b border-rule" role="tablist" aria-label="音标实验室分卷">
          {TABS.map((t) => (
            <NavLink
              key={t.key}
              to={`/lab/${t.key}`}
              role="tab"
              aria-selected={tab === t.key}
              aria-current={tab === t.key ? 'page' : undefined}
              className={`relative flex min-h-[44px] items-center gap-2 px-1 pb-2.5 pt-1 text-sm transition-colors duration-200 ${
                tab === t.key ? 'font-semibold text-paperink' : 'text-colophon hover:text-paperink'
              }`}
            >
              <t.icon size={16} className={tab === t.key ? 'text-rubric' : 'text-colophon'} aria-hidden />
              <span className="flex flex-col leading-tight">
                <span>{t.label}</span>
                <span className="text-xs font-normal text-colophon">{t.desc}</span>
              </span>
              {tab === t.key && <span aria-hidden className="pointer-events-none absolute inset-x-0 -bottom-px h-[3px] bg-rubric" />}
            </NavLink>
          ))}
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_208px]">
          {/* 主导栏 */}
          <div className="flex min-w-0 flex-col gap-6">
            {tab === 'phonemes' && (
              <motion.div
                key={`phonemes-${chartKey}`}
                initial={tier === 'off' ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col gap-6"
              >
                {/* 学习进度：扁平刻线，不做渐变 */}
                <div className="flex flex-wrap items-center gap-3 border border-rule bg-bone2/50 px-4 py-3 text-xs text-colophon">
                  <span className="tabular-nums">
                    已学音标：<b className="font-semibold text-cobalt tabular-nums">{learned.length}</b> / 48
                  </span>
                  <div className="h-1.5 min-w-[120px] flex-1 overflow-hidden bg-rule">
                    <motion.div
                      className="h-full bg-cobalt"
                      animate={{ width: `${(learned.length / 48) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <span className="text-colophon xl:hidden">选中音标 → 播放例词 → 走完 7 步讲解 → 标记已学</span>
                </div>

                <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
                  <aside className="h-fit rounded-[4px] border border-rule bg-bone2/40 p-4 xl:sticky xl:top-24">
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
                  <section className="min-w-0">
                    <PhonemeStage key={selected.id} phoneme={selected} onSelect={(p) => setSelectedId(p.id)} />
                  </section>
                </div>
              </motion.div>
            )}

            {tab === 'mapping' && <SpellingMapDrill key="mapping" />}
            {tab === 'dictation' && <DictationTrainer key="dictation" />}
          </div>

          {/* 栏外 apparatus：页边批注（只用发丝线与正文分隔） */}
          <aside aria-label="页边批注" className="hidden border-l border-rule pl-5 xl:block">
            <div className="sticky top-24 flex flex-col gap-5">
              <EduNote label="读法">选中音标 → 播放例词 → 走完 7 步讲解 → 标记已学</EduNote>
              <EduNote label="分卷">
                <ul className="flex flex-col gap-1.5">
                  {TABS.map((t) => (
                    <li key={t.key}>
                      <b className="font-semibold text-paperink">{t.label}</b> {t.desc}
                    </li>
                  ))}
                </ul>
              </EduNote>
            </div>
          </aside>
        </div>
      </div>
    </EduSheet>
  );
}
