/**
 * 词全集数据入口（esbuild 打包用）
 * ============================================================
 * 汇总「教学里所有会被朗读」的数据源，供 scripts/word-universe.mjs
 * 提取词全集。新增数据源时在此处导出即可，生成器与音频门禁自动生效。
 */
export { phonemes } from '@/data/phonemes';
export { words } from '@/data/words';
export { rules } from '@/data/rules';
export { spellingPatterns } from '@/data/spellingPatterns';
export { prefixes, suffixes, roots } from '@/data/affixes';
export { quizBanks } from '@/data/quizBanks';
export { demoByMethod } from '@/components/course/demoConfig';
