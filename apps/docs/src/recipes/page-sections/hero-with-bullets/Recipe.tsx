"use client";

import { useId } from "react";
import { Button } from "@loamui/core";
import "./recipe.css";

const POINTS = [
  {
    title: "Open-pollinated, every packet",
    description: "Save seed from this year's crop and it comes true next year.",
  },
  {
    title: "Grown within twenty miles",
    description: "Selected on member plots in the same soil and weather you sow into.",
  },
  {
    title: "Germination printed on the packet",
    description: "Every batch is tested before it is listed, with the rate and the harvest year.",
  },
];

export default function Recipe() {
  const instanceId = useId();
  return (
    <section
      className="hero-with-bullets"
      aria-labelledby={`${instanceId}-hero-with-bullets-title`}
    >
      <div className="inner">
        <div className="text">
          <h1 id={`${instanceId}-hero-with-bullets-title`}>Seed that was grown here, for here.</h1>
          <p className="lede">
            Hedgerow is a nursery and seed co-op in the Shropshire hills. Everything in the
            catalogue was selected on a member plot, not bought in.
          </p>
          <ul className="points" role="list">
            {POINTS.map((point) => (
              <li key={point.title}>
                <span className="check">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m5 12 5 5 9-10" />
                  </svg>
                </span>
                <div>
                  <strong>{point.title}</strong>
                  <p>{point.description}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="actions">
            <Button>Start an order</Button>
          </div>
        </div>
        <img
          className="media"
          src="https://picsum.photos/id/90/900/1000"
          alt="Bamboo canes capped with jam jars along a raised bed at the nursery"
          width="900"
          height="1000"
        />
      </div>
    </section>
  );
}
