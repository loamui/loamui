"use client";

import { useId } from "react";
import { Badge, Card, SignpostLink } from "@loamui/core";
import "./example.css";

const GUIDES = [
  {
    slug: "broad-beans",
    title: "Broad beans",
    description: "Sow in autumn for the earliest crop, or in February under a cloche.",
  },
  {
    slug: "tomatoes",
    title: "Tomatoes",
    description: "Start on a warm sill in March; pot on twice before they go out in June.",
  },
  {
    slug: "lettuce",
    title: "Lettuce",
    description: "A pinch every fortnight from March keeps a row coming until the frost.",
  },
];

export default function Example() {
  const instanceId = useId();
  return (
    <div className="grid-leading-item">
      <ul role="list">
        <li className="lead">
          <Card render={<article aria-labelledby={`${instanceId}-grid-leading-item-lead`} />}>
            <p className="eyebrow">
              <Badge.Root>
                <Badge.Text>Start here</Badge.Text>
              </Badge.Root>
            </p>
            <h3 id={`${instanceId}-grid-leading-item-lead`}>Your first year of seed saving</h3>
            <p>
              Which crops to save from first, how far apart to keep them from their relatives, and
              how to clean, dry and store what you gather. Written for a plot of any size, by the
              growers who supply the bench, and enough to bring your own packet to the swap next
              year.
            </p>
            <div className="actions">
              <SignpostLink href="/guides/first-year">Read the guide</SignpostLink>
            </div>
          </Card>
        </li>
        <li className="side">
          <Card render={<article aria-labelledby={`${instanceId}-grid-leading-item-side`} />}>
            <h3 id={`${instanceId}-grid-leading-item-side`}>Sowing this week</h3>
            <p>
              Winter lettuce, spinach and spring onions outside; hardy peas under a cloche for May.
            </p>
            <div className="actions">
              <SignpostLink href="/calendar">Open the calendar</SignpostLink>
            </div>
          </Card>
        </li>
        {GUIDES.map((guide) => (
          <li key={guide.slug}>
            <Card
              render={<article aria-labelledby={`${instanceId}-grid-leading-item-${guide.slug}`} />}
            >
              <h3 id={`${instanceId}-grid-leading-item-${guide.slug}`}>{guide.title}</h3>
              <p>{guide.description}</p>
              <div className="actions">
                <SignpostLink href={`/guides/${guide.slug}`}>
                  How to grow {guide.title.toLowerCase()}
                </SignpostLink>
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
