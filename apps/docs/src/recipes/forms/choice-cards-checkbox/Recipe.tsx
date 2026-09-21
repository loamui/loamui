"use client";

import { useId } from "react";
import { Card, Checkbox, Fieldset } from "@loamui/core";
import "./recipe.css";

const ADDONS = [
  {
    value: "seed-of-the-month",
    title: "Seed of the month",
    description: "A packet chosen for the season, posted on the first of each month. £4 a month.",
    defaultChecked: true,
  },
  {
    value: "calendar",
    title: "Printed sowing calendar",
    description: "The year's sowing and planting dates for your plot, on the wall. £6, once.",
  },
  {
    value: "open-days",
    title: "Open-day pass",
    description: "Included with Grower and Household membership.",
    disabled: true,
  },
];

export default function Recipe() {
  const instanceId = useId();
  return (
    <Fieldset.Root className="choice-cards-checkbox">
      <Fieldset.Legend>Add-ons</Fieldset.Legend>
      <div className="cards">
        {ADDONS.map((addon) => {
          const id = `${instanceId}-addon-${addon.value}`;
          return (
            <Card key={addon.value} render={<label className="card" htmlFor={id} />}>
              <span className="control">
                <Checkbox
                  id={id}
                  name="addon"
                  value={addon.value}
                  defaultChecked={addon.defaultChecked}
                  disabled={addon.disabled}
                  aria-labelledby={`${id}-title`}
                  aria-describedby={`${id}-description`}
                />
              </span>
              <span className="title" id={`${id}-title`}>
                {addon.title}
              </span>
              <span className="description" id={`${id}-description`}>
                {addon.description}
              </span>
            </Card>
          );
        })}
      </div>
    </Fieldset.Root>
  );
}
