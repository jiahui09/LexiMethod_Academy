# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

中文环境的英语学习者（中学到大学阶段，母语中文）：自习场景下随用随打开，个人独立使用，没有班级、教师或组织角色。

（候选扩展人群——备考学生、成人自学者——尚未确认；新工作只按主用户设计。）

## Product Purpose

教「背单词的方法与技巧」：8 门方法课 + 音标实验室 + 互动训练，学与练一体。成功 = 学习者掌握可迁移的方法（拆词、音形对应、间隔重复、输出与元认知等）并能立刻用出来；单词量是副产品——授人以渔，不替人背词。

## Positioning

以「方法教学 + 即时练习」为核心的多媒体自学站：分步课程把方法讲透，交互演示（口型动画、音节划分、词根拼装）把方法做出来，练习当场验收。离线发音、零登录、浏览器即开即用。邻近的词库背词类产品无法真实复制的机制是「方法课程 + 交互动画 + 离线音频」的学练一体；本站做方法，不做词库、打卡、排行。

## Operating Context

- 个人小项目的浏览器使用：随用随打开，用完即走，无教师控制台、班级或后台工作流。
- 部署：Cloudflare Pages 手动部署（build `npm run build`、输出 `dist`、SPA 深链回退），免费额度内运行。
- 构建期在本仓库生成离线音频（piper + espeak，见 `NOTICE-AUDIO.md`）；运行时零外部请求。

## Capabilities and Constraints

- 功能范围：8 门方法课分步教学；音标实验室三 tab（发音教学 / 音标拼写对应 / 听音拼写训练）；互动训练、费曼关、实战分析；复习中心、统计、工具箱、设置。
- 【推断自原需求（"不需要登录与个人数据"）与既有设计契约，待用户纠正】零登录、零持久化：进度与设置仅内存态，刷新归零，不写 localStorage/cookie。
- 【同上推断】运行时零外部请求：无外部字体、CDN、追踪或在线语音服务；发音优先用站内离线音频。
- 【同上推断】全站中文：界面与讲解为中文，英文只出现在教学内容本身。
- 【同上推断】离线音频为硬资产：48 音素 + 926 词（`public/audio/`，约 3.7MB / 974 条，单源 `scripts/word-universe.mjs`），句子走浏览器语音合成兜底。
- 【同上推断】保持个人小项目体量：无后端、无数据库、无付费依赖。
- 【已决】教程面视觉方向：辞书版式（Dictionary Edition，seed `a6e5a7dd`，code-led）已锁定并建成，覆盖 `/methods` 与 `/lab`；DESIGN.md 与 design.json 以 finish 阶段产出为准。

## Brand Commitments

- 项目名：LexiMethod Academy（仓库与站点现有名称）。
- 除用户明确提出的「个人、非商业、部署云端、无需登录」外，无绑定的品牌资产、参考或视觉约束。

## Evidence on Hand

- 8 门方法课与全部教学文案已成稿：`src/data/methods.ts`（每课 9 步结构）。
- 48 音标数据与词全集：`src/data/phonemes.ts`（ttsWord/例词/最小对立对）、`scripts/word-universe.mjs`（926 词，8 数据源）。
- 离线音频已生成：`public/audio/`（phonemes ×48 + words ×926 + manifest.json）、运行时映射 `src/data/phonemeAudio.ts`。
- 题库与词例数据：`src/data/{quizBanks,rules,spellingPatterns,affixes,words,tools,feynman}.ts`。
- 设计契约与底线审计：`DESIGN.md`、`.impeccable/design.json`、`.impeccable/audit-floor.json`（A/B/C/D 均为 0）。
- 无用户证言、无客户、无成绩数据——未来工作不得虚构此类内容。

## Product Principles

1. 方法优先：每个页面、每个交互先回答「这在教什么方法」，装饰不得压过内容。
2. 学练一体：每个讲解步都配有可操作的演示或练习，理解当场验收。
3. 随用随开：打开即用、用完即走——零登录、零存储、零外部请求。
4. 内容真实：发音、例句、规则全部来自可溯源的数据与许可清晰的资产，不编造。
5. 个人项目纪律：不引入后端、账号、数据库或付费依赖；改动保持在免费额度内。

## Accessibility & Inclusion

- 已固化的底线（`verify` 门禁逐路由审计）：对比度 ≥4.5:1、字号 ≥12px、触控 ≥44×44、每路由单一 h1、无重复 id。
- 动画尊重系统 `prefers-reduced-motion`（动画档位 auto/full/light/off）。
