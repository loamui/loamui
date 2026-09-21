"use client";

import { Avatar, Nav, Search } from "@loamui/core";
import "./recipe.css";

export default function Recipe() {
  return (
    <header className="header-with-search">
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
            <Nav.Link href="/guides">Guides</Nav.Link>
          </Nav.Item>
        </Nav.List>
      </Nav.Root>
      <Search.Root action="/search">
        <Search.Label>Search the catalogue</Search.Label>
        <Search.Input placeholder="Seeds, plants, guides" />
        <Search.Button>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <span className="loam-VisuallyHidden">Search</span>
        </Search.Button>
      </Search.Root>
      <a className="account" href="/account">
        <Avatar.Root aria-hidden>
          <Avatar.Image src="https://picsum.photos/id/823/96/96" alt="" />
          <Avatar.Fallback>IH</Avatar.Fallback>
        </Avatar.Root>
        <span className="loam-VisuallyHidden">Your account</span>
      </a>
    </header>
  );
}
