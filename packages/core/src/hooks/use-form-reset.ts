"use client";

import { useCallback } from "react";
import type { RefCallback } from "react";

/**
 * A ref callback that follows the control's form: attached, it listens for
 * the form's `reset` and its cleanup (React 19) removes the listener. The
 * form is known only once the node is in the document, which is when a ref
 * attaches, so no state or effect is needed to find it. Pass a stable
 * `onReset`: a new function re-attaches the listener.
 */
export function useFormReset<T extends { form: HTMLFormElement | null }>(
  onReset: (control: T) => void,
): RefCallback<T> {
  return useCallback(
    (node: T | null) => {
      const form = node?.form;
      if (!node || !form) return;
      const reset = () => onReset(node);
      form.addEventListener("reset", reset);
      return () => form.removeEventListener("reset", reset);
    },
    [onReset],
  );
}
