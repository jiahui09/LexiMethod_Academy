import { useState } from 'react';
import { Link, NavLink, Navigate, useParams } from 'react-router-dom';
import { ChevronRight, ArrowRight } from 'lucide-react';
import PhonemeChart from '@/components/phonics/PhonemeChart';
import PhonemeStage from '@/components/phonics/PhonemeStage';
import SpellingMapDrill from '@/components/phonics/SpellingMapDrill';
import DictationTrainer from '@/components/phonics/DictationTrainer';
import { phonemes } from '@/data/phonemes';
import { useProgress } from '@/store/progressStore';
import { EduRunningHead } from '@/components/edu';
import { STAGE_META, deepen, type StageId } from '@/lib/stages';

const TABS: { key: string; label: string; desc: string; stage: StageId }[] = [
  { key: 'phonemes', label: '音标发音教学', desc: '48 个音标 · 口型 / 舌位 / 气流 / 声带动画', stage: 'pathway' },
  { key: 'mapping', label: '音标拼写对应', desc: '音标 ⇄ 字母组合 双向训练 + 规则动画', stage: 'encode' },
  { key: 'dictation', label: '听音拼写训练', desc: '先写音标，再写单词 · 逐字母反馈', stage: 'retrieve' },
];

/** 面包屑（页眉右槽与顶栏共用的定位感；直接子 span 供方向感审计计数） */
function LabCrumbs({ tabLabel }: { tabLabel: string }) {
  return (
    <nav aria-label="面包屑" className="flex flex-wrap items-center gap-1.5 text-xs text-ink2">
      <span>
        <Link to="/methods" className="inline-flex min-h-[44px] items-center transition-colors hover:text-ink">
          课程总目
        </Link>
      </span>
      <span aria-hidden className="text-ink2/60">
        <ChevronRight size={11} />
      </span>
      <span>
        <NavLink to="/lab/phonemes" className="inline-flex min-h-[44px] items-center transition-colors hover:text-ink">
          音标实验室
        </NavLink>
      </span>
      <span aria-hidden className="text-ink2/60">
        <ChevronRight size={11} />
      </span>
      <span aria-current="page" className="font-semibold text-ink">
        {tabLabel}
      </span>
    </nav>
  );
}

/**
 * 音标实验室：三个分台，页顶白底章节带（瑞士报头）——段色只作 3px 细条点缀。
 * 章节带载面包屑与进度机器计数；带内分台链接以字重与墨条双重编码当前台；
 * 主栏为正文栏，栏外是页边批注。
 */
