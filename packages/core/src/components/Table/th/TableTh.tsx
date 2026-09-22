"use client";

import { use } from "react";
import type { PartProps } from "../../../utils/props.js";
import { TableContext, ThContext } from "../root/TableRootContext.js";
import type { TableSortDirection } from "../root/TableRootContext.js";

export interface TableThProps extends PartProps<"th"> {
  /**
   * The column's current sort, emitted as `aria-sort`. `"none"` marks a
   * column that can be sorted but is not; leave it out for a header that
   * is not sortable at all.
   */
  sort?: TableSortDirection;
}

/**
 * A header cell. On its own it is a `<th scope="col">`; with `sort` it
 * carries `aria-sort`, and the `Table.SortButton` inside it reads the
 * value to say what a press will do. Belongs inside a `Table`, whose
 * stylesheet sets it.
 */
export function TableTh({ sort, scope = "col", className, children, ...rest }: TableThProps) {
  if (!use(TableContext)) {
    throw new Error("Table.Th must be rendered inside <Table.Root>.");
  }
  return (
    <ThContext value={sort ?? null}>
      <th aria-sort={sort} scope={scope} {...rest} className={className}>
        {children}
      </th>
    </ThContext>
  );
}
