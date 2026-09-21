"use client";

import { useId } from "react";
import { Card, Progress } from "@loamui/core";
import "./recipe.css";

export default function Recipe() {
  const instanceId = useId();
  return (
    <Card
      render={
        <article
          className="card-with-stats"
          aria-labelledby={`${instanceId}-card-with-stats-title`}
        />
      }
    >
      <img
        className="media"
        src="https://picsum.photos/id/112/800/450"
        alt=""
        width="800"
        height="450"
      />
      <h3 id={`${instanceId}-card-with-stats-title`}>Autumn seed-saving drive</h3>
      <p className="description">
        Members save seed from this year’s plots and send it in for next year’s catalogue. Every
        packet is grown out and germination-tested before it is listed.
      </p>
      <div className="goal">
        <Progress value={64} labels={{ value: (n) => `${n}% of the target` }}>
          Packets sent in
        </Progress>
        <p className="figures">
          <span className="count">1,280 packets</span>
          <span className="target">Target 2,000</span>
        </p>
      </div>
      <dl className="stats">
        <div>
          <dt>Growers taking part</dt>
          <dd>214</dd>
        </div>
        <div>
          <dt>Varieties saved</dt>
          <dd>96</dd>
        </div>
        <div>
          <dt>Days left</dt>
          <dd>83</dd>
        </div>
      </dl>
    </Card>
  );
}
