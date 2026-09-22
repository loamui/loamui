"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { FocusEvent as ReactFocusEvent } from "react";
import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";
import { cssSafeId } from "../../../utils/anchor.js";
import { useControllable } from "../../../hooks/use-controllable.js";
import {
  ComboboxContext,
  NO_LABELS,
  defaultStatus,
  inPaintedOrder,
} from "./ComboboxRootContext.js";
import type {
  ComboboxContextValue,
  ComboboxLabels,
  ComboboxOptionEntry,
} from "./ComboboxRootContext.js";

/**
 * A text box with a list of suggestions under it, composed from parts: the
 * APG editable combobox with a listbox popup.
 *
 * The Input is the library's Input wearing `role="combobox"`, so it reads
 * its label, description and error from a surrounding `Field.Root` like any
 * control. Which options appear is the consumer's decision: render the
 * Options that match the text (`inputValue`) and the component manages the
 * highlight, the selection, the open state and the announcements.
 *
 * ```tsx
 * <Field.Root>
 *   <Field.Label>Country</Field.Label>
 *   <Combobox.Root inputValue={query} onInputValueChange={setQuery}>
 *     <Combobox.Input />
 *     <Combobox.List>
 *       {matches.map((c) => (
 *         <Combobox.Option key={c} value={c}>{c}</Combobox.Option>
 *       ))}
 *       <Combobox.Empty />
 *     </Combobox.List>
 *   </Combobox.Root>
 * </Field.Root>
 * ```
 */
export interface ComboboxRootProps extends Omit<PartProps<"div">, "defaultValue"> {
  value?: string | null;
  defaultValue?: string | null;
  /** Called when an option is chosen (its value) or the choice is cleared (null). */
  onValueChange?: (value: string | null) => void;
  inputValue?: string;
  defaultInputValue?: string;
  /** Called whenever the text should change: typing, choosing, clearing. */
  onInputValueChange?: (inputValue: string) => void;
  /** Controlled open state of the list. */
  open?: boolean;
  defaultOpen?: boolean;
  /** Called whenever the open state should change. */
  onOpenChange?: (open: boolean) => void;
  /** Submit the committed value under this name, as a hidden input. */
  name?: string;
  labels?: ComboboxLabels;
}

export function ComboboxRoot({
  value: valueProp,
  defaultValue = null,
  onValueChange,
  inputValue: inputValueProp,
  defaultInputValue = "",
  onInputValueChange,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  name,
  labels: {
    status: statusLabel = defaultStatus,
    empty = "No results",
    toggle = "Show options",
  } = NO_LABELS,
  className,
  children,
  onBlur,
  ...rest
}: ComboboxRootProps) {
  const [value, setValue] = useControllable(valueProp, defaultValue, onValueChange);
  const [inputValue, setInputValue] = useControllable(
    inputValueProp,
    defaultInputValue,
    onInputValueChange,
  );
  const [open, setOpen] = useControllable(openProp, defaultOpen, onOpenChange);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  // The options themselves, keyed by id. `count` mirrors the map's size for
  // rendering; the map is the source, so nothing can disagree with it.
  const optionsRef = useRef(new Map<string, ComboboxOptionEntry>());
  const [count, setCount] = useState(0);
  const [status, setStatus] = useState("");

  const autoId = useId();
  const listId = `${cssSafeId(autoId)}-listbox`;
  const anchorName = `--loam-anchor-${listId}`;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const touchedRef = useRef(false);

  const close = useCallback(() => {
    setOpen(false);
    setHighlightedId(null);
  }, [setOpen]);

  const type = useCallback(
    (text: string) => {
      touchedRef.current = true;
      setInputValue(text);
      setValue(null);
      setHighlightedId(null);
      setOpen(true);
    },
    [setInputValue, setValue, setOpen],
  );

  const commit = useCallback(
    (next: string, label: string) => {
      touchedRef.current = true;
      setValue(next);
      setInputValue(label);
      close();
    },
    [setValue, setInputValue, close],
  );

  const clear = useCallback(() => {
    touchedRef.current = true;
    setValue(null);
    setInputValue("");
    setHighlightedId(null);
  }, [setValue, setInputValue]);

  const inputValueRef = useRef(inputValue);
  inputValueRef.current = inputValue;
  const adoptLabel = useCallback(
    (label: string) => {
      if (touchedRef.current || inputValueRef.current !== "") return;
      setInputValue(label);
    },
    [setInputValue],
  );

  const releaseHighlight = useCallback((id: string) => {
    setHighlightedId((current) => (current === id ? null : current));
  }, []);

  const highlightedRef = useRef(highlightedId);
  highlightedRef.current = highlightedId;
  const moveHighlight = useCallback((to: "next" | "previous" | "first" | "last") => {
    const options = inPaintedOrder(optionsRef.current.values());
    if (options.length === 0) return;
    const current = options.findIndex((o) => o.id === highlightedRef.current);
    const last = options.length - 1;
    let index: number;
    switch (to) {
      case "first":
        index = 0;
        break;
      case "last":
        index = last;
        break;
      case "next":
        index = current < 0 ? 0 : Math.min(current + 1, last);
        break;
      case "previous":
        index = current < 0 ? last : Math.max(current - 1, 0);
        break;
    }
    setHighlightedId(options[index]?.id ?? null);
  }, []);

  const getOption = useCallback((id: string) => optionsRef.current.get(id), []);

  const registerOption = useCallback((option: ComboboxOptionEntry) => {
    optionsRef.current.set(option.id, option);
    setCount(optionsRef.current.size);
    return () => {
      optionsRef.current.delete(option.id);
      setCount(optionsRef.current.size);
    };
  }, []);

  // Keep the highlighted option in view; the list scrolls, the page does not.
  useEffect(() => {
    if (!open || !highlightedId) return;
    optionsRef.current.get(highlightedId)?.node?.scrollIntoView?.({ block: "nearest" });
  }, [open, highlightedId]);

  const labels = useMemo(
    () => ({ status: statusLabel, empty, toggle }),
    [statusLabel, empty, toggle],
  );

  // Options register in layout effects, which run before this one, so the map
  // already holds the committed list; `count` state is a render behind it and
  // must never reach the live region.
  useLayoutEffect(() => {
    setStatus(open ? labels.status(optionsRef.current.size) : "");
  }, [open, count, labels]);

  const ctx = useMemo<ComboboxContextValue>(
    () => ({
      open,
      setOpen,
      close,
      value,
      inputValue,
      type,
      commit,
      clear,
      adoptLabel,
      highlightedId,
      highlight: setHighlightedId,
      releaseHighlight,
      moveHighlight,
      registerOption,
      getOption,
      count,
      listId,
      anchorName,
      inputRef,
      listRef,
      labels,
    }),
    [
      open,
      setOpen,
      close,
      value,
      inputValue,
      type,
      commit,
      clear,
      adoptLabel,
      highlightedId,
      releaseHighlight,
      moveHighlight,
      registerOption,
      getOption,
      count,
      listId,
      anchorName,
      labels,
    ],
  );

  return (
    <ComboboxContext value={ctx}>
      <div
        className={cx("loam-Combobox", className)}
        onBlur={(e: ReactFocusEvent<HTMLDivElement>) => {
          onBlur?.(e);
          // Focus left the whole control (the list is not focusable, so a
          // click on an option never gets here: it keeps focus in the box).
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) close();
        }}
        {...rest}
      >
        {children}
        {name !== undefined && <input type="hidden" name={name} value={value ?? ""} />}
        <span role="status" className="loam-VisuallyHidden">
          {status}
        </span>
      </div>
    </ComboboxContext>
  );
}
