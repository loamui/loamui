---
title: Profile card
description: One member on a card: initials, a name and role, three labelled figures, and a link to their profile.
---

> LoamUI documentation, generated from the same source as the live page —
> treat it as authoritative for `@loamui/core`.

# Profile card

One member on a card: initials, a name and role, three labelled figures, and a link to their profile.

A recipe in **Cards**: a component and a stylesheet built from `@loamui/core`, to copy into a project and change. Both files are below, exactly as the live preview renders them.

- Uses: `Avatar`, `Card`, `SignpostLink`
- Tags: profile, member, avatar, stats
- Live: https://loamui.com/recipes/cards/profile-card

## Using this recipe

Copy both files side by side into your React framework project. Install `@loamui/core` and load the core stylesheet at the application root, following the framework-specific installation guide.

Replace the sample person, figures and profile destination with application data. The link navigates to the profile; there is no simulated account relationship or persistence. If this card appears below a section heading, adjust its heading level accordingly.

## When to use

Use to introduce one person with labelled statistics and a clear destination for their full profile.

## Design decisions

These notes explain the design. The included tests cover structure and selected interactions; check contrast, keyboard behavior and assistive technology support in your application.

- **Modern.** The card is an article named by its heading, and the figures are a description list of three pairs, so the markup reads label then value while the screen shows value over label. A local inline-size container resolves the body’s fluid tokens, the statistics use an intrinsic grid that can wrap as available space changes, and the Avatar size comes from the public --loam-avatar-size hook. A profile has no status meaning, so it keeps the neutral surface and ordinary link treatment rather than inventing a primary or success region.
- **Accessible.** The Avatar is hidden because the name is printed beneath it, so a screen reader hears the person once; the figures carry their labels in the markup, not in a tooltip.

## References

- [Installation](https://loamui.com/docs/installation.md)
- [Tokens](https://loamui.com/docs/tokens.md)
- [Element styles](https://loamui.com/docs/element-styles.md)
- [Avatar](https://loamui.com/docs/components/avatar.md)
- [Card](https://loamui.com/docs/components/card.md)
- [SignpostLink](https://loamui.com/docs/components/signpost-link.md)

## Recipe.tsx

```tsx
import { useId } from "react";
import { Avatar, Card, SignpostLink } from "@loamui/core";
import "./recipe.css";

export default function Recipe() {
  const name = useId();
  return (
    <Card render={<article className="profile-card" aria-labelledby={name} />}>
      <div className="body">
        <Avatar.Root aria-hidden>
          <Avatar.Fallback>IH</Avatar.Fallback>
        </Avatar.Root>
        <h2 id={name}>Imogen Hartley</h2>
        <p className="role">Steward, Lower Field plot</p>
        <dl className="stats">
          <div>
            <dt>Varieties saved</dt>
            <dd>38</dd>
          </div>
          <div>
            <dt>Seasons</dt>
            <dd>7</dd>
          </div>
          <div>
            <dt>Followers</dt>
            <dd>212</dd>
          </div>
        </dl>
        <div className="actions">
          <SignpostLink href="/growers/imogen-hartley">Meet Imogen</SignpostLink>
        </div>
      </div>
    </Card>
  );
}
```

## recipe.css

```css
@scope (.profile-card) to ([class*="loam-"]) {
  @layer loamui.components {
    :scope {
      --loam-avatar-size: 5rem;

      container-type: inline-size;
      inline-size: min(100%, 20rem);
    }

    div.body {
      display: block grid;
      font-size: var(--loam-text-md);
      gap: var(--loam-space-3xs);
      grid-template-columns: minmax(0, 1fr);
      justify-items: center;
      overflow-wrap: anywhere;
      text-align: center;
    }

    h2 {
      font-size: var(--loam-text-xl);
      margin-block: var(--loam-space-2xs) 0;
    }

    p.role {
      color: var(--loam-color-fg-muted);
      font-size: var(--loam-text-sm);
      margin-block: 0;
    }

    dl.stats {
      display: block grid;
      gap: var(--loam-space-2xs);
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 5rem), 1fr));
      inline-size: 100%;
      margin-block: var(--loam-space-xs) var(--loam-space-2xs);

      div {
        align-content: start;
        display: block grid;
        gap: calc(var(--loam-space-3xs) / 2);
        grid-template-columns: minmax(0, 1fr);
      }

      dt {
        color: var(--loam-color-fg-muted);
        font-size: var(--loam-text-xs);
        order: 1;
      }

      dd {
        color: var(--loam-color-fg-strong);
        font-family: var(--loam-font-display);
        font-size: var(--loam-text-lg);
        font-variant-numeric: lining-nums tabular-nums;
        font-weight: 700;
        line-height: 1.1;
        margin-block: 0;
      }
    }

    div.actions {
      display: block grid;
      grid-template-columns: minmax(0, 1fr);
      inline-size: 100%;
    }
  }
}
```

