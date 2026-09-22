---
title: Typography
description: How the type scale, rhythm and figures work, and how to build your own domain-specific typography on top of them.
---

> LoamUI documentation, generated from the same source as the live page —
> treat it as authoritative for `@loamui/core`.

# Typography

Type is set by two primitives working together: the [tokens](/docs/tokens) supply a fluid scale, and the [element styles](/docs/element-styles) apply it to native headings and text. You get a readable, rhythmic page before writing a line of CSS, and a small vocabulary to build your own type on top.

## A fluid scale, tuned per container

Each type token uses `clamp()` and container-relative units to adjust within bounds. The scale itself changes shape as space allows.

Narrow, the steps follow a 1.125 ratio (a "major second"): a gentle progression that keeps headings close to body copy where width is tight. Wide, the same steps open to 1.25 (a "major third"), giving headings more presence when there is room to spend.

To give a sidebar or main column its own scale, establish a measuring ancestor with
`container-type: inline-size`. Font tokens resolved on descendants then respond to
that container's inline size. Without an eligible container, `cqi` falls back to the
small viewport's inline size.

Headings resolve their font tokens through the element styles. Body text normally
inherits an already computed font size, which does not recalculate merely because
you introduce a new container. Resolve `font-size: var(--loam-text-md)` on a content
element inside the measuring container to give its body text the local scale.
The [Tokens guide](/docs/tokens) shows the complete scoped pattern
for locally responsive type and spacing.

The rhythm is not only horizontal. Leading is derived from each element's own size (`calc(0.5rem + 2ex)`), so larger type gets proportionally tighter line-height without a table of values. Vertical spacing is additive: every block carries a block-end margin, and the extra room before a heading comes from an adjacent-sibling rule, so nothing needs unsetting.

## Two families, and considered figures

Body text uses `--loam-font` and headings use `--loam-font-display`, so a design can pin two complementary typefaces without touching a component.

The element styles also switch on the OpenType features that make text read well: old-style proportional figures in running prose, lining figures in headings, common ligatures, and hanging punctuation. Where numbers must align in a column, ask for tabular figures — the machinery is already there to answer.

## Typography components are yours to name

There is no `Heading` or `Text` component, because meaningful typography is domain-specific: a news site wants a headline, a byline and a lede; a documentation site wants a page title and a callout. Those names belong to your product, not to a general library. Build them from the two primitives, a semantic element for structure and a scoped rule for the treatment:

Load the core stylesheet first, following [Installation](/docs/installation). These
rules belong in `loamui.components`, above the element defaults. Each scope owns a
single text element; a composition containing other components also needs a scope
limit, as shown in [Building your own recipes](/recipes/guide).

```css
@scope (h1.headline) {
  @layer loamui.components {
    :scope {
      font-variant-caps: small-caps;
    }
  }
}

@scope (p.byline) {
  @layer loamui.components {
    :scope {
      color: var(--loam-color-fg-muted);
      font-size: var(--loam-text-sm);
    }
  }
}
```

> Reach for a scoped class on a semantic element, style it with tokens, and you have a typography
> component that themes through the cascade and works outside React. The primitives do the reading
> research; you supply the vocabulary.
