// No "use client": these parts are pass-throughs over the native elements the
// Table's scope already styles, so they carry no state and render on the
// server. They exist to give the anatomy a name — every element the scope
// paints is reachable as a part — not to re-implement the table.
import type { PartProps } from "../../utils.js";

export interface TableCaptionProps extends PartProps<"caption"> {}
export interface TableTheadProps extends PartProps<"thead"> {}
export interface TableTbodyProps extends PartProps<"tbody"> {}
export interface TableTfootProps extends PartProps<"tfoot"> {}
export interface TableTrProps extends PartProps<"tr"> {}
export interface TableTdProps extends PartProps<"td"> {}

/** The table's name. Put it first: it is the accessible name of the region. */
export function TableCaption(props: TableCaptionProps) {
  return <caption {...props} />;
}

/** The header rows. */
export function TableThead(props: TableTheadProps) {
  return <thead {...props} />;
}

/** The body rows. */
export function TableTbody(props: TableTbodyProps) {
  return <tbody {...props} />;
}

/** The footer rows, for totals and the like. */
export function TableTfoot(props: TableTfootProps) {
  return <tfoot {...props} />;
}

/** A row. */
export function TableTr(props: TableTrProps) {
  return <tr {...props} />;
}

/** A data cell. For a header cell, reach for `Table.Th`, which can sort. */
export function TableTd(props: TableTdProps) {
  return <td {...props} />;
}
