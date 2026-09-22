import {
  initialsFrom,
  Alert,
  Avatar,
  Badge,
  Checkbox,
  Radio,
  Range,
  Switch,
  Table,
  Field,
  Tabs,
  Input,
  Combobox,
} from "../index.js";

/*
 * The composition surface has exactly two shapes, and no hybrids.
 *
 * A component with parts is a namespace — `export * as X` — and you build it
 * from those parts. There is no one-invocation shortcut past them: a component
 * that has parts asks you to use them, which is the whole point of composition.
 * A component with no parts worth exposing is a plain callable export.
 *
 * Which bucket a component lands in is settled by one question: are there
 * parts worth exposing? A part is worth exposing when it renders something you
 * could not otherwise get. A part that re-renders what the component already
 * renders is a second name for one thing — the errors below pin that line down.
 */

// --- Namespaces: an anatomy, assembled ---

export const composition = (
  <Alert.Root>
    <Alert.Title>Saved</Alert.Title>
  </Alert.Root>
);
export const fieldDescription = <Field.Description>Use your work email.</Field.Description>;
export const tab = <Tabs.Tab value="overview">Overview</Tabs.Tab>;

// @ts-expect-error Headings are composed with Alert.Title.
export const titleProp = <Alert.Root title="Saved" />;
// @ts-expect-error Icons are composed with Alert.Icon.
export const iconProp = <Alert.Root icon={<span />} />;
// @ts-expect-error Dismissal belongs to Alert.Close.
export const closeProp = <Alert.Root onClose={() => {}} />;

// Avatar.Root holds parts, not content props: you write the fallback. The
// fiddly bit — grapheme-safe initials — is a helper, not a hidden default.
export const initials: string = initialsFrom("Ada Lovelace");
// @ts-expect-error Fallback content is composed, never derived from a prop.
export const avatarName = <Avatar.Root name="Ada Lovelace" />;
export const avatar = (
  <Avatar.Root role="img" aria-label="Ada Lovelace">
    <Avatar.Image src="/ada.png" alt="" />
    <Avatar.Fallback>AL</Avatar.Fallback>
  </Avatar.Root>
);
// @ts-expect-error Overflow is an explicitly composed avatar.
export const avatarOverflow = <Avatar.Group more={5} />;

// @ts-expect-error Checked state belongs to the native Switch.Control.
export const switchDefault = <Switch.Root defaultChecked />;

export const table = (
  <Table.Root>
    <Table.Thead>
      <Table.Tr>
        <Table.Th>Order</Table.Th>
      </Table.Tr>
    </Table.Thead>
  </Table.Root>
);
// The slider stands alone; Root and Output are for a readout beside it.
export const range = <Range.Control defaultValue={40} aria-label="Value" />;
export const rangeWithOutput = (
  <Range.Root>
    <Range.Control defaultValue={40} aria-label="Value" />
    <Range.Output />
  </Range.Root>
);

// --- Callables: one element, so no parts to name ---

export const badge = (
  <Badge.Root>
    <Badge.Text>Live</Badge.Text>
  </Badge.Root>
);
// @ts-expect-error A status dot is an icon child, not a part of the anatomy.
export const badgeDot = <Badge.Dot />;

// Content props: the label and its description are what a checkbox is for,
// so they compose the labelled row rather than being configuration. With
// neither, the same component renders the bare control a Field wires — which
// is why there is no separate Control part to reach for.
export const checkboxLabel = <Checkbox label="Accept" />;
export const bareCheckbox = <Checkbox aria-label="Select row" />;
export const radioDescription = <Radio description="Choose one" />;
// @ts-expect-error Checkbox with no label already is the bare control.
export const checkboxControl = <Checkbox.Control />;
// @ts-expect-error Radio with no label already is the bare control.
export const radioControl = <Radio.Control />;

// Adornments are content, not configuration: a currency symbol belongs in
// the box, and the box is the wrapper Input, Textarea and Select all render.
export const inputPrefix = <Input startSection="£" />;
export const inputSuffix = <Input endSection="GBP" />;
export const inputWrapper = <Input wrapperProps={{}} />;
// Combobox.Input renders the library's Input, so it takes the same wrapper.
export const comboboxWrapper = <Combobox.Input wrapperProps={{}} />;
