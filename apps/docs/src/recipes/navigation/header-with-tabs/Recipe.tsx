"use client";

import { Avatar, Menu, Nav } from "@loamui/core";
import "./recipe.css";

export default function Recipe() {
  return (
    <header className="header-with-tabs">
      <div className="top">
        <a className="brand" href="/">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M5 19c0-7 4-13 14-14-1 10-7 14-14 14z" />
            <path d="M5 19c3-5 6-8 9-10" />
          </svg>
          Hedgerow
        </a>
        <Menu.Root>
          <Menu.Trigger>
            <Avatar.Root aria-hidden>
              <Avatar.Image src="https://picsum.photos/id/823/96/96" alt="" />
              <Avatar.Fallback>IH</Avatar.Fallback>
            </Avatar.Root>
            <span className="loam-VisuallyHidden">Account menu for </span>
            <span className="name">Imogen Hartley</span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </Menu.Trigger>
          <Menu.Popup>
            <Menu.Item href="/plot">Your plot</Menu.Item>
            <Menu.Item href="/orders">Orders</Menu.Item>
            <Menu.Item href="/settings">Settings</Menu.Item>
            <Menu.Separator />
            <form method="post" action="/sign-out">
              <Menu.Item render={<button type="submit">Sign out</button>} />
            </form>
          </Menu.Popup>
        </Menu.Root>
      </div>
      <Nav.Root aria-label="Nursery">
        <Nav.List className="tabs">
          <Nav.Item>
            <Nav.Link href="/nursery">Overview</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="/nursery/orders" current>
              Orders
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="/nursery/stock">Stock</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="/nursery/growers">Growers</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="/nursery/open-days">Open days</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="/nursery/settings">Settings</Nav.Link>
          </Nav.Item>
        </Nav.List>
      </Nav.Root>
    </header>
  );
}
