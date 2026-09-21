// LoamUI — public API barrel.

export { cx } from "./utils/cx.js";
export type { LoamUISize, PartProps } from "./utils/props.js";

// Composition plumbing: the `render` contract every compound part honours,
// exported so a composition built on core can offer the same prop.
export { renderWithProps } from "./utils/render.js";
export type { RenderProp } from "./utils/render.js";
// Server-safe naming: a Root named by one of its parts emits the reference
// in the first render, so landmarks are named before hydration.
export { useNamedRoot, useNamePart, useOptionalSlot } from "./hooks/use-naming.js";

// Inputs
export * from "./components/Field/index.js";
export * from "./components/Fieldset/index.js";
export * from "./components/Button/index.js";
export * from "./components/Input/index.js";
export * from "./components/PasswordInput/index.js";
export * from "./components/Textarea/index.js";
export * from "./components/Select/index.js";
export * from "./components/Checkbox/index.js";
export * from "./components/Combobox/index.js";
export * from "./components/DateInput/index.js";
export * from "./components/ErrorSummary/index.js";
export * from "./components/Radio/index.js";
export * from "./components/SegmentedControl/index.js";
export * from "./components/Switch/index.js";
export * from "./components/Range/index.js";
export * from "./components/Search/index.js";
export * from "./components/QuantityInput/index.js";
export * from "./components/FileInput/index.js";
export * from "./components/Rating/index.js";
export * from "./components/CopyButton/index.js";

// Data display
export * from "./components/Badge/index.js";
export * from "./components/Separator/index.js";
export * from "./components/Card/index.js";
export * from "./components/Avatar/index.js";
export * from "./components/Price/index.js";
export * from "./components/Time/index.js";
export * from "./components/Table/index.js";
export * from "./components/Carousel/index.js";
export * from "./components/Stepper/index.js";

// Feedback
export * from "./components/Alert/index.js";
export * from "./components/Progress/index.js";
export * from "./components/Meter/index.js";
export * from "./components/Skeleton/index.js";
export * from "./components/Loader/index.js";
export * from "./components/Toast/index.js";

// Overlays
export * from "./components/Tooltip/index.js";
export * from "./components/Modal/index.js";
export * from "./components/Drawer/index.js";
export * from "./components/Popover/index.js";
export * from "./components/Menu/index.js";

// Navigation
export * from "./components/Tabs/index.js";
export * from "./components/Details/index.js";
export * from "./components/SignpostLink/index.js";
export * from "./components/SkipLink/index.js";
export * from "./components/VisuallyHidden/index.js";
export * from "./components/Breadcrumbs/index.js";
export * from "./components/Pagination/index.js";
export * from "./components/Nav/index.js";
export { useScrollSpy } from "./hooks/use-scroll-spy.js";
export type { UseScrollSpyOptions } from "./hooks/use-scroll-spy.js";

// Layout is not a LoamUI concern: compose native CSS layout modules (flow,
// grid, flex, multicol) with the space tokens inside your own components.
// See the Layout guide in the docs.
