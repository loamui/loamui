"use client";

import { useId } from "react";
import { Badge } from "@loamui/core";
import "./recipe.css";

export default function Recipe() {
  const instanceId = useId();
  return (
    <section className="task-list" aria-labelledby={`${instanceId}-task-list-title`}>
      <h2 id={`${instanceId}-task-list-title`}>Join the co-op</h2>
      <p className="summary">You have completed 1 of 4 sections.</p>
      <ul role="list">
        <li>
          <a
            href="/join/details"
            className="title"
            aria-describedby={`${instanceId}-task-list-details-status`}
          >
            Your details
          </a>
          <div className="status complete" id={`${instanceId}-task-list-details-status`}>
            <Badge.Root>
              <Badge.Text>Completed</Badge.Text>
            </Badge.Root>
          </div>
        </li>
        <li>
          <a
            href="/join/plot"
            className="title"
            aria-describedby={`${instanceId}-task-list-plot-description ${instanceId}-task-list-plot-status`}
          >
            Choose a plot
          </a>
          <p className="description" id={`${instanceId}-task-list-plot-description`}>
            Pick a bed on one of the member fields, or join the waiting list for Ludlow.
          </p>
          <div className="status started" id={`${instanceId}-task-list-plot-status`}>
            <Badge.Root>
              <Badge.Text>In progress</Badge.Text>
            </Badge.Root>
          </div>
        </li>
        <li>
          <a
            href="/join/proof"
            className="title"
            aria-describedby={`${instanceId}-task-list-proof-description ${instanceId}-task-list-proof-status`}
          >
            Proof of address
          </a>
          <p className="description" id={`${instanceId}-task-list-proof-description`}>
            A council tax letter or a utility bill from the last three months.
          </p>
          <div className="status" id={`${instanceId}-task-list-proof-status`}>
            <Badge.Root>
              <Badge.Text>Not started</Badge.Text>
            </Badge.Root>
          </div>
        </li>
        <li>
          <span
            className="title"
            aria-describedby={`${instanceId}-task-list-fee-description ${instanceId}-task-list-fee-status`}
          >
            Pay the membership fee
          </span>
          <p className="description" id={`${instanceId}-task-list-fee-description`}>
            Available once every section above is complete.
          </p>
          <div className="status" id={`${instanceId}-task-list-fee-status`}>
            <Badge.Root>
              <Badge.Text>Cannot start yet</Badge.Text>
            </Badge.Root>
          </div>
        </li>
      </ul>
    </section>
  );
}
