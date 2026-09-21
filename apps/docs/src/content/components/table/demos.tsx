"use client";

import { useMemo, useState } from "react";
import { Field, Input, Table } from "@loamui/core";
import type { TableSortDirection } from "@loamui/core";

const people = [
  { name: "Ada Lovelace", role: "Analyst", joined: 2019 },
  { name: "Grace Hopper", role: "Engineer", joined: 2021 },
  { name: "Katherine Johnson", role: "Researcher", joined: 2017 },
  { name: "Mary Jackson", role: "Engineer", joined: 2020 },
  { name: "Margaret Hamilton", role: "Lead", joined: 2018 },
];

type Column = keyof (typeof people)[number];
type Sort = { column: Column; direction: TableSortDirection } | null;

const columns: Array<{ key: Column; label: string }> = [
  { key: "name", label: "Name" },
  { key: "role", label: "Role" },
  { key: "joined", label: "Joined" },
];

/** Search and sort: the consumer holds the state and sorts the rows. */
export function TableSortDemo() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>({ column: "name", direction: "ascending" });

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? people.filter((p) => p.name.toLowerCase().includes(q) || p.role.toLowerCase().includes(q))
      : people;
    if (!sort || sort.direction === "none") return filtered;
    const sign = sort.direction === "ascending" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const x = a[sort.column];
      const y = b[sort.column];
      return (x < y ? -1 : x > y ? 1 : 0) * sign;
    });
  }, [query, sort]);

  return (
    <div style={{ display: "grid", gap: "var(--loam-space-xs)", inlineSize: "100%" }}>
      <Field.Root>
        <Field.Label>Filter people</Field.Label>
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ maxInlineSize: "18rem" }}
        />
      </Field.Root>
      <Table.Root>
        <Table.Caption>People</Table.Caption>
        <Table.Thead>
          <Table.Tr>
            {columns.map((column) => (
              <Table.Th
                key={column.key}
                sort={sort?.column === column.key ? sort.direction : "none"}
              >
                <Table.SortButton
                  onSortChange={(direction) => setSort({ column: column.key, direction })}
                >
                  {column.label}
                </Table.SortButton>
              </Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rows.map((p) => (
            <Table.Tr key={p.name}>
              <Table.Td>{p.name}</Table.Td>
              <Table.Td>{p.role}</Table.Td>
              <Table.Td>{p.joined}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table.Root>
    </div>
  );
}
