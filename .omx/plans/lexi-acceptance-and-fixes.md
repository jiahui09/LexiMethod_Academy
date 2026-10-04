# LexiMethod Academy — 深度验收与缺陷修复计划（/plan + ai-slop-cleaner）

模式：Direct（请求已具体：深度验收 + 修复 bug/缺陷）
范围：`/home/jiahui/project/LexiMethod_Academy`（React18 + TS + Vite，无后端）
工作流：先锁行为（回归测试）→ 清理计划 → 逐类修复 → 质量门禁 → 证据化报告

## Requirements Summary

1. **深度验收**：不止冒烟——覆盖数据完整性、11 种题型可解性、10 条路由全交互、
   动效降级、持久化、无障碍关键点、性能基线。
2. **修复 bug 与缺陷**：以验收失败项为准绳，逐个根因修复；同时按 ai-slop-cleaner
   执行死代码 / 重复 / 命名错误处理 / 测试加固四轮清理。
3. **不改变既有行为**：16 条原验收标准必须保持全绿。

## Acceptance Criteria（全部可测）

- A1 数据完整性检查器 `scripts/checkData.mjs`（esbuild 打包数据层后执行）0 错误：
  48 音标 id 唯一、`contrastWith/longShortPair/minimalPairs` 引用存在；
  30 words 结构合法（音节拼接==单词、stressIndex 越界=0、例句含 `\bword\b`）；
  quizBanks 11 型×≥8 题、choices 含 answer、syllableSplit `answer===units.join('-')`、
  stressPosition `answer∈[0,len)`、affixAssemble `answer===units.map(text).join('-')`；
  methods 8×8 步且 `animation` 全部被 StepHost 支持；spellingPatterns 的 phoneme 存在。
- A2 `scripts/acceptance.mjs`（puppeteer）：13 路由零 console.error/pageerror；
  首页 <3s；旗舰 8 步；48 音标 7 步；11 题型逐页签可出题并可作答得分；
  词缀/音节/重音三类拖拽题可判对；刷新保留进度；375px 无横向滚动；
  settings 四档动效写入 `data-motion`；成就可解锁。
- A3 质量门禁：`tsc -b` 0 错误；`vite build` 通过；`smoke.mjs` 全绿；
  lint = N/A（项目未配置 eslint，不新增依赖）。
- A4 清理：删除死代码、修命名/错误处理缺陷；diff 最小、行为不变（A2 复跑全绿）。

## Implementation Steps

1. **锁行为**：新增 `scripts/checkData.mjs`（数据层断言）+ `scripts/acceptance.mjs`
   （全交互回归），先记录当前基线结果（哪些红、哪些绿）。
2. **清理计划**（动手前）：按类别列出候选——
   死代码（如 `src/components/ui/VirtualList.tsx` 未被引用）、
   重复（页面间重复的进度条/统计渲染）、命名与错误处理（吞错 catch 是否为
   语音/录音边界的 grounded fallback）、缺失测试（A1/A2 即测试补强）。
3. **分类修复**：A1/A2 失败项 → 逐个根因修复，每修一类立即复跑对应检查。
4. **逐轮清理**：Pass1 死代码 → Pass2 重复 → Pass3 命名/错误处理 → Pass4 测试加固。
5. **质量门禁 + 报告**：tsc/build/smoke/acceptance 全绿后输出
   AI SLOP CLEANUP REPORT（含 fallback 分类与剩余风险）。

## Risks & Mitigations

- 数据检查器依赖 esbuild（已在 node_modules，0.28.2）→ 不新增依赖。
- 交互回归可能受 TTS/录音在 headless 下不可用影响 → 断言"降级提示存在"而非必须发声。
- 清理误删行为 → 每轮后复跑 `acceptance.mjs` + `smoke.mjs`。

## Verification Steps

```bash
npm_config_cache=/tmp/npmcache npx tsc -b
npm_config_cache=/tmp/npmcache npm run build
node scripts/checkData.mjs
node scripts/smoke.mjs
node scripts/acceptance.mjs
```

## 执行状态（本轮更新）

- **A1** `checkData.mjs` ✅ `2604 项断言` 0 错误（新增「8. 费曼关」结构断言，成就 16→17）。
- **A2** `acceptance.mjs` ✅ **67/67**（13 路由零报错、11 题型全部判对、备份导出→导入往返、
  费曼关端到端、375px 无溢出）；`smoke.mjs` ✅ 全部通过。连续两轮全绿，题库 shuffle 下确定。
- **A3** ✅ `tsc -b` 0 错误；`npm run build` 通过；新增 `npm run size` 首屏门禁
  （首屏 165.6 KB gzip < 200 KB、CSS 9.6 KB < 30 KB、全量 289 KB < 2 MB）。
- **A4 Pass1 死代码** ✅：删除 `VirtualList.tsx`、`useTilt.ts`、`GlassCard/TiltCard/Reveal`、
  `GlowRing`、`useDurationScale` 及 `.tilt-*` / `.glass-hover` / `glow-ring` CSS；
  `getMethod/methodById` 改为在 `MethodCourse` 实际复用（不再死代码）。复扫：0 未引用导出、0 孤儿文件。
- **A4 Pass2~4** ⏳ 部分完成：重复渲染抽取（7 处细进度条、Practice/Stats 同构统计卡）与命名清理未做。

### 同期落地的产品项（来自规格书，纯前端约束）

- **去外部字体**：移除 Google Fonts `<link>`，改为系统字体栈（离线可用、零外部请求）。
- **备份导入（规格“必须实现”）**：`Settings.tsx` 校验 `app === 'LexiMethod Academy'` 与三段结构后
  合并回 `lexi.settings.v1 / progress.v1 / review.v1`，成功后自动刷新。
- **体积门禁** `scripts/size.mjs`：解析 `dist/index.html` eager 图 + 首页分包，按 gzip 断言。
- **费曼关 `/feynman`**：8 课题面/关键词/例子/例外要求 + 标准解释对照 + 虚拟学生追问 +
  4 项自评量表 + 录音（仅内存，权限被拒即降级为纯文字）+ 掌握标准判定 + 15 XP + 第 17 枚成就。
  入口：课程页头部「费曼关」、首页底部 CTA、页脚、≥1360px 顶部导航。
- **导航自适应**：新增 `wideOnly`（`min-[1360px]` 才显示）；1024/1280/1360/1440 实测 0 横向溢出。

### 已知风险 / 遗留

- dev server 出现过一次模块转换缓存陈旧（编辑后未失效，`touch <file>` 即可修复）→
  复跑浏览器测试前先 `touch src/...` 或重启 `npx vite --port 5173`。
- 未开始：Pass2 去重、发音评分（SpeechRecognition 三级降级 + Levenshtein）、
  PWA/Service Worker 离线、游戏化（等级/星星/每日挑战/Boss）、Phase 词库与可解码短文。
