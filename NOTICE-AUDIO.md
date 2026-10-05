# 音频资产来源与许可（NOTICE-AUDIO）

本站所有发音音频均为**构建期离线生成、随站点同源分发的静态文件**；运行时不请求任何外部语音服务，不违反零存储与无 CDN 约束。

## 资产清单

| 路径 | 内容 | 规格 |
| --- | --- | --- |
| `public/audio/phonemes/*.mp3` | 48 个英语音标的孤立发音 | 22.05kHz 单声道 64kbps，134–405ms |
| `public/audio/words/*.mp3` | 例词朗读（48 音标 ttsWord 去重后 45 词） | 同上，339–598ms |
| `public/audio/manifest.json` | 溯源清单（时长 / 响度 / 模型 / 校验） | 生成物 |
| `src/data/phonemeAudio.ts` | 运行时 id → 文件映射 | 生成物，勿手改 |

合计约 324KB（门禁上限 1.5MB）。

## 生成工具链

- **引擎**：`piper-tts` 1.8.0（Python，工作区虚拟环境 `.venv-audio/`，不污染系统）
- **模型**：`en_US-lessac-medium`（HuggingFace [`rhasspy/piper-voices`](https://huggingface.co/rhasspy/piper-voices)，22050Hz，md5 `2fc642b535197b6305c7c8f92dc8b24f`，下载时校验）
- **音素输入**：espeak `[[IPA]]` 转写直接驱动（`phoneme_type: espeak`），48 音标逐一验证出声
- **后处理**（ffmpeg）：静音裁剪（头/尾留 30ms）→ 响度归一至 -16dB mean（±12dB 钳制、-1dBFS 限幅）→ mp3 64kbps 单声道，尾补 50ms
- **复现**：
  ```bash
  npm run gen:audio -- --setup   # 首次：创建 .venv-audio + 下载模型（校验 md5）
  npm run gen:audio              # 生成全部音频 + manifest + 映射模块
  ```

## 许可与用途

- **模型分发**：`rhasspy/piper-voices`（HuggingFace 数据集卡片标注 `license: mit`）
- **训练数据**：[Lessac BLIZZARD 2013](https://www.cstr.ed.ac.uk/projects/blizzard/2013/lessac_blizzard2013/)（CSTR / Lessac Technologies 研究许可，模型卡 MODEL_CARD 指向该条款）
- **本项目用途**：个人非商业教学用途，符合上述研究许可范围。**若未来转为商业用途，须先更换许可清晰的音色**（如 LibriTTS 系 CC-BY 4.0），再重新执行 `npm run gen:audio`。

## 门禁

- `npm run check:audio`（已并入 `npm run verify`）：数据（phonemes.ts）↔ manifest ↔ 磁盘三方一致、逐文件可解码、时长与单文件体积预算、无孤儿文件、音频总量 ≤1.5MB、生成映射模块未过期。
- `npm run smoke` 的 **[5b] 音标离线音频** 段：manifest 全量文件 HTTP 200、mp3 在 Chromium 内解码播放（currentTime 前进且无 error）、UI「播放 /θ/ 发音」按钮可用且未被禁用。
- 兜底语义：任一音频缺失时调用方回退浏览器语音合成（例词），音标本体按钮保持可用并提示。
