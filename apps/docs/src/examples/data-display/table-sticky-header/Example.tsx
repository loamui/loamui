import { Table } from "@loamui/core";
import "./example.css";

const STOCK = [
  { variety: "Broad bean ‘Crimson Flowered’", type: "Legume", packets: 140, germination: 92 },
  { variety: "Beetroot ‘Bull’s Blood’", type: "Root", packets: 62, germination: 88 },
  { variety: "Kale ‘Ragged Jack’", type: "Brassica", packets: 18, germination: 90 },
  { variety: "Lettuce ‘Bronze Arrow’", type: "Salad", packets: 205, germination: 95 },
  { variety: "Tomato ‘Gardener’s Delight’", type: "Fruit", packets: 9, germination: 96 },
  { variety: "Squash ‘Crown Prince’", type: "Cucurbit", packets: 47, germination: 91 },
  { variety: "Pea ‘Alderman’", type: "Legume", packets: 88, germination: 93 },
  { variety: "Carrot ‘Chantenay Red Cored’", type: "Root", packets: 156, germination: 84 },
  { variety: "Leek ‘Musselburgh’", type: "Allium", packets: 71, germination: 89 },
  { variety: "Chard ‘Rainbow’", type: "Leaf", packets: 112, germination: 87 },
  { variety: "Sweet pea ‘Cupani’", type: "Flower", packets: 233, germination: 82 },
  { variety: "Calendula ‘Indian Prince’", type: "Flower", packets: 64, germination: 94 },
];

export default function Example() {
  return (
    <div className="table-sticky-header">
      <Table.Root stickyHeader className="stock">
        <Table.Caption>
          Seed stock on 8 September 2026, all 12 lines: scroll the list and the header stays.
        </Table.Caption>
        <Table.Thead>
          <Table.Tr>
            <Table.Th scope="col">Variety</Table.Th>
            <Table.Th scope="col">Type</Table.Th>
            <Table.Th scope="col" className="number">
              In stock
            </Table.Th>
            <Table.Th scope="col" className="number">
              Germination
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {STOCK.map((row) => (
            <Table.Tr key={row.variety}>
              <Table.Th scope="row">{row.variety}</Table.Th>
              <Table.Td>{row.type}</Table.Td>
              <Table.Td className="number">{row.packets.toLocaleString("en")}</Table.Td>
              <Table.Td className="number">{row.germination}%</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table.Root>
    </div>
  );
}
