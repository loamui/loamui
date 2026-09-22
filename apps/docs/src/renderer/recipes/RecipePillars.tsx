import { PILLARS, type RecipeMeta } from "@/recipes/types";
import "./RecipePillars.css";

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
          <div key={pillar.key}>
            <dt>{pillar.name}</dt>
            <dd>{note}</dd>
          </div>
        );
      })}
      {composition && (
        <div>
          <dt>Composition</dt>
          <dd>{composition}</dd>
        </div>
      )}
    </dl>
  );
}
