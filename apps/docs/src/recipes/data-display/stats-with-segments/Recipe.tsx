import { Meter, Table } from "@loamui/core";
import "./recipe.css";

const SHARE = [
  { device: "Phone", visits: 14880, share: 62 },
  { device: "Laptop or desktop", visits: 6960, share: 29 },
  { device: "Tablet", visits: 2160, share: 9 },
];

const TOTAL = SHARE.reduce((sum, row) => sum + row.visits, 0);

export default function Recipe() {
  return (
    <Table.Root className="stats-with-segments">
      <Table.Caption>How members reached the shop in August, by device.</Table.Caption>
      <Table.Thead>
        <Table.Tr>
          <Table.Th scope="col">Device</Table.Th>
          <Table.Th scope="col" className="number">
            Visits
          </Table.Th>
          <Table.Th scope="col" className="share">
            Share
          </Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {SHARE.map((row) => (
          <Table.Tr key={row.device}>
            <Table.Th scope="row">{row.device}</Table.Th>
            <Table.Td className="number">{row.visits.toLocaleString("en")}</Table.Td>
            <Table.Td className="share">
              <span className="figure">{row.share}%</span>
              <Meter value={row.share} max={100} label={`${row.device}, share of visits`} />
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
      <Table.Tfoot>
        <Table.Tr>
          <Table.Th scope="row">All devices</Table.Th>
          <Table.Td className="number">{TOTAL.toLocaleString("en")}</Table.Td>
          <Table.Td className="share">
            <span className="figure">100%</span>
          </Table.Td>
        </Table.Tr>
      </Table.Tfoot>
    </Table.Root>
  );
}
