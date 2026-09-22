"use client";

import { Button } from "../../Button/Button.js";
import type { ButtonProps } from "../../Button/Button.js";

import { useSearchContext } from "../root/SearchRootContext.js";

export interface SearchButtonProps extends ButtonProps {}

/**
 * The submit. Children default to "Search"; an icon with an `aria-label`
 * makes it icon-only (Button detects that from the name).
 */
export function SearchButton({ children, ...rest }: SearchButtonProps) {
  useSearchContext("Search.Button");
  return (
    <Button type="submit" {...rest}>
      {children ?? "Search"}
    </Button>
  );
}
