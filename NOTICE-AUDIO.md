# 音频资产来源与许可（NOTICE-AUDIO）

本站所有发音音频均为**构建期离线生成、随站点同源分发的静态文件**；运行时不请求任何外部语音服务，不违反零存储与无 CDN 约束。

## 资产清单

| 路径 | 内容 | 规格 |
| --- | --- | --- |
| `public/audio/phonemes/*.mp3` | 48 个英语音标的孤立发音 | 22.05kHz 单声道 48kbps，108–453ms |
| `public/audio/words/*.mp3` | 词全集朗读——8 个数据源全部可点读词槽位（例词/词族/词缀例词/题库/音节块等，去重 926 词） | 同上，281–1136ms |
| `public/audio/manifest.json` | 溯源清单（时长 / 响度 / 模型 / 校验） | 生成物 |
| `src/data/phonemeAudio.ts` | 运行时 id → 文件映射 | 生成物，勿手改 |

合计约 3.7MB / 974 条（门禁上限 4MB；全站 <4.5MB；音频点击时才拉取，不进首屏）。词全集由 `scripts/word-universe.mjs` 单源定义（生成器与门禁同读）。

## 口音边界：标音英式 · 点读美音 · 口音开关只管 TTS

全站有**两条互相独立的出声链路**，口音规则不同，不要混为一谈：

| 链路 | 覆盖范围 | 口音 | 受设置页「口音」开关影响？ |
| --- | --- | --- | --- |
| **离线点读音**（`public/audio/**` 同源 mp3） | 48 个音标本体 + 全部可点读例词 | **美音**（piper `en_US-lessac-medium`） | **否**——音频是构建期生成的固定资产，选「英音」不会改变任何一个词/音标音频 |
| **浏览器 TTS 兜底**（Web Speech API） | 词库外文本，尤其带空格的**句子级 `speak` 文本** | 随操作系统/浏览器语音而变 | **是，且仅此一路**（uk → `en-GB` 系语音、us → `en-US` 系）；个别系统语音本身联网取音，与本站离线资产无关 |

- **正文标音是英式体例**（`/əʊ/ /ɒ/ /ɔː/`、DRESS 记 `/e/`），示范音频是美音——`phone / hot / dog / water / bird / four / care / boat` 等英美分歧词会有可听差异：**标音以正文为准，音频是美音示范**。这是当前的既定取舍（另一条路是换英式音色全量重合成，见「生成工具链」）。
- **慢速 ≠ 另一段音频**：慢速是对同一段离线音频降 `playbackRate`（默认 0.55×）并显式保音高（`preservesPitch`），慢速与常速是同一音色的同一段素材。
- **同形异读词分键存储**：纯 `record` 键是名词读音，另有 `record-noun` / `record-verb` 分别对应名词（重音在首音节）与动词（重音在第二音节）；调用方通过 `SpeakButton` 的 `audioKey` 指定，避免「教动词重音、播名词音」的错配。

## 生成工具链

- **引擎**：`piper-tts` 1.8.0（Python，工作区虚拟环境 `.venv-audio/`，不污染系统）
- **模型**：`en_US-lessac-medium`（HuggingFace [`rhasspy/piper-voices`](https://huggingface.co/rhasspy/piper-voices)，22050Hz，md5 `2fc642b535197b6305c7c8f92dc8b24f`，下载时校验）
- **音素输入**：espeak `[[IPA]]` 转写直接驱动（`phoneme_type: espeak`），48 音标逐一验证出声
- **后处理**（ffmpeg）：静音裁剪（头/尾留 30ms）→ 响度归一至 -16dB mean（±12dB 钳制、-1dBFS 限幅）→ mp3 48kbps 单声道，尾补 50ms（码率/模型变更会自动触发全量重建）
- **复现**：
  ```bash
  npm run gen:audio -- --setup   # 首次：创建 .venv-audio + 下载模型（校验 md5）
  npm run gen:audio              # 增量：只合成缺失文件，已有 mp3 直接复用并重新计量
  npm run gen:audio -- --force   # 全量重建（换音色/换模型后必须）
  ```

## 许可与用途

- **模型分发**：`rhasspy/piper-voices`（HuggingFace 数据集卡片标注 `license: mit`）
- **训练数据**：[Lessac BLIZZARD 2013](https://www.cstr.ed.ac.uk/projects/blizzard/2013/lessac_blizzard2013/)（CSTR / Lessac Technologies 研究许可，模型卡 MODEL_CARD 指向该条款）
- **本项目用途**：个人非商业教学用途，符合上述研究许可范围。**若未来转为商业用途，须先更换许可清晰的音色**（如 LibriTTS 系 CC-BY 4.0），再重新执行 `npm run gen:audio`。

## 门禁

- `npm run check:audio`（已并入 `npm run verify`）：词全集（`word-universe.mjs`）↔ manifest ↔ 磁盘三方一致（缺词/过期词/数目核验）、逐文件可解码、时长与单文件体积预算、无孤儿文件、音频总量 ≤4MB、生成映射模块未过期。
- `npm run smoke` 的 **[5b] 音标离线音频** 段：manifest 全量文件 HTTP 200、mp3 在 Chromium 内解码播放（currentTime 前进且无 error）、UI「播放 /θ/ 发音」按钮可用且未被禁用。
- 兜底语义：任一音频缺失时调用方回退浏览器语音合成（例词），音标本体按钮保持可用并提示。
