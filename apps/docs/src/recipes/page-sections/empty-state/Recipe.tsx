import { Card, SignpostLink } from "@loamui/core";
import "./recipe.css";

export default function Recipe() {
  return (
    <Card render={<div className="empty-state" />}>
      <svg
        viewBox="0 0 64 64"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M16 14h32v38H16Z" />
        <path d="m16 14 16 10 16-10" />
        <path d="M32 46V32" />
        <path d="M32 36c0-4 3-7 8-7 0 4-3 7-8 7Z" />
        <path d="M32 40c0-3-2.5-5-6-5 0 3 2.5 5 6 5Z" />
      </svg>
      <h2>No orders yet</h2>
      <p>
        When you place an order it appears here, with its progress from the packing bench to your
        door and the growing guide for everything in it.
      </p>
      <div className="actions">
        <SignpostLink href="/catalogue">Browse the catalogue</SignpostLink>
      </div>
    </Card>
  );
}
