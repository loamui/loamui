---
title: Accessibility
description: What LoamUI guarantees: platform semantics, APG keyboard patterns, engineered WCAG specifics, and user preferences as the baseline.
---

> LoamUI documentation, generated from the same source as the live page —
> treat it as authoritative for `@loamui/core`.

# Accessibility

LoamUI's accessibility comes from the platform first: real elements with built-in semantics, native behaviours instead of re-implementations, and ARIA only where the platform has no word for something. On top of that sit specific, engineered guarantees, listed here together with how they are tested and where the limits are.

## Semantics from the platform

- Buttons are `<button>`, dialogs are `<dialog>` opened with `showModal()` (focus containment,
  Escape, and focus restore are the browser's), accordions are `<details>`/`<summary>` with native
  exclusivity via `name`, separators are `<hr>`, grouped controls use `<fieldset>`/`<legend>`.
- Every styled form control wraps a real native input: checkboxes, radios, switches (a checkbox
  with `role="switch"`), ranges (`<input type="range">`). So keyboard operation, form
  participation, and assistive-technology reporting come from the platform.
- Toasts are native live regions: `role="status"` announces politely; `priority: "high"` renders
  `role="alert"` and interrupts. Field errors are `role="alert"` and joined to their control via
  composed `aria-describedby`.
- Every page's first Tab stop should be a [SkipLink](/docs/components/skip-link) to the main
  content. Keyboard and screen-reader users otherwise re-traverse the whole header on every page.
  Point it at a focusable landmark (`<main id="content" tabIndex={-1}>`); this site does exactly
  that.

## Keyboard patterns

- **Menu** implements the menu-button pattern from the ARIA Authoring Practices Guide (APG): ArrowDown/ArrowUp on the trigger open and focus
  the first/last item; inside, arrow keys rove real focus (looping), Home/End jump, typing jumps
  to the next matching item, and Escape or activation returns focus to the trigger. Focus moves;
  it is never trapped.
- **Tabs** follow the tabs pattern with `aria-selected` wiring, and inactive panels stay reachable
  by find-in-page (`hidden="until-found"` where supported; a match activates the tab).
- **Tooltips** open on keyboard focus as well as hover, and F6 jumps into the **toast** viewport
  (a labelled region) so a toast's action is reachable from anywhere.
- Disabled menu items use `aria-disabled` (visible to assistive technology, skipped by roving
  focus) rather than vanishing from the accessibility tree.

## Engineered WCAG specifics

- **1.4.13 (Content on Hover or Focus)**: tooltips are dismissible with Escape without moving
  focus, hoverable across the gap onto the bubble, and persistent while hovered or focused; hover
  and focus are tracked independently so a passing pointer cannot steal a focused trigger's
  tooltip.
- **2.2.1 (Timing Adjustable)**: toast auto-dismiss timers pause while the pointer or keyboard
  focus is inside the viewport and resume with the remaining time.
- **2.5.8 (Target Size)**: the switch's invisible input is floored at 24px even where the
  visible track is smaller; buttons and text controls share a derived anatomy that keeps them
  comfortably above the minimum at every container width.
- **1.4.3 / 1.4.11 (Contrast)**: the token palette is audited in CI: every text pair at 4.5:1 or
  better, boundaries and focus rings at 3:1 or better, in both colour schemes. Fills pair white
  text with darkened surfaces in light mode and dark text with raw status colours in dark mode,
  because that is the only pairing every status passes.
- **Focus visibility**: every interactive element shows a brand `:focus-visible` outline offset
  from the control, so the true surface shows through the gap and the ring reads as separate on
  any background. Focus styling is never removed without a replacement.
- **Not colour alone**: state always carries a second signal: the tick and dash glyphs on
  checkboxes, thumb position on switches, the error message text beside a danger border, the word
  "(optional)" beside labels.

## User preferences are the baseline

The user's stated preferences are the default state, and everything beyond them is an explicit
opt-in:

- **Motion is opt-in.** Animations and large transitions exist only inside
  `prefers-reduced-motion: no-preference`; the absence of motion is the baseline, so nothing needs
  to be switched off.
- **Colour scheme is followed natively** via `color-scheme` and `light-dark()` tokens; the
  `data-theme` attribute is the explicit override.
- **Forced colours are honoured, not fought.** Components provide forced-colors styles; browser coverage is tracked separately; where a state was carried only by background paint (switch tracks, radio dots, progress
  fills, selection highlights) it is re-expressed in system colours (`Highlight`, `CanvasText`,
  `GrayText`) inside `@media (forced-colors: active)`.

## ARIA is derived, not declared

Accessibility state is derived from one source of truth rather than set by hand. A field receives
explicit validation state through `Field.Root invalid`; CSS reads the control’s
`aria-invalid`. Error messages are composed independently. Message IDs register
after hydration; explicit ARIA links support initial server HTML. On the native validation path, an attempted submission
opens the invalid state; later input clears it as soon as the value is valid. The same state is
mirrored onto `aria-invalid`, so what assistive technology hears always matches what the screen
shows. Icon-only buttons are detected by the `aria-label` they must carry anyway; the compact style
only appears when the button is correctly labelled.

## Forms guidance

Labels are real `<label>` elements tied to their controls; placeholders are never used as labels.
Optional fields are marked with the word "(optional)"; there is no asterisk convention, and the
requirement itself is conveyed by the native `required` attribute. Buttons act, links navigate: a
button that navigates breaks right-click, middle-click and open-in-new-tab.

## How this is tested, and the limits

- An axe audit runs over a representative render of every component in the unit suite, and
  keyboard behaviour (roving focus, looping, typeahead, focus return, dismissal) is asserted by
  interaction tests.
- Storybook carries the a11y addon and play functions for the interactive components; run it
  locally to check what jsdom cannot (native dialog focus, popovers, computed styles). It is a
  workbench, not a CI gate.
- Colour contrast is verified two ways. A CI audit computes the WCAG ratio of the token pairs
  the components use for text, fills, borders and focus rings, in both schemes, and fails the
  build on regression; Storybook's a11y addon checks rendered output. Forced-colours rendering is
  verified with emulation. No automated tool replaces testing with actual screen readers, so
  treat this page as the contract, not a substitute for testing your composed product.
