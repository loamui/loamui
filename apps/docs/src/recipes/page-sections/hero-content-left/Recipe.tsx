"use client";

import { useId } from "react";
import { Button, SignpostLink } from "@loamui/core";
import "./recipe.css";

export default function Recipe() {
  const instanceId = useId();
  return (
    <section
      className="hero-content-left"
      aria-labelledby={`${instanceId}-hero-content-left-title`}
    >
      <div className="inner">
        <div className="text">
          <h1 id={`${instanceId}-hero-content-left-title`}>Grow a variety you can keep.</h1>
          <p className="lede">
            Every packet from Hedgerow is open-pollinated and comes true from saved seed, so the
            beans you sow this spring are the beans your children sow. Members pick twelve packets a
            year and swap the rest at the bench.
          </p>
          <div className="actions">
            <Button>Join the co-op</Button>
            <SignpostLink href="/how-it-works">How membership works</SignpostLink>
          </div>
        </div>
        <svg
          className="illustration"
          viewBox="0 0 320 240"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle className="fill" cx="252" cy="64" r="28" />
          <path d="M252 20v8M252 100v8M208 64h8M288 64h8M221 33l6 6M277 89l6 6M283 33l-6 6M227 89l-6 6" />
          <path d="M20 196h280" />
          <path className="fill" d="M102 128h116l-10 76H112Z" />
          <rect className="fill" x="94" y="114" width="132" height="16" rx="4" />
          <path d="M160 114V64" />
          <path className="fill" d="M160 96c0-22 16-36 40-36 0 22-16 36-40 36Z" />
          <path className="fill" d="M160 110c0-16-12-28-32-28 0 16 12 28 32 28Z" />
          <path d="M40 196c0-10 8-18 18-18M62 196c0-6 5-11 11-11M270 196c0-8-6-14-14-14" />
        </svg>
      </div>
    </section>
  );
}
