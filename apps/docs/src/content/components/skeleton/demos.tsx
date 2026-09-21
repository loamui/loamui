"use client";

import { useState } from "react";
import { Avatar, Button, Skeleton } from "@loamui/core";

export function SkeletonSwapDemo() {
  const [loading, setLoading] = useState(true);
  return (
    <div style={{ display: "grid", gap: "var(--loam-space-s)", justifyItems: "start" }}>
      <Skeleton visible={loading}>
        <Avatar.Root role="img" aria-label="Ada Lovelace">
          <Avatar.Fallback>AL</Avatar.Fallback>
        </Avatar.Root>
      </Skeleton>
      <Button onClick={() => setLoading((l) => !l)}>
        {loading ? "Finish loading" : "Load again"}
      </Button>
    </div>
  );
}
