---
name: LexiMethod Academy
description: 瑞士国际主义 × 新狂野主义吸收——真·全出血白纸地、海报级 Helvetica 题名、黑块锚点、灰场分区、2px 粗描边 + 4/8px 硬偏移影、90ms 按压、状态印章，指路红与勘误红双域，五段路径色只作小面积色块与细条
colors:
  # ========== 地与层：严格黑白灰 ==========
  milk: "#FFFFFF" # 白纸地：body 与一切页面底；白行浮于灰场；墨底上的按钮与反白字
  leaf: "#FFFFFF" # 工作面：与地同白，靠发丝线与灰场分区
  under: "#F1F1F1" # 灰场：报头带 / 移动菜单 / 页脚带 / 底导 / 分段章带 / 页边批注
  rule: "#D9D9D9" # 发丝线：只留行间节间与刻度轨道（结构一律 2px 实黑）
  ink: "#111111" # 正文墨（白地 ≥17:1）与黑块锚点、2px 描边、硬影本体、主行动实底
  ink2: "#555555" # 次级墨（白地 ≥7:1）：说明、页边注、未选中；墨上浅件的硬影色
  focus: "#2A4BD7" # 焦点环与答题语义（全站 2px 焦点环处处在）
  # ========== 信号红：双域 = 指路与当前位置 + 勘误 ==========
  errata: "#E34234" # 指路红：字标块、当前项 3px 标、缺省细条、主行动箭头、面板斜章红框；亦作错的描边（大字级/图形级 ≥3:1）
  errata-deep: "#C1301A" # 勘误条底与浅底上的红字（≥4.5:1）
  # ========== 五段路径色：小面积实底色块 + 细条，仍禁整幅 ==========
  board-pathway: "#F2B700" # 通路段 · 铬黄（01–02）
  board-deconstruct: "#2A4BD7" # 拆解段 · 群青（03）
  board-encode: "#137574" # 存入段 · 青（04–06）
  board-retrieve: "#357A1E" # 调用段 · 草绿（07）
  board-capstone: "#6B3FA0" # 收官段 · 紫罗兰（08）
typography:
  poster:
    fontFamily: "'Helvetica Neue', Helvetica, Arial, Inter, 'Noto Sans SC', 'Source Han Sans SC', -apple-system, 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif"
    fontSize: "72px"
    fontWeight: 800
    lineHeight: "0.95"
    letterSpacing: "-0.03em"
  display:
    fontFamily: "'Helvetica Neue', Helvetica, Arial, Inter, 'Noto Sans SC', 'Source Han Sans SC', -apple-system, 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif"
    fontSize: "40px"
    fontWeight: 800
    lineHeight: "1.1"
    letterSpacing: "-0.02em"
  section:
    fontFamily: "'Helvetica Neue', Helvetica, Arial, Inter, 'Noto Sans SC', 'Source Han Sans SC', -apple-system, 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif"
    fontSize: "32px"
    fontWeight: 800
    lineHeight: "1.15"
    letterSpacing: "-0.02em"
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
  logo-mark:
    backgroundColor: "{colors.errata}"
    textColor: "{colors.milk}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    width: "40px"
    height: "40px"
  continue-panel:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.milk}"
    typography: "{typography.poster}"
    rounded: "{rounded.none}"
    padding: "20px 24px"
  chapter-band:
    backgroundColor: "{colors.under}"
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

**Creative North Star: 「瑞士排版机（The Typographic Machine）」** —— 全站是一版排好的瑞士国际主义版面：网格即秩序，字体即层级，颜色只做路标。大屏打开课程页，版心铺满整个窗口，编号导轨的巨号 Helvetica 步位与黑块当前标一齐左压下来，像在看一版排好的海报，而不是一根中间的竖棍。

