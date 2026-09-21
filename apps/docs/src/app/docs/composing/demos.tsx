"use client";

import type { CSSProperties } from "react";
import { Badge, Button, Card, Price, SignpostLink } from "@loamui/core";
import "./composing.css";

/** A hero: element styles for the type, a scoped rule for the box, two LoamUI parts. */
export function HeroDemo() {
  return (
    <section className="demo-hero">
      <div style={{ "--loam-context": "primary" } as CSSProperties}>
        <Badge.Root>
          <Badge.Text>New</Badge.Text>
        </Badge.Root>
      </div>
      <h2>Modern UI primitives for agent-assisted developers.</h2>
      <p className="description">
        Three primitives your agent builds from, steeped in UX best practice and checked by
        deterministic gates.
      </p>
      <div className="actions">
        <SignpostLink href="/docs">Get started</SignpostLink>
        <a href="https://github.com/loamui/loamui">Star on GitHub</a>
      </div>
    </section>
  );
}

/** A pricing card: Card is the surface, a scoped rule adds the anatomy, context marks the plan. */
export function PlanDemo() {
  return (
    <Card className="demo-plan" style={{ "--loam-context": "primary" } as CSSProperties}>
      <h3>
        Team{" "}
        <Badge.Root>
          <Badge.Text>Most popular</Badge.Text>
        </Badge.Root>
      </h3>
      <p className="price">
        <Price value={24} currency="GBP">
          per seat, per month
        </Price>
      </p>
      <ul>
        <li>Unlimited projects</li>
        <li>Shared component library</li>
        <li>Priority support</li>
      </ul>
      <Button>Choose Team</Button>
    </Card>
  );
}
