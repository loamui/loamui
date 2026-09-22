---
title: Banner with image
description: A fruit-plant offer with a photograph beside the deadline, heading and one clear destination.
---

> LoamUI documentation, generated from the same source as the live page —
> treat it as authoritative for `@loamui/core`.

# Banner with image

A fruit-plant offer with a photograph beside the deadline, heading and one clear destination.

A recipe in **Banners**: a component and a stylesheet built from `@loamui/core`, to copy into a project and change. Both files are below, exactly as the live preview renders them.

- Uses: `Badge`, `SignpostLink`
- Tags: promotion, offer, sale, banner, photo
- Live: https://loamui.com/recipes/banners/banner-with-image

## Using this recipe

Copy both files side by side into your React framework project. Install `@loamui/core` and load the core stylesheet at the application root, following the framework-specific installation guide.

Replace the sample offer, closing date, photograph and destination with your own; use the heading level appropriate to the surrounding page. Keep Badge labels short and put longer details in the adjacent wrapping text. Both banners demonstrate a promotion below the initial viewport: loading="lazy" and sizes="auto, 100vw" let the browser choose a rendition from the rendered image width, with a conservative viewport fallback. For a banner visible on first load, remove lazy loading and auto from sizes; set a layout-appropriate size hint and use high fetch priority only if this is the page’s critical image. Supply appropriately cropped renditions through your own image pipeline. useId only connects each section to its heading; this synchronous component needs no client directive.

## When to use

Use for one offer or announcement when the photograph deserves its own space beside the copy. Choose the background-image banner when the image is decorative.

## Design decisions

These notes explain the design. The included tests cover structure and selected interactions; check contrast, keyboard behavior and assistive technology support in your application.

- **Modern.** A section named by its h2, with the photograph as an img carrying real alt text, because a picture of the fruit on offer is content rather than decoration. Its stylesheet lives in loamui.components inside a donut scope and measures the section’s own inner grid against the header’s fluid token spacing and type: one column with the picture on top, then a 2:3 split at 44rem of its own width, where the picture grows to the height of the words and is cropped rather than letterboxed. The eyebrow declares --loam-context: primary, so the offer Badge inherits the brand context without a styling prop; a promotion does not imply a warning, and the adjacent text spells out the closing date.
- **Accessible.** useId names each repeated region by its own h2. The photograph has descriptive alt text and reserved space before loading. Enlarged text can grow the layout; rounded image corners do not clip focus rings. The date is written out, the destination is a native link, and the border survives forced colours.

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
    <section className="banner-with-image" aria-labelledby={titleId}>
      <img
        src="https://picsum.photos/id/429/800/600"
        srcSet="https://picsum.photos/id/429/400/300 400w, https://picsum.photos/id/429/800/600 800w, https://picsum.photos/id/429/1600/1200 1600w"
        sizes="auto, 100vw"
        alt="A cup of freshly picked raspberries"
        width="1600"
        height="1200"
        loading="lazy"
      />
      <div className="copy">
        <p className="eyebrow">
          <Badge.Root>
            <Badge.Text>Offer</Badge.Text>
          </Badge.Root>
          <span>Until 30 November · bare-root season</span>
        </p>
        <h2 id={titleId}>Members save 20% on fruit plants</h2>
        <p className="description">
          Apples, pears, plums and soft fruit on local rootstocks, lifted the week they are posted.
          Order before the end of November and the discount comes off at the basket.
        </p>
        <div className="actions">
          <SignpostLink href="/catalogue/fruit">See the fruit list</SignpostLink>
        </div>
      </div>
    </section>
  );
}
```

## recipe.css

```css
@scope (.banner-with-image) to ([class*="loam-"]) {
  @layer loamui.components {
    :scope {
      background: var(--loam-color-surface);
      border: 1px solid var(--loam-color-line);
      border-radius: var(--loam-radius-xl);
      container: banner-with-image / inline-size;
      display: block grid;
      grid-template-columns: minmax(0, 2fr) minmax(0, 3fr);
    }

    img {
      inline-size: 100%;
      object-fit: cover;
    }

    /* The copy is the section's body, not its introduction, so it is a box
       rather than a <header>. */
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
      color: var(--loam-color-fg-muted);
      display: block flex;
      flex-wrap: wrap;
      font-size: var(--loam-text-sm);
      gap: var(--loam-space-2xs);
    }

    h2 {
      max-inline-size: 22ch;
    }

    p.description {
      color: var(--loam-color-fg-muted);
      max-inline-size: var(--loam-measure);
    }

    div.actions {
      display: block flex;
      flex-wrap: wrap;
      gap: var(--loam-space-xs);
    }

    @container banner-with-image (inline-size < 44rem) {
      img,
      .copy {
        grid-column: 1 / -1;
      }

      img {
        aspect-ratio: 16 / 9;
        block-size: auto;
        border-start-end-radius: var(--loam-radius-xl);
        border-start-start-radius: var(--loam-radius-xl);
      }
    }

    @container banner-with-image (inline-size >= 44rem) {
      img {
        aspect-ratio: auto;
        block-size: 100%;
        border-end-start-radius: var(--loam-radius-xl);
        border-start-start-radius: var(--loam-radius-xl);
        min-block-size: 0;
      }
    }
  }
}
```

