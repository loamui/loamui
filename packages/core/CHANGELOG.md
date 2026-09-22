# Changelog

Notable changes to `@loamui/core`. Release tags use the `vMAJOR.MINOR.PATCH`
form.

## 0.2.0 — unreleased

A breaking release: the composition model is settled, and the API is one
shape or the other with nothing in between.

### Breaking

- Every component is either a namespace of parts or a callable component.
  The hybrid forms — a callable that also carried parts — are gone. `Alert`,
  `Avatar`, `Badge`, `Switch`, `Range` and `Table` are namespaces, so a
  badge is composed from `Badge.Root` and `Badge.Text` rather than written
  as `<Badge>`, and likewise for the others.
- The flat part exports are removed: `ModalRoot`, `FieldLabel`,
  `AlertTitle` and the other prefixed names. Use the namespace,
  `Modal.Root`, `Field.Label`, `Alert.Title`.
- `Badge.Dot` is removed. A status dot is an icon composed as a child.
- `useOptionalSlot` is removed from the public API.
- `Range` reports value changes through `onChange`; the effect that
  reported them after every render is gone.

### Added

- `Field.Item`: a row for a `Checkbox` or `Radio` with its own `Field.Label`
  and optional `Field.Description`, so a choice associates with its words
  without a `label` prop.
- The documentation describes `Input`'s `startSection`, `endSection` and
  `wrapperProps`, and `Checkbox` and `Radio`'s `label`, `description` and
  `wrapperProps`, which the package already had.
- Subpath exports for every component (`@loamui/core/modal`), for
  code-splitting.

### Fixed

- Combobox, Tabs and Menu keep their own collections: items register with
  the root rather than being read from the DOM, and a `render` element that
  changes still commits its current label. An option's id follows the
  rendered element, so `aria-activedescendant` points at the node.
- Tabs select an enabled tab when the active one becomes disabled.
- `FileInput.Prompt` follows an explicit `Control` id; `Checkbox`, `Radio`
  and `Input` keep a `Field` label attached to an explicit `id`.
- SegmentedControl's legend leaves the fieldset slot in WebKit, and an
  icon beside text keeps its padding.
- Avatar centres fallback content before hydration in either parts order.

### Stylesheet

- The published stylesheet is served versioned from the npm CDN:
  `https://cdn.jsdelivr.net/npm/@loamui/core@0.2.0/dist/styles.css`. Link
  the version you install; `npx loamui@latest init` does this.

## 0.1.1 — 2026-09-18

The first public release.
