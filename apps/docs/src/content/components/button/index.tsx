import { Button, Checkbox, Loader, VisuallyHidden, Field } from "@loamui/core";
import type { CSSProperties } from "react";
import type { ComponentContent } from "@/renderer/types";
import { Example } from "@/renderer/components/Example";
import { IconCheck } from "@tabler/icons-react";

const doc: ComponentContent = {
  slug: "button",
  lead: "A native button whose appearance is decided by its context, not by props.",
  importLine: `import { Button, Checkbox, Loader, VisuallyHidden } from "@loamui/core";`,
  demos: [
    {
      title: "Contexts",
      description:
        "Buttons are neutral by default. Declare --loam-context on a region and the buttons inside re-answer their colour; there are no variant props. Primary is the neutral near-black in the white-label default, so a primary region reads as the same quiet button until a theme sets --loam-color-primary; danger shows the remap. See the Contextualism guide.",
      code: `<Button>Neutral</Button>

<div style={{ "--loam-context": "primary" }}>
  <Button>Save changes</Button>
</div>

<div style={{ "--loam-context": "danger" }}>
  <Button>Delete</Button>
</div>`,
      render: () => (
        <div
          style={{
            display: "flex",
            gap: "var(--loam-space-xs)",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <Button>Neutral</Button>
          <div style={{ "--loam-context": "primary" } as CSSProperties}>
            <Button>Save changes</Button>
          </div>
          <div style={{ "--loam-context": "danger" } as CSSProperties}>
            <Button>Delete</Button>
          </div>
        </div>
      ),
    },
    {
      title: "A region adapts every component",
      description:
        "--loam-context isn't a button feature: everything in the region answers it. Here the checkbox's fill, the button's tint and the loader's stroke all take the danger colour, and focus rings inside follow. Intent is declared once on the container, not as a colour prop on each control.",
      code: `<div style={{ "--loam-context": "danger" }}>
  <Field.Item><Field.Label><Checkbox defaultChecked /> Also delete backups</Field.Label></Field.Item>
  <Button>Delete account</Button>
  <Loader label="Deleting" />
</div>`,
      render: () => (
        <div
          style={
            {
              "--loam-context": "danger",
              display: "flex",
              gap: "var(--loam-space-s)",
              flexWrap: "wrap",
              alignItems: "center",
            } as CSSProperties
          }
        >
          <Field.Item>
            <Field.Label>
              <Checkbox defaultChecked /> Also delete backups
            </Field.Label>
          </Field.Item>
          <Button>Delete account</Button>
          <Loader label="Deleting" />
        </div>
      ),
    },
    {
      title: "Size and width from context",
      description:
        "There are no size or fullWidth props. Body-text and spacing tokens give the button a generous default and adapt it to its container. Labels can wrap when text is enlarged or translated; height grows with the content. Width is the parent's decision: a container of 16rem or less makes a button span it, a grid or stacked-flex region stretches its buttons (that is the platform's own layout at work), and a flex row shrink-wraps them to their labels.",
      code: `<div style={{ containerType: "inline-size", inlineSize: "14rem" }}>
  <Button>Save changes</Button>
</div>

<div style={{ containerType: "inline-size", inlineSize: "24rem" }}>
  <Button>Save changes</Button>
</div>

<div style={{ display: "grid", gap: "var(--loam-space-xs)", inlineSize: "min(100%, 18rem)" }}>
  <Button>Save changes</Button>
  <Button>Cancel</Button>
</div>`,
      render: () => (
        <div style={{ display: "grid", gap: "var(--loam-space-m)", inlineSize: "100%" }}>
          <Example label="Container of 16rem or less: the button spans it">
            <div
              style={{
                containerType: "inline-size",
                inlineSize: "min(100%, 14rem)",
                padding: "var(--loam-space-xs)",
                border: "1px dashed var(--loam-color-line)",
                borderRadius: "var(--loam-radius-md)",
              }}
            >
              <Button>Save changes</Button>
            </div>
          </Example>
          <Example label="Room to spare: natural width">
            <div
              style={{
                containerType: "inline-size",
                inlineSize: "min(100%, 24rem)",
                padding: "var(--loam-space-xs)",
                border: "1px dashed var(--loam-color-line)",
                borderRadius: "var(--loam-radius-md)",
              }}
            >
              <Button>Save changes</Button>
            </div>
          </Example>
          <Example
            label="A stacked region stretches its buttons"
            style={{ justifyItems: "stretch" }}
          >
            <div
              style={{
                display: "grid",
                gap: "var(--loam-space-xs)",
                inlineSize: "min(100%, 18rem)",
              }}
            >
              <Button>Save changes</Button>
              <Button>Cancel</Button>
            </div>
          </Example>
        </div>
      ),
    },
    {
      title: "Icons, composed as children",
      description:
        "There are no leftSection or rightSection props. An svg child is detected via :has() and gets flex layout, a gap and 1em sizing. Icon-only is detected from the accessible name: the aria-label (or aria-labelledby) an icon-only button needs anyway, or a VisuallyHidden child beside the icon, and it becomes square.",
      code: `<Button>
  <IconCheck aria-hidden />
  Approve
</Button>

<Button aria-label="Approve">
  <IconCheck aria-hidden />
</Button>

<Button>
  <IconCheck aria-hidden />
  <VisuallyHidden>Approve</VisuallyHidden>
</Button>`,
      render: () => (
        <div style={{ display: "flex", gap: "var(--loam-space-l)", flexWrap: "wrap" }}>
          <Example label="With a label">
            <Button>
              <IconCheck aria-hidden />
              Approve
            </Button>
          </Example>
          <Example label="Icon-only: squares from its aria-label">
            <Button aria-label="Approve">
              <IconCheck aria-hidden />
            </Button>
          </Example>
          <Example label="Icon-only: named by hidden text">
            <Button>
              <IconCheck aria-hidden />
              <VisuallyHidden>Approve</VisuallyHidden>
            </Button>
          </Example>
        </div>
      ),
    },
    {
      title: "Another element",
      description:
        "render substitutes the element and merges the Button's class and wiring onto it. Not for navigation, which is SignpostLink; here a native <summary> wears the button so a disclosure's toggle looks like the action it is.",
      code: `<details>
  <Button render={<summary />}>Show details</Button>
  <p>The disclosure is native; the summary wears the button.</p>
</details>`,
      render: () => (
        <details>
          <Button render={<summary />}>Show details</Button>
          <p style={{ marginBlockStart: "var(--loam-space-xs)" }}>
            The disclosure is native; the summary wears the button.
          </p>
        </details>
      ),
    },
    {
      title: "Loading state",
      description:
        "There is no loading prop. For a genuine busy state, add disabled and compose a Loader (marked aria-hidden so it isn't announced) into the children; it is detected and sized like an icon. This is the one sanctioned use of a disabled button; see “Avoid disabled buttons” below.",
      code: `<Button disabled>
  <Loader aria-hidden /> Saving
</Button>`,
      render: () => (
        <Button disabled>
          <Loader aria-hidden /> Saving
        </Button>
      ),
    },
  ],
  whenToUse: [
    "To trigger an action in the current context: submitting a form, opening a dialog, confirming a choice.",
    "For destructive or risky operations, inside a danger region, so the whole surrounding context signals the stakes rather than one red button.",
  ],
  whenNotToUse: [
    'To navigate to another page or URL: use a link. A button that navigates breaks right-click, middle-click and "open in new tab".',
    "For many low-emphasis choices at once: consider a Menu or Tabs instead of a row of equal buttons.",
  ],
  howItWorks: [
    {
      title: "Buttons act, links navigate",
      body: "The element must match the behaviour, not the look. When a design wants a button-sized call-to-action that navigates, do not dress a Button as a link: use SignpostLink, which keeps real link semantics (right-click, middle-click, open-in-new-tab, link announcement) with the prominence the design asks for. The reverse holds too: an <a> with an onClick that mutates data is still a button in disguise.",
    },
    {
      title: "Buttons don't submit by accident",
      body: 'A bare <button> inside a form is a native submit button, so Button defaults type="button": a Cancel button can never submit the form it sits in. Pass type="submit" on the one button that should. The render path forwards your element untouched, so a render={<button/>} keeps the native default and needs its own type.',
    },
    {
      title: "Avoid disabled buttons",
      body: "A disabled submit button has poor contrast, can't receive focus in most browsers, and, worst of all, gives no feedback about why it's disabled or how to fix it; users are left guessing which field is wrong. Keep the button enabled, validate on submit, and answer a bad submission with specific field errors (see Field). The one good use of disabled is a genuine busy state, paired with a composed Loader.",
    },
    {
      title: "Prevent double submission on the server",
      body: "Button deliberately ships no preventDoubleClick or debounce prop. A client-side debounce doesn't prevent duplicates (retries, impatient refreshes and flaky networks bypass it), while it does hide real failures by swallowing clicks that deserved a response. Make the operation safe to repeat instead: an idempotency key or server-side dedupe, with disabled + <Loader/> as visible feedback while the request is in flight, not as the safety mechanism.",
    },
    {
      title: "One primary action per section",
      body: `Emphasis is a property of the region, not the button: wrap the section's single most important action in a primary context (--loam-context: "primary") and leave every other button neutral. Two "primary" buttons side by side ask the user to make a decision the interface should have made: if everything is emphasised, nothing is.`,
    },
  ],
  accessibility: [
    "Always renders a real <button>, so keyboard focus, Enter/Space activation and the button role come from the platform.",
    'Write a specific label: the text should make sense out of context ("Save changes", not "OK"). Icon-only buttons need a name: aria-label, aria-labelledby, or a VisuallyHidden child beside the icon; any of the three also makes the button square.',
    "For a loading state, add disabled and compose a Loader (marked aria-hidden) into the children so it isn't announced as content.",
    "Focus is shown with a :focus-visible ring (never removed without a replacement), and colour is never the only signal of state.",
  ],
  props: [
    {
      name: "children",
      type: "ReactNode",
      description: "The button content: label, and any composed icons/spinner.",
    },
    {
      name: "type",
      type: `"button" | "submit" | "reset"`,
      default: `"button"`,
      description: "Unlike a native <button>, never a submit button unless you say so.",
    },
    {
      name: "render",
      type: "element | (props) => node",
      description:
        "Substitute the rendered element; the Button's classes and wiring merge onto yours. Not for navigation: a call-to-action that goes somewhere is a SignpostLink.",
    },
    {
      name: "...others",
      type: "ButtonHTMLAttributes",
      description: "All native <button> props are forwarded.",
    },
  ],
  cssProps: [
    {
      name: "--loam-button-color",
      syntax: "CSS color",
      default: "var(--loam-color-fg)",
      description:
        "The button's single colour channel. Set it to recolour one instance or a wrapper component; background, border, hover and active are all derived from it.",
    },
    {
      name: "--loam-button-radius",
      syntax: "CSS length",
      default: "var(--loam-radius-md)",
      description: "Corner rounding; set it per instance or on a wrapper component.",
    },
  ],
  contextual: true,
};

export default doc;