狂野吸收（第三轮修订，用户四策略全批）给这台排版机加了手劲：**整版从「排出来的」变成「压出来的」**——结构靠 2px 实黑描边、浮动件靠 4/8px 实心硬偏移影、可点的东西可按压（hover 抬 2px 影胀 6px，active 压回 4px 影归零）。用户先前判定的焦点层照旧成立：**灰报头（红字标）→ 海报级题名 → 黑块锚点（全页唯一主导色场，8px 硬影浮出白地）→ 分段成卡（2px 黑框 + 4px 硬影）的灰带印章题名 + 白行清单**，视线从大到小落到行动上。白纸 `#FFFFFF` 满地全出血，黑 `#111111` 承字、承那唯一一块主色场、也承硬影本体，灰场 `#F1F1F1` 成区地，发丝 `#D9D9D9` 只留行间节间；信号红 `#E34234` 是双域——**指路与当前位置 + 勘误**，共同语义「看这里」。五段路径色（铬黄 / 群青 / 青 / 草绿 / 紫罗兰）从贴纸升级为**小面积实底色块**（状态印章、16px 编号方片、章题黑印章里的方片、3px 细条、右缘页签），深色段底上的字色由亮度解算（`textOn`：L≥0.4 用墨，否则 milk），仍绝不用作整幅背景或正文色。层级靠五样东西：海报级 Helvetica 粗体齐左的字级差、2px 实黑描边、4/8px 硬偏移影、黑白灰的图底分区、等宽的机器嗓音。正文永远安静：中文衬线 17px/1.8、68ch 行宽，背后没有东西在表演。

反参考（两轮旧世界 + 网课站品类默认）：拒绝压膜活页手册的纸物拟态（书口贴、打孔、掀角、暖纸色地），拒绝辞书版式的双栏词条排印，拒绝白底卡片货架 + 渐变 hero + 进度环的网课站观感，拒绝软阴影 / 模糊 / 圆角的「柔和」观感，拒绝经验值 / 连击 / 徽章等角色化成长。

**Key Characteristics**

- 真·全出血版心：容器无 max-width，行宽靠 68ch 封顶，绝不居中一根竖棍。
- 压出来的结构：2px 实黑描边成框，4/8px 实心硬偏移影成浮，hover 抬 / active 压的 90ms 按压；软影、模糊、圆角仍归零。
- 黑白灰地：白行浮于灰场（报头 / 页脚 / 底导 / 分段章带铺 `#F1F1F1`），每页至多一块黑块锚点作主色场。
- 指路红双域：字标红块、当前项 3px 红标、缺省红细条、主行动红箭头 = 指路；勘误条与错答描边 = 错；红不作按钮实底、不作正文色。
- 段色升级为小面积实底色块（状态印章 / 16px 方片 / 3px 细条 / ForeEdge 页签），深底字色按亮度解算；仍禁整幅色带与正文着色。
- 印章式表达：分段章题 = 黑印章白字压灰带；状态徽记 = 实底印章（墨底反白 / 段色实底 / 2px 空心）；黑块面板挂红框斜章；页脚 LEXIMETHOD 48px 大字标。
- 无衬线承题（海报级 44→64→72px h1，extrabold 齐左 −0.03em），衬线承文（Noto Serif SC 17/1.8），等宽承数据（`.machine` 13px）。
- 方角归零、渐变归零；状态三重编码（形状 + 文字 + 颜色），比例条与刻度方块是唯一的进度语言。
- 动效只有一条语言：`.hinge` 与 `.press` 同款 90ms `steps(2)` 硬跳；无淡入、无缓动新词、无页面进场。

## Colors

调色板严格黑白灰，红说「看这里 / 这里错了」，蓝说「答题 / 焦点」，五段色做小面积色块与细条。

### Primary

