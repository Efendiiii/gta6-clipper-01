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

if (typeof video.url !== 'string') {
  console.error(`VIDEO.json does not name a video URL: ${raw.trim()}`);
  process.exit(1);
}

// The entry is a published YouTube Short: accept only a real YouTube
// address, and refuse the placeholder id, so a video that has not been
// uploaded yet fails loudly here instead of passing a bogus URL to the
// views gate.
let videoId: string | null = null;
try {
  const parsed = new URL(video.url);
  const host = parsed.hostname.replace(/^www\./, '');
  if (host === 'youtube.com' || host === 'youtu.be' || host === 'm.youtube.com') {
    if (parsed.pathname.startsWith('/shorts/')) {
      // NB: URL parsing percent-encodes '<id>' to '%3Cid%3E', so decode
      // the id before comparing it with the placeholder below.
      videoId = decodeURIComponent(parsed.pathname.slice('/shorts/'.length).split('/')[0] ?? '');
    } else if (host === 'youtu.be') {
      videoId = decodeURIComponent(parsed.pathname.slice(1).split('/')[0] ?? '');
    } else {
      videoId = parsed.searchParams.get('v') ?? '';
    }
  }
} catch {
  videoId = null;
}
if (!videoId || videoId === '<id>') {
  console.error(`VIDEO.json does not name a published YouTube video URL: ${raw.trim()}`);
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(outputPath, `${JSON.stringify({ url: video.url })}\n`, 'utf8');
