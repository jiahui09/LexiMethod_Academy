/* 数据层深度验收（esbuild 打包后由 scripts/checkData.mjs 执行） */
import { phonemes, phonemeById, phonemeGroups, monophthongs, diphthongs, consonants } from '@/data/phonemes';
import { words, wordById, wordIds } from '@/data/words';
import { prefixes, suffixes, roots } from '@/data/affixes';
import { rules, rulesByType, ruleById } from '@/data/rules';
import { spellingPatterns } from '@/data/spellingPatterns';
import { methods, methodById } from '@/data/methods';
import { quizBanks } from '@/data/quizBanks';
import { feynmanTasks } from '@/data/feynman';
import { demoByMethod } from '@/components/course/demoConfig';
import { TYPE_LABELS, normChoice, normIpa, normWord, judgeAnswer } from '@/lib/answers';
import type { QuestionType } from '@/types';


/** 判断 /…/ 内的音素串能否被已知音标完整解析（如 /ʃn/ = ʃ + n） */
function isKnownPhoneme(field: string): boolean {
  const inner = field.replace(/^\/|\/$/g, '').trim();
  if (!inner) return false;
  if (phonemeById[inner]) return true;
  const ids = Object.keys(phonemeById).sort((a, b) => b.length - a.length);
  let rest = inner;
  while (rest) {
    const hit = ids.find((id) => rest.startsWith(id));
    if (!hit) return false;
    rest = rest.slice(hit.length);
  }
  return true;
}

const errors: string[] = [];
const err = (m: string) => errors.push(m);
let checks = 0;
const ok = (cond: boolean, m: string) => {
  checks += 1;
  if (!cond) err(m);
};

/* ---------- 1. 音标 ---------- */
ok(phonemes.length === 48, `音标数量 ${phonemes.length} != 48`);
ok(new Set(phonemes.map((p) => p.id)).size === 48, '音标 id 有重复');
ok(monophthongs.length === 12 && diphthongs.length === 8 && consonants.length === 28,
  `分组数量错误：单${monophthongs.length} 双${diphthongs.length} 辅${consonants.length}`);

for (const p of phonemes) {
  ok(p.symbol.startsWith('/') && p.symbol.endsWith('/'), `${p.symbol} symbol 未加斜杠`);
  ok(p.exampleWords.length >= 3, `${p.id} 例词不足3个`);
  ok(p.commonSpellings.length >= 1, `${p.id} 缺常见拼写`);
  ok(p.mouthShape.length >= 10 && p.tonguePosition.length >= 10 && p.airflow.length >= 10,
    `${p.id} 口型/舌位/气流描述过短`);
  ok(p.commonMistakes.length >= 1, `${p.id} 缺易错点`);
  ok(p.contrastWith.length >= 1, `${p.id} 缺对比音`);
  ok(!!p.hintCN && p.hintCN.length >= 8, `${p.id} 缺 hintCN`);
  ok(!!p.ttsWord && !!p.ipaExample, `${p.id} 缺 ttsWord/ipaExample`);
  for (const c of p.contrastWith) ok(!!phonemeById[c], `${p.id} 对比音 ${c} 不存在`);
  if (p.longShortPair) ok(!!phonemeById[p.longShortPair], `${p.id} 长短配对 ${p.longShortPair} 不存在`);
  ok(p.minimalPairs.length >= 1, `${p.id} 缺最小对立对`);
  for (const mp of p.minimalPairs) {
    ok(!!mp.a && !!mp.b && !!mp.meaningA && !!mp.meaningB, `${p.id} 对立对字段缺失`);
  }
  const g = p.geo;
  for (const [k, v] of Object.entries({ tongueHigh: g.tongueHigh, tongueFront: g.tongueFront, lipRound: g.lipRound, jawOpen: g.jawOpen })) {
    ok(typeof v === 'number' && v >= 0 && v <= 1, `${p.id}.geo.${k}=${v} 越界 0~1`);
  }
  if (g.closure !== undefined) ok(g.closure >= 0 && g.closure <= 1, `${p.id}.geo.closure 越界`);
}
// 长短配对双向
for (const p of phonemes) {
  if (p.longShortPair) {
    const back = phonemeById[p.longShortPair]?.longShortPair;
    ok(back === p.id, `${p.id} 的配对 ${p.longShortPair} 未回指`);
  }
}
// 分组并集 == 48
const grouped = new Set(phonemeGroups.flatMap((g) => g.ids));
ok(grouped.size === 48, `分组并集 ${grouped.size} != 48（有音标未入组或组外 id）`);
for (const g of phonemeGroups) {
  ok(g.ids.length > 0 && !!g.key && !!g.label, `分组 ${g.key} 字段缺失`);
  for (const id of g.ids) ok(!!phonemeById[id], `分组 ${g.key} 含未知 id ${id}`);
}
// 每个音标应至少出现在一个分组
for (const p of phonemes) ok(grouped.has(p.id), `${p.id} 未出现在任何分组`);

