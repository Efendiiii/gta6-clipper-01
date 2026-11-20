// gta6-clipper-01 — make.fun entry program (Node 22, standard library only).
//
// The video itself is the entry: a public YouTube Short of a GTA 6
// Trailer 2 moment, carrying make.fun's pitch. All this program does
// is hand the house the video's address. It reads VIDEO.json from the
// repository, checks that it names a YouTube address, and writes the
// same file into the grader's output directory, where the gate reads
// the video's views through the YouTube Data API. Nothing this program
// writes about the video is scored.
//
// Run it the way the grader does:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const inputPath = join(BOT_DIR, 'VIDEO.json');
const outputPath = join(OUTPUT_DIR, 'VIDEO.json');

const raw = readFileSync(inputPath, 'utf8');
const video = JSON.parse(raw) as { url?: unknown };

if (typeof video.url !== 'string' || !video.url.startsWith('https://')) {
  console.error(`VIDEO.json does not name a video URL: ${raw.trim()}`);
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(outputPath, `${JSON.stringify({ url: video.url })}\n`, 'utf8');
