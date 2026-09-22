"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Drawer, VisuallyHidden } from "@loamui/core";
import { NavLinks } from "./NavLinks";
import { MenuIcon } from "./Icons";
import "./MobileNav.css";

/**
 * The mobile navigation: a hamburger that opens the documentation nav in a
 * Drawer. Shown only where the header nav and sidebar collapse (≤62rem). The
 * LoamUI Drawer gives the top layer, focus containment, Escape and
 * focus-restore for free; we drive open state so it closes on navigation.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <Drawer.Root open={open} onOpenChange={setOpen}>
      <Drawer.Trigger
        render={
          <button
            type="button"
            className="site-MobileNav-trigger"
            aria-label="Open navigation menu"
          >
            <MenuIcon />
          </button>
        }
      />
      <Drawer.Popup side="start" className="site-MobileNav-panel">
        <VisuallyHidden render={<Drawer.Title />}> Navigation</VisuallyHidden>
        <div className="site-NavLinks">
          <NavLinks onNavigate={() => setOpen(false)} />
          <Link href="/recipes" onClick={() => setOpen(false)}>
            Recipes
          </Link>
        </div>
      </Drawer.Popup>
    </Drawer.Root>
  );
}
