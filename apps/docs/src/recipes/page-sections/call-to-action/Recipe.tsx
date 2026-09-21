"use client";

import { useId } from "react";
import { SignpostLink } from "@loamui/core";
import "./recipe.css";

export default function Recipe() {
  const instanceId = useId();
  return (
    <section className="call-to-action" aria-labelledby={`${instanceId}-call-to-action-title`}>
      <h2 id={`${instanceId}-call-to-action-title`}>Ready to sow?</h2>
      <p className="lede">
        Order by Thursday and your packets are posted the same week, with a growing guide in every
        envelope.
      </p>
      <div className="actions">
        <SignpostLink href="/catalogue">Browse the catalogue</SignpostLink>
        <a href="/calendar">What to sow this month</a>
      </div>
    </section>
  );
}
