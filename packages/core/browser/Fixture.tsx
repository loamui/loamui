import { useState } from "react";
import {
  Avatar,
  Button,
  Checkbox,
  Combobox,
  DateInput,
  PasswordInput,
  Radio,
  RadioGroup,
  Switch,
  Field,
  Input,
  Modal,
  QuantityInput,
  Tabs,
} from "../src/index.js";
import CurrencyRecipe from "../../../apps/docs/src/recipes/forms/number-with-currency/Recipe.js";

function Help() {
  return <Field.Description id="email-help">Use your work email.</Field.Description>;
}

export function Fixture() {
  const [submissions, setSubmissions] = useState(0);
  const [key, setKey] = useState("");
  const [src, setSrc] = useState("/broken-avatar.png");
  return (
    <main>
      <h1>Component contracts</h1>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setSubmissions((n) => n + 1);
        }}
      >
        <Field.Root id="email" invalid>
          <Field.Label>Email</Field.Label>
          <Help />
          <Field.Error id="email-error">Enter your work email.</Field.Error>
          <Input name="email" aria-describedby="email-help email-error" />
        </Field.Root>
        <QuantityInput aria-label="Quantity" name="quantity" readOnly defaultValue={2} />
        <Button render={<button />}>Cancel</Button>
        <Button type="submit">Save</Button>
        <p>Submissions: {submissions}</p>
      </form>
      <Field.Item>
        <Field.Label>
          <Checkbox name="updates" /> Email updates
        </Field.Label>
        <Field.Description>Weekly updates.</Field.Description>
      </Field.Item>
      <RadioGroup.Root name="plan">
        <RadioGroup.Legend>Plan</RadioGroup.Legend>
        <Field.Item>
          <Field.Label>
            <Radio value="basic" /> Basic
          </Field.Label>
          <Field.Description>For individuals.</Field.Description>
        </Field.Item>
        <Field.Item>
          <Field.Label>
            <Radio value="team" /> Team
          </Field.Label>
          <Field.Description>For groups.</Field.Description>
        </Field.Item>
      </RadioGroup.Root>
      <Field.Item>
        <Field.Label>
          <Switch.Root>
            <Switch.Control />
            <Switch.Track>
              <Switch.Thumb />
            </Switch.Track>
          </Switch.Root>{" "}
          Notifications
        </Field.Label>
      </Field.Item>
      <Tabs.Root defaultValue="one">
        <Tabs.List aria-label="Sections" onKeyDown={(event) => setKey(event.key)}>
          <Tabs.Tab value="one">One</Tabs.Tab>
          <Tabs.Tab value="two">Two</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="one">First panel</Tabs.Panel>
        <Tabs.Panel value="two">Second panel</Tabs.Panel>
      </Tabs.Root>
      <p>Last key: {key}</p>
      <Avatar.Root role="img" aria-label="Ada Lovelace">
        <Avatar.Image src={src} alt="" loading="lazy" />
        <Avatar.Fallback>AL</Avatar.Fallback>
      </Avatar.Root>
      <Button onClick={() => setSrc("/avatar.svg")}>Retry image</Button>
      <Modal.Root>
        <Modal.Trigger>Open dialog</Modal.Trigger>
        <Modal.Popup>
          <Modal.Title>Confirm change</Modal.Title>
          <Modal.Description>Review before saving.</Modal.Description>
          <Modal.Close>Close dialog</Modal.Close>
        </Modal.Popup>
      </Modal.Root>
      <section aria-label="Input composition" style={{ maxInlineSize: "28rem" }}>
        <h2>Native inputs</h2>
        <Field.Root>
          <Field.Label>Reference</Field.Label>
          <Input name="reference" size={4} defaultValue="1234" />
        </Field.Root>
        <Input aria-label="Locked input" disabled defaultValue="Locked" />
        <Input aria-label="Read-only input" readOnly defaultValue="Original" />
        <Field.Root>
          <Field.Label>Password</Field.Label>
          <PasswordInput defaultValue="secret" />
        </Field.Root>
        <DateInput.Root>
          <DateInput.Legend>Date of birth</DateInput.Legend>
          <DateInput.Fields>
            <DateInput.Day />
            <DateInput.Month />
            <DateInput.Year />
          </DateInput.Fields>
        </DateInput.Root>
        <Field.Root>
          <Field.Label>Crop</Field.Label>
          <Combobox.Root>
            <Combobox.Input style={{ textAlign: "start" }} />
            <Combobox.List>
              <Combobox.Option value="carrot">Carrot</Combobox.Option>
              <Combobox.Option value="pea">Pea</Combobox.Option>
            </Combobox.List>
          </Combobox.Root>
        </Field.Root>
        <CurrencyRecipe />
      </section>
    </main>
  );
}
