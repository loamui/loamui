---
title: Article card
description: One article in a Card: a picture, a category and date, a linked title, its opening lines and the author at the foot.
---

> LoamUI documentation, generated from the same source as the live page —
> treat it as authoritative for `@loamui/core`.

# Article card

One article in a Card: a picture, a category and date, a linked title, its opening lines and the author at the foot.

A recipe in **Cards**: a component and a stylesheet built from `@loamui/core`, to copy into a project and change. Both files are below, exactly as the live preview renders them.

- Uses: `Avatar`, `Badge`, `Card`, `Time`
- Tags: post, news, teaser, blog card
- Live: https://loamui.com/recipes/cards/article-card

## Using this recipe

Copy both files side by side into your React framework project. Install `@loamui/core` and load the core stylesheet at the application root, following the framework-specific installation guide.

Replace the sample article and author destinations with real routes. Keep heading levels appropriate to the surrounding page. Replace the decorative illustration and its responsive sources together; supply alt text if the image adds information beyond the title.

## When to use

Use to preview one article with its date, author and reading destination. Choose Article carousel when readers need to browse a collection horizontally.

## Design decisions

These notes explain the design. The included tests cover structure and selected interactions; check contrast, keyboard behavior and assistive technology support in your application.

- **Modern.** The Card is rendered as an article named by its own heading, the author sits in an address element with rel="author", and the date is a time with a machine-readable dateTime. Layered, donut-scoped CSS preserves the Card surface while a measured inner column resolves fluid type and spacing locally; an auto margin aligns bylines in equal-height cards without truncating the description, and responsive, lazy images reserve their aspect ratio.
- **Accessible.** The title is the link and the card is not, so the link's name is the title alone; the picture illustrates the title, so its alt is empty; the avatar is hidden because the name is printed beside it.

## References

- [Installation](https://loamui.com/docs/installation.md)
- [Tokens](https://loamui.com/docs/tokens.md)
- [Element styles](https://loamui.com/docs/element-styles.md)
- [Avatar](https://loamui.com/docs/components/avatar.md)
- [Badge](https://loamui.com/docs/components/badge.md)
- [Card](https://loamui.com/docs/components/card.md)
- [Time](https://loamui.com/docs/components/time.md)

## Recipe.tsx

```tsx
import { useId } from "react";
import { Avatar, Badge, Card, Time } from "@loamui/core";
import "./recipe.css";

export default function Recipe() {
  const title = useId();
  return (
    <Card render={<article className="article-card" aria-labelledby={title} />}>
      <div className="body">
        <img
          className="media"
          src="https://picsum.photos/id/292/800/450"
          alt=""
          width="800"
          height="450"
          loading="lazy"
          sizes="auto, 100vw"
          srcSet="https://picsum.photos/id/292/400/225 400w, https://picsum.photos/id/292/800/450 800w"
        />
        <p className="meta">
          <Badge.Root>
            <Badge.Text>Guide</Badge.Text>
          </Badge.Root>
          <Time value="2026-09-01" locale="en-GB" dateStyle="long" />
        </p>
        <h3 id={title}>
          <a href="/guides/overwintering-onions">Overwintering onions from sets</a>
        </h3>
        <p className="description">
          Sets planted in the last week of September root before the frosts and bulb up six weeks
          ahead of a spring planting. Which varieties hold through a wet winter, how far apart to
          set them, and what to do about the ones that bolt.
        </p>
        <div className="foot">
          <Avatar.Root aria-hidden>
            <Avatar.Fallback>RV</Avatar.Fallback>
          </Avatar.Root>
          <address>
            <a href="/growers/rhiannon-vaughan" rel="author">
              Rhiannon Vaughan
            </a>
          </address>
        </div>
      </div>
    </Card>
  );
}
```

## recipe.css

```css
@scope (.article-card) to ([class*="loam-"]) {
  @layer loamui.components {
    :scope {
      container-type: inline-size;
      display: block grid;
      grid-template-columns: minmax(0, 1fr);
      max-inline-size: 36rem;
    }

    div.body {
      display: block flex;
      flex-direction: column;
      font-size: var(--loam-text-md);
      gap: var(--loam-space-2xs);
      overflow-wrap: anywhere;
    }

    img.media {
      aspect-ratio: 16 / 9;
      block-size: auto;
      border-radius: var(--loam-radius-md);
      inline-size: 100%;
      object-fit: cover;
    }

    p.meta {
      align-items: center;
      color: var(--loam-color-fg-muted);
      display: block flex;
      flex-wrap: wrap;
      font-size: var(--loam-text-sm);
      gap: var(--loam-space-2xs);
      margin-block: 0;
    }

    h3 {
      margin-block: 0;
    }

    p.description {
      color: var(--loam-color-fg-muted);
      margin-block: 0;
    }

    div.foot {
      --loam-avatar-size: 2rem;

      align-items: center;
      display: block flex;
      gap: var(--loam-space-2xs);
      margin-block-start: auto;
      padding-block-start: var(--loam-space-2xs);
    }

    address {
      font-size: var(--loam-text-sm);
      font-style: normal;
      font-weight: 600;
    }
  }
}
```

