import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Button, Toast, Toasts, useToast } from "../../index.js";
import type { ToastOptions } from "../../index.js";

/**
 * Toasts are fired imperatively via the `useToast` hook, so every story
 * drives them through a small button wrapper rendered under the Provider.
 */
function FireToast({ label, ...options }: ToastOptions & { label: string }) {
  const toast = useToast();
  return <Button onClick={() => toast.add(options)}>{label}</Button>;
}

const meta = {
  title: "Feedback/Toast",
  component: Toast.Provider,
  tags: ["autodocs"],
  args: {
    // Stories provide their own children via render; this no-op just
    // satisfies the required-prop type at the meta level.
    children: null,
  },
  render: () => (
    <Toast.Provider>
      <FireToast label="Save changes" title="Saved" description="Your changes are live." />
      <Toasts />
    </Toast.Provider>
  ),
} satisfies Meta<typeof Toast.Provider>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The Provider owns the queue; the ready-made `<Toasts />` viewport renders
 * it from the browser's top layer (`popover="manual"`). Fire toasts from
 * anywhere below with `useToast()`.
 */
export const Default: Story = {};

/** An optional action button, e.g. Undo — activating it dismisses the toast. */
export const WithAction: Story = {
  render: () => (
    <Toast.Provider>
      <FireToast
        label="Archive message"
        title="Message archived"
        action={{ label: "Undo", onClick: () => {} }}
      />
      <Toasts />
    </Toast.Provider>
  ),
};

/**
 * `priority: "high"` renders `role="alert"` and announces assertively —
 * reserve it for urgent, time-sensitive messages.
 */
export const HighPriority: Story = {
  render: () => (
    <Toast.Provider>
      <FireToast
        label="Drop connection"
        title="Connection lost"
        description="Trying to reconnect…"
        priority="high"
      />
      <Toasts />
    </Toast.Provider>
  ),
};

/** `timeout: 0` keeps the toast on screen until explicitly dismissed. */
export const Persistent: Story = {
  render: () => (
    <Toast.Provider>
      <FireToast
        label="Export data"
        title="Export ready"
        description="Stays until you dismiss it."
        timeout={0}
      />
      <Toasts />
    </Toast.Provider>
  ),
};

/**
 * Every default string is overridable: `labels` names the region and the
 * dismiss button in the page's own words.
 */
export const Labels: Story = {
  render: () => (
    <Toast.Provider>
      <FireToast label="Speichern" title="Gespeichert" description="Ihre Änderungen sind live." />
      <Toasts labels={{ region: "Meldungen", dismiss: "Meldung schließen" }} />
    </Toast.Provider>
  ),
};

/**
 * Interaction test: firing a toast announces it via a status live region,
 * and the labelled dismiss button removes it.
 */
export const FiresAndDismisses: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const fire = canvas.getByRole("button", { name: /save changes/i });

    await userEvent.click(fire);
    const toast = await within(document.body).findByRole("status");
    await expect(toast).toHaveTextContent("Saved");

    const dismiss = within(toast).getByRole("button", {
      name: /dismiss notification/i,
    });
    await userEvent.click(dismiss);
    await waitFor(() =>
      expect(within(document.body).queryByRole("status")).not.toBeInTheDocument(),
    );
  },
};
