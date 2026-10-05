---
name: LexiMethod Academy
description: 深夜自习室般的暗色霓虹多媒体交互教学系统——授人以渔的英语背词方法学院
colors:
  primary: "#00E5FF"
  secondary: "#7C4DFF"
  tertiary: "#FF4D9D"
  success: "#00E676"
  warn: "#FFB300"
  danger: "#FF4D6D"
  neutral-abyss: "#0B1020"
  neutral-deep: "#111936"
  neutral-ink: "#070B18"
  neutral-text: "#E2E8F0"
  neutral-text-dim: "#CBD5E1"
  neutral-text-min: "#94A3B8"
  neutral-surface: "rgba(255, 255, 255, 0.06)"
  neutral-hairline: "rgba(255, 255, 255, 0.12)"
typography:
  display:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 5vw, 3.75rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 3vw, 1.875rem)"
    fontWeight: 700
    lineHeight: 1.3
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.2em"
  mono:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  xs: "6px"
  sm: "8px"
  md: "12px"
  button: "14px"
  card: "16px"
  glass: "24px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  section: "40px"
components:
  button-primary:
    backgroundColor: "#101A35"
    textColor: "#E8FBFF"
    typography: "{typography.body}"
    rounded: "{rounded.button}"
    padding: "10px 18px"
  button-ghost:
    backgroundColor: "rgba(255, 255, 255, 0.05)"
    textColor: "rgba(226, 240, 255, 0.85)"
    typography: "{typography.body}"
    rounded: "{rounded.button}"
    padding: "10px 18px"
  button-solid:
    backgroundColor: "{colors.primary}"
    textColor: "#071022"
    typography: "{typography.body}"
    rounded: "{rounded.button}"
    padding: "10px 20px"
  card-glass:
    backgroundColor: "{colors.neutral-surface}"
    textColor: "{colors.neutral-text}"
    rounded: "{rounded.glass}"
    padding: "20px"
  input-neon:
    backgroundColor: "rgba(255, 255, 255, 0.05)"
    textColor: "#EAF6FF"
    typography: "{typography.body}"
    rounded: "{rounded.button}"
    padding: "10px 14px"
  chip:
    backgroundColor: "rgba(255, 255, 255, 0.05)"
    textColor: "{colors.neutral-text-dim}"
    typography: "{typography.body}"
    rounded: "{rounded.full}"
    padding: "6px 12px"
  chip-selected:
    backgroundColor: "rgba(0, 229, 255, 0.10)"
    textColor: "{colors.primary}"
    typography: "{typography.body}"
    rounded: "{rounded.full}"
    padding: "6px 12px"
---

# Design System: LexiMethod Academy

## Overview

**Creative North Star: "深夜自习室（The Midnight Study Hall）"** — 一盏台灯、一块屏幕、一条路径。

这套系统是一张深夜里专注的书桌：底色是夜——固定的深夜蓝渐变、角落里缓慢呼吸的极光光斑；霓虹是屏幕与台灯的微光；玻璃卡是摊在桌上的一张张讲义。学习者是独自前来的，界面的全部职责是把注意力钉在「下一步该学什么」上，而不是展示自己有多热闹。青色是这张书桌上唯一亮着的信号灯：它出现的地方，就是现在要动的地方。

密度哲学是**克制而集中**。每屏只有一个发光的主行动点；导航是墙上的便签，最多五张；粒子、极光、彩带属于「氛围层」——夜里偶尔飘过的光尘，归动画档位管理，且彩带只在真正值得庆祝时出现。教学的严谨（方向感、逐步揭示、把原理讲透）才是本站的个性来源，不是堆效果。

反参考同样明确：拒绝白底日间主题，拒绝营销式大图首屏（工具页的首屏必须是可执行的下一步，不是广告），拒绝经验值、连击、连续天数、等级徽章等角色化成长内容——本站是多媒体交互教学工具（朗读、口型动画、交互练习、即时反馈），反馈只为学习服务，不为留存服务——并拒绝任何外部字体与 CDN 资源，离线可用、零请求是这个项目的硬约束。

**Key Characteristics**

- 深夜蓝固定渐变底 + 霓虹青意图信号 + 紫/粉氛围光
- 系统字体栈单兵种（display 与 body 同族），中文优先，IPA 与等宽数据用 mono
- 玻璃卡是唯一的容器语言，圆角家族 6→24px
- 每屏唯一发光主 CTA，桌面主导航 ≤5 项
- 状态色恒定：绿=正确/达成，琥珀=提醒，红=错误
- 无角色化成长系统：不设经验值、连击、连续天数与等级徽章；对错、进度、完成的教学反馈直接服务学习
- 动效分三层：状态反馈（常驻）→ 氛围层（档位控制）→ 完成时刻（事件触发）

