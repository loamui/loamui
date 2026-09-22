import type { Metadata } from "next";
import Link from "next/link";
import { SignpostLink } from "@loamui/core";
import "./not-found.css";

export const metadata: Metadata = {
  title: "Page not found",
  description: "There is no page at this address.",
};

export default function NotFound() {
  return (
    <section className="container site-NotFound" data-no-hyphens>
      <p className="eyebrow">404</p>
      <h1>There is no page at this address.</h1>
      <p className="lead">
        The link may be out of date, or the address mistyped. The documentation starts at the
        introduction, and every component and example is listed in the search (⌘K or Ctrl+K).
      </p>
      <div className="actions">
        <SignpostLink render={<Link href="/docs" />}>Read the docs</SignpostLink>
        <Link href="/recipes" className="plainLink">
          Browse the recipes
        </Link>
      </div>
    </section>
  );
}
