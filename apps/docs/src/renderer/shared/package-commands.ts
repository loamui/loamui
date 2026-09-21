export const PACKAGE_MANAGERS = ["pnpm", "npm", "yarn", "bun"] as const;
export type PackageManager = (typeof PACKAGE_MANAGERS)[number];
type Commands = Record<PackageManager, string>;

export const PACKAGE_COMMANDS = {
  "next-create": {
    pnpm: "pnpm create next-app@latest my-app \\\n  --ts --app --empty --no-tailwind --use-pnpm --yes\ncd my-app",
    npm: "npx create-next-app@latest my-app \\\n  --ts --app --empty --no-tailwind --use-npm --yes\ncd my-app",
    yarn: "yarn create next-app my-app \\\n  --ts --app --empty --no-tailwind --use-yarn --yes\ncd my-app",
    bun: "bun create next-app@latest my-app \\\n  --ts --app --empty --no-tailwind --use-bun --yes\ncd my-app",
  },
  "tanstack-create": {
    pnpm: "pnpm dlx @tanstack/cli@latest create my-app \\\n  --blank --framework React --package-manager pnpm -y\ncd my-app",
    npm: "npx @tanstack/cli@latest create my-app \\\n  --blank --framework React --package-manager npm -y\ncd my-app",
    yarn: "yarn dlx @tanstack/cli@latest create my-app \\\n  --blank --framework React --package-manager yarn -y\ncd my-app",
    bun: "bunx @tanstack/cli@latest create my-app \\\n  --blank --framework React --package-manager bun -y\ncd my-app",
  },
  install: {
    pnpm: "pnpm add @loamui/core",
    npm: "npm install @loamui/core",
    yarn: "yarn add @loamui/core",
    bun: "bun add @loamui/core",
  },
  dev: {
    pnpm: "pnpm run dev",
    npm: "npm run dev",
    yarn: "yarn run dev",
    bun: "bun run dev",
  },
  "next-build": {
    pnpm: "pnpm run build\npnpm run start",
    npm: "npm run build\nnpm run start",
    yarn: "yarn run build\nyarn run start",
    bun: "bun run build\nbun run start",
  },
  "tanstack-build": {
    pnpm: "pnpm run build\npnpm run preview",
    npm: "npm run build\nnpm run preview",
    yarn: "yarn run build\nyarn run preview",
    bun: "bun run build\nbun run preview",
  },
  skill: {
    pnpm: "pnpm dlx skills@latest add loamui/loamui --skill loamui",
    npm: "npx --yes skills@latest add loamui/loamui --skill loamui",
    yarn: "yarn dlx skills@latest add loamui/loamui --skill loamui",
    bun: "bunx skills@latest add loamui/loamui --skill loamui",
  },
  stylelint: {
    pnpm: "pnpm add -D stylelint stylelint-config-standard stylelint-config-modern stylelint-config-alphabetical-order stylelint-use-nesting",
    npm: "npm install --save-dev stylelint stylelint-config-standard stylelint-config-modern stylelint-config-alphabetical-order stylelint-use-nesting",
    yarn: "yarn add -D stylelint stylelint-config-standard stylelint-config-modern stylelint-config-alphabetical-order stylelint-use-nesting",
    bun: "bun add -d stylelint stylelint-config-standard stylelint-config-modern stylelint-config-alphabetical-order stylelint-use-nesting",
  },
} satisfies Record<string, Commands>;

export type PackageCommandName = keyof typeof PACKAGE_COMMANDS;

export const SKILL_AGENTS = [
  { value: "claude-code", label: "Claude Code" },
  { value: "codex", label: "Codex" },
] as const;
export type SkillAgent = (typeof SKILL_AGENTS)[number]["value"];

export function packageCommand(
  name: PackageCommandName,
  manager: PackageManager,
  agent: SkillAgent,
) {
  const command = PACKAGE_COMMANDS[name][manager];
  return name === "skill" ? `${command} --agent ${agent} --yes` : command;
}
