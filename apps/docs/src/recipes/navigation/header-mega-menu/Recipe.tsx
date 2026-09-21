"use client";

import type { ReactNode } from "react";
import { Nav, SignpostLink } from "@loamui/core";
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

interface Guide {
  href: string;
  title: string;
  text: string;
  glyph: ReactNode;
}

const GUIDES: Guide[] = [
  {
    href: "/growing/sowing-calendar",
    title: "Sowing calendar",
    text: "What to sow this month, by crop and by region.",
    glyph: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M3 10h18M8 3v4M16 3v4" />
      </>
    ),
  },
  {
    href: "/growing/seed-saving",
    title: "Seed saving",
    text: "Keep a variety going: isolation, harvest and storage.",
    glyph: <path d="M12 3c4 4 6 7 6 11a6 6 0 0 1-12 0c0-4 2-7 6-11z" />,
  },
  {
    href: "/growing/soil",
    title: "Soil and compost",
    text: "Feed the ground the plants grow in, and make your own.",
    glyph: (
      <>
        <path d="M3 9h18M3 13h18M3 17h18" />
        <path d="M12 3v6" />
      </>
    ),
  },
  {
    href: "/growing/pests",
    title: "Pests and diseases",
    text: "Spot trouble early and deal with it without a spray.",
    glyph: (
      <>
        <circle cx="12" cy="13" r="6" />
        <path d="M12 7V4M8 9 5 6M16 9l3-3M4 14h4M16 14h4M6 20l3-3M18 20l-3-3" />
      </>
    ),
  },
  {
    href: "/growing/plot-planning",
    title: "Plot planning",
    text: "Rotations, companions and what fits in a small space.",
    glyph: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 12h18M12 3v18" />
      </>
    ),
  },
  {
    href: "/growing/watering",
    title: "Watering",
    text: "How much, how often, and when to leave it alone.",
    glyph: (
      <>
        <path d="M12 3c3 4 5 6.5 5 9.5a5 5 0 0 1-10 0C7 9.5 9 7 12 3z" />
        <path d="M4 20h16" />
      </>
    ),
  },
];

export default function Recipe() {
  return (
    <header className="header-mega-menu">
      <a className="brand" href="/">
        <svg {...icon}>
          <path d="M5 19c0-7 4-13 14-14-1 10-7 14-14 14z" />
          <path d="M5 19c3-5 6-8 9-10" />
        </svg>
        Hedgerow
      </a>
      <Nav.Root aria-label="Primary">
        <Nav.List className="row">
          <Nav.Item>
            <Nav.Link href="/seeds" current>
              Seeds
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="/plants">Plants</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Dropdown>
              <Nav.DropdownTrigger>Growing</Nav.DropdownTrigger>
              <Nav.DropdownPanel>
                <Nav.List className="guides">
                  {GUIDES.map((guide) => (
                    <Nav.Item key={guide.href}>
                      <Nav.Link href={guide.href}>
                        <svg {...icon}>{guide.glyph}</svg>
                        <span className="text">
                          <strong>{guide.title}</strong>
                          <span>{guide.text}</span>
                        </span>
                      </Nav.Link>
                    </Nav.Item>
                  ))}
                </Nav.List>
                <div className="foot">
                  <p>
                    <strong>New to growing?</strong> The beginners&rsquo; course runs every spring
                    on the Lower Field plot.
                  </p>
                  <SignpostLink href="/courses/beginners">See the course</SignpostLink>
                </div>
              </Nav.DropdownPanel>
            </Nav.Dropdown>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="/events">Open days</Nav.Link>
          </Nav.Item>
        </Nav.List>
      </Nav.Root>
      <div className="actions">
        <a href="/sign-in">Sign in</a>
        <SignpostLink href="/membership/join">Join the co-op</SignpostLink>
      </div>
    </header>
  );
}
