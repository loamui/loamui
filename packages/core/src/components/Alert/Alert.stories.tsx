import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import type { CSSProperties } from "react";
import { Alert } from "../../index.js";

const meta = {
  title: "Feedback/Alert",
  component: Alert.Root,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Compose the icon, heading, description and dismiss button as children. The surrounding --loam-context region supplies the status colour.",
      },
    },
  },
} satisfies Meta<typeof Alert.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Alert.Root {...args}>
      <Alert.Body>
        <Alert.Title>Heads up</Alert.Title>
        <Alert.Description>Your changes have been saved to the draft.</Alert.Description>
      </Alert.Body>
    </Alert.Root>
  ),
};

export const Contexts: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <Alert.Root>
        <Alert.Body>
          <Alert.Title>Neutral</Alert.Title>
          <Alert.Description>A plain notice.</Alert.Description>
        </Alert.Body>
      </Alert.Root>
      <div style={{ "--loam-context": "info" } as CSSProperties}>
        <Alert.Root>
          <Alert.Body>
            <Alert.Title>Info</Alert.Title>
            <Alert.Description>A neutral, informational message.</Alert.Description>
          </Alert.Body>
        </Alert.Root>
      </div>
      <div style={{ "--loam-context": "success" } as CSSProperties}>
        <Alert.Root>
          <Alert.Body>
            <Alert.Title>Success</Alert.Title>
            <Alert.Description>Your payment went through.</Alert.Description>
          </Alert.Body>
        </Alert.Root>
      </div>
      <div style={{ "--loam-context": "warning" } as CSSProperties}>
        <Alert.Root>
          <Alert.Body>
            <Alert.Title>Warning</Alert.Title>
            <Alert.Description>Your trial ends in three days.</Alert.Description>
          </Alert.Body>
        </Alert.Root>
      </div>
      <div style={{ "--loam-context": "danger" } as CSSProperties}>
        <Alert.Root>
          <Alert.Body>
            <Alert.Title>Error</Alert.Title>
            <Alert.Description>We couldn&apos;t reach the server.</Alert.Description>
          </Alert.Body>
        </Alert.Root>
      </div>
    </div>
  ),
};

export const WithIcon: Story = {
  render: (args) => (
    <div style={{ "--loam-context": "success" } as CSSProperties}>
      <Alert.Root {...args}>
        <Alert.Icon>
          <span aria-hidden>✅</span>
        </Alert.Icon>
        <Alert.Body>
          <Alert.Title>Deployed</Alert.Title>
          <Alert.Description>Your site is live at loamui.dev.</Alert.Description>
        </Alert.Body>
      </Alert.Root>
    </div>
  ),
};

export const DescriptionOnly: Story = {
  render: (args) => (
    <Alert.Root {...args}>
      <Alert.Body>
        <Alert.Description>A concise, single-line notice with no heading.</Alert.Description>
      </Alert.Body>
    </Alert.Root>
  ),
};

export const Dismissible: Story = {
  render: (args) => (
    <Alert.Root {...args}>
      <Alert.Body>
        <Alert.Title>Draft restored</Alert.Title>
        <Alert.Description>We recovered the draft you were editing.</Alert.Description>
      </Alert.Body>
      <Alert.Close onClose={() => {}} />
    </Alert.Root>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("button", { name: "Dismiss" }),
    ).toBeInTheDocument();
  },
};

export const Composed: Story = {
  render: () => (
    <div style={{ "--loam-context": "warning" } as CSSProperties}>
      <Alert.Root>
        <Alert.Icon>
          <span aria-hidden>⚠</span>
        </Alert.Icon>
        <Alert.Body>
          <Alert.Title render={<h2 />}>Storage almost full</Alert.Title>
          <Alert.Description>Free up space to keep syncing.</Alert.Description>
        </Alert.Body>
        <Alert.Close onClose={() => {}} labels={{ close: "Hide this warning" }} />
      </Alert.Root>
    </div>
  ),
};

export const Interrupting: Story = {
  render: (args) => (
    <div style={{ "--loam-context": "danger" } as CSSProperties}>
      <Alert.Root {...args} role="alert">
        <Alert.Body>
          <Alert.Title>Payment declined</Alert.Title>
          <Alert.Description>
            Your card was refused. Try another card or contact your bank.
          </Alert.Description>
        </Alert.Body>
      </Alert.Root>
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("alert")).toHaveTextContent("Payment declined");
  },
};
