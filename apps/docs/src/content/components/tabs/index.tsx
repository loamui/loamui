import type { ComponentContent } from "@/renderer/types";
import { IconFile, IconSettings, IconUser } from "@tabler/icons-react";
import { Tabs } from "@loamui/core";

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

const doc: ComponentContent = {
  slug: "tabs",
  lead: "One visible panel from a related set, chosen from a tab list in the same view.",
  importLine: `import { Tabs } from "@loamui/core";`,
  demos: [
    {
      title: "Basic usage",
      description: "Uncontrolled via defaultValue. Arrow keys move between tabs.",
      code: `<Tabs.Root defaultValue="account">
  <Tabs.List>
    <Tabs.Tab value="account">Account</Tabs.Tab>
    <Tabs.Tab value="security">Security</Tabs.Tab>
    <Tabs.Tab value="notifications">Notifications</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="account">Update your name and email address.</Tabs.Panel>
  <Tabs.Panel value="security">Change your password and enable 2FA.</Tabs.Panel>
  <Tabs.Panel value="notifications">Choose how you want to be notified.</Tabs.Panel>
</Tabs.Root>`,
      render: () => <TabsBasicDemo />,
    },
    {
      title: "With icons (composed as children)",
      description:
        "No leftSection prop: an svg child is detected via :has(svg) and gets a gap and label-relative sizing, the same detection Button uses. Compose the icon before the label and mark it aria-hidden.",
      code: `<Tabs.Root defaultValue="files">
  <Tabs.List>
    <Tabs.Tab value="files">
      <IconFile aria-hidden />
      Files
    </Tabs.Tab>
    <Tabs.Tab value="team"><IconFile aria-hidden /> Team</Tabs.Tab>
    <Tabs.Tab value="settings"><IconFile aria-hidden /> Settings</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="files">All your documents in one place.</Tabs.Panel>
  <Tabs.Panel value="team">Invite teammates and manage roles.</Tabs.Panel>
  <Tabs.Panel value="settings">Configure your workspace preferences.</Tabs.Panel>
</Tabs.Root>`,
      render: () => <TabsIconsDemo />,
    },
    {
      title: "Disabled tab",
      description: "A disabled tab is skipped by keyboard navigation.",
      code: `<Tabs.Root defaultValue="overview">
  <Tabs.List>
    <Tabs.Tab value="overview">Overview</Tabs.Tab>
    <Tabs.Tab value="reports">Reports</Tabs.Tab>
    <Tabs.Tab value="billing" disabled>Billing</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="overview">Everything at a glance.</Tabs.Panel>
  <Tabs.Panel value="reports">Usage for the last month.</Tabs.Panel>
  <Tabs.Panel value="billing">Upgrade to unlock billing.</Tabs.Panel>
</Tabs.Root>`,
      render: () => <TabsDisabledDemo />,
    },
  ],
  whenToUse: [
    "For parallel views of the same thing: Account / Security / Notifications are alternative facets of one settings object, and users need only one at a time.",
    "To keep related panels in one place without a page navigation, when switching views must not lose the surrounding context.",
  ],
  whenNotToUse: [
    "On narrow screens where the tab strip no longer fits: stack the content under plain headings instead. A horizontally scrolling tab strip hides panels behind an interaction most users never find.",
    "For steps in a sequence: tabs imply no order and let users jump anywhere, so a flow with dependencies belongs on separate pages with visible progress.",
    "As primary navigation: switching a tab changes no URL and creates no history entry, so tabbed 'pages' can't be linked, bookmarked or reached with the back button.",
    "When users need to read or compare everything: content in an unselected tab may never be seen; stack it on the page under headings instead.",
  ],
  howItWorks: [
    {
      title: "Parallel views, not steps",
      body: "Tabs present alternative views of one subject; the order of the tab list carries no meaning and users can activate any tab at any moment. If the content is a sequence, where step two only makes sense after step one, tabs actively work against you, because they advertise that jumping ahead is fine. Use separate pages and show progress instead.",
    },
    {
      title: "A hidden tab is optional reading",
      body: "Many users never open a second tab, so nothing that everyone must see can live in one. Anything required (warnings, costs, prerequisites) goes above or outside the tabs, and the first tab gets the most-needed content because it is the only panel guaranteed to be read.",
    },
    {
      title: "View state stays out of the URL",
      body: "Switching a tab updates React state, not the URL; reloading returns to defaultValue and the back button ignores tab changes. When a view should be linkable, use the controlled form (value/onValueChange) and mirror the value in the query string yourself; if every view deserves its own URL, you want pages with links, not tabs.",
    },
  ],
  accessibility: [
    "The tab list uses a roving tabindex: only the active tab sits in the Tab order (tabIndex 0, the rest -1), so keyboard users cross the whole list in one Tab press instead of stepping through every tab.",
    "Arrow Left/Right move through the horizontal tabs and wrap at the ends, following the page direction in right-to-left content. Home/End jump to the first and last, and disabled tabs are skipped. Moving focus also selects, so no separate Enter press is needed.",
    'Inactive panels are hidden with hidden="until-found" where the browser supports it, so find-in-page can match text inside a closed tab; a beforematch event then activates that tab. Browsers without support fall back to plain hidden.',
    'The wiring is generated from one id: role="tablist"/"tab"/"tabpanel" with aria-selected, aria-controls on each tab and aria-labelledby on each panel, so assistive technology announces which tab is active and what it controls.',
    "Each panel has tabIndex 0, so a panel whose content contains no focusable element can still be reached and scrolled by keyboard.",
  ],
  parts: [
    {
      name: "Tabs.Root",
      description:
        "Owns the active value (controlled or uncontrolled) and renders the wrapper; all native <div> props are forwarded.",
      props: [
        {
          name: "defaultValue",
          type: "string",
          description:
            "Required initial tab value for uncontrolled usage. Omit only when value is supplied.",
        },
        {
          name: "value",
          type: "string",
          description: "Controlled active tab value. Required when defaultValue is omitted.",
        },
        {
          name: "onValueChange",
          type: "(value: string) => void",
          description: "Called with the new value when the active tab changes.",
        },
      ],
    },
    {
      name: "Tabs.List",
      description:
        'The tab strip (role="tablist") that owns the roving tabindex and arrow-key behaviour; all native <div> props are forwarded.',
    },
    {
      name: "Tabs.Tab",
      description: "One tab button; all native <button> props are forwarded.",
      props: [
        {
          name: "value",
          type: "string",
          description: "Unique value linking this tab to its panel (required).",
        },
        {
          name: "disabled",
          type: "boolean",
          description: "Disable the tab and skip it in keyboard navigation.",
        },
      ],
    },
    {
      name: "Tabs.Panel",
      description:
        "The content shown while its tab is active; all native <div> props are forwarded.",
      props: [
        {
          name: "value",
          type: "string",
          description: "Value of the tab this panel belongs to (required).",
        },
      ],
    },
  ],
};

export default doc;
