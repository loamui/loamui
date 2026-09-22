import type { PropRow } from "../types";
import { ScrollRegion } from "../shared/ScrollRegion";
import "./PropsTable.css";

export function PropsTable({
  rows,
  nameLabel = "Prop",
  typeLabel = "Type",
  label,
}: {
  rows: PropRow[];
  nameLabel?: string;
  typeLabel?: string;
  /** Names the table's scroller once it scrolls. @default "<nameLabel> table" */
  label?: string;
}) {
  return (
    <ScrollRegion className="site-PropsTable" label={label ?? `${nameLabel} table`}>
      <table>
        <thead>
          <tr>
            <th scope="col">{nameLabel}</th>
            <th scope="col">{typeLabel}</th>
            <th scope="col">Default</th>
            <th scope="col">Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name}>
              <td>
                <code className="name">{r.name}</code>
              </td>
              <td>
                <code className="type">{r.type}</code>
              </td>
              <td>
                {r.default ? (
                  <code className="default">{r.default}</code>
                ) : (
                  <span aria-label="none">—</span>
                )}
              </td>
              <td>{r.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </ScrollRegion>
  );
}
