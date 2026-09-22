---
title: Banner with background image
description: The same fruit-plant offer as Banner with image, with its deadline, heading, description and link over a full-width raspberry photograph.
---

> LoamUI documentation, generated from the same source as the live page —
> treat it as authoritative for `@loamui/core`.

# Banner with background image

The same fruit-plant offer as Banner with image, with its deadline, heading, description and link over a full-width raspberry photograph.

A recipe in **Banners**: a component and a stylesheet built from `@loamui/core`, to copy into a project and change. Both files are below, exactly as the live preview renders them.

- Uses: `Badge`, `SignpostLink`
- Tags: promotion, background, image, full-width, call to action
- Live: https://loamui.com/recipes/banners/banner-background-image

## Using this recipe

Copy both files side by side into your React framework project. Install `@loamui/core` and load the core stylesheet at the application root, following the framework-specific installation guide.

Replace the sample offer, closing date, photograph and destination with your own; use the heading level appropriate to the surrounding page. Keep Badge labels short and put longer details in the adjacent wrapping text. Both banners demonstrate a promotion below the initial viewport: loading="lazy" and sizes="auto, 100vw" let the browser choose a rendition from the rendered image width, with a conservative viewport fallback. For a banner visible on first load, remove lazy loading and auto from sizes; set a layout-appropriate size hint and use high fetch priority only if this is the page’s critical image. Supply appropriately cropped renditions through your own image pipeline. useId only connects each section to its heading; this synchronous component needs no client directive.

## When to use

Use for one short promotion within a page, with a decorative image filling the section. Choose a hero when the content introduces the whole page.

## Design decisions

These notes explain the design. The included tests cover structure and selected interactions; check contrast, keyboard behavior and assistive technology support in your application.

- **Modern.** A section named by its h2 promotes one destination, and the decorative photograph is an img with empty alt, explicit dimensions and lazy loading for a promotion below the fold. Its stylesheet lives in loamui.components inside a donut scope, measuring the header’s fluid token spacing and type through container queries rather than the viewport: the text takes the leading column of a 3:2 grid from 44rem and fills one column below that, with the photograph covering the whole section. Contextualism carries the rest — the surrounding colour scheme resolves the background, scrim, text and link tokens together, and the eyebrow declares the primary brand context so the offer Badge inherits it without a prop, because a promotion does not imply a warning.
- **Accessible.** useId names repeated regions independently. A solid background, full foreground text and an 88% scheme-aware background-token scrim protect the words even if the photograph fails; recheck contrast when changing either. Content determines the height and grows with enlarged text. Focus rings are not clipped. Forced colours remove the decorative image and scrim, leaving system colours and a visible border.

## References

- [Installation](https://loamui.com/docs/installation.md)
- [Tokens](https://loamui.com/docs/tokens.md)
- [Element styles](https://loamui.com/docs/element-styles.md)
- [Badge](https://loamui.com/docs/components/badge.md)
- [SignpostLink](https://loamui.com/docs/components/signpost-link.md)

## Recipe.tsx

```tsx
import { useId } from "react";
import { Badge, SignpostLink } from "@loamui/core";
import "./recipe.css";

export default function Recipe() {
  const titleId = useId();
  return (
    <section className="banner-background-image" aria-labelledby={titleId}>
      <img
        src="https://picsum.photos/id/429/800/600"
        srcSet="https://picsum.photos/id/429/400/300 400w, https://picsum.photos/id/429/800/600 800w, https://picsum.photos/id/429/1600/1200 1600w"
        sizes="auto, 100vw"
        alt=""
        width="1600"
        height="1200"
        loading="lazy"
      />
      <div>
        <div className="copy">
          <p className="eyebrow">
            <Badge.Root>
              <Badge.Text>Offer</Badge.Text>
            </Badge.Root>
            <span>Until 30 November · bare-root season</span>
          </p>
          <h2 id={titleId}>Members save 20% on fruit plants</h2>
          <p className="description">
            Apples, pears, plums and soft fruit on local rootstocks, lifted the week they are
            posted. Order before the end of November and the discount comes off at the basket.
          </p>
          <div className="actions">
            <SignpostLink href="/catalogue/fruit">See the fruit list</SignpostLink>
          </div>
        </div>
      </div>
    </section>
  );
}
```

## recipe.css

```css
@scope (.banner-background-image) to ([class*="loam-"]) {
  @layer loamui.components {
    :scope {
      background: var(--loam-color-bg);
      border: 1px solid var(--loam-color-line);
      border-radius: var(--loam-radius-xl);
      color: var(--loam-color-fg);
      container: banner-background-image / inline-size;
      isolation: isolate;
      position: relative;

      &::before {
        background: color-mix(in oklch, var(--loam-color-bg) 88%, transparent);
        border-radius: inherit;
        content: "";
        inset: 0;
        position: absolute;
        z-index: -1;
      }

      > div {
        display: block grid;
      }
    }

    img {
      block-size: 100%;
      border-radius: inherit;
      inline-size: 100%;
      inset: 0;
      object-fit: cover;
      position: absolute;
      z-index: -2;
    }

    /* The copy beside the image: eyebrow, heading, lede and the actions. It is

       the section\'s body, not its introduction, so it is a box rather than a

       <header>. */

    .copy {
      align-content: center;
      display: block grid;
      font-size: var(--loam-text-md);
      gap: var(--loam-space-xs);
      grid-template-columns: minmax(0, 1fr);
      overflow-wrap: anywhere;
      padding: var(--loam-space-l);
    }

    h2,
    p {
      margin-block: 0;
    }

    p.eyebrow {
      --loam-context: primary;

      align-items: center;
      display: block flex;
      flex-wrap: wrap;
      font-size: var(--loam-text-sm);
      gap: var(--loam-space-2xs);
    }

    h2 {
      max-inline-size: 22ch;
    }

    p.description {
      max-inline-size: var(--loam-measure);
    }

    div.actions {
      display: block flex;
      flex-wrap: wrap;
      gap: var(--loam-space-xs);
    }

    @container banner-background-image (inline-size < 44rem) {
      :scope > div {
        grid-template-columns: minmax(0, 1fr);
      }
    }

    @container banner-background-image (inline-size >= 44rem) {
      :scope > div {
        grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
      }
    }

    @media (forced-colors: active) {
      :scope {
        border-color: CanvasText;
      }

      img,
      :scope::before {
        display: none;
      }
    }
  }
}
```

