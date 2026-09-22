import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Pagination } from "../../index.js";

/**
 * Stories intercept the real links to keep navigation inside Storybook.
 */
function PagerDemo({
  count = 10,
  initialPage = 1,
  siblings = 1,
  edges = false,
}: {
  count?: number;
  initialPage?: number;
  siblings?: number;
  edges?: boolean;
}) {
  const [page, setPage] = useState(initialPage);
  const href = (next: number) => `?page=${next}`;
  return (
    <Pagination.Root>
      <Pagination.List>
        {edges && (
          <Pagination.Item>
            <Pagination.Link
              href={href(1)}
              aria-label="First page"
              disabled={page === 1}
              onClick={(event) => {
                event.preventDefault();
                setPage(1);
              }}
            >
              «
            </Pagination.Link>
          </Pagination.Item>
        )}
        <Pagination.Pages
          page={page}
          count={count}
          siblings={siblings}
          getHref={href}
          onNavigate={(next, event) => {
            event.preventDefault();
            setPage(next);
          }}
        />
        {edges && (
          <Pagination.Item>
            <Pagination.Link
              href={href(count)}
              aria-label="Last page"
              disabled={page === count}
              onClick={(event) => {
                event.preventDefault();
                setPage(count);
              }}
            >
              »
            </Pagination.Link>
          </Pagination.Item>
        )}
      </Pagination.List>
    </Pagination.Root>
  );
}

const meta = {
  title: "Navigation/Pagination",
  component: Pagination.Root,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Link-first page navigation composed from parts (Root, List, Item, Link, Ellipsis) on top of Button. `Pagination.Pages` renders Previous, the numbered window and Next from `page`/`count`; edge links are your own Items around it.",
      },
    },
  },
  render: () => <PagerDemo />,
} satisfies Meta<typeof Pagination.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** First/last links are the consumer's own Items around `Pagination.Pages`. */
export const WithEdges: Story = {
  render: () => <PagerDemo initialPage={5} edges />,
};

/** A large page count collapses the middle into ellipsis gaps. */
export const ManyPages: Story = {
  render: () => <PagerDemo count={25} initialPage={12} edges />,
};

/** More sibling pages shown either side of the active page. */
export const MoreSiblings: Story = {
  render: () => <PagerDemo count={25} initialPage={12} siblings={2} />,
};

/**
 * Interaction test: clicking Next and a numbered page moves the active page.
 * The active control carries `aria-current="page"`.
 */
export const NavigatesPages: Story = {
  render: () => <PagerDemo count={10} initialPage={1} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const page1 = canvas.getByRole("link", { name: "Page 1" });
    await expect(page1).toHaveAttribute("aria-current", "page");

    await userEvent.click(canvas.getByRole("link", { name: "Next page" }));
    const page2 = canvas.getByRole("link", { name: "Page 2" });
    await expect(page2).toHaveAttribute("aria-current", "page");
    await expect(page1).not.toHaveAttribute("aria-current");

    await userEvent.click(canvas.getByRole("link", { name: "Page 4" }));
    const page4 = canvas.getByRole("link", { name: "Page 4" });
    await expect(page4).toHaveAttribute("aria-current", "page");
    await expect(page2).not.toHaveAttribute("aria-current");
  },
};
