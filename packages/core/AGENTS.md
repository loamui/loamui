# Writing against @loamui/core

A one-page summary for an agent (or a person) building an interface with
LoamUI. The full documentation is at <https://loamui.com/>, every page has a
markdown twin at the same URL with `.md` appended, and
<https://loamui.com/llms.txt> indexes them.

## Setup

Before changing dependencies or shared styles, inspect the consuming project's
instructions, installed package version, CSS delivery and layer order. Follow
<https://loamui.com/docs/agent-workflow.md>; propose concrete infrastructure
changes for approval unless already authorized. Complete additive project-local
setup within a build request's authorization before composing; ask about
conflicts or changes outside that scope.

In chat-only environments,
use the real package or provide source with explicit runtime verification gaps.
Never emulate core exports or claim unrun checks.

For project setup and missing quality tools, follow
<https://loamui.com/docs/agent-workflow.md#project-setup>. Reuse existing
tooling and the skill's maintained CSS configuration; verify the commands
after setup. Require project-owned Stylelint configuration, composition checker
files, dependencies and runnable scripts; scratchpad checks are not setup.

Install missing Modern CSS and Google Chrome Modern Web Guidance skills for the
active agent using the workflow's explicit targets. Verify discovery and read
the guidance before writing UI; report setup, guidance, commands and browser
verification separately.

Repository setup requires a React framework application with ESM support.
Follow <https://loamui.com/docs/installation.md> for Next.js App Router or
TanStack Start. For the current beta, link `https://loamui.com/loamui-core.css`
from the root document; do not bundle `@loamui/core/styles.css` in these frameworks.
Establish the layer order below at the start of the application stylesheet.
The hosted URL is unversioned; follow the installation guide's delivery limits.
Inspect existing resets and Tailwind Preflight before changing them.

Installing the skill does not install the package. An authorized setup request
can include missing dependencies. No provider is needed.

Import namespaces such as `Field` and `Alert` from `@loamui/core` or a
component entry point such as `@loamui/core/field`. Compose `Field.Root`,
`Field.Label` and `Alert.Title`; compound components always use an explicit
`.Root`. Alert has no title, icon or dismissal props on its root: use
`Alert.Title`, `Alert.Icon` and `Alert.Close`. Avatar uses `Avatar.Root`,
`Avatar.Image` and `Avatar.Fallback`; fallback content is supplied as children.

Parts are accessed through the namespace; prefixed names such as `FieldRoot`
are implementation details, not public value exports. Simple components such as
Button, Input, Checkbox and Radio remain callable. Internal markup does not
require separate public parts.

The package preserves module-level client boundaries. React Server Components
can compose individual parts with serializable props; a composition needs
`"use client"` when it uses client hooks, event handlers or render callbacks.
Static components such as `Separator`, `Card` and `Details.Root` can execute
on the server without shipping their implementation to the browser.

## Three primitives

- **Tokens**: `--loam-color-*`, `--loam-text-*`, `--loam-space-*`,
  `--loam-radius-*`, `--loam-shadow-*`, `--loam-duration-*`. Override at any
  scope to theme; use tokens for design values. Structural dimensions, aspect
  ratios and border widths remain ordinary CSS.
- **Element styles**: native HTML is already styled page-wide (headings,
  links, code, forms, tables). Write semantic markup first; reach for a
  component only when the element needs structure it does not have.
