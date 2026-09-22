import { existsSync } from "node:fs";
import { join } from "node:path";
import { hasDependency } from "./util.mjs";

/** What must be true of a project before setup can start. Each entry stops the command. */
export function preflight(cwd) {
  const problems = [];
  if (!existsSync(join(cwd, "package.json")))
    problems.push(
      "No package.json here. Run this inside your application, or create one with `loamui create my-app`.",
    );
  else if (!hasDependency(cwd, "react"))
    problems.push(
      "This project has no react dependency. LoamUI is a React library; add React, or create a React application first.",
    );
  return problems;
}
