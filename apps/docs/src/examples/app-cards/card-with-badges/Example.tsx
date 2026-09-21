"use client";

import { useId } from "react";
import { Badge, Card, SignpostLink } from "@loamui/core";
import "./example.css";

// One stroked path per amenity, drawn on a 24-unit grid in currentColor.
const AMENITIES = [
  { name: "Car park", d: "M5 11l2-5h10l2 5M4 11h16v6H4zM7 17v2M17 17v2M8 14h.01M16 14h.01" },
  {
    name: "Yard café",
    d: "M5 8h11v7a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4zM16 10h2a2 2 0 0 1 0 4h-2M4 21h14",
  },
  {
    name: "Step-free access",
    d: "M12 4a1.5 1.5 0 1 0 .01 0M11 7v6h5l3 5M11 13l-3 3M9 12a5 5 0 1 0 6 6",
  },
  { name: "Dogs on leads", d: "M4 10l4-4 4 3h5l3 3v3h-3l-2 5h-2l-1-4H8l-2 4H4z" },
  {
    name: "Toilets",
    d: "M8 4a2 2 0 1 0 .01 0M6 10h4v5H9v5H7v-5H6zM16 4a2 2 0 1 0 .01 0M14 10h4l1 5h-1v5h-4v-5h-1z",
  },
];

export default function Example() {
  const instanceId = useId();
  return (
    <Card
      render={
        <article
          className="card-with-badges"
          aria-labelledby={`${instanceId}-card-with-badges-title`}
        />
      }
    >
      <img
        className="media"
        src="https://picsum.photos/id/17/800/500"
        alt=""
        width="800"
        height="500"
      />
      <div className="head">
        <h3 id={`${instanceId}-card-with-badges-title`}>Hedgerow Nursery, Ludlow</h3>
        <ul className="tags" role="list" aria-label="Where and when">
          <li>
            <Badge.Root>
              <Badge.Text>Shropshire</Badge.Text>
            </Badge.Root>
          </li>
          <li>
            <Badge.Root>
              <Badge.Text>Open Tuesday to Saturday</Badge.Text>
            </Badge.Root>
          </li>
        </ul>
      </div>
      <p className="description">
        Four acres on the edge of Mortimer Forest: the seed house, two acres of stock beds, a walled
        garden that members can walk after closing, and a yard café that does a good bacon roll.
      </p>
      <p className="lead" id={`${instanceId}-card-with-badges-amenities`}>
        On site
      </p>
      <ul
        className="amenities"
        role="list"
        aria-labelledby={`${instanceId}-card-with-badges-amenities`}
      >
        {AMENITIES.map((amenity) => (
          <li key={amenity.name}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d={amenity.d} />
            </svg>
            {amenity.name}
          </li>
        ))}
      </ul>
      <div className="actions">
        <SignpostLink href="/visit">Plan a visit</SignpostLink>
      </div>
    </Card>
  );
}
