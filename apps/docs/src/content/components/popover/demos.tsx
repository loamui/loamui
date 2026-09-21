"use client";

import { Button, Field, Input, Popover } from "@loamui/core";

export function PopoverDemo() {
  return (
    <Popover.Root>
      <Popover.Trigger>Toggle</Popover.Trigger>
      <Popover.Popup>
        <Popover.Title>Anchored panel</Popover.Title>
        <Popover.Description>
          Rendered in the browser&apos;s top layer. Click outside or press Escape to close.
        </Popover.Description>
      </Popover.Popup>
    </Popover.Root>
  );
}

export function PopoverLinkTriggerDemo() {
  return (
    <Popover.Root>
      <Popover.Trigger
        render={
          <button type="button" aria-label="Filters">
            ⚙
          </button>
        }
      />
      <Popover.Popup>
        <Popover.Description>
          The Trigger&apos;s wiring merged onto your own button. It opens the popover and carries
          the aria-expanded state.
        </Popover.Description>
      </Popover.Popup>
    </Popover.Root>
  );
}

export function PopoverFormDemo() {
  return (
    <Popover.Root>
      <Popover.Trigger>Add product</Popover.Trigger>
      <Popover.Popup>
        <form
          style={{ display: "grid", gap: "var(--loam-space-xs)" }}
          onSubmit={(e) => e.preventDefault()}
        >
          <Field.Root>
            <Field.Label>Name</Field.Label>
            <Input />
          </Field.Root>
          <Field.Root>
            <Field.Label>Price</Field.Label>
            <Input inputMode="decimal" />
          </Field.Root>
          <Button type="submit">Save</Button>
        </form>
      </Popover.Popup>
    </Popover.Root>
  );
}
