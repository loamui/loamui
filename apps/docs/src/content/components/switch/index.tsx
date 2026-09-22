import type { ComponentContent } from "@/renderer/types";
import { Variant } from "@/renderer/components/Variant";
import { Field, Switch } from "@loamui/core";

export function SwitchFieldDemo() {
  return (
    <Field.Root>
      <Field.Label>
        <Switch.Root>
          <Switch.Control defaultChecked />
          <Switch.Track>
            <Switch.Thumb />
          </Switch.Track>
        </Switch.Root>{" "}
        Email notifications
      </Field.Label>
      <Field.Description>Sent at most once a day.</Field.Description>
    </Field.Root>
  );
}

const doc: ComponentContent = {
  slug: "switch",
  lead: "An on/off toggle for a single setting that takes effect immediately.",
  importLine: `import { Field, Switch } from "@loamui/core";`,
  demos: [
    {
      title: "Basic usage",
      description:
        "A bare Switch named by aria-label, for a row where the words already sit beside it. Off by default: a setting the user has not turned on.",
      code: `<Switch.Root><Switch.Control aria-label="Email notifications" /><Switch.Track><Switch.Thumb /></Switch.Track></Switch.Root>`,
      render: () => (
        <Switch.Root>
          <Switch.Control aria-label="Email notifications" />
          <Switch.Track>
            <Switch.Thumb />
          </Switch.Track>
        </Switch.Root>
      ),
    },
    {
      title: "Checked",
      description: "The track fills with the primary colour when on.",
      code: `<Switch.Root><Switch.Control defaultChecked aria-label="Autosave" /><Switch.Track><Switch.Thumb /></Switch.Track></Switch.Root>`,
      render: () => (
        <Switch.Root>
          <Switch.Control defaultChecked aria-label="Autosave" />
          <Switch.Track>
            <Switch.Thumb />
          </Switch.Track>
        </Switch.Root>
      ),
    },
    {
      title: "Label position",
      description:
        "Place the text before or after Switch.Root inside Field.Label. DOM order sets the label position.",
      code: `<Field.Item><Field.Label><Switch.Root><Switch.Control  /><Switch.Track><Switch.Thumb /></Switch.Track></Switch.Root> Enable notifications</Field.Label></Field.Item>
<Field.Item><Field.Label>Marketing emails <Switch.Root><Switch.Control  /><Switch.Track><Switch.Thumb /></Switch.Track></Switch.Root></Field.Label></Field.Item>`,
      render: () => (
        <div style={{ display: "grid", gap: "var(--loam-space-xs)" }}>
          <Variant label="Label at the end (default)">
            <Field.Item>
              <Field.Label>
                <Switch.Root>
                  <Switch.Control />
                  <Switch.Track>
                    <Switch.Thumb />
                  </Switch.Track>
                </Switch.Root>{" "}
                Enable notifications
              </Field.Label>
            </Field.Item>
          </Variant>
          <Variant label="Label at the start">
            <Field.Item>
              <Field.Label>
                Marketing emails{" "}
                <Switch.Root>
                  <Switch.Control />
                  <Switch.Track>
                    <Switch.Thumb />
                  </Switch.Track>
                </Switch.Root>
              </Field.Label>
            </Field.Item>
          </Variant>
        </div>
      ),
    },
    {
      title: "Disabled",
      description:
        "disabled reaches the native input: the track is dimmed and the input is skipped by Tab, and a switch that is on and disabled shows a setting that is on and not the user's to change here. Disabled is detected on the input, never declared on the row.",
      code: `<Field.Item><Field.Label><Switch.Root><Switch.Control disabled /><Switch.Track><Switch.Thumb /></Switch.Track></Switch.Root> Usage analytics</Field.Label></Field.Item>
<Field.Item><Field.Label><Switch.Root><Switch.Control defaultChecked disabled /><Switch.Track><Switch.Thumb /></Switch.Track></Switch.Root> Security alerts</Field.Label></Field.Item>`,
      render: () => (
        <div style={{ display: "grid", gap: "var(--loam-space-xs)" }}>
          <Field.Item>
            <Field.Label>
              <Switch.Root>
                <Switch.Control disabled />
                <Switch.Track>
                  <Switch.Thumb />
                </Switch.Track>
              </Switch.Root>{" "}
              Usage analytics
            </Field.Label>
          </Field.Item>
          <Field.Item>
            <Field.Label>
              <Switch.Root>
                <Switch.Control defaultChecked disabled />
                <Switch.Track>
                  <Switch.Thumb />
                </Switch.Track>
              </Switch.Root>{" "}
              Security alerts
            </Field.Label>
          </Field.Item>
        </div>
      ),
    },
    {
      title: "Composed inside a Field",
      description:
        "The bare Switch.Control self-wires from Field context: label association and description linking come from the Field, the same composition contract every form control shares.",
      code: `<Field.Root>
  <Field.Label>
    <Switch.Root><Switch.Control defaultChecked /><Switch.Track><Switch.Thumb /></Switch.Track></Switch.Root> Email notifications
  </Field.Label>
  <Field.Description>Sent at most once a day.</Field.Description>
</Field.Root>`,
      render: () => <SwitchFieldDemo />,
    },
  ],
  whenToUse: [
    "For an instant on/off setting that takes effect immediately, with no separate save step (notifications, dark mode).",
    "When the two states are clearly opposite and the control acts like a physical switch.",
  ],
  whenNotToUse: [
    'When the change only applies after submitting a form. Use a Checkbox instead: its ticked state reads as "will apply when I submit".',
    "For selecting among more than two states. Use Radio or Select.",
  ],
  howItWorks: [
    {
      title: "A switch acts now, a checkbox acts on submit",
      body: 'role="switch" announces on/off, and users expect flipping it to take effect immediately, like a light switch. Inside a form that applies changes on save, that expectation is a lie: use Checkbox, whose ticked state reads as “will apply when I submit”. The test is the presence of a save button: if there is one, it isn\'t a Switch.',
    },
    {
      title: "Label the affirmative",
      body: "The label names the thing that is on when the switch is on: “Email notifications”, never “Disable emails”. The control already says on or off, so a negated label makes on mean off. Keep the label constant across states; a label that rewrites itself when toggled leaves users unsure whether it describes the current state or the action.",
    },
  ],
  accessibility: [
    'Renders a native checkbox exposed with role="switch", so it is operable by keyboard and announced as on/off.',
    "The label is tied to the control; the whole row is clickable.",
    "In the rare case a switch needs an error message, wrap it in a Field.Root and add a Field.Error before the control: set invalid on Field.Root for the validation state; the message is announced.",
    "State is conveyed by more than colour (the thumb position), so it remains clear in forced-colors and for colour-blind users.",
    "Disabled is detected on the native input (:has(input:disabled) on the row, input:disabled on the track), never declared on a wrapper.",
  ],

  parts: [
    {
      name: "Switch.Root",
      description: "A span containing Control and Track. Native span props and ref are forwarded.",
    },
    {
      name: "Switch.Control",
      description:
        "The native checkbox with role=switch. Receives checked, defaultChecked, disabled, name, onChange, ref and other input props, and self-wires from Field.",
    },
    {
      name: "Switch.Track",
      description:
        "The decorative track, following the Control in the DOM. Native span props are forwarded.",
    },
    {
      name: "Switch.Thumb",
      description:
        "The decorative thumb inside Track; CSS moves it in response to the native input’s checked state.",
    },
  ],
};
export default doc;
