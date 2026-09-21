"use client";

import { useId } from "react";
import { SignpostLink } from "@loamui/core";
import "./recipe.css";

export default function Recipe() {
  const instanceId = useId();
  return (
    <div className="section-header">
      <div className="inner">
        <p className="eyebrow">Growing guides</p>
        <h2 id={`${instanceId}-section-header-title`}>Learn to grow from seed</h2>
        <p className="description">
          Short guides on sowing, pricking out and hardening off, written by the growers who supply
          the packets.
        </p>
        <div className="actions">
          <SignpostLink href="/guides">All guides</SignpostLink>
        </div>
      </div>
    </div>
  );
}
