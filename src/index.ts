/**
 * EC-AUDIO — 知覚層・耳
 * 何が聞こえるかを知覚し、構造化された証拠として出力する
 */

import OpenAI from 'openai';

export interface PerceptionInput {
  source: string;
  type: 'speech' | 'music' | 'sound';
  timestamp?: string;
}

export interface PerceptionOutput {
  source: string;
  timestamp: string;
  confidence: number;
  perception: {
    transcript?: string;
    language?: string;
    mood?: string;
    music_analysis?: {
      tempo?: number;
      key?: string;
      chords?: string[];
    };
  };
}

/**
 * EC-AUDIO Core Class
 */
export class ECAudio {
  private openai: OpenAI;

  constructor(apiKey?: string) {
    this.openai = new OpenAI({
      apiKey: apiKey || process.env.OPENAI_API_KEY,
    });
  }

  /**
   * 音声を知覚する
   */
  async perceive(input: PerceptionInput): Promise<PerceptionOutput> {
    try {
      const audioData = await this.loadAudio(input.source);
      const perception = await this.analyzeWithWhisper(audioData, input.source);
      const confidence = this.calculateConfidence(perception);

      return {
        source: input.source,
        timestamp: input.timestamp || new Date().toISOString(),
        confidence,
        perception,
      };
    } catch (error) {
      throw new Error(`EC-AUDIO perception failed: ${error}`);
    }
  }

  /**
   * 音声を読み込む
   */
  private async loadAudio(source: string): Promise<Buffer> {
    const fs = await import('fs');

    if (source.startsWith('http')) {
      const response = await fetch(source);
      return Buffer.from(await response.arrayBuffer());
    } else {
      return fs.promises.readFile(source);
    }
  }

  /**
   * Whisper API で解析
   */
  private async analyzeWithWhisper(audioData: Buffer, source: string): Promise<PerceptionOutput['perception']> {
    const file = new File([audioData], 'audio.mp3', { type: 'audio/mp3' });

    const response = await this.openai.audio.transcriptions.create({
      model: 'whisper-1',
      file: file,
      language: 'ja', // 日本語優先
    });

    const transcript = response.text;

    // 音楽分析（簡易版）
    const musicAnalysis = this.detectMusicCharacteristics(transcript);

    return {
      transcript,
      language: 'ja',
      mood: this.detectMood(transcript),
      music_analysis: musicAnalysis,
    };
  }

  /**
   * 音楽的特徴の検出（簡易版）
   */
  private detectMusicCharacteristics(transcript: string): PerceptionOutput['perception']['music_analysis'] {
    // TODO: 実装
    return {
      tempo: 120,
      key: 'C Major',
      chords: ['C', 'Am', 'F', 'G'],
    };
  }

  /**
   * 雰囲気検出
   */
  private detectMood(transcript: string): string {
    // TODO: 実装
    if (transcript.includes('！')) return '熱烈';
    if (transcript.includes('？')) return '疑問';
    return ' neutral';
  }

  /**
   * Confidence スコアリング
   */
  private calculateConfidence(perception: PerceptionOutput['perception']): number {
    let score = 0.7; // Whisper は高精度

    if (perception.transcript && perception.transcript.length > 10) {
      score += 0.2;
    }
    if (perception.music_analysis) {
      score += 0.1;
    }

    return Math.min(1.0, score);
  }

  /**
   * LIFEOS 向けに整形
   */
  formatForLifeOS(perception: PerceptionOutput): string {
    return `
【知覚的証拠（聴覚）】
ソース: ${perception.source}
信頼度: ${(perception.confidence * 100).toFixed(0)}%

書き起こし:
${perception.perception.transcript || 'N/A'}

言語: ${perception.perception.language || 'N/A'}
雰囲気: ${perception.perception.mood || 'N/A'}

音楽分析:
${perception.perception.music_analysis ? `
  テンポ: ${perception.perception.music_analysis.tempo || 'N/A'}
  キー: ${perception.perception.music_analysis.key || 'N/A'}
  コード: ${perception.perception.music_analysis.chords?.join(', ') || 'N/A'}
` : 'N/A'}
    `.trim();
  }
}

export default ECAudio;
