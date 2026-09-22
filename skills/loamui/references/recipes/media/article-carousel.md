---
title: Article carousel
description: Five journal articles as Cards on a Carousel track: a photo, a category Badge, a title and a Read article link each, with Previous and Next beside the title and a dot per article beneath.
---

> LoamUI documentation, generated from the same source as the live page —
> treat it as authoritative for `@loamui/core`.

# Article carousel

Five journal articles as Cards on a Carousel track: a photo, a category Badge, a title and a Read article link each, with Previous and Next beside the title and a dot per article beneath.

A recipe in **Media**: a component and a stylesheet built from `@loamui/core`, to copy into a project and change. Both files are below, exactly as the live preview renders them.

- Uses: `Badge`, `Card`, `Carousel`, `SignpostLink`, `VisuallyHidden`
- Tags: carousel, articles, cards, slider, journal
- Live: https://loamui.com/recipes/media/article-carousel

## Using this recipe

Copy both files side by side into your React framework project. Install `@loamui/core` and load the core stylesheet at the application root, following the framework-specific installation guide.

Replace the sample articles and destinations with real content. Choose a visible grid when comparison or discovery of every item matters more than a compact horizontal collection. Adjust heading levels to the page; keep the accessible link suffixes unique.

## When to use

Use when readers need to browse several articles in a horizontal collection. Choose a grid when seeing and comparing the items together is more useful.

## Design decisions

These notes explain the design. The included tests cover structure and selected interactions; check contrast, keyboard behavior and assistive technology support in your application.

- **Modern.** The track is an ordinary scroll-snap list that supports touch and trackpad scrolling without the paging script, with Carousel supplying keyboard paging and button state after hydration, and each Card an article named by its heading. The public item-size property sets the preferred card width while the track caps it to the available space; each Card measures its own content, uses layered scoped rules and aligns the final link with an auto margin, and responsive images are lazy and reserve their ratio.
- **Accessible.** The region is named by its heading, the paging Buttons and the dots are named through labels, the status announces Article 2 of 5 once the track settles, and every Read article link finishes with the article's title in hidden text.

## References