- **Components**: 48 low-level components. Their look comes from context, not
  props.

  | Category     | Components                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
  | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | Inputs       | `Field` (composable form-field primitive), `Fieldset` (group controls under a semantic label), `ErrorSummary` (list form errors as links to their fields), `Button` (trigger an action or event), `Input` (a labelled text field), `Textarea` (multi-line text input), `Select` (choose one option from a list), `DateInput` (labelled fields for a memorable date), `Checkbox` (toggle a single option on or off), `Radio` (choose one option from a set), `Switch` (an on/off toggle switch), `Range` (pick a numeric value from a range), `Search` (the page's search, as a landmark), `QuantityInput` (a count adjusted one at a time), `Rating` (stars as real inputs, or as a picture of a score), `FileInput` (choose a file, or drop it), `CopyButton` (copy a value and say so), `Combobox` (a text box with a list of suggestions under it), `PasswordInput` (a password box with a show toggle), `SegmentedControl` (choose one option from a row of segments) |
  | Data display | `Badge` (compact status or label pill), `Price` (a monetary amount, written for people), `Time` (a date or time, written for people), `Card` (a flexible surface container), `Avatar` (represent a user with an image or initials), `Table` (display rows and columns of data), `Separator` (a rule between groups of content), `Carousel` (a scroll-snap track of items, paged and announced), `Stepper` (where a sequence has got to, detected from the current step)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
  | Feedback     | `Alert` (draw attention to an important message), `Progress` (show completion of a task), `Meter` (a measurement within a known range), `Skeleton` (placeholder while content loads), `Loader` (indicate an ongoing process), `Toast` (transient notifications)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
  | Disclosures  | `Details` (native disclosure for secondary content), `Tooltip` (reveal info on hover or focus), `Modal` (a focused dialog over the page), `Drawer` (an edge-anchored panel that slides in), `Popover` (floating content anchored to a trigger), `Menu` (a list of actions opened from a trigger)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
  | Navigation   | `Tabs` (switch between related views), `SignpostLink` (signpost the way into a task), `SkipLink` (jump straight to the main content), `Breadcrumbs` (show the current page's location), `Pagination` (navigate between pages of content), `Nav` (lists of links with the current one marked)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
  | Utilities    | `VisuallyHidden` (text available to assistive technology without visible layout)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |

## Two pillars

**Modern**: use the native platform and scoped, layered CSS; contextual tokens,
element defaults and component composition work together. **Accessible**:
labels, keyboard and focus support, readable contrast and user preferences run
through all three primitives. Gatekeeping establishes trust in agent work
separately; passing a check proves only the behaviour it covers.

## The rules that matter

1. **Do not invent `size`, `variant`, `color` or `fullWidth` props.**
   Status comes from a region: `<div style={{ "--loam-context": "danger" }}>`.
   A style query is answered by ancestors, so wrap even a single control.
   Contexts: `primary | success | warning | info | danger`.

   The documented exceptions:

   - Badge, Loader, Progress and Meter keep `size`, for an intrinsic glyph or
     track.
   - Input supports the native HTML `size`.
   - Numeric bounds pass straight through as the platform's own semantics:
     Meter's `min`/`max`/`low`/`high`/`optimum`, QuantityInput's
     `min`/`max`/`step`.

2. **Size comes from the container.** Declare `container-type: inline-size`
   on a region and resolve fluid tokens on its descendants. Inherited computed
   font sizes do not re-evaluate inside a new container. A size query styles descendants,
   never the measuring element itself. In a container of 16rem or less
   a Button spans the full width.
3. **Width comes from layout.** A grid or stacked flex region stretches its
   buttons; a flex row shrink-wraps them. There is no layout prop.
4. **Compose, don't configure.** `Field.Root > Field.Label,
Field.Description, Field.Error, Input` in that order.

   - The controls self-wire: `Input`, `Select.Root`, `Textarea`, `Range.Control`,
     `QuantityInput`, `FileInput.Control`, `Search.Input`.
   - Overlays are `Modal.Root > Modal.Trigger + Modal.Popup`.
   - Swap the rendered element with `render={<a href="…" />}`.

5. **Icons are children.** `<Button><Icon /> Save</Button>`; the component
   detects the `svg`. Input accepts `startSection` and `endSection` content
   inside its bordered wrapper. Its native input receives `className`, `style`
   and `ref`; use `wrapperProps` for the surrounding box.
6. **Validation is explicit.** Set `Field.Root invalid={hasError}` and compose
   `<Field.Error>` for the message. Message IDs register after hydration; supply
   explicit `aria-describedby` links for initial server HTML. Write the message
   in the words of the question
   ("Enter your first name"), never "required" or "invalid". Show new errors
   after submission; clear displayed native constraint errors when corrected.
   Native validity cannot resolve server failures such as rejected credentials.
7. **Your own components** are a semantic element with a scoped rule:

   ```css
   @scope (.pricing-card) to ([class*="loam-"]) {
     @layer loamui.components {
       :scope {
         background: var(--loam-color-surface);
         border: 1px solid var(--loam-color-line);
         border-radius: var(--loam-radius-lg);
         padding: var(--loam-space-l);
       }
     }
   }
   ```

   Compose LoamUI parts inside it. Do not restyle a LoamUI component's
   internals; if a component needs structural overrides to fit, build the
   thing downstream instead.

Establish `@layer loamui.tokens, loamui.elements, loamui.components;` in
the earliest application stylesheet, before recipes register those layers.
A later declaration cannot reorder existing layers.

## House style for the CSS you write

The shared Stylelint configuration checks these conventions: nest
child rules with `&` instead of repeating the parent selector; use the
two-value display syntax (`display: block grid`, `display: block flex`);
use logical properties (`inline-size`, `margin-block`,
`overscroll-behavior-inline`), never physical ones; keep declarations in
alphabetical order; and put a blank line before every comment.

## Styling vocabulary you can rely on

| Attribute                                                                 | Where                  | Meaning                                                                                                                                 |
| ------------------------------------------------------------------------- | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `data-popup-open`                                                         | trigger                | its popup is open                                                                                                                       |
| `data-open`                                                               | popup or panel         | open                                                                                                                                    |
| `data-disabled`                                                           | `Pagination.Link`      | a paging link with nowhere to go                                                                                                        |
| `data-current`                                                            | nav item               | current page or location                                                                                                                |
| `data-dragging`                                                           | `FileInput.Root`       | a drag carrying files is over the box                                                                                                   |
| `data-show-label`                                                         | Rating                 | the group's name is painted as well as read                                                                                             |
| `data-read-only`                                                          | Rating                 | display mode: a picture, not inputs                                                                                                     |
| `data-size`                                                               | Badge, Progress, Meter | the `size` prop, for the stylesheet                                                                                                     |
| `data-striped` / `data-hover` / `data-col-borders` / `data-sticky-header` | Table                  | the display props (`striped`, `highlightOnHover`, `withColumnBorders`, `stickyHeader`); cap the scroller with `--loam-table-block-size` |
| `aria-invalid`                                                            | control                | explicit Field validation or native constraint state                                                                                    |

Public custom properties are `--loam-*`; anything `--_*` is private.

Read <https://loamui.com/recipes/guide.md> and the relevant component reference
before composing. The curated <https://loamui.com/recipes/> collection supplies
portable React and CSS. Verify your composition in a plain parent, at narrow and
wide sizes, with two instances and keyboard interaction, in both colour schemes.
Use `useId` for repeated ID relationships and disclosure groups. Keep preview
frames and gallery loading out of copied code; report checks actually performed.
