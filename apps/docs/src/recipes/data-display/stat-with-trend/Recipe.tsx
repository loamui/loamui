"use client";

import { useId } from "react";
import { Badge, Card } from "@loamui/core";
import "./recipe.css";

export default function Recipe() {
  const instanceId = useId();
  return (
    <Card render={<dl className="stat-with-trend" />}>
      <dt>Orders posted this week</dt>
      <dd className="value">3,904</dd>
      <dd className="trend">
        <Badge.Root>
          {" "}
          <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M3 11l5-5 5 5" />
          </svg>
          <Badge.Text>Up 18% on last week</Badge.Text>
        </Badge.Root>
        <svg
          className="sparkline"
          viewBox="0 0 80 24"
          preserveAspectRatio="none"
          role="img"
          aria-labelledby={`${instanceId}-stat-with-trend-sparkline`}
        >
          <title id={`${instanceId}-stat-with-trend-sparkline`}>
            Orders per week over the last eight weeks: 2,610, 2,780, 2,690, 2,950, 3,120, 3,080,
            3,310 and 3,904. Rising.
          </title>
          <polyline
            points="1,20 12,17 23,18 34,14 45,11 57,12 68,8 79,3"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </dd>
    </Card>
  );
}
