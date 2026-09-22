---
title: Table
description: Display rows and columns of data.
---

> LoamUI documentation, generated from the same source as the live page —
> treat it as authoritative for `@loamui/core`.

# Table

A styled data table composed from native thead/tbody/tr/th/td markup.

## Import

```tsx
import { Table } from "@loamui/core";
```

## Usage

### Basic usage

The whole table is composed from parts: Caption names it, Thead and Tbody group the rows, Th marks a header cell and Td a data cell. Each one renders the native element it is named for, so the markup stays a real table and the scope styles it.

```tsx
<Table.Root>
  <Table.Caption>Invoices</Table.Caption>
  <Table.Thead>
    <Table.Tr>
      <Table.Th scope="col">Invoice</Table.Th>
      <Table.Th scope="col">Status</Table.Th>
      <Table.Th scope="col">Amount</Table.Th>
    </Table.Tr>
  </Table.Thead>
  <Table.Tbody>
    <Table.Tr>
      <Table.Td>INV-1024</Table.Td>
      <Table.Td>Paid</Table.Td>
      <Table.Td>$1,240.00</Table.Td>
    </Table.Tr>
    <Table.Tr>
      <Table.Td>INV-1025</Table.Td>
      <Table.Td>Pending</Table.Td>
      <Table.Td>$820.00</Table.Td>
    </Table.Tr>
    <Table.Tr>
      <Table.Td>INV-1026</Table.Td>
      <Table.Td>Paid</Table.Td>
      <Table.Td>$2,010.00</Table.Td>
    </Table.Tr>
    <Table.Tr>
      <Table.Td>INV-1027</Table.Td>
      <Table.Td>Overdue</Table.Td>
      <Table.Td>$640.00</Table.Td>
    </Table.Tr>
  </Table.Tbody>
</Table.Root>
```

### Striped

Shade alternating body rows. Stripes help the eye hold a row across many columns; on a short, narrow table like this one they are noise, so reach for them when rows are long, not by default.

```tsx
<Table.Root striped>{/* caption / thead / tbody */}</Table.Root>
```

### Column borders

Draw vertical borders between columns. Padding already separates columns of short values; borders earn their place when cells hold text that wraps, or numbers that would otherwise run into their neighbours.

```tsx
<Table.Root withColumnBorders>{/* caption / thead / tbody */}</Table.Root>
```

### Highlight on hover

Shade the row under the pointer; the highlight appears on pointer hover, so it is not visible in a static screenshot.

```tsx
<Table.Root highlightOnHover>{/* caption / thead / tbody */}</Table.Root>
```

### Search and sort

A sortable column is a Table.Th carrying the current sort and a Table.SortButton inside it. The parts announce and style; you hold the state, filter and sort the rows, and pass the result back as sort.

```tsx
const [sort, setSort] = useState({ column: "name", direction: "ascending" });

<Table.Root>
  <Table.Caption>People</Table.Caption>
  <Table.Thead>
    <Table.Tr>
      {columns.map((column) => (
        <Table.Th
          key={column.key}
          sort={sort.column === column.key ? sort.direction : "none"}
        >
          <Table.SortButton
            onSortChange={(direction) => setSort({ column: column.key, direction })}
          >
            {column.label}
          </Table.SortButton>
        </Table.Th>
      ))}
    </Table.Tr>
  </Table.Thead>
  <Table.Tbody>{sortedRows.map((row) => …)}</Table.Tbody>
</Table.Root>
```

### Wider than its container

The table scrolls in place instead of stretching the page. Only once it overflows does the wrapper become a focusable region named by the caption, so Tab reaches it and the arrow keys scroll it; the same table in a wider container adds no tab stop. Without a caption the region is named by labels.scrollable.

