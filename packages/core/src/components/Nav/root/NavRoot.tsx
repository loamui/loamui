"use client";

import { useMemo } from "react";
import type { ReactNode } from "react";
import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";
import { useNamedRoot } from "../../../hooks/use-naming.js";
import { DEFAULT_LABELS, NavContext } from "./NavRootContext.js";
import type { NavContextValue, NavLabels } from "./NavRootContext.js";

/**
 * Vertical navigation, composed from parts: a `nav` landmark holding lists
 * of links, with the current page marked and related pages folded into
 * groups.
 *
 * ```tsx
 * <Nav.Root>
 *   <Nav.Title>Project</Nav.Title>
 *   <Nav.List>
 *     <Nav.Item><Nav.Link href="/">Dashboard</Nav.Link></Nav.Item>
 *     <Nav.Item><Nav.Link href="/projects" current>Projects</Nav.Link></Nav.Item>
 *     <Nav.Item>
 *       <Nav.Group defaultOpen>
 *         <Nav.GroupTitle>Reports</Nav.GroupTitle>
 *         <Nav.List>
 *           <Nav.Item><Nav.Link href="/reports/weekly">Weekly</Nav.Link></Nav.Item>
 *         </Nav.List>
 *       </Nav.Group>
 *     </Nav.Item>
 *   </Nav.List>
 * </Nav.Root>
 * ```
 *
 * The landmark is named by its Title from the first render; without one it
 * carries `labels.navigation`. A Link is an `<a href>` by default, or a
 * router's link through `render`; `current` sets `aria-current` and the
 * stylesheet marks it with a line and weight, never colour alone. A Group
 * is a native `details`, so it folds without JavaScript. A List nested in
 * an Item indents a level.
 *
 * One Root carries one name, so a sidebar with several titled sections is
 * one Root per section, stacked; the stylesheet spaces them. A horizontal
 * nav is the consumer's flex row on the List, with the current marker moved
 * under the link by the public `--loam-nav-current-edge: block-end` on the
 * Root (`inline-start` by default). A header's dropdown of links is a
 * Dropdown in an Item: a DropdownTrigger set like the links beside it, then
 * a DropdownPanel (a native popover, anchored to the trigger) holding a List.
 */

/** The words a Nav says on its own, each with an English default. */
export interface NavRootProps extends PartProps<"nav"> {
  labels?: NavLabels;
  /** A Title, then Lists. */
  children?: ReactNode;
}

/**
 * The `nav` landmark. Named by its Title from the first render, so the
 * server HTML already carries the name; if no Title registers, the
 * reference is dropped after mount and `labels.navigation` names it
 * instead. A consumer's `aria-label` or `aria-labelledby` wins over both.
 */
export function NavRoot({ labels, className, children, ref, ...rest }: NavRootProps) {
  const { nameId, register, labelling } = useNamedRoot(
    rest,
    labels?.navigation ?? DEFAULT_LABELS.navigation,
  );
  const value = useMemo<NavContextValue>(() => ({ nameId, register }), [nameId, register]);
  return (
    <NavContext value={value}>
      <nav ref={ref} className={cx("loam-Nav", className)} {...rest} {...labelling}>
        {children}
      </nav>
    </NavContext>
  );
}
