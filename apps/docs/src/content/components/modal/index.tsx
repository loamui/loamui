import type { ComponentContent } from "@/renderer/types";
import { ModalAlertDemo, ModalDemo, ModalHeaderCloseDemo, ModalWidthDemo } from "./examples";

const doc: ComponentContent = {
  slug: "modal",
  lead: "A blocking dialog for must-complete tasks, built on the native <dialog> element and the browser's top layer, which paints above everything else.",
  importLine: `import { Modal } from "@loamui/core";`,
  demos: [
    {
      title: "Basic usage",
      description:
        "Compose the dialog from parts. The Popup is a native <dialog> opened with showModal(): top layer, backdrop, focus containment, Escape and focus restore all come from the browser.",
      code: `<Modal.Root>
  <Modal.Trigger>Invite a teammate</Modal.Trigger>
  <Modal.Popup>
    <Modal.Title>Invite a teammate</Modal.Title>
    <Modal.Description>
      They'll receive an email invitation to join your workspace.
    </Modal.Description>
    <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--loam-space-2xs)", alignItems: "center" }}>
      <span style={{ "--loam-context": "primary" }}>
        <Modal.Close>Send invite</Modal.Close>
      </span>
      <Modal.Close>Cancel</Modal.Close>
    </div>
  </Modal.Popup>
</Modal.Root>`,
      render: () => <ModalDemo />,
    },
    {
      title: "Alert dialog (confirmation)",
      description:
        'alert renders role="alertdialog": the backdrop doesn\'t light-dismiss (closing on an outside click or Escape) because closedby="closerequest" answers only Escape, and autoFocus belongs on the least-destructive action so it is the default answer. Use for destructive or irreversible confirmations only.',
      code: `<Modal.Root>
  <span style={{ "--loam-context": "danger" }}>
    <Modal.Trigger>Delete file</Modal.Trigger>
  </span>
  <Modal.Popup alert>
    <Modal.Title>Delete this file?</Modal.Title>
    <Modal.Description>
      "report-final-v2.pdf" will be permanently deleted. This cannot be undone.
    </Modal.Description>
    <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--loam-space-2xs)", alignItems: "center" }}>
      <Modal.Close autoFocus>Cancel</Modal.Close>
      <span style={{ "--loam-context": "danger" }}>
        <Modal.Close>Delete</Modal.Close>
      </span>
    </div>
  </Modal.Popup>
</Modal.Root>`,
      render: () => <ModalAlertDemo />,
    },
    {
      title: "Width",
      description:
        "The panel sizes to its content between a floor and a readable cap: a confirmation shrink-wraps, a form grows. When a design needs an explicit width, set --loam-modal-size where the modal is used.",
      code: `<Modal.Root>
  <Modal.Trigger>Content-sized</Modal.Trigger>
  <Modal.Popup>
    <Modal.Title>Signed out</Modal.Title>
    <Modal.Description>Sign in again to continue.</Modal.Description>
    <Modal.Close>Close</Modal.Close>
  </Modal.Popup>
</Modal.Root>

<Modal.Root>
  <Modal.Trigger>Wide (44rem)</Modal.Trigger>
  <Modal.Popup style={{ "--loam-modal-size": "44rem" }}>
    <Modal.Title>Release notes</Modal.Title>
    <Modal.Description>
      A wide panel for content that needs the room, set with one custom property where the
      modal is used.
    </Modal.Description>
    <Modal.Close>Close</Modal.Close>
  </Modal.Popup>
</Modal.Root>`,
      render: () => <ModalWidthDemo />,
    },
    {
      title: "Header with a close button",
      description:
        "A header row with an × is a composition pattern, not configuration: compose Modal.Title and Modal.Close however your design needs.",
      code: `<Modal.Root>
  <Modal.Trigger>Open settings</Modal.Trigger>
  <Modal.Popup>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBlockEnd: "var(--loam-space-2xs)" }}>
      <Modal.Title style={{ margin: 0 }}>Settings</Modal.Title>
      <Modal.Close aria-label="Close">×</Modal.Close>
    </div>
    <Modal.Description>Manage your workspace settings.</Modal.Description>
  </Modal.Popup>
</Modal.Root>`,
      render: () => <ModalHeaderCloseDemo />,
    },
  ],
  whenToUse: [
    "For blocking, must-complete tasks (confirmations of destructive actions, short focused forms) where the user should not interact with the page behind.",
    "When losing the in-progress state would be costly, and the dialog protects it.",
  ],
  whenNotToUse: [
    "For supplementary content or quick actions that don't need to block, use Popover.",
    "For anything long-form or multi-step, navigate to a page instead and keep the interaction in the page flow.",
    "For non-essential announcements, use Alert in the page.",
  ],
  howItWorks: [
    {
      title: "Destructive confirmations use the alert variant",
      body: 'The alert prop on Modal.Popup renders role="alertdialog" and sets closedby="closerequest": the backdrop stops light-dismissing, so a stray click cannot answer a destructive question; only an explicit choice or Escape closes it. Reserve it for decisions with consequences; an ordinary modal should stay casually dismissible.',
    },
    {
      title: "Focus is the browser's to manage",
      body: "showModal() moves focus into the dialog, contains it, and returns it to the trigger on close. Add autoFocus only when the dialog's task starts at a specific control, such as a name field in a rename dialog. Anything else fights behaviour screen-reader users rely on.",
    },
    {
      title: "A modal is one task",
      body: "If the content scrolls, needs sections, or asks more than one question, it has outgrown the dialog: make it a page. The dialog's value is that everything needed for the decision is visible at once.",
    },
    {
      title: "Always render a Title",
      body: 'Modal.Title labels the dialog via aria-labelledby; it is what screen readers announce on open. A dialog without one is announced as, at best, "dialog": the user hears that something opened but not what it wants. A Popup with neither a Title nor an aria-label is reported in development.',
    },
  ],
  accessibility: [
    "Built on the native <dialog> opened with showModal(): the browser provides the top layer, ::backdrop, real focus containment, Escape handling, and restores focus to the trigger on close. None of it re-implemented in JavaScript.",
    "Modal.Title and Modal.Description automatically label and describe the dialog via aria-labelledby / aria-describedby.",
    'Modal.Trigger carries aria-haspopup="dialog" and aria-expanded, which follows the open state, so a screen reader says what the button opens and whether it is open.',
    "Light dismiss (clicking the backdrop) uses the closedby attribute where supported, with a small feature-detected coordinate-check fallback elsewhere: no polyfills, per the browser support policy.",
    "Body scroll is locked while open.",
  ],
  parts: [
    {
      name: "Modal.Root",
      description:
        "Groups the parts and owns the open state (controlled or uncontrolled). Renders no element of its own.",
      props: [
        { name: "open", type: "boolean", description: "Controlled open state." },
        {
          name: "defaultOpen",
          type: "boolean",
          default: "false",
          description: "Initial open state when uncontrolled.",
        },
        {
          name: "onOpenChange",
          type: "(open: boolean) => void",
          description: "Called whenever the open state should change.",
        },
      ],
    },
    {
      name: "Modal.Trigger",
      description:
        "A LoamUI Button that opens the dialog; all native <button> props are forwarded.",
      props: [
        {
          name: "render",
          type: "element | (props) => node",
          description:
            "Substitute your own element as the trigger; it receives the invoker wiring.",
        },
      ],
    },
    {
      name: "Modal.Popup",
      description:
        "The native <dialog>, opened with showModal(); all native <dialog> props are forwarded.",
      props: [
        {
          name: "alert",
          type: "boolean",
          default: "false",
          description:
            'Renders role="alertdialog" with no light dismiss (Escape still closes), for destructive confirmations.',
        },
      ],
    },
    {
      name: "Modal.Title",
      description:
        "The dialog's heading (an <h2>), wired to the dialog via aria-labelledby; native heading props are forwarded.",
    },
    {
      name: "Modal.Description",
      description:
        "Supporting text, wired to the dialog via aria-describedby; native <p> props are forwarded.",
    },
    {
      name: "Modal.Close",
      description:
        "A LoamUI Button that closes the dialog; compose as many as you need (confirm, cancel, ×). Native <button> props are forwarded.",
      props: [
        {
          name: "render",
          type: "element | (props) => node",
          description: "Substitute your own element; it receives the close wiring.",
        },
      ],
    },
  ],
  cssProps: [
    {
      name: "--loam-modal-size",
      syntax: "CSS length",
      default: "fit-content, between 24rem and 32rem",
      description:
        "Explicit panel width, replacing the content-sized default and its bounds. The panel never exceeds the viewport either way.",
    },
  ],
};

export default doc;
