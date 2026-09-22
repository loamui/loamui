"use client";

import type { PartProps } from "../../../utils/props.js";
import { useFileInputContext } from "../root/FileInputRootContext.js";

const UNITS = [
  ["gigabyte", 1e9],
  ["megabyte", 1e6],
  ["kilobyte", 1e3],
] as const;

/** "512 bytes", "12.3 kB", "4.3 MB": the largest unit the size fills. */
function formatSize(bytes: number, locale: string): string {
  const [unit, factor] = UNITS.find(([, per]) => bytes >= per) ?? ["byte", 1];
  return new Intl.NumberFormat(locale, {
    style: "unit",
    unit,
    unitDisplay: unit === "byte" ? "long" : "short",
    maximumFractionDigits: 1,
  }).format(bytes / factor);
}

export interface FileInputFilesProps extends Omit<PartProps<"ul">, "children"> {
  /**
   * The BCP 47 locale the sizes are written in. Set it to the page's
   * language.
   * @default "en"
   */
  locale?: string;
}

/**
 * The selected files, by name and size, in a polite live region: the list
 * is in the page before any choice is made, so filling it is announced.
 */
export function FileInputFiles({ locale = "en", className, ref, ...rest }: FileInputFilesProps) {
  const { files } = useFileInputContext("FileInput.Files");
  return (
    <ul ref={ref} aria-live="polite" className={className} {...rest}>
      {files.map((file) => (
        <li key={`${file.name}:${file.size}:${file.lastModified}`}>
          {file.name} <span className="size">{formatSize(file.size, locale)}</span>
        </li>
      ))}
    </ul>
  );
}
