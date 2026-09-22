"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import { Menu, Nav, useScrollSpy } from "@loamui/core";
import Link from "next/link";
import { IconLayoutGrid, IconFolder, IconUsers, IconChevronDown } from "@tabler/icons-react";

const rail: CSSProperties = { inlineSize: "100%", maxInlineSize: "16rem" };

function DashboardIcon() {
  return <IconLayoutGrid aria-hidden />;
}

function FolderIcon() {
  return <IconFolder aria-hidden />;
}

function PeopleIcon() {
  return <IconUsers aria-hidden />;
}

export function NavBasicDemo() {
  return (
    <div style={rail}>
      <Nav.Root>
        <Nav.Title>Workspace</Nav.Title>
        <Nav.List>
          <Nav.Item>
            <Nav.Link href="#dashboard">
              <DashboardIcon />
              Dashboard
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="#projects" current>
              <FolderIcon />
              Projects
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="#team">
              <PeopleIcon />
              Team
            </Nav.Link>
          </Nav.Item>
        </Nav.List>
      </Nav.Root>
    </div>
  );
}

export function NavNestedDemo() {
  return (
    <div style={rail}>
      <Nav.Root>
        <Nav.Title>Guides</Nav.Title>
        <Nav.List>
          <Nav.Item>
            <Nav.Link href="#tokens">Tokens</Nav.Link>
            <Nav.List>
              <Nav.Item>
                <Nav.Link href="#colour">Colour</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="#type" current>
                  Type
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="#space">Space</Nav.Link>
              </Nav.Item>
            </Nav.List>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="#elements">Element styles</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="#components">Components</Nav.Link>
          </Nav.Item>
        </Nav.List>
      </Nav.Root>
    </div>
  );
}

export function NavGroupedDemo() {
  const [open, setOpen] = useState("reports");
  return (
    <div style={rail}>
      <Nav.Root>
        <Nav.List>
          <Nav.Item>
            <Nav.Link href="#dashboard">Dashboard</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Group
              open={open === "reports"}
              onOpenChange={(o: boolean) => setOpen(o ? "reports" : "")}
            >
              <Nav.GroupTitle>Reports</Nav.GroupTitle>
              <Nav.List>
                <Nav.Item>
                  <Nav.Link href="#weekly" current>
                    Weekly
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link href="#monthly">Monthly</Nav.Link>
                </Nav.Item>
              </Nav.List>
            </Nav.Group>
          </Nav.Item>
          <Nav.Item>
            <Nav.Group
              open={open === "settings"}
              onOpenChange={(o: boolean) => setOpen(o ? "settings" : "")}
            >
              <Nav.GroupTitle>Settings</Nav.GroupTitle>
              <Nav.List>
                <Nav.Item>
                  <Nav.Link href="#profile">Profile</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link href="#billing">Billing</Nav.Link>
                </Nav.Item>
              </Nav.List>
            </Nav.Group>
          </Nav.Item>
        </Nav.List>
      </Nav.Root>
    </div>
  );
}

export function NavRenderDemo() {
  return (
    <div style={rail}>
      <Nav.Root labels={{ navigation: "Dokumentation" }}>
        <Nav.List>
          <Nav.Item>
            <Nav.Link render={<Link href="/docs/components/breadcrumbs" />}>Breadcrumbs</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link render={<Link href="/docs/components/nav" />} current>
              Nav
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link render={<Link href="/docs/components/pagination" />}>Pagination</Nav.Link>
          </Nav.Item>
        </Nav.List>
      </Nav.Root>
    </div>
  );
}

export function NavSectionsDemo() {
  return (
    <div style={rail}>
      <Nav.Root>
        <Nav.Title>Workspace</Nav.Title>
        <Nav.List>
          <Nav.Item>
            <Nav.Link href="#dashboard" current>
              Dashboard
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="#projects">Projects</Nav.Link>
          </Nav.Item>
        </Nav.List>
      </Nav.Root>
      <Nav.Root>
        <Nav.Title>Account</Nav.Title>
        <Nav.List>
          <Nav.Item>
            <Nav.Link href="#profile">Profile</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="#billing">Billing</Nav.Link>
          </Nav.Item>
        </Nav.List>
      </Nav.Root>
    </div>
  );
}

/**
 * A horizontal nav is the consumer's flex row on the List, with the marker
 * moved under the link. The page's own stylesheet would carry these; here
 * they are inline so the demo is self-contained.
 */
export function NavInlineDemo() {
  return (
    <Nav.Root aria-label="Site" style={{ "--loam-nav-current-edge": "block-end" } as CSSProperties}>
      <Nav.List style={{ display: "flex", flexWrap: "wrap", gap: "var(--loam-space-3xs)" }}>
        <Nav.Item>
          <Nav.Link href="#docs" current>
            Docs
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="#pricing">Pricing</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="#blog">Blog</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="#about">About</Nav.Link>
        </Nav.Item>
      </Nav.List>
    </Nav.Root>
  );
}

