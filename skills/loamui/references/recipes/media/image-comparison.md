---
title: Image comparison
description: Black-and-white and colour treatments of the same photograph in one frame, the second revealed by a Range the reader drags or moves with the arrow keys.
---

> LoamUI documentation, generated from the same source as the live page —
> treat it as authoritative for `@loamui/core`.

# Image comparison

Black-and-white and colour treatments of the same photograph in one frame, the second revealed by a Range the reader drags or moves with the arrow keys.

A recipe in **Media**: a component and a stylesheet built from `@loamui/core`, to copy into a project and change. Both files are below, exactly as the live preview renders them.

- Uses: `Range`
- Tags: before, after, slider, reveal, photos
- Live: https://loamui.com/recipes/media/image-comparison

## Using this recipe

Copy both files side by side into your React framework project. Install `@loamui/core` and load the core stylesheet at the application root, following the framework-specific installation guide.

Use photographs of the same subject with matching dimensions and framing, and update both descriptions and the caption. This sample compares grayscale and colour treatments of one photo. React hydration is required to update the reveal; the initial images and caption remain available before it.

## When to use

Use to compare two views of the same subject with a labelled, keyboard-operable reveal control. Choose a gallery when the images are separate subjects.

## Design decisions

These notes explain the design. The included tests cover structure and selected interactions; check contrast, keyboard behavior and assistive technology support in your application.

- **Modern.** The handle is a real range input, so the comparison can be worked with a keyboard and is announced with a name and a value rather than a pointer-only drag, and the whole thing is a figure with a caption. A measuring wrapper contains the figure so fluid tokens resolve locally, both images and the bounded divider share a grid cell, and layered scoped CSS clips the second treatment using a state-driven property, with mutually exclusive LTR and RTL rules.
- **Accessible.** The range is named, describes its current percentage, and references the caption. Both images have descriptive alt text. The server-rendered position shows half of each; the divider remains within the frame at both endpoints and has forced-colour treatment.

## References

- [Installation](https://loamui.com/docs/installation.md)
- [Tokens](https://loamui.com/docs/tokens.md)
- [Element styles](https://loamui.com/docs/element-styles.md)
- [Range](https://loamui.com/docs/components/range.md)

## Example.tsx

```tsx
"use client";

import { useId, useState } from "react";
import type { CSSProperties } from "react";
import { Range } from "@loamui/core";
import "./example.css";

export default function Example() {
  const controlId = useId();
  const [position, setPosition] = useState(50);
  return (
    <div className="image-comparison">
      <figure style={{ "--_position": `${position}%` } as CSSProperties}>
        <div className="before">
          <img
            src="https://picsum.photos/id/59/1200/675"
            alt="Black-and-white photograph of wooden fence posts and wire above long grass"
            width="1200"
            height="675"
            loading="lazy"
            sizes="auto, 100vw"
            srcSet="https://picsum.photos/id/59/400/225 400w, https://picsum.photos/id/59/800/450 800w, https://picsum.photos/id/59/1200/675 1200w"
          />
        </div>
        <div className="after">
          <img
            src="https://picsum.photos/id/59/1200/675"
            alt="The same fence photograph in colour: weathered brown posts above golden grass"
            width="1200"
            height="675"
            loading="lazy"
            sizes="auto, 100vw"
            srcSet="https://picsum.photos/id/59/400/225 400w, https://picsum.photos/id/59/800/450 800w, https://picsum.photos/id/59/1200/675 1200w"
          />
        </div>
        <label htmlFor={controlId}>Reveal the colour photograph</label>
        <Range.Control
          id={controlId}
          aria-describedby={`${controlId}-caption`}
          aria-valuetext={`${position}% colour photograph`}
          min={0}
          max={100}
          value={position}
          onChange={(event) => setPosition(event.currentTarget.valueAsNumber)}
        />
        <p className="value" aria-hidden="true">
          {position}% colour
        </p>
        <figcaption id={`${controlId}-caption`}>
          One photograph in black and white and colour. Move the slider to compare the treatments.
        </figcaption>
      </figure>
    </div>
  );
}
```

## example.css

```css
@scope (.image-comparison) to ([class*="loam-"]) {
  @layer loamui.components {
    :scope {
      --_position: 50%;

      container-type: inline-size;
    }

    figure {
      display: block grid;
      font-size: var(--loam-text-md);
      gap: var(--loam-space-2xs);
      grid-template-columns: minmax(0, 1fr);
      margin-block: 0;
      margin-inline: 0;
      overflow-wrap: anywhere;

      &::after {
        background: var(--loam-color-on-strong);
        border-inline: 1px solid var(--loam-color-fg-strong);
        content: "";
        grid-area: 1 / 1;
        inline-size: var(--loam-ring-width);
        justify-self: start;
        margin-inline-start: clamp(
          0px,
          calc(var(--_position) - var(--loam-ring-width) / 2),
          calc(100% - var(--loam-ring-width))
        );
        pointer-events: none;
        z-index: 1;

        @media (forced-colors: active) {
          background: CanvasText;
          forced-color-adjust: none;
        }
      }
    }

    div.before,
    div.after {
      aspect-ratio: 16 / 9;
      border-radius: var(--loam-radius-md);
      grid-area: 1 / 1;
      inline-size: 100%;
      overflow: hidden;

      img {
        block-size: 100%;
        display: block flow;
        inline-size: 100%;
        object-fit: cover;
      }
    }

    div.before img {
      filter: grayscale(1);
    }

    div.after {
      &:dir(ltr) {
        clip-path: inset(0 calc(100% - var(--_position)) 0 0);
      }

      &:dir(rtl) {
        clip-path: inset(0 0 0 calc(100% - var(--_position)));
      }
    }

    p.value {
      font-variant-numeric: tabular-nums;
      margin-block: 0;
    }

    figcaption {
      color: var(--loam-color-fg-muted);
      font-size: var(--loam-text-sm);
      margin-block: 0;
    }
  }
}
```

