---
name: LexiMethod Academy
description: 全站是一本摊开的盒装软件参考手册——彩色分隔卡板按四段路径分章，压膜透明页承载正文，书口阶梯标签排出八门课的全书结构，打孔与页角是状态语言（压膜活页手册 / Acetate Manual，seed 9f19875c，code-led）
colors:
  # ---------- 压膜活页手册（世界地） ----------
  milk: "#F4F1E7" # 牛奶压膜地：页面底（压膜页共用地）
  leaf: "#FBF9F2" # 顶层透明页：当前阅读页、输入与答题选项底
  under: "#EDE8DA" # 下层页：非当前叶子、次级区块底
  rule: "#CFC7B2" # 发丝线：一切分界
  ink: "#17140E" # 正文墨（奶白地 ≥15:1）
  ink2: "#57503F" # 次级墨（奶白地 ≥7:1，承载说明与页边注）
  # ---------- 卡板色轮（四段路径，一章一色，满强度） ----------
  board-pathway: "#F2B700" # 通路段 · 铬黄
  board-deconstruct: "#2A4BD7" # 拆解段 · 群青
  board-encode: "#137574" # 存入段 · 深青（带内白字 ≥4.5:1 已解算）
  board-retrieve: "#357A1E" # 调用段 · 深草绿（带内白字 ≥4.5:1 已解算）
  board-capstone: "#6B3FA0" # 收官段 · 紫罗兰
  errata: "#E34234" # 朱红勘误：全站唯一保留色，只给错误的描边与标记（非文字 ≥3:1）
  errata-deep: "#C1301A" # 勘误条底：承载白字的错误面板（≥4.5:1）；不作装饰
  focus: "#2A4BD7" # 焦点环默认色（浅地）
typography:
  manual-body:
    fontFamily: "'Noto Serif SC', 'Source Han Serif SC', 'Songti SC', SimSun, Georgia, serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: "1.8"
  manual-head:
    fontFamily: "'Noto Sans SC', 'Source Han Sans SC', -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif"
    fontSize: "21px"
    fontWeight: 700
    lineHeight: "1.4"
  manual-display:
    fontFamily: "'Noto Sans SC', 'Source Han Sans SC', -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif"
    fontSize: "30px"
    fontWeight: 800
    lineHeight: "1.25"
  machine:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: "1.6"
    letterSpacing: "0.02em"
  ipa:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
    fontSize: "13px"
    fontWeight: 400
    letterSpacing: "0.01em"
rounded:
  micro: "2px"
  control: "3px"
  leaf: "4px"
  punch: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  section: "40px"
components:
  button-default:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.manual-body}"
    rounded: "{rounded.control}"
    padding: "8px 16px"
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.milk}"
    typography: "{typography.manual-body}"
    rounded: "{rounded.control}"
    padding: "9px 18px"
  leaf:
    backgroundColor: "{colors.leaf}"
    textColor: "{colors.ink}"
    typography: "{typography.manual-body}"
    rounded: "{rounded.leaf}"
    padding: "20px 24px"
  board-band:
    backgroundColor: "{colors.board-pathway}"
    textColor: "{colors.ink}"
    typography: "{typography.manual-head}"
    rounded: "0px"
    padding: "10px 20px"
  input:
    backgroundColor: "{colors.leaf}"
    textColor: "{colors.ink}"
    typography: "{typography.manual-body}"
    rounded: "{rounded.control}"
    padding: "8px 12px"
  errata-slip:
    backgroundColor: "{colors.errata-deep}"
    textColor: "#FFF6F0"
    typography: "{typography.manual-body}"
    rounded: "{rounded.control}"
    padding: "8px 14px"
---

# Design System: LexiMethod Academy

## Overview

**Creative North Star: 「压膜活页手册（The Acetate Manual）」** —— 全站是一本打开的盒装软件参考手册。四段路径是彩色分隔卡板的四个章部，每门课是一个分部；讲解落在压膜透明页上，书口的阶梯标签排出全书结构，打孔与页角就是状态语言。

世界全部语法（本方向卡锁定）：

