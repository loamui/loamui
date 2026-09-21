"use client";

import { useId } from "react";
import { Badge, SignpostLink } from "@loamui/core";
import "./recipe.css";

export default function Recipe() {
  const instanceId = useId();
  return (
    <section className="hero-centered" aria-labelledby={`${instanceId}-hero-centered-title`}>
      <p className="eyebrow">
        <Badge.Root>
          <Badge.Text>Membership</Badge.Text>
        </Badge.Root>
        <span>From £3 a month</span>
      </p>
      <h1 id={`${instanceId}-hero-centered-title`}>Join the co-op that grows its own seed.</h1>
      <p className="lede">
        Members get first pick of every catalogue, a share of the seed we save each autumn and a
        vote on what the nursery grows next year.
      </p>
      <div className="actions">
        <SignpostLink href="/membership/join">Become a member</SignpostLink>
        <a href="/membership#tiers">Compare the tiers</a>
      </div>
    </section>
  );
}
