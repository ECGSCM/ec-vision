/**
 * EC-AUDIO Integration Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ECAudio } from '../src/index.js';

describe('EC-AUDIO Integration', () => {
  let ecAudio: ECAudio;

  beforeEach(() => {
    ecAudio = new ECAudio(process.env.OPENAI_API_KEY);
  });

  describe('perceive()', () => {
    it('should transcribe audio and return structured perception', async () => {
      // テスト用音声ファイルが必要
      const result = await ecAudio.perceive({
        source: './test/fixtures/sample.mp3',
        type: 'speech',
        timestamp: new Date().toISOString(),
      });

      expect(result).toHaveProperty('source');
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('confidence');
      expect(result).toHaveProperty('perception');
      expect(result.perception).toHaveProperty('transcript');
      expect(result.perception).toHaveProperty('language');
    });

    it('should format output for LIFEOS', () => {
      const mockPerception = {
        source: 'test.mp3',
        timestamp: '2026-04-26T00:00:00.000Z',
        confidence: 0.95,
        perception: {
          transcript: 'これはテストです',
          language: 'ja',
          mood: 'neutral',
          music_analysis: {
            tempo: 120,
            key: 'C Major',
            chords: ['C', 'Am', 'F', 'G'],
          },
        },
      };

      const formatted = ecAudio.formatForLifeOS(mockPerception);

      expect(formatted).toContain('知覚的証拠（聴覚）');
      expect(formatted).toContain('これはテストです');
      expect(formatted).toContain('95%');
    });
  });
});
