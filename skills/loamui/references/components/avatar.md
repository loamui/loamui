---
title: Avatar
description: Represent a user with an image or initials.
---

> LoamUI documentation, generated from the same source as the live page —
> treat it as authoritative for `@loamui/core`.

# Avatar

An image and an explicit fallback representing a person.

## Import

```tsx
import { Avatar } from "@loamui/core";
```

## Usage

### Image and fallback

Image owns the source and native loading attributes. Fallback holds the content shown while loading or after an error.

```tsx
<Avatar.Root role="img" aria-label="Ada Lovelace">
  <Avatar.Image src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&h=128&fit=crop&crop=faces" alt="" loading="lazy" />
  <Avatar.Fallback>AL</Avatar.Fallback>
</Avatar.Root>
```

### Initials

Supply initials as children. The background answers the surrounding --loam-context region.

```tsx
<span style={{ "--loam-context": "info" }}>
  <Avatar.Root role="img" aria-label="Amara Okafor">
    <Avatar.Fallback>AO</Avatar.Fallback>
  </Avatar.Root>
</span>
```

### Size

Set the public --loam-avatar-size property on an instance or region.

```tsx
<Avatar.Root role="img" aria-label="Jane Doe" style={{ "--loam-avatar-size": "4rem" }}>
  <Avatar.Fallback>JD</Avatar.Fallback>
</Avatar.Root>
```

### Group

Each child is a list item. Compose an additional avatar for an overflow count.

```tsx
<Avatar.Group aria-label="Participants">
  <Avatar.Root role="img" aria-label="Jane Doe"><Avatar.Fallback>JD</Avatar.Fallback></Avatar.Root>
  <Avatar.Root role="img" aria-label="Sam Reed"><Avatar.Fallback>SR</Avatar.Fallback></Avatar.Root>
  <Avatar.Root role="img" aria-label="Amara Okafor"><Avatar.Fallback>AO</Avatar.Fallback></Avatar.Root>
  <Avatar.Root role="img" aria-label="5 more people"><Avatar.Fallback>+5</Avatar.Fallback></Avatar.Root>
</Avatar.Group>
```

## When to use it

- To identify a person beside their comment, assignment or member record.
- With Avatar.Group, to show a compact set of participants.

## When not to

- For logos, screenshots or product photos: use a plain image without the avatar's cover crop.
- As a click target: wrap the avatar in a link or button when it opens a profile.

## How it works

### Explicit parts

Root provides the shared loading state. Compose one Image and a Fallback in either order. Root accepts native span attributes; it does not generate an image, initials, icon or overflow count from content props.

### Native image loading

Image stays in the DOM and loads in place, so loading="lazy", srcSet and sizes reach the browser. Loading and failed images keep their layout box with visibility: hidden. Fallback remains visible until a successful load. A new source starts a new loading attempt.

### Server rendering

Both parts are present in server HTML. Fallback remains visible until hydration resolves image status, including an image already in the browser cache. With JavaScript unavailable the fallback remains visible.

## Accessibility

- When the avatar identifies a person, put role="img" and aria-label with the full name on Root, and alt="" on Image. The name then remains available during loading and failure.
- When the person’s name is printed beside the avatar, use aria-hidden on Root and alt="" on Image to avoid repeating it.
- Fallback content is supplied by the caller: initials, an icon, or other meaningful content. Initials alone do not replace the person's full accessible name.

## Parts

### Avatar.Root

A span containing one Image and a Fallback, or plain content. It holds parts, not content props: what shows is composed, never derived behind your back.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `...others` | `SpanHTMLAttributes` | — | Native span props, including children, role, aria-label and aria-hidden. |

### Avatar.Image

A native image which loads in place.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `src` | `string` | — | Image source. |
| `alt` | `string` | — | Required image alternative. Use an empty string when Root supplies the name or is decorative. |
| `...others` | `ImgHTMLAttributes` | — | Native image props, including loading, srcSet, sizes, onLoad, onError and ref. |

### Avatar.Fallback

A span shown while loading or when the image fails; children supply its content.

### Avatar.Group

An overlapping list; each supplied child becomes a list item. Native ul props are forwarded.

## Custom properties

| Property | Syntax | Default | Description |
| --- | --- | --- | --- |
| `--loam-avatar-size` | `CSS length` | `2.5rem` | The diameter; set per instance or on a region. |
| `--loam-avatar-overlap` | `CSS length` | `0.5rem` | How far each group item overlaps the preceding item. |

