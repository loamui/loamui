"use client";

import { useMemo } from "react";
import type { CSSProperties, MouseEvent as ReactMouseEvent, Ref } from "react";

import type { PartProps } from "../../../utils/props.js";
import { composeRefs, renderWithProps } from "../../../utils/render.js";
import { useComboboxContext } from "../root/ComboboxRootContext.js";

export interface ComboboxListProps extends PartProps<"ul"> {}

/** The listbox wiring the List part attaches to its `<ul>`. */
interface ComboboxListWiring {
  ref: Ref<HTMLUListElement> | undefined;
  id: string;
  role: "listbox";
  hidden: true | undefined;
  /** Styling hook — present while the list is open. */
  "data-open": true | undefined;
  style: CSSProperties;
  onMouseDown: (e: ReactMouseEvent<HTMLUListElement>) => void;
}

/** The listbox under the box. Its children are Options and, last, an Empty. */
export function ComboboxList({ ref, ...rest }: ComboboxListProps) {
  const ctx = useComboboxContext("Combobox.List");
  const listRef = useMemo(() => composeRefs(ref, ctx.listRef), [ref, ctx.listRef]);
  const wiring: ComboboxListWiring = {
    ref: listRef,
    id: ctx.listId,
    role: "listbox",
    hidden: ctx.open ? undefined : true,
    "data-open": ctx.open || undefined,
    style: { positionAnchor: ctx.anchorName } as CSSProperties,
    // The box keeps focus through a click on the list.
    onMouseDown: (e) => e.preventDefault(),
  };
  return <>{renderWithProps(<ul {...rest} />, wiring)}</>;
}

/** Wiring an Option attaches to whatever it renders. */
