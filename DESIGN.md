---
name: LexiMethod Academy
description: 教程面是摊在深色书桌上的一部双解词法书（辞书版式·骨白纸面），导航壳仍是深夜自习室的暗色霓虹——分阶段迁移中的双世界系统
colors:
  # ---------- 辞书版式（教程面 / 音标实验室的纸面世界） ----------
  bone: "#F7F2E8" # 纸地：.edu-sheet 页面底
  bone2: "#EFE6D2" # 纸面区块：边注卡、警示框、选中底
  paper-fill: "#FDFBF5" # 纸面填写线：输入框与答题选项底
  rule: "#D8CFBC" # 发丝线：纸上一切分界
  paperink: "#16130F" # 正文墨
  colophon: "#4A443B" # 次级墨（纸地 ≥4.5:1）
  cobalt: "#1E4B7A" # 结构蓝：书眉 / 导轨 / 链接 / 进度 / 已定（答对、完成）
  rubric: "#B3311E" # 批注红：纸上唯一功能色（朗读 / 当前 / 重读 / 警示 / 错答）
  rubric-deep: "#9C2919" # 批注红按压深色
  # ---------- 遗留深色壳（阶段二迁移，仍在线） ----------
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
  # 纸面世界
  title-paper:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif"
    fontSize: "26px"
    fontWeight: 700
    lineHeight: 1.25
  entry-title:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif"
    fontSize: "21px"
    fontWeight: 700
    lineHeight: 1.375
  body-paper:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.9
  serif:
    fontFamily: "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif"
    fontWeight: 700
  ipa:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
    fontSize: "13px"
    fontWeight: 400
    letterSpacing: "0.01em"
  # 遗留深色壳
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
  mark: "2px"
  control: "3px"
  sheet: "4px"
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
  # 纸面世界
  button-paper:
    backgroundColor: "transparent"
    textColor: "{colors.paperink}"
    typography: "{typography.body-paper}"
    rounded: "{rounded.control}"
    padding: "8px 16px"
  button-paper-primary:
    backgroundColor: "{colors.rubric}"
    textColor: "#FBF6EC"
    typography: "{typography.body-paper}"
    rounded: "{rounded.control}"
    padding: "8px 16px"
  input-paper:
    backgroundColor: "{colors.paper-fill}"
    textColor: "{colors.paperink}"
    typography: "{typography.body-paper}"
    rounded: "{rounded.control}"
    padding: "8px 12px"
  card-paper:
    backgroundColor: "rgba(239, 230, 210, 0.7)"
    textColor: "{colors.paperink}"
    typography: "{typography.body-paper}"
    rounded: "{rounded.sheet}"
    padding: "12px 16px"
  # 遗留深色壳
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

**Creative North Star: "辞书版式（The Dictionary Edition）"** — 方法是词目，步骤是义项，演示是例句，误区是辨析。

本站是双世界并存、分阶段迁移的系统。教程面（`/methods/:methodId`、`/lab`）已建成第二个世界：骨白纸满地（#F7F2E8）、墨文承字、发丝线划栏，一册可读可练的双解词法书摊在深色书桌上（`.edu-sheet` 是全站唯一一次抬升，`0 24px 64px rgba(0,0,0,0.5)`）。词头朗读时批注红章斜落纸上——像用红笔在词典上做了记号——是这个世界的签名瞬间。纸面拒绝玻璃、辉光、渐变与眉标（kicker）：标题自己承载重量，标签一律走行内。

导航壳与其余路由（header / footer / BottomNav / NextStepBar / Home / MethodList / practice / feynman 等）仍是第一世界「深夜自习室」：深夜蓝固定渐变、霓虹青意图信号、玻璃卡容器。它们是**已记录的阶段二迁移**，本轮不迁移；两个世界的规则在同一文件中分区记录，新增页面先判断自己站在纸上还是夜里。

反参考在两个世界同样成立：拒绝白底卡片网格 + 渐变 hero + 进度环的网课站货架感（教程面做一部书，不做课程货架），拒绝经验值 / 连击 / 连续天数 / 等级徽章等角色化成长内容，拒绝任何外部字体与 CDN 资源——离线可用、零请求是硬约束。

