#!/usr/bin/env python
"""批量合成 helper：stdin 读 JSON，单次加载模型后逐条合成 WAV。

输入: {"model": "<onnx路径>", "config": "<onnx.json路径>", "items": [{"out": "<wav路径>", "text": "<文本或[[IPA音素]]>"}]}
输出: stdout 一行 JSON {"errors": [{"out": ..., "error": ...}]}
由 scripts/generate-audio.mjs 调用；也可手动:
  echo '{"model":".models/en_US-lessac-medium.onnx","items":[{"out":"/tmp/a.wav","text":"[[iː]]"}]}' \
    | .venv-audio/bin/python scripts/piper_batch.py

音素表校验（防「静默跳音」事故）：
  piper 对不在 phoneme_id_map 里的音素只打一行 warning 并 continue
  （piper/phoneme_ids.py:194-197），模型随后收到空音素序列 → 产出与输入
  无关的音频。此处对 [[IPA]] 原始输入按与 piper 相同的分词方式
  （voice.py 里 str.extend 逐码位）逐字符比对 id 表，缺失即整条报错。
"""
import json
import re
import sys
import wave

RAW_WRAP = re.compile(r"^\[\[(.*)\]\]$", re.S)


def missing_raw_phonemes(text: str, id_map: dict) -> list[str]:
    """[[...]] 原始音素输入中不在 id 表内的码位（与 piper 的逐码位分词一致）。"""
    m = RAW_WRAP.match(text.strip())
    if not m:
        return []
    return [ch for ch in m.group(1).strip() if ch not in id_map]


def main() -> int:
    spec = json.load(sys.stdin)
    from piper import PiperVoice  # 延迟导入：快速失败时不加载 onnxruntime

    # 与 voice 加载同一份 id 表（模型配置里的 phoneme_id_map）
    id_map = None
    cfg = spec.get("config")
    if cfg:
        with open(cfg, encoding="utf-8") as f:
            id_map = json.load(f).get("phoneme_id_map")

    voice = PiperVoice.load(spec["model"], spec.get("config"))
    errors = []
    for item in spec["items"]:
        if id_map is not None:
            bad = missing_raw_phonemes(item["text"], id_map)
            if bad:
                errors.append({
                    "out": item["out"],
                    "error": f"音素表缺失码位 {bad!r}（输入 {item['text']!r}；"
                             "缺失音素会被 piper 静默跳过，禁止合成）",
                })
                continue
        try:
            with wave.open(item["out"], "wb") as w:
                voice.synthesize_wav(item["text"], w)
        except Exception as exc:  # noqa: BLE001 — 单条失败不中断批次
            errors.append({"out": item["out"], "error": repr(exc)})
    print(json.dumps({"errors": errors}, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    sys.exit(main())
