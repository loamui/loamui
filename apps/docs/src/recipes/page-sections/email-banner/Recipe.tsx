"use client";

import { useId } from "react";
import { Button, Field, Input } from "@loamui/core";
import "./recipe.css";

export default function Recipe() {
  const instanceId = useId();
  return (
    <section className="email-banner" aria-labelledby={`${instanceId}-email-banner-title`}>
      <div className="inner">
        <div className="text">
          <h2 id={`${instanceId}-email-banner-title`}>The sowing letter</h2>
          <p>
            What to sow this week, what is back on the bench, and one grower's note. Sent on Sundays
            from February to October, and never sold on.
          </p>
          <form action="/newsletter" method="post">
            <div className="grow">
              <Field.Root>
                <Field.Label>Email address</Field.Label>
                <Input name="email" type="email" autoComplete="email" inputMode="email" required />
              </Field.Root>
            </div>
            <span className="action">
              <Button type="submit">Subscribe</Button>
            </span>
          </form>
        </div>
        <svg
          className="illustration"
          viewBox="0 0 240 200"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path className="fill" d="M32 72 120 24l88 48v96H32Z" />
          <path d="M32 72l88 56 88-56" />
          <path d="M32 168l64-48M208 168l-64-48" />
          <path d="M120 128V88" />
          <path className="fill" d="M120 104c0-16 12-26 30-26 0 16-12 26-30 26Z" />
          <path className="fill" d="M120 116c0-12-9-20-22-20 0 12 9 20 22 20Z" />
        </svg>
      </div>
    </section>
  );
}
