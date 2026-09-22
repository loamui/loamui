---
title: Layout
description: Layout is native CSS. Pick the module that fits the shape of the content, and space it with the space tokens.
---

> LoamUI documentation, generated from the same source as the live page —
> treat it as authoritative for `@loamui/core`.

# Layout

LoamUI ships no layout components. Layout is a native CSS concern, and the platform already has four layout modules that cover the cases a UI runs into. Pick the one that fits the shape of the content, write it in the component that owns that content, and reach for the space tokens for every gap.

Load the core stylesheet first, following [Installation](/docs/installation). The examples
place composition rules in `loamui.components` and scope them to the layout's root.
The scope limit protects embedded LoamUI components from descendant selectors; their
tokens still inherit. Add layout to the region without restyling the controls inside it.

## Pick the module by the shape of the content

Each module answers a different question. Match it to what you are arranging, not to a breakpoint.

| The content | The module | The core declaration |
| - | - | - |
| A page of prose | Flow | nothing; block layout is the default |
| A dense dashboard | Grid | `display: block grid` with `subgrid` for alignment |
| A row of controls | Flex | `display: block flex` |
| A long article | Multi-column | `columns` |

### Flow, for a documentation page

Normal flow stacks blocks in source order. LoamUI’s element styles provide the spacing between headings, paragraphs and other content. For custom spacing, use space tokens in scoped margin rules. Use `gap` when arranging children with grid or flexbox.

### Grid, for an information-dense dashboard

Grid is the two-dimensional module: use it when rows and columns both matter. Prefer intrinsic, fluid track sizing over media queries. `repeat(auto-fit, minmax(min(16rem, 100%), 1fr))` lays out as many equal columns as fit and reflows itself as the container resizes, with no breakpoints to maintain. When sibling cards must align their internal rows, give them `grid-template-rows: subgrid`.

```css
@scope (.dashboard) to ([class*="loam-"]) {
  @layer loamui.components {
    :scope {
      display: block grid;
      gap: var(--loam-space-s);
      grid-template-columns: repeat(auto-fit, minmax(min(16rem, 100%), 1fr));
    }
  }
}
```

### Flex, for a one-dimensional control row

Flex is the one-dimensional module: a row (or column) of items that share a line and wrap when they run out of room. It is the right tool for a button group, a toolbar, or a label beside its control. Let it wrap, align it `safe` so a focused item is never clipped, and space it with a token.

```css
@scope (.actions) to ([class*="loam-"]) {
  @layer loamui.components {
    :scope {
      align-items: safe center;
      display: block flex;
      flex-wrap: wrap;
      gap: var(--loam-space-2xs);
    }
  }
}
```

### Multi-column, for a long article

Multi-column flows a single stream of text across balanced columns, the way a newspaper does. Set a column width and let the browser decide the count from the available space.

```css
@scope (.article) to ([class*="loam-"]) {
  @layer loamui.components {
    :scope {
      columns: 18rem;
      gap: var(--loam-space-l);
    }
  }
}
```

## Space with tokens, not numbers

Whichever module you pick, the gaps come from the fluid space scale, not hard-coded lengths. A token gap grows a little on a wide container and tightens on a narrow one, so a layout keeps its rhythm across sizes without a single media query.

```css
/* the scale, smallest to largest */
gap: var(--loam-space-3xs); /* 4px  → 4.5px  */
gap: var(--loam-space-2xs); /* 8px  → 9px    */
gap: var(--loam-space-xs); /* 12px → 13.5px */
gap: var(--loam-space-s); /* 16px → 18px   */
gap: var(--loam-space-l); /* 24px → 27px   */
```

> The same discipline the components use is available to your own layouts: a native module for
> structure, a space token for every gap, and a container query where a piece needs to respond to
> its own width rather than the viewport's.
