import type { MouseEvent as ReactMouseEvent, ReactNode } from "react";

import { PaginationItem } from "../item/PaginationItem.js";
import { PaginationLink } from "../link/PaginationLink.js";
import { PaginationEllipsis } from "../ellipsis/PaginationEllipsis.js";

const DOTS = "dots" as const;
type PageItem = number | typeof DOTS;

function range(start: number, end: number): number[] {
  const out: number[] = [];
  for (let i = start; i <= end; i += 1) out.push(i);
  return out;
}

/** Build the list of page numbers with ellipsis gaps. */
function getPaginationItems(count: number, active: number, siblings: number): PageItem[] {
  // Pages we always show plus the sibling window; if that's most of them,
  // just render every page.
  const totalToShow = siblings * 2 + 5; // first, last, active, 2 dots
  if (totalToShow >= count) return range(1, count);

  const leftSibling = Math.max(active - siblings, 1);
  const rightSibling = Math.min(active + siblings, count);

  const showLeftDots = leftSibling > 2;
  const showRightDots = rightSibling < count - 1;

  if (!showLeftDots && showRightDots) {
    const leftCount = siblings * 2 + 3;
    return [...range(1, leftCount), DOTS, count];
  }

  if (showLeftDots && !showRightDots) {
    const rightCount = siblings * 2 + 3;
    return [1, DOTS, ...range(count - rightCount + 1, count)];
  }

  return [1, DOTS, ...range(leftSibling, rightSibling), DOTS, count];
}

function ChevronIcon({ dir }: { dir: "previous" | "next" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polyline points={dir === "previous" ? "15 18 9 12 15 6" : "9 18 15 12 9 6"} />
    </svg>
  );
}

/** The words the page links speak. */
export interface PaginationPagesLabels {
  /** The Previous arrow's name. @default "Previous page" */
  previous?: string;
  /** The Next arrow's name. @default "Next page" */
  next?: string;
  /** Names each page link. @default `"Page ${n}"` */
  page?: (page: number) => string;
}

export interface PaginationPagesProps {
  /** The active page (1-based). */
  page: number;
  count: number;
  /** Sibling pages shown on each side of the active page. @default 1 */
  siblings?: number;
  /** Build the destination URL for a page. */
  getHref: (page: number) => string;
  /** Optionally intercept navigation for a client router. */
  onNavigate?: (page: number, event: ReactMouseEvent<HTMLAnchorElement>) => void;
  /**
   * The words the links speak, for another language or a different noun:
   * `previous` and `next` name the arrows, `page(n)` names each page link.
   */
  labels?: PaginationPagesLabels;
}

/**
 * The sequential core of a pager: Previous, the numbered window around the
 * active page with ellipsis gaps, and Next, built from the parts. Renders
 * Items, so it belongs inside `Pagination.List`; edge links are your own
 * Items around it.
 */
export function PaginationPages({
  page,
  count,
  siblings = 1,
  getHref,
  onNavigate,
  labels,
}: PaginationPagesProps) {
  const previousLabel = labels?.previous ?? "Previous page";
  const nextLabel = labels?.next ?? "Next page";
  const pageLabel = labels?.page ?? ((n: number) => `Page ${n}`);
  const active = Math.min(Math.max(page, 1), Math.max(count, 1));
  const items = getPaginationItems(count, active, siblings);

  const link = (target: number, label: string, children: ReactNode, rel?: "prev" | "next") => {
    const clamped = Math.min(Math.max(target, 1), count);
    return (
      <PaginationLink
        href={getHref(clamped)}
        rel={rel}
        aria-label={label}
        current={clamped === active && rel === undefined}
        disabled={rel !== undefined && clamped === active}
        onClick={(event) => onNavigate?.(clamped, event)}
      >
        {children}
      </PaginationLink>
    );
  };

  let dots = 0;
  return (
    <>
      <PaginationItem>
        {link(active - 1, previousLabel, <ChevronIcon dir="previous" />, "prev")}
      </PaginationItem>
      {items.map((item) =>
        item === DOTS ? (
          <PaginationEllipsis key={`dots-${++dots}`} />
        ) : (
          <PaginationItem key={item}>{link(item, pageLabel(item), item)}</PaginationItem>
        ),
      )}
      <PaginationItem>
        {link(active + 1, nextLabel, <ChevronIcon dir="next" />, "next")}
      </PaginationItem>
    </>
  );
}
