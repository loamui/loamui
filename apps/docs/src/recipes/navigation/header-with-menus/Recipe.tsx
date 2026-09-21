"use client";

import { Nav, SignpostLink } from "@loamui/core";
import "./recipe.css";

export default function Recipe() {
  return (
    <header className="header-with-menus">
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
              <Nav.DropdownTrigger>Learn</Nav.DropdownTrigger>
              <Nav.DropdownPanel>
                <Nav.List>
                  <Nav.Item>
                    <Nav.Link href="/guides">Growing guides</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link href="/guides/sowing-calendar">Sowing calendar</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link href="/guides/seed-saving">Seed saving</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link href="/courses">Courses</Nav.Link>
                  </Nav.Item>
                </Nav.List>
              </Nav.DropdownPanel>
            </Nav.Dropdown>
          </Nav.Item>
          <Nav.Item>
            <Nav.Dropdown>
              <Nav.DropdownTrigger>Support</Nav.DropdownTrigger>
              <Nav.DropdownPanel>
                <Nav.List>
                  <Nav.Item>
                    <Nav.Link href="/help">Help centre</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link href="/help/delivery">Delivery and returns</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link href="/contact">Contact us</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link href="/accessibility">Accessibility</Nav.Link>
                  </Nav.Item>
                </Nav.List>
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
