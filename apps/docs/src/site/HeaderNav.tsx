"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import "./Header.css";

const LINKS = [
  { name: "Tokens", href: "/docs/tokens" },
  { name: "Element styles", href: "/docs/element-styles" },
  { name: "Components", href: "/docs/components" },
];

/**
 * The primary navigation, with the current section marked. A section's
 * link is current on its own page and on every page beneath it
 * (`/docs/components/button` marks Components), so the header always says
 * where in the site the reader is.
 */
export function HeaderNav({ resources = false }: { resources?: boolean }) {
  const pathname = usePathname() ?? "";
  const current = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  return (
    <nav aria-label={resources ? "Resources" : "Primitives"}>
      {(resources
        ? [
            { name: "Documentation", href: "/docs" },
            { name: "Recipes", href: "/recipes" },
          ]
        : LINKS
      ).map((l) => (
        <Link key={l.href} href={l.href} aria-current={current(l.href) ? "page" : undefined}>
          {l.name}
        </Link>
      ))}
    </nav>
  );
}