```tsx
<Table.Root>
  <Table.Caption>Invoices by quarter</Table.Caption>
  <Table.Thead>
    <Table.Tr>
      <Table.Th scope="col">Invoice</Table.Th>
      <Table.Th scope="col">Status</Table.Th>
      <Table.Th scope="col">Q1</Table.Th>
      <Table.Th scope="col">Q2</Table.Th>
      <Table.Th scope="col">Q3</Table.Th>
      <Table.Th scope="col">Q4</Table.Th>
      <Table.Th scope="col">Total</Table.Th>
    </Table.Tr>
  </Table.Thead>
  <Table.Tbody>
    <Table.Tr>
      <Table.Td>INV-1024</Table.Td>
      <Table.Td>Paid</Table.Td>
      <Table.Td>$310.00</Table.Td>
      <Table.Td>$310.00</Table.Td>
      <Table.Td>$310.00</Table.Td>
      <Table.Td>$310.00</Table.Td>
      <Table.Td>$1,240.00</Table.Td>
    </Table.Tr>
    …
  </Table.Tbody>
</Table.Root>
```

### Sticky header

A long table capped in height scrolls in place, and stickyHeader keeps the column names at the top of the scroller while the rows pass beneath. The cap is --loam-table-block-size on the component's own element, so no wrapper is needed; once the rows overflow it, the wrapper becomes the same focusable region as a wide table does, named by the caption. The header cells take an opaque surface and their own bottom edge, which travels with them.

```tsx
<Table.Root stickyHeader style={{ "--loam-table-block-size": "14rem" }}>
  <Table.Caption>Invoices</Table.Caption>
  <Table.Thead>
    <Table.Tr>
      <Table.Th scope="col">Invoice</Table.Th>
      <Table.Th scope="col">Status</Table.Th>
      <Table.Th scope="col">Amount</Table.Th>
    </Table.Tr>
  </Table.Thead>
  <Table.Tbody>
    <Table.Tr>
      <Table.Td>INV-1024</Table.Td>
      <Table.Td>Paid</Table.Td>
      <Table.Td>$1,240.00</Table.Td>
    </Table.Tr>
    …
  </Table.Tbody>
</Table.Root>
```

### Caption below the table

Caption placement is the platform's own caption-side property, set on the <table> through tableProps (or a class of your own).

```tsx
<Table.Root tableProps={{ style: { captionSide: "bottom" } }}>
  <Table.Caption>Recent invoices by status</Table.Caption>
  {/* thead / tbody */}
</Table.Root>
```

## When to use it

- To compare structured records across shared attributes: rows are things, columns are facts about them, and the grid is what makes scanning a column meaningful.
- When users need to run their eye down one attribute across many records: amounts, statuses, dates.

## When not to

- For page layout. A table announces row and column semantics to assistive tech, and non-tabular content wrapped in those semantics becomes a maze to navigate. Use CSS grid.
- For records with one attribute each. That is a list; a one-column table adds table navigation overhead for nothing.
- When each record is rich, heterogeneous content. A grid of Cards reads better than cells straining to hold paragraphs.

## How it works

### The markup is yours: keep it semantic

Table styles native thead/tbody/tr/th/td and re-implements nothing, so whatever semantics you write are exactly what assistive tech receives. That cuts both ways: mark header cells <th scope="col"> (or scope="row" for row headers) so each data cell is announced with its headers, and never reach for a table where the content is not tabular.

### Wide tables scroll in place

The component's own element is a scroll wrapper (overflow: auto), so an overflowing table scrolls horizontally within its own container instead of stretching the page; only when it overflows does the wrapper become a focusable, labelled region, so a page of narrow tables adds no tab stops. The same wrapper scrolls vertically once --loam-table-block-size caps it, and stickyHeader keeps the header row at the top of that scroll. className, ref and the rest land on that wrapper; the <table> takes tableProps. Whether a table should instead reflow into cards or lists on small screens is your layout call. The component keeps the table a table and makes overflow survivable.

### Sorting is announced as well as drawn

