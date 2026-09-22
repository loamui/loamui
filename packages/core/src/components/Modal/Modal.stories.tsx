import type { Meta, StoryObj } from "@storybook/react-vite";
import type { CSSProperties } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Modal } from "../../index.js";

const meta = {
  title: "Overlays/Modal",
  component: Modal.Root,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A blocking dialog for must-complete tasks, composed from parts " +
          "(Root, Trigger, Popup, Title, Description, Close). The Popup is a " +
          "native `<dialog>` opened with `showModal()`, so the top layer, " +
          "`::backdrop`, focus containment, Escape handling and " +
          "focus-restore-to-opener all come from the browser.",
      },
    },
  },
  render: () => (
    <Modal.Root>
      <Modal.Trigger>Invite a teammate</Modal.Trigger>
      <Modal.Popup>
        <Modal.Title>Invite a teammate</Modal.Title>
        <Modal.Description>
          They&apos;ll receive an email invitation to join your workspace.
        </Modal.Description>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "var(--loam-space-2xs)",
            alignItems: "center",
          }}
        >
          <span style={{ "--loam-context": "primary" } as CSSProperties}>
            <Modal.Close>Send invite</Modal.Close>
          </span>
          <Modal.Close>Cancel</Modal.Close>
        </div>
      </Modal.Popup>
    </Modal.Root>
  ),
} satisfies Meta<typeof Modal.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Compose the dialog from parts. The Popup is a native `<dialog>` opened
 * with `showModal()` — top layer, backdrop, focus containment, Escape and
 * focus restore all come from the browser.
 */
export const Playground: Story = {};

/**
 * `alert` renders `role="alertdialog"`: no light dismiss (Escape still
 * closes), initial focus on the least-destructive action via autoFocus.
 */
export const AlertDialog: Story = {
  render: () => (
    <Modal.Root>
      <span style={{ "--loam-context": "danger" } as CSSProperties}>
        <Modal.Trigger>Delete file</Modal.Trigger>
      </span>
      <Modal.Popup alert>
        <Modal.Title>Delete this file?</Modal.Title>
        <Modal.Description>This cannot be undone.</Modal.Description>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "var(--loam-space-2xs)",
            alignItems: "center",
          }}
        >
          <Modal.Close autoFocus>Cancel</Modal.Close>
          <span style={{ "--loam-context": "danger" } as CSSProperties}>
            <Modal.Close>Delete</Modal.Close>
          </span>
        </div>
      </Modal.Popup>
    </Modal.Root>
  ),
};

/**
 * The panel sizes to its content between a floor and a readable cap — a
 * confirmation shrink-wraps, a form grows. When a design needs an explicit
 * width, set `--loam-modal-size` where the modal is used.
 */
export const Width: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "var(--loam-space-2xs)",
        alignItems: "center",
      }}
    >
      <Modal.Root>
        <Modal.Trigger>Content-sized</Modal.Trigger>
        <Modal.Popup>
          <Modal.Title>Signed out</Modal.Title>
          <Modal.Description>Sign in again to continue.</Modal.Description>
          <Modal.Close>Close</Modal.Close>
        </Modal.Popup>
      </Modal.Root>
      <Modal.Root>
        <Modal.Trigger>Wide (44rem)</Modal.Trigger>
        <Modal.Popup style={{ "--loam-modal-size": "44rem" } as CSSProperties}>
          <Modal.Title>Release notes</Modal.Title>
          <Modal.Description>
            A wide panel for content that needs the room, set with one custom property where the
            modal is used.
          </Modal.Description>
          <Modal.Close>Close</Modal.Close>
        </Modal.Popup>
      </Modal.Root>
    </div>
  ),
};

/** A header row with an × close button — a composition pattern, not API. */
export const WithHeaderClose: Story = {
  render: () => (
    <Modal.Root>
      <Modal.Trigger>Open settings</Modal.Trigger>
      <Modal.Popup>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBlockEnd: "var(--loam-space-2xs)",
          }}
        >
          <Modal.Title style={{ margin: 0 }}>Settings</Modal.Title>
          <Modal.Close aria-label="Close">×</Modal.Close>
        </div>
        <Modal.Description>Manage your workspace settings.</Modal.Description>
      </Modal.Popup>
    </Modal.Root>
  ),
};

/** Statically open (defaultOpen) — for visual/a11y review of the open state. */
export const OpenByDefault: Story = {
  render: () => (
    <Modal.Root defaultOpen>
      <Modal.Trigger>Invite a teammate</Modal.Trigger>
      <Modal.Popup>
        <Modal.Title>Invite a teammate</Modal.Title>
        <Modal.Description>Should sit centred over a dimmed backdrop.</Modal.Description>
        <Modal.Close>Close</Modal.Close>
      </Modal.Popup>
    </Modal.Root>
  ),
};

/**
 * Interaction test — real-browser coverage for the native behaviors jsdom
 * can't exercise: Escape closing and focus restoration to the trigger.
 */
export const OpensAndDismisses: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: /invite a teammate/i });

    await userEvent.click(trigger);
    const dialog = document.querySelector("dialog")!;
    await expect(dialog.open).toBe(true);
    await expect(trigger).toHaveAttribute("data-popup-open", "true");

    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(dialog.open).toBe(false));
    await waitFor(() => expect(trigger).not.toHaveAttribute("data-popup-open"));
    await expect(trigger).toHaveFocus();
  },
};
