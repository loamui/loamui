---
title: FAQ
description: Four questions with visible answers on a subtle surface, beneath a heading and a direct contact link.
---

> LoamUI documentation, generated from the same source as the live page —
> treat it as authoritative for `@loamui/core`.

# FAQ

Four questions with visible answers on a subtle surface, beneath a heading and a direct contact link.

A recipe in **Content**: a component and a stylesheet built from `@loamui/core`, to copy into a project and change. Both files are below, exactly as the live preview renders them.

- Uses: element styles and tokens only
- Tags: faq, questions, surface, help
- Live: https://loamui.com/recipes/content/faq

## Using this recipe

Copy both files side by side into your React framework project. Install `@loamui/core` and load the core stylesheet at the application root, following the framework-specific installation guide.

Replace the sample policies with accurate answers for the organisation and connect the contact destination. Keep essential ordering information in the ordering flow too. Give distinct FAQ sections distinct headings, and use the appropriate heading levels.

## When to use

Use for a short set of questions readers need to scan, search and compare. Keep these answers visible; reserve disclosure controls for genuinely optional supporting detail.

## Design decisions

These notes explain the design. The included tests cover structure and selected interactions; check contrast, keyboard behavior and assistive technology support in your application.

- **Modern.** A section named by its heading, with a native list grouping four questions, each a heading followed by its answer; the contact link is an ordinary anchor and every answer is available without client-side interaction. The section measures a readable inner column through layered, scoped rules that use fluid typography and spacing tokens, logical separators, and mutually exclusive container queries for the outer padding. It stays a plain neutral surface rather than a --loam-context region: questions carry no status, so nothing inside should take a status colour.
- **Accessible.** All answers remain visible for scanning, browser search and comparison. Headings expose the question structure, the contact link offers a next step, and a forced-colour border preserves the section boundary.

## References

- [Installation](https://loamui.com/docs/installation.md)
- [Tokens](https://loamui.com/docs/tokens.md)
- [Element styles](https://loamui.com/docs/element-styles.md)

## Recipe.tsx

```tsx
import { useId } from "react";
import "./recipe.css";

export default function Recipe() {
  const instanceId = useId();
  return (
    <section className="faq" aria-labelledby={`${instanceId}-faq-title`}>
      <div className="inner">
        <header>
          <h2 id={`${instanceId}-faq-title`}>Questions about the nursery</h2>
          <p>
            Ordering, membership and growing for the co-op. For anything else,{" "}
            <a href="/contact">contact the nursery</a>.
          </p>
        </header>
        <ul className="questions" role="list">
          <li>
            <h3>Where do you deliver?</h3>
            <p>
              Enter your delivery address at the basket to see the options and cost for your order.
              Plants and bare-root fruit have different delivery options from seed packets;
              collection from the nursery is also available.
            </p>
          </li>
          <li>
            <h3>What if a packet does not come up?</h3>
            <p>
              Tell us the variety and the harvest year on the packet and we send a replacement from
              a different batch, or refund it. Germination is tested before listing, but a cold
              spring can still beat a good batch.
            </p>
          </li>
          <li>
            <h3>Can a school or allotment society join?</h3>
            <p>
              Yes, as a group member. A group pays the household rate, receives the twelve packets
              as one parcel and can send up to four people to each workshop.
            </p>
          </li>
          <li>
            <h3>How do I grow something for the bench?</h3>
            <p>
              Ask at the nursery or write to the bench. A grower takes on one variety, keeps it the
              required distance from its relatives, and brings the cleaned seed in after harvest for
              testing.
            </p>
          </li>
        </ul>
      </div>
    </section>
  );
}
```

## recipe.css

```css
@scope (.faq) to ([class*="loam-"]) {
  @layer loamui.components {
    :scope {
      background: var(--loam-color-bg-subtle);
      border-radius: var(--loam-radius-xl);
      container: faq / inline-size;
    }

    div.inner {
      display: block grid;
      font-size: var(--loam-text-md);
      gap: var(--loam-space-l);
      grid-template-columns: minmax(0, 1fr);
      margin-inline: auto;
      max-inline-size: 44rem;
      overflow-wrap: anywhere;
    }

    header {
      display: block grid;
      gap: var(--loam-space-2xs);
      grid-template-columns: minmax(0, 1fr);
      justify-items: center;
      text-align: center;

      > p {
        color: var(--loam-color-fg-muted);
        margin-block: 0;
        max-inline-size: var(--loam-measure);
        text-wrap: pretty;
      }
    }

    h2 {
      margin-block: 0;
      max-inline-size: 24ch;
      text-wrap: balance;
    }

    ul.questions {
      display: block grid;
      gap: var(--loam-space-s);
      grid-template-columns: minmax(0, 1fr);
      list-style: none;
      margin-block: 0;
      padding: 0;
    }

    li {
      display: block grid;
      gap: var(--loam-space-3xs);
      grid-template-columns: minmax(0, 1fr);
      margin-block: 0;

      + li {
        border-block-start: 1px solid var(--loam-color-line);
        padding-block-start: var(--loam-space-s);
      }
    }

    h3,
    li > p {
      margin-block: 0;
    }

    @container faq (inline-size < 48rem) {
      div.inner {
        padding: var(--loam-space-l) var(--loam-space-s);
      }
    }

    @container faq (inline-size >= 48rem) {
      div.inner {
        padding: calc(var(--loam-space-l) * 2) var(--loam-space-l);
      }
    }

    @media (forced-colors: active) {
      :scope {
        border: 1px solid CanvasText;
      }
    }
  }
}
```

