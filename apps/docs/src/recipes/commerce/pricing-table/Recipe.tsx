"use client";

import { useId } from "react";
import { Badge, Button, Card, Price } from "@loamui/core";
import "./recipe.css";

export default function Recipe() {
  const instanceId = useId();
  return (
    <ul className="pricing-table" role="list" aria-label="Membership plans">
      <li>
        <Card
          render={
            <article className="plan" aria-labelledby={`${instanceId}-pricing-table-seedling`} />
          }
        >
          <p className="eyebrow">
            <Badge.Root>
              <Badge.Text>Starter</Badge.Text>
            </Badge.Root>
          </p>
          <h3 id={`${instanceId}-pricing-table-seedling`}>Seedling</h3>
          <p className="description">For a windowsill, a balcony or a first raised bed.</p>
          <p className="price">
            <Price value={24} currency="GBP">
              a year
            </Price>
          </p>
          <ul className="features" role="list">
            <li className="feature">Six packets a year from the catalogue</li>
            <li className="feature">Sowing calendar and growing guides</li>
            <li className="exclusion">
              <span className="loam-VisuallyHidden">Not included: </span>
              <s>The seed-swap table at every open day</s>
            </li>
            <li className="exclusion">
              <span className="loam-VisuallyHidden">Not included: </span>
              <s>A bed on a member field</s>
            </li>
          </ul>
          <div className="actions">
            <Button>Choose Seedling</Button>
          </div>
        </Card>
      </li>
      <li className="recommended">
        <Card
          render={
            <article className="plan" aria-labelledby={`${instanceId}-pricing-table-grower`} />
          }
        >
          <p className="eyebrow">
            <Badge.Root>
              <Badge.Text>Most popular</Badge.Text>
            </Badge.Root>
          </p>
          <h3 id={`${instanceId}-pricing-table-grower`}>Grower</h3>
          <p className="description">For a household that sows most of what it eats.</p>
          <p className="price">
            <Price value={48} currency="GBP">
              a year
            </Price>
          </p>
          <ul className="features" role="list">
            <li className="feature">Twelve packets a year from the catalogue</li>
            <li className="feature">Sowing calendar and growing guides</li>
            <li className="feature">The seed-swap table at every open day</li>
            <li className="exclusion">
              <span className="loam-VisuallyHidden">Not included: </span>
              <s>A bed on a member field</s>
            </li>
          </ul>
          <div className="actions">
            <Button>Choose Grower</Button>
          </div>
        </Card>
      </li>
      <li>
        <Card
          render={
            <article className="plan" aria-labelledby={`${instanceId}-pricing-table-plot-holder`} />
          }
        >
          <p className="eyebrow">
            <Badge.Root>
              <Badge.Text>With a bed</Badge.Text>
            </Badge.Root>
          </p>
          <h3 id={`${instanceId}-pricing-table-plot-holder`}>Plot-holder</h3>
          <p className="description">For a grower who wants ground of their own.</p>
          <p className="price">
            <Price value={120} currency="GBP">
              a year
            </Price>
          </p>
          <ul className="features" role="list">
            <li className="feature">Twenty-four packets a year from the catalogue</li>
            <li className="feature">Sowing calendar and growing guides</li>
            <li className="feature">The seed-swap table at every open day</li>
            <li className="feature">A ten square metre bed on a member field</li>
          </ul>
          <div className="actions">
            <Button>Choose Plot-holder</Button>
          </div>
        </Card>
      </li>
    </ul>
  );
}
