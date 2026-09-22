import type { Meta, StoryObj } from "@storybook/react-vite";
import type { CSSProperties } from "react";
import { Button, Loader } from "../../index.js";

const meta = {
  title: "Inputs/Button",
  component: Button,
  tags: ["autodocs"],
  args: { children: "Button" },
  parameters: {
    docs: {
      description: {
        component:
          "Neutral by default; the surrounding region decides the look " +
          "(`--loam-context` on a region, container width, composed icons), " +
          "not by props.",
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Neutral by default — there is no variant or size prop. */
export const Default: Story = {};

/**
 * Declare `--loam-context` on any region and every button inside re-answers
 * its colour channel via container style queries. A single instance can be
 * recoloured through the registered `--loam-button-color` property.
 */
export const Contexts: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "1rem", maxInlineSize: "30rem" }}>
      <div style={{ display: "flex", gap: "0.75rem" }}>
        <Button>Neutral</Button>
      </div>
      <div
        style={
          {
            "--loam-context": "primary",
            display: "flex",
            gap: "0.75rem",
          } as CSSProperties
        }
      >
        <Button>Primary region</Button>
        <Button>Also primary</Button>
      </div>
      <div
        style={
          {
            "--loam-context": "danger",
            display: "flex",
            gap: "0.75rem",
          } as CSSProperties
        }
      >
        <Button>Danger region</Button>
      </div>
      <div style={{ display: "flex", gap: "0.75rem" }}>
        <Button
          style={
            {
              "--loam-button-color": "light-dark(darkblue, lightblue)",
            } as CSSProperties
          }
        >
          Custom via --loam-button-color
        </Button>
      </div>
    </div>
  ),
};

/**
 * Size of space is a context: in containers of 16rem or less the button
 * takes the full width, and padding/font are fluid container-relative
 * tokens — there is no size prop.
 */
export const NarrowContainer: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "1rem" }}>
      <div
        style={{
          containerType: "inline-size",
          inlineSize: "14rem",
          padding: "1rem",
          border: "1px dashed var(--loam-color-line)",
        }}
      >
        <Button>Full width in a narrow container</Button>
      </div>
      <div
        style={{
          containerType: "inline-size",
          inlineSize: "28rem",
          padding: "1rem",
          border: "1px dashed var(--loam-color-line)",
        }}
      >
        <Button>Natural width in a wide one</Button>
      </div>
    </div>
  ),
};

/** Icons are detected with `:has(svg)`; spinners compose as children. */
export const WithContent: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
      <Button>
        <svg viewBox="0 -0.5 25 25" fill="none" aria-hidden>
          <path
            d="M5.5 12.5L10.167 17L19.5 8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Approve
      </Button>
      <Button aria-label="Approve">
        <svg viewBox="0 -0.5 25 25" fill="none" aria-hidden>
          <path
            d="M5.5 12.5L10.167 17L19.5 8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Button>
      <Button>
        <svg viewBox="0 -0.5 25 25" fill="none" aria-hidden>
          <path
            d="M5.5 12.5L10.167 17L19.5 8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="loam-VisuallyHidden">Approve</span>
      </Button>
      <Button disabled>
        <Loader />
        Saving
      </Button>
    </div>
  ),
};

/**
 * `render` substitutes the element and merges the Button's class and wiring
 * onto it. Not for navigation (that is SignpostLink); here, a summary that
 * looks like the button it behaves as.
 */
export const CustomElement: Story = {
  render: () => (
    <details>
      <Button render={<summary />}>Show details</Button>
      <p>The disclosure is native; the summary wears the button.</p>
    </details>
  ),
};

/**
 * Width comes from the parent's layout, not an attribute or prop: a grid
 * (or stacked flex) region stretches its buttons natively.
 */
export const ContextualFullWidth: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "0.75rem", width: 280 }}>
      <Button>Save changes</Button>
      <Button>Cancel</Button>
    </div>
  ),
};
