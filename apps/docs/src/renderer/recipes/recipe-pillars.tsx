import { PILLARS, type RecipeMeta } from "@/recipes/types";
import "./recipe-pillars.css";

/** Only report the example's own rationale, never fill gaps with a claim of verification. */
export function RecipePillars({
  notes,
  composition,
}: {
  notes: RecipeMeta["notes"];
  composition?: RecipeMeta["composition"];
}) {
  return (
    <dl className="site-RecipePillars">
      {PILLARS.filter((pillar) => notes[pillar.key]).map((pillar) => {
        const note = notes[pillar.key];
        return (
          <div key={pillar.key} className="row">
            <dt className="name">{pillar.name}</dt>
            <dd className="note">{note}</dd>
          </div>
        );
      })}
      {composition && (
        <div className="row">
          <dt className="name">Composition</dt>
          <dd className="note">{composition}</dd>
        </div>
      )}
    </dl>
  );
}
