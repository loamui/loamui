"use client";

import { useId } from "react";
import { Card, Price } from "@loamui/core";
import "./recipe.css";

export default function Recipe() {
  const instanceId = useId();
  return (
    <Card
      render={
        <section className="grouped-stats" aria-labelledby={`${instanceId}-grouped-stats-title`} />
      }
    >
      <h2 id={`${instanceId}-grouped-stats-title`}>Open day, 5 September</h2>
      <dl className="groups">
        <div className="group">
          <dt>Visitors</dt>
          <dd className="value">1,840</dd>
          <dd className="sentence">Through the gate between nine and four.</dd>
          <dd className="compare">Up 22% on last year’s open day.</dd>
        </div>
        <div className="group">
          <dt>Plant sales</dt>
          <dd className="value">
            <Price value={6320} currency="GBP" locale="en-GB" />
          </dd>
          <dd className="sentence">Perennials, herbs and plugs off the nursery bench.</dd>
          <dd className="compare">Up 15% on last year.</dd>
        </div>
        <div className="group">
          <dt>New members</dt>
          <dd className="value">38</dd>
          <dd className="sentence">Signed up at the table by the gate.</dd>
          <dd className="compare">Three fewer than last year.</dd>
        </div>
      </dl>
    </Card>
  );
}
