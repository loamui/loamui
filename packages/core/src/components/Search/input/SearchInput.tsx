"use client";

import { useFieldControlProps } from "../../Field/root/FieldRootContext.js";

import { Input } from "../../Input/Input.js";
import type { InputProps } from "../../Input/Input.js";
import { useSearchContext } from "../root/SearchRootContext.js";

export interface SearchInputProps extends Omit<InputProps, "type"> {
  /** The query's key in the submitted URL. @default "q" */
  name?: string;
}

/** The library's Input as a search box, named by Search.Label or a Field. */
export function SearchInput({ name = "q", id, ...rest }: SearchInputProps) {
  const ctx = useSearchContext("Search.Input");
  const field = useFieldControlProps();
  return (
    <Input
      type="search"
      name={name}
      // A Field around the box names it and owns its id; otherwise the
      // Root's id is what Search.Label points at.
      id={id ?? field.id ?? ctx.inputId}
      inputMode="search"
      enterKeyHint="search"
      {...rest}
    />
  );
}
