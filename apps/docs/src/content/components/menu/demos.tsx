"use client";

import { Menu } from "@loamui/core";
import type { CSSProperties } from "react";

export function MenuDemo() {
  return (
    <Menu.Root>
      <Menu.Trigger>Options</Menu.Trigger>
      <Menu.Popup>
        <Menu.Item onClick={() => {}}>Rename</Menu.Item>
        <Menu.Item onClick={() => {}}>Duplicate</Menu.Item>
        <Menu.Item onClick={() => {}}>Move to folder…</Menu.Item>
      </Menu.Popup>
    </Menu.Root>
  );
}

export function MenuGroupsDemo() {
  return (
    <Menu.Root>
      <Menu.Trigger>Workspace</Menu.Trigger>
      <Menu.Popup>
        <Menu.Group>
          <Menu.GroupLabel>Manage</Menu.GroupLabel>
          <Menu.Item onClick={() => {}}>Rename</Menu.Item>
          <Menu.Item onClick={() => {}}>Duplicate</Menu.Item>
        </Menu.Group>
        <Menu.Separator />
        <Menu.Item onClick={() => {}}>Archive</Menu.Item>
      </Menu.Popup>
    </Menu.Root>
  );
}

export function MenuDestructiveDemo() {
  return (
    <Menu.Root>
      <Menu.Trigger>Workspace</Menu.Trigger>
      <Menu.Popup>
        <Menu.Item onClick={() => {}}>Rename</Menu.Item>
        <Menu.Separator />
        <Menu.Group style={{ "--loam-context": "danger" } as CSSProperties}>
          <Menu.GroupLabel>Danger zone</Menu.GroupLabel>
          <Menu.Item onClick={() => {}}>Delete workspace</Menu.Item>
        </Menu.Group>
      </Menu.Popup>
    </Menu.Root>
  );
}

export function MenuLinksDemo() {
  return (
    <Menu.Root>
      <Menu.Trigger>Project</Menu.Trigger>
      <Menu.Popup>
        <Menu.Item onClick={() => {}}>Rename</Menu.Item>
        <Menu.Separator />
        <Menu.Item href="#settings">Settings</Menu.Item>
        <Menu.Item href="#export">Export…</Menu.Item>
      </Menu.Popup>
    </Menu.Root>
  );
}

export function MenuCheckableDemo() {
  return (
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
        </Menu.RadioGroup>
      </Menu.Popup>
    </Menu.Root>
  );
}

export function MenuDisabledDemo() {
  return (
    <Menu.Root>
      <Menu.Trigger>Document</Menu.Trigger>
      <Menu.Popup>
        <Menu.Item onClick={() => {}}>Edit</Menu.Item>
        <Menu.Item disabled>Publish (needs review)</Menu.Item>
        <Menu.Item onClick={() => {}}>Share</Menu.Item>
      </Menu.Popup>
    </Menu.Root>
  );
}
