"use client";

import { use } from "react";
import type { Context } from "react";

/**
 * Reads a part's context, throwing the library's one message when the part
 * is rendered outside its Root: `${part} must be rendered inside <${root}>.`
 */
export function useRequiredContext<T>(context: Context<T | null>, part: string, root: string): T {
  const value = use(context);
  if (value === null) {
    throw new Error(`${part} must be rendered inside <${root}>.`);
  }
  return value;
}
