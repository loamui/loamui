"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type GuideLink, GETTING_STARTED, GUIDES, PRIMITIVES, componentsByCategory } from "./nav";
import "./NavLinks.css";

/** Shared by the desktop sidebar and mobile drawer. */
export function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname().replace(/\/$/, "") || "/";
  const groups = componentsByCategory();
  const isActive = (href: string) => pathname === href;

  const renderLink = (href: string, name: string, children?: GuideLink[]) => (
    <li key={href}>
      <Link href={href} aria-current={isActive(href) ? "page" : undefined} onClick={onNavigate}>
        {name}
      </Link>
      {children && <ul>{children.map((child) => renderLink(child.href, child.name))}</ul>}
    </li>
  );

  return (
    <>
      <div className="group">
        <p>Getting started</p>
        <ul>{GETTING_STARTED.map((g) => renderLink(g.href, g.name, g.children))}</ul>
      </div>

      <div className="group">
        <p>Guides</p>
        <ul>{GUIDES.map((g) => renderLink(g.href, g.name))}</ul>
      </div>

      <div className="section">
        <p>Primitives</p>

        {/* The three primitives as peer links; Components is the last of them
            and the parent of the category tree that follows. */}
        <ul>{PRIMITIVES.map((p) => renderLink(p.href, p.name))}</ul>

        <div className="componentTree">
          {groups.map((group) => (
            <div key={group.category} className="subgroup">
              <p>{group.category}</p>
              <ul>
                {group.items.map((item) => renderLink(`/docs/components/${item.slug}`, item.name))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
