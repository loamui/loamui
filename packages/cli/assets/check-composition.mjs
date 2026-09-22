import { lstatSync, readdirSync, readFileSync } from "node:fs";
import { basename, dirname, join, relative, resolve } from "node:path";
import { scopeFindings } from "./scope-rules.mjs";
import { spacingFindings } from "./spacing-rules.mjs";

const roots = process.argv.slice(2);
const ignored = new Set(["node_modules", ".git", ".next", ".output", "dist", "build", "coverage"]);
const sourceFile = (file) =>
  /\.(css|tsx|jsx)$/.test(file) && !/\.(test|spec|stories)\.[jt]sx$/.test(file);

function collect(path, files) {
  const stat = lstatSync(path);
  if (stat.isSymbolicLink()) return;
  if (stat.isDirectory()) {
    if (ignored.has(basename(path))) return;
    for (const entry of readdirSync(path)) {
      if (!ignored.has(entry)) collect(join(path, entry), files);
    }
  } else if (sourceFile(path)) files.add(path);
}

if (!roots.length || roots.some((root) => root.startsWith("-"))) {
  console.error("Usage: node check-composition.mjs <source-directory-or-file> [...paths]");
  process.exitCode = 1;
} else {
  try {
    const files = new Set();
    for (const root of roots) collect(resolve(root), files);
    if (!files.size)
      throw new Error("No authored CSS, TSX or JSX files found in the supplied paths.");
    let failures = 0;
    for (const file of files) {
      const source = readFileSync(file, "utf8");
      const findings = spacingFindings(source, file).map((finding) => ({
        line: finding.line,
        message: `${finding.prop}: ${finding.value} bypasses spacing tokens`,
      }));
      if (file.endsWith(".css")) {
        const sources = readdirSync(dirname(file))
          .filter(
            (name) =>
              /\.[jt]sx$/.test(name) &&
              sourceFile(name) &&
              lstatSync(join(dirname(file), name)).isFile(),
          )
          .map((name) => readFileSync(join(dirname(file), name), "utf8"));
        const hostsCore = sources.some(
          (tsx) =>
            /from\s+["']@loamui\/core["']/.test(tsx) &&
            (tsx.includes(`"./${basename(file)}"`) || tsx.includes(`'./${basename(file)}'`)),
        );
        findings.push(
          ...scopeFindings(source, sources.join("\n"), { hostsCore }).map((finding) => ({
            line: finding.line,
            message: `${finding.sel}: ${finding.why}`,
          })),
        );
      }
      for (const finding of findings) {
        console.error(`${relative(process.cwd(), file)}:${finding.line} ${finding.message}`);
        failures++;
      }
    }
    if (failures) {
      console.error(`check-composition: ${failures} finding(s).`);
      process.exitCode = 1;
    } else {
      console.log(
        `check-composition: ${files.size} files checked. Review dynamic values, scope ownership and browser behaviour separately.`,
      );
    }
  } catch (error) {
    console.error(`check-composition: ${error.message}`);
    process.exitCode = 1;
  }
}
