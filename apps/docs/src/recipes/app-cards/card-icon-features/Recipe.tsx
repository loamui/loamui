"use client";

import { useId } from "react";
import { Badge, Card, Price, SignpostLink } from "@loamui/core";
import "./recipe.css";

// One stroked path per feature, drawn on a 24-unit grid in currentColor.
const FEATURES = [
  {
    name: "Mixed succulent plants",
    d: "M12 21V9M12 9C9 9 6 7 6 3c4 0 6 2 6 6zM12 13c0-4 2-6 6-6 0 4-3 6-6 6z",
  },
  {
    name: "Collection from the nursery",
    d: "M4 20h16M6 20V10l6-6 6 6v10M9 20v-4h6v4",
  },
  { name: "Glass bowl included", d: "M4 7h16M4 7c0 8 3 13 8 13s8-5 8-13M4 7c0-2 4-4 8-4s8 2 8 4" },
  {
    name: "Gift message available",
    d: "M5 4h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-8l-6 4v-4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM7 8h10M7 12h7",
  },
];

export default function Recipe() {
  const instanceId = useId();
  return (
    <Card
      render={
        <article
          className="card-icon-features"
          aria-labelledby={`${instanceId}-card-icon-features-title`}
        />
      }
    >
      <img
        className="media"
        src="https://picsum.photos/id/530/800/500"
        alt="Rosette and trailing succulents planted in a clear glass bowl"
        width="800"
        height="500"
      />
      <div className="head">
        <h3 id={`${instanceId}-card-icon-features-title`}>Succulent bowl</h3>
        <p className="flag">
          <Badge.Root>
            <Badge.Text>Gift idea</Badge.Text>
          </Badge.Root>
        </p>
      </div>
      <p className="description">
        A mixed planting of rosette and trailing succulents in a clear glass bowl. Ready to display
        or give as a gift.
      </p>
      <ul className="features" role="list" aria-label="What you get">
        {FEATURES.map((feature) => (
          <li key={feature.name}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d={feature.d} />
            </svg>
            {feature.name}
          </li>
        ))}
      </ul>
      <div className="foot">
        <p className="price">
          <Price value={18.5} currency="GBP" locale="en-GB">
            per bowl
          </Price>
        </p>
        <div className="actions">
          <SignpostLink href="/shop/succulent-bowl">View succulent bowl</SignpostLink>
        </div>
      </div>
    </Card>
  );
}
