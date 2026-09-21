"use client";

import { Search } from "@loamui/core";
import "./recipe.css";

export default function Recipe() {
  return (
    <Search.Root className="inline-search-form" action="/search" aria-label="Search the catalogue">
      <Search.Label>Search the catalogue</Search.Label>
      <Search.Input placeholder="Seeds, plants, growers" autoComplete="off" />
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
  );
}
