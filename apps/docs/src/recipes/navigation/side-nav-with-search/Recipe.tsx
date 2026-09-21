"use client";

import { Avatar, Badge, Nav, Search } from "@loamui/core";
import "./recipe.css";

export default function Recipe() {
  return (
    <div className="side-nav-with-search">
      <Search.Root action="/nursery/search">
        <Search.Label>Search the nursery</Search.Label>
        <Search.Input placeholder="Orders, growers, varieties" />
      </Search.Root>
      <Nav.Root>
        <Nav.Title>Nursery</Nav.Title>
        <Nav.List>
          <Nav.Item>
            <Nav.Link href="/nursery">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
              <span className="label">Overview</span>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="/nursery/orders" current>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m3 8 9-5 9 5v8l-9 5-9-5z" />
                <path d="m3 8 9 5 9-5M12 13v8" />
              </svg>
              <span className="label">Orders</span>
              <Badge.Root>
                {" "}
                <Badge.Text>
                  12<span className="loam-VisuallyHidden"> to pack</span>
                </Badge.Text>
              </Badge.Root>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="/nursery/messages">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" />
              </svg>
              <span className="label">Messages</span>
              <Badge.Root>
                {" "}
                <Badge.Text>
                  3<span className="loam-VisuallyHidden"> unread</span>
                </Badge.Text>
              </Badge.Root>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="/nursery/stock">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 21v-8" />
                <path d="M12 13c0-4 3-7 8-7-1 5-4 7-8 7z" />
                <path d="M12 13c0-3-2-5-6-5 1 4 3 5 6 5z" />
              </svg>
              <span className="label">Stock</span>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="/nursery/growers">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="9" cy="8" r="3.5" />
                <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
                <path d="M16 4.5a3.5 3.5 0 0 1 0 7M21.5 20a6.5 6.5 0 0 0-4.5-6.2" />
              </svg>
              <span className="label">Growers</span>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="/nursery/open-days">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="5" width="18" height="16" rx="2" />
                <path d="M3 10h18M8 3v4M16 3v4" />
              </svg>
              <span className="label">Open days</span>
            </Nav.Link>
          </Nav.Item>
        </Nav.List>
      </Nav.Root>
      <a className="account" href="/account">
        <Avatar.Root aria-hidden>
          <Avatar.Image src="https://picsum.photos/id/823/96/96" alt="" />
          <Avatar.Fallback>IH</Avatar.Fallback>
        </Avatar.Root>
        <span className="text">
          <strong>Imogen Hartley</strong>
          <span className="email">imogen@hedgerow.example</span>
        </span>
      </a>
    </div>
  );
}