- **Ink 正文墨** (#111111)：一切正文与标题；主行动的实底（黑底白字）、黑块锚点面板、2px 描边与硬影本体、当前态黑块（导轨当前步、印章、页内当前标）。

### Secondary

- **Signal Red 指路红 · 勘误红** (#E34234) / **Errata Deep 勘误条底** (#C1301A)：双域统一，共同语义「看这里」。
  - **指路与当前位置**：字标红方块（40×40，反白 Lx 19px/800，大字级 ≥3:1）、桌面导航当前项 3px 红标、移动菜单与 BottomNav 当前项红下条、RunningHead 缺省 3px 红细条（课程页 / 实验室页传段色为例外规则）、NextStepBar 前缀短线、全站主行动的方向箭头（黑底上 4.44:1 图形级）、黑块面板的红框斜章。
  - **勘误**：错误描边、错答底（`rgba` 红 5–8%）、危险确认条（errata-deep 承载白字）。
  - **对比度入档**：红在墨底上 4.44:1，达图形级 3:1 但不达正文 4.5:1——故墨底上的红**只做框与箭头，不承载文字**；面板斜章是 milk 字 + 红框。
  - **禁区**：红不作按钮实底、不作正文色、不做装饰底。
- **Focus / 答题群青** (#2A4BD7)：焦点环唯一颜色，同时是答题语义色与拆解段段色——三者同值是有意的：它只在「机器在问你」或「焦点在你手上」时出现。

### Accent — 五段路径色（小面积实底 + 细条）

- **通路铬黄** (#F2B700)：01–02 课；**拆解群青** (#2A4BD7)：03 课；**存入青** (#137574)：04–06 课；**调用草绿** (#357A1E)：07 课；**收官紫罗兰** (#6B3FA0)：08 课。
- 出现位置：**状态印章的进行中实底**、16×16 编号方片、12×12 / 16×16 贴纸方片、3px 细条（章节带下缘 / 书眉 sliver / 当前页签底边）、黑块锚点顶缘 8px 深一档细条、ForeEdge 当前页签底、答题对错状态。
- **深底字色规则（`lib/stages.ts` 的 `textOn(hex)`）**：按 WCAG 相对亮度解算，L≥0.4 用 `#111111`，否则用 `#FFFFFF`——黄上墨约 11:1，四个深色上 milk ≥5.3:1，不引入第三色。
- **绝不**做整幅背景、彩色 hero 或正文着色。

### Neutral — 白纸地与灰场

- **Milk / Leaf 白纸地** (#FFFFFF)：页面底与阅读面同白，靠线、灰场与硬影分层；也是墨底上的按钮与反白字。
- **Under 灰场** (#F1F1F1)：成区地——报头带、移动菜单、页脚带、BottomNav、分段章带、页边批注与次级区块。
- **Rule 发丝线** (#D9D9D9)：只留行间节间、刻度轨道与未选中描边——结构一律 2px 实黑。
- **Ink2 次级墨** (#555555)：说明文字、页边注、未选中标签；也是墨底上浅色件的硬影色（墨影在墨面上不可见）。

### Named Rules

**The Red Rule（指路·勘误双域律）.** 红只出现在两个语义里：指路与当前位置，或勘误与错。做主行动仍用 ink 实底 milk 字——红上箭头与红框，不上按钮底；墨底上的红只做图形（框 / 箭头），文字一律 milk。

**The Accent Rule（段色点缀律）.** 五段色可作小面积实底（印章、方片、细条、页签），但整屏总面积仍只到「点缀」量级；大面积永远是白 / 灰 / 黑。深色段底上的字色用 `textOn` 解算，不引入第三色。

**The One-Accent-Per-Block Rule（一段一色）.** 一个区块只出现一个段色：它由所在段决定，不与其他段色同框竞逐。

**The Black Anchor Rule（黑块锚点律）.** 每页至多一块 ink 主导色场，放在首屏题名之下、清单之上，作眼睛进门的落点：顶缘深一档段色 8px 细条 + 巨号课号（64/72px）+ 白底按钮（影用 `shadow-hard-invert`）承载红箭头，外加 8px 硬影浮出白地。第二块黑场即违规。

## Typography

**Display Font:** 'Helvetica Neue' → Helvetica → Arial → Inter → 'Noto Sans SC'（标题与界面，extrabold）
**Body Font:** 'Noto Serif SC' → 'Source Han Serif SC' → 'Songti SC' → SimSun → Georgia（中文正文）
**Label/Mono Font:** ui-monospace → SFMono-Regular → Menlo → Consolas（`.machine` 机器嗓音与 `.ipa`）

**Character:** 粗黑体承题、衬线承文、等宽承数据。题名齐左、行距紧（0.95–1.25）、字距反收紧（−0.03em 海报级）；正文衬线慢下来（1.8）；所有可计数、可核验的数字回到等宽的 `tabular-nums`。全站字号阶梯（实测）：12 · 13 · 14 · 15 · 16 · 17 · 18 · 19 · 20 · 22 · 24 · 26 · 30 · 32 · 36 · 40 · 44 · 48 · 60 · 64 · 72。

### Hierarchy

- **Poster 海报级题名** (800, 44px → 64px @md → 72px @xl, 0.95, −0.03em, tabular-nums)：课程总目 h1 与黑块锚点的巨号课号——级差 ≥1.5 级，进门第一眼。
- **Display 课题** (800, 30px → 40px @md, 1.1, −0.02em)：课程页 h1（本路由唯一 h1）；页脚 LEXIMETHOD 大字标同族（32px → 48px @md, 800, −0.02em）。
- **Section 章题 / 常规 h1** (800, 26px → 32px @md, 1.15, −0.02em)：分段章题（黑印章白字）、音标实验室与设置的 h1、错误页 h1。
- **Title 行题** (700, 17px → 19px @md, 1.4)：课程行 h3、黑块面板课名（18px → 26px @md）、面板小标题。
- **Inline Numeral 行内课号** (700 等宽, 18px, tabular-nums)：目录行首的 01–08。
- **Lede 导语** (400, 15px/1.85, ink2, ≤68ch)：题名下的一句话。
- **Body 正文** (400, 17px/1.8 衬线, ≤68ch)：中文讲解；**Body Small** (14–16px/1.8)：行内说明与次级正文。
- **Label 界面标签** (700, 14px 按钮与主导航 / 13px 次级链接, 1.5)：走 display 字族。
- **Machine 机器嗓音** (500, 13px/1.6, +0.02em, tabular-nums)：课号、`04 / 08` 步数、时长、题号、进度计数、斜章文字；微标签 12px 为全站地板。**IPA** (600, 13px 起，图表 15px、示范 60 → 72px)。
- **Giant / Apparatus Numeral**：导轨 40px、页边课号 44px，extrabold tabular，当前项黑块反白。

### Named Rules

**The Poster-Head Rule（海报级题名律）.** 首屏题名走海报级：44 → 64 → 72px、extrabold、齐左、−0.03em、行距 0.95；相邻层级级差 ≥1.5 级（海报 72 → 章题 32 → 行题 19）。升一级靠字级与字重，不靠颜色或框。

**The Machine Voice Rule（机器嗓音律）.** 一切可计数、可对位、可核验的数据走等宽 13px；散文永远不进等宽，数据永远不进衬线。

**The Left-Flush Rule（齐左律）.** 标题、标签、数字一律齐左，字距不放宽（海报与巨号反收紧 −0.03em / −0.025em）；只有全屏空态 / 载入态可以居中。

**The Floor Rule（底线律）.** 12px 字号、4.5:1 对比、44×44 触控、单路由单 h1、零重复 id 是地板不是目标，由 `npm run audit:floor` 逐路由把守并入 `npm run verify`。

## Layout

**全出血版心（容器）：** 页面容器 `width: 100%` + `padding-inline: max(16px, 3.5vw)`——**无 max-width，边距随窗口比例放大**；网格、表格、列表铺满可用宽。行长由组件内部的 68ch 封顶（导语、正文、行副题）——**度量靠 ch 封顶，从不靠居中容器**。

**首屏拓扑（总目，1440–1920）：** 灰报头（`#F1F1F1` 带 + 下缘 2px 实黑 + 红字标 + 4px 硬影）→ 书眉 → 海报级 h1 → **黑块锚点**（唯一落点，8px 硬影浮出白地）→ 分段区块整体成卡（2px 黑框 + 4px 硬影：灰带黑印章题名 + 白行清单）。移动端黑块面板纵向堆叠，按钮满宽。

**首屏拓扑（课程页）：** 灰报头 → 章节带（左面包屑 / 右机器步数 + 下缘 3px 段色 sliver，**例外规则：课程与实验室页传段色**）→ 三栏网格 `136px / minmax(0,1fr) / 224px`（巨号步位导轨 / 阅读栏 / 灰面板 apparatus）+ 右缘 ForeEdge 索引轨 112px。

- **导轨（StepRail）：** 桌面悬挂左栏 sticky（top-24），巨号 40px 01–09，当前项黑块反白；`lg` 以下降级为顶内横滚刻度条（当前保持在视野内）。
- **阅读栏：** 白底、发丝线分隔、68ch 封顶；上留白大于下。
- **灰面板边注（apparatus）：** `xl` 现身 224px——44px 课号巨号、进度比例条、页边深链、事实；每块 `#F1F1F1` 底 + **2px 实黑框 + 4px 硬影**（四块同构）。（方向契约写 240px，实建 224px：紧贴 112px ForeEdge 轨的取舍，已接受。）
- **ForeEdge 索引轨：** `xl` 以下不渲染；上层功能页签（实验室 / 设置），下层 8 门课阶梯签，**签高 ∝ 课时**（`44 + (分钟−30)×1.5` px，均 ≥44）；页签描边 `border-2 border-r-0 border-ink border-b-[3px]`——侧宽类会覆盖全边，贴右缘时去掉右描边是级联正解；当前签取段色底 + 3px 深一档底边，已完成带 ink 方框 ✓。
- **实验室：** `xl` 网格 `minmax(0,1fr) / 208px`（主栏 / 栏外批注）；音标表 380px + 示范栏；页顶章节带白底 + 3px 深一档段色下缘。
- **移动端：** 单列，导轨退为顶刻度条，底导满宽 3 项（当前项 3px 红下条），报头菜单 2×2 网格 + 2px 实黑收口；320px 起零横向溢出。

**节奏：** 区块 32–40px，内部 16–24px，微间距 4–12px；发丝线做行间分隔，2px 实黑做结构。**断点：** sm 640 / md 768 / lg 1024 / xl 1280。

### Named Rules

**The Full-Bleed Rule（全出血无上限）.** 页面级容器一律 `width: 100%`，禁止 max-width 与居中版心；行长只用 ch 封顶。

**The Gray Field Rule（灰场分区律）.** 结构带铺灰成区地——报头带、移动菜单、页脚带、BottomNav、分段章带一律 `#F1F1F1`，白行浮于灰场之上；结构带的上下界用 2px 实黑（报头下线、页脚压顶、菜单收口）。

**The Extent Rule（刻度比例律）.** 时长 / 状态 / 进度永远是「发丝轨道 + 实心填充」的比例条（`#D9D9D9` 轨 + ink/ink2 填充，3px 或 6px），宽度 ∝ 真实数值——课时条、单元进度、音标已学数、书签高度同源，永不等分、永不环形。

**The Margin Apparatus Rule（灰面板边注律）.** 补充事实、深链、词表走右缘灰面板（`#F1F1F1` + 2px 实黑框 + 4px 硬影），不进正文栏；正文栏因此恒静、恒 68ch、背后无物。

## Elevation & Depth

**硬偏移影是这个世界的唯一投影。** 全站没有一处模糊影、软影、彩色影或辉光——只有**实心墨色、零模糊、固定角度**的偏移方块：

- **`.shadow-hard` = `4px 4px 0 var(--ink)`**：字标红块、报头 CTA、菜单钮、成卡分段区块、dock 主钮、课页 step-next、页边批注四块、EduButton primary、全站主行动。
- **`.shadow-hard-lg` = `8px 8px 0 var(--ink)`**：黑块锚点面板——全页最重的一块影。
- **`.shadow-hard-invert` = `4px 4px 0 var(--ink2)`**：墨底上的浅色件（黑块面板里的白按钮）——墨影在墨面上不可见，换次级墨。

**宣告一次的旧律在此改写：**「零阴影」不再是规则；规则是**硬偏移实心、零模糊、尺寸只有 4px 与 8px 两档**。结构靠 2px 描边、浮动靠硬影，两者同现是风格本身，不是重复。

- **Focus Ring：** `2px solid #2A4BD7`，offset 2px（壳件 `.paper-chrome`）/ 3px（页面级 `:focus-visible`），方角随元素，全站处处在、永不移除（`outline-none` 已清零）。
- **Stroke Ladder 线宽阶梯：** 2px 实黑是结构默认；3px 只给段色 / 红色细条（章节带下缘、当前态刻线、ForeEdge 页签底边）；8px 只给黑块锚点顶缘；发丝 1px 只留行间节间与刻度轨道。

### Named Rules

**The Hard Shadow Rule（硬影律）.** 悬浮 = 硬偏移实心影：只用 `.shadow-hard` / `.shadow-hard-lg` / `.shadow-hard-invert` 三档，零模糊、零扩散、零彩色；软影、模糊影、辉光、多层影一律违规。墨底上的浅色件必须换 `--ink2` 影。

**The Press Rule（按压律）.** 可点的主件带 `.press`：hover `translate(-2px,-2px)` 且影胀到 6px，active `translate(4px,4px)` 且影归 0——与 `.hinge` 同为 90ms `steps(2)` 硬跳，是同一条动效语言的两种手势（铰链 = 状态，按压 = 手劲），不引入任何缓动新词；`prefers-reduced-motion` 与 `data-motion="off"` 下全部瞬时。

## Shapes

**圆角归零。** 全站 `border-radius: 0`，零 `rounded-*` 工具类，滑钮、方片、页签、面板、按钮、字标块全部方角；也没有圆形——状态标记是**刻度方块**（14px 方块：空心未到 / 半格进行中 / 实心完成，2px 描边），选择框是方框 + ✓，段色方片是 12×12 / 16×16 的正方形，字标是 40×40 红方块。

- **描边（粗描边律）：** `border-2 border-ink` 是卡片、输入、选项块、成组区块与壳体顶线的默认；`.edu-input` 同为 2px 实黑。发丝 `#D9D9D9` 只留行间节间（`border-b/t-rule`）与刻度轨道。**如实记录的三处例外**：
  - `.leaf` / `.under-leaf` 仍是 1px `#D9D9D9`——它们是纸缘内层材料，不是控件（终审裁定非未达）；活动页 `.leaf-active` 把边色升为 ink。
  - **虚线空槽 / 用尽态**全库仅 3 串保留 `border-rule`（`TokenPlacer` 空槽、`PlacerBody` 两处 used）——它们只升了 2px 宽度、未转墨色；同类中 `build` 的板框已转 `border-dashed border-ink`。**不要把它写成「全部色转墨」。**
  - ForeEdge 页签 `border-2 border-r-0 border-ink border-b-[3px]`：贴右缘时去掉右描边，侧宽类覆盖全边是级联正解。
- **几何语言：** 可点的像印刷控件（方正、2px 实黑、硬影、按压）；装内容的像版面块（白底 + 发丝线，或灰场 + 2px 黑框 + 硬影）；发丝线网格（单元格自带右 / 下细线）是表格与图表的默认形态。

### Named Rules

**The Zero-Radius Rule（方角律）.** 任何元素的圆角 >0 即违规；需要「圆」的语义（完成、当前、选中）一律改用方块的填充状态表达。

**The Heavy Stroke Rule（粗描边律）.** 结构与控件默认 2px 实黑描边，发丝线只做行间节间；上面列出的三处发丝例外是材料语义，不是漏升。

## Components

**The Shape-First Rule（三态靠形状）.** 任何状态都三重编码——形状（空心 / 半格 / 实心 / ✓ / ▶ / 黑块）+ 文字（aria-label 与可见标签）+ 颜色（印章底色，第三通道）。绝不只靠颜色。

**The Stamp Rule（印章律）.** 状态徽记是实底印章：**已收口 = `bg-ink text-milk` 墨底反白；进行中 = 段色实底 + `textOn(hue)` 字色；未到 = 2px 描边空心**。分段章题是黑印章：`bg-ink text-milk` 32px 白字压在灰带左侧，右端机器计数。印章是静态噪音，不带新动效。

**The Hinge Step Rule（铰链步进律）.** 状态切换与按压共用同一条动效语言：90ms `steps(2)` 硬切（`.hinge` 用于状态、`.press` 用于手劲），无透明度缓动、无页面进场、无位移编排；`prefers-reduced-motion` 与 `data-motion="off"` 下全部瞬时。内容型动画（口型、音节、拼装、词根树）属教学内容，不属版面编排。

**The Giant-Numeral Rule（巨号步位律）.** 导轨编号 40px extrabold、页边课号 44px、黑块锚点课号 64/72px，全部 `tabular-nums`；当前步 = 黑块反白（形状通道），已完成 = ✓，未到 = 空位。数字本身就是导航。

**The Chapter-Over-Row Rule（章题压行题）.** 分段章题（黑印章白字 26 → 32px extrabold，坐在灰带左侧，带 16×16 段色方片）永远压过行题（17–19px bold，落在白行里）：整段区块入 2px 黑框 + 4px 硬影成卡，灰带下缘 3px 深一档段色细条，右端机器计数。

### Shell（AppShell / BottomNav / NextStepBar）

- **报头：** 满宽 64px sticky，**灰场底** `#F1F1F1`，下缘 **2px 实黑**；字标 = 40×40 **红方块** 反白 Lx（19px/800）+ **4px 硬影**；桌面 2 项纯字体（display 14px bold），当前项 = **3px 红标**；报头 CTA = ink 实底 + 红箭头 + `.press` + 4px 硬影；`lg` 以下汉堡钮 2px 黑框 + 硬影 + `.press`，菜单 2×2 灰底（当前项 3px 红条 + 白底）。
- **页脚：** 灰场底 + 2px 实黑压顶，**LEXIMETHOD 大字标 32px → 48px @md extrabold**，机器嗓音刊记。
- **底部导航（`<lg`）：** 灰场底、**满宽三等分**（不收窄），图标 18px + 12px 标签，当前项 = 3px 红下条 + 加粗。
- **NextStepBar（dock）：** 白底 + 1px 实黑压顶；前缀 20×1px 红短线 + `下一步去哪儿` 机器标签；主行动 ink 实底 + `.press` + 4px 硬影（红箭头），次要去向 2px 黑框描边钮，回总目文字钮。
- **链接：** 下划线（发丝色）+ hover 转实墨；不换颜色做按钮。

### Buttons

- **Shape:** 方角（0），2px 实黑描边，min-height 44px；主件带 4px 硬影。
- **Primary（每屏唯一）:** ink 实底 `#111111` + milk 字 `#FFFFFF`，display 14px bold，padding 10px 20px，hover 转 ink2，`.press` + `shadow-hard`；**箭头一律 `text-errata`**（黑底上 4.44:1 图形级）。EduButton primary 即此形态（`border-2 border-ink bg-ink text-milk hover:bg-ink2 shadow-hard press`）。红不作按钮实底。
- **Ink-Panel Button（黑块锚点内）:** 白底 `#FFFFFF` + ink 字，hover 转发丝灰，`.press-invert` + `shadow-hard-invert`（墨影在墨面上不可见）；承载红箭头，是黑场里唯一的亮点。
- **Default:** 透明底 + 2px ink 描边，ink 字；hover 翻实底。
- **Ghost:** 无描边 ink2 字，hover 出发丝线；与主行动竞争的次级动作一律降为它。
- **Focus:** 全局 `2px #2A4BD7` 焦点环；disabled = opacity 45%。

### Inputs / Fields

- **Style:** `.edu-input` —— **2px 实黑描边**、方角、白底、min-height 44px、padding 8px 12px、14.5px/1.7；hover 转灰场底。
- **Focus:** 全局 2px `#2A4BD7` 焦点环，`outline-none` 全站清零。
- **Option / Filter:** 2px 实黑描边块；未选 = 发丝描边白底 ink2 字，选中 = ink 描边 + 灰场底 + ✓（形状 + 颜色 + 文字）。

### Signature Components

- **Continue Panel 继续黑块（签名）:** `#111111` 底白字 + **8px 硬影**，顶缘深一档段色 8px 细条，64/72px 巨号课号 + 机器前缀（开场诊断 / 单元 U3 / 出门条 / 已收口）+ 白底红箭头按钮（`.press-invert`，`data-testid="intro-next"` 原位）；全页唯一主导色场。
- **Red Slant Stamp 红框斜章（签名）:** 黑块面板里贴**巨号右侧**的 `border-2 border-errata` 红框机器章，milk 字 12px，`rotate(-4deg)`，`hidden sm:block` + `aria-hidden`。位置入档：契约原文写「面板右上」，as-built 放巨号旁——右上让给主行动、题名顶让给 kicker 禁令边界，终审判非违规。
- **StepRail 编号导轨（签名）:** 136px 悬挂栏 + 巨号 01–09；当前黑块反白 90ms 硬切；窄屏降为顶内横滚刻度条。
- **ForeEdge 右缘索引轨（签名）:** 112px，功能页签 + 8 门课阶梯签（签高 ∝ 课时），`border-2 border-r-0 border-b-[3px]`，当前签段色底 + 3px 深一档底边，完成态 ink 方框 ✓。
- **Chapter Band 分段章带（签名）:** 灰场底 + 黑印章题名 + 16×16 段色方片 + 右端机器计数 + 下缘 3px 深一档（`deepen(hue, .28)`）细条；整段区块 `border-2 border-ink shadow-hard` 成卡。
- **Running Head 书眉（签名）:** 发丝线压顶 + 下缘 3px 细条，**缺省信号红（指路索引）**；课程页与实验室页传段色为例外。
- **Extent Bar 比例条（签名）:** 发丝轨 + 实心填充，∝ 课时 / 进度 / 已学数。
- **Punch 刻度方块（签名）:** 14px 方块三态（空心 / 半格 / 实心），作复选与进度标记。
- **Status Stamp 状态印章（签名）:** 已收口 墨底反白 / 进行中 段色实底 + `textOn` / 未到 2px 空心；永远与 punch 同框，三重编码。
- **Errata Bar 勘误条（签名）:** `#C1301A` 底白字 + ✗，只承载错误反馈与危险确认。

## Do's and Don'ts

### Do:

- **Do** 让页面容器全出血（`width: 100%` + `padding-inline: max(16px, 3.5vw)`），行长用 68ch 封顶；网格与表格铺满可用宽。
- **Do** 首屏题名走海报级：44 → 64 → 72px、extrabold、齐左、−0.03em，级差 ≥1.5 级（章题 26 → 32，行题 19，行内课号 18）。
- **Do** 用黑块锚点给眼睛一个落点：每页至多一块 ink 主色场（8px 硬影），顶缘段色 8px + 巨号课号 + 白底按钮红箭头。
- **Do** 悬浮件用 `.shadow-hard`（4px）或 `.shadow-hard-lg`（8px）实心零模糊影；墨底上的浅件用 `.shadow-hard-invert`。
- **Do** 给可点的主件带 `.press`：hover 抬 2px 影胀 6px、active 压回影归零，90ms `steps(2)`。
- **Do** 结构与控件用 2px 实黑描边；发丝线只留行间节间与刻度轨道。
- **Do** 状态用印章（墨底反白 / 段色实底 + `textOn` / 2px 空心）并配 punch 与文字，三重编码。
- **Do** 让结构带铺灰成区地（报头 / 移动菜单 / 页脚 / 底导 / 分段章带 = `#F1F1F1`），白行浮灰场，带缘 2px 实黑。
- **Do** 用红做指路（字标块、当前项 3px 标、缺省细条、主行动箭头、红框斜章）与勘误；红不作按钮实底、不作正文色，墨底上的红只做框与箭头。
- **Do** 把五段路径色限制在印章实底、方片、3px 细条、黑块顶缘 8px、ForeEdge 当前页签与答题状态；大面积只有白 / 灰 / 黑 / 红。
- **Do** 状态切换与按压用 90ms `steps(2)`；`prefers-reduced-motion` 下瞬时，内容始终完整可读。
- **Do** 文字 ≥12px、对比 ≥4.5:1、触控 ≥44×44、单路由单 h1、无重复 id（`npm run audit:floor` 门禁）。
- **Do** 用 lucide 图标（16–18px），链接用下划线 + hover 转墨，焦点环处处在（2px `#2A4BD7`，`outline-none` 禁用）。

### Don't:

- **Don't** 给任何元素圆角或圆形——半径 >0 即违规；完成 / 当前 / 选中一律用方块填充状态表达。
- **Don't** 用软影、模糊影、彩色影、辉光或多层影——投影只有 4px / 8px 两档实心墨偏移（墨底浅件换次级墨）。
- **Don't** 给页面容器 max-width 或做居中版心；度量只用 ch 封顶。
- **Don't** 用透明度缓动做状态或按压过渡——只有 90ms `steps(2)` 硬跳，不做页面进入动画、不放进度环。
- **Don't** 把 2px 结构框降回发丝线（三处已记录的材料例外除外：`.leaf` 纸缘 1px、虚线空槽 / 用尽态的 `border-rule`、ForeEdge 页签去右描边）。
- **Don't** 用红做按钮实底、正文色或装饰底；墨底上的红不承载文字（4.44:1 < 4.5:1），只做框与箭头。
- **Don't** 把段色铺成大色块、彩色 hero、整幅色带或内容背景；不要在段色五色之外引入第二套强调色，深色段底上的字色只用 `textOn` 二选一。
- **Don't** 在一页里放第二块黑块锚点，或让黑场盖过题名与清单。
- **Don't** 用渐变文字或渐变洗底做装饰（本构建里仅有的 `linear-gradient` 是硬停两色、用来画形状的半格填充）；不要玻璃、卡中叠卡。
- **Don't** 用 emoji 或字形图标做图标——图标只走 lucide；✓ / ▶ / ✗ / — 只能作带文字的状态刻度。
- **Don't** 做卡片货架式课程网格、经验值 / 连击 / 徽章；第一屏永远是目录或可执行的下一步。
- **Don't** 让文字低于 12px，不让状态只靠颜色，不让散文进等宽、不让数据进衬线。
- **Don't** 移除或绕过焦点环（`outline-none` 禁用）。
