# 教程面（课程步进 + 音标实验室）

## Scope and visitor mode

- 范围：`/methods` 路由族（8 门方法课 × 9 步结构）与 `/phonics` 音标实验室三 tab。导航壳、Home 方法地图、其他路由**不在本轮**——壳维持既有深色世界，标记为阶段二迁移。
- Mode：read（comprehension 与 wayfinding 恒在，世界拥有框架，阅读栏恒静）。

## Audience, job, action, proof, constraints

- 受众：中文环境的英语学习者，自习场景随开随用。
- Job：读懂背词方法并当场练会。
- Action/task：步进推进（「下一步」「完成本课」）；实验室三 tab 内的听音、辨音、拼写练习。
- Proof/content：9 步结构的分步讲解、口型/音节/拆词交互动画、926 词 + 48 音素离线发音。
- Constraints：底线审计 A/B/C/D = 0（对比度 ≥4.5:1、字号 ≥12px、触控 ≥44×44、单 h1、零重复 id）；零登录零存储零外部请求；全部 testid（`course-step`/`finish-course`/`next-step-bar`/`data-step-inc`/`intro-next`/`progress-panel`/`data-method-row`/`bottom-nav`/`hero-resume`/`zero-storage-note`/面包屑 nav/48×`选择音标`/「完成本课」）与朗读接线原样保留；内容型动画（口型、音节块、gsap 拼装、词根树）保留并重做视觉。

## Chosen direction and memorable moment

- 选定：**辞书版式**（THE ROLL，七候选序位 4，seed `a6e5a7dd`，code-led，决策页锁定）。
- Memorable moment：词头朗读时被批注红章盖下，装订线（页边进度绳）推进一格义项——像用红笔在词典上做了记号。

## Direction contract

### THESIS

把方法课排成一部双解词典：方法是词目，步骤是义项，演示是例句，误区是辨析。拒绝的品类默认是「白底卡片网格 + 渐变 hero + 进度环」的网课站与翻转词卡流——本站不做课程货架，做一部可读可练的书。

### OWN-WORLD

骨白纸 `#F7F2E8` 满地，墨 `#16130F` 承文，结构蓝 `#1E4B7A` 只上书眉、导轨与链接，批注红 `#B3311E` 是唯一功能色（朗读/重读/当前）。发丝线 `#D8CFBC` 划栏。系统衬线（Georgia/Times）只给英文词头，中文正文系统无衬线 16px/1.75。组件族：书眉 running head、义项导轨、词条装置块（词头+IPA+朗读钮）、栏外边注 apparatus、页脚刻线导览、辨析警示框——无玻璃、无辉光、无渐变。

### STORY

学习者像翻学生词典那样读课：书眉告诉他在第几义项，导轨随时跳步，词条块把音形义立起来，栏外是老师的批注；每个方法读完，立刻在实验室三个分卷里验收听辨拼。读的时候知道「我在哪、这在教什么、下一步去哪」。

### FIRST VIEWPORT

课程步页首屏：顶栏满宽书眉（课名 · 步序 n/9 · 刻线进度）；左 2/12 义项导轨（编号 01–09，当前项红批标记 + 纹样，装订线贯穿）；中 7/12 阅读栏（步题作词目行：加粗英文词头 + IPA + 朗读钮，下接中文散文讲解，60–75 字符/行，上方留白大于下方）；右 3/12 栏外边注（术语、出处、提示）；页脚刻线导览（上一步/下一步）。实验室首屏同构：书眉换成三 tab 分卷，导轨换 48 音素索引，主栏是音标词条页。签名交互：义项导轨即装订线，朗读时词头盖红批章。

### FORM

辞书版式——用户七候选序位 4，经 direction 掷向领队（THE ROLL，seed `a6e5a7dd`），code-led，无 comp；野心全在 FIRST VIEWPORT 与签名交互上。

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.

## Unresolved decisions

- 导航壳 / Home / 其余路由仍为遗留深色世界（Backdrop/ParticleField 在范围内路由静音），阶段二迁移。
- DESIGN.md 与 `.impeccable/design.json` 由 documenter 在 finish 阶段基于已建成世界替换，不在构建前预写。