export default function PhonemeLab() {
  const { tab = 'phonemes' } = useParams();
  const learned = useProgress((s) => s.phonemesLearned);
  const [selectedId, setSelectedId] = useState(phonemes[0]?.id ?? '');

  if (!TABS.some((t) => t.key === tab)) return <Navigate to="/lab/phonemes" replace />;

  const current = TABS.find((t) => t.key === tab) ?? TABS[0];
  const stage = STAGE_META[current.stage];
  const selected = phonemes.find((p) => p.id === selectedId) ?? phonemes[0];
  const donePct = Math.round((learned.length / 48) * 100);

  return (
    <div className="overflow-hidden">
      {/* 章节带：面包屑定位 + 右侧机器计数（永远回答「我学了几个音标」） */}
      <EduRunningHead
        accent={stage.hue}
        left={<LabCrumbs tabLabel={current.label} />}
        right={
          <>
            <span className="hidden items-center gap-2 sm:flex" aria-hidden>
              <span className="relative block h-[3px] w-24 bg-rule">
                <span className="absolute left-0 top-0 h-[3px] bg-ink" style={{ width: `${donePct}%` }} />
              </span>
            </span>
            <span className="machine text-[12px] text-ink">已学 {learned.length} / 48</span>
            <Link
              to="/methods"
              data-testid="lab-next"
              className="inline-flex min-h-[44px] items-center gap-1.5 px-3 py-1.5 text-sm text-ink2 transition-colors hover:bg-under hover:text-ink"
            >
              下一步 · 回课程总目 <ArrowRight size={14} aria-hidden />
            </Link>
          </>
        }
      />

      {/* 页顶章节带：白纸地 ink 字，段色只留 3px 细条与分台刻线（点缀） */}
      <div className="bg-leaf" style={{ borderBottom: `3px solid ${deepen(stage.hue)}` }}>
        <div className="px-5 pb-4 pt-6 md:px-8">
          <div className="flex items-center gap-2.5">
            <span aria-hidden className="h-3.5 w-3.5" style={{ background: stage.hue }} />
            <p className="machine text-[12px] text-ink2">{stage.label}分台</p>
          </div>
          <h1 className="mt-1.5 font-display text-[26px] font-extrabold leading-tight text-ink md:text-[32px]">
            音标实验室
          </h1>
          <p className="mt-2 max-w-[68ch] text-[15px] leading-[1.8] text-ink2">
            48 个音标对应 48 套发音动作，口型、舌位、气流与声带动画逐一分解，再用听音拼写把声音和拼写绑在一起。
          </p>
          <nav aria-label="分台" className="mt-4 flex flex-wrap items-stretch gap-x-6 gap-y-1">
            {TABS.map((t) => {
              const on = t.key === tab;
              return (
                <NavLink
                  key={t.key}
                  to={`/lab/${t.key}`}
                  aria-current={on ? 'page' : undefined}
                  className={`hinge relative flex min-h-[44px] flex-col justify-center px-0.5 pb-2 pt-1 ${
                    on ? 'text-ink' : 'text-ink2 hover:text-ink'
                  }`}
                >
                  <span className={`font-display text-sm ${on ? 'font-extrabold' : 'font-bold'}`}>{t.label}</span>
                  <span className={`text-xs ${on ? 'font-semibold' : 'font-normal'}`}>{t.desc}</span>
                  {on && (
                    <span
                      aria-hidden
                      className="absolute inset-x-0 -bottom-[1px] h-[3px] bg-ink"
                    />
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="px-5 py-6 md:px-8">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_208px]">
          {/* 主导栏 */}
          <div className="flex min-w-0 flex-col gap-6">
            {tab === 'phonemes' && (
              <div className="flex flex-col gap-6">
                {/* 学习进度：扁平刻线 */}
                <div className="flex flex-wrap items-center gap-3 border-2 border-ink bg-leaf px-4 py-3 text-xs text-ink2">
                  <span className="tabular-nums">
                    已学音标：<b className="font-semibold text-ink tabular-nums">{learned.length}</b> / 48
                  </span>
                  <div className="h-1.5 min-w-[120px] flex-1 overflow-hidden bg-rule">
                    <div className="h-full bg-ink" style={{ width: `${(learned.length / 48) * 100}%` }} />
                  </div>
                  <span className="text-ink2 xl:hidden">选中音标 → 播放例词 → 走完 7 步讲解 → 标记已学</span>
                </div>

                <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
                  <aside className="h-fit border-2 border-ink bg-leaf p-4 xl:sticky xl:top-24">
                    <PhonemeChart
                      selected={selectedId}
                      learned={learned}
                      onSelect={(p) => {
                        setSelectedId(p.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    />
                  </aside>
                  <section className="min-w-0">
                    <PhonemeStage key={selected.id} phoneme={selected} onSelect={(p) => setSelectedId(p.id)} />
                  </section>
                </div>
              </div>
            )}

            {tab === 'mapping' && <SpellingMapDrill key="mapping" />}
            {tab === 'dictation' && <DictationTrainer key="dictation" />}
          </div>

          {/* 栏外页边批注：只用发丝线与正文分隔 */}
          <aside aria-label="页边批注" className="hidden border-l border-rule pl-5 xl:block">
            <div className="sticky top-24 flex flex-col gap-5">
              <div className="border-t border-rule pt-2.5 text-[13px] leading-[1.85] text-ink2">
                <b className="mr-1.5 font-semibold text-ink">读法</b>
                选中音标 → 播放例词 → 走完 7 步讲解 → 标记已学
              </div>
              <div className="border-t border-rule pt-2.5 text-[13px] leading-[1.85] text-ink2">
                <b className="mr-1.5 font-semibold text-ink">分台</b>
                <ul className="mt-1.5 flex flex-col gap-1.5">
                  {TABS.map((t) => (
                    <li key={t.key}>
                      <b className="font-semibold text-ink">{t.label}</b> {t.desc}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
