# UI 重建分工契约 · 压膜活页手册（Acetate Manual）

方向已锁定（seed `9f19875c`，PICK「压膜活页手册」）。地基已就位：`tailwind.config.js` 新令牌、`src/index.css` 世界工具层、`index.html` 字体 CDN、壳件（AppShell / ForeEdge / NextStepBar / BottomNav / PageTransition / RunningHead）、`src/store/progressStore.ts` 新模型、`src/lib/stages.ts` 段色共享表。本文件是并行施工的唯一接口契约。

## 0. 所有人的世界规则（引自 DESIGN.md，违者返工）

- 令牌类：`milk/leaf/under/rule/ink/ink2`、`board-pathway|deconstruct|encode|retrieve|capstone`、`errata`、`errata-deep`；工具类 `.leaf .under-leaf .board-band .hinge .machine .punch .hanging`（见 `src/index.css`）。
- 圆角 2/3/4px，绝不用胶囊（短机器标签除外，≤12px）；全站唯一投影是顶层页单边硬切 `4px 0 0 rgba(23,20,14,.1)`（`.leaf-active`），无辉光无玻璃。
- 正文 `font-serif`（index.css 已置，17px/1.8，行长 ≤68ch）；标题 `font-display`（黑体 700/800）；课号/步数/计时/题号/IPA 一律 `.machine` 13px。
- 主行动 = `bg-ink text-milk rounded-[3px] font-display font-bold`；次级 = `border border-ink/40` 幽灵钮；**朱红永不充当主按钮**，errata 只给错误（错题、勘误条、错误态），errata-deep 只做承载白字的勘误条底。
- 动效唯一语言 = 铰链步进：`.hinge`（90ms steps(2)），只用于状态切换；不写淡入/模糊/位移过渡，不做页面进入编排；reduced-motion 下 CSS 媒体查询自动归零。
- 段色上文字用 `STAGE_META[stage].onBand`（`@/lib/stages`，已解算 ≥4.5:1）；其他地方 ink/ink2 on milk/leaf，ink2 on leaf ≈7:1。
- 三重编码：状态 = 形状 + 颜色 + 文字（aria-label / 可见标签），从不只靠颜色。
- 无障碍：每路由单一 h1、无重复 id、触控 ≥44×44、对比 ≥4.5:1（大字 ≥3:1）、图标按钮必有 aria-label、反馈区 `aria-live="polite"`、键盘可达。
- 文案（human-writing 禁令，含 UI 字符串）：不写「——」「不是…而是…」翻案腔、提示性冒号引出、3 个以上同构排比、黑话；全站中文，英文只在教学内容；禁 emoji 图标（用 lucide）。
- 无游戏化：无 XP/徽章/连击/彩带；分数只做反馈。
- 零新外部请求：只许已放行的字体 CDN；音频用 `@/hooks/usePhonemeAudio`、`@/components/edu/Speak`。
- 不引入 framer-motion 新用法（PageTransition 已是直通壳）；新代码用 CSS。

## 1. 文件所有权（只改自己名下的文件）

| 代理 | 名下文件 |
|---|---|
| A 课程页族 | `src/pages/MethodList.tsx`、`src/pages/MethodCourse.tsx`、`src/components/course/**`（新建子件可） |
| B 题型运行器 | `src/components/practice/CourseQuestionRunner.tsx`（**新建**）、`src/components/practice/questions/**`（新建）、`src/lib/answers.ts`（只增不改旧导出） |
| C 演示与练习 | `src/components/demos/**`（新建）、`src/components/practice/Practice.tsx`（新建）、`src/components/practice/kinds/**`（新建） |
| D 实验室与设置 | `src/pages/PhonemeLab.tsx`、`src/pages/Settings.tsx`、`src/pages/NotFound.tsx`、`src/components/phonics/**` |

只读共享（禁止修改）：`src/data/**`、`src/store/**`、`src/components/layout/**`、`src/components/edu/**`、`src/index.css`、`tailwind.config.js`、`index.html`、`DESIGN.md`、`src/App.tsx`、`src/lib/stages.ts`。
旧组件（`components/course/steps/**`、旧 `components/practice/QuestionRunner.tsx` 等）由主控统一退役，任何人不去改它。

## 2. 接口（跨代理精确签名）

