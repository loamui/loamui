import type { Meta, StoryObj } from "@storybook/react-vite";
import type { CSSProperties } from "react";
import { expect, userEvent, within } from "storybook/test";
import { Nav } from "./index.js";

function DashboardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </svg>
  );
}

const meta = {
  title: "Navigation/Nav",
  component: Nav.Root,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Vertical navigation composed from parts: a `nav` landmark named by its " +
          "Title (or `labels.navigation`), Lists of Items, a Link that sets " +
          "`aria-current` from `current` and takes a router's link through `render`, " +
          "and a Group that folds related links in a native `details`. The current " +
          "destination is marked with a line and weight, never colour alone; a " +
          "List nested in an Item indents a level; a horizontal nav is your flex " +
          "row on the List.",
      },
    },
  },
  render: (args) => (
    <div style={{ maxInlineSize: "16rem" }}>
      <Nav.Root {...args}>
        <Nav.Title>Project</Nav.Title>
        <Nav.List>
          <Nav.Item>
            <Nav.Link href="#dashboard">Dashboard</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="#projects" current>
              Projects
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="#team">Team</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Group defaultOpen>
              <Nav.GroupTitle>Reports</Nav.GroupTitle>
              <Nav.List>
                <Nav.Item>
                  <Nav.Link href="#weekly">Weekly</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link href="#monthly">Monthly</Nav.Link>
                </Nav.Item>
              </Nav.List>
            </Nav.Group>
          </Nav.Item>
        </Nav.List>
      </Nav.Root>
    </div>
  ),
} satisfies Meta<typeof Nav.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Icons are `svg` children before the text, aria-hidden and sized on it. */
export const WithIcons: Story = {
  render: (args) => (
    <div style={{ maxInlineSize: "16rem" }}>
      <Nav.Root {...args}>
        <Nav.List>
          <Nav.Item>
            <Nav.Link href="#dashboard">
              <DashboardIcon />
              Dashboard
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="#projects" current>
              <FolderIcon />
              Projects
            </Nav.Link>
          </Nav.Item>
        </Nav.List>
      </Nav.Root>
    </div>
  ),
};

/** A List nested in an Item indents a level; the indent is `--loam-nav-indent`. */
export const Nested: Story = {
  render: (args) => (
    <div style={{ maxInlineSize: "16rem" }}>
      <Nav.Root {...args} style={{ "--loam-nav-indent": "var(--loam-space-s)" } as CSSProperties}>
        <Nav.Title>Guides</Nav.Title>
        <Nav.List>
          <Nav.Item>
            <Nav.Link href="#tokens">Tokens</Nav.Link>
            <Nav.List>
              <Nav.Item>
                <Nav.Link href="#colour">Colour</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="#type" current>
                  Type
                </Nav.Link>
              </Nav.Item>
            </Nav.List>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="#elements">Element styles</Nav.Link>
          </Nav.Item>
        </Nav.List>
      </Nav.Root>
    </div>
  ),
};

/**
 * A closed Group holding the current page carries the marker on its title,
 * so the reader's place is never folded out of sight.
 */
export const ClosedGroupWithCurrent: Story = {
  render: (args) => (
    <div style={{ maxInlineSize: "16rem" }}>
      <Nav.Root {...args}>
        <Nav.List>
          <Nav.Item>
            <Nav.Link href="#dashboard">Dashboard</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Group>
              <Nav.GroupTitle>Reports</Nav.GroupTitle>
              <Nav.List>
                <Nav.Item>
                  <Nav.Link href="#weekly" current>
                    Weekly
                  </Nav.Link>
                </Nav.Item>
              </Nav.List>
            </Nav.Group>
          </Nav.Item>
        </Nav.List>
      </Nav.Root>
    </div>
  ),
};

/**
 * A horizontal nav is the consumer's flex row on the List, with the marker
 * moved under the link by `--loam-nav-current-edge: block-end` on the Root;
 * the primitive stays vertical.
 */
export const InlineRecipe: Story = {
  render: (args) => (
    <Nav.Root
      {...args}
      aria-label="Site"
      style={{ "--loam-nav-current-edge": "block-end" } as CSSProperties}
    >
      <Nav.List style={{ display: "flex", flexWrap: "wrap", gap: "var(--loam-space-3xs)" }}>
        <Nav.Item>
          <Nav.Link href="#docs" current>
            Docs
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="#pricing">Pricing</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="#blog">Blog</Nav.Link>
        </Nav.Item>
      </Nav.List>
    </Nav.Root>
  ),
};

/** A sidebar with several titled sections is one Root per section, stacked. */
export const StackedSections: Story = {
  render: (args) => (
    <div style={{ maxInlineSize: "16rem" }}>
      <Nav.Root {...args}>
        <Nav.Title>Workspace</Nav.Title>
        <Nav.List>
          <Nav.Item>
            <Nav.Link href="#dashboard" current>
              Dashboard
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="#projects">Projects</Nav.Link>
          </Nav.Item>
        </Nav.List>
      </Nav.Root>
      <Nav.Root {...args}>
        <Nav.Title>Account</Nav.Title>
        <Nav.List>
          <Nav.Item>
            <Nav.Link href="#profile">Profile</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="#billing">Billing</Nav.Link>
          </Nav.Item>
        </Nav.List>
      </Nav.Root>
    </div>
  ),
};

/** `render` swaps the built-in link for a router's; the wiring merges on. */
export const CustomElement: Story = {
  render: (args) => (
    <div style={{ maxInlineSize: "16rem" }}>
      <Nav.Root {...args}>
        <Nav.List>
          <Nav.Item>
            <Nav.Link render={<a data-router-link href="#home" />}>Home</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link render={<a data-router-link href="#settings" />} current>
              Settings
            </Nav.Link>
          </Nav.Item>
        </Nav.List>
      </Nav.Root>
    </div>
  ),
};

/**
 * A Link rendered as a button (a menu or popover's trigger among the links)
 * is set like the links beside it: the elements layer's button dressing is
 * shed by the stylesheet, so nothing is reset by hand.
 */
export const LinkAsButton: Story = {
  render: (args) => (
    <div style={{ maxInlineSize: "16rem" }}>
      <Nav.Root {...args}>
        <Nav.List>
          <Nav.Item>
            <Nav.Link href="#dashboard" current>
              Dashboard
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link render={<button type="button" />}>
              <FolderIcon />
              Switch workspace
            </Nav.Link>
          </Nav.Item>
        </Nav.List>
      </Nav.Root>
    </div>
  ),
};

/** The group is a native details: it folds without JavaScript and reports through onOpenChange. */
export const GroupFolds: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const group = canvas.getByText("Reports").closest("details") as HTMLDetailsElement;
    await expect(group.open).toBe(true);
    await expect(canvas.getByRole("link", { name: "Weekly" })).toBeVisible();

    await userEvent.click(canvas.getByText("Reports"));
    await expect(group.open).toBe(false);
    await expect(canvas.getByRole("link", { name: "Projects" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  },
};
