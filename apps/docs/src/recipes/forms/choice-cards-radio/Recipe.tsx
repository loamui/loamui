"use client";

import { useId } from "react";
import { Card, Radio, RadioGroup } from "@loamui/core";
import "./recipe.css";

const PLANS = [
  {
    value: "friend",
    title: "Friend",
    description: "Member prices on seed and plants, and the seasonal newsletter. £15 a year.",
  },
  {
    value: "grower",
    title: "Grower",
    description:
      "Everything a Friend gets, plus a share of a seed-saving plot and the sowing calendar. £40 a year.",
  },
  {
    value: "household",
    title: "Household",
    description: "Grower membership for up to four people at one address. £70 a year.",
  },
];

export default function Recipe({ name }: { name?: string }) {
  const instanceId = useId();
  return (
    <RadioGroup.Root className="choice-cards-radio" name={name} defaultValue="grower">
      <RadioGroup.Legend>Choose a membership</RadioGroup.Legend>
      <div className="cards">
        {PLANS.map((plan) => {
          const id = `${instanceId}-plan-${plan.value}`;
          return (
            <Card key={plan.value} render={<label className="card" htmlFor={id} />}>
              <span className="control">
                <Radio
                  id={id}
                  value={plan.value}
                  aria-labelledby={`${id}-title`}
                  aria-describedby={`${id}-description`}
                />
              </span>
              <span className="title" id={`${id}-title`}>
                {plan.title}
              </span>
              <span className="description" id={`${id}-description`}>
                {plan.description}
              </span>
            </Card>
          );
        })}
      </div>
    </RadioGroup.Root>
  );
}
