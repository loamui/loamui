"use client";

import { useId, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useFieldControlProps } from "../../Field/root/FieldRootContext.js";
import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";
import { FileInputContext } from "./FileInputRootContext.js";
import type { FileInputContextValue } from "./FileInputRootContext.js";

/**
 * Only a drag carrying files lights the target; text dragged from the page
 * is left to the browser. Outside a browser the transfer may be absent, in
 * which case the drag is taken to be files.
 */
function carriesFiles(transfer: DataTransfer | undefined): boolean {
  return !transfer?.types || Array.from(transfer.types).includes("Files");
}

/** A one-file list: the picker allows a single-file control one file, so a drop does the same. */
function firstOf(files: FileList): FileList {
  const list = new DataTransfer();
  const first = files[0];
  if (first) list.items.add(first);
  return list.files;
}

export interface FileInputRootProps extends PartProps<"div"> {
  children?: ReactNode;
}

/**
 * The drop target and the box. Holds the selected files for the Files
 * part; carries `data-dragging` while a file is held over it.
 */
export function FileInputRoot({
  className,
  children,
  onDragEnter,
  onDragOver,
  onDragLeave,
  onDrop,
  ref,
  ...rest
}: FileInputRootProps) {
  const field = useFieldControlProps();
  const autoId = useId();
  const id = field.id ?? autoId;
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  // dragenter/dragleave fire for every descendant the pointer crosses; a
  // depth count keeps the state on until the pointer leaves the box itself.
  const depth = useRef(0);
  const controlRef = useRef<HTMLInputElement | null>(null);
  const value = useMemo<FileInputContextValue>(
    () => ({ id, files, setFiles, controlRef }),
    [id, files],
  );

  return (
    <FileInputContext value={value}>
      <div
        ref={ref}
        className={cx("loam-FileInput", className)}
        data-dragging={dragging || undefined}
        {...rest}
        onDragEnter={(event) => {
          onDragEnter?.(event);
          if (!carriesFiles(event.dataTransfer)) return;
          event.preventDefault();
          depth.current += 1;
          setDragging(true);
        }}
        onDragOver={(event) => {
          onDragOver?.(event);
          const transfer = event.dataTransfer;
          if (!carriesFiles(transfer)) return;
          // Without this the browser refuses the drop.
          event.preventDefault();
          if (transfer) transfer.dropEffect = "copy";
        }}
        onDragLeave={(event) => {
          onDragLeave?.(event);
          if (depth.current === 0) return;
          depth.current -= 1;
          if (depth.current === 0) setDragging(false);
        }}
        onDrop={(event) => {
          onDrop?.(event);
          depth.current = 0;
          setDragging(false);
          const transfer = event.dataTransfer;
          if (!carriesFiles(transfer)) return;
          event.preventDefault();
          const input = controlRef.current;
          const dropped = transfer?.files;
          if (!input || input.disabled || !dropped?.length) return;
          // The dropped files become the input's own, so the form submits
          // them and every change listener (the Files list included) runs.
          input.files = input.multiple || dropped.length === 1 ? dropped : firstOf(dropped);
          input.dispatchEvent(new Event("change", { bubbles: true }));
        }}
      >
        {children}
      </div>
    </FileInputContext>
  );
}
