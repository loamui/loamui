"use client";

import { useId } from "react";
import { Card, Progress } from "@loamui/core";
import "./recipe.css";

export default function Recipe() {
  const instanceId = useId();
  return (
    <Card
      render={
        <section
          className="stats-card-progress"
          aria-labelledby={`${instanceId}-stats-card-progress-title`}
        />
      }
    >
      <p className="lead">This week</p>
      <h3 id={`${instanceId}-stats-card-progress-title`}>Orders packed</h3>
      <p className="value">
        1,120 <span>of 1,600 orders</span>
      </p>
      <Progress value={70} size="lg" labels={{ value: (n) => `${n}% packed` }}>
        Packed so far
      </Progress>
      <p className="note">70% packed. 480 to go before Friday’s post.</p>
    </Card>
  );
}