## Colors

调色板是三层结构：**夜色底、意图信号、状态色**。霓虹青是全站最稀缺的注意力货币。

### Primary

- **Neon Cyan 霓虹青** (#00E5FF): 系统的意图信号——主行动点、当前导航、焦点环、进行中的进度。学习者看到青色即知道「这里是现在要动的地方」。KPI 数字与活跃态可以借用它，但一屏只能有一个发光的主行动点。
- **Moonlight 月光白** (#E2E8F0): 正文与标题的主文字色，在深夜底上安静可读。

### Secondary

- **Aurora Violet 极光紫** (#7C4DFF): 氛围与层次——页面渐变的高处光斑、渐变描边的第二段、次级数据可视化。它自己从不单独发出「可点击」暗示，也从不承担玻璃面上的正文（对比度不足）。
  - **Violet Lit 紫文字变体** (#A98BFF, token `violet-lit`): 当紫必须携带文字（12px 标签、chip、强调词）时的唯一合法形态，玻璃面上 ≥5.5:1。本色只留给边框、填充、光晕、SVG 与 ≥18.66px 粗体大字（3:1 达标）。

### Tertiary

- **Pulse Pink 脉冲粉** (#FF4D9D): 庆祝与个性点缀——完成时刻的呼吸光点、渐变的收尾、重点数据的高亮。稀缺使用，才能保住「被庆祝感」。
  - **Pink Lit 粉文字变体** (#FF80B5, token `pink-lit`): 粉承担文字时的唯一合法形态（激活开关文字、高亮词），≥4.5:1。本色保留给填充、光晕与描边。

### Semantic

- **Pass Green 通过绿** (#00E676): 答对、达成、完成态。
- **Signal Amber 提醒琥珀** (#FFB300): 到期复习提醒、待办警示。
- **Miss Red 错答红** (#FF4D6D): 错误态、破坏性确认。

状态色只表达状态，不作装饰，也不铺大面积背景。

### Neutral

- **Abyss Navy 深夜底色** (#0B1020): 页面底色渐变起点、移动导航与页脚底。
- **Deep Field 暗场** (#111936): 渐变中段与抬升面。
- **Ink Black 墨黑** (#070B18): 最深层与页脚。
- **Dusk Slate 暮板岩** (#CBD5E1): 次级文字——说明、辅助信息。
- **Mist Slate 雾板岩** (#94A3B8): **全站允许的最暗文字色**，任何比它更暗的灰阶不得承担文字。
- **Glass Surface 玻璃面** (rgba(255, 255, 255, 0.06)): 卡片与面板的统一填充。
- **Glass Hairline 发丝线** (rgba(255, 255, 255, 0.12)): 卡片描边与分隔线。

### Named Rules

**The One Glow Rule.** 发光（glow 阴影 + 渐变描边）只授予一屏之中的唯一主行动点及其焦点态；同屏出现的第二个发光元素必须熄灭，降为幽灵按钮或文字链接。

**The State Colors Rule.** 绿、琥珀、红只说状态，不说别的；需要强调时优先回到青色的意图语义。

## Typography

**Display Font / Body Font:** 同一个系统字体栈（-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Microsoft YaHei", system-ui, sans-serif）。
**Mono Font:** ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas——用于 IPA 音标、逐字母批改与等宽数字。

**Character:** 中文环境下的干净系统黑体。层级靠字重与字号拉开，不靠字体花活；数字一律等宽（tabular）保证统计列对齐。不加载任何外部字体文件是硬约束：离线可用、零请求。

### Hierarchy

- **Display** (700, clamp 36→60px, line-height 1.15, letter-spacing −0.02em): 首页品牌时刻与 404 的巨型标题。全站唯一允许逐字入场的标题。
- **Title 页/节标题** (700, clamp 24→30px, line-height 1.3): PageIntro 的页面标题与区块大标题；其下紧跟一行说明。
- **Body 正文** (400, 14→16px, line-height 1.6): 页面说明与教学正文；说明文字以 768px 为列宽上限。
- **Label 标签** (600, 12px, uppercase, letter-spacing 0.2em): 章节 kicker，青色，两侧各一条 24px 横线；数据卡标签同档。
- **Mono** (400, 14px): 音标、字母批改、统计数字。

### Named Rules

**The Floor Rule.** 12px 与 4.5:1 是任何文字（含 kicker、微标签、图表刻度）的地板，不是目标；紫色不用于玻璃面上的正文（必须携带文字时用 lit 变体 #A98BFF / #FF80B5）。底线由 `npm run audit:floor`（scripts/audit-floor.mjs：对比度/字号/触控/h1/重复 id 逐路由审计）把守，违规归零后并入 `npm run verify` 作为门禁。

## Layout

**容器与骨架:** 内容容器 1240px 居中，外边距 16px（<768px）/ 32px（≥768px）。页面骨架自上而下：64px 吸顶毛玻璃 header → 面包屑 → PageIntro（kicker + 标题 + 一句说明 + 唯一「下一步」）→ 内容 → 底部推进条。宽度不足 1024px 时由 56px 的五格底部导航接管，页面内容底部预留 66px，任何固定元素都不得遮挡内容。

**栅格与节奏:** 内容卡在 md 起两列、统计卡在 lg 起四列；首页区块间距 40px，区块内部 16–24px；移动端一律单列，文字列是唯一不可压缩的主导列。

**断点:** sm 640 / md 768 / lg 1024 三档为主，1360px 是「超宽屏才显示的低频入口」专用例外断点。

### Named Rules

**The Single Focus Rule.** 每屏只有一个前进方向：唯一发光主 CTA；桌面主导航 ≤5 项（其余入口去页脚或更多菜单）；首页首屏可点元素 ≤12；同一决策点可见选项 ≤4。

**The No-Squeeze Rule.** 低于 640px 时页头标题与推进按钮必须上下堆叠，禁止并排挤压成竖排窄字条；320px 起不允许任何横向溢出，正文被容器裁切即算缺陷。

## Elevation & Depth

深度由三层表达，各司其职：

1. **玻璃卡** — 半透明填充 + 发丝描边 + 20px 背景模糊 + 深投影，是唯一承载内容的容器材质。
2. **意图光晕** — glow 只贴着主行动点与焦点环走，为「现在动这里」造光。
3. **氛围层** — 固定渐变底、极光光斑与粒子独立于内容层，永远不承载信息，随动画档位整体开合。

### Shadow Vocabulary

- **Card Lift 卡片浮影** (0 8px 32px rgba(0, 0, 0, 0.35)): 玻璃卡默认。
- **Intent Glow 意图光晕** (0 0 24px rgba(0, 229, 255, 0.18) + 外圈紫色大晕): 主 CTA hover/焦点。
- **Focus Ring 焦点环** (2px 青色描边, offset 3px): 所有可聚焦元素的 :focus-visible，永不移除。
- **Celebration Glow 庆祝光晕** (0 0 48px / 120px 双层大晕): 仅完成时刻。
- **Inner Hairline 顶边高光** (inset 0 1px 0 rgba(255, 255, 255, 0.06)): 玻璃卡顶边的薄光。

### Named Rules

**The Glass-Only Rule.** 容器只有一种材质：玻璃卡（24px 圆角、发丝描边、20px 模糊）。禁止卡中叠卡——嵌套层级用内边距与分隔线表达，不叠第二个带独立背景的容器；玻璃卡本身永不发光，发光只归主 CTA 与成就时刻。

### Motion Grammar

- **状态反馈（常驻）**: hover 微起、按压回弹与涟漪、对错抖动、450ms Out-Expo 入场。内容在动效关闭时仍可完整阅读。
- **氛围层（档位控制）**: 粒子桌面 ≤120 / 移动 ≤40 / 关=0，极光 18s 循环——随动画档位（完整 / 精简 / 关闭 / 跟随系统）整体升降，从不携带信息。
- **完成时刻（事件触发）**: 彩带与大粒子只在完成课程、全对通关等真实学习里程碑后释放；页面进入不放彩带。
- 所有动效尊重 prefers-reduced-motion；平滑滚动同样提供减少动态的覆盖。

## Shapes

- **圆角家族:** 6px 内嵌件 → 8px 内控件与焦点位 → 12px 导航项与常规控件 → 14px 按钮与输入框 → 16px 次级卡片 → 24px 玻璃面板与英雄卡 → 全圆 pill（chip、徽章、进度环）。
- **描边:** 发丝线 1px 是默认边界；选中态换青色 40% 描边 + 青色 10% 底；破坏性确认用红色发丝框。
- **形态语言:** 大圆角的矩形讲义 + 全圆胶囊的可点标签。可点的像胶囊，装内容的像卡片。
- **装饰几何:** 卡片角落的极光光斑一律裁切在卡片内部（overflow hidden），不外溢到版面。

## Components

### Buttons

**Character:** 自信的触感——悬浮微起 1px、按压回弹（缩放 0.95–0.96）、点击涟漪。

- **Primary 发光主按钮:** 14px 圆角、10×18px 内边距、深底 + 青→紫→粉流动渐变描边、600 字重。hover 时描边流动并升起意图光晕；focus-visible 是 2px 青环。触控上下文中高度 ≥44px。
- **Ghost 幽灵按钮:** 白色 5% 填充 + 发丝描边，hover 换青色描边。次级动作与「发光点」竞争时一律降为它。
- **Solid 实底按钮（少用）:** 青→紫渐变底 + 墨黑文字，用于成就等强时刻。
- **尺寸:** sm（12×6px）仅限桌面密集控件；md（20×10px）默认；lg（28×14px）英雄位。移动端主控件走 md 且不低于 44px 触控地板。

### Chips

胶囊标签——题型筛选、难度、目标分组。默认白 5% 底 + 发丝描边 + 暮板岩文字；选中换青底 10% + 青字（即 frontmatter 的 `chip` / `chip-selected`）。触控上下文高度 ≥44px。

### Cards & Containers

**Glass Card** 是全站唯一容器：玻璃面填充、发丝描边、24px 圆角（次级卡 16px）、20px 模糊、20px 内边距、卡片浮影；顶边有一线高光。悬停时地图类卡片可整体上浮 6px 并将描边染成青色。容器内部不再嵌套有独立背景的容器。

### Inputs

14px 圆角、白 5% 底、白 14% 描边、10×14px 内边距；focus 换青色 70% 描边 + 青色 15% 外环微光；答对换绿色描边，答错换红色描边并抖动 0.42s；禁用态 40% 不透明度。占位符 42% 不透明度。

### Navigation

- **Desktop 顶栏:** 64px 吸顶玻璃条。项 = 12px 圆角、13px 文字、15px 图标；未激活暮板岩，悬停转白；激活为青字 + 底部 2px 青→紫渐变发丝下划线（弹性滑移）。**项数上限 5。**
- **Bottom Nav (<1024px):** 五格等分、56px 高、标签 12px（地板生效），激活青字。
- **移动菜单:** 双列玻璃卡网格，激活项 = 青描边 + 青底 10%。
- **方向感三件套:** 全局 skip link、每页面包屑、激活态导航——学习者任何时刻都知道「我在哪、上一步、下一步」。

### Page Header (PageIntro)

签名组件，每个新页面复用：面包屑 → 青色 kicker（两侧横线）→ 标题 → 一句说明 → 唯一的「下一步」动作。低于 640px 标题与动作上下堆叠（The No-Squeeze Rule）。

### Progress & Feedback

进度环（SVG 渐变 ID 必须唯一）、步骤控制条、aria-live 反馈区；对与错永远同时给出颜色、文字与图标三重编码。彩带是完成时刻的专属反馈，不随页面进入触发。反馈只为学习服务——不展示经验值、连击与连续天数。

## Do's and Don'ts

### Do

- **Do** 每屏只放一个发光主 CTA，其余推进入口降为幽灵按钮或文字链接。
- **Do** 文字 ≥12px 且在玻璃面上 ≥4.5:1，最暗只到雾板岩。
- **Do** 触控上下文的可点目标 ≥44×44px（底部导航项、筛选 chip、进度控件都算）。
- **Do** 桌面主导航 ≤5 项，多余入口走页脚或更多菜单。
- **Do** 低于 640px 让页头标题与按钮上下堆叠；320px 起零横向溢出。
- **Do** 彩带与庆祝粒子只在真实学习里程碑（完成课程、全对通关）后释放。
- **Do** 反馈直接服务学习：对错、进度、完成状态可庆祝；数值成长指标（经验、连击、天数）不出现。
- **Do** 所有动效经动画档位降级并尊重 prefers-reduced-motion；氛围粒子不承载信息。
- **Do** 状态色只表达状态；焦点环对所有可聚焦元素常开。
- **Do** 新页面复用 PageIntro 骨架：面包屑 → kicker → 标题 → 说明 → 唯一下一步。

### Don't

- **Don't** 同屏并置两个发光或渐变描边的主按钮。
- **Don't** 在玻璃卡里再嵌套有独立背景、描边、模糊的容器（卡中叠卡）。
- **Don't** 用低于 12px、或比雾板岩更暗的灰承担文字；用紫色在玻璃面上写正文。
- **Don't** 页面加载即放彩带——无事件的庆祝会让成就反馈贬值。
- **Don't** 引入经验值、连击、连续天数、等级徽章等角色化成长元素——反馈只为学习，不为留存。
- **Don't** 加载任何外部字体、CDN 或追踪脚本；离线可用、零请求是硬约束。
- **Don't** 让固定元素（底部导航、吸顶头）遮挡内容，或把页头标题挤成竖排窄字条。
- **Don't** 在工具页使用营销式大图 hero——首屏必须是可执行的下一步。
