"use client";

import type { ReactNode } from "react";
import { Nav, Tooltip } from "@loamui/core";
import "./recipe.css";

const icon = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

interface RailLink {
  href: string;
  label: string;
  current?: boolean;
  glyph: ReactNode;
}

const LINKS: RailLink[] = [
  {
    href: "/nursery",
    label: "Overview",
    glyph: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),
  },
  {
    href: "/nursery/orders",
    label: "Orders",
    current: true,
    glyph: (
      <>
        <path d="m3 8 9-5 9 5v8l-9 5-9-5z" />
        <path d="m3 8 9 5 9-5M12 13v8" />
      </>
    ),
  },
  {
    href: "/nursery/stock",
    label: "Stock",
    glyph: (
      <>
        <path d="M12 21v-8" />
        <path d="M12 13c0-4 3-7 8-7-1 5-4 7-8 7z" />
        <path d="M12 13c0-3-2-5-6-5 1 4 3 5 6 5z" />
      </>
    ),
  },
  {
    href: "/nursery/growers",
    label: "Growers",
    glyph: (
      <>
        <circle cx="9" cy="8" r="3.5" />
        <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
        <path d="M16 4.5a3.5 3.5 0 0 1 0 7M21.5 20a6.5 6.5 0 0 0-4.5-6.2" />
      </>
    ),
  },
  {
    href: "/nursery/open-days",
    label: "Open days",
    glyph: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M3 10h18M8 3v4M16 3v4" />
      </>
    ),
  },
  {
    href: "/nursery/settings",
    label: "Settings",
    glyph: (
      <>
        <path d="M4 7h10M18 7h2M4 12h2M10 12h10M4 17h10M18 17h2" />
        <circle cx="16" cy="7" r="2" />
        <circle cx="8" cy="12" r="2" />
        <circle cx="16" cy="17" r="2" />
      </>
    ),
  },
];

export default function Recipe() {
  return (
    <div className="side-nav-rail">
      <a className="brand" href="/">
        <svg {...icon}>
          <path d="M5 19c0-7 4-13 14-14-1 10-7 14-14 14z" />
          <path d="M5 19c3-5 6-8 9-10" />
        </svg>
        <span className="loam-VisuallyHidden">Hedgerow</span>
      </a>
      <Tooltip.Provider>
        <Nav.Root aria-label="Nursery">
          <Nav.List>
            {LINKS.map((link) => (
              <Nav.Item key={link.href}>
                <Tooltip.Root>
                  <Tooltip.Trigger render={<Nav.Link href={link.href} current={link.current} />}>
                    <svg {...icon}>{link.glyph}</svg>
                    <span className="loam-VisuallyHidden">{link.label}</span>
                  </Tooltip.Trigger>
                  <Tooltip.Popup side="right">
                    {link.label}
                    <Tooltip.Arrow />
                  </Tooltip.Popup>
                </Tooltip.Root>
              </Nav.Item>
            ))}
          </Nav.List>
        </Nav.Root>
      </Tooltip.Provider>
    </div>
  );
}
