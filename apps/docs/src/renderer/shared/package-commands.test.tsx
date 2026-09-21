import { afterEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { PackageCommands } from "./PackageCommands";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

it("copies the selected agent and package manager in the skill install command", async () => {
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      disconnect() {}
    },
  );
  const writeText = vi.fn().mockResolvedValue(undefined);
  vi.stubGlobal("navigator", { ...navigator, clipboard: { writeText } });
  render(<PackageCommands name="skill" />);
  expect(screen.getByRole("combobox", { name: "Coding agent" })).toHaveValue("claude-code");
  fireEvent.click(screen.getByRole("button", { name: /copy/i }));
  await waitFor(() =>
    expect(writeText).toHaveBeenLastCalledWith(
      "pnpm dlx skills@latest add loamui/loamui --skill loamui --agent claude-code --yes",
    ),
  );
  fireEvent.change(screen.getByRole("combobox"), { target: { value: "codex" } });
  fireEvent.click(screen.getByRole("tab", { name: "npm" }));
  fireEvent.click(screen.getByRole("button", { name: /copy/i }));
  await waitFor(() =>
    expect(writeText).toHaveBeenLastCalledWith(
      "npx --yes skills@latest add loamui/loamui --skill loamui --agent codex --yes",
    ),
  );
});