function Chevron() {
  return <IconChevronDown aria-hidden />;
}

const row: CSSProperties = { display: "flex", flexWrap: "wrap", gap: "var(--loam-space-3xs)" };

/**
 * A header with two dropdowns of links: a column of them, and a wide panel
 * with a grid of two columns inside. The page's own stylesheet would carry
 * the row and the grid; here they are inline so the demo is self-contained.
 */
export function NavDropdownDemo() {
  return (
    <Nav.Root aria-label="Site" style={{ "--loam-nav-current-edge": "block-end" } as CSSProperties}>
      <Nav.List style={row}>
        <Nav.Item>
          <Nav.Link href="#seeds">Seeds</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Dropdown>
            <Nav.DropdownTrigger>Plants</Nav.DropdownTrigger>
            <Nav.DropdownPanel>
              <Nav.List>
                <Nav.Item>
                  <Nav.Link href="#vegetables" current>
                    Vegetables
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link href="#herbs">Herbs</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link href="#flowers">Flowers</Nav.Link>
                </Nav.Item>
              </Nav.List>
            </Nav.DropdownPanel>
          </Nav.Dropdown>
        </Nav.Item>
        <Nav.Item>
          <Nav.Dropdown>
            <Nav.DropdownTrigger>Learn</Nav.DropdownTrigger>
            <Nav.DropdownPanel style={{ "--loam-nav-dropdown-size": "32rem" } as CSSProperties}>
              <div
                style={{
                  display: "grid",
                  gap: "var(--loam-space-xs)",
                  gridTemplateColumns: "repeat(auto-fit, minmax(12rem, 1fr))",
                }}
              >
                <Nav.List>
                  <Nav.Item>
                    <Nav.Link href="#guides">Growing guides</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link href="#sowing-calendar">Sowing calendar</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link href="#seed-saving">Seed saving</Nav.Link>
                  </Nav.Item>
                </Nav.List>
                <Nav.List>
                  <Nav.Item>
                    <Nav.Link href="#courses">Courses</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link href="#workshops">Workshops</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link href="#open-days">Open days</Nav.Link>
                  </Nav.Item>
                </Nav.List>
              </div>
            </Nav.DropdownPanel>
          </Nav.Dropdown>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="#about">About</Nav.Link>
        </Nav.Item>
      </Nav.List>
    </Nav.Root>
  );
}

/**
 * A line of the nav that opens a menu of actions: the Menu's trigger is a
 * Nav.Link rendered as a button, so it is set like the links beside it and
 * wired like a menu button.
 */
export function NavMenuDemo() {
  return (
    <Nav.Root aria-label="Site" style={{ "--loam-nav-current-edge": "block-end" } as CSSProperties}>
      <Nav.List style={row}>
        <Nav.Item>
          <Nav.Link href="#seeds" current>
            Seeds
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="#plants">Plants</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Menu.Root>
            <Menu.Trigger render={<Nav.Link render={<button type="button" />} />}>
              Account
              <Chevron />
            </Menu.Trigger>
            <Menu.Popup>
              <Menu.Item>Switch workspace</Menu.Item>
              <Menu.Item>Sign out</Menu.Item>
            </Menu.Popup>
          </Menu.Root>
        </Nav.Item>
      </Nav.List>
    </Nav.Root>
  );
}

const SECTIONS = [
  { id: "spy-overview", title: "Overview" },
  { id: "spy-planting", title: "Planting" },
  { id: "spy-irrigation", title: "Irrigation" },
  { id: "spy-harvest", title: "Harvest" },
];

const filler =
  "Loam is a soil of sand, silt and clay in roughly equal measure, which holds water without waterlogging and drains without drying out. It warms early in spring and is easy to work in most seasons. ";

export function NavScrollSpyDemo() {
  const active = useScrollSpy(SECTIONS.map((s) => s.id));
  return (
    <div
      style={{
        display: "grid",
        gap: "var(--loam-space-s)",
        gridTemplateColumns: "minmax(0, 1fr) 11rem",
        inlineSize: "100%",
      }}
    >
      <div
        style={{
          blockSize: "16rem",
          border: "1px solid var(--loam-color-line)",
          borderRadius: "var(--loam-radius-md)",
          overflowY: "auto",
          paddingInline: "var(--loam-space-s)",
        }}
      >
        {SECTIONS.map((section) => (
          <section key={section.id}>
            <h3 id={section.id}>{section.title}</h3>
            <p>{filler.repeat(3)}</p>
          </section>
        ))}
      </div>
      <Nav.Root>
        <Nav.Title>On this page</Nav.Title>
        <Nav.List>
          {SECTIONS.map((section) => (
            <Nav.Item key={section.id}>
              <Nav.Link href={`#${section.id}`} current={active === section.id && "location"}>
                {section.title}
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav.List>
      </Nav.Root>
    </div>
  );
}
