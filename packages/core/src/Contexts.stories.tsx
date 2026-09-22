import type { Meta, StoryObj } from "@storybook/react-vite";
import type { CSSProperties, HTMLAttributes } from "react";
import { Button, Checkbox, Field, Input, Range, Switch } from "./index.js";

/**
 * Contextual meaning as a custom property.
 *
 * Declare `--loam-context: danger` on any region and every LoamUI component
 * inside adopts that meaning via container style queries; no component
 * contains context code. See the Contexts section of tokens.css and the
 * Contextualism docs.
 */
const meta = {
  title: "Foundations/Contexts",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function Zone({ children, style, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      style={{
        display: "grid",
        gap: "1rem",
        padding: "1.25rem",
        border: "1px solid var(--loam-color-line)",
        borderRadius: "var(--loam-radius-lg)",
        background: "var(--loam-color-bg)",
        maxInlineSize: "26rem",
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

/**
 * One custom property on the container; buttons, checkboxes, switches,
 * sliders, carets and focus rings inside all adopt the danger
 * accent. Below the zone: a single-element region — the "instance" form is
 * just a one-element context, and the nearest ancestor that sets the
 * property wins.
 */
export const DangerContext: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      <Zone style={{ "--loam-context": "danger" } as CSSProperties}>
        <strong>Delete workspace</strong>
        <Field.Root>
          <Field.Label>
            <Checkbox defaultChecked /> I understand this is permanent
          </Field.Label>
        </Field.Root>
        <Field.Root>
          <Field.Label>
            <Switch.Root>
              <Switch.Control defaultChecked />
              <Switch.Track>
                <Switch.Thumb />
              </Switch.Track>
            </Switch.Root>{" "}
            Also delete backups
          </Field.Label>
        </Field.Root>
        <Range.Control defaultValue={70} aria-label="Retention days" />
        <Input aria-label="Workspace name" />
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <Button>Delete</Button>
          <Button>Remove members</Button>
          <Button>Cancel</Button>
        </div>
      </Zone>

      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
        <span style={{ "--loam-context": "danger" } as CSSProperties}>
          <Button>One-element danger region</Button>
        </span>
        <Button>Normal button outside the region</Button>
      </div>
    </div>
  ),
};

/**
 * Inversion needs no context value: `color-scheme: dark` on a region flips
 * every light-dark() token for the components inside.
 */
export const InvertedRegion: Story = {
  render: () => (
    <Zone style={{ colorScheme: "dark" } as CSSProperties}>
      <strong style={{ color: "var(--loam-color-fg)" }}>An on-dark section</strong>
      <Field.Root style={{ color: "var(--loam-color-fg)" }}>
        <Field.Label>
          <Checkbox defaultChecked /> Dark-scheme tokens throughout
        </Field.Label>
      </Field.Root>
      <div style={{ display: "flex", gap: "0.75rem" }}>
        <Button>Confirm</Button>
        <Button>Cancel</Button>
      </div>
    </Zone>
  ),
};
