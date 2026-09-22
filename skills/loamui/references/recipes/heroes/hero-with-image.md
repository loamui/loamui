---
title: Hero with image
description: A page-opening section: an eyebrow, a headline, a lede and two actions beside a photograph.
---

> LoamUI documentation, generated from the same source as the live page —
> treat it as authoritative for `@loamui/core`.

# Hero with image

A page-opening section: an eyebrow, a headline, a lede and two actions beside a photograph.

A recipe in **Heroes**: a component and a stylesheet built from `@loamui/core`, to copy into a project and change. Both files are below, exactly as the live preview renders them.

- Uses: `Badge`, `SignpostLink`
- Tags: landing, marketing, banner
- Live: https://loamui.com/recipes/heroes/hero-with-image

## Using this recipe

Copy both files side by side into your React framework project. Install `@loamui/core` and load the core stylesheet at the application root, following the framework-specific installation guide.

Use the h1 for the page's main heading; choose the appropriate heading level if adapting this into a subsection. Replace the sample photograph, alt text and routes. Keep the badge label brief and put longer seasonal information in the wrapping text beside it. Its dimensions reserve space and fetchPriority="high" suits an above-the-fold hero image: avoid lazy-loading the page's likely largest-contentful-paint image. The sample srcSet offers three renditions; sizes="100vw" is a conservative upper bound because this portable recipe cannot know its host width. Replace it with an accurate sizes hint for your page and use your own image pipeline. Reserve high priority for the page's critical image. This synchronous component can render on the server; useId does not require a client directive.

## When to use

Use to introduce a page when the photograph conveys information alongside the headline. Choose the background-image hero when the photograph sets the atmosphere behind the message.

## Design decisions

These notes explain the design. The included tests cover structure and selected interactions; check contrast, keyboard behavior and assistive technology support in your application.

- **Modern.** A section named by its h1, with a native header and image; element styles supply the heading typography, body leading and link states, and the recipe adds only its layout and editorial roles. An intrinsic auto-fit grid makes two columns when both fit and stacks them otherwise, measuring the contents’ fluid type and spacing, with styles in loamui.components inside a donut scope so element defaults remain the base and selectors stop at LoamUI component boundaries. The eyebrow declares --loam-context: primary, so the Badge inside takes the brand colour without a prop — primary is the brand slot, neutral until a theme fills it, and the eyebrow reads as one by its place above the heading.
- **Accessible.** useId keeps each region tied to its own heading. Both destinations are keyboard-operable links with visible text, the play icon is decorative, and the photograph has descriptive alt text. Content order is unchanged when the grid stacks.

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
    <section className="hero-with-image" aria-labelledby={titleId}>
      <div>
        <div className="copy">
          <p className="eyebrow">
            <Badge.Root>
              <Badge.Text>Catalogue</Badge.Text>
            </Badge.Root>
            <span>Sowing from March</span>
          </p>
          <h1 id={titleId}>Seed saved by growers, for growers.</h1>
          <p className="lede">
            Hedgerow is a nursery and seed co-op. Every packet is an open-pollinated variety grown
            on a member plot, dried and packed by hand, and posted the week you order it.
          </p>
          <div className="actions">
            <SignpostLink href="/catalogue">Browse the catalogue</SignpostLink>
            <a href="/films/seed-saving">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
              Watch how we save seed
            </a>
          </div>
        </div>
        <img
          src="https://picsum.photos/id/785/1200/900"
          srcSet="https://picsum.photos/id/785/600/450 600w, https://picsum.photos/id/785/900/675 900w, https://picsum.photos/id/785/1200/900 1200w"
          sizes="100vw"
          alt="Cupped hands holding a bundle of fresh green shoots"
          width="1200"
          height="900"
          fetchPriority="high"
        />
      </div>
    </section>
  );
}
```

## recipe.css

```css
@scope (.hero-with-image) to ([class*="loam-"]) {
  @layer loamui.components {
    :scope {
      container-type: inline-size;

      > div {
        align-items: center;
        display: block grid;
        font-size: var(--loam-text-md);
        gap: var(--loam-space-l);
        grid-template-columns: repeat(auto-fit, minmax(min(100%, 22rem), 1fr));
        padding-block: var(--loam-space-l);
      }
    }

    /* The copy beside the image: eyebrow, heading, lede and the actions. It is

       the section\'s body, not its introduction, so it is a box rather than a

       <header>. */

    .copy {
      display: block grid;
      gap: var(--loam-space-s);
      grid-template-columns: minmax(0, 1fr);
      overflow-wrap: anywhere;
    }

    h1,
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

    h1 {
      max-inline-size: 18ch;
    }

    p.lede {
      color: var(--loam-color-fg-muted);
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

    img {
      border-radius: var(--loam-radius-lg);
      inline-size: 100%;
    }
  }
}
```

