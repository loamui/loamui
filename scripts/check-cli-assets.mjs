// Drift gate for create-loamui's bundled setup assets.
//
// The scaffolder ships copies of the skill's Stylelint and composition-checker
// files so it works once published, away from this repo. The canonical source
// is skills/loamui/assets/. This fails if the committed copies drift.
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = join(ROOT, "skills", "loamui", "assets");
const BUNDLED = join(ROOT, "packages", "create-loamui", "assets");

const source = readdirSync(SOURCE).filter((f) => f.endsWith(".mjs")).sort();
const bundled = readdirSync(BUNDLED).filter((f) => f.endsWith(".mjs")).sort();

const drift = [];
if (source.join() !== bundled.join())
  drift.push(`file set differs — source: [${source}], bundled: [${bundled}]`);
for (const file of source) {
  if (!bundled.includes(file)) continue;
  if (readFileSync(join(SOURCE, file), "utf8") !== readFileSync(join(BUNDLED, file), "utf8"))
    drift.push(`${file} differs`);
}

if (drift.length) {
  console.error("check-cli-assets: bundled assets are stale. Run `pnpm --filter create-loamui sync-assets`.");
  for (const line of drift) console.error(`  - ${line}`);
  process.exit(1);
}
console.log(`check-cli-assets: OK (${source.length} files in sync)`);
