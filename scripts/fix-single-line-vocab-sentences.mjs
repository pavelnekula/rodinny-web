/**
 * Doplní sentence u jednořádkových objektů { id, en, cs, emoji, categoryId }
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.join(
  __dirname,
  "..",
  "components",
  "tinuska",
  "anglictina",
  "VocabularyData.ts",
);

import { SENTENCES } from "./tinuska-vocab-sentences-data.mjs";

function esc(s) {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

const text = fs.readFileSync(filePath, "utf8");
const lines = text.split("\n");
const out = lines.map((line) => {
  if (line.includes("sentence:")) return line;
  if (!line.includes("emoji:") || !line.includes("categoryId:")) return line;
  if (!line.includes("id:")) return line;
  const idM = line.match(/\bid:\s*"([^"]+)"/);
  if (!idM || !SENTENCES[idM[1]]) return line;
  return line.replace(
    /(emoji:\s*"[^"]+",)\s*(categoryId:)/,
    `$1 sentence: "${esc(SENTENCES[idM[1]])}", $2`,
  );
});
fs.writeFileSync(filePath, out.join("\n"));
console.log("Single-line sentences patched.");
