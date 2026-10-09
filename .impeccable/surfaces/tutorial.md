---
version: 1
slug: "tutorial"
primary_target: "tutorial"
related_targets: []
---

# 全站（目录 + 课程步进 + 音标实验室 + 设置 + 壳）

## Scope and visitor mode

- 范围：**全站所有界面**——`/methods` 路由族（8 门方法课 × 9 步结构）、`/lab` 三 tab、`/settings`、404、导航壳与页脚。上一世界（压膜活页手册，seed `9f19875c`）整体作反参考推翻。
- Mode：read（comprehension 与 wayfinding 恒在；世界拥框——报头、导轨、地面、章节开启、表格与提示的排法，阅读栏恒静，65–75ch，正文背后无表演）。

## Audience, job, action, proof, constraints

- 受众：中文环境的英语学习者，自习场景随开随用。
- Job：读懂背词方法并当场练会。
- Action/task：步进推进（「下一步」「完成本课」）；实验室三 tab 内的听音、辨音、拼写练习；目录开课。
- Proof/content：9 步结构的分步讲解、口型/音节/拆词交互动画、926 词 + 48 音素离线发音。
- Constraints：**真·全出血版心**——`.container-page` 不设 max-width，边距随窗口走；段落行长仍 65–75ch，版块（网格/表格/卡板）铺满可用宽。**圆角归零**（全站方角）。**卡板四段色降为点缀**（编号方片、细条、页签、答题状态），大面积只有黑/白/灰/信号红。底线审计 A/B/C/D = 0（对比度 ≥4.5:1、字号 ≥12px、触控 ≥44×44、单 h1、零重复 id）；零登录零存储零外部请求（CDN 仅字体）；全部 testid 与朗读接线原样保留；内容型动画（口型、音节块、拼装、词根树）保留并重做视觉。

## Chosen direction and memorable moment

- 选定：**瑞士国际主义（International Typographic Style）**——用户在方向轮外亲点的固定方向（user-pinned，不掷 seed；辞书版式与压膜活页手册两轮旧世界均作反参考），code-led，无 comp。
- Memorable moment：大屏打开课程页，版心铺满整个窗口，编号导轨的巨号 Helvetica 步位与黑块当前标一齐左压下来——像在看一版排好的《新方向》海报，而不是一根中间的竖棍。

## Direction contract

### THESIS

全站排成一版瑞士国际主义海报：网格即秩序，字体即层级，颜色只做路标。拒绝的品类默认是纸物拟态（书口贴、打孔、掀角的活页书）与网课站的卡片货架——本站不做手工书，也不做课程货架，做一台排版机。

### OWN-WORLD

白纸 `#FFFFFF` 满地全出血，黑 `#111111` 承字，灰面板 `#F1F1F1` 分层，发丝 `#D9D9D9` 划界；信号红 `#E34234` / `#C1301A` 做勘误与强调。四段路径色（铬黄/群青/青/草绿/紫罗兰）降为点缀：编号方片、3–4px 细条、页签、答题对错状态，绝不再做整幅色带。标题与界面走 Helvetica 系无衬线（Inter 兜底）粗体齐左、行距紧、字距 -0.025em；中文正文衬线 17px/1.8、65–75ch。组件族：满宽报头（字标 + 导航 + 1px 黑下线）、编号导轨（01–09 大数字，当前黑底白字）、灰面板边注、平底方角按钮、红勘误条、横向刻度步位——零圆角、零阴影堆叠、零渐变、零图标 emoji。

### STORY

学习者打开的是一版排好的版面：报头黑线之下，网格告诉他哪儿是哪儿；巨号步位数字告诉他身在第几步；色小片告诉他属于哪一段路径。正文一行行读过去，点了「下一步」，版面推进一格，依旧齐左、干净，没有东西在文字背后表演；到了实验室，同一版式换上密排的练习格。

### FIRST VIEWPORT

1440–1920 全出血：顶栏满宽（字标 · 导航 · 1px 黑下线）；左 136px 编号导轨（Helvetica 巨号 01–09，当前项黑块反白）；中栏阅读区（步题大号粗体齐左，下接中文衬线正文 68ch，上留白大于下）；右 240px 灰面板 apparatus（术语、深链、词表）。版心无上限，网格与表格随窗口铺满；移动端导轨退为顶部横滚刻度条。签名交互：步进时导轨黑块 90ms `steps(2)` 瞬移到下一位，段位色小片随段切换。

### FORM

瑞士国际主义——用户固定方向（user-pinned，前轮 `9f19875c` 压膜世界作反参考），code-led，无 comp；野心全在 FIRST VIEWPORT 与签名交互上。

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.

## Unresolved decisions

- 无 comp 轮；首屏与签名交互的承诺由 finish reviewer 对照本契约审计。
- DESIGN.md 与 `.impeccable/design.json` 由 documenter 在 finish 阶段基于已建成世界整体替换（旧压膜叙述与 14 色 tonalRamps、leaf-edge 阴影、书口/打孔组件全部作废），不在构建前预写。
- 旧世界签名件（ForeEdge 书口贴、PunchedDot 打孔、HingeCorner 掀角）保留结构与 aria，视觉改为瑞士语言（方角、编号、色细条）。
