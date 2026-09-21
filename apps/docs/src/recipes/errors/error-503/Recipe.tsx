"use client";

import { useId } from "react";
import { Button } from "@loamui/core";
import "./recipe.css";

export default function Recipe() {
  const instanceId = useId();
  return (
    <section className="error-503" aria-labelledby={`${instanceId}-error-503-title`}>
      <p className="code">503</p>
      <h1 id={`${instanceId}-error-503-title`}>All our servers are busy</h1>
      <p className="description">
        More people are ordering seed than the shop can serve at once. Your basket is safe where it
        is: wait a minute, then refresh the page.
      </p>
      <div className="actions">
        <Button onClick={() => window.location.reload()}>Refresh the page</Button>
      </div>
    </section>
  );
}
