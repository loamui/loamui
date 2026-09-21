"use client";

import { createContext } from "react";
import { useRequiredContext } from "../../../hooks/use-required-context.js";

export type AvatarImageStatus = "loading" | "loaded" | "error";

export const AvatarContext = createContext<{
  status: AvatarImageStatus;
  setStatus: (status: AvatarImageStatus) => void;
} | null>(null);

export function useAvatarContext(part: string) {
  return useRequiredContext(AvatarContext, part, "Avatar.Root");
}
