"use client";

import { createContext } from "react";

/** True inside a Table's scroll region: Th throws without it. */
export const TableContext = createContext(false);

export type TableSortDirection = "ascending" | "descending" | "none";

/** The column's sort, read by the SortButton inside a Th. */
export const ThContext = createContext<TableSortDirection | null>(null);
