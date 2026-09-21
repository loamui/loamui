// Gate: a component's anatomy is complete.
//
// Mantine names every element a component styles (`stylesNames: root | section
// | label`) and hands you each one through `classNames`. We forbid config props
// of that shape, so the only way we can expose the same element is as a part.
// That gives one rule, and it is mechanical:
//
//   Every element a component's scope CSS styles is either content the
//   consumer composes, or a part the component exposes. Nothing in between.
//
// Without it the anatomies drift: Table shipped a `Th` part for a year while
// `td`, `tr`, `thead` and `caption` stayed bare markup, so the library looked
// like it exposed a component for some of a table and not the rest. This gate
// finds that, so a new component forces the ruling up front instead of a
// re-argument later.
//
// Run: node scripts/check-anatomy.mjs

import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import postcss from "postcss";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const COMPONENTS = join(ROOT, "packages/core/src/components");

/**
 * Elements that are always the consumer's own content, never ours to name.
 * An icon is composed as a child and detected with `:has(svg)`; the scope
 * sizes whatever arrives. Naming it as a part would be claiming the
 * consumer's content.
 */
const COMPOSED = new Set(["svg"]);

/**
 * Elements a component renders inside a part of its own, so the scope styles
 * them but a consumer never writes one. Each entry is a deliberate ruling.
 */
const INTERNAL = {
  // Each entry is a ruling: the component renders this element inside a part
  // of its own, so a consumer never writes one and there is nothing to expose.
  // Verified against each component's TSX — if you add an element here, check
  // the component actually renders it rather than styling a consumer's markup.
  Alert: ["div", "span"], // Root, Body and the icon well
  Avatar: ["li", "img", "span"], // Group's items, Image, Fallback
  Badge: ["span"], // Root and Text
  Breadcrumbs: ["ol", "a"], // Root's list, Item's link
  Carousel: ["button", "ul", "li"], // Previous/Next, Indicators
  Checkbox: ["label", "span"], // the labelled row the control lives in
  Combobox: ["ul", "li"], // List and Option
  DateInput: ["p", "div"], // Description/Error, Fields
  Details: ["span", "div"], // Summary's marker, Content
  Drawer: ["h2", "p"], // Title and Description
  ErrorSummary: ["ul", "li", "a", "h2"], // List, Item, Title
  Field: ["span"], // Description, Error and the optional marker
  Fieldset: ["legend", "span"], // Legend
  FileInput: ["ul", "li", "label", "span"], // Files, Prompt
  Input: ["input", "span"], // the control and its adornments
  Loader: ["span"], // the spinner's own elements
  Menu: ["hr", "div"], // Separator, Popup
  Modal: ["h2", "p"], // Title and Description
  Nav: ["ul", "li"], // List and Item
  Pagination: ["ul", "li"], // List and Item
  Popover: ["h2", "p"], // Title and Description
  Progress: ["progress", "span"],
  QuantityInput: ["input"],
  Radio: ["span", "p"], // the labelled row
  Range: ["span"], // Track marks
  Rating: ["input", "span"], // one radio per star
  Search: ["form"], // Root
  SegmentedControl: ["legend", "label"], // Legend, Item
  Select: ["select"], // Root
  SignpostLink: ["span"],
  Stepper: ["li", "span", "p"], // Step, Marker, Description
  Switch: ["input", "span"], // Control, Track, Thumb
  Table: ["table"], // Root renders the table inside its scroll region
  Tabs: ["div", "button"], // Panel, Tab
  Textarea: ["textarea"],
  Toast: ["div"], // Viewport and Root
  Tooltip: ["span"], // Popup and Arrow
};


const HTML = new Set(
  `a abbr article aside blockquote button caption code col colgroup dd details dialog div dl dt
   fieldset figure footer form h1 h2 h3 h4 h5 h6 header hr img input label legend li main nav ol
   optgroup option output p picture pre progress meter section select span strong summary svg table
   tbody td textarea tfoot th thead time tr ul`.split(/\s+/),
);

/**
 * The element a rule actually styles: the last compound of the selector.
 * `:has()` and `:not()` hold conditions rather than subjects, so their
 * contents are dropped; `:is()`/`:where()` in the subject position are
 * expanded, because `:is(td, th)` styles both.
 */
export function subjectElements(selector) {
  const stripped = selector.replace(/:(?:has|not)\([^)]*\)/g, "");
  const compounds = stripped.split(/[\s>+~]+/).filter(Boolean);
  const last = compounds.at(-1);
  if (!last) return [];
  const group = /^:(?:is|where)\(([^)]*)\)$/.exec(last);
  const candidates = group ? group[1].split(",").map((c) => c.trim()) : [last];
  return candidates
    .filter((c) => !c.startsWith(".") && !c.startsWith("#") && !c.startsWith("&"))
    .map((c) => /^([a-zA-Z][\w-]*)/.exec(c)?.[1])
    .filter((el) => el && HTML.has(el));
}

/** Element selectors a stylesheet targets, at any nesting depth. */
export function styledElements(css) {
  const found = new Set();
  postcss.parse(css).walkRules((rule) => {
    for (const selector of rule.selectors) for (const el of subjectElements(selector)) found.add(el);
  });
  return found;
}

/** Part names a component exposes, read from its `*.parts.ts` file. */
function exposedElements(dir) {
  const parts = readdirSync(dir).find((f) => f.endsWith(".parts.ts"));
  if (!parts) return null;
  const source = readFileSync(join(dir, parts), "utf8");
  return new Set([...source.matchAll(/\bas\s+([A-Z]\w*)/g)].map((m) => m[1].toLowerCase()));
}

export function anatomyFindings() {
  const findings = [];
  for (const name of readdirSync(COMPONENTS)) {
    const dir = join(COMPONENTS, name);
    const files = readdirSync(dir);
    const css = files.filter((f) => f.endsWith(".css"));
    if (!css.length) continue;

    const styled = new Set();
    for (const file of css) for (const el of styledElements(readFileSync(join(dir, file), "utf8"))) styled.add(el);

    const parts = exposedElements(dir);
    const internal = new Set(INTERNAL[name] ?? []);

    for (const el of styled) {
      if (COMPOSED.has(el) || internal.has(el)) continue;
      // A part named for the element covers it: Table.Td for `td`, Select.Option
      // for `option`. Anything left is styled markup with no name.
      if (parts?.has(el)) continue;
      findings.push({ component: name, element: el });
    }
  }
  return findings;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const findings = anatomyFindings();
  for (const { component, element } of findings) {
    console.error(
      `${relative(ROOT, join(COMPONENTS, component))}: <${element}> is styled but is neither a part nor a declared internal element.`,
    );
  }
  if (findings.length) {
    console.error(
      `check-anatomy: ${findings.length} styled element(s) have no name. Expose a part, or record the element in INTERNAL with the part that renders it.`,
    );
    process.exitCode = 1;
  } else {
    console.log("check-anatomy: every styled element is a part or a declared internal element.");
  }
}
