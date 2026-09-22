import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";
import type { CSSProperties, ReactElement } from "react";

import {
  Button,
  Field,
  Fieldset,
  Input,
  Textarea,
  Select,
  Checkbox,
  DateInput,
  ErrorSummary,
  Radio,
  RadioGroup,
  Switch,
  Range,
  Badge,
  Price,
  Card,
  Avatar,
  Table,
  Alert,
  Progress,
  Separator,
  SignpostLink,
  SkipLink,
  Skeleton,
  Loader,
  Tooltip,
  Menu,
  Modal,
  Drawer,
  Popover,
  Toast,
  Tabs,
  Details,
  Breadcrumbs,
  Pagination,
} from "../index.js";

afterEach(cleanup);

// Accessible, representative render of every component. axe (in jsdom) checks
// roles/names/ARIA structure — colour-contrast is covered live by Storybook's
// a11y addon in a real browser.
const cases: Array<[string, ReactElement]> = [
  ["Button", <Button>Save changes</Button>],
  [
    "Input",
    <Field.Root>
      <Field.Label>Email</Field.Label>
      <Input type="email" autoComplete="email" />
    </Field.Root>,
  ],
  [
    "Textarea",
    <Field.Root>
      <Field.Label>Bio</Field.Label>
      <Textarea />
    </Field.Root>,
  ],
  [
    "Select",
    <Field.Root>
      <Field.Label>Country</Field.Label>
      <Select.Root>
        <Select.Option>United States</Select.Option>
        <Select.Option>Canada</Select.Option>
      </Select.Root>
    </Field.Root>,
  ],
  [
    "Checkbox",
    <Field.Item>
      <Field.Label>
        <Checkbox /> Accept the terms
      </Field.Label>
    </Field.Item>,
  ],
  [
    "DateInput",
    <DateInput.Root name="date-of-birth" autoComplete="bday">
      <DateInput.Legend>Date of birth</DateInput.Legend>
      <DateInput.Description>For example, 27 3 2007</DateInput.Description>
      <DateInput.Fields>
        <DateInput.Day />
        <DateInput.Month />
        <DateInput.Year />
      </DateInput.Fields>
    </DateInput.Root>,
  ],
  [
    "DateInput (error)",
    <DateInput.Root invalid={["year"]}>
      <DateInput.Legend>When did your membership start?</DateInput.Legend>
      <DateInput.Error>Membership start date must include a year</DateInput.Error>
      <DateInput.Fields>
        <DateInput.Day />
        <DateInput.Month />
        <DateInput.Year />
      </DateInput.Fields>
    </DateInput.Root>,
  ],
  [
    "RadioGroup",
    <RadioGroup.Root defaultValue="pro">
      <RadioGroup.Legend>Plan</RadioGroup.Legend>
      <Field.Item>
        <Field.Label>
          <Radio value="free" /> free
        </Field.Label>
      </Field.Item>
      <Field.Item>
        <Field.Label>
          <Radio value="pro" /> pro
        </Field.Label>
      </Field.Item>
    </RadioGroup.Root>,
  ],
  [
    "Switch",
    <Field.Item>
      <Field.Label>
        <Switch.Root>
          <Switch.Control />
          <Switch.Track>
            <Switch.Thumb />
          </Switch.Track>
        </Switch.Root>{" "}
        Email notifications
      </Field.Label>
    </Field.Item>,
  ],
  [
    "Range",
    <Field.Root>
      <Field.Label>Volume</Field.Label>
      <Range.Control defaultValue={50} />
    </Field.Root>,
  ],
  [
    "Badge",
    <Badge.Root>
      <Badge.Text>New</Badge.Text>
    </Badge.Root>,
  ],
  ["Card", <Card>Card content</Card>],
  [
    "Avatar",
    <Avatar.Root role="img" aria-label="Ada Lovelace">
      <Avatar.Fallback>AL</Avatar.Fallback>
    </Avatar.Root>,
  ],
  [
    "Price",
    <p>
      <Price value={24} currency="GBP">
        per seat, per month
      </Price>
    </p>,
  ],
  [
    "Fieldset",
    <Fieldset.Root>
      <Fieldset.Legend>Contact preferences</Fieldset.Legend>
      <Field.Item>
        <Field.Label>
          <Checkbox /> Email
        </Field.Label>
      </Field.Item>
      <Field.Item>
        <Field.Label>
          <Checkbox /> SMS
        </Field.Label>
      </Field.Item>
    </Fieldset.Root>,
  ],
  [
    "Table",
    <Table.Root>
      <Table.Caption>Users</Table.Caption>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Name</Table.Th>
          <Table.Th>Role</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        <Table.Tr>
          <Table.Td>Ada</Table.Td>
          <Table.Td>Admin</Table.Td>
        </Table.Tr>
      </Table.Tbody>
    </Table.Root>,
  ],
  [
    "Alert",
    <div style={{ "--loam-context": "info" } as CSSProperties}>
      <Alert.Root>
        <Alert.Body>
          <Alert.Title>Heads up</Alert.Title>
          <Alert.Description>A new version is available.</Alert.Description>
        </Alert.Body>
      </Alert.Root>
    </div>,
  ],
  [
    "Alert (composed)",
    <div style={{ "--loam-context": "warning" } as CSSProperties}>
      <Alert.Root>
        <Alert.Body>
          <Alert.Title>Storage almost full</Alert.Title>
          <Alert.Description>Free up space to keep syncing.</Alert.Description>
        </Alert.Body>
      </Alert.Root>
    </div>,
  ],
  ["Progress", <Progress value={40} aria-label="Upload progress" />],
  ["Separator", <Separator />],
  ["SignpostLink", <SignpostLink href="#apply">Start your application</SignpostLink>],
  ["SkipLink", <SkipLink href="#content" />],
  [
    "ErrorSummary",
    <ErrorSummary.Root autoFocus={false}>
      <ErrorSummary.Title />
      <ErrorSummary.List>
        <ErrorSummary.Item href="#email">Enter your email address</ErrorSummary.Item>
      </ErrorSummary.List>
    </ErrorSummary.Root>,
  ],
  [
    "Separator (vertical, in a row)",
    <div style={{ display: "flex", gap: 8 }}>
      <span>Cut</span>
      <Separator orientation="vertical" />
      <span>Copy</span>
    </div>,
  ],
  [
    "Menu (open)",
    <Menu.Root defaultOpen>
      <Menu.Trigger>Options</Menu.Trigger>
      <Menu.Popup>
        <Menu.Item>Rename</Menu.Item>
        <Menu.Item href="/export">Export</Menu.Item>
        <Menu.Separator />
        <Menu.CheckboxItem defaultChecked>Show hidden files</Menu.CheckboxItem>
        <Menu.RadioGroup defaultValue="name">
          <Menu.GroupLabel>Sort by</Menu.GroupLabel>
          <Menu.RadioItem value="name">Name</Menu.RadioItem>
          <Menu.RadioItem value="date">Date</Menu.RadioItem>
        </Menu.RadioGroup>
        <Menu.Group>
          <Menu.GroupLabel>Danger zone</Menu.GroupLabel>
          <Menu.Item>Delete</Menu.Item>
        </Menu.Group>
      </Menu.Popup>
    </Menu.Root>,
  ],
  [
    "Toast (viewport with toast)",
    <Toast.Provider>
      <Toast.Viewport>
        <Toast.Root toast={{ id: "t1" }}>
          <Toast.Title>Saved</Toast.Title>
          <Toast.Description>Your changes are live.</Toast.Description>
          <Toast.Close />
        </Toast.Root>
      </Toast.Viewport>
    </Toast.Provider>,
  ],
  ["Skeleton", <Skeleton />],
  ["Loader", <Loader />],
  [
    "Tooltip",
    <Tooltip.Root defaultOpen>
      <Tooltip.Trigger>Hover me</Tooltip.Trigger>
      <Tooltip.Popup>
        More info <Tooltip.Arrow />
      </Tooltip.Popup>
    </Tooltip.Root>,
  ],
  [
    "Popover",
    <Popover.Root defaultOpen>
      <Popover.Trigger>Open</Popover.Trigger>
      <Popover.Popup>
        <Popover.Title>Panel</Popover.Title>
        <Popover.Description>Popover content</Popover.Description>
        <Popover.Close>Close</Popover.Close>
      </Popover.Popup>
    </Popover.Root>,
  ],
  [
    "Tabs",
    <Tabs.Root defaultValue="a">
      <Tabs.List>
        <Tabs.Tab value="a">Account</Tabs.Tab>
        <Tabs.Tab value="b">Security</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="a">Account panel</Tabs.Panel>
      <Tabs.Panel value="b">Security panel</Tabs.Panel>
    </Tabs.Root>,
  ],
  [
    "Details",
    <Details.Root>
      <Details.Summary>What is LoamUI?</Details.Summary>
      <Details.Content>A component library.</Details.Content>
    </Details.Root>,
  ],
  [
    "Breadcrumbs",
    <Breadcrumbs.Root>
      <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
      <Breadcrumbs.Item href="/settings">Settings</Breadcrumbs.Item>
      <Breadcrumbs.Item current>Billing</Breadcrumbs.Item>
    </Breadcrumbs.Root>,
  ],
  [
    "Pagination",
    <Pagination.Root>
      <Pagination.List>
        <Pagination.Pages page={1} count={5} getHref={(page) => `?page=${page}`} />
      </Pagination.List>
    </Pagination.Root>,
  ],
];

