"use client";

import { useState } from "react";
import { Badge, Price, Table } from "@loamui/core";
import type { TableSortDirection } from "@loamui/core";
import "./example.css";

const STOCK = [
  { variety: "Broad bean ‘Crimson Flowered’", type: "Legume", packets: 140, price: 2.8 },
  { variety: "Beetroot ‘Bull’s Blood’", type: "Root", packets: 62, price: 2.4 },
  { variety: "Kale ‘Ragged Jack’", type: "Brassica", packets: 18, price: 2.6 },
  { variety: "Lettuce ‘Bronze Arrow’", type: "Salad", packets: 205, price: 2.2 },
  { variety: "Tomato ‘Gardener’s Delight’", type: "Fruit", packets: 9, price: 3 },
  { variety: "Squash ‘Crown Prince’", type: "Cucurbit", packets: 47, price: 3.4 },
];

type Column = "variety" | "packets" | "price";

interface Sort {
  column: Column;
  direction: TableSortDirection;
}

export default function Example() {
  const [sort, setSort] = useState<Sort>({ column: "variety", direction: "ascending" });

  const rows = [...STOCK].sort((a, b) => {
    const order =
      sort.column === "variety"
        ? a.variety.localeCompare(b.variety, "en")
        : a[sort.column] - b[sort.column];
    return sort.direction === "descending" ? -order : order;
  });

  const sortFor = (column: Column): TableSortDirection =>
    sort.column === column ? sort.direction : "none";
  const sortBy = (column: Column) => (direction: TableSortDirection) =>
    setSort({ column, direction });

  return (
    <Table.Root className="table-sortable" highlightOnHover>
      <Table.Caption>
        Seed stock on 8 September 2026: packets on the shelf, by variety.
      </Table.Caption>
      <Table.Thead>
        <Table.Tr>
          <Table.Th sort={sortFor("variety")}>
            <Table.SortButton onSortChange={sortBy("variety")}>Variety</Table.SortButton>
          </Table.Th>
          <Table.Th>Type</Table.Th>
          <Table.Th sort={sortFor("packets")} className="number">
            <Table.SortButton onSortChange={sortBy("packets")}>In stock</Table.SortButton>
          </Table.Th>
          <Table.Th sort={sortFor("price")} className="number">
            <Table.SortButton onSortChange={sortBy("price")}>Price</Table.SortButton>
          </Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {rows.map((row) => (
          <Table.Tr key={row.variety}>
            <Table.Th scope="row">{row.variety}</Table.Th>
            <Table.Td>{row.type}</Table.Td>
            <Table.Td className="number">
              {row.packets.toLocaleString("en")}
              {row.packets < 20 && (
                <span className="low">
                  <Badge.Root>
                    <Badge.Text>Low</Badge.Text>
                  </Badge.Root>
                </span>
              )}
            </Table.Td>
            <Table.Td className="number">
              <Price value={row.price} currency="GBP" />
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table.Root>
  );
}
