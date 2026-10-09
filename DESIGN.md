---
name: LexiMethod Academy
description: 全站排成一版瑞士国际主义版面——真·全出血白纸地、Helvetica 巨号步位、衬线正文 68ch、黑白灰 + 信号红，五段路径色只作点缀
colors:
  # ========== 地与层：严格黑白灰 ==========
  milk: "#FFFFFF" # 白纸地：body 与一切页面底
  leaf: "#FFFFFF" # 工作面：与地同白，靠发丝线与灰面板分层
  under: "#F1F1F1" # 灰面板：次级区块、页边批注与选中底
  rule: "#D9D9D9" # 发丝线：一切轻分界与刻度轨道
  ink: "#111111" # 正文墨（白地 ≥17:1）与唯一实底行动色
  ink2: "#555555" # 次级墨（白地 ≥7:1）：说明、页边注、未选中
  focus: "#2A4BD7" # 焦点环；同值即群青段色与答题蓝
  # ========== 信号红：只说「错了」 ==========
  errata: "#E34234" # 信号红：勘误、对立、错的描边与标记（非文字 ≥3:1）
  errata-deep: "#C1301A" # 勘误条底与浅底上的红字（≥4.5:1）
  # ========== 五段路径色：只作点缀 ==========
  board-pathway: "#F2B700" # 通路段 · 铬黄（01–02）
  board-deconstruct: "#2A4BD7" # 拆解段 · 群青（03）
  board-encode: "#137574" # 存入段 · 青（04–06）
  board-retrieve: "#357A1E" # 调用段 · 草绿（07）
  board-capstone: "#6B3FA0" # 收官段 · 紫罗兰（08）
typography:
  display:
    fontFamily: "'Helvetica Neue', Helvetica, Arial, Inter, 'Noto Sans SC', 'Source Han Sans SC', -apple-system, 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif"
    fontSize: "32px"
    fontWeight: 800
    lineHeight: "1.25"
    letterSpacing: "normal"
  section:
    fontFamily: "'Helvetica Neue', Helvetica, Arial, Inter, 'Noto Sans SC', 'Source Han Sans SC', -apple-system, 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif"
    fontSize: "24px"
    fontWeight: 800
    lineHeight: "1.15"
    letterSpacing: "normal"
  giant-numeral:
    fontFamily: "'Helvetica Neue', Helvetica, Arial, Inter, 'Noto Sans SC', system-ui, sans-serif"
    fontSize: "40px"
    fontWeight: 800
    lineHeight: "1"
    letterSpacing: "-0.025em"
  apparatus-numeral:
    fontFamily: "'Helvetica Neue', Helvetica, Arial, Inter, 'Noto Sans SC', system-ui, sans-serif"
    fontSize: "44px"
    fontWeight: 800
    lineHeight: "1"
    letterSpacing: "-0.025em"
  lede:
    fontFamily: "'Helvetica Neue', Helvetica, Arial, Inter, 'Noto Sans SC', 'Source Han Sans SC', -apple-system, 'PingFang SC', system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: "1.85"
  body:
    fontFamily: "'Noto Serif SC', 'Source Han Serif SC', 'Songti SC', SimSun, Georgia, serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: "1.8"
  label:
    fontFamily: "'Helvetica Neue', Helvetica, Arial, Inter, 'Noto Sans SC', system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 700
    lineHeight: "1.5"
  machine:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: "1.6"
    letterSpacing: "0.02em"
  ipa:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
    fontSize: "13px"
    fontWeight: 600
    letterSpacing: "0.01em"
rounded:
  none: "0px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  block: "32px"
  section: "40px"
  page-gutter: "max(16px, 3.5vw)"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.milk}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "10px 20px"
    height: "44px"
  button-default:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "8px 16px"
    height: "44px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink2}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "8px 12px"
    height: "44px"
  input:
    backgroundColor: "{colors.leaf}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "8px 12px"
    height: "44px"
  chip:
    backgroundColor: "{colors.leaf}"
    textColor: "{colors.ink2}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "6px 14px"
    height: "44px"
  chapter-band:
    backgroundColor: "{colors.leaf}"
    textColor: "{colors.ink}"
    typography: "{typography.section}"
    rounded: "{rounded.none}"
    padding: "12px 16px"
  apparatus-panel:
    backgroundColor: "{colors.under}"
    textColor: "{colors.ink2}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "12px 16px"
