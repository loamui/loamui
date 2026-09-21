"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { Field, Select, Tabs } from "@loamui/core";
import { CodeBlock } from "../components/CodeBlock";
import {
  packageCommand,
  SKILL_AGENTS,
  type SkillAgent,
  PACKAGE_MANAGERS,
  type PackageCommandName,
  type PackageManager,
} from "./package-commands";
import "./PackageCommands.css";

const ManagerContext = createContext<{
  manager: PackageManager;
  select: (manager: PackageManager) => void;
} | null>(null);

export function PackageManagerProvider({ children }: { children: ReactNode }) {
  const [manager, select] = useState<PackageManager>("pnpm");
  const value = useMemo(() => ({ manager, select }), [manager]);
  return <ManagerContext value={value}>{children}</ManagerContext>;
}

export function PackageCommands({ name }: { name: PackageCommandName }) {
  const [agent, selectAgent] = useState<SkillAgent>("claude-code");
  const shared = useContext(ManagerContext);
  const [local, selectLocal] = useState<PackageManager>("pnpm");
  const manager = shared?.manager ?? local;
  const select = shared?.select ?? selectLocal;
  return (
    <div className="site-PackageCommands">
      {name === "skill" && (
        <Field.Root>
          <Field.Label>Coding agent</Field.Label>
          <Select.Root
            value={agent}
            onChange={(event) => {
              const selected = SKILL_AGENTS.find((item) => item.value === event.target.value);
              if (selected) selectAgent(selected.value);
            }}
          >
            {SKILL_AGENTS.map((item) => (
              <Select.Option key={item.value} value={item.value}>
                {item.label}
              </Select.Option>
            ))}
          </Select.Root>
        </Field.Root>
      )}
      <Tabs.Root
        value={manager}
        onValueChange={(value) => {
          const selected = PACKAGE_MANAGERS.find((item) => item === value);
          if (selected) select(selected);
        }}
      >
        <Tabs.List aria-label="Package manager">
          {PACKAGE_MANAGERS.map((item) => (
            <Tabs.Tab key={item} value={item}>
              {item}
            </Tabs.Tab>
          ))}
        </Tabs.List>
        {PACKAGE_MANAGERS.map((item) => (
          <Tabs.Panel key={item} value={item}>
            <CodeBlock code={packageCommand(name, item, agent)} language="bash" />
          </Tabs.Panel>
        ))}
      </Tabs.Root>
    </div>
  );
}
