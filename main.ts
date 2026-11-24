import { writeFileSync, mkdirSync } from "node:fs";

const LINE =
  'Shipped the login fix Friday 4:59pm. Bug report Monday: "can\'t log in, also who is Gerald?" Gerald was a stray variable I named at 2am. He\'s in production now. Gerald runs the auth. Gerald has a family.';

const outDir = process.env.OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });

// Runtime guard: sealed gate is 1–280 UTF-8 characters, exactly one line.
const chars = [...LINE].length;
if (chars < 1 || chars > 280) {
  throw new Error(`entry length ${chars} outside sealed gate 1-280`);
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  throw new Error("entry must be a single line");
}
if (LINE.trim().length === 0) {
  throw new Error("entry must not be only whitespace");
}

// Brief-aligned guard: the joke's setup must name Gerald and the punch must
// land on the final words ("Gerald has a family.") — a one-liner with no
// punchline loses to any real joke, so refuse to ship a line that lost them.
if (!LINE.includes("Gerald")) {
  throw new Error("entry lost its setup: Gerald is not named");
}
if (!LINE.endsWith("Gerald has a family.")) {
  throw new Error("entry lost its punchline: must close on Gerald's family");
}

// Round-trip check: what we wrote must read back byte-identical.
import { readFileSync } from "node:fs";
writeFileSync(`${outDir}/entry.txt`, LINE, "utf8");
const back = readFileSync(`${outDir}/entry.txt`, "utf8");
if (back !== LINE) {
  throw new Error("entry.txt round-trip mismatch");
}
console.log(`entry ok: ${chars} chars, 1 line`);
