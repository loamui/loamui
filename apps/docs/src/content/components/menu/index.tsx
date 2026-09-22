import type { ComponentContent } from "@/renderer/types";
import {
  MenuDemo,
  MenuDestructiveDemo,
  MenuCheckableDemo,
  MenuDisabledDemo,
  MenuGroupsDemo,
  MenuLinksDemo,
} from "./demos";

const doc: ComponentContent = {
  slug: "menu",
  lead: "A list of actions opened from a trigger: the ARIA Authoring Practices Guide (APG) menu-button pattern on top of the browser's top layer and anchor positioning.",
  importLine: `import { Menu } from "@loamui/core";`,
  demos: [
    {
      title: "Basic usage",
      description:
        "Compose the menu from parts and wire each item's onClick to its action. The popup uses the same engine as Popover (native popover attribute and anchor positioning where supported, a wrapper-anchored fallback elsewhere) with the APG menu-button keyboard pattern on top: arrow keys rove focus, typing jumps to a matching item, and activating one closes the menu and returns focus to the trigger.",
      code: `<Menu.Root>
  <Menu.Trigger>Options</Menu.Trigger>
  <Menu.Popup>
    <Menu.Item onClick={() => {}}>Rename</Menu.Item>
    <Menu.Item onClick={() => {}}>Duplicate</Menu.Item>
    <Menu.Item onClick={() => {}}>Move to folder…</Menu.Item>
  </Menu.Popup>
</Menu.Root>`,
      render: () => <MenuDemo />,
    },
    {
      title: "Groups and separators",
      description:
        "Group related items under a label with Menu.Group and Menu.GroupLabel; Menu.Separator is a real <hr> between them.",
      code: `<Menu.Root>
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
</Menu.Root>`,
      render: () => <MenuGroupsDemo />,
    },
    {
      title: "Destructive group",
      description:
        "Contextual meaning is a custom property: declare --loam-context: danger on a Menu.Group and the items inside adopt the danger accent, no props involved. Put Delete and its kin in their own labelled group so the separation and the colour both signal the stakes before the click.",
      code: `<Menu.Root>
  <Menu.Trigger>Workspace</Menu.Trigger>
  <Menu.Popup>
    <Menu.Item onClick={() => {}}>Rename</Menu.Item>
    <Menu.Separator />
    <Menu.Group style={{ "--loam-context": "danger" }}>
      <Menu.GroupLabel>Danger zone</Menu.GroupLabel>
      <Menu.Item onClick={() => {}}>Delete workspace</Menu.Item>
    </Menu.Group>
  </Menu.Popup>
</Menu.Root>`,
      render: () => <MenuDestructiveDemo />,
    },
    {
      title: "Links as items",
      description:
        "An Item with href renders as a real <a>, so right-click and open-in-new-tab work. Use sparingly: menus are for actions, and destinations usually deserve visible links.",
      code: `<Menu.Root>
  <Menu.Trigger>Project</Menu.Trigger>
  <Menu.Popup>
    <Menu.Item onClick={() => {}}>Rename</Menu.Item>
    <Menu.Separator />
    <Menu.Item href="#settings">Settings</Menu.Item>
    <Menu.Item href="#export">Export…</Menu.Item>
  </Menu.Popup>
</Menu.Root>`,
      render: () => <MenuLinksDemo />,
    },
    {
      title: "Checkable items",
      description:
        "A setting that lives in the menu is a CheckboxItem (on/off, role menuitemcheckbox) or a RadioGroup of RadioItems (one of a set, role menuitemradio). Both keep the menu open on activation, since a setting is usually one of several adjusted in one visit; the glyph is drawn by CSS from aria-checked.",
      code: `<Menu.Root>
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
</Menu.Root>`,
      render: () => <MenuCheckableDemo />,
    },
    {
      title: "Disabled items",
      description:
        "Disabled items use aria-disabled, so they stay visible to assistive technology but are skipped by roving focus (one tab stop, arrow keys move between items) and cannot be activated.",
      code: `<Menu.Root>
  <Menu.Trigger>Document</Menu.Trigger>
  <Menu.Popup>
    <Menu.Item>Edit</Menu.Item>
    <Menu.Item disabled>Publish (needs review)</Menu.Item>
    <Menu.Item>Share</Menu.Item>
  </Menu.Popup>
</Menu.Root>`,
      render: () => <MenuDisabledDemo />,
    },
  ],
  whenToUse: [
    "For a short list of actions on an object (rename, duplicate, export, delete) collapsed behind a single trigger.",
    "When the actions are secondary enough that laying them all out as visible buttons would clutter the surface.",
  ],
  whenNotToUse: [
    "For choosing a value that persists, use Select, which has real selection semantics the menu role does not promise.",
    "For navigation, prefer visible links; a menu hides destinations users need behind an extra interaction.",
    "For one or two actions: plain Buttons are simpler and one click fewer.",
  ],
  howItWorks: [
    {
      title: "Commands, with one exception for links",
      body: 'Menu items carry role="menuitem", announced as commands, not destinations. When one entry genuinely navigates (Export as CSV, View profile), give the Item an href: it renders a real <a> inside the menu, so right-click and open-in-new-tab keep working. A menu that is mostly links, though, is navigation: use visible links instead.',
    },
    {
      title: "Disabled items stay in the menu",
      body: "A disabled item renders aria-disabled and is skipped by roving focus but stays visible and announced: the user learns the command exists and is currently unavailable. Removing it instead teaches them the feature is gone.",
    },
    {
      title: "Destructive commands live in a labelled danger group",
      body: "Put Delete and its kin in a Menu.Group with a GroupLabel, inside a --loam-context: danger wrapper. The separation and the colour both signal the stakes before the click, and the group label is announced with each item.",
    },
    {
      title: "Icon-only triggers need a name",
      body: 'The ⋯ trigger reads as "menu" to a sighted user and as nothing to anyone else. Give it an aria-label naming the object it operates on ("Actions for INV-1024", not "menu"), because in a list of rows, ten triggers labelled "menu" are indistinguishable.',
    },
  ],
  accessibility: [
    "Implements the APG menu-button pattern: ArrowDown/ArrowUp on the trigger open the menu and focus the first/last item; inside, arrow keys rove focus through the items (looping), Home/End jump to the ends, and typing jumps to the next item matching the query.",
    "Escape closes and returns focus to the trigger, as does activating an item; Tab closes the menu and lets focus continue naturally: the menu moves focus, it never traps it.",
    'The trigger is a real <button> with aria-haspopup="menu" and aria-expanded; the popup is role="menu" with role="menuitem" children, and Menu.Separator is a real <hr>: the platform\'s separator role, no ARIA needed.',
    "Disabled items use aria-disabled rather than disabled, so they remain visible to assistive technology while roving focus skips them.",
    "Where the popover attribute and anchor positioning are both supported, the browser provides top-layer rendering, light dismiss and Escape; other browsers get a wrapper-anchored fallback with the same behaviour re-implemented, the deliberate no-polyfill trade-off, per the browser support policy in CONTRIBUTING.",
  ],
  parts: [
    {
      name: "Menu.Root",
      description:
        "Groups the parts and owns open state (controlled or uncontrolled). Renders an inline wrapper used by the fallback positioning.",
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
      name: "Menu.Trigger",
      description:
        "A LoamUI Button wired as the menu button (aria-haspopup, aria-expanded, anchor name, arrow-key opening); it adapts to context like any Button. All native <button> props are forwarded.",
      props: [
        {
          name: "render",
          type: "element | (props) => node",
          description: "Substitute your own element; it receives the wiring props.",
        },
      ],
    },
    {
      name: "Menu.Popup",
      description:
        'The floating list (role="menu", popover attribute); it flips at viewport edges in supporting browsers. Native <div> props are forwarded.',
      props: [
        {
          name: "side",
          type: `"bottom" | "top"`,
          default: `"bottom"`,
          description: "Which side of the trigger the menu opens toward.",
        },
      ],
    },
    {
      name: "Menu.Item",
      description:
        'One action (role="menuitem"). Renders a <button>, or a real <a> when href is set. Activation runs onClick, then closes the menu unless closeOnClick={false}.',
      props: [
        { name: "href", type: "string", description: "Renders the item as a real link." },
        { name: "onClick", type: "(e) => void", description: "Runs on activation." },
        {
          name: "closeOnClick",
          type: "boolean",
          default: "true",
          description: "Close the menu after activation.",
        },
        {
          name: "disabled",
          type: "boolean",
          description: "aria-disabled; skipped by keyboard navigation.",
        },
        {
          name: "render",
          type: "element | (props) => node",
          description: "Substitute your own element (e.g. a router Link).",
        },
      ],
    },
    {
      name: "Menu.CheckboxItem",
      description:
        'An on/off setting (role="menuitemcheckbox"); the check glyph is CSS. Takes the same href-less props as Menu.Item.',
      props: [
        { name: "checked", type: "boolean", description: "Controlled checked state." },
        {
          name: "defaultChecked",
          type: "boolean",
          default: "false",
          description: "Initial checked state when uncontrolled.",
        },
        {
          name: "onCheckedChange",
          type: "(checked: boolean) => void",
          description: "Fires with the next checked state on activation.",
        },
        {
          name: "closeOnClick",
          type: "boolean",
          default: "false",
          description: "Close the menu after activation.",
        },
      ],
    },
    {
      name: "Menu.RadioGroup",
      description:
        'One-of-a-set settings (role="group" of menuitemradio items); a GroupLabel inside labels it. Native <div> props are forwarded.',
      props: [
        { name: "value", type: "string", description: "Controlled selected value." },
        {
          name: "defaultValue",
          type: "string",
          description: "Initial selected value when uncontrolled.",
        },
        {
          name: "onValueChange",
          type: "(value: string) => void",
          description: "Fires with the value of the item activated.",
        },
      ],
    },
    {
      name: "Menu.RadioItem",
      description:
        'One choice of a RadioGroup (role="menuitemradio"); checked when its value is the group\'s. Takes the same href-less props as Menu.Item.',
      props: [
        { name: "value", type: "string", description: "The value this item selects (required)." },
        {
          name: "closeOnClick",
          type: "boolean",
          default: "false",
          description: "Close the menu after activation.",
        },
      ],
    },
    {
      name: "Menu.Group",
      description:
        'Groups related items (role="group"); a GroupLabel inside labels the group via aria-labelledby. Native <div> props are forwarded.',
    },
    {
      name: "Menu.GroupLabel",
      description:
        "The label of the Group or RadioGroup it sits in; native <div> props are forwarded.",
    },
    {
      name: "Menu.Separator",
      description:
        "A real <hr> between items, the platform's separator role; native <hr> props are forwarded.",
    },
  ],
  cssProps: [
    {
      name: "--loam-menu-size",
      syntax: "CSS length",
      default: "18rem",
      description:
        "The list's widest extent; content sizes it between a floor derived from this and the cap. Never wider than the viewport.",
    },
  ],
};

export default doc;