A sortable column is Table.Th with sort and a Table.SortButton inside it. The cell carries aria-sort, which is what assistive technology reads as the column's state, and the button's hidden text says what a press will do ("Name sort descending"), so the control is understood before it is pressed. The arrow is drawn by the stylesheet from that same aria-sort, so state is declared once. The component never sorts the data: onSortChange asks for ascending or descending, you sort the rows and pass the result back, and a column that is sortable but not sorted says so with sort="none".

### Caption every table

A <caption> names the table in its own words: it is what screen readers announce when listing the page's tables, and what sighted users read to know whether to bother scanning. The platform's caption-side property places it above or below (tableProps={{ style: { captionSide: 'bottom' } }}); a heading near the table is not a substitute, because it is not programmatically attached.

## Accessibility

- Renders a native <table>: row and column navigation, header association and table announcement all come from the platform, provided your markup supplies th, scope and caption.
- Give every table a <caption>: it is the table's accessible name, announced when screen-reader users list or enter the table.
- Mark header cells with scope (<th scope="col"> in thead, <th scope="row"> for row headers) so data cells are read with their headers as context.
- The scroll wrapper keeps horizontal overflow inside the component, so zoomed-in and small-viewport users scroll the table, not the whole page.
- When the table overflows its container, the wrapper becomes a focusable role="region" so keyboard users can reach it and scroll; it is named by the table's own <caption> when there is one, and by labels.scrollable ("Scrollable table") otherwise. A table that fits adds no tab stop.
- striped and highlightOnHover are visual aids only: never encode meaning in row shading, because assistive tech does not announce it.
- A sortable header is a <th aria-sort> holding a real <button>, so it is reached by Tab and toggled with Enter or Space; the button's name is the column plus a hidden suffix saying what a press will do, and labels.sort replaces those words.

## Parts

### Table.Root

The table and its scroll wrapper; compose native table elements inside it.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `striped` | `boolean` | — | Shade alternating body rows. |
| `highlightOnHover` | `boolean` | — | Highlight the row under the pointer. |
| `withColumnBorders` | `boolean` | — | Draw vertical borders between columns. |
| `stickyHeader` | `boolean` | — | Keep the header row in view while the body scrolls beneath it. The scroller is the component's own element: cap it with --loam-table-block-size (or the layout around it). |
| `tableProps` | `TableHTMLAttributes & { ref }` | — | Attributes for the <table> itself (caption-side, ref, id). |
| `labels` | `{ scrollable?: string }` | `{ scrollable: "Scrollable table" }` | The scroll region's name when the table overflows and has no <caption>. |
| `...others` | `HTMLAttributes<HTMLDivElement> & { ref }` | — | All native <div> props land on the scroll wrapper, the component's own element. |

### Table.Th

A header cell: <th scope="col"> by default (scope is forwarded for row headers). With sort it carries aria-sort and gives the SortButton inside it the current state. Must be inside Table.Root.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `sort` | `"ascending" \| "descending" \| "none"` | — | The column's current sort, emitted as aria-sort. "none" marks a column that can be sorted but is not; omit it for a header that is not sortable. |

### Table.SortButton

The control in a sortable header: a LoamUI Button that toggles the column's sort. Its children are the column name; native <button> props are forwarded. Must be inside a Table.Th with sort.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `onSortChange` | `(next: "ascending" \| "descending") => void` | — | Called with the sort a press asks for: ascending from none or descending, descending from ascending. Sort the rows and pass the result back as the Th's sort. |
| `labels` | `{ sort?: (column: string, next: SortDirection) => string }` | `{ sort: (column, next) => ` sort ${next}` }` | The hidden text after the column name that says what a press will do; column is the children when they are text. |

## Custom properties

| Property | Syntax | Default | Description |
| --- | --- | --- | --- |
| `--loam-table-block-size` | `CSS length \| none` | `none` | The most the scroll wrapper may grow to, as its max-block-size. Set it and a longer table scrolls in place, the wrapper becoming a focusable region named by the caption once the rows overflow; pair it with stickyHeader to keep the column names in view. |

