/**
 * Support probe and id plumbing for the anchored-popover components
 * (Popover, Menu, Tooltip): the enhanced path needs both the popover API
 * and CSS anchor positioning; anything less uses the JS fallback.
 */
export function supportsAnchoredPopover(): boolean {
  return (
    typeof HTMLElement !== "undefined" &&
    "showPopover" in HTMLElement.prototype &&
    typeof CSS !== "undefined" &&
    CSS.supports("anchor-name: --loam-probe")
  );
}

/**
 * React ids contain ":", which is illegal in the CSS custom idents these
 * components derive (`--loam-anchor-…`); strip to a CSS-safe token or
 * anchor positioning silently fails.
 */
export function cssSafeId(reactId: string): string {
  return reactId.replace(/[^a-zA-Z0-9-]/g, "");
}
