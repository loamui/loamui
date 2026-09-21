"use client";

import { Tabs } from "@loamui/core";
import { IconFile, IconUser, IconSettings } from "@tabler/icons-react";

const frame = { inlineSize: "100%", maxInlineSize: "28rem" } as const;

export function TabsBasicDemo() {
  return (
    <div style={frame}>
      <Tabs.Root defaultValue="account">
        <Tabs.List>
          <Tabs.Tab value="account">Account</Tabs.Tab>
          <Tabs.Tab value="security">Security</Tabs.Tab>
          <Tabs.Tab value="notifications">Notifications</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="account">Update your name and email address.</Tabs.Panel>
        <Tabs.Panel value="security">Change your password and enable 2FA.</Tabs.Panel>
        <Tabs.Panel value="notifications">Choose how you want to be notified.</Tabs.Panel>
      </Tabs.Root>
    </div>
  );
}

export function TabsIconsDemo() {
  return (
    <div style={frame}>
      <Tabs.Root defaultValue="files">
        <Tabs.List>
          <Tabs.Tab value="files">
            <IconFile aria-hidden />
            Files
          </Tabs.Tab>
          <Tabs.Tab value="team">
            <IconUser aria-hidden />
            Team
          </Tabs.Tab>
          <Tabs.Tab value="settings">
            <IconSettings aria-hidden />
            Settings
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="files">All your documents in one place.</Tabs.Panel>
        <Tabs.Panel value="team">Invite teammates and manage roles.</Tabs.Panel>
        <Tabs.Panel value="settings">Configure your workspace preferences.</Tabs.Panel>
      </Tabs.Root>
    </div>
  );
}

export function TabsDisabledDemo() {
  return (
    <div style={frame}>
      <Tabs.Root defaultValue="overview">
        <Tabs.List>
          <Tabs.Tab value="overview">Overview</Tabs.Tab>
          <Tabs.Tab value="reports">Reports</Tabs.Tab>
          <Tabs.Tab value="billing" disabled>
            Billing
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="overview">Everything at a glance.</Tabs.Panel>
        <Tabs.Panel value="reports">Usage for the last month.</Tabs.Panel>
        <Tabs.Panel value="billing">Upgrade to unlock billing.</Tabs.Panel>
      </Tabs.Root>
    </div>
  );
}
