#!/usr/bin/env python
"""批量合成 helper：stdin 读 JSON，单次加载模型后逐条合成 WAV。

输入: {"model": "<onnx路径>", "config": "<onnx.json路径>", "items": [{"out": "<wav路径>", "text": "<文本或[[IPA音素]]>"}]}
输出: stdout 一行 JSON {"errors": [{"out": ..., "error": ...}]}
由 scripts/generate-audio.mjs 调用；也可手动:
  echo '{"model":".models/en_US-lessac-medium.onnx","items":[{"out":"/tmp/a.wav","text":"[[iː]]"}]}' \
    | .venv-audio/bin/python scripts/piper_batch.py
"""
import json
import sys
import wave


def main() -> int:
    spec = json.load(sys.stdin)
    from piper import PiperVoice  # 延迟导入：快速失败时不加载 onnxruntime

    voice = PiperVoice.load(spec["model"], spec.get("config"))
    errors = []
    for item in spec["items"]:
        try:
            with wave.open(item["out"], "wb") as w:
                voice.synthesize_wav(item["text"], w)
        except Exception as exc:  # noqa: BLE001 — 单条失败不中断批次
            errors.append({"out": item["out"], "error": repr(exc)})
    print(json.dumps({"errors": errors}, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    sys.exit(main())
