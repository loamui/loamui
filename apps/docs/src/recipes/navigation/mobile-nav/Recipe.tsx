"use client";

import { Drawer, Nav } from "@loamui/core";
import "./recipe.css";

export default function Recipe() {
  return (
    <header className="mobile-nav">
      <a className="brand" href="/">
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
      <Drawer.Root>
        <Drawer.Trigger>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
          Menu
        </Drawer.Trigger>
        <Drawer.Popup side="start">
          <div className="top">
            <Drawer.Title>Hedgerow</Drawer.Title>
            <Drawer.Close>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
              <span className="loam-VisuallyHidden">Close menu</span>
            </Drawer.Close>
          </div>
          <Nav.Root aria-label="Primary">
            <Nav.List>
              <Nav.Item>
                <Nav.Link href="/seeds" current>
                  Seeds
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="/plants">Plants</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="/guides">Growing guides</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="/membership">Membership</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="/events">Open days</Nav.Link>
              </Nav.Item>
            </Nav.List>
          </Nav.Root>
        </Drawer.Popup>
      </Drawer.Root>
    </header>
  );
}
