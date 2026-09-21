"use client";

import { useId } from "react";
import { SignpostLink } from "@loamui/core";
import "./recipe.css";

export default function Recipe() {
  const instanceId = useId();
  return (
    <section className="error-404" aria-labelledby={`${instanceId}-error-404-title`}>
      <p className="code">404</p>
      <h1 id={`${instanceId}-error-404-title`}>Page not found</h1>
      <p className="description">
        The page may have moved when the catalogue was reorganised, or the address may have a typo.
        Check the address, or start again from the home page.
      </p>
      <div className="actions">
        <SignpostLink href="/">Back to the home page</SignpostLink>
        <a href="/catalogue">Browse the catalogue</a>
      </div>
    </section>
  );
}