---

# Design System: LexiMethod Academy

## Overview

**Creative North Star: 「瑞士排版机（The Typographic Machine）」** —— 全站是一版排好的瑞士国际主义版面：网格即秩序，字体即层级，颜色只做路标。它不是一本手工书，也不是一间课程货架，而是一台排版机——大屏打开课程页，版心铺满整个窗口，编号导轨的巨号 Helvetica 步位与黑块当前标一齐左压下来，像在看一版排好的海报，而不是一根中间的竖棍。

白纸 `#FFFFFF` 满地全出血，黑 `#111111` 承字，灰面板 `#F1F1F1` 分层，发丝 `#D9D9D9` 划界。大面积只有黑白灰与信号红；五段路径色（铬黄 / 群青 / 青 / 草绿 / 紫罗兰）被降为点缀，只出现在编号方片、3px 细条、右缘页签与答题状态上。层级靠三样东西：Helvetica 粗体齐左的字级、线宽的阶梯（1px 发丝 → 2px 实黑 → 3px 段色细条）、以及等宽的机器嗓音（课号、步数、计时、IPA）。正文永远安静：中文衬线 17px/1.8、68ch 行宽，背后没有东西在表演。

反参考（两轮旧世界 + 网课站品类默认）：拒绝压膜活页手册的纸物拟态（书口贴、打孔、掀角、暖纸色地），拒绝辞书版式的双栏词条排印，拒绝白底卡片货架 + 渐变 hero + 进度环的网课站观感，拒绝经验值 / 连击 / 徽章等角色化成长。

**Key Characteristics**

- 真·全出血版心：容器无 max-width，行宽靠 68ch 封顶，绝不居中一根竖棍。
- 黑白灰地 + 信号红说错；五段路径色只作点缀（编号方片、3px 细条、页签、答题状态）。
- 无衬线承题（Helvetica 系，extrabold 齐左），衬线承文（Noto Serif SC 17/1.8），等宽承数据（`.machine` 13px）。
- 方角归零、阴影归零、渐变归零；分层只靠发丝线与灰面板。
- 状态三重编码（形状 + 文字 + 颜色）；刻度方块与比例条是唯一的进度语言。
- 动效只有一样：`.hinge` 90ms `steps(2)` 硬切；无淡入、无页面进场。

## Colors

调色板严格黑白灰，红只说「错」，蓝只说「答题 / 焦点」，五段色只做小面积路标。

### Primary