### C · 练习渲染器（A 调用）
```tsx
// src/components/practice/Practice.tsx
import type { Practice } from '@/data/courseSchema';
export function Practice({ practice, onDone }: { practice: Practice; onDone?: () => void })
```
- `kind` 全集由 `src/data/courses/*.ts` 中 `practice: { kind }` 字段自行盘点（用 grep 排除 block kind：example/demo/warning/list/diagnostic/exitTicket）。
- 未识别 kind：优雅降级为「title + prompt + debrief」的 leaf 面，绝不崩溃。
- `onDone` 在练习收口时调用（可多次触发，A 自行幂等）。

### C · 演示渲染器（A 调用）
```tsx
// src/components/demos/Demo.tsx
export function Demo({ name, caption }: { name: string; caption?: string })
```
- `name` = 课程数据里 47 个 kebab-case demo ref（清单见 `grep -h "ref: '" src/data/courses/*.ts | sort -u`）；未识别 ref 降级为 caption 文本行。
- 可用数据：`@/data/{phonemes,words,rules,spellingPatterns,affixes,quizBanks,tools}`。
- 每个 demo 自包含，教学优先；能交互的（揭示、开关、计时）才交互。

### B · 课程题运行器（A 调用）
```tsx
// src/components/practice/CourseQuestionRunner.tsx
import type { CourseQuestion } from '@/data/courseSchema';
export default function CourseQuestionRunner(props: {
  questions: CourseQuestion[];
  mode: 'diagnostic' | 'exit';   // diagnostic=诊断；exit=出门条
  onDone: (score: number, total: number) => void;
  onAnswered?: (qid: string, correct: boolean) => void;
})
```
- 逐题一屏：机器计数 `03 / 08` + 打孔进度条；提交后当场揭晓（对 → ✓ 简短确认；错 → errata 勘误条展示 `explain`/答案，决策点4），再「下一题」。
- `hint` 提交前可点（「看提示」幽灵钮）；语音题走离线音频。
- 分数只做计数反馈；结束回调 `onDone(score, total)`。
- 题型覆盖 `CourseQuestionType`（见 `src/data/courseSchema.ts`；含旧 quiz 型与新 choice/fill/classify/construct/affixAssemble/prefix/root/suffix/contextChoice/stressPosition/syllableSplit/minimalPair/listen*/wordChoose*/spellingChoose* 等，以 schema 联合类型为准 + `check:courses` 数据实际值）。
- 不动旧 `QuestionRunner.tsx`（实验室与旧件仍在用）。

### A · 成绩带报告 / 离场自测（组件族自己内部使用）
```tsx
// src/components/course/BandsReport.tsx —— 按 courseSchema.ScoreBand 字段（until/verdict/routes）实现，读 schema 定签名
```

### 进度模型（已就位，A 与 C 只调用）
```ts
useProgress.getState().markDiagnosticTaken(courseId)
useProgress.getState().completeUnit(courseId, unitId)
useProgress.getState().recordExitResult(courseId, score, total)
useProgress.getState().markSelfChecked(courseId)
// 选择器：completedUnits / diagnosticTaken / exitResults / selfChecked
```

### 段色（已就位）
```ts
import { STAGE_META, deepen } from '@/lib/stages'; // STAGE_META[course.stage].hue / bg / onBand
```

## 3. 路由与页面位置模型（A 实现，全站一致）

- 目录页 `/methods`：手册总目——四段路径分章卡板带（pathway: 01–02、deconstruct: 03、encode: 04–06、retrieve: 07、capstone: 08），每门课一行：机器课号 + 课名 + 副题 + 课时 `.machine` + 长度条（∝ durationMin）+ 状态（打孔 ✓ 已收口 / 未到）；单行唯一主行动（开始第一课 / 继续）。
- 课程页 `/methods/:methodId`（methodId = course.id）：`?step=N`，N = 0 诊断、1..6 单元、7 出门条 + 离场自测；缺省跳第一个未完成步。`ForeEdge` 已按此路由点亮当前课贴。
- 书眉：`EduRunningHead`（`@/components/edu/RunningHead`）支持 `accent` = 段色 hex；右槽放 `.machine` 步数（如 `03 / 08`）。
- 实验室 `/lab/:tab` 与设置路由不变。

## 4. 验证（各自收工前）

- `npx tsc --noEmit -p tsconfig.app.json`：**只对名下文件清零**（并行期他人的报错属预期，别去修别人的）。
- `npm run check:courses` 必须保持绿（数据不动）。
- 不跑 `npm run build`（主控集成时统一跑）。
- 自查本节 0 的清单；文案过一遍 human-writing 禁令。
