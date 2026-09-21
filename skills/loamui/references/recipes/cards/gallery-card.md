---
title: Gallery card
description: A stay in a Card: a Carousel of three photos with its controls beneath, the name and a Rating with the review count, a description and the Price per night.
---

> LoamUI documentation, generated from the same source as the live page —
> treat it as authoritative for `@loamui/core`.

# Gallery card

A stay in a Card: a Carousel of three photos with its controls beneath, the name and a Rating with the review count, a description and the Price per night.

A recipe in **Cards**: a component and a stylesheet built from `@loamui/core`, to copy into a project and change. Both files are below, exactly as the live preview renders them.

- Uses: `Card`, `Carousel`, `Price`, `Rating`
- Tags: carousel, booking, stay, gallery, photos, rating
- Live: https://loamui.com/recipes/cards/gallery-card

## Using this recipe

Copy both files side by side into your React framework project. Install `@loamui/core` and load the core stylesheet at the application root, following the framework-specific installation guide.

Replace the sample listing destination, photographs, rating, review count and nightly price with real data. The photographs illustrate a fictional stay; keep each alt faithful to the replacement image. Set the heading level for the surrounding page.

## When to use

Use for one listing whose photographs need browsing alongside its rating and price. Choose Article carousel to browse several separate items.

## Design decisions

These notes explain the design. The included tests cover structure and selected interactions; check contrast, keyboard behavior and assistive technology support in your application.

- **Modern.** A native scroll-snap list contains the photographs, so touch and trackpad scrolling work without the paging script, and Carousel supplies the buttons, indicator state and keyboard paging after hydration; the rating has an accessible numeric value and Price renders a data element. Layered scopes protect the embedded controls: the Card measures its content, the public --loam-carousel-item-size hook makes each photograph fill the track, responsive images reserve their ratio, and the controls and rating metadata wrap when space is limited.
- **Accessible.** The article and photo region are named. Each photograph describes the actual view; controls have photo-specific labels and the visible review count says “63 reviews”. The title is a link to the full listing, without making the entire card an interactive wrapper.

## References

- [Installation](https://loamui.com/docs/installation.md)
- [Tokens](https://loamui.com/docs/tokens.md)
- [Element styles](https://loamui.com/docs/element-styles.md)
- [Card](https://loamui.com/docs/components/card.md)
- [Carousel](https://loamui.com/docs/components/carousel.md)
- [Price](https://loamui.com/docs/components/price.md)
- [Rating](https://loamui.com/docs/components/rating.md)

## Recipe.tsx

```tsx
"use client";

import { useId } from "react";
import { Card, Carousel, Price, Rating } from "@loamui/core";
import "./recipe.css";

export default function Recipe() {
  const instanceId = useId();
  return (
    <Card
      render={
        <article className="gallery-card" aria-labelledby={`${instanceId}-gallery-card-title`} />
      }
    >
      <div className="body">
        <Carousel.Root
          className="photos"
          labels={{
            region: "Photos of the Orchard Cabin",
            previous: "Previous photo",
            next: "Next photo",
            indicator: (index, count) => `Go to photo ${index} of ${count}`,
            status: (index, count) => `Photo ${index} of ${count}`,
          }}
        >
          <Carousel.Track>
            <Carousel.Item>
              <img
                src="https://picsum.photos/id/206/640/400"
                alt="A timber building among orchard trees in low sunlight"
                width="640"
                height="400"
                loading="lazy"
                sizes="auto, 100vw"
                srcSet="https://picsum.photos/id/206/320/200 320w, https://picsum.photos/id/206/640/400 640w, https://picsum.photos/id/206/960/600 960w"
              />
            </Carousel.Item>
            <Carousel.Item>
              <img
                src="https://picsum.photos/id/225/640/400"
                alt="A glass pot of tea and a small cup beside yellow roses"
                width="640"
                height="400"
                loading="lazy"
                sizes="auto, 100vw"
                srcSet="https://picsum.photos/id/225/320/200 320w, https://picsum.photos/id/225/640/400 640w, https://picsum.photos/id/225/960/600 960w"
              />
            </Carousel.Item>
            <Carousel.Item>
              <img
                src="https://picsum.photos/id/33/640/400"
                alt="White wildflowers and tall meadow grass in low sunlight"
                width="640"
                height="400"
                loading="lazy"
                sizes="auto, 100vw"
                srcSet="https://picsum.photos/id/33/320/200 320w, https://picsum.photos/id/33/640/400 640w, https://picsum.photos/id/33/960/600 960w"
              />
            </Carousel.Item>
          </Carousel.Track>
          <div className="controls">
            <Carousel.Previous />
            <Carousel.Indicators />
            <Carousel.Next />
          </div>
        </Carousel.Root>
        <div className="head">
          <h3 id={`${instanceId}-gallery-card-title`}>
            <a href="/stays/orchard-cabin">The Orchard Cabin</a>
          </h3>
          <div className="rating">
            <Rating readOnly label="Average rating" value={4.8} />
            <span>63 reviews</span>
          </div>
        </div>
        <p className="description">
          Two nights at the nursery, sleeping four, with the walled garden to yourselves once the
          gates close and breakfast from the yard café.
        </p>
        <p className="price">
          <Price value={145} currency="GBP" locale="en-GB">
            per night
          </Price>
        </p>
      </div>
    </Card>
  );
}
```

## recipe.css

```css
@scope (.gallery-card) to ([class*="loam-"]) {
  @layer loamui.components {
    :scope {
      --loam-carousel-item-size: 100%;

      container-type: inline-size;
      display: block grid;
      grid-template-columns: minmax(0, 1fr);
      max-inline-size: 36rem;
    }

    div.body {
      display: block grid;
      font-size: var(--loam-text-md);
      gap: var(--loam-space-2xs);
      grid-template-columns: minmax(0, 1fr);
      overflow-wrap: anywhere;
    }

    div.head {
      align-items: baseline;
      display: block flex;
      flex-wrap: wrap;
      gap: var(--loam-space-3xs) var(--loam-space-xs);
      justify-content: space-between;
    }

    h3 {
      margin-block: 0;
    }

    div.rating {
      align-items: center;
      color: var(--loam-color-fg-muted);
      display: block flex;
      flex-wrap: wrap;
      font-size: var(--loam-text-sm);
      font-variant-numeric: lining-nums tabular-nums;
      gap: var(--loam-space-3xs);
      margin-block: 0;
    }

    p.description {
      color: var(--loam-color-fg-muted);
      margin-block: 0;
      text-wrap: pretty;
    }

    p.price {
      color: var(--loam-color-fg-strong);
      font-family: var(--loam-font-display);
      font-size: var(--loam-text-xl);
      font-weight: 700;
      margin-block: 0;
    }
  }
}

@scope (.gallery-card section.photos) to ([class*="loam-"]) {
  @layer loamui.components {
    img {
      aspect-ratio: 16 / 10;
      block-size: auto;
      border-radius: var(--loam-radius-md);
      inline-size: 100%;
      object-fit: cover;
    }

    div.controls {
      align-items: center;
      display: block flex;
      flex-wrap: wrap;
      gap: var(--loam-space-2xs);
      justify-content: center;
    }
  }
}
```

