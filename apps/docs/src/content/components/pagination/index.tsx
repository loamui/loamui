import type { ComponentContent } from "@/renderer/types";
import { PaginationDemo, PaginationEdgesDemo, PaginationRenderDemo } from "./demos";

const doc: ComponentContent = {
  slug: "pagination",
  lead: "Navigate through pages of content with real, addressable links, composed from parts on top of Button.",
  importLine: `import { Pagination } from "@loamui/core";`,
  demos: [
    {
      title: "Basic usage",
      description:
        "Pagination.Pages renders Previous, the numbered window around the active page with its ellipses, and Next, from page and count. Every page has an href; intercept onNavigate only when a client router needs it.",
      code: `function Demo() {
  const [page, setPage] = useState(1);
  return (
    <Pagination.Root>
      <Pagination.List>
        <Pagination.Pages
          page={page}
          count={10}
          getHref={(next) => "?page=" + next}
          onNavigate={(next, event) => {
            event.preventDefault();
            setPage(next);
          }}
        />
      </Pagination.List>
    </Pagination.Root>
  );
}`,
      render: () => <PaginationDemo />,
    },
    {
      title: "With edges",
      description:
        "First and last links are your own Items around Pages: a Pagination.Link is a Button rendered as a link, disabled when the destination is the current page. Ellipsis gaps keep the control compact across 20 pages.",
      code: `function Demo() {
  const [page, setPage] = useState(10);
  const count = 20;
  return (
    <Pagination.Root>
      <Pagination.List>
        <Pagination.Item>
          <Pagination.Link href="?page=1" aria-label="First page" disabled={page === 1}>
            «
          </Pagination.Link>
        </Pagination.Item>
        <Pagination.Pages page={page} count={count} getHref={(next) => "?page=" + next} />
        <Pagination.Item>
          <Pagination.Link href={"?page=" + count} aria-label="Last page" disabled={page === count}>
            »
          </Pagination.Link>
        </Pagination.Item>
      </Pagination.List>
    </Pagination.Root>
  );
}`,
      render: () => <PaginationEdgesDemo />,
    },
    {
      title: "Router links and other words",
      description:
        "Compose the list yourself when the convenience doesn't fit: Link takes a router link through render and the wiring merges on, current marks the active page, and labels puts the landmark's name in the page's own language.",
      code: `import Link from "next/link";

<Pagination.Root labels={{ navigation: "Seiten" }}>
  <Pagination.List>
    {[1, 2, 3].map((n) => (
      <Pagination.Item key={n}>
        <Pagination.Link
          render={<Link href={"?page=" + n} />}
          current={n === 2}
          aria-label={"Seite " + n}
        >
          {n}
        </Pagination.Link>
      </Pagination.Item>
    ))}
    <Pagination.Ellipsis />
    <Pagination.Item>
      <Pagination.Link render={<Link href="?page=12" />} aria-label="Seite 12">
        12
      </Pagination.Link>
    </Pagination.Item>
  </Pagination.List>
</Pagination.Root>`,
      render: () => <PaginationRenderDemo />,
    },
  ],
  whenToUse: [
    "For long result sets (search results, tables, archives) where users need to know where they are in the set and jump to a position.",
    "When users may want to return to a specific point: numbered pages give every position a stable address, which continuous scrolling cannot.",
  ],
  whenNotToUse: [
    "For short lists: if everything fits on one or two pages, show it all; a pager over a handful of items adds clicks without adding orientation.",
    "For feeds built for continuous browsing where position never matters: a 'load more' control fits that reading pattern better than page numbers nobody will cite.",
  ],
  howItWorks: [
    {
      title: "Show more per page before adding more pages",
      body: "Deep pagination is a poor way to find anything: nobody browses to page 37 of 120. Before reaching for a longer pager, raise the page size or improve search and filtering so users land near what they want. Pagination is for orienting within a set, not a substitute for findability.",
    },
    {
      title: "Previous and Next stay put",
      body: "Sequential movement is what pagination is for, so Pagination.Pages always renders Previous and Next and they keep their visual space. At the first and last page the unavailable direction becomes a disabled Link: an aria-hidden placeholder with no href. The layout stays stable without adding an inert stop to the keyboard or accessibility order.",
    },
    {
      title: "The ends are always visible",
      body: "The page list always includes page 1 and the last page, with aria-hidden ellipses standing in for the gaps and sibling pages shown around the active one. Users can therefore read the size of the whole set and reach either end in one click from anywhere. First and last links are a composition: two Items of your own around Pages.",
    },
    {
      title: "The URL is the source of truth",
      body: "getHref gives every destination a real URL, so page 4 is linkable, survives reloads and supports the back button before JavaScript runs. With a client router, pass its link through Link's render, or intercept onNavigate, prevent the browser navigation and update the route there. The href remains the fallback and the destination users can copy or open in a new tab.",
    },
    {
      title: "A page link is a Button",
      body: "Pagination.Link is the LoamUI Button rendered as an <a>, so the pager height-aligns with every other control by construction and answers its context like any Button: the current page's Item declares --loam-context: primary, and the Button inside adapts. There is no pagination-specific recipe to keep in step.",
    },
  ],
  accessibility: [
    'The pager is a <nav aria-label="Pagination"> (labels.navigation replaces the name) wrapping a list, so assistive technology exposes it as a navigation landmark with a known number of items.',
    'The active page carries aria-current="page", and the stylesheet keys off that same attribute, so the state is declared once; the position is announced, and colour is not the only visual signal.',
    'Every available destination is a real <a href> with an explicit aria-label ("Previous page", "Page 7"); labels on Pages replaces the words. Users can copy, bookmark or open a page in a new tab.',
    "Ellipsis separators are aria-hidden: they are visual shorthand for the gap, not stops in the reading order.",
    'Previous and Next carry rel="prev" and rel="next". Unavailable directions are visual placeholders hidden from assistive technology, so they are not inert tab stops.',
  ],
  parts: [
    {
      name: "Pagination.Root",
      description: "The <nav> landmark; native <nav> props are forwarded.",
      props: [
        {
          name: "labels",
          type: "{ navigation?: string }",
          default: `{ navigation: "Pagination" }`,
          description: "The landmark's accessible name.",
        },
      ],
    },
    {
      name: "Pagination.List",
      description: "The <ul> of items; native <ul> props are forwarded.",
    },
    {
      name: "Pagination.Item",
      description: "One <li>, holding a Link or your own content; native <li> props are forwarded.",
    },
    {
      name: "Pagination.Link",
      description:
        "A page destination: the LoamUI Button rendered as an <a>. Native <a> props (href, rel, aria-label, onClick) are forwarded.",
      props: [
        {
          name: "current",
          type: "boolean",
          description: 'Marks the current page (aria-current="page").',
        },
        {
          name: "disabled",
          type: "boolean",
          description:
            "An unavailable destination: the built-in link drops its href and leaves the tab and accessibility order.",
        },
        {
          name: "render",
          type: "element | (props) => node",
          description:
            "Substitute your own link (render={<Link href=… />}); it receives the wiring.",
        },
      ],
    },
    {
      name: "Pagination.Ellipsis",
      description:
        "An aria-hidden <li> standing in for a gap; children replace the default … glyph.",
    },
    {
      name: "Pagination.Pages",
      description:
        "The convenience: Previous, the numbered window with ellipses, and Next, rendered from the parts. Belongs inside Pagination.List; edge links are your own Items around it.",
      props: [
        { name: "page", type: "number", description: "The active page (1-based)." },
        { name: "count", type: "number", description: "Total number of pages." },
        {
          name: "siblings",
          type: "number",
          default: "1",
          description: "Number of sibling pages shown on each side of the active page.",
        },
        {
          name: "getHref",
          type: "(page: number) => string",
          description: "Build the destination URL for each page (required).",
        },
        {
          name: "onNavigate",
          type: "(page: number, event: MouseEvent<HTMLAnchorElement>) => void",
          description: "Optionally intercept link activation for a client router.",
        },
        {
          name: "labels",
          type: "{ previous?: string; next?: string; page?: (n: number) => string }",
          default: `{ previous: "Previous page", next: "Next page", page: (n) => "Page n" }`,
          description:
            'The words the links speak: previous ("Previous page"), next ("Next page") and page(n) ("Page 7").',
        },
      ],
    },
  ],
};

export default doc;