// Colour-contrast needs a real browser to compute styles (jsdom can't), so we
// disable just that rule here — it's checked live by Storybook's a11y addon.
const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("accessibility (axe)", () => {
  it.each(cases)("%s has no axe violations", async (_name, ui) => {
    const { container } = render(ui);
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });

  it("Modal (open dialog) has no axe violations", async () => {
    render(
      <Modal.Root defaultOpen>
        <Modal.Trigger>Order</Modal.Trigger>
        <Modal.Popup>
          <Modal.Title>Order confirmed</Modal.Title>
          <Modal.Description>Your order is on its way.</Modal.Description>
          <Modal.Close>Close</Modal.Close>
        </Modal.Popup>
      </Modal.Root>,
    );
    expect(await axe(document.body, axeOptions)).toHaveNoViolations();
  });

  it("Drawer (open dialog) has no axe violations", async () => {
    render(
      <Drawer.Root defaultOpen>
        <Drawer.Trigger>Menu</Drawer.Trigger>
        <Drawer.Popup side="start">
          <Drawer.Title>Navigation</Drawer.Title>
          <Drawer.Description>Jump to a section.</Drawer.Description>
          <Drawer.Close>Close</Drawer.Close>
        </Drawer.Popup>
      </Drawer.Root>,
    );
    expect(await axe(document.body, axeOptions)).toHaveNoViolations();
  });
});

