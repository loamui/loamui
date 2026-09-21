"use client";

import { Menu } from "@loamui/core";
import "./recipe.css";

const KINDS = [
  {
    href: "/new/sowing",
    name: "Sowing record",
    path: "M12 20V10M12 10c0-3 2.5-5 6-5-.3 3.2-2.7 5-6 5ZM12 13c0-3-2.5-5-6-5 .3 3.2 2.7 5 6 5Z",
  },
  {
    href: "/new/note",
    name: "Plot note",
    path: "M4 20h4l10-10-4-4L4 16v4ZM12.5 7.5l4 4",
  },
  {
    href: "/new/listing",
    name: "Seed listing",
    path: "M4 4h7l9 9-7 7-9-9V4ZM8 8h.01",
  },
  {
    href: "/new/swap",
    name: "Swap request",
    path: "M4 8h13l-3-3M20 16H7l3 3",
  },
];

export default function Recipe() {
  return (
    <Menu.Root className="button-with-menu">
      <Menu.Trigger>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
        Create new
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M4 6l4 4 4-4" />
        </svg>
      </Menu.Trigger>
      <Menu.Popup>
        {KINDS.map((kind) => (
          <Menu.Item key={kind.href} href={kind.href}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d={kind.path} />
            </svg>
            {kind.name}
          </Menu.Item>
        ))}
      </Menu.Popup>
    </Menu.Root>
  );
}
