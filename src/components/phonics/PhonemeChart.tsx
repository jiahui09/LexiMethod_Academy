import { useMemo, useState } from 'react';
import { Check } from 'lucide-react';
import type { Phoneme } from '@/types';
import { phonemes, phonemeGroups } from '@/data/phonemes';
import { playSfx } from '@/hooks/useSfx';
import { useSpeech } from '@/hooks/useSpeech';
import { speakPhoneme } from '@/hooks/usePhonemeAudio';

type Filter = 'all' | 'vowel' | 'consonant' | 'voiceless' | 'voiced';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: '全部 48' },
  { key: 'vowel', label: '元音 20' },
  { key: 'consonant', label: '辅音 28' },
  { key: 'voiceless', label: '清音' },
  { key: 'voiced', label: '浊音' },
];

/**
 * 48 音标图表：分组、筛选、点击选中。
 * 纸面音标表——发丝线分隔的网格，不装盒不发光；
 * 选中 = 批注红描边 + 红字（当前），已学 = 结构蓝 ✓ 角标（颜色之外还有形状差）。
 */
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
            className={`min-h-[44px] rounded-[3px] border px-3.5 py-1.5 text-xs font-medium transition-colors duration-200 ${
              filter === f.key
                ? 'border-ink bg-under font-semibold text-ink'
                : 'border-rule bg-transparent text-ink2 hover:border-ink/50 hover:text-ink'
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
            <div className="mb-1.5 text-xs font-semibold tracking-wider text-ink2">{g.label}</div>
            {/* 发丝线网格：gap 由 rule 底色透出，像音标表的表格线 */}
            <div className="grid grid-cols-4 gap-px border border-rule bg-rule sm:grid-cols-6 md:grid-cols-7">
              {g.items.map((p, i) => {
                const active = p.id === selected;
                const done = learned.includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      playSfx('tick');
                      if (!speakPhoneme(p.id)) {
                        speak(p.ttsWord ?? p.exampleWords[0]);
                      }
                      onSelect(p);
                    }}
                    className={`relative flex min-h-[44px] flex-col items-center justify-center gap-0.5 px-1 py-2.5 transition-colors duration-200 ${
                      active
                        ? 'z-10 bg-under text-ink outline outline-2 -outline-offset-2 outline-ink'
                        : 'bg-leaf text-ink hover:bg-under'
                    }`}
                    aria-label={`选择音标 ${p.symbol}，例词 ${p.exampleWords[0]}`}
                    aria-pressed={active}
                  >
                    <span className="ipa text-[15px] font-semibold">{p.symbol}</span>
                    <span className="font-serif text-xs text-ink2">{p.exampleWords[0]}</span>
                    {done && (
                      <span
                        className="absolute right-0.5 top-0.5 flex h-3.5 w-3.5 items-center justify-center text-ink"
                        aria-label="已学"
                      >
                        <Check size={12} strokeWidth={3} aria-hidden />
                      </span>
                    )}
                    {!p.voiced && (
                      <span
                        className="absolute left-1 top-1 h-1.5 w-1.5 rounded-full border border-ink2 bg-transparent"
                        title="清音"
                        aria-label="清音"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-rule pt-3 text-xs text-ink2">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full border border-ink2" aria-hidden /> 清音（声带不振动）
        </span>
        <span className="flex items-center gap-1.5">
          <Check size={12} strokeWidth={3} className="text-ink" aria-hidden /> 已学过
        </span>
        <span>点击音标即播放该音标发音并进入教学</span>
      </div>
    </div>
  );
}