- **Ink 正文墨** (#111111)：一切正文与标题；也是唯一实底行动色（主按钮 = 黑底白字）与当前态黑块（导航当前项、步位当前格）。

### Secondary

- **Errata 信号红** (#E34234) / **Errata Deep 勘误条底** (#C1301A)：只给 勘误 / 对立 / 错 语义——错误描边、错答标记、危险确认条（errata-deep 承载白字，浅底上的红小字也用 deep）。不做链接色、不做主按钮、不装饰。
- **Focus 群青** (#2A4BD7)：焦点环唯一颜色，同时是答题（quiz）语义色与拆解段段色——三者同值是有意的：它只在「机器在问你」或「你在看这一步」时出现。

### Accent — 五段路径色（只作点缀）

- **通路铬黄** (#F2B700)：01–02 课；**拆解群青** (#2A4BD7)：03 课；**存入青** (#137574)：04–06 课；**调用草绿** (#357A1E)：07 课；**收官紫罗兰** (#6B3FA0)：08 课。
- 出现位置仅限：编号方片（12×12）、3px 细条（章节带下缘 / 书眉 sliver / 当前页签底边）、ForeEdge 当前页签底、答题对错状态。**绝不做整幅色带、区块底色或内容背景。**

### Neutral — 白纸地

- **Milk / Leaf 白纸地** (#FFFFFF)：页面底与工作面同白，靠线与灰分层。
- **Under 灰面板** (#F1F1F1)：次级区块、页边 apparatus、选中底。
- **Rule 发丝线** (#D9D9D9)：一切轻分界、刻度轨道、未选中描边。
- **Ink2 次级墨** (#555555)：说明文字、页边注、未选中标签。

### Named Rules

**The Errata Rule（朱红唯一律）.** 红只说「这里错了」。需要主行动时用 ink 实底 milk 字；需要高亮时用所在段的段色或加粗，永不用红。

**The Accent Rule（段色点缀律）.** 五段路径色在任一屏的总面积只到「点缀」量级——方片、细条、页签、答题状态；大面积永远是白 / 灰 / 黑。段色不承载成段文字（铬黄带上用 ink，其余深色带上用 milk）。

**The One-Accent-Per-Block Rule（一段一色）.** 一个区块只出现一个段色：它由所在段决定，不与其他段色同框竞逐。

## Typography

**Display Font:** 'Helvetica Neue' → Helvetica → Arial → Inter → 'Noto Sans SC'（标题与界面，extrabold）
**Body Font:** 'Noto Serif SC' → 'Source Han Serif SC' → 'Songti SC' → SimSun → Georgia（中文正文）
**Label/Mono Font:** ui-monospace → SFMono-Regular → Menlo → Consolas（`.machine` 机器嗓音与 `.ipa`）

**Character:** 粗黑体承题、衬线承文、等宽承数据。标题齐左、行距紧（1.15–1.25）；正文衬线慢下来（1.8）；所有可计数、可核验的数字回到等宽的 `tabular-nums`。全站字号阶梯（实测）：12 · 13 · 14 · 15 · 16 · 17 · 18 · 19 · 20 · 22 · 24 · 26 · 30 · 32 · 36 · 40 · 44。

### Hierarchy

- **Giant Numeral 巨号步位** (800, 40px / 装置栏 44px, line-height 1, letter-spacing −0.025em, tabular-nums)：编号导轨的 01–09 与页边 apparatus 的课号；当前项黑块反白。
- **Display 页面主标题** (800, 26px → 32px @md, 1.25)：每路由唯一的 h1（课程总目 / 课题 / 音标实验室 / 设置 / 404）。
- **Headline 章题 / 步题** (800, 24px 章题；22px → 26px 步内 h2, 1.15)：分段章节带与步内小节题。
- **Title 行题** (700, 17px → 19px @md, 1.4)：课程行 h3、面板小标题。
- **Lede 导语** (400, 15px/1.85, ink2, ≤68ch)：题名下的一句话。
- **Body 正文** (400, 17px/1.8 衬线, ≤68ch)：中文讲解；**Body Small** (14–16px/1.8)：行内说明与次级正文。
- **Label 界面标签** (700, 14px 按钮 / 13px 导航, 1.5)：走 display 字族。
- **Machine 机器嗓音** (500, 13px/1.6, +0.02em, tabular-nums)：课号、`04 / 08` 步数、时长、题号、进度计数；微标签 12px 为全站地板。**IPA** (600, 13px 起，图表 15px、示范 24–30px, +0.01em)。

### Named Rules

**The Machine Voice Rule（机器嗓音律）.** 一切可计数、可对位、可核验的数据走等宽 13px；散文永远不进等宽，数据永远不进衬线。

**The Left-Flush Rule（齐左律）.** 标题、标签、数字一律齐左，字距不放宽（巨号反收紧 −0.025em）；只有全屏空态 / 载入态可以居中。

**The Floor Rule（底线律）.** 12px 字号、4.5:1 对比、44×44 触控、单路由单 h1、零重复 id 是地板不是目标，由 `npm run audit:floor` 逐路由把守并入 `npm run verify`。

## Layout

**全出血版心（容器）：** 页面容器 `width: 100%` + `padding-inline: max(16px, 3.5vw)`——**无 max-width，边距随窗口比例放大**；网格、表格、列表铺满可用宽。行长由组件内部的 68ch 封顶（导语、正文、行副题），**度量靠 ch 封顶，从不靠居中容器**。

**首屏拓扑（1440–1920）：** 报头满宽 64px（字标墨方 Lx + 导航 + 下缘 1px 实黑线，当前项 3px 墨条）→ 章节带（左面包屑 / 右机器步数 + 下缘 3px 段色 sliver）→ 课程三栏网格 `136px / minmax(0,1fr) / 224px`（巨号步位导轨 / 阅读栏 / 灰面板 apparatus）+ 右缘 ForeEdge 索引轨 112px。

- **导轨（StepRail）：** 桌面悬挂左栏 sticky（top-24），巨号 01–09，当前项黑块反白；`lg` 以下降级为顶内横滚刻度条（不换行、当前保持在视野内）。
- **阅读栏：** 白底、发丝线分隔、68ch 封顶；上留白大于下（题名 `pb-5` 后接 `mt-5` 网格）。
- **灰面板边注（apparatus）：** `xl` 现身 224px——课号巨号、进度比例条、页边深链、事实；每块 `#F1F1F1` 底 + 顶线（首块 2px 实黑，其余 1px 发丝）。（方向契约写 240px，实建 224px：紧贴 112px ForeEdge 轨的取舍，已接受。）
- **ForeEdge 索引轨：** `xl` 以下不渲染；上层功能页签（实验室 / 设置），下层 8 门课阶梯签，**签高 ∝ 课时**（`44 + (分钟−30)×1.5` px，均 ≥44），当前签取段色底 + 3px 深一档底边，已完成带 ✓ 方块。
- **实验室：** `xl` 网格 `minmax(0,1fr) / 208px`（主栏 / 栏外批注，仅发丝线分隔）；音标表 380px + 示范栏。
- **移动端：** 单列，导轨退为顶刻度条，底部导航常驻 3 项（当前项 3px 墨色刻线），报头菜单 2×2 网格 + 2px 实黑收口；320px 起零横向溢出。

**节奏：** 区块 32–40px，内部 16–24px，微间距 4–12px；发丝线做分隔，不用留白硬撑。**断点：** sm 640 / md 768 / lg 1024 / xl 1280。

### Named Rules

**The Full-Bleed Rule（全出血无上限）.** 页面级容器一律 `width: 100%`，禁止 max-width 与居中版心；行长只用 ch 封顶。

**The Extent Rule（刻度比例律）.** 时长 / 状态 / 进度永远是「发丝轨道 + 实心填充」的比例条（`#D9D9D9` 轨 + ink/ink2 填充，3px 或 6px），宽度 ∝ 真实数值——课时条、单元进度、音标已学数、书签高度同源，永不等分、永不环形。

**The Margin Apparatus Rule（灰面板边注律）.** 补充事实、深链、词表走右缘灰面板（`#F1F1F1` + 顶线），不进正文栏；正文栏因此恒静、恒 68ch、背后无物。

## Elevation & Depth

**零阴影。** 全站没有一处 `box-shadow`，也没有玻璃、辉光或多层堆叠。深度只由三样平面手段表达：**线宽阶梯**（1px `#D9D9D9` 发丝 → 1px `#111111` 实线 → 2px 实黑压顶 / 收口 → 3px 段色细条）、**明度分档**（白 `#FFFFFF` → 灰面板 `#F1F1F1`）、以及**实心墨块**（当前项、主行动、字标）。同白的地与面之间，发丝线就是边界。

- **Focus Ring：** `2px solid #2A4BD7`，offset 2px（壳件）/ 3px（页面级 `:focus-visible`），方角随元素，永不移除。
- **Stroke Ladder 线宽阶梯：** 发丝 1px 是默认；2px 实黑只给页脚压顶、移动菜单收口、error 卡与 apparatus 首块顶线；3px 只给段色细条与当前态刻线。

### Named Rules

**The Flat Rule（零阴影律）.** 抬升不是这个世界的词汇。想区分层次就换线宽或换灰档，不要加影。

## Shapes

**圆角归零。** 全站 `border-radius: 0`，零 `rounded-*` 工具类，滑钮、方片、页签、面板、按钮全部方角；也没有圆形——状态标记是**刻度方块**（12px 方块：空心未到 / 半格进行中 / 实心完成，2px 描边），选择框是 16px 方框 + ✓，段色方片是 12×12 的正方形。

- **描边：** 发丝 1px `#D9D9D9` 是一切默认边界；控件升 1px ink；选中态升 2px ink 或改 2px ink 外框（音标表选中格）；3px 是受批的段色 / 当前态例外。
- **几何语言：** 可点的像印刷控件（方正、细线、按下 `translateY(1px)` 微陷）；装内容的像版面块（白底 + 发丝线，或灰面板 + 顶线）；发丝线网格（单元格自带右 / 下细线，行尾留白不出灰块）是表格与图表的默认形态。

### Named Rules

**The Zero-Radius Rule（方角律）.** 任何元素的圆角 >0 即违规；需要「圆」的语义（完成、当前、选中）一律改用方块的填充状态表达。

## Components

**The Shape-First Rule（三态靠形状）.** 任何状态都三重编码——形状（空心 / 半格 / 实心 / ✓ / ▶ / 黑块）+ 文字（aria-label 与可见标签）+ 颜色（仅作第三通道）。绝不只靠颜色。

**The Hinge Step Rule（铰链步进律）.** 状态切换是唯一动效：`.hinge` 90ms `steps(2)` 硬切（transform / background / border / color），无透明度缓动、无页面进场、无位移编排；`prefers-reduced-motion` 与 `data-motion="off"` 下全部瞬时。内容型动画（口型、音节、拼装、词根树）属教学内容，不属版面编排。

**The Giant-Numeral Rule（巨号步位律）.** 导轨编号 40px extrabold、页边课号 44px，`tabular-nums`；当前步 = 黑块反白（形状通道），已完成 = ✓，未到 = 空位。数字本身就是导航。

**The Chapter-Over-Row Rule（章题压行题）.** 分段章题（24px extrabold）永远压过行题（17–19px bold）：章题坐在白底 + 3px 深一档段色下缘的章节带上，行题落在发丝线行里；带内只有一枚 12×12 段色方片与一段机器计数。

### Buttons

- **Shape:** 方角（0），min-height 44px，边框 1px，按下 `translateY(1px)`。
- **Primary（每屏唯一）:** ink 实底 `#111111` + milk 字 `#FFFFFF`，display 14px bold，padding 10px 20px；hover 转 ink2 `#555555`。**朱红永不充当主按钮。**
- **Default:** 透明底 + 1px ink/60 描边，ink 字；hover 翻实底（ink 底白字）。
- **Ghost:** 无描边 ink2 字，hover 出发丝线；与主行动竞争的次级动作一律降为它。
- **Focus:** 全局 `2px #2A4BD7` 焦点环；disabled = opacity 45%。

### Inputs / Fields

- **Style:** `.edu-input` —— 1px 实黑描边、方角、白底、min-height 44px、padding 8px 12px、14.5px/1.7；hover 转灰面板底。
- **Focus:** 全局 2px `#2A4BD7` 焦点环（见下方非归档项：少数练习输入用边框变色替代，属未收口的漂移）。
- **Option / Filter:** 方角 1px 描边块；未选 = `#D9D9D9` 描边白底 ink2 字，选中 = ink 描边 + `#F1F1F1` 底 + ✓（形状 + 颜色 + 文字）。

### Cards / Containers

- **Corner Style:** 半径 0。
- **Background:** 阅读面与列表 = 白 `#FFFFFF` + 1px 发丝线；次级区块与页边 = 灰面板 `#F1F1F1` + 顶线（首块 2px 实黑，其余 1px 发丝）。
- **Shadow Strategy:** 无（The Flat Rule）。
- **Internal Padding:** 12–24px（面板 12/16，行 16，区块 20/32）。

### Navigation

- **报头:** 满宽 64px sticky，下缘 1px 实黑；桌面 2 项纯字体（display 13px bold），当前项 = 3px 墨条；`lg` 以下汉堡 + 2×2 菜单（当前项 3px 墨条 + 灰底）。
- **底部导航（`<lg`）:** 3 项，图标 18px + 12px 标签，当前项 = 3px 墨色刻线 + 加粗。
- **面包屑 / 书眉:** 13px，`｜` 发丝竖线分隔；右侧恒载机器步数 `04 / 08` 与 3px 段色 sliver。
- **链接:** 下划线（发丝色）+ hover 转实墨；不换颜色做按钮。

### Signature Components

- **StepRail 编号导轨（签名）:** 136px 悬挂栏 + 巨号 01–09；当前黑块反白 90ms 硬切；窄屏降为顶内横滚刻度条。
- **ForeEdge 右缘索引轨（签名）:** 112px，功能页签 + 8 门课阶梯签（签高 ∝ 课时），当前签段色底 + 3px 深一档底边，完成态 ink 方框 ✓。
- **Chapter Band 章节带（签名）:** 白底墨字 + 12×12 段色方片 + 下缘 3px 深一档（`deepen(hue, .28)`）细条——段色唯一合法的大面积出场方式是这条 3px。
- **Running Head 书眉（签名）:** 发丝线压顶 + 下缘 3px 段色 sliver（缺省 ink）。
- **Extent Bar 比例条（签名）:** 发丝轨 + 实心填充，∝ 课时 / 进度 / 已学数。
- **Punch 刻度方块（签名）:** 12px 方块三态（空心 / 半格 / 实心），作复选与进度标记。
- **Errata Bar 勘误条（签名）:** `#C1301A` 底白字 + ✗，只承载错误反馈与危险确认。

## Do's and Don'ts

### Do:

- **Do** 让页面容器全出血（`width: 100%` + `padding-inline: max(16px, 3.5vw)`），行长用 68ch 封顶；网格与表格铺满可用宽。
- **Do** 用 Helvetica 系 extrabold 齐左承题（26 → 32px h1、24px 章题、40/44px 巨号），中文正文用衬线 17px/1.8，数据用等宽 13px。
- **Do** 用线宽与灰档分层：1px 发丝划界，2px 实黑压顶 / 收口，3px 只给段色细条与当前态刻线。
- **Do** 状态三重编码（形状 + 文字 + 颜色），进度用比例条与刻度方块。
- **Do** 把五段路径色限制在编号方片、3px 细条、ForeEdge 当前页签与答题状态；大面积只有白 / 灰 / 黑 / 信号红。
- **Do** 红只给 勘误 / 对立 / 错；蓝只给焦点环与答题语义。
- **Do** 状态切换用 `.hinge` 90ms `steps(2)`；`prefers-reduced-motion` 下瞬时，内容始终完整可读。
- **Do** 文字 ≥12px、对比 ≥4.5:1、触控 ≥44×44、单路由单 h1、无重复 id（`npm run audit:floor` 门禁）。
- **Do** 用 lucide 图标（16–18px），链接用下划线 + hover 转墨。

### Don't:

- **Don't** 给任何元素圆角、圆形或 `box-shadow`——半径 >0 与任何投影都违规。
- **Don't** 给页面容器 max-width 或做居中版心；度量只用 ch 封顶。
- **Don't** 用渐变文字或渐变洗底做装饰（本构建里仅有的 `linear-gradient` 是硬停两色、用来画形状的半格填充）；不要玻璃、辉光、多层影、卡中叠卡。
- **Don't** 把段色铺成大色块、彩色 hero、整幅色带或内容背景。
- **Don't** 用红做主按钮、链接或装饰；不要在段色五色之外引入第二套强调色。
- **Don't** 用 emoji 或字形图标做图标——图标只走 lucide；✓ / ▶ / ✗ / — 只能作带文字的状态刻度。
- **Don't** 用透明度缓动做状态过渡，不做页面进入动画、不放进度环。
- **Don't** 做卡片货架式课程网格、经验值 / 连击 / 徽章；第一屏永远是目录或可执行的下一步。
- **Don't** 让文字低于 12px，不让状态只靠颜色，不让散文进等宽、不让数据进衬线。
