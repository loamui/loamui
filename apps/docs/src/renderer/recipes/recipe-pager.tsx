import Link from "next/link";
import "./recipe-pager.css";

export interface PagerLink {
  href: string;
  title: string;
}

/**
 * The foot of a category or example page: the previous and the next in
 * the sequence, each a card with an eyebrow saying which way it goes, so
 * a reader can walk the set without returning to the index.
 */
export function RecipePager({
  previous,
  next,
  label,
}: {
  previous?: PagerLink;
  next?: PagerLink;
  /** What the sequence is of: "category" or "example". */
  label: string;
}) {
  if (!previous && !next) return null;
  return (
    <nav className="site-RecipePager" aria-label={`Previous and next ${label}`}>
      {previous ? (
        <Link href={previous.href} rel="prev">
          <span>Previous {label}</span>
          <span>{previous.title}</span>
        </Link>
      ) : (
        <span />
      )}
      {next && (
        <Link href={next.href} data-next rel="next">
          <span>Next {label}</span>
          <span>{next.title}</span>
        </Link>
      )}
    </nav>
  );
}
