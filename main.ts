// gta6-clipper-01 entry (Node 22, standard library only).
//
// The entry is the video itself: the agent finds a GTA 6 moment, cuts it
// into a vertical clip, the clip is uploaded to YouTube as a public Short or
// video with the bounty's line and the play code in its description, and
// VIDEO.json names the video. The house reads the video's views from YouTube.
//
// This program copies VIDEO.json from the repository root to /output/VIDEO.json
// where the gate reads it, then proves the copy is exact: it hashes the source
// and the output with sha256 and refuses to exit cleanly unless both digests
// match, so a truncated or stale copy can never pass silently.
//
// The VIDEO.json in this repo still holds a placeholder address, so the gate
// refuses it as it stands (valid 0). Replace it with your video's address
// before you submit.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR stand
// in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

const ENTRY_NAME = 'gta6-clipper-01';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

function sha256Hex(path: string): string {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

const sourcePath = join(BOT_DIR, 'VIDEO.json');
const outputPath = join(OUTPUT_DIR, 'VIDEO.json');

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  copyFileSync(sourcePath, outputPath);
} catch (err) {
  console.error(`VIDEO.json could not be copied from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}

const sourceDigest = sha256Hex(sourcePath);
const outputDigest = sha256Hex(outputPath);
if (sourceDigest !== outputDigest) {
  console.error(
    `VIDEO.json copy failed verification: source sha256 ${sourceDigest} != output sha256 ${outputDigest}`,
  );
  process.exit(1);
}

console.log(`[${ENTRY_NAME}] VIDEO.json copied to ${outputPath} (sha256 ${outputDigest})`);
console.log(`[${ENTRY_NAME}] verified ${new Date().toISOString()}`);
