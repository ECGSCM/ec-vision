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
> **Note**: repo 名は `ec-vision` ですが、内容は EC-AUDIO (知覚層・耳) です。
> エコシステム整理中、ラベルの整合は順次調整します。

---

# EC-AUDIO — 知覚層・耳

> **Axiom**: ∞ → 真 (無限から真理へ)
> **Layer**: 知覚層 (Perception)
> **Role**: 何が聞こえるかを知覚し、構造化された証拠として出力する

---

## 概要

EC-AUDIO は音声・音楽から構造化された知覚データを抽出し、**Evidence Primitive** として出力する独立したアプリケーションです。

### 特徴

- 🎤 **音声認識**: Whisper API による高精度な書き起こし
- 🎵 **音楽分析**: 楽曲構造、コード進行、感情の解析
- 🎯 **信頼度スコアリング**: confidence 0.0-1.0 で知覚の確実性を表現
- 🔗 **LIFEOS 連携**: 知覚的判断材料として偉人たちの議論に活用
- 🚀 **独立稼働**: 他システムへの依存ゼロ

---

## インストール

```bash
npm install
```

### 依存関係

- `openai` — Whisper API

---

## 使用方法

### CLI として実行

```bash
npm start <音声パス>

# 例
npm start ./speech.mp3
npm start ~/Music/sample.mp3
```

### ライブラリとして使用

```typescript
import { ECAudio } from 'ec-audio';

const ecAudio = new ECAudio({ apiKey: process.env.OPENAI_API_KEY });
const perception = await ecAudio.perceive({
  source: './audio.mp3',
  type: 'audio'
});

console.log(perception);
```

---

## 出力形式

```json
{
  "source": "音声パス",
  "timestamp": "2026-04-26T...",
  "confidence": 0.90,
  "perception": {
    "transcript": "書き起こしテキスト",
    "language": "ja",
    "mood": "真剣",
    "music_analysis": {
      "tempo": 120,
      "key": "C Major",
      "chords": ["C", "Am", "F", "G"]
    }
  }
}
```

---

## GSCM エコシステム連携

### LIFEOS への入力

```bash
# 知覚的証拠を生成
npm start audio.mp3 > perception.txt

# LIFEOS で活用
# （LIFEOS の Debate 機能で知覚的証拠として使用）
```

---

## ライセンス

MIT

---

**Version**: 1.0.0
**Axiom**: ∞ → 真
**Layer**: 知覚層 (Perception)