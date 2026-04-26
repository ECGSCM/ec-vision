#!/usr/bin/env node

/**
 * EC-AUDIO CLI
 * 知覚層・耳 — 音声知覚ツール
 */

import { ECAudio } from './src/index.js';
import fs from 'fs';

async function main() {
  const audioPath = process.argv[2];

  if (!audioPath) {
    console.error('使用方法: ec-audio <音声パス>');
    console.error('例: ec-audio ./sample.mp3');
    process.exit(1);
  }

  // ファイル存在確認
  if (!fs.existsSync(audioPath)) {
    console.error(`エラー: ファイルが存在しません: ${audioPath}`);
    process.exit(1);
  }

  const ecAudio = new ECAudio();

  try {
    const perception = await ecAudio.perceive({
      source: audioPath,
      type: 'audio',
      timestamp: new Date().toISOString(),
    });

    // LIFEOS 向け形式で出力
    console.log(ecAudio.formatForLifeOS(perception));
  } catch (error) {
    console.error(`エラー: ${error.message}`);
    process.exit(1);
  }
}

main();
