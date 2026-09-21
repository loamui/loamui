"use client";

import { useId } from "react";
import { Button, Card } from "@loamui/core";
import "./recipe.css";

// One stroked path per service, drawn on a 24-unit grid in currentColor.
const SERVICES = [
  {
    name: "Order seed",
    d: "M7 3h10a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM9 9h6M9 13h6",
  },
  {
    name: "Book a delivery",
    d: "M2 7h11v9H2zM13 10h4l3 3v3h-7M5 19a2 2 0 1 0 .01 0M18 19a2 2 0 1 0 .01 0",
  },
  { name: "Renew membership", d: "M3 6h18v12H3zM3 10h18M7 15h4" },
  { name: "Swap seed", d: "M4 8h13l-3-3M20 16H7l3 3" },
  { name: "Sowing calendar", d: "M4 5h16v15H4zM4 10h16M8 3v4M16 3v4" },
  { name: "Stock alerts", d: "M6 16v-5a6 6 0 0 1 12 0v5l2 2H4zM10 20h4" },
  { name: "Growers’ forum", d: "M4 5h16v11H9l-5 4z" },
  {
    name: "Gift vouchers",
    d: "M3 9h18v4H3zM5 13v8h14v-8M12 9v12M12 9c-3 0-5-1-5-3s3-2 5 3c2-5 5-5 5-3s-2 3-5 3",
  },
  {
    name: "Open days",
    d: "M12 4v2M12 18v2M4 12h2M18 12h2M6.3 6.3l1.4 1.4M16.3 16.3l1.4 1.4M6.3 17.7l1.4-1.4M16.3 7.7l1.4-1.4M12 8a4 4 0 1 0 .01 0",
  },
];

export default function Recipe() {
  const instanceId = useId();
  return (
    <Card
      render={
        <section
          className="card-actions-grid"
          aria-labelledby={`${instanceId}-card-actions-grid-title`}
        />
      }
    >
      <div className="inner">
        <div className="head">
          <h2 id={`${instanceId}-card-actions-grid-title`}>Services</h2>
          <a className="more" href="/services">
            And 12 more services
          </a>
        </div>
        <ul className="actions" role="list">
          {SERVICES.map((service) => (
            <li key={service.name}>
              <Button>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d={service.d} />
                </svg>
                {service.name}
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
