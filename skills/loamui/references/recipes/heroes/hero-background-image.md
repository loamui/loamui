---
title: Hero with background image
description: A page-opening section over a full-bleed photograph: a headline, a lede and two actions on a scrim that holds their contrast in both schemes.
---

> LoamUI documentation, generated from the same source as the live page —
> treat it as authoritative for `@loamui/core`.

# Hero with background image

A page-opening section over a full-bleed photograph: a headline, a lede and two actions on a scrim that holds their contrast in both schemes.

A recipe in **Heroes**: a component and a stylesheet built from `@loamui/core`, to copy into a project and change. Both files are below, exactly as the live preview renders them.

- Uses: `SignpostLink`
- Tags: landing, marketing, photo, cover
- Live: https://loamui.com/recipes/heroes/hero-background-image

## Using this recipe

Copy both files side by side into your React framework project. Install `@loamui/core` and load the core stylesheet at the application root, following the framework-specific installation guide.

Use this h1 as the page’s main heading and replace the sample photograph and routes. The image is decorative: keep meaningful information in the text and its alt empty. Native srcSet supplies three renditions; sizes="100vw" is a conservative upper bound for a portable hero, so tailor that hint to your page’s layout and image pipeline. fetchPriority="high" is intended for the page’s critical above-the-fold image, which should not be lazy-loaded. The content reserves the section’s height; an absolutely positioned photograph does not reserve space through its dimensions. Recheck overlay contrast if you change the tokens or scrim. This synchronous component needs no client directive.

## When to use

Use for a prominent page introduction over an atmospheric photograph. Choose a banner for a shorter promotion within an existing page.

## Design decisions

These notes explain the design. The included tests cover structure and selected interactions; check contrast, keyboard behavior and assistive technology support in your application.

- **Modern.** A section named by its h1, with a native header and an eagerly discoverable img that sits behind the content, so the header supplies the minimum height and grows when the text needs more room. Its styles sit in loamui.components inside a donut scope, measuring the header’s fluid padding, type and minimum height with no viewport layout breakpoints, and element styles own the heading typography and link states. The section inherits the surrounding colour scheme rather than fixing a dark region or taking appearance props: background, overlay, text and link tokens adapt together, with a token-based scrim and full foreground text protecting readability in either scheme and a solid background keeping the words legible if the image fails.
- **Accessible.** The photograph is decoration behind the words, so its alt is empty. useId ties repeated regions to their own headings. Native links retain visible text and focus rings; enlarged text can grow the section. Forced colours remove both the picture and scrim, leaving native system colours and a visible border.

## References

- [Installation](https://loamui.com/docs/installation.md)
- [Tokens](https://loamui.com/docs/tokens.md)
- [Element styles](https://loamui.com/docs/element-styles.md)
- [SignpostLink](https://loamui.com/docs/components/signpost-link.md)

## Recipe.tsx

```tsx
import { useId } from "react";
import { SignpostLink } from "@loamui/core";
import "./recipe.css";

export default function Recipe() {
  const titleId = useId();
  return (
    <section className="hero-background-image" aria-labelledby={titleId}>
      <img
        src="https://picsum.photos/id/206/1600/900"
        srcSet="https://picsum.photos/id/206/640/360 640w, https://picsum.photos/id/206/960/540 960w, https://picsum.photos/id/206/1600/900 1600w"
        sizes="100vw"
        alt=""
        width="1600"
        height="900"
        fetchPriority="high"
      />
      <div className="copy">
        <h1 id={titleId}>A field of seed, saved by the people who sow it.</h1>
        <p className="lede">
          Hedgerow grows open-pollinated vegetables, herbs and flowers on member plots across
          Shropshire, and posts the seed the week you order it.
        </p>
        <div className="actions">
          <SignpostLink href="/catalogue">Browse the catalogue</SignpostLink>
          <a href="/films/harvest">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
            Watch the harvest
          </a>
        </div>
      </div>
    </section>
  );
}
```

## recipe.css

```css
@scope (.hero-background-image) to ([class*="loam-"]) {
  @layer loamui.components {
    :scope {
      background: var(--loam-color-bg);
      border-radius: var(--loam-radius-xl);
      color: var(--loam-color-fg);
      container-type: inline-size;
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

    /* The copy is the section's body, not its introduction, so it is a box
       rather than a <header>. */
    .copy {
      align-content: end;
      display: block grid;
      font-size: var(--loam-text-md);
      gap: var(--loam-space-s);
      grid-template-columns: minmax(0, 1fr);
      min-block-size: clamp(28rem, 20rem + 20cqi, 34rem);
      overflow-wrap: anywhere;
      padding: clamp(var(--loam-space-s), var(--loam-space-xs) + 3cqi, var(--loam-space-l) * 1.5);
    }

    h1,
    p {
      margin-block: 0;
    }

    h1 {
      max-inline-size: 20ch;
    }

    p.lede {
      font-size: var(--loam-text-lg);
      max-inline-size: var(--loam-measure);
    }

    div.actions {
      align-items: center;
      display: block flex;
      flex-wrap: wrap;
      gap: var(--loam-space-xs);

      > a {
        align-items: center;
        display: inline flex;
        gap: var(--loam-space-3xs);

        svg {
          block-size: 1em;
          flex: none;
          inline-size: 1em;
        }
      }
    }

    @media (forced-colors: active) {
      :scope {
        border: 1px solid CanvasText;
      }

      img,
      :scope::before {
        display: none;
      }
    }
  }
}
```

