import type { ComponentProps, JSX } from "react";

/**
 * The props of a part that renders one native element: every attribute of
 * that element plus `ref` as an ordinary prop (React 19). Use it instead of
 * `HTMLAttributes<T>`, which has never carried `ref`.
 *
 * ```ts
 * export interface FieldRootProps extends PartProps<"div"> { … }
 * ```
 */
export type PartProps<E extends keyof JSX.IntrinsicElements> = ComponentProps<E>;

export type LoamUISize = "sm" | "md" | "lg";
