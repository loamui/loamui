"use client";

import { useId } from "react";
import { Card, Fieldset, Switch } from "@loamui/core";
import "./recipe.css";

const PREFERENCES = [
  {
    id: "orders",
    name: "orderUpdates",
    label: "Order updates",
    description: "An email when an order is packed and again when it is posted.",
    on: true,
  },
  {
    id: "sowing",
    name: "sowingReminders",
    label: "Sowing reminders",
    description: "What to sow this month, for the seed you have bought.",
    on: true,
  },
  {
    id: "swaps",
    name: "swapRequests",
    label: "Seed swap requests",
    description: "When a member asks for a variety you have listed.",
    on: false,
  },
  {
    id: "newsletter",
    name: "newsletter",
    label: "Seasonal newsletter",
    description: "News from the co-op, four times a year.",
    on: false,
  },
];

export default function Recipe() {
  const instanceId = useId();
  return (
    <Card className="card-with-switches">
      <Fieldset.Root className="preferences">
        <Fieldset.Legend>Notifications</Fieldset.Legend>
        <p className="description">Choose which messages Hedgerow sends you.</p>
        <div className="rows">
          {PREFERENCES.map((preference) => {
            const id = `${instanceId}-card-with-switches-${preference.id}`;
            return (
              <div className="row" key={preference.id}>
                <div className="text">
                  <label htmlFor={id}>{preference.label}</label>
                  <p id={`${id}-description`}>{preference.description}</p>
                </div>
                <Switch.Root>
                  <Switch.Control
                    id={id}
                    name={preference.name}
                    aria-describedby={`${id}-description`}
                    defaultChecked={preference.on}
                  />
                  <Switch.Track>
                    <Switch.Thumb />
                  </Switch.Track>
                </Switch.Root>
              </div>
            );
          })}
        </div>
      </Fieldset.Root>
    </Card>
  );
}
