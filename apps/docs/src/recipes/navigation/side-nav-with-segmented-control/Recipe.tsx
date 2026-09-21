"use client";

import { useState } from "react";
import { Nav, SegmentedControl } from "@loamui/core";
import "./recipe.css";

export default function Recipe() {
  const [section, setSection] = useState("account");
  return (
    <div className="side-nav-with-segmented-control">
      <SegmentedControl.Root name="section" value={section} onValueChange={setSection}>
        <SegmentedControl.Legend className="loam-VisuallyHidden">Section</SegmentedControl.Legend>
        <SegmentedControl.Item value="account">Account</SegmentedControl.Item>
        <SegmentedControl.Item value="shop">Shop</SegmentedControl.Item>
      </SegmentedControl.Root>
      {/* hidden sits on the example's own element: Nav gives its lists a
          display of their own, which would defeat the attribute there. */}
      <div hidden={section !== "account"}>
        <Nav.Root aria-label="Account">
          <Nav.List>
            <Nav.Item>
              <Nav.Link href="/account" current>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21a8 8 0 0 1 16 0" />
                </svg>
                Profile
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="/account/membership">
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
                  <path d="M7 15h4M7 11h10" />
                </svg>
                Membership
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="/account/orders">
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
                Orders
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="/account/addresses">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 22s7-6 7-12a7 7 0 0 0-14 0c0 6 7 12 7 12z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
                Addresses
              </Nav.Link>
            </Nav.Item>
          </Nav.List>
        </Nav.Root>
      </div>
      <div hidden={section !== "shop"}>
        <Nav.Root aria-label="Shop">
          <Nav.List>
            <Nav.Item>
              <Nav.Link href="/shop/listings">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M3 12V4h8l10 10-8 8z" />
                  <circle cx="7.5" cy="8.5" r="1.5" />
                </svg>
                Listings
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="/shop/stock">
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
                Stock
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="/shop/pricing">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M8 19h9" />
                  <path d="M7 12h6" />
                  <path d="M16 5a4 4 0 0 0-7 3v11" />
                </svg>
                Pricing
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="/shop/delivery">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M3 6h11v10H3zM14 10h4l3 3v3h-7z" />
                  <circle cx="7" cy="18" r="2" />
                  <circle cx="17" cy="18" r="2" />
                </svg>
                Delivery
              </Nav.Link>
            </Nav.Item>
          </Nav.List>
        </Nav.Root>
      </div>
    </div>
  );
}
