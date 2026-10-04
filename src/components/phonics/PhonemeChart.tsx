import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import type { Phoneme } from '@/types';
import { phonemes, phonemeGroups } from '@/data/phonemes';
import { playSfx } from '@/hooks/useSfx';
import { useMotionTier } from '@/hooks/useMotionTier';
import { useSpeech } from '@/hooks/useSpeech';

type Filter = 'all' | 'vowel' | 'consonant' | 'voiceless' | 'voiced';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: '全部 48' },
  { key: 'vowel', label: '元音 20' },
  { key: 'consonant', label: '辅音 28' },
  { key: 'voiceless', label: '清音' },
  { key: 'voiced', label: '浊音' },
];

/** 48 音标图表：分组、筛选、点击选中 */
export default function PhonemeChart({
  selected,
  onSelect,
  learned = [],
}: {
  selected: string;
  onSelect: (p: Phoneme) => void;
  learned?: string[];
}) {
  const [filter, setFilter] = useState<Filter>('all');
  const tier = useMotionTier();
  const { speak } = useSpeech();

  const visible = useMemo(() => {
    if (filter === 'all') return phonemes;
    if (filter === 'vowel') return phonemes.filter((p) => p.type !== 'consonant');
    if (filter === 'consonant') return phonemes.filter((p) => p.type === 'consonant');
    if (filter === 'voiced') return phonemes.filter((p) => p.voiced);
    return phonemes.filter((p) => !p.voiced);
  }, [filter]);

  const groups = phonemeGroups
    .map((g) => ({ ...g, items: g.ids.map((id) => phonemes.find((p) => p.id === id)!).filter(Boolean) }))
    .map((g) => ({ ...g, items: g.items.filter((p) => visible.includes(p)) }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2" role="group" aria-label="音标筛选">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => {
              playSfx('click');
              setFilter(f.key);
            }}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-300 ${
              filter === f.key
                ? 'border-neon bg-neon/18 text-neon shadow-[0_0_16px_rgba(0,229,255,0.3)]'
                : 'border-white/14 bg-white/5 text-slate-300 hover:border-neon/45'
            }`}
            aria-pressed={filter === f.key}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {groups.map((g) => (
          <div key={g.key}>
            <div className="mb-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-500">{g.label}</div>
            <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-6 md:grid-cols-7">
              {g.items.map((p, i) => {
                const active = p.id === selected;
                const done = learned.includes(p.id);
                return (
                  <motion.button
                    key={p.id}
                    type="button"
                    initial={tier === 'off' ? false : { opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: Math.min(0.4, i * 0.02), duration: 0.3 }}
                    onClick={() => {
                      playSfx('tick');
                      speak(p.ttsWord ?? p.exampleWords[0]);
                      onSelect(p);
                    }}
                    whileHover={{ y: -3, scale: 1.04 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative flex flex-col items-center justify-center gap-0.5 rounded-xl border py-2.5 transition-all duration-300 ${
                      active
                        ? 'border-neon bg-neon/16 text-neon shadow-[0_0_18px_rgba(0,229,255,0.4)]'
                        : 'border-white/12 bg-white/[0.05] text-slate-200 hover:border-neon/50'
                    }`}
                    aria-label={`选择音标 ${p.symbol}，例词 ${p.exampleWords[0]}`}
                    aria-pressed={active}
                  >
                    <span className="ipa text-[15px] font-semibold">{p.symbol}</span>
                    <span className="text-[10px] text-slate-400">{p.exampleWords[0]}</span>
                    {done && (
                      <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-success shadow-[0_0_6px_#00E676]" aria-label="已学" />
                    )}
                    {!p.voiced && (
                      <span className="absolute left-1 top-1 h-1.5 w-1.5 rounded-full bg-warn/80" title="清音" aria-label="清音" />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-warn" /> 清音（声带不振动）
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-success" /> 已学过
        </span>
        <span>点击音标：立即朗读例词并进入教学</span>
      </div>
    </div>
  );
}
