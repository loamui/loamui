import type { Meta, StoryObj } from "@storybook/react-vite";
import type { CSSProperties } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Menu } from "../../index.js";

function PencilIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M11.5 2.5l2 2L5 13l-2.5.5L3 11l8.5-8.5z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect x="5.5" y="5.5" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M3 10.5v-7a1 1 0 0 1 1-1h7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M3 4.5h10M6.5 4.5V3h3v1.5M4.5 4.5l.5 9h6l.5-9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const meta = {
  title: "Overlays/Menu",
  component: Menu.Root,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A list of actions opened from a trigger, composed from parts " +
          "(Root, Trigger, Popup, Item, CheckboxItem, RadioGroup, RadioItem, Separator, Group). The Popup uses the " +
          "native `popover` attribute with CSS anchor positioning (and a " +
          "wrapper-anchored fallback), layered with the APG menu-button " +
          "pattern: arrow keys open and rove focus, typing jumps to a match, " +
          "and activating an item closes the menu and restores focus to the " +
          "trigger.",
      },
    },
  },
  render: () => (
    <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
      <Menu.Root>
        <Menu.Trigger>Options</Menu.Trigger>
        <Menu.Popup>
          <Menu.Item onClick={() => {}}>Rename</Menu.Item>
          <Menu.Item onClick={() => {}}>Duplicate</Menu.Item>
          <Menu.Separator />
          <Menu.Group>
            <Menu.GroupLabel>Danger zone</Menu.GroupLabel>
            <Menu.Item onClick={() => {}}>Delete</Menu.Item>
          </Menu.Group>
        </Menu.Popup>
      </Menu.Root>
    </div>
  ),
} satisfies Meta<typeof Menu.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Compose the menu from parts: Trigger, Popup, Item, Separator, Group and
 * GroupLabel. ArrowDown/ArrowUp on the trigger open it, arrow keys rove
 * focus through the items, and activating one closes the menu and returns
 * focus to the trigger — the APG menu-button pattern.
 */
export const Default: Story = {};

/** An Item with `href` renders as a real link instead of a button. */
export const WithLinks: Story = {
  render: () => (
    <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
      <Menu.Root>
        <Menu.Trigger>Project</Menu.Trigger>
        <Menu.Popup>
          <Menu.Item onClick={() => {}}>Rename</Menu.Item>
          <Menu.Separator />
          <Menu.Item href="#settings">Settings</Menu.Item>
          <Menu.Item href="#export">Export…</Menu.Item>
        </Menu.Popup>
      </Menu.Root>
    </div>
  ),
};

/**
 * Disabled items use `aria-disabled` — they stay visible to assistive
 * technology but are skipped by roving focus and cannot be activated.
 */
export const DisabledItems: Story = {
  render: () => (
    <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
      <Menu.Root>
        <Menu.Trigger>Document</Menu.Trigger>
        <Menu.Popup>
          <Menu.Item onClick={() => {}}>Edit</Menu.Item>
          <Menu.Item disabled>Publish (needs review)</Menu.Item>
          <Menu.Item onClick={() => {}}>Share</Menu.Item>
        </Menu.Popup>
      </Menu.Root>
    </div>
  ),
};

/**
 * Contextual meaning as a custom property: declare `--loam-context: danger`
 * on a region (here, the danger-zone Group) and the items inside adopt the
 * danger accent — no `color` prop, no component-level context code.
 */
export const DangerContext: Story = {
  render: () => (
    <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
      <Menu.Root>
        <Menu.Trigger>Workspace</Menu.Trigger>
        <Menu.Popup>
          <Menu.Item onClick={() => {}}>Rename</Menu.Item>
          <Menu.Item onClick={() => {}}>Duplicate</Menu.Item>
          <Menu.Separator />
          <Menu.Group style={{ "--loam-context": "danger" } as CSSProperties}>
            <Menu.GroupLabel>Danger zone</Menu.GroupLabel>
            <Menu.Item onClick={() => {}}>Delete workspace</Menu.Item>
          </Menu.Group>
        </Menu.Popup>
      </Menu.Root>
    </div>
  ),
};

/**
 * Settings that live in the menu: `CheckboxItem` toggles (role
 * menuitemcheckbox), a `RadioGroup` of `RadioItem`s picks one (role
 * menuitemradio). Both keep the menu open on activation, since a setting is
 * usually one of several adjusted in one visit; the glyph is CSS.
 */
export const CheckableItems: Story = {
  render: () => (
    <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
      <Menu.Root>
        <Menu.Trigger>View</Menu.Trigger>
        <Menu.Popup>
          <Menu.CheckboxItem defaultChecked>Show hidden files</Menu.CheckboxItem>
          <Menu.CheckboxItem>Show file extensions</Menu.CheckboxItem>
          <Menu.Separator />
          <Menu.RadioGroup defaultValue="name">
            <Menu.GroupLabel>Sort by</Menu.GroupLabel>
            <Menu.RadioItem value="name">Name</Menu.RadioItem>
            <Menu.RadioItem value="date">Date modified</Menu.RadioItem>
            <Menu.RadioItem value="size">Size</Menu.RadioItem>
          </Menu.RadioGroup>
        </Menu.Popup>
      </Menu.Root>
    </div>
  ),
};

/** Items lay out icon + label with flex; inline SVGs size to the text. */
export const IconItems: Story = {
  render: () => (
    <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
      <Menu.Root>
        <Menu.Trigger>Actions</Menu.Trigger>
        <Menu.Popup>
          <Menu.Item onClick={() => {}}>
            <PencilIcon />
            Rename
          </Menu.Item>
          <Menu.Item onClick={() => {}}>
            <CopyIcon />
            Duplicate
          </Menu.Item>
          <Menu.Separator />
          <Menu.Item onClick={() => {}}>
            <TrashIcon />
            Delete
          </Menu.Item>
        </Menu.Popup>
      </Menu.Root>
    </div>
  ),
};

/**
 * Interaction test: clicking the trigger opens the menu and focuses the
 * first item, ArrowDown roves focus, and Escape closes and returns focus to
 * the trigger.
 */
export const OpensNavigatesAndDismisses: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: /options/i });

    await expect(trigger).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    const rename = await within(document.body).findByRole("menuitem", {
      name: /rename/i,
    });
    await waitFor(() => expect(rename).toHaveFocus());

    await userEvent.keyboard("{ArrowDown}");
    const duplicate = within(document.body).getByRole("menuitem", {
      name: /duplicate/i,
    });
    await expect(duplicate).toHaveFocus();

    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(trigger).toHaveAttribute("aria-expanded", "false"));
    await expect(trigger).toHaveFocus();
  },
};
