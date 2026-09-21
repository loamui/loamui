"use client";

import { Nav } from "@loamui/core";
import "./recipe.css";

export default function Recipe() {
  return (
    <div className="side-nav-with-groups">
      <Nav.Root>
        <Nav.Title>Hedgerow admin</Nav.Title>
        <Nav.List>
          <Nav.Item>
            <Nav.Link href="/admin">
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
              Dashboard
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Group>
              <Nav.GroupTitle>
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
                Catalogue
              </Nav.GroupTitle>
              <Nav.List>
                <Nav.Item>
                  <Nav.Link href="/admin/catalogue/seeds">Seeds</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link href="/admin/catalogue/plants">Plants</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link href="/admin/catalogue/tools">Tools and sundries</Nav.Link>
                </Nav.Item>
              </Nav.List>
            </Nav.Group>
          </Nav.Item>
          <Nav.Item>
            <Nav.Group defaultOpen>
              <Nav.GroupTitle>
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
              </Nav.GroupTitle>
              <Nav.List>
                <Nav.Item>
                  <Nav.Link href="/admin/orders/new">New orders</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link href="/admin/orders/packing" current>
                    Packing
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link href="/admin/orders/dispatched">Dispatched</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link href="/admin/orders/returns">Returns</Nav.Link>
                </Nav.Item>
              </Nav.List>
            </Nav.Group>
          </Nav.Item>
          <Nav.Item>
            <Nav.Group>
              <Nav.GroupTitle>
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
                Members
              </Nav.GroupTitle>
              <Nav.List>
                <Nav.Item>
                  <Nav.Link href="/admin/members">Directory</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link href="/admin/members/applications">Applications</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link href="/admin/members/renewals">Renewals</Nav.Link>
                </Nav.Item>
              </Nav.List>
            </Nav.Group>
          </Nav.Item>
          <Nav.Item>
            <Nav.Group>
              <Nav.GroupTitle>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M4 7h10M18 7h2M4 12h2M10 12h10M4 17h10M18 17h2" />
                  <circle cx="16" cy="7" r="2" />
                  <circle cx="8" cy="12" r="2" />
                  <circle cx="16" cy="17" r="2" />
                </svg>
                Settings
              </Nav.GroupTitle>
              <Nav.List>
                <Nav.Item>
                  <Nav.Link href="/admin/settings/team">Team</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link href="/admin/settings/notifications">Notifications</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link href="/admin/settings/delivery">Delivery</Nav.Link>
                </Nav.Item>
              </Nav.List>
            </Nav.Group>
          </Nav.Item>
        </Nav.List>
      </Nav.Root>
    </div>
  );
}
