import { Price } from "@loamui/core";
import type { ComponentContent } from "@/renderer/types";

const doc: ComponentContent = {
  slug: "price",
  lead: "A monetary amount written for people, with the number kept for machines.",
  importLine: `import { Price } from "@loamui/core";`,
  demos: [
    {
      title: "A plan's price",
      description:
        "Price sizes nothing itself: it takes the font of whatever it sits in, here a paragraph set large and bold. What the amount covers is written as its children and set small beside it.",
      code: `<p style={{ fontSize: "var(--loam-text-2xl)", fontWeight: 700 }}>
  <Price value={24} currency="GBP">per seat, per month</Price>
</p>`,
      render: () => (
        <p style={{ fontSize: "var(--loam-text-2xl)", fontWeight: 700, margin: 0 }}>
          <Price value={24} currency="GBP">
            per seat, per month
          </Price>
        </p>
      ),
    },
    {
      title: "Whole and fractional amounts",
      description:
        "Whole amounts drop their zeros and fractional ones keep them, so £24 and £9.50 sit together without either looking wrong. The figures are lining and tabular, so a column of them stays straight.",
      code: `<ul>
  <li><Price value={9.5} currency="GBP" /></li>
  <li><Price value={120} currency="GBP" /></li>
  <li><Price value={1250.25} currency="GBP" /></li>
</ul>`,
      render: () => (
        <ul
          style={{
            display: "grid",
            gap: "var(--loam-space-3xs)",
            listStyle: "none",
            margin: 0,
            padding: 0,
          }}
        >
          <li>
            <Price value={9.5} currency="GBP" />
          </li>
          <li>
            <Price value={120} currency="GBP" />
          </li>
          <li>
            <Price value={1250.25} currency="GBP" />
          </li>
        </ul>
      ),
    },
    {
      title: "Locales",
      description:
        "The locale decides grouping, the decimal mark and where the symbol sits. Set it to the page's language rather than leaving it to the reader's device, so the server and the browser write the same text.",
      code: `<Price value={1250.5} currency="EUR" locale="de-DE" />
<Price value={1250.5} currency="EUR" locale="fr-FR" />
<Price value={1250} currency="JPY" locale="ja-JP" />`,
      render: () => (
        <ul
          style={{
            display: "grid",
            gap: "var(--loam-space-3xs)",
            listStyle: "none",
            margin: 0,
            padding: 0,
          }}
        >
          <li>
            <Price value={1250.5} currency="EUR" locale="de-DE" />
          </li>
          <li>
            <Price value={1250.5} currency="EUR" locale="fr-FR" />
          </li>
          <li>
            <Price value={1250} currency="JPY" locale="ja-JP" />
          </li>
        </ul>
      ),
    },
    {
      title: "Signed amounts",
      description:
        "A summary of changes shows which way each one goes. signDisplay is Intl.NumberFormat's: exceptZero writes a sign on every non-zero amount, so a credit and a charge read apart at a glance.",
      code: `<dl>
  <dt>Prorated credit</dt>
  <dd><Price value={2} currency="GBP" signDisplay="exceptZero" /></dd>
  <dt>New plan</dt>
  <dd><Price value={-4.65} currency="GBP" signDisplay="exceptZero" /></dd>
</dl>`,
      render: () => (
        <dl
          style={{
            display: "grid",
            gap: "var(--loam-space-3xs) var(--loam-space-s)",
            gridTemplateColumns: "auto auto",
            margin: 0,
          }}
        >
          <dt>Prorated credit</dt>
          <dd style={{ margin: 0, textAlign: "end" }}>
            <Price value={2} currency="GBP" signDisplay="exceptZero" />
          </dd>
          <dt>New plan</dt>
          <dd style={{ margin: 0, textAlign: "end" }}>
            <Price value={-4.65} currency="GBP" signDisplay="exceptZero" />
          </dd>
        </dl>
      ),
    },
  ],
  whenToUse: [
    "Any amount of money the reader is meant to weigh: a plan's price, a line in an order, a total, a figure in a table column.",
    "Where prices sit in a column or a row and must line up: the tabular figures do that without a monospace face.",
  ],
  whenNotToUse: [
    "For numbers that are not money (a count, a percentage, a duration). Write them as text, or as a plain <data> element if a machine needs the value.",
    'For a running-text mention where the amount is incidental ("it cost about £20"). The element adds machine value and figure styling the sentence does not need.',
  ],
  howItWorks: [
    {
      title: "The amount takes the type around it",
      body: "A price is a headline on a plan and a cell in a table, and the same element serves both because it sets no size, weight or family of its own. Put it inside the heading, paragraph or cell and style that; the amount inherits.",
    },
    {
      title: "Zeros only when they mean something",
      body: "£24.00 says the pence matter and there are none; £24 says the pence do not matter. Whole amounts drop their zeros and fractional amounts keep theirs, so £9.50 keeps its trailing zero and a list of both reads cleanly.",
    },
    {
      title: "Locale is a fact of the page, not a guess",
      body: "The amount is written the way the page's language writes money. The locale defaults to a fixed value rather than the reader's device so the server and the browser produce the same text; set it from the page's language.",
    },
  ],
  accessibility: [
    'Renders a <data> element: inline text to assistive tech, read as the amount\'s written form ("£24 per seat, per month"), with the plain number in its value attribute for scripts and agents.',
    "The qualifier is real text in a <small>, not a title or aria-label, so it is read in order and copied with the amount.",
    "Nothing about the amount is carried by colour or size alone; the figure is the text.",
  ],
  props: [
    {
      name: "value",
      type: "number",
      description: "The amount in the currency's major unit: 24 for £24, 9.5 for £9.50.",
    },
    {
      name: "currency",
      type: "string",
      description: 'The ISO 4217 currency code: "GBP", "USD", "EUR".',
    },
    {
      name: "locale",
      type: "string",
      default: '"en"',
      description:
        "The BCP 47 locale the amount is written in: grouping, decimal mark and symbol placement. Set it to the page's language.",
    },
    {
      name: "signDisplay",
      type: '"auto" | "always" | "never" | "exceptZero" | "negative"',
      default: '"auto"',
      description:
        "When the sign is written, as Intl.NumberFormat has it: auto marks negative amounts only; exceptZero marks every non-zero amount, for a summary of credits and charges.",
    },
    {
      name: "children",
      type: "ReactNode",
      description:
        'What the amount covers ("per seat, per month"), written after it in small text.',
    },
    {
      name: "...others",
      type: "HTMLAttributes<HTMLDataElement>",
      description: "All native <data> props are forwarded.",
    },
  ],
};

export default doc;
