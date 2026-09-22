import type { ComponentContent } from "@/renderer/types";
import { Field, Search } from "@loamui/core";
import { IconSearch } from "@tabler/icons-react";

export function SearchSiteDemo() {
  return (
    <header
      style={{
        alignItems: "center",
        display: "flex",
        gap: "var(--loam-space-s)",
        inlineSize: "100%",
        justifyContent: "space-between",
      }}
    >
      <strong>Loam</strong>
      <Search.Root style={{ inlineSize: "min(20rem, 100%)" }}>
        <Search.Label>Search this site</Search.Label>
        <Search.Input />
        <Search.Button />
      </Search.Root>
    </header>
  );
}

export function SearchIconDemo() {
  return (
    <Search.Root style={{ inlineSize: "min(20rem, 100%)" }}>
      <Search.Label>Search this site</Search.Label>
      <Search.Input />
      <Search.Button aria-label="Search">
        <IconSearch aria-hidden />
      </Search.Button>
    </Search.Root>
  );
}

export function SearchInFieldDemo() {
  return (
    <Search.Root aria-label="Search orders" style={{ inlineSize: "min(24rem, 100%)" }}>
      <Field.Root>
        <Field.Label>Order number</Field.Label>
        <Field.Description>The reference on your confirmation email.</Field.Description>
        <Search.Input name="order" />
      </Field.Root>
      <Search.Button>Find order</Search.Button>
    </Search.Root>
  );
}

const doc: ComponentContent = {
  slug: "search",
  lead: "The site's or page's search: a search landmark around a native form, with a search box and a submit.",
  importLine: `import { Search, Field } from "@loamui/core";`,
  demos: [
    {
      title: "In a site header",
      description:
        "The header recipe: the search sits beside the brand, in the row a site's actions share; The label names the box for a screen reader without showing on screen; the button submits, and so does Enter in the box. Without an action the form submits to the current page as a GET with the query under q.",
      code: `<header>
  <strong>Loam</strong>
  <Search.Root>
    <Search.Label>Search this site</Search.Label>
    <Search.Input />
    <Search.Button />
  </Search.Root>
</header>`,
      render: () => <SearchSiteDemo />,
    },
    {
      title: "Icon only",
      description:
        "An svg child is detected by Button as an icon, and the aria-label names the button and makes it square; the name is still read. Keep the word for the landmark and the box; the icon is only what is seen, so it is aria-hidden.",
      code: `<Search.Root>
  <Search.Label>Search this site</Search.Label>
  <Search.Input />
  <Search.Button aria-label="Search">
    <IconSearch aria-hidden />
  </Search.Button>
</Search.Root>`,
      render: () => <SearchIconDemo />,
    },
    {
      title: "In a Field",
      description:
        "A Field around the box names it visibly and adds a hint; the box wires itself to the Field, so Search.Label is not needed. The landmark takes its own name because a second search on the page must be told apart from the site's.",
      code: `<Search.Root aria-label="Search orders">
  <Field.Root>
    <Field.Label>Order number</Field.Label>
    <Field.Description>The reference on your confirmation email.</Field.Description>
    <Search.Input name="order" />
  </Field.Root>
  <Search.Button>Find order</Search.Button>
</Search.Root>`,
      render: () => <SearchInFieldDemo />,
    },
  ],
  whenToUse: [
    "For the search of a site or a section of it: a query the user types, submits, and gets a page of results for. The landmark lets a screen reader user jump straight to it from anywhere on the page.",
    "For a search of one kind of thing that has its own page of results (orders, people, documents), named for what it searches so it is told apart from the site's search.",
  ],
  whenNotToUse: [
    "For filtering a table or a list in place as the user types. That is not a search landmark and has no submit; use a plain Input in a Field, labelled for what it filters.",
    "For a command menu or a jump-to box that opens results as a list to pick from. That is its own pattern with its own keyboard contract, not a form that submits.",
  ],
  howItWorks: [
    {
      title: "The landmark is the element",
      body: "Search.Root renders a native <search> element, which is the search landmark by itself, around a native form. A screen reader lists it among the page's landmarks, Enter in the box submits, and the query travels as a GET to the action under the name q, so a results page has a URL that can be shared.",
    },
    {
      title: "Every search has a name, and no two share one",
      body: 'The box is named by Search.Label, which is read but not shown, or by the Field around it, which is shown. The landmark is named "Search" by default. A page with two searches gives each its own aria-label ("Site search", "Search orders"), because a landmark list that says "search, search" tells the user nothing.',
    },
    {
      title: 'type="search" keeps the platform\'s clear affordance',
      body: "The box is the library's Input with type set to search, so the browser draws its own clear control once there is text, the on-screen keyboard shows a Search key, and the browser remembers past queries. The native search input retains those familiar browser behaviours.",
    },
  ],
  accessibility: [
    "The <search> element is the search landmark: it is announced as one and reachable by landmark navigation without a role attribute. Its accessible name comes from aria-label, so it is read in a landmark list.",
    "The box always has a real <label>: Search.Label ties itself to the box by id, hidden with the same recipe as the library's other read-only text, or a Field.Label names it visibly. A placeholder is never the name.",
    "The submit is a native button with a name: text by default, or an aria-label when it shows only an icon. The icon itself is aria-hidden so the name is read once.",
  ],
  parts: [
    {
      name: "Search.Root",
      description:
        "The <search> landmark around a native <form>. className and style dress the landmark; every other native <form> prop, and the ref, go to the form.",
      props: [
        {
          name: "aria-label",
          type: "string",
          default: '"Search"',
          description:
            "The landmark's name. Give a second search on the page its own so the two are told apart.",
        },
        {
          name: "action",
          type: "string",
          description: "Where the query is sent; the current page when omitted.",
        },
        {
          name: "method",
          type: '"get" | "post"',
          default: '"get"',
          description: "GET puts the query in the URL, so a results page can be shared.",
        },
        {
          name: "onSubmit",
          type: "(event: FormEvent) => void",
          description:
            "Runs on Enter in the box and on the button. Call preventDefault to search without navigating.",
        },
      ],
    },
    {
      name: "Search.Label",
      description:
        "The box's name, read but not seen. Native <label> props are forwarded. Not needed when a Field around the box names it.",
    },
    {
      name: "Search.Input",
      description:
        "The library's Input as a search box: type=\"search\", inputMode and enterKeyHint set to search. Inside a Field it takes the Field's label, description and error.",
      props: [
        {
          name: "name",
          type: "string",
          default: '"q"',
          description: "The query's key in the submitted URL.",
        },
        {
          name: "...others",
          type: "InputProps",
          description: "All Input props are forwarded, except type.",
        },
      ],
    },
    {
      name: "Search.Button",
      description:
        'The submit: the library\'s Button with type="submit". Children default to "Search"; an icon with an aria-label makes it icon-only.',
      props: [
        {
          name: "...others",
          type: "ButtonProps",
          description: "All Button props are forwarded.",
        },
      ],
    },
  ],
};

export default doc;
