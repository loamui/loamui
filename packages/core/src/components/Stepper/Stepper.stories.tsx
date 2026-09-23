import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Stepper } from "../../index.js";

const ORDER = [
  ["Order placed", "We have your order and your payment has cleared."],
  ["Being packed", "Your items are being picked and packed at the warehouse."],
  ["Dispatched", "We will send the tracking number when the courier collects it."],
  ["Delivered", "Usually two working days after dispatch."],
] as const;

function Order(props: { current?: number }) {
  return (
    <Stepper.Root>
      {ORDER.map(([title, text], i) => (
        <Stepper.Step key={title} aria-current={props.current === i ? "step" : undefined}>
          <Stepper.Marker />
          <Stepper.Title>{title}</Stepper.Title>
          <Stepper.Description>{text}</Stepper.Description>
        </Stepper.Step>
      ))}
    </Stepper.Root>
  );
}

const meta = {
  title: "Data display/Stepper",
  component: Stepper.Root,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "An ordered list of steps that shows how far a sequence has got, composed " +
          'from parts (Root, Step, Marker, Title, Description). Put aria-current="step" ' +
          "on the step reached and the rest is detected: the steps before it are " +
          "complete, the steps after it upcoming, in paint and in hidden words. The " +
          "steps stack, and sit in a row when the container is 40rem or wider.",
      },
    },
  },
  render: () => (
    <div style={{ maxInlineSize: "56rem" }}>
      <Order current={1} />
    </div>
  ),
} satisfies Meta<typeof Stepper.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

/** An order under way: one complete step, the current one ringed, two upcoming. */
export const Default: Story = {};

/** With no current step it is a numbered list. */
export const NoCurrentStep: Story = {
  render: () => (
    <div style={{ maxInlineSize: "56rem" }}>
      <Order />
    </div>
  ),
};

/** In a narrow container the same list stacks. */
export const Stacked: Story = {
  render: () => (
    <div style={{ maxInlineSize: "24rem" }}>
      <Order current={2} />
    </div>
  ),
};

/** A complete step the reader can go back to: its Title renders a link. */
export const LinkBack: Story = {
  render: () => (
    <div style={{ maxInlineSize: "56rem" }}>
      <Stepper.Root labels={{ list: "Checkout" }}>
        <Stepper.Step>
          <Stepper.Marker />
          <Stepper.Title render={<a href="#basket" />}>Basket</Stepper.Title>
        </Stepper.Step>
        <Stepper.Step>
          <Stepper.Marker />
          <Stepper.Title render={<a href="#address" />}>Delivery address</Stepper.Title>
        </Stepper.Step>
        <Stepper.Step aria-current="step">
          <Stepper.Marker />
          <Stepper.Title>Payment</Stepper.Title>
        </Stepper.Step>
        <Stepper.Step>
          <Stepper.Marker />
          <Stepper.Title>Review</Stepper.Title>
        </Stepper.Step>
      </Stepper.Root>
    </div>
  ),
};

/**
 * Interaction test: every step carries both words as hidden text and the
 * stylesheet keeps the wrong one out of the accessibility tree, so the check
 * is on what is displayed, not on the text content.
 */
export const AnnouncesState: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const [complete, current, upcoming] = canvas.getAllByRole("listitem") as [
      HTMLElement,
      HTMLElement,
      HTMLElement,
    ];
    await expect(within(complete).getByText("Completed")).toBeVisible();
    await expect(within(complete).getByText("Current step")).not.toBeVisible();
    await expect(within(current).getByText("Current step")).toBeVisible();
    await expect(within(current).getByText("Completed")).not.toBeVisible();
    await expect(within(upcoming).getByText("Completed")).not.toBeVisible();
    await expect(within(upcoming).getByText("Current step")).not.toBeVisible();
  },
};
