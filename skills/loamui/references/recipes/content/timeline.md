---
title: Timeline
description: Five dated events in order, each with a marker, a date, a title and a line, joined by a hairline.
---

> LoamUI documentation, generated from the same source as the live page —
> treat it as authoritative for `@loamui/core`.

# Timeline

Five dated events in order, each with a marker, a date, a title and a line, joined by a hairline.

A recipe in **Content**: a component and a stylesheet built from `@loamui/core`, to copy into a project and change. Both files are below, exactly as the live preview renders them.

- Uses: element styles and tokens only
- Tags: history, events, dates, changelog, milestones
- Live: https://loamui.com/recipes/content/timeline

## Using this recipe

Copy both files side by side into your React framework project. Install `@loamui/core` and load the core stylesheet at the application root, following the framework-specific installation guide.

Replace the fictional history with chronological events and valid machine-readable dates. Select heading levels to fit the surrounding section. This presents a static history; use Stepper for progress through an interactive task.

## When to use

Use for dated events in chronological order. Choose the Stepper component for progress through a task rather than adapting this history layout.

## Design decisions

These notes explain the design. The included tests cover structure and selected interactions; check contrast, keyboard behavior and assistive technology support in your application.

- **Modern.** An ol carries the order and a time element carries each date with its machine-readable value, while the dots and the connecting line are pseudo-elements, so nothing decorative reaches the accessibility tree. Layered scoped CSS measures the list through its outer wrapper, so each event and its connector resolve the same spacing tokens; named grid areas position the content, lh centres the decorative dot on the date line, and a negative margin joins the gaps.
- **Accessible.** The list keeps role=list so its count survives list-style: none, and in forced colours the dot keeps an outline and the connector its ink where the fills would vanish.

## References

- [Installation](https://loamui.com/docs/installation.md)
- [Tokens](https://loamui.com/docs/tokens.md)
- [Element styles](https://loamui.com/docs/element-styles.md)

## Recipe.tsx

```tsx
import "./recipe.css";

export default function Recipe() {
  return (
    <div className="timeline">
      <ol role="list">
        <li>
          <time dateTime="2014-04">April 2014</time>
          <h3>Three allotments and a kitchen table</h3>
          <p>
            Five growers on the Ludlow allotments pool the seed they have saved and post packets to
            friends who ask.
          </p>
        </li>
        <li>
          <time dateTime="2016-01">January 2016</time>
          <h3>The first catalogue</h3>
          <p>
            Forty varieties in a photocopied booklet, sold from a trestle table at the winter
            market.
          </p>
        </li>
        <li>
          <time dateTime="2019-03">March 2019</time>
          <h3>Registered as a co-operative</h3>
          <p>
            Hedgerow becomes a community benefit society: one member, one vote, and the surplus goes
            back into growing.
          </p>
        </li>
        <li>
          <time dateTime="2022-05">May 2022</time>
          <h3>The nursery opens at Bromfield</h3>
          <p>
            Two acres, a polytunnel and a drying barn, with trial beds any member can walk on open
            days.
          </p>
        </li>
        <li>
          <time dateTime="2025-09">September 2025</time>
          <h3>A thousand members</h3>
          <p>The thousandth member joins the week the catalogue passes four hundred varieties.</p>
        </li>
      </ol>
    </div>
  );
}
```

## recipe.css

```css
@scope (.timeline) to ([class*="loam-"]) {
  @layer loamui.components {
    :scope {
      container-type: inline-size;
    }

    ol {
      --_dot: 0.875rem;
      --_gap: var(--loam-space-s);

      display: block grid;
      font-size: var(--loam-text-md);
      gap: var(--_gap);
      grid-template-columns: minmax(0, 1fr);
      list-style: none;
      margin-block: 0;
      overflow-wrap: anywhere;
      padding: 0;
    }

    li {
      display: block grid;
      gap: var(--loam-space-3xs) var(--loam-space-xs);
      grid-template-areas:
        "dot date"
        "dot title"
        "dot description";
      grid-template-columns: var(--_dot) minmax(0, 1fr);
      margin-block: 0;

      &::before {
        background: var(--loam-color-primary-strong);
        block-size: var(--_dot);
        border-radius: var(--loam-radius-full);
        box-shadow: 0 0 0 3px var(--loam-color-bg);
        content: "";
        font-size: var(--loam-text-sm);
        grid-area: dot;
        inline-size: var(--_dot);
        margin-block-start: calc((1lh - var(--_dot)) / 2);
        z-index: 1;
      }

      &:not(:last-child)::after {
        border-inline-start: 1px solid var(--loam-color-line-strong);
        content: "";
        grid-area: dot;
        justify-self: center;
        margin-block: var(--_dot) calc(-1 * var(--_gap));
      }
    }

    time {
      color: var(--loam-color-fg-muted);
      font-size: var(--loam-text-sm);
      font-variant-numeric: lining-nums tabular-nums;
      grid-area: date;
    }

    h3 {
      grid-area: title;
      margin-block: 0;
    }

    p {
      color: var(--loam-color-fg-muted);
      grid-area: description;
      margin-block: 0;
      max-inline-size: var(--loam-measure);
      text-wrap: pretty;
    }

    @media (forced-colors: active) {
      li {
        &::before {
          border: 1px solid CanvasText;
        }

        &::after {
          border-color: CanvasText;
        }
      }
    }
  }
}
```

