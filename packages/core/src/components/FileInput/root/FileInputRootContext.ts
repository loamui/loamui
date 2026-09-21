"use client";

import { createContext } from "react";
import type { RefObject } from "react";
import { useRequiredContext } from "../../../hooks/use-required-context.js";

/**
 * A file picker built on the native `<input type="file">`, composed from
 * parts. The input is the control; the Prompt is its label, so clicking the
 * box opens the picker and keyboard users tab to the input inside it. Drag
 * and drop is an enhancement on the Root: a dropped file lands in the same
 * input, so the form submits it like any other. The Files list is a polite
 * live region, so the choice is announced as well as shown.
 *
 * ```tsx
 * <Field.Root>
 *   <Field.Label>Passport scan</Field.Label>
 *   <Field.Description>PDF or PNG, up to 5 MB</Field.Description>
 *   <FileInput.Root>
 *     <FileInput.Control accept=".pdf,.png" />
 *     <FileInput.Prompt>Choose a file or drop it here</FileInput.Prompt>
 *     <FileInput.Files />
 *   </FileInput.Root>
 * </Field.Root>
 * ```
 */

export interface FileInputContextValue {
  /** The control's id, shared so the Prompt can label it. */
  id: string;
  files: File[];
  setFiles: (files: File[]) => void;
  /**
   * The Control's own input, so a drop can hand it the files. The Control is
   * placed by the consumer, so the Root is told where it is rather than going
   * looking: a nested file input of the consumer's own is not ours to fill.
   */
  controlRef: RefObject<HTMLInputElement | null>;
}

export const FileInputContext = createContext<FileInputContextValue | null>(null);

export function useFileInputContext(part: string): FileInputContextValue {
  return useRequiredContext(FileInputContext, part, "FileInput.Root");
}
