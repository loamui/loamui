// The scaffolder ships the same Stylelint and composition-checker files the
// `loamui` skill ships. `skills/loamui/assets/` is the single source of truth;
// this copies them into the package so it works standalone once published.
// `check:cli-assets` fails CI if the committed copies drift.
import { copyFileSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const SOURCE = join(HERE, "..", "..", "..", "skills", "loamui", "assets");
const TARGET = join(HERE, "..", "assets");

mkdirSync(TARGET, { recursive: true });
const files = readdirSync(SOURCE).filter((f) => f.endsWith(".mjs"));
for (const file of files) copyFileSync(join(SOURCE, file), join(TARGET, file));
console.log(`sync-assets: copied ${files.length} file(s) into packages/create-loamui/assets/`);
