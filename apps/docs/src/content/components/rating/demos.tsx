"use client";

import { Rating } from "@loamui/core";

/** Function-valued `labels` cannot cross the server/client boundary, so this demo is a client component. */
export function RatingLabelsDemo() {
  return (
    <div style={{ display: "grid", gap: "var(--loam-space-2xs)", justifyItems: "start" }}>
      <Rating
        label="Notez cette recette"
        labels={{
          star: (n) => `${n} ${n === 1 ? "étoile" : "étoiles"}`,
          value: (v, max) => `${v} sur ${max}`,
        }}
      />
      <Rating
        readOnly
        label="Note moyenne"
        value={3.5}
        labels={{ value: (v, max) => `${v} sur ${max}` }}
      />
    </div>
  );
}
