"use client";

import { useId } from "react";
import { Button } from "@loamui/core";
import "./recipe.css";

export default function Recipe() {
  const instanceId = useId();
  return (
    <section className="error-500" aria-labelledby={`${instanceId}-error-500-title`}>
      <svg
        className="illustration"
        viewBox="0 0 120 96"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M28 46h56l-6 40H34z" />
        <rect x="22" y="38" width="68" height="8" rx="2" />
        <path d="M58 46l4 10-5 9 6 11" />
        <path d="M72 38c0-10-2-18 8-24" />
        <path className="leaf" d="M80 14c8-6 16-3 14 6-6 3-11 1-14-6z" />
        <circle className="seed" cx="96" cy="84" r="2" />
        <circle className="seed" cx="104" cy="80" r="2" />
        <circle className="seed" cx="102" cy="88" r="2" />
      </svg>
      <p className="code">500</p>
      <h1 id={`${instanceId}-error-500-title`}>Something went wrong on our side</h1>
      <p className="description">
        The catalogue did not answer, and it is not anything you did. Nothing in your basket is
        lost. Try the page again; if it keeps happening, tell us and quote the time.
      </p>
      <div className="actions">
        <Button onClick={() => window.location.reload()}>Try again</Button>
        <a href="/contact">Tell us what happened</a>
      </div>
    </section>
  );
}
