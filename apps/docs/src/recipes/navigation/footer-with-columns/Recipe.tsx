"use client";

import { useId } from "react";
import "./recipe.css";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { label: "Seeds", href: "/seeds" },
      { label: "Plants", href: "/plants" },
      { label: "Tools", href: "/tools" },
      { label: "Gift vouchers", href: "/vouchers" },
    ],
  },
  {
    title: "Grow",
    links: [
      { label: "Growing guides", href: "/guides" },
      { label: "Sowing calendar", href: "/calendar" },
      { label: "Seed saving", href: "/guides/seed-saving" },
      { label: "Open days", href: "/events" },
    ],
  },
  {
    title: "Co-op",
    links: [
      { label: "Membership", href: "/membership" },
      { label: "Our growers", href: "/growers" },
      { label: "Trade orders", href: "/trade" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export default function Recipe() {
  const instanceId = useId();
  return (
    <footer className="footer-with-columns">
      <div className="brand">
        <a href="/">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 19c0-7 4-13 14-14-1 10-7 14-14 14z" />
            <path d="M5 19c3-5 6-8 9-10" />
          </svg>
          Hedgerow
        </a>
        <p>
          A garden nursery and seed co-op in the Welsh Marches. Open-pollinated seed, grown on
          member plots and packed by hand.
        </p>
      </div>
      <div className="columns">
        {COLUMNS.map((column) => {
          const id = `${instanceId}-footer-${column.title.toLowerCase()}`;
          return (
            <nav key={column.title} aria-labelledby={id}>
              <h3 id={id}>{column.title}</h3>
              <ul>
                {column.links.map((link) => (
                  <li key={link.href}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </nav>
          );
        })}
      </div>
      <div className="bottom">
        <small>&copy; 2026 Hedgerow Seed Co-operative Ltd. Registered society 8841.</small>
        <nav aria-label="Legal">
          <ul>
            <li>
              <a href="/privacy">Privacy</a>
            </li>
            <li>
              <a href="/terms">Terms</a>
            </li>
            <li>
              <a href="/accessibility">Accessibility</a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
