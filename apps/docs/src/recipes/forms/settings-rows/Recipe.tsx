"use client";

import { Checkbox, Field, Fieldset, Select, Switch } from "@loamui/core";
import "./recipe.css";

export default function Recipe() {
  return (
    <Fieldset.Root className="settings-rows">
      <Fieldset.Legend>Notifications</Fieldset.Legend>
      <div className="rows">
        <Field.Root>
          <div className="row">
            <div className="text">
              <Field.Label>Order updates</Field.Label>
              <Field.Description>
                An email when an order is packed and again when it is posted.
              </Field.Description>
            </div>
            <div className="control">
              <Switch.Root>
                <Switch.Control name="orderUpdates" defaultChecked />
                <Switch.Track>
                  <Switch.Thumb />
                </Switch.Track>
              </Switch.Root>
            </div>
          </div>
        </Field.Root>
        <Field.Root>
          <div className="row">
            <div className="text">
              <Field.Label>Sowing reminders</Field.Label>
              <Field.Description>
                What to sow this month, for the seed you have bought.
              </Field.Description>
            </div>
            <div className="control">
              <Select.Root name="reminders" defaultValue="monthly">
                <Select.Option value="weekly">Weekly</Select.Option>
                <Select.Option value="monthly">Monthly</Select.Option>
                <Select.Option value="never">Never</Select.Option>
              </Select.Root>
            </div>
          </div>
        </Field.Root>
        <Field.Root>
          <div className="row">
            <div className="text">
              <Field.Label>Seasonal newsletter</Field.Label>
              <Field.Description>News from the co-op, four times a year.</Field.Description>
            </div>
            <div className="control">
              <Checkbox name="newsletter" />
            </div>
          </div>
        </Field.Root>
        <Field.Root invalid>
          <div className="row">
            <div className="text">
              <Field.Label>Text message alerts</Field.Label>
              <Field.Description>A text when a courier is on the way.</Field.Description>
            </div>
            <div className="control">
              <Switch.Root>
                <Switch.Control name="textAlerts" defaultChecked />
                <Switch.Track>
                  <Switch.Thumb />
                </Switch.Track>
              </Switch.Root>
            </div>
            <Field.Error>Add a mobile number to your account before turning this on</Field.Error>
          </div>
        </Field.Root>
      </div>
    </Fieldset.Root>
  );
}
