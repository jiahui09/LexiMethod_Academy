/* 数据层深度验收（esbuild 打包后由 scripts/checkData.mjs 执行） */
import { phonemes, phonemeById, phonemeGroups, monophthongs, diphthongs, consonants } from '@/data/phonemes';
import { words, wordById, wordIds } from '@/data/words';
import { prefixes, suffixes, roots } from '@/data/affixes';
import { rules, rulesByType, ruleById } from '@/data/rules';
import { spellingPatterns } from '@/data/spellingPatterns';
import { courses, courseById, getCourse } from '@/data/courses';
import { quizBanks } from '@/data/quizBanks';
import { KIND_REGISTRY } from '@/components/practice/kinds';
import { DEMO_NAMES } from '@/components/demos/Demo';
import { pickBand } from '@/components/course/BandsReport';
import { TYPE_LABELS, normChoice, normIpa, normWord, judgeAnswer } from '@/lib/answers';
import type { QuestionType } from '@/types';
import type { CourseQuestion, Diagnostic, ScoreBand, Block } from '@/data/courseSchema';


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

/* ---------- 5. 课程（新世界：8 课内容先行，数据即产品） ---------- */
const NEW_Q_TYPES = ['choice', 'match', 'highlight', 'construct', 'selfReveal', 'classify', 'fill'] as const;
const OLD_Q_TYPES = new Set<string>(Object.keys(TYPE_LABELS));
const ALLOWED_Q_TYPES = new Set<string>([...OLD_Q_TYPES, ...NEW_Q_TYPES]);
const STAGE_SEQ = ['pathway', 'pathway', 'deconstruct', 'encode', 'encode', 'encode', 'retrieve', 'capstone'] as const;
const BLOCK_KINDS = new Set(['example', 'demo', 'warning', 'list']);

ok(courses.length === 8, `课程数量 ${courses.length} != 8`);
ok(new Set(courses.map((c) => c.id)).size === 8, '课程 id 有重复');
courses.forEach((c, i) => {
  ok(c.order === i + 1, `${c.id} order=${c.order} 应为 ${i + 1}（路径顺序）`);
  ok(c.stage === STAGE_SEQ[i], `${c.id} stage=${c.stage} 应为 ${STAGE_SEQ[i]}`);
  ok(courseById[c.id] === c, `${c.id} 不在 courseById`);
  ok(!!getCourse(c.id), `${c.id} getCourse 取不到`);
});
ok(courses.filter((c) => c.optional).length === 1, `可选课应恰好 1 门，实为 ${courses.filter((c) => c.optional).length}`);
ok(courses[4].id === 'mnemonics' && courses[4].optional === true, '第 5 门应为可选的联想课');

/** 诊断 / 出门条共用：题池 + 分数带 + pickBand 语义（回归守卫） */
function checkPool(tag: string, pool: CourseQuestion[], bands: ScoreBand[]) {
  ok(pool.length >= 6 && pool.length <= 10, `${tag} 题数 ${pool.length} 不在 6–10`);
  ok(new Set(pool.map((q) => q.id)).size === pool.length, `${tag} 题 id 重复`);
  for (const q of pool) {
    ok(q.prompt.length >= 4 && String(q.answer ?? '').length > 0, `${tag}/${q.id} prompt/answer 缺失`);
    ok(ALLOWED_Q_TYPES.has(q.type), `${tag}/${q.id} type=${q.type} 不在题型集`);
    if (q.choices && q.choices.length >= 2) {
      ok(q.choices.filter((c) => c.correct).length === 1, `${tag}/${q.id} 正确项不唯一`);
      const labels = q.choices.map((c) => normChoice(c.label));
      ok(new Set(labels).size === labels.length, `${tag}/${q.id} 选项标签重复`);
      if (OLD_Q_TYPES.has(q.type)) {
        const right = q.choices.find((c) => c.correct)!;
        const wrong = q.choices.find((c) => !c.correct);
        ok(judgeAnswer(q as unknown as Parameters<typeof judgeAnswer>[0], right.label) === true,
          `${tag}/${q.id} judgeAnswer 对正确项判错`);
        if (wrong) ok(judgeAnswer(q as unknown as Parameters<typeof judgeAnswer>[0], wrong.label) === false,
          `${tag}/${q.id} judgeAnswer 对错误项判对（${wrong.label}）`);
      }
    }
  }
  ok(bands.length >= 2, `${tag} 分数带 ${bands.length} 档 < 2`);
  ok(bands.every((b) => b.verdict.length >= 10), `${tag} 有 verdict 过短`);
  ok(bands[0].until <= pool.length, `${tag} 顶带 until=${bands[0].until} 高于题数 ${pool.length}`);
  ok(bands[bands.length - 1].until === 0, `${tag} 底带 until=${bands[bands.length - 1].until} 应为 0（0 分也有带）`);
  for (let i = 1; i < bands.length; i++) {
    ok(bands[i].until < bands[i - 1].until, `${tag} 分数带未按高分到低分排`);
  }
  for (const b of bands) {
    if (b.route) ok(b.route.length >= 2 && b.route.length <= 40, `${tag} route 过短/过长：${b.route}`);
  }
  // pickBand 语义回归：曾用反向谓词（score <= until），任何分数都误落顶带
  ok(pickBand(pool.length, bands) === bands[0], `${tag} 满分应落顶带`);
  ok(pickBand(0, bands) === bands[bands.length - 1], `${tag} 0 分应落底带`);
  bands.forEach((b, i) => ok(pickBand(b.until, bands) === b, `${tag} until=${b.until} 应落第 ${i + 1} 带`));
}