- **卡板色轮**：一章一色满强度——通路铬黄、拆解群青、存入青、调用草绿、收官紫罗兰；朱红只留给勘误（错误、错答、危险），永不装饰。
- **压膜页分层（ply）**：叶子只有层秩没有阴影戏法——当前页是唯一全清的顶层页（leaf #FBF9F2），下层页压暗一档（under #EDE8DA）但对比度仍须过线。
- **书口阶梯标签（ForeEdge Tab Rail，签名）**：右缘竖排阶梯标签，一门课一贴，高度与课时成正比，颜色取所属段的卡板色；当前贴伸出即是当前页的卡板。移动端降为页顶横排阶梯条。
- **打孔与页角（状态语法，签名）**：选中 = 打孔圆孔（实心环）；未到 = 面朝下（反底暗色）；待办 = 半掀页角（页脚下一步入口就是一枚半掀页角）；错误 = 朱红勘误条斜压。状态永远三重编码（形状 + 文字 + 颜色），从不单靠颜色。
- **页边悬挂（hanging heads，签名）**：标题与编号悬挂在左侧页边栏（margin column），正文栏保持单一尺寸恒静；机器嗓音（等宽）只给数据——课号、步数、计时、IPA、题号。
- **铰链步进（motion）**：本站没有缓动淡入。状态变化是 90ms 两帧的铰链步（`steps(2)`），铰在打孔边；唯一编排动作是顶层页的掀角。`prefers-reduced-motion` 下全部瞬时。

反参考（从旧世界继承并重申）：拒绝白底卡片网格 + 渐变 hero + 进度环的网课站货架感；拒绝经验值 / 连击 / 天数 / 徽章等角色化成长；拒绝旧辞书版式的双栏词条排印（那是反参考，不是底稿）。

**Key Characteristics**

- 一章一色的卡板色轮 + 奶白压膜地；朱红只说错误。
- 正文单一尺寸（17px 衬线 /1.8，行长 ≤68ch），层级靠悬挂标题与字重，不靠字号阶梯。
- 中文衬线（Noto Serif SC，CDN 已放开，系统宋体兜底）承载正文；黑体承载标题；等宽承载数据与 IPA。
- 描边 ≤1px 发丝线（例外：卡板带下缘 3px、阶梯标签轮廓、打孔环 2px）；圆角 2/3/4 微家族；盒角方正如印刷表单。
- 抬升只有一种：顶层页切边的一道短硬影（无模糊），仅授予当前页。
- 状态三重编码；焦点环永在；动效分层（状态步进 → 掀角编排）。

## Colors

### 卡板色轮（四段路径，一章一色满强度）

