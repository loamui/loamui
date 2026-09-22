import type { ComponentContent } from "@/renderer/types";
import { ToastActionDemo, ToastDemo, ToastPersistentDemo, ToastPriorityDemo } from "./demos";

const doc: ComponentContent = {
  slug: "toast",
  lead: "Transient notifications announced by native live regions and rendered in the browser's top layer.",
  importLine: `import { Button, Toast, Toasts, useToast } from "@loamui/core";`,
  demos: [
    {
      title: "Basic usage",
      description:
        'Mount Toast.Provider once near the app root with the ready-made <Toasts /> viewport, then fire toasts from anywhere below with the useToast hook. The viewport renders with popover="manual": the browser\'s top layer, above every dialog, with no z-index management.',
      code: `function SaveButton() {
  const toast = useToast();
  return (
    <Button
      onClick={() =>
        toast.add({ title: "Saved", description: "Your changes are live." })
      }
    >
      Save changes
    </Button>
  );
}

// once, near the app root
<Toast.Provider>
  <SaveButton />
  <Toasts />
</Toast.Provider>`,
      render: () => <ToastDemo />,
    },
    {
      title: "With an action",
      description:
        "An optional action renders as a button inside the toast, the classic Undo. Activating it runs the handler and dismisses the toast. Keep it to one action; anything more deserves a place in the page.",
      code: `function ArchiveButton() {
  const toast = useToast();
  return (
    <Button
      onClick={() =>
        toast.add({
          title: "Message archived",
          action: {
            label: "Undo",
            onClick: () => toast.add({ title: "Message restored" }),
          },
        })
      }
    >
      Archive
    </Button>
  );
}`,
      render: () => <ToastActionDemo />,
    },
    {
      title: "High priority",
      description:
        'A high-priority toast looks the same but is announced assertively (role="alert") and interrupts what a screen reader is saying, rather than waiting politely. See the guidance below on when the interruption is earned.',
      code: `function DisconnectButton() {
  const toast = useToast();
  return (
    <Button
      onClick={() =>
        toast.add({
          title: "Connection lost",
          description: "Trying to reconnect…",
          priority: "high",
        })
      }
    >
      Drop connection
    </Button>
  );
}`,
      render: () => <ToastPriorityDemo />,
    },
    {
      title: "Persistent",
      description:
        "timeout: 0 keeps a toast on screen until the user dismisses it, for messages that must not slip by, like a finished export waiting to be downloaded.",
      code: `function ExportButton() {
  const toast = useToast();
  return (
    <Button
      onClick={() =>
        toast.add({
          title: "Export ready",
          description: "Stays until you dismiss it.",
          timeout: 0,
        })
      }
    >
      Export data
    </Button>
  );
}`,
      render: () => <ToastPersistentDemo />,
    },
  ],
  whenToUse: [
    "To confirm the outcome of an action the user has taken (saved, sent, archived) without interrupting their flow.",
    "For background events that complete while the user is elsewhere: an export finishing, a sync completing.",
  ],
  whenNotToUse: [
    "For errors the user must fix: show the error where the problem is (Field errors, or an Alert in place); a message that disappears cannot be acted on.",
    "As the only record of something important: toasts vanish, so anything the user may need later must also exist in the page.",
    "For messages that require a decision, use Modal, which holds focus until the user answers.",
  ],
  howItWorks: [
    {
      title: "Confirm outcomes; never ask questions",
      body: "A toast states what has happened: saved, sent, restored. It disappears on its own, so a message that expects a decision has the wrong container: use Modal for questions, an Alert in the page for conditions that persist.",
    },
    {
      title: "Reserve high priority for failures",
      body: 'priority: "high" renders role="alert", which interrupts whatever a screen reader is saying. That cost is justified when something the user attempted has failed, and almost never otherwise. Success confirmations use the default polite announcement.',
    },
    {
      title: "An action in a toast must exist somewhere else too",
      body: "Undo in a toast is a courtesy, not the mechanism. Timers pause while the pointer or focus is inside the viewport (WCAG 2.2.1), but the toast still disappears, so any action it offers must remain reachable in the page after it is gone.",
    },
    {
      title: "F6 reaches the viewport",
      body: "The toast region is a labelled landmark, and F6 jumps focus into it from anywhere; that is how a keyboard user reaches an action before the timer ends. Keeping that path clear takes no effort: don't wrap toasts in extra focusable chrome.",
    },
  ],
  accessibility: [
    'Each toast is a native live region: role="status" by default, role="alert" at high priority.',
    'The notifications region is role="region", labelled "Notifications", and never traps focus.',
    "Auto-dismiss timers pause while the pointer or keyboard focus is inside the viewport and resume with the remaining time (WCAG 2.2.1 Timing Adjustable).",
    'The viewport renders with popover="manual": the browser\'s top layer places it above every dialog and popover with no z-index war, and nothing can light-dismiss it.',
    'The default dismiss button is a LoamUI Button with an explicit aria-label ("Dismiss notification"); labels replaces it and the region\'s name for another language.',
    "Every default string is overridable: labels on <Toasts /> (or on Toast.Viewport and Toast.Close) names the region and the dismiss button.",
  ],
  parts: [
    {
      name: "Toast.Provider",
      description: "Owns the toast queue; mount once near the app root.",
      props: [
        {
          name: "timeout",
          type: "number",
          default: "5000",
          description: "Default auto-dismiss delay in ms.",
        },
        {
          name: "limit",
          type: "number",
          default: "3",
          description: "Most toasts shown at once; the oldest closes first.",
        },
      ],
    },
    {
      name: "Toasts",
      description:
        "The ready-made viewport: renders every active toast with title, description, action and a dismiss button. Compose the parts below yourself only when this layout doesn't fit.",
      props: [
        {
          name: "labels",
          type: "{ region?: string; dismiss?: string }",
          default: `{ region: "Notifications", dismiss: "Dismiss notification" }`,
          description:
            'The words the viewport speaks: region names the landmark ("Notifications"), dismiss names each close button ("Dismiss notification").',
        },
      ],
    },
    {
      name: "Toast.Viewport",
      description:
        "The top-layer notifications region for a custom layout; all native <div> props are forwarded.",
      props: [
        {
          name: "labels",
          type: "{ region?: string }",
          default: `{ region: "Notifications" }`,
          description: "The landmark's accessible name.",
        },
      ],
    },
    {
      name: "Toast.Root",
      description:
        "Renders one toast; its live-region role comes from the toast's priority, and the parts inside read the toast from it. Native <div> props are forwarded.",
      props: [
        {
          name: "toast",
          type: "ToastData",
          description: "The toast being rendered (from useToast().toasts).",
        },
      ],
    },
    {
      name: "Toast.Title",
      description: "The toast's heading; native <div> props are forwarded.",
      props: [
        {
          name: "render",
          type: "element | (props) => node",
          description:
            "Substitute the element (render={<strong />}); it receives the part's class.",
        },
      ],
    },
    {
      name: "Toast.Description",
      description: "The toast's message body; native <div> props are forwarded.",
      props: [
        {
          name: "render",
          type: "element | (props) => node",
          description: "Substitute the element (render={<p />}); it receives the part's class.",
        },
      ],
    },
    {
      name: "Toast.Action",
      description:
        "A LoamUI Button inside a toast; activating it runs onAction and dismisses that toast. Native <button> props are forwarded.",
      props: [
        {
          name: "onAction",
          type: "() => void",
          description: "Runs before the toast dismisses.",
        },
        {
          name: "render",
          type: "element | (props) => node",
          description: "Substitute your own element; it receives the action wiring.",
        },
      ],
    },
    {
      name: "Toast.Close",
      description:
        'A LoamUI Button that dismisses its toast, labelled "Dismiss notification" with a default × icon (children replace the icon). Native <button> props are forwarded.',
      props: [
        {
          name: "labels",
          type: "{ dismiss?: string }",
          default: `{ dismiss: "Dismiss notification" }`,
          description: "The button's accessible name.",
        },
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
      name: "--loam-toast-size",
      syntax: "CSS length",
      default: "22rem",
      description: "The viewport's width; never wider than the viewport minus its margins.",
    },
  ],
  hooks: [
    {
      name: "useToast",
      signature: "const { toasts, add, close } = useToast();",
      description:
        "Fire and dismiss toasts from anywhere under the Provider. add(options) returns the toast's id, and adding again with the same id updates in place; close(id) dismisses one toast, or all when the id is omitted.",
      options: {
        title: "Options accepted by add():",
        rows: [
          { name: "title", type: "ReactNode", description: "Short heading." },
          { name: "description", type: "ReactNode", description: "The message body." },
          {
            name: "action",
            type: "{ label, onClick }",
            description: "Optional action rendered as a button, e.g. Undo.",
          },
          {
            name: "priority",
            type: `"normal" | "high"`,
            default: `"normal"`,
            description:
              'high announces assertively (role="alert"); reserve it for urgent, time-sensitive messages.',
          },
          {
            name: "timeout",
            type: "number",
            description: "Overrides the Provider default; 0 keeps the toast until dismissed.",
          },
          {
            name: "id",
            type: "string",
            description: "Stable id; adding again with the same id updates the toast in place.",
          },
        ],
      },
    },
  ],
};

export default doc;