function checkBlock(tag: string, b: Block) {
  ok(BLOCK_KINDS.has(b.kind), `${tag} block.kind=${(b as { kind?: string }).kind} 非法`);
  if (b.kind === 'example') ok(b.text.length >= 6, `${tag} example 文案过短`);
  if (b.kind === 'demo') ok(b.ref.length > 0 && b.caption.length >= 6, `${tag} demo 缺 ref/caption`);
  if (b.kind === 'warning') ok(b.text.length >= 6, `${tag} warning 文案过短`);
  if (b.kind === 'list') ok(b.items.length >= 2, `${tag} list 条目 < 2`);
}

for (const c of courses) {
  ok(c.title.length >= 4 && c.subtitle.length >= 4 && c.goal.length >= 6, `${c.id} 题名/副题/目标缺失`);
  ok(c.durationMin >= 30 && c.durationMin <= 40, `${c.id} durationMin=${c.durationMin} 不在 30–40`);
  ok(c.opening.lead.length >= 8, `${c.id} 诊断 lead 过短`);
  checkPool(`${c.id} 诊断`, c.opening.questions, c.opening.bands);
  ok(c.exitTicket.intro.length >= 8, `${c.id} 出门条 intro 过短`);
  checkPool(`${c.id} 出门条`, c.exitTicket.questions, c.exitTicket.bands);
  ok(c.selfCheck.length === 5, `${c.id} 自测卡 ${c.selfCheck.length} 条 != 5`);
  ok(c.selfCheck.every((s) => s.trim().length >= 6), `${c.id} 自测卡有条目过短`);
  ok(c.units.length >= 5 && c.units.length <= 6, `${c.id} 单元数 ${c.units.length} 不在 5–6`);
  c.units.forEach((u, i) => {
    const tag = `${c.id}/${u.id}`;
    ok(u.id === `u${i + 1}`, `${tag} 单元 id 序列错位（应为 u${i + 1}）`);
    ok(u.title.length >= 3, `${tag} 单元标题过短`);
    ok(u.durationMin >= 5 && u.durationMin <= 9, `${tag} durationMin=${u.durationMin} 不在 5–9`);
    ok(u.claim.length >= 6 && u.claim.length <= 40, `${tag} claim 长度 ${u.claim.length} 不在 6–40`);
    ok(u.blocks.length >= 2, `${tag} blocks=${u.blocks.length} < 2（文字墙风险）`);
    for (const b of u.blocks) checkBlock(tag, b);
    if (u.practice) {
      ok(!!KIND_REGISTRY[u.practice.kind], `${tag} practice.kind=${u.practice.kind} 未注册`);
      ok(u.practice.title.length >= 3 && u.practice.prompt.length >= 4, `${tag} practice 文案缺失`);
      ok((u.practice.debrief ?? '').length >= 6, `${tag} practice 缺 debrief 收口`);
    } else {
      ok(false, `${tag} 缺 practice（单元须可动手）`);
    }
    if (u.labLink) ok(['phonemes', 'mapping', 'dictation'].includes(u.labLink.tab), `${tag} labLink.tab=${u.labLink.tab} 非法`);
    if (u.check !== undefined) ok(u.check.length >= 6, `${tag} check 收口句过短`);
  });
}

// 演示引用：数据 47 块 ↔ 注册表 47 项，双向全覆盖
const allRefs = courses.flatMap((c) => c.units.flatMap((u) => u.blocks.filter((b) => b.kind === 'demo').map((b) => (b as { ref: string }).ref)));
ok(allRefs.length === 47, `课程 demo 块 ${allRefs.length} != 47`);
ok(new Set(allRefs).size === 47, `demo ref 有重复引用，去重后 ${new Set(allRefs).size}`);
ok(allRefs.every((r) => DEMO_NAMES.includes(r)), `未注册 demo ref: ${allRefs.filter((r) => !DEMO_NAMES.includes(r)).join(' ')}`);
ok(DEMO_NAMES.every((n) => allRefs.includes(n)), `demo 注册表死项: ${DEMO_NAMES.filter((n) => !allRefs.includes(n)).join(' ')}`);

// 微练习 kind：数据用到的 30 键 ↔ 注册表 30 键，双向全覆盖
const usedKinds = new Set(courses.flatMap((c) => c.units.map((u) => u.practice?.kind).filter((k): k is string => !!k)));
const regKinds = Object.keys(KIND_REGISTRY);
ok(regKinds.length === 30, `KIND_REGISTRY ${regKinds.length} 键 != 30`);
ok(usedKinds.size === regKinds.length, `练习 kind 覆盖 ${usedKinds.size}/${regKinds.length}`);
ok(regKinds.every((k) => usedKinds.has(k)), `kind 注册表死键: ${regKinds.filter((k) => !usedKinds.has(k)).join(' ')}`);

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

/* ---------- 输出 ---------- */
if (errors.length) {
  console.error(`✗ 数据验收失败：${errors.length}/${checks} 项断言不通过`);
  for (const e of errors) console.error('  - ' + e);
  throw new Error('DATA_CHECK_FAILED');
} else {
  console.log(`✓ 数据验收全部通过（${checks} 项断言）`);
}
