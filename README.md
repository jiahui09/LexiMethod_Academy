# LexiMethod Academy

个人、非商业的**多媒体教学网页**：教「背单词的方法与技巧」，学与练一体、随用随打开——**不需要登录，不存任何个人数据**，可部署到云端（Cloudflare Pages）。

## 功能地图

| 路由 | 内容 |
| --- | --- |
| `/` | 学习地图：8 门方法课入口 + 进度（内存态，刷新归零） |
| `/methods` | 方法课程目录 |
| `/methods/:id` | 8 门课分步教学：自然拼读法、音标发音与拼写对应、词根词缀拆解、联想记忆、语境记忆、间隔重复、主动输出、元认知训练（旗舰课 8 步动画讲解） |
| `/lab/phonemes` | 音标发音教学：48 音标口型 / 舌位 / 气流 / 声带动画 + 7 步分步教学 |
| `/lab/mapping` | 音标 ⇄ 字母组合双向训练 + 规则动画 |
| `/lab/dictation` | 听音拼写训练：先写音标再写单词，逐字母反馈 |
| `/practice` | 互动训练（选择 / 听音 / 判答多题型） |
| `/analyze` `/feynman` | 实战演练 / 费曼关 |
| `/toolbox` `/review` `/stats` | 方法工具箱 / 复习中心 / 统计 |
| `/settings` | 设置：口音、动画档位、音效、语速（仅本会话内存，零存储） |

## 核心特性

- **离线发音音频**：48 个音标本体 + 221 个例词/最小对立对均为**同源内置 mp3**（约 1.1MB，美式音色，piper 神经 TTS 生成），浏览器语音合成只作句子级兜底——运行时**零外部请求**
- **零存储**：进度、设置全部只在内存，刷新即归零；无 localStorage / cookie / 追踪
- **质量底线门禁**：对比度 ≥4.5:1、字号 ≥12px、触控 ≥44×44、每页 1 h1、无重复 id——全部归零并并入 `verify`
- **路由错误边界**：懒加载失败或渲染崩溃自动降级（重试 / 刷新 / 回地图），不白屏

## 技术栈

React 18 · TypeScript · Vite 7 · Tailwind 3 · zustand（内存态）· framer-motion（gsap 按需动态引入）· piper-tts（离线音频生成，仅构建期）

## 快速开始

```bash
npm install
npm run dev        # http://127.0.0.1:5173
```

## 命令一览

| 命令 | 作用 |
| --- | --- |
| `npm run dev` / `build` / `preview` | 开发 / 产出 `dist` / 本地预览产物 |
| `npm run verify` | **总门禁**：build + 体积 + 数据验收 + 音频门禁 + 底线审计 |
| `npm run size` | 首屏 <200KB、CSS <30KB、全量站点 <2MB |
| `npm run check:data` | 源数据一致性（2585 项断言） |
| `npm run check:audio` | 音频三方核验：数据 ↔ manifest ↔ 磁盘（48+221，可解码、时长/体积预算） |
| `npm run audit:floor` | 逐路由设计底线审计（对比度/字号/触控/h1/id） |
| `npm run smoke` / `npm run accept` | 浏览器冒烟 30+ 项 / 验收 84 项（需先 `npm run dev`，依赖系统 Chromium，可用 `CHROME_BIN` 覆盖） |

## 离线音频再生成

```bash
npm run gen:audio -- --setup   # 首次：建 .venv-audio + 下载模型（校验 md5）
npm run gen:audio              # 增量：只合成缺失文件
npm run gen:audio -- --force   # 全量重建（换音色/换模型后必须）
```

产出 `public/audio/` + `src/data/phonemeAudio.ts`（生成物，勿手改）。音色、许可（模型 MIT / Lessac 研究许可 / 个人非商业）与复现细节见 [NOTICE-AUDIO.md](NOTICE-AUDIO.md)。

## 部署（Cloudflare Pages）

- 构建命令 `npm run build`，输出目录 `dist`，纯 SPA（深链由 Pages 的 SPA 回退接管）
- 免费额度（2 万文件 / 25MB 单文件）远大于本项目（约 320 个文件、全量 <2MB）
- **音频或静态资源变更后需重新触发一次部署**才会生效
- 上线后回归：`node scripts/audit-floor.mjs <url>` + `npm run smoke -- <url>` + `LEXI_BASE=<url> npm run accept`

## 目录速览

```
src/
  pages/        路由页面（懒加载，RouteErrorBoundary 兜底）
  components/   ui / layout / phonics / course / lab / fx
  data/         课程、音标、词表、题库等静态数据（tsc 类型校验）
  hooks/        useSpeech（离线音频优先 + TTS 兜底）等
  lib/audioBus  片段元素池 + 声源互斥
  store/        zustand 内存态（进度/复习/设置）
scripts/        门禁与生成器（verify / smoke / accept / gen:audio …）
public/audio/   离线发音音频（生成物）
DESIGN.md       设计契约（规范性）· .impeccable/  审计报告
NOTICE-AUDIO.md 音频来源与许可
```

## 设计与许可

设计契约见 [DESIGN.md](DESIGN.md)（`.impeccable/design.json` 为机器可读同步件）；底线审计报告在 `.impeccable/audit-floor.json`。

本项目为个人非商业用途；音频资产的来源与许可边界见 [NOTICE-AUDIO.md](NOTICE-AUDIO.md)。