describe("Avatar naming", () => {
  it("honours an explicitly decorative root", () => {
    const { container } = render(
      <Avatar.Root aria-hidden>
        <Avatar.Fallback>?</Avatar.Fallback>
      </Avatar.Root>,
    );
    const root = container.querySelector(".loam-Avatar");
    expect(root).toHaveAttribute("aria-hidden", "true");
    expect(root).not.toHaveAttribute("role");
  });

  it("is a named image when a name is given", () => {
    render(
      <Avatar.Root role="img" aria-label="Ada Lovelace">
        <Avatar.Fallback>AL</Avatar.Fallback>
      </Avatar.Root>,
    );
    expect(screen.getByRole("img", { name: "Ada Lovelace" })).toBeInTheDocument();
  });

  it("honours a consumer-supplied aria-label", () => {
    render(
      <Avatar.Root role="img" aria-label="Team member">
        <Avatar.Fallback>?</Avatar.Fallback>
      </Avatar.Root>,
    );
    expect(screen.getByRole("img", { name: "Team member" })).toBeInTheDocument();
  });
});

describe("DateInput wiring", () => {
  const threeFields = (
    <DateInput.Fields>
      <DateInput.Day />
      <DateInput.Month />
      <DateInput.Year />
    </DateInput.Fields>
  );

  it("renders three labelled numeric fields named and autofillable per part", () => {
    render(
      <DateInput.Root name="date-of-birth" autoComplete="bday">
        <DateInput.Legend>Date of birth</DateInput.Legend>
        <DateInput.Description>For example, 27 3 2007</DateInput.Description>
        {threeFields}
      </DateInput.Root>,
    );
    const group = screen.getByRole("group", { name: "Date of birth" });
    expect(group).toHaveAccessibleDescription("For example, 27 3 2007");
    for (const part of ["day", "month", "year"] as const) {
      const field = screen.getByLabelText(part.charAt(0).toUpperCase() + part.slice(1));
      if (part === "month") {
        // The month accepts names ("jan") as well as digits, so it keeps
        // the full keyboard.
        expect(field).not.toHaveAttribute("inputmode");
      } else {
        expect(field).toHaveAttribute("inputmode", "numeric");
      }
      expect(field).toHaveAttribute("name", `date-of-birth-${part}`);
      expect(field).toHaveAttribute("autocomplete", `bday-${part}`);
      // Width is the native size attribute: the answer's length, a
      // character more for a month written as a name.
      expect(field).toHaveAttribute("size", { day: "2", month: "3", year: "4" }[part]);
      // Each part is a core Field around a core Input, so its label is a
      // Field.Label pointing at the input.
      expect(field.closest(".loam-Field")).not.toBeNull();
    }
  });

  it("narrows the invalid state to the parts the error names", () => {
    render(
      <DateInput.Root invalid={["year"]}>
        <DateInput.Legend>When did your membership start?</DateInput.Legend>
        <DateInput.Error>Membership start date must include a year</DateInput.Error>
        {threeFields}
      </DateInput.Root>,
    );
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Membership start date must include a year",
    );
    expect(screen.getByLabelText("Year")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByLabelText("Day")).not.toHaveAttribute("aria-invalid");
    expect(screen.getByLabelText("Month")).not.toHaveAttribute("aria-invalid");
  });

  it("marks all parts invalid when the error names none", () => {
    render(
      <DateInput.Root invalid>
        <DateInput.Legend>Date of birth</DateInput.Legend>
        <DateInput.Error>Enter your date of birth</DateInput.Error>
        {threeFields}
      </DateInput.Root>,
    );
    for (const label of ["Day", "Month", "Year"]) {
      expect(screen.getByLabelText(label)).toHaveAttribute("aria-invalid", "true");
    }
  });

  it("forwards per-field props and custom labels through Field", () => {
    render(
      <DateInput.Root name="dob">
        <DateInput.Legend>Date de naissance</DateInput.Legend>
        <DateInput.Fields>
          <DateInput.Day>Jour</DateInput.Day>
          <DateInput.Month>Mois</DateInput.Month>
          <DateInput.Year maxLength={4} name="year-of-birth">
            Année
          </DateInput.Year>
        </DateInput.Fields>
      </DateInput.Root>,
    );
    expect(screen.getByLabelText("Jour")).toHaveAttribute("name", "dob-day");
    const year = screen.getByLabelText("Année");
    expect(year).toHaveAttribute("maxlength", "4");
    expect(year).toHaveAttribute("name", "year-of-birth");
  });
});
