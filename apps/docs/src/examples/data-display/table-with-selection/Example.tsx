"use client";

import { useState } from "react";
import { Checkbox, Price, Table, Time } from "@loamui/core";
import "./example.css";

const ORDERS = [
  { id: "HW-1042", member: "Mari Hughes", placed: "2026-09-08", items: 3, total: 14.6 },
  { id: "HW-1041", member: "Dafydd Rees", placed: "2026-09-08", items: 12, total: 41.2 },
  { id: "HW-1040", member: "Amara Okonkwo", placed: "2026-09-07", items: 1, total: 3.4 },
  { id: "HW-1039", member: "Tom Bradshaw", placed: "2026-09-07", items: 6, total: 22.8 },
  { id: "HW-1038", member: "Priya Natarajan", placed: "2026-09-05", items: 4, total: 11 },
  { id: "HW-1037", member: "Nia Prosser", placed: "2026-09-04", items: 8, total: 27.5 },
];

export default function Example() {
  const [selected, setSelected] = useState<ReadonlySet<string>>(new Set());
  const all = selected.size === ORDERS.length;
  const some = selected.size > 0 && !all;

  const toggleAll = () => {
    setSelected(all ? new Set() : new Set(ORDERS.map((order) => order.id)));
  };
  const toggle = (id: string) => {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="table-with-selection">
      <Table.Root className="orders" highlightOnHover>
        <Table.Caption>Orders placed this week, each with a box to select it.</Table.Caption>
        <Table.Thead>
          <Table.Tr>
            <Table.Th scope="col" className="select">
              <Checkbox
                aria-label="Select all orders"
                checked={all}
                indeterminate={some}
                onChange={toggleAll}
              />
            </Table.Th>
            <Table.Th scope="col">Order</Table.Th>
            <Table.Th scope="col">Member</Table.Th>
            <Table.Th scope="col">Placed</Table.Th>
            <Table.Th scope="col" className="number">
              Items
            </Table.Th>
            <Table.Th scope="col" className="number">
              Total
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {ORDERS.map((order) => (
            <Table.Tr key={order.id}>
              <Table.Td className="select">
                <Checkbox
                  aria-label={`Select order ${order.id}`}
                  checked={selected.has(order.id)}
                  onChange={() => toggle(order.id)}
                />
              </Table.Td>
              <Table.Th scope="row">{order.id}</Table.Th>
              <Table.Td>{order.member}</Table.Td>
              <Table.Td>
                <Time value={order.placed} locale="en-GB" dateStyle="medium" />
              </Table.Td>
              <Table.Td className="number">{order.items}</Table.Td>
              <Table.Td className="number">
                <Price value={order.total} currency="GBP" locale="en-GB" />
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table.Root>
      <p className="status" role="status">
        {selected.size === 0
          ? "No orders selected."
          : `${selected.size} of ${ORDERS.length} orders selected.`}
      </p>
    </div>
  );
}