- **Board Pathway 通路铬黄** (#F2B700)：01–02 课的卡板带与书口贴；承载文字用 ink（对比 10:1）。
- **Board Deconstruct 拆解群青** (#2A4BD7)：03 课；也是浅地上焦点环的默认色。
- **Board Encode 存入深青** (#137574)：04–06 课；带内白字 ≥4.5:1（由对比度解算微调）。
- **Board Retrieve 调用深草绿** (#357A1E)：07 课；带内白字 ≥4.5:1（由对比度解算微调）。
- **Board Capstone 收官紫罗兰** (#6B3FA0)：08 课。
- **Errata 朱红勘误** (#E34234)：错误的描边与标记（非文字 ≥3:1）；**Errata Deep 勘误条底** (#C1301A)：承载白字的错误面板（≥4.5:1），**以及浅底（milk/leaf/under）上的红色小字**（#C1301A ≈5.4:1，小字红一律用 deep）。朱红不做链接色、不做主按钮、不装饰。

### Neutral — 压膜地

- **Milk 牛奶压膜地** (#F4F1E7)：body 与一切页面底。
- **Leaf 顶层页** (#FBF9F2)：当前阅读页、输入与答题选项底。
- **Under 下层页** (#EDE8DA)：非当前叶子、次级区块底（其上文字 ≥4.5:1）。
- **Rule 发丝线** (#CFC7B2)：分界、未选中描边、滚动条。
- **Ink 正文墨** (#17140E) / **Ink2 次级墨** (#57503F)：正文与说明。

### Named Rules

**The Errata Rule（朱红唯一律）.** 朱红 #E34234 只说「这里错了」（描边与标记用 errata，承载文字的错误面板用 errata-deep #C1301A，浅底上的红色小字也用 errata-deep）。需要主行动按钮时用 ink 实底 milk 字，不用红；需要高亮时用所在章的卡板色。

**The One-Clear-Leaf Rule（顶层全清律）.** 任何时刻只有一个叶子是全清的（leaf 底）；其余内容落在 under 或卡板带上。文字若跨不清页，对比度按最暗底核算。

**The Extent Rule（书口比例律）.** 书口阶梯标签的高度与课时成正比，永不等分；八贴的总高就是全书的厚度。

## Typography

- **正文 Body**（manual-body）：Noto Serif SC 17px/1.8，行长 ≤68ch；CDN 加载（`fonts.googleapis.com`，用户已放开外部 CDN），系统 `Songti SC/SimSun` 兜底，离线打开仍可读。
- **标题 Head**（manual-display / manual-head）：Noto Sans SC 800/700，30/21px；悬挂出正文栏，落进左边距。
- **机器嗓音 Machine**（machine / ipa）：系统等宽 13px——课号、`03 / 06` 步数、计时、题号、IPA 转写一律等宽，`letter-spacing 0.02em`（IPA 0.01em）。
- **层级不靠字号阶梯**：一级标题 30、二级 21、正文 17 即止；更小的只有机器嗓音 13。眉标（kicker/eyebrow）不用——标签走悬挂位或行内。

### Named Rules

**The Machine Voice Rule（机器嗓音律）.** 一切可计数、可对位、可核验的数据（课号、步数、时长、题号、IPA）走等宽；散文永远不进等宽，数据永远不进衬线。

**The Floor Rule（底线律）.** 12px 与 4.5:1 是任何文字的地板，不是目标；正文 17px、次级墨 ink2 在奶白地 ≥7:1。底线由 `npm run audit:floor`（对比度/字号/触控/h1/重复 id 逐路由）把守，已并入 `npm run verify`。

## Layout

**全书拓扑：**

- **书口阶梯标签轨**：xl+ 右缘 sticky 竖排（8 贴，高度按课时比例，色取段色）；当前贴伸出即当前章；md 以下降为页顶横排阶梯条（横滚、不换行、贴纸自带色）。
- **书眉 Running Head**：页顶一条——左 = 手册名与当前分部（`《词汇方法手册》· 03 词根词缀`），右 = 机器嗓音步数 `04 / 06` + 3px 比例刻线；下缘卡板色 3px 压条（当前章色）。
- **课程页三栏**：180px 悬挂页边栏（单元编号与标题悬挂其中，打孔点 = 单元进度）｜压膜正文栏（leaf 底，py px 按 68ch 封顶）｜232px 页边 apparatus（xl 现身，批注、词表、实验室深链）。md 以下单列，页边栏折进页顶。
- **卡板章节带（divider board）**：每课/每段入口是一条满强度色带，标题反白/反墨压在带上，带下缘 3px 深一档——它是分部页签，不是背景装饰。
- **节奏**：区块 32–40px，内部 16–24px，发丝线分隔；移动端单列，文字列唯一不可压缩。

**断点：** sm 640 / md 768 / lg 1024 / xl 1280；320px 起零横向溢出。

### Named Rules

**The Single Focus Rule（单前进方向）.** 每屏只有一个前进方向：页脚那枚半掀页角（下一步）。桌面主导航 ≤5 项；同一决策点可见选项 ≤4。

**The No-Squeeze Rule（不挤压）.** <640px 标题与动作上下堆叠；320px 起零横向溢出；固定书口/页脚不得遮内容。

**The Shell-First Rule（壳先行）.** 每个首屏先写壳：读者在哪（书眉 + 书口贴 + 步数），标题与开篇问题，阅读栏怎么走（章内目录/悬挂标题），下一步在哪（半掀页角）。首屏没有营销大图 hero。

## Elevation & Depth

单一世界，深度只有两样：**纸色档差（leaf / milk / under）+ 发丝线**；外加世界自带的唯一投影——**顶层页切边的一道短硬影**（如 `4px 0 0 rgba(23,20,14,.10)` 的单边硬影，无模糊、无双层）。

- **Focus Ring**：浅地 = 2px solid #2A4BD7，offset 2px；卡板色带上按明度换——铬黄带上用 ink，深色带（群青/青/草绿/紫）上用 milk。永不移除。
- **禁令**：无玻璃、无辉光、无渐变、无柔和多层阴影、无卡中叠卡。

### Named Rules

**The Hinge Step Rule（铰链步进律）.** 状态切换一律 90ms `steps(2)`，铰在打孔边（`transform-origin` 靠左/靠上）；不做透明度缓动淡入，不放页面进入动画。`prefers-reduced-motion` = 瞬时。唯一编排动作：顶层页掀角（下一步入口），动效档位关闭时静态呈现。

## Shapes

- **圆角家族**：2px 微记号（角标、勘误条纹）→ 3px 控件（按钮、输入、答题选项、tab）→ 4px 叶子（卡片、盒、警示）→ 全圆只给打孔与朗读钮。
- **描边**：发丝线 1px 是一切默认边界；受批 3px 例外只有卡板带下缘、书眉章色压条、进度刻线；打孔环 2px。
- **形态语言**：可点的像印刷控件（方正、细线、按下微陷 `active:translate-y-px`），装内容的像叶子（4px、发丝线、切边短硬影只给当前页）。

## Components

### Buttons

- **Default**：透明底 ink 字 + ink/50 描边，3px 角；hover 翻实底（ink 底 milk 字）。
- **Primary**：ink 实底 milk 字——授予每屏唯一的主行动（开始第一课 / 完成本单元 / 提交出门条）。**不用朱红做主按钮。**
- **Ghost**：无描边 ink2 字，hover 出发丝线；与主行动竞争的次级动作一律降为它。
- **触控**：上下文可点目标 ≥44×44px。

### States（打孔与页角）

- **Selected 选中** = 打孔实心环（ring + 实心点）+ 粗体；Disabled 未到 = 面朝下（under 底 ink2/50，纹样反白线）；Pending 待办 = 半掀页角（右上 12px 翻角三角）；Error 错误 = 朱红勘误条（斜压或贴顶，白字）+ ✗。
- 答对 = 章色描边 + ✓ 实心勾 + 「答对」文字；答错 = 勘误条 + ✗ + 解析。三重编码，缺一不可。

### Signature Components

- **ForeEdgeTabRail 书口阶梯轨（签名）**：右缘 8 贴，高度按课时比例，段色；当前贴伸出、`aria-current`；小屏横排阶梯条。
- **BoardBand 卡板章节带（签名）**：满强度段色带，标题反色压带，下缘 3px 深一档；带内机器嗓音课号。
- **PunchedDot 打孔点（签名）**：页边栏与单元列表的进度孔——空孔未到 / 实心孔完成 / 半环进行中。
- **HingeCorner 页脚半掀页角（签名）**：右下折角按钮 = 下一步；hover 掀起（90ms 步进），落回即点击。
- **ErrataSlip 勘误条（签名）**：朱红条白字，只承载错误反馈与危险确认。
- **SpeakButton 朗读钮**：全圆发丝线钮（min 44px），朗读中转 ink 实心；离线音频优先、语音合成兜底。
- **MachineCounter 机器计数**：等宽 `04 / 06`、计时、题号——全站数字的唯一姿态。

## Do's and Don'ts

### Do

- **Do** 新屏直接落压膜地（body = milk #F4F1E7），阅读面用 leaf，次级区块用 under；卡板色只出现在带、贴、描边与小面积反色块。
- **Do** 标题悬挂进左边距，正文栏单一 17px 衬线 /1.8、≤68ch；数据走等宽。
- **Do** 状态给三重编码（形状 + 文字 + 颜色）；朱红只给错误；焦点环永在。
- **Do** 状态切换用 90ms 铰链步；唯一编排动作是掀角；动效关闭时内容完整可读。
- **Do** 书口贴高度按课时比例；当前贴伸出并标 `aria-current`。
- **Do** 文字 ≥12px、对比 ≥4.5:1、触控 ≥44×44、单路由单 h1、无重复 id（`npm run audit:floor` 门禁）。
- **Do** 发音用站内离线音频（`public/audio/`，`gen:audio`/`check:audio` 门禁），语音合成兜底。
- **Do** 允许且仅允许外部字体 CDN（Google Fonts，Noto Serif SC/Noto Sans SC，带系统兜底与 preconnect）；其余外部请求（追踪、在线服务）仍为零。

### Don't

- **Don't** 复活旧辞书版式（双栏词条、批注章、骨白纸地）或旧深色霓虹壳（玻璃、辉光、渐变）。
- **Don't** 用朱红做主按钮、链接或装饰；不引入卡板色轮之外的第二套强调色。
- **Don't** 做卡片网格货架、进度环、营销大图 hero；首屏永远是可执行的下一步。
- **Don't** 用透明度缓动做状态过渡（用铰链步）；页面进入不放动画。
- **Don't** 用颜色单独表达状态；不让散文进等宽、不让数据进衬线。
- **Don't** 引入经验值、连击、连续天数、等级徽章——反馈只为学习。
- **Don't** 软阴影多层叠加、卡中叠卡、玻璃拟态。
- **Don't** 让固定书口/页脚遮挡内容，或把页头标题挤成竖排窄字条。
