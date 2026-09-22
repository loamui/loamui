"use client";

import type { ReactNode } from "react";

import type { PartProps } from "../../../utils/props.js";
import { useFileInputContext } from "../root/FileInputRootContext.js";

export interface FileInputPromptProps extends PartProps<"label"> {
  children?: ReactNode;
}

/**
 * The visible invitation ("Choose a file or drop it here"): a `<label>` for
 * the control, so clicking it opens the picker and its text joins the
 * control's accessible name.
 */
export function FileInputPrompt({
  htmlFor,
  className,
  children,
  ref,
  ...rest
}: FileInputPromptProps) {
  const ctx = useFileInputContext("FileInput.Prompt");
  return (
    <label ref={ref} className={className} htmlFor={htmlFor ?? ctx.id} {...rest}>
      {children}
    </label>
  );
}
