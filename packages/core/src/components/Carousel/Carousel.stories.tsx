import type { Meta, StoryObj } from "@storybook/react-vite";
import type { CSSProperties } from "react";
import { expect, userEvent, within } from "storybook/test";
import { Card } from "../Card/Card.js";
import { Carousel } from "../../index.js";

const GUIDES = [
  ["Tokens", "Four hues, eight neutrals and two fluid scales; everything else is derived."],
  ["Element styles", "Native HTML, styled page-wide, so plain markup is presentable first."],
  ["Components", "A small set of contextually styled parts; no size or variant props."],
  ["Contextualism", "A region declares what it means and everything inside adapts."],
  ["Accessibility", "Semantic HTML, managed focus and keyboard support as the baseline."],
] as const;

const row = { display: "flex", gap: "var(--loam-space-2xs)" } as const;

function Guides(props: { loop?: boolean; indicators?: boolean }) {
  return (
    <Carousel.Root aria-labelledby="guides" loop={props.loop}>
      <h2 id="guides" style={{ margin: 0 }}>
        Guides
      </h2>
      <Carousel.Track>
        {GUIDES.map(([title, text]) => (
          <Carousel.Item key={title}>
            <Card>
              <h3>{title}</h3>
              <p>{text}</p>
            </Card>
          </Carousel.Item>
        ))}
      </Carousel.Track>
      <div style={row}>
        <Carousel.Previous />
        <Carousel.Next />
      </div>
      {props.indicators && <Carousel.Indicators />}
    </Carousel.Root>
  );
}

const meta = {
  title: "Data display/Carousel",
  component: Carousel.Root,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A scroll-snap track of items with buttons that page it, indicators that " +
          "jump to an item and a live status, composed from parts (Root, Track, Item, " +
          "Previous, Next, Indicators). The track is a native scroller, so a wheel, a " +
          "swipe and the arrow keys all work without the buttons; the current item is " +
          "read from the scroll position, so every part follows a swipe too.",
      },
    },
  },
  render: () => (
    <div style={{ maxInlineSize: "44rem" }}>
      <Guides />
    </div>
  ),
} satisfies Meta<typeof Carousel.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Scroll the track, or page it with the buttons; each card snaps into
 * place. Tab reaches the track and ArrowLeft/ArrowRight page it.
 */
export const Default: Story = {};

/** One dot per item; the current one follows the scroll position. */
export const WithIndicators: Story = {
  render: () => (
    <div style={{ maxInlineSize: "44rem" }}>
      <Guides indicators />
    </div>
  ),
};

/** With `loop`, Previous and Next never disable: at an end they wrap around. */
export const Looping: Story = {
  render: () => (
    <div style={{ maxInlineSize: "44rem" }}>
      <Guides loop indicators />
    </div>
  ),
};

/** Items share one width, the public `--loam-carousel-item-size`, set on the Root. */
export const ItemSize: Story = {
  render: () => (
    <div style={{ maxInlineSize: "44rem" }}>
      <Carousel.Root
        labels={{ region: "Colours" }}
        style={{ "--loam-carousel-item-size": "8rem" } as CSSProperties}
      >
        <Carousel.Track>
          {["primary", "success", "warning", "info", "danger"].map((context) => (
            <Carousel.Item key={context} style={{ "--loam-context": context } as CSSProperties}>
              <Card>{context}</Card>
            </Carousel.Item>
          ))}
        </Carousel.Track>
        <div style={row}>
          <Carousel.Previous />
          <Carousel.Next />
        </div>
      </Carousel.Root>
    </div>
  ),
};

/** Interaction test: the region is named, the track is a keyboard stop, Previous starts disabled. */
export const NamedAndReachable: Story = {
  render: () => (
    <div style={{ maxInlineSize: "44rem" }}>
      <Guides indicators />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("region", { name: "Guides" })).toHaveAttribute(
      "aria-roledescription",
      "carousel",
    );
    await expect(canvas.getByRole("button", { name: "Previous" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    await userEvent.tab();
    await expect(canvasElement.querySelector("ul.track")).toHaveFocus();
  },
};
