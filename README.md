> **Status: Dormant / 休眠中** (2026-06-30〜)
>
> This repository is kept public as a design reference. The perception-layer
> functionality previously developed here has been consolidated into
> `gscm-platform` under [ADR-0025 (Four Organs Model)](https://github.com/ECGSCM/gscm-agent/blob/main/docs/adr/0025-four-organs-model-ec-vision-audio-consolidation.md). New development now happens in `gscm-platform/lib/media-pipeline/`.
>
> このリポジトリは設計リファレンスとして公開を継続します。ここで開発されていた
> perception layer の機能は、[ADR-0025「Four Organs Model」](https://github.com/ECGSCM/gscm-agent/blob/main/docs/adr/0025-four-organs-model-ec-vision-audio-consolidation.md) に基づき
> `gscm-platform` に統合されました。今後の新規開発は
> `gscm-platform/lib/media-pipeline/` で行います。
>
> **コンテンツ整合**: 2026-06-30 に repo 名と内容を一致させました。本 repo (`ec-vision`) は EC-VISION (知覚層・目) の正式実装で、Trinity Pipe codex により設計 README を生成。実コードは dormant のため未実装、ec-audio の Whisper-based 実装が sister reference。

---

# EC-VISION — 知覚層・目

**Axiom:** `∞ → 形`

EC-VISION は、GSCM エコシステムにおける **知覚層** のうち、視覚入力を担当する独立モジュールです。

画像や動画から「何が見えるか」を知覚し、説明・物体・シーン・雰囲気・色彩などを、構造化された証拠として出力します。

---

## Layer

**知覚層**

EC-VISION は、外界から得られる視覚情報を読み取り、GSCM / LIFEOS / downstream agents が利用可能な JSON 形式へ変換します。

---

## Role

**何が見えるかを知覚し、構造化された証拠として出力する**

EC-VISION は、画像・動画そのものを解釈対象とし、意味づけや判断の前段階として、観測可能な視覚情報を抽出します。

---

## 概要

EC-VISION は、OpenAI Vision API を利用して、画像および動画フレームから視覚的特徴を抽出するための Python パッケージです。

主な特徴:

- 画像認識 / 動画認識 via Vision API
- 動画シーン分析
- 信頼度スコアリング
- LIFEOS 連携
- 独立稼働

EC-VISION は、GSCM Platform や LIFEOS に依存せず単体で動作します。一方で、出力 JSON は LIFEOS の入力として扱いやすい構造になっています。

---

## インストール

```bash
git clone https://github.com/ECGSCM/ec-vision.git
cd ec-vision
pip install -e .
```

OpenAI API を利用するため、環境変数を設定してください。

```bash
export OPENAI_API_KEY="your-api-key"
```

依存関係を直接インストールする場合:

```bash
pip install openai
```

---

## 使用方法

### CLI

画像を解析する:

```bash
ec-vision analyze image ./samples/image.jpg
```

動画を解析する:

```bash
ec-vision analyze video ./samples/video.mp4
```

JSON ファイルへ出力する:

```bash
ec-vision analyze image ./samples/image.jpg --output result.json
```

### Python API

```python
from ec_vision import ECVision

vision = ECVision()

result = vision.analyze_image("./samples/image.jpg")

print(result)
```

動画を解析する場合:

```python
from ec_vision import ECVision

vision = ECVision()

result = vision.analyze_video("./samples/video.mp4")

print(result)
```

---

## 出力形式

EC-VISION は、解析結果を JSON として出力します。

```json
{
  "description": "A person standing near a window in a softly lit room.",
  "objects": [
    {
      "name": "person",
      "confidence": 0.96
    },
    {
      "name": "window",
      "confidence": 0.91
    },
    {
      "name": "chair",
      "confidence": 0.74
    }
  ],
  "scene": {
    "type": "indoor",
    "location_hint": "room",
    "confidence": 0.88
  },
  "mood": {
    "label": "calm",
    "confidence": 0.82
  },
  "colors": [
    {
      "name": "warm white",
      "hex": "#F2E8D8",
      "confidence": 0.86
    },
    {
      "name": "soft brown",
      "hex": "#8A6A4F",
      "confidence": 0.79
    },
    {
      "name": "shadow gray",
      "hex": "#4D4F52",
      "confidence": 0.72
    }
  ]
}
```

---

## GSCM エコシステム連携

EC-VISION の出力は、LIFEOS の視覚入力として利用できます。

例:

```python
from ec_vision import ECVision

vision = ECVision()
visual_evidence = vision.analyze_image("./samples/image.jpg")

# LIFEOS へ入力する構造化された視覚証拠
lifeos_input = {
    "source": "ec-vision",
    "modality": "vision",
    "evidence": visual_evidence
}
```

EC-VISION は、画像や動画から得られた視覚情報を、GSCM エコシステム内で再利用可能な知覚証拠へ変換します。
