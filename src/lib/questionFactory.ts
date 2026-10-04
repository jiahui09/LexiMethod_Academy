import type { Phoneme, Question, SpellingPattern, WordExample } from '@/types';

let counter = 0;
const uid = (prefix: string) => `${prefix}-${(counter += 1)}`;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** 音标 → 字母组合（选择题） */
export function phonemeToSpellingQ(p: Phoneme, all: Phoneme[]): Question {
  const distractors = shuffle(
    all.filter((x) => x.id !== p.id).flatMap((x) => x.commonSpellings),
  )
    .filter((s) => !p.commonSpellings.includes(s))
    .slice(0, 3);

  const choices = shuffle([
    { label: p.commonSpellings[0], correct: true },
    ...distractors.map((d) => ({ label: d, correct: false })),
  ]);

  return {
    id: uid('q-p2s'),
    type: 'phonemeChooseSpelling',
    prompt: `哪个字母组合最常读 ${p.symbol}？`,
    narration: '音标 → 拼写方向：看到读音就要能落笔。',
    choices,
    answer: p.commonSpellings[0],
    hint: `想想 ${p.exampleWords.slice(0, 2).join(' / ')} 是怎么拼的。`,
    explain: `${p.symbol} 的常见拼写：${p.commonSpellings.join('、')}；例词 ${p.exampleWords.slice(0, 3).join('、')}。${p.hintCN ?? ''}`,
    tags: ['拼写对应', p.id],
  };
}

/** 字母组合 → 音标（选择题） */
export function spellingToPhonemeQ(pat: SpellingPattern, all: SpellingPattern[]): Question {
  const distractors = shuffle(all.filter((x) => x.id !== pat.id).map((x) => x.phoneme)).slice(0, 3);
  const choices = shuffle([
    { label: pat.phoneme, correct: true },
    ...distractors.map((d) => ({ label: d, correct: false })),
  ]);
  return {
    id: uid('q-s2p'),
    type: 'spellingChoosePhoneme',
    prompt: `字母组合 ${pat.pattern} 通常怎么读？`,
    narration: '拼写 → 音标方向：看到词块就要能读出。',
    choices,
    answer: pat.phoneme,
    hint: `规则：${pat.rule.slice(0, 40)}…`,
    explain: `${pat.pattern} → ${pat.phoneme}；例词 ${pat.examples.slice(0, 3).join('、')}${
      pat.exceptions.length ? `；例外：${pat.exceptions.slice(0, 2).join('、')}` : ''
    }。${pat.rule}`,
    tags: ['拼写对应', pat.id],
  };
}

/** 听音写音标 */
export function listenWriteIpaQ(w: WordExample): Question {
  return {
    id: uid('q-ipa'),
    type: 'listenWritePhoneme',
    prompt: `听写音标：${w.word}`,
    narration: '先听音、写音标，再写单词 —— 声音先于拼写。',
    speak: w.word,
    answer: w.phoneticUK,
    hint: `这个词有 ${w.syllables.length} 个音节，重音在第 ${w.stressIndex + 1} 个。`,
    explain: `正确音标 ${w.phoneticUK}（美式 ${w.phoneticUS}）；音节 ${w.syllables.join('-')}，重读第 ${w.stressIndex + 1} 音节；释义：${w.meaningCN}。`,
    tags: ['听写', w.id],
  };
}

/** 听音写单词（逐字母反馈） */
export function listenWriteWordQ(w: WordExample): Question {
  return {
    id: uid('q-word'),
    type: 'listenWriteWord',
    prompt: `听音拼写：${w.phoneticUK}`,
    narration: '按音节拼写：边读边写，不要从字母表硬凑。',
    speak: w.word,
    answer: w.word,
    hint: `${w.syllables.length} 个音节：${w.syllables.map(() => '_').join('-')}；首字母是 ${w.word[0]}。`,
    explain: `${w.word} = ${w.syllables.join('-')}（重音 #${w.stressIndex}）→ ${w.phoneticUK}；${w.meaningCN}。`,
    tags: ['听写', w.id],
  };
}

/** 音节划分（拖拽） */
export function syllableQ(w: WordExample): Question {
  return {
    id: uid('q-syl'),
    type: 'syllableSplit',
    prompt: `划分音节：${w.word}`,
    narration: '找元音核心 → 分配辅音 → 拼成音节。',
    syllableUnits: w.syllables,
    answer: w.syllables.join('-'),
    hint: `元音核心数 = ${w.syllables.length}；${w.syllables.join(' / ')}`,
    explain: `${w.word} = ${w.syllables.join('-')}，重音在第 ${w.stressIndex + 1} 音节 → ${w.phoneticUK}`,
    tags: ['音节', w.id],
  };
}

/** 重音定位（点击） */
export function stressQ(w: WordExample): Question {
  return {
    id: uid('q-str'),
    type: 'stressPosition',
    prompt: `点击重读音节：${w.syllables.join('-')}`,
    narration: '后缀与词性决定重音位置。',
    speak: w.word,
    syllableUnits: w.syllables,
    answer: String(w.stressIndex),
    hint: `词性 ${w.partOfSpeech}；想想后缀与“名前动后”规则。`,
    explain: `${w.word} 重读第 ${w.stressIndex + 1} 音节（${w.syllables[w.stressIndex]}）→ ${w.phoneticUK}；${w.meaningCN}`,
    tags: ['重音', w.id],
  };
}

/** 语境选词 */
export function contextQ(w: WordExample, pool: WordExample[] = []): Question {
  const ex = w.examples[0] ?? { en: `I need to use the word "${w.word}" here.`, cn: w.meaningCN };
  const blanked = ex.en.replace(new RegExp(`\\b${w.word}\\b`, 'i'), '_____');
  const distractors = shuffle(pool.filter((x) => x.id !== w.id))
    .slice(0, 2)
    .map((x) => ({ label: x.word, correct: false, sub: x.meaningCN.slice(0, 10) }));
  return {
    id: uid('q-ctx'),
    type: 'contextChoice',
    prompt: `选词填空：${blanked}`,
    narration: '语境给出搭配与词性的双重线索。',
    choices: shuffle([{ label: w.word, correct: true }, ...distractors]),
    answer: w.word,
    hint: `搭配：${w.collocations[0] ?? '—'}`,
    explain: `${ex.en} → ${w.meaningCN}（${ex.cn}）`,
    tags: ['语境', w.id],
  };
}

export function shuffleArr<T>(arr: T[]): T[] {
  return shuffle(arr);
}