- [Installation](https://loamui.com/docs/installation.md)
- [Tokens](https://loamui.com/docs/tokens.md)
- [Element styles](https://loamui.com/docs/element-styles.md)
- [Badge](https://loamui.com/docs/components/badge.md)
- [Card](https://loamui.com/docs/components/card.md)
- [Carousel](https://loamui.com/docs/components/carousel.md)
- [SignpostLink](https://loamui.com/docs/components/signpost-link.md)
- [VisuallyHidden](https://loamui.com/docs/components/visually-hidden.md)

## Recipe.tsx

```tsx
"use client";

import { useId } from "react";
import { Badge, Card, Carousel, SignpostLink, VisuallyHidden } from "@loamui/core";
import "./recipe.css";

export default function Recipe() {
  const instanceId = useId();
  return (
    <Carousel.Root
      className="article-carousel"
      aria-labelledby={`${instanceId}-article-carousel-title`}
      labels={{
        previous: "Previous articles",
        next: "Next articles",
        indicator: (index, count) => `Go to article ${index} of ${count}`,
        status: (index, count) => `Article ${index} of ${count}`,
      }}
    >
      <div className="head">
        <h2 id={`${instanceId}-article-carousel-title`}>From the growers’ journal</h2>
        <div className="controls">
          <Carousel.Previous />
          <Carousel.Next />
        </div>
      </div>
      <Carousel.Track>
        <Carousel.Item>
          <Card
            render={
              <article
                className="article"
                aria-labelledby={`${instanceId}-article-carousel-picking-french-beans`}
              />
            }
          >
            <div className="body">
              <img
                className="media"
                src="https://picsum.photos/id/627/640/400"
                alt=""
                width="640"
                height="400"
                sizes="auto, 100vw"
                srcSet="https://picsum.photos/id/627/320/200 320w, https://picsum.photos/id/627/640/400 640w"
                loading="lazy"
              />
              <p className="meta">
                <Badge.Root>
                  <Badge.Text>Guide</Badge.Text>
                </Badge.Root>
              </p>
              <h3 id={`${instanceId}-article-carousel-picking-french-beans`}>
                Picking French beans at their best
              </h3>
              <div className="foot">
                <SignpostLink href="/journal/picking-french-beans">
                  Read article
                  <VisuallyHidden> – Picking French beans at their best</VisuallyHidden>
                </SignpostLink>
              </div>
            </div>
          </Card>
        </Carousel.Item>
        <Carousel.Item>
          <Card
            render={
              <article
                className="article"
                aria-labelledby={`${instanceId}-article-carousel-haymaking`}
              />
            }
          >
            <div className="body">
              <img
                className="media"
                src="https://picsum.photos/id/729/640/400"
                alt=""
                width="640"
                height="400"
                sizes="auto, 100vw"
                srcSet="https://picsum.photos/id/729/320/200 320w, https://picsum.photos/id/729/640/400 640w"
                loading="lazy"
              />
              <p className="meta">
                <Badge.Root>
                  <Badge.Text>Harvest</Badge.Text>
                </Badge.Root>
              </p>
              <h3 id={`${instanceId}-article-carousel-haymaking`}>
                Haymaking on the member fields
              </h3>
              <div className="foot">
                <SignpostLink href="/journal/haymaking">
                  Read article
                  <VisuallyHidden> – Haymaking on the member fields</VisuallyHidden>
                </SignpostLink>
              </div>
            </div>
          </Card>
        </Carousel.Item>
        <Carousel.Item>
          <Card
            render={
              <article
                className="article"
                aria-labelledby={`${instanceId}-article-carousel-spring-buds`}
              />
            }
          >
            <div className="body">
              <img
                className="media"
                src="https://picsum.photos/id/400/640/400"
                alt=""
                width="640"
                height="400"
                sizes="auto, 100vw"
                srcSet="https://picsum.photos/id/400/320/200 320w, https://picsum.photos/id/400/640/400 640w"
                loading="lazy"
              />
              <p className="meta">
                <Badge.Root>
                  <Badge.Text>Plants</Badge.Text>
                </Badge.Root>
              </p>
              <h3 id={`${instanceId}-article-carousel-spring-buds`}>
                A closer look at spring buds
              </h3>
              <div className="foot">
                <SignpostLink href="/journal/spring-buds">
                  Read article
                  <VisuallyHidden> – A closer look at spring buds</VisuallyHidden>
                </SignpostLink>
              </div>
            </div>
          </Card>
        </Carousel.Item>
        <Carousel.Item>
          <Card
            render={
              <article
                className="article"
                aria-labelledby={`${instanceId}-article-carousel-woodland-tulips`}
              />
            }
          >
            <div className="body">
              <img
                className="media"
                src="https://picsum.photos/id/976/640/400"
                alt=""
                width="640"
                height="400"
                sizes="auto, 100vw"
                srcSet="https://picsum.photos/id/976/320/200 320w, https://picsum.photos/id/976/640/400 640w"
                loading="lazy"
              />
              <p className="meta">
                <Badge.Root>
                  <Badge.Text>Spring</Badge.Text>
                </Badge.Root>
              </p>
              <h3 id={`${instanceId}-article-carousel-woodland-tulips`}>
                Tulips at the woodland edge
              </h3>
              <div className="foot">
                <SignpostLink href="/journal/woodland-tulips">
                  Read article
                  <VisuallyHidden> – Tulips at the woodland edge</VisuallyHidden>
                </SignpostLink>
              </div>
            </div>
          </Card>
        </Carousel.Item>
        <Carousel.Item>
          <Card
            render={
              <article
                className="article"
                aria-labelledby={`${instanceId}-article-carousel-changing-weather`}
              />
            }
          >
            <div className="body">
              <img
                className="media"
                src="https://picsum.photos/id/542/640/400"
                alt=""
                width="640"
                height="400"
                sizes="auto, 100vw"
                srcSet="https://picsum.photos/id/542/320/200 320w, https://picsum.photos/id/542/640/400 640w"
                loading="lazy"
              />
              <p className="meta">
                <Badge.Root>
                  <Badge.Text>Notes</Badge.Text>
                </Badge.Root>
              </p>
              <h3 id={`${instanceId}-article-carousel-changing-weather`}>
                Reading the weather over the fields
              </h3>
              <div className="foot">
                <SignpostLink href="/journal/changing-weather">
                  Read article
                  <VisuallyHidden> – Reading the weather over the fields</VisuallyHidden>
                </SignpostLink>
              </div>
            </div>
          </Card>
        </Carousel.Item>
      </Carousel.Track>
      <Carousel.Indicators />
    </Carousel.Root>
  );
}
```

## recipe.css

```css
@scope (.article-carousel) to ([class*="loam-"]) {
  @layer loamui.components {
    :scope {
      --loam-carousel-item-size: 18rem;
    }

    div.head {
      align-items: center;
      display: block flex;
      flex-wrap: wrap;
      font-size: var(--loam-text-md);
      gap: var(--loam-space-2xs) var(--loam-space-xs);
      justify-content: space-between;
      overflow-wrap: anywhere;
    }

    h2 {
      margin-block: 0;
    }

    div.controls {
      display: block flex;
      gap: var(--loam-space-3xs);
    }
  }
}

@scope (.article-carousel article.article) to ([class*="loam-"]) {
  @layer loamui.components {
    :scope {
      container-type: inline-size;
      display: block grid;
      grid-template-columns: minmax(0, 1fr);
    }

    div.body {
      display: block flex;
      flex-direction: column;
      font-size: var(--loam-text-md);
      gap: var(--loam-space-2xs);
      overflow-wrap: anywhere;
    }

    img.media {
      aspect-ratio: 16 / 10;
      block-size: auto;
      border-radius: var(--loam-radius-md);
      inline-size: 100%;
      object-fit: cover;
    }

    p.meta {
      margin-block: 0;
    }

    h3 {
      margin-block: 0;
      text-wrap: balance;
    }

    div.foot {
      display: block flex;
      margin-block-start: auto;
      padding-block-start: var(--loam-space-2xs);
    }
  }
}
```