**Key Characteristics**

- 纸面双笔色：批注红（功能/当下）+ 结构蓝（结构/已定），骨白纸与发丝线做地
- 系统字体单兵种：中文正文系统无衬线 16px/1.9；系统衬线只给英文词头与展示数字；IPA 一律 `.ipa` 等宽（0.01em）
- 纸面描边 ≤1px（例外：书眉双线 / tab 下划线 / 进度刻线 3px、批注章双环），盒角 4px、控件角 3px
- 抬升只声明一次（纸页浮于深色书桌）；编排动作只有一个（批注章落纸），内容动画全走 motion tier
- 状态从不只靠颜色：✓ / ✗ / ▶ 实心三角 / 描边纹样三重编码
- 深色壳保留原世界：每屏唯一发光 CTA、玻璃卡唯一容器、绿/琥珀/红状态色（仅暗面）
- 无角色化成长系统；动效分层：状态反馈 → 氛围层（档位）→ 完成时刻

## Colors

调色板按世界分两层：**纸面两支笔 + 纸墨中性色** 是教程面的全部；**霓虹意图色 + 夜色中性** 服务遗留深色壳。

### Primary

- **Rubric 批注红** (#B3311E): 纸面唯一的功能色——朗读中、当前义项、重读音节、警示标签、错答回馈、批注章、caret。它标记「此刻要注意这里」，从不铺底、从不写长文。
  - **Rubric Deep 按压红** (#9C2919): 主按钮 hover / active 的深压色。
- **Moonlight 月光白** (#E2E8F0): 深色壳的正文与标题文字色（遗留）。

### Secondary

- **Cobalt 结构蓝** (#1E4B7A): 纸面的结构笔——书眉链接、导轨装订线与完成态、页内链接、进度刻线、行内小标（「讲解」「本课要点」）；也是纸面「已定」的状态色：答对 = cobalt 描边/底纹，焦点环 = 2px cobalt。与批注红构成纸上仅有的两支笔。
  - 深色壳的次级氛围色为 **Aurora Violet 极光紫** (#7C4DFF)，承载文字时只用 lit 变体 (#A98BFF, `violet-lit`, ≥5.5:1)；本色只上边框、填充、光晕与 ≥18.66px 粗体大字。

### Tertiary

- **Pulse Pink 脉冲粉** (#FF4D9D): 深色壳的庆祝点缀（完成时刻、渐变收尾），稀缺使用；承载文字只用 #FF80B5 (`pink-lit`, ≥4.5:1)。纸面不用粉。

### Semantic（深色壳专用）

- **Pass Green** (#00E676) 答对/达成、**Signal Amber** (#FFB300) 提醒、**Miss Red** (#FF4D6D) 错误。纸面不引入独立状态色——状态由 cobalt（已定）/ rubric（当下、错）+ 形状编码表达。状态色只说状态，不作装饰。

### Neutral — 纸面

- **Bone 骨白纸** (#F7F2E8): 纸页地色（`.edu-sheet`）。
- **Bone2 纸面区块** (#EFE6D2): 边注卡、警示框、进度卡、选中底（多以 /40–/70 透明度上）。
- **Paper Fill 填写线底** (#FDFBF5): 输入框与答题选项的更亮一档纸。
- **Rule 发丝线** (#D8CFBC): 一切分界——栏线、盒边、未选中描边、滚动条。
- **Paper Ink 正文墨** (#16130F): 纸上正文与标题。
- **Colophon 版本墨** (#4A443B): 次级说明、页边批注、脚注（纸地 ≥4.5:1）。

### Neutral — 深色壳（遗留）

- **Abyss Navy** (#0B1020) 页底渐变起点、**Deep Field** (#111936) 中段、**Ink Black** (#070B18) 最深层；**Dusk Slate** (#CBD5E1) 次级文字、**Mist Slate** (#94A3B8) 暗面允许的最暗文字色；**Glass Surface** (rgba(255,255,255,0.06)) 与 **Glass Hairline** (rgba(255,255,255,0.12)) 是玻璃卡的填充与描边。

### Named Rules

**The Two Pens Rule（纸面双笔规则）.** 纸上只有两支笔：批注红说「此刻/注意」（朗读、当前、重读、警示、错、章），结构蓝说「结构/已定」（书眉、导轨、链接、进度、答对、完成）。永不引入第三种功能色，永不让笔色铺满大面积底。

**The One Glow Rule（深色壳）.** 发光（glow 阴影 + 渐变描边）只授予一屏之中唯一的主行动点及其焦点态；同屏第二个发光元素必须熄灭，降为幽灵按钮或文字链接。

**The State Colors Rule（深色壳）.** 绿、琥珀、红只说状态，不说别的；需要强调时优先回到青色的意图语义。

## Typography

**Display / Body Font:** 同一个系统字体栈（-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Microsoft YaHei", system-ui, sans-serif）——中英文正文同族。
**Serif Font:** 系统衬线（ui-serif, Georgia, Cambria, "Times New Roman", Times, serif）——英文词头、义项编号、音节与展示数字。
**Label/Mono Font:** ui-monospace, SFMono-Regular, Menlo, Consolas——IPA 转写数据（`.ipa`，letter-spacing 0.01em）与等宽数字。

**Character:** 一部学生词典的排印：标题与词头靠字重和字体族拉开层级，不靠花活；中文正文 16px/1.9 恒静宽舒，行宽封顶 68ch。不加载任何外部字体是硬约束：离线可用、零请求。

### Hierarchy

- **Page Title 卷首题名** (700, 26px → md 32px, line-height ~1.25): 课程页与实验室的 h1，标题自身压场，下接一句 15px 说明。
- **Entry 词条行** (700, 21px → md 25px): 步题以词目姿态登场——义项号（serif 红）+ 题头 + 英文词头（serif 斜体 18px semibold）+ IPA（`.ipa` 13px colophon）+ 朗读钮。
- **Narration 讲解正文** (400, 16px, line-height 1.9, max 68ch): 阅读栏本体，行内 13px cobalt 小标「讲解」领起，恒静无饰。
- **Margin Note 栏外批注** (400, 13px, line-height 1.85, colophon): 页边 apparatus，仅以 `border-t` 发丝线分隔，行内粗体 cobalt 标签（键位/读法/发音/进度）。
- **IPA 展示** (700, 13px 行内 → text-6xl/7xl = 60→72px 实验室大号音标): 所有转写数据一律 `.ipa` 等宽。
- **Label 行内小标** (600, 12–13px, cobalt): 「讲解」「本课要点」「本课目录」等——走行内或标题下方，**绝不做眉标（kicker/eyebrow）**。
- **遗留壳层级（仍在用）:** Display (700, clamp 36→60px)、Title (700, 24→30px)、Body (400, 14→16px)、Label (600, 12px, uppercase, 0.2em)、Mono (400, 14px)。

### Named Rules

**The IPA Data Rule.** 一切 IPA 转写与音标数据都是数据不是词头：一律 `.ipa` 系统等宽（13px 起，实验室展示到 60–72px），不进衬线。系统衬线只给英文词头与展示数字——契约写「只给英文词头」，实际建造还把义项编号、音节块、章面文字交给衬线（build 为准，此处记录其实际用法）。

**The Floor Rule.** 12px 与 4.5:1 是任何文字（含微标签、图表刻度）的地板，不是目标；暗面正文最暗只到雾板岩 #94A3B8，纸面次级墨最深只到 colophon #4A443B。底线由 `npm run audit:floor`（scripts/audit-floor.mjs：对比度/字号/触控/h1/重复 id 逐路由审计）把守，已并入 `npm run verify` 门禁。

## Layout

**两个空间模型并存:**

- **纸面（教程面）:** 纸页落在 `container-page`（1240px 居中，外边距 16px / ≥768px 32px）之内，四周是深色书桌。课程页三栏栅格：168px 义项导轨（装订线贯穿，md 以下转为页顶横排）｜弹性阅读栏（px-5 py-6 / md:px-8 py-8，正文 68ch）｜232px 栏外 apparatus（xl 才现身，sticky top-24）。实验室同构制式、槽位按内容裁：三 tab 分卷行（选中 = 3px 批注红下划线）→ 380px 音素索引表 + 主栏词条页 + 208px 页边批注（xl）。书眉 `border-b-[3px] border-double` 压顶，左面包屑右动作 + 3px 刻线进度。
- **深色壳（遗留）:** 64px 吸顶玻璃 header → 面包屑 → PageIntro → 内容 → NextStepBar；<1024px 由 56px 五格底部导航接管，页底预留 66px。`/methods`、`/lab` 路由静音 Backdrop 与 ParticleField，其余路由照常。

**栅格与节奏:** 纸面区块间距以 24–32px 与发丝线分隔；首页区块 40px、内部 16–24px（遗留）。移动端一律单列，文字列是唯一不可压缩的主导列。

**断点:** sm 640 / md 768 / lg 1024 / xl 1280 为主；1360px 是遗留「超宽屏低频入口」例外断点。

### Named Rules

**The Single Focus Rule.** 每屏只有一个前进方向：纸面是页眉右侧唯一主动作 + 页脚「下一步/完成本课」；深色壳是唯一发光主 CTA。桌面主导航 ≤5 项；同一决策点可见选项 ≤4。

**The No-Squeeze Rule.** 低于 640px 时页头标题与推进按钮必须上下堆叠，禁止并排挤压成竖排窄字条；320px 起不允许任何横向溢出，正文被容器裁切即算缺陷（纸面导轨小屏横排滚动即此规则的实现）。

## Elevation & Depth

系统是**分世界的混合**：纸面近乎全平——深度靠发丝线、纸色档差（bone / bone2 / paper-fill）与书页本身；深色壳靠玻璃模糊与光晕。纸面上唯一的抬升是页面本身。

### Shadow Vocabulary

- **Sheet Lift 纸页抬升** (`box-shadow: 0 24px 64px rgba(0, 0, 0, 0.5)`): `.edu-sheet` 专属——纸页浮在深色书桌上，全系统只此一次，纸面内部任何元素不再投影。
- **Card Lift 卡片浮影（遗留壳）** (`0 8px 32px rgba(0,0,0,0.35)`): 玻璃卡默认。
- **Intent Glow 意图光晕（遗留壳）** (`0 0 24px rgba(0,229,255,0.18)` + 外圈紫): 主 CTA hover/焦点。
- **Focus Ring 焦点环:** 纸面 = 2px cobalt 描边、offset 2px、圆角 2px（`.edu-sheet :focus-visible` 统一给）；深色壳 = 2px 青环 offset 3px。永不移除。

### Named Rules

**The Single Lift Rule.** 抬升只声明一次：只有 `.edu-sheet` 携带阴影；纸面内部一律平贴——层叠用发丝线与纸色档差表达，不叠影、不叠模糊、不叠第二层独立背景。

## Shapes

- **纸面圆角家族:** 2px 微记号（小徽标）→ 3px 控件（按钮、输入、导轨项、答题选项、chip）→ 4px 纸页与盒（sheet、警示框、进度卡）→ 全圆（批注章、朗读钮、纸面 chip）。方正、克制，像印刷表单。
- **描边（纸面）:** 发丝线 1px（#D8CFBC）是一切默认边界。**≤1px 的禁令有受批的 3px 例外**：书眉/卷首双线（`border-double` 3px）、分卷 tab 选中下划线 3px、进度刻线 3px、批注章双环 3px。选中/答对换 cobalt 描边，当前/错答换 rubric 描边。
- **遗留壳圆角家族:** 6 → 8 → 12 → 14（按钮/输入）→ 16 → 24（玻璃面板）→ pill。发丝描边 1px 白 12% 是默认边界。
- **形态语言:** 纸上可点的像印刷控件（方角、细线、按下微陷），装内容的像纸块（4px 角、发丝线）；深色壳可点的像胶囊，装内容的像玻璃卡。

## Components

### Buttons

**Character（纸面）:** 印刷表单里的控件——发丝线描边、方正圆角、按下微陷（active:translate-y-px）、无辉光；触控上下文 min-height 44px。

- **Paper Default:** 透明底 + paperink 文字 + paperink/60 描边（`rounded 3px`, padding 8×16px），hover 翻转为实底（bg-paperink 文字 bone）。
- **Paper Primary:** 批注红实底 + 米白字（#FBF6EC），hover 转 #9C2919——只授予本页唯一的主行动（完成本课、去费曼关）。
- **Paper Ghost:** 无描边 colophon 文字，hover 出发丝线——与主动作竞争的次级动作一律降为它。
- **Legacy Neon（深色壳）:** 14px 圆角渐变描边发光主按钮、白 5% 幽灵按钮；hover 微起 1px、按压 0.96 回弹。

### Chips（纸面）

EduChip：全圆、发丝线描边、12px colophon 文字；选中 = 批注红实底米白字（`#B3311E`）。深色壳筛选 chip 维持白 5% 底 + 选中青底 10%。

### Cards / Containers

- **EduSheet 纸页（签名）:** `background #F7F2E8` + `color #16130F` + caret 批注红 + 4px 圆角 + 唯一抬升阴影；`::selection` 红染、`:focus-visible` 青环、`.edu-scroll` 发丝线滚动条都在此作用域内统一。是教程面的世界地，纸内不再套有独立背景的容器。
- **EduCallout 警示/辨析框:** 1px 发丝线盒 + bone2/70 底 + 4px 角；标签行内（note = cobalt，warn = rubric），绝不做眉标。
- **Legacy Glass Card（深色壳）:** 白 6% 面 + 发丝描边 + 24px 圆角 + 20px 模糊 + 顶边高光；卡中叠卡仍是禁令。

### Inputs / Fields

- **edu-input（纸面）:** paper-fill 底、1px 发丝线、3px 角、min-height 44px、padding 8×12px、14.5px/1.7；hover 描边转深（#bfb3a0），焦点由 `.edu-sheet` 统一给 2px cobalt 环。答对/答错在纸面 = cobalt / rubric 描边与底纹 + ✓/✗ 图标 + shake（0.42s）。
- **input-neon（深色壳）:** 白 5% 底、14px 角，focus 青环微光，is-correct 绿、is-wrong 红 + shake。

### Navigation

- **纸面书眉 RunningHead（签名）:** `border-b-[3px] border-double border-rule` 压顶，左 = 面包屑（`tone="paper"`：当前段 rubric，hover cobalt），右 = 3px 刻线进度（rule 底 + cobalt 填充，500ms ease-out-expo）+ 步序 tabular 计数 + 行内动作。
- **义项导轨 EduRail（签名）:** 左栏装订线（1px rule 竖线，cobalt 高亮按进度伸长）；每步 = 编号圆标（当前 rubric 描边红号 / 完成 cobalt 实底白号 / 未到 rule 描边）+ 状态形状（当前 ▶ 实心三角、完成 ✓、未到空号）——状态从不只靠颜色。小屏转页顶横排。
- **分卷 Tab（实验室）:** 发丝线行内 tab，选中 = 3px 批注红下划线 + paperink 粗体 + rubric 图标；min-height 44px。
- **遗留壳导航:** 64px 吸顶玻璃条，项 12px 圆角 13px 字，激活青字 + 渐变下划线，≤5 项；<1024px 五格底部导航；方向感三件套（skip link / 面包屑 / 激活态）全局有效。

### Signature Components

- **EduEntry 词条行:** 义项号（serif 20px 粗体红）+ 步题（21/25px 粗体墨）+ 英文词头（serif 斜体）+ `.ipa` + 朗读钮。标题自己承载重量，不戴眉标。
- **EduStamp 批注章:** 红色双环圆章（`border-[3px] border-double #B3311E`，rotate(-8deg)，opacity 0.92，serif 粗体字），落纸动画 `edu-stamp-in` 0.42s cubic-bezier(0.22, 1, 0.36, 1)——**全站唯一编排动作**，由 motion tier 决定是否挂载（off 时静态呈现）；朗读一响盖在词尾，完成本课盖「已读」。
- **SpeakButton 朗读钮:** 圆形发丝线钮（h-9 w-9，min 44px 触控），朗读中转批注红实心 + spinner，慢速档预染 cobalt/8 底。离线音频优先、语音合成兜底。
- **EduNarration 讲解:** 68ch 恒静正文 + 行内 cobalt 小标；内容型动画（口型、音节、拼装、词根树）在它上方分区播放，全部 tier-gated。
- **PageIntro（遗留壳）:** 面包屑 → 标题 → 一句说明 → 唯一「下一步」；其 kicker 用法属遗留壳，不向纸面延伸（见 Do's and Don'ts）。

## Do's and Don'ts

### Do

- **Do** 在教程面用 `.edu-sheet` 开页：骨白纸地、发丝线分区、纸页是唯一抬升；新路由先判断落在纸上还是夜里。
- **Do** 只用两支笔：批注红标「当下/功能」（朗读、当前、警示、错、章），结构蓝标「结构/已定」（书眉、导轨、链接、进度、答对）。
- **Do** 纸面描边保持 ≤1px 发丝线；3px 只出现在受批例外（书眉双线、tab 下划线、进度刻线、批注章双环）。
- **Do** 所有 IPA 转写走 `.ipa` 等宽；英文词头与展示数字走系统衬线；中文正文 16px/1.9、行长 ≤68ch。
- **Do** 状态给三重编码：颜色 + 文字/数字 + 形状（✓ / ✗ / ▶ / 描边纹样）；焦点环纸面 2px cobalt、深色壳 2px 青。
- **Do** 文字 ≥12px、对比 ≥4.5:1；触控上下文可点目标 ≥44×44px（`npm run audit:floor` 门禁把守）。
- **Do** 编排动作只留批注章；其余内容动画与状态过渡经 motion tier（完整/精简/关闭/跟随系统）与 prefers-reduced-motion 降级，动效关闭时内容仍完整可读。
- **Do** 反馈直接服务学习：对错、进度、完成可庆祝（批注章落纸只在真实完成时刻）；数值成长指标（经验、连击、天数）不出现。
- **Do** 每屏只有一个前进方向；桌面主导航 ≤5 项；低于 640px 标题与动作上下堆叠，320px 起零横向溢出。
- **Do** 发音使用同源离线音频（`public/audio/`，`gen:audio` / `check:audio` 门禁），语音合成仅兜底——永不请求外部语音服务。
- **Do** 深色壳新屏沿用原世界规则：唯一发光 CTA、玻璃卡容器、PageIntro 骨架（该壳属阶段二迁移范围，迁移前不改动其材质）。

### Don't

- **Don't** 在纸面引入玻璃、辉光、渐变、极光或第二层阴影——纸内只有 `.edu-sheet` 那一次抬升。
- **Don't** 在纸面使用眉标/kicker（全大写 + 横线的 eyebrow）；标题直接压场，小标签走行内。深色壳遗留的 kicker 用法是既有缺陷，不向任何新面延伸（见文末 drift 说明）。
- **Don't** 在纸面引入第三种功能色，或用批注红/结构蓝铺大面积底、写长段正文。
- **Don't** 用颜色单独表达状态；也不要让 IPA 数据进衬线、让词头进等宽。
- **Don't** 在纸上叠影、叠模糊、卡中叠卡；深色壳同样禁止卡中叠卡。
- **Don't** 让批注章之外的任何动效成为「编排动作」——页面进入不放彩带、不盖章。
- **Don't** 引入经验值、连击、连续天数、等级徽章等角色化成长元素——反馈只为学习，不为留存。
- **Don't** 加载任何外部字体、CDN 或追踪脚本；离线可用、零请求是硬约束。
- **Don't** 让固定元素（底部导航、吸顶头）遮挡内容，或把页头标题挤成竖排窄字条。
- **Don't** 在工具页使用营销式大图 hero——首屏必须是可执行的下一步。