/* ---------- 2. 单词 ---------- */
ok(words.length === 30, `words 数量 ${words.length} != 30`);
ok(new Set(words.map((w) => w.id)).size === 30, 'word id 有重复');
ok(wordIds.length === 30 && wordIds.every((id) => wordById[id]), 'wordIds/wordById 不一致');
const COLOR_OK = { prefix: '#00E5FF', root: '#7C4DFF', suffix: '#FF4D9D' } as const;
for (const w of words) {
  ok(w.id === w.word.toLowerCase(), `${w.word} id 与单词不一致`);
  ok(w.syllables.join('').toLowerCase() === w.word.toLowerCase(), `${w.word} 音节拼接 != 单词`);
  ok(w.stressIndex >= 0 && w.stressIndex < w.syllables.length, `${w.word} stressIndex 越界`);
  ok(/\/[^/]*ˈ[^/]+\//.test(w.phoneticUK), `${w.phoneticUK} 缺主重音`);
  ok(/\/[^/]+\//.test(w.phoneticUS), `${w.phoneticUS} 格式错误`);
  ok(w.examples.length >= 1, `${w.word} 缺例句`);
  const re = new RegExp(`\\b${w.word}\\b`, 'i');
  ok(w.examples.every((e) => re.test(e.en) && e.cn.length > 0), `${w.word} 例句未含单词或缺中文`);
  ok(w.collocations.length >= 2, `${w.word} 搭配不足`);
  ok(w.wordFamily.length >= 3, `${w.word} 词族不足`);
  ok(w.roots.length >= 1, `${w.word} 缺词根标注`);
  for (const r of w.roots) ok(r.color === COLOR_OK[r.type], `${w.word} 词根 ${r.text} 颜色与类型不匹配`);
  ok(w.tags.length >= 1, `${w.word} 缺标签`);
}
// 跨模块引用：课程/题库引用的关键词必须存在
for (const id of ['transportation', 'incomprehensible', 'construction', 'decision', 'visible', 'uncomfortable', 'photograph', 'geography', 'biology']) {
  ok(!!wordById[id], `关键单词 ${id} 缺失`);
}

/* ---------- 3. 词缀 ---------- */
ok(prefixes.length >= 24, `前缀 ${prefixes.length} < 24`);
ok(suffixes.length >= 24, `后缀 ${suffixes.length} < 24`);
ok(roots.length >= 30, `词根 ${roots.length} < 30`);
const allAffix = [...prefixes, ...suffixes];
ok(new Set(allAffix.map((a) => a.text)).size === allAffix.length, '词缀 text 有重复');
ok(new Set(roots.map((r) => r.text)).size === roots.length, '词根 text 有重复');
for (const a of allAffix) ok(a.meaning.length > 0 && a.examples && a.examples.length >= 3, `词缀 ${a.text} 缺含义/例词`);
for (const r of roots) ok(r.meaning.length > 0 && r.examples && r.examples.length >= 3, `词根 ${r.text} 缺含义/例词`);

/* ---------- 4. 规则与拼写模式 ---------- */
ok(rules.length >= 20, `规则 ${rules.length} < 20`);
ok(new Set(rules.map((r) => r.id)).size === rules.length, '规则 id 重复');
for (const t of ['phonics', 'prefix', 'suffix', 'root', 'stress'] as const) {
  ok((rulesByType[t] ?? []).length > 0, `rulesByType.${t} 为空`);
}
for (const r of rules) {
  ok(r.explanation.length >= 40, `${r.id} explanation 过短`);
  ok(r.examples.length >= 2, `${r.id} 例句不足`);
  ok(!!ruleById[r.id], `${r.id} 不在 ruleById`);
}
ok(spellingPatterns.length >= 18, `拼写模式 ${spellingPatterns.length} < 18`);
for (const sp of spellingPatterns) {
  ok(isKnownPhoneme(sp.phoneme), `${sp.id} 的 phoneme ${sp.phoneme} 无法解析为已知音素`);
  ok(sp.examples.length >= 3, `${sp.id} 例词不足`);
  ok(sp.exceptions.length <= 4, `${sp.id} 例外过多`);
  ok(sp.rule.length >= 8, `${sp.id} 规则过短`);
}

/* ---------- 5. 课程 ---------- */
ok(methods.length === 8, `方法数量 ${methods.length} != 8`);
const ANIMATIONS = new Set([
  'entrance', 'principle', 'rule', 'mapping', 'practice', 'application', 'pitfalls', 'mastery',
  'roots', 'memoryChain', 'context', 'srsTimeline', 'outputFunnel', 'metacog', 'generic',
]);
for (const m of methods) {
  ok(methodById[m.id] === m, `${m.id} 不在 methodById`);
  ok(m.principles.length >= 3, `${m.id} principles < 3`);
  ok(m.pitfalls.length >= 5, `${m.id} pitfalls < 5`);
  ok(m.masteryCriteria.length >= 5, `${m.id} masteryCriteria < 5`);
  ok(m.steps.length === 8, `${m.id} steps ${m.steps.length} != 8`);
  m.steps.forEach((s, i) => {
    ok(ANIMATIONS.has(s.animation), `${m.id} step${i} animation=${s.animation} 不被 StepHost 支持`);
    ok(s.title.length > 0 && s.content.length > 20, `${m.id} step${i} 文案缺失`);
  });
}
// 旗舰课顺序
const flag = methodById['phonics-syllables'];
const wantOrder = ['entrance', 'principle', 'rule', 'mapping', 'practice', 'application', 'pitfalls', 'mastery'];
flag.steps.forEach((s, i) => ok(s.animation === wantOrder[i], `旗舰 step${i} 应为 ${wantOrder[i]}，实际 ${s.animation}`));
// demo 引用
for (const [mid, d] of Object.entries(demoByMethod)) {
  if (d.applicationWord) ok(!!wordById[d.applicationWord], `${mid} applicationWord ${d.applicationWord} 不在 words`);
  if (d.practice?.kind === 'syllable') ok(!!wordById[(d.practice as { word?: string }).word],
    `${mid} practice 单词不在 words`);
}

/* ---------- 6. 题库 ---------- */
const TYPES = Object.keys(TYPE_LABELS) as QuestionType[];
ok(TYPES.length === 11, `TYPE_LABELS ${TYPES.length} != 11`);
for (const t of TYPES) {
  const bank = quizBanks[t] ?? [];
  ok(bank.length >= 8, `quizBanks.${t} ${bank.length} < 8`);
}
const allQ = TYPES.flatMap((t) => quizBanks[t] ?? []);
ok(new Set(allQ.map((q) => q.id)).size === allQ.length, '题 id 重复');
for (const q of allQ) {
  ok(q.prompt.length > 0 && q.narration.length > 0 && q.hint.length > 0 && q.explain.length > 0, `${q.id} 文案缺失`);
  ok(q.type in TYPE_LABELS, `${q.id} type 非法`);
  if (q.choices && q.choices.length >= 2) {
    ok(q.choices.filter((c) => c.correct).length === 1, `${q.id} 正确项不唯一`);
    const labels = q.choices.map((c) => normChoice(c.label));
    ok(new Set(labels).size === labels.length, `${q.id} 选项标签重复`);
    ok(labels.includes(normChoice(q.answer)) || normWord(q.answer) === normWord(q.answer) && q.choices.some((c) => normChoice(c.label) === normChoice(q.answer)),
      `${q.id} choices 不含 answer=${q.answer}`);
    ok(q.choices.filter((c) => c.correct).some((c) => normChoice(c.label) === normChoice(q.answer)),
      `${q.id} 正确项与 answer 不一致`);
    // 判定器自检：正确项必须判对、首个错误项必须判错
    const right = q.choices.find((c) => c.correct)!;
    ok(judgeAnswer(q, right.label) === true, `${q.id} judgeAnswer 对正确项判错`);
    const wrong = q.choices.find((c) => !c.correct);
    if (wrong) ok(judgeAnswer(q, wrong.label) === false, `${q.id} judgeAnswer 对错误项判对（${wrong.label} vs ${q.answer}）`);
  }
  if (q.type === 'syllableSplit') {
    ok(!!q.syllableUnits && q.syllableUnits.length >= 2, `${q.id} 缺 syllableUnits`);
    ok(q.answer === (q.syllableUnits ?? []).join('-'), `${q.id} answer=${q.answer} != units.join('-')`);
    ok(new Set(q.syllableUnits ?? []).size === (q.syllableUnits ?? []).length, `${q.id} 音节块重复`);
  }
  if (q.type === 'stressPosition') {
    ok(!!q.syllableUnits, `${q.id} 缺 syllableUnits`);
    const n = (q.syllableUnits ?? []).length;
    ok(Number.isInteger(Number(q.answer)) && Number(q.answer) >= 0 && Number(q.answer) < n, `${q.id} 重音索引 ${q.answer} 越界(0..${n - 1})`);
    ok(judgeAnswer(q, q.answer) === true, `${q.id} judgeAnswer 自检失败`);
  }
  if (q.type === 'affixAssemble') {
    ok(!!q.affixUnits && q.affixUnits.length >= 2, `${q.id} 缺 affixUnits`);
    const join = (q.affixUnits ?? []).map((u) => u.text).join('-');
    ok(q.answer === join, `${q.id} answer=${q.answer} != units.join('-') (${join})`);
    ok(judgeAnswer(q, join) === true, `${q.id} 以 join 作答应判对`);
    const prefixCount = (q.affixUnits ?? []).filter((u) => u.type === 'prefix').length;
    ok(prefixCount <= 2, `${q.id} 前缀过多`);
  }
  if (q.type === 'listenWritePhoneme') {
    ok(q.speak !== undefined && /^\/.+\//.test(q.answer), `${q.id} 需要 speak 且 answer 为音标`);
    ok(normIpa(judgeAnswer(q, q.answer) ? q.answer : 'x') === normIpa(q.answer), `${q.id} answer 自身应判对`);
    ok(judgeAnswer(q, q.answer) === true, `${q.id} listenWritePhoneme 自判失败`);
  }
  if (q.type === 'listenWriteWord') {
    ok(!!q.speak && q.answer === q.speak, `${q.id} speak 与 answer 不一致`);
    ok(judgeAnswer(q, q.answer) === true, `${q.id} listenWriteWord 自判失败`);
  }
}
// 题型覆盖：至少 5 种题型出现在静态题库（原验收）——实为 11

/* ---------- 7. 成就（已随去角色化移除，无数据校验） ---------- */

/* ---------- 8. 费曼关 ---------- */
ok(feynmanTasks.length === methods.length, `费曼关任务 ${feynmanTasks.length} != 方法 ${methods.length}`);
ok(new Set(feynmanTasks.map((t) => t.methodId)).size === feynmanTasks.length, '费曼关课次重复');
for (const t of feynmanTasks) {
  ok(!!methodById[t.methodId], `${t.methodId} 没有对应方法`);
  ok(t.prompt.length > 10 && t.modelAnswer.length > 60, `${t.methodId} 题面或对照解释过短`);
  ok(t.keywords.length >= 6, `${t.methodId} 关键词 ${t.keywords.length} < 6`);
  ok(new Set(t.keywords).size === t.keywords.length, `${t.methodId} 关键词重复`);
  ok(t.studentQuestions.length === 2, `${t.methodId} 追问 ${t.studentQuestions.length} != 2`);
  ok(t.exampleHint.length > 0 && t.exceptionHint.length > 0, `${t.methodId} 例子/例外要求缺失`);
}

/* ---------- 输出 ---------- */
if (errors.length) {
  console.error(`✗ 数据验收失败：${errors.length}/${checks} 项断言不通过`);
  for (const e of errors) console.error('  - ' + e);
  throw new Error('DATA_CHECK_FAILED');
} else {
  console.log(`✓ 数据验收全部通过（${checks} 项断言）`);
}
