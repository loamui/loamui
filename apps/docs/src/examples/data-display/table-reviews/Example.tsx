import { Meter, Rating, Table } from "@loamui/core";
import "./example.css";

const VARIETIES = [
  { variety: "Broad bean ‘Crimson Flowered’", since: 2019, rating: 4.7, reviews: 212, again: 91 },
  { variety: "Beetroot ‘Bull’s Blood’", since: 2017, rating: 4.4, reviews: 158, again: 84 },
  { variety: "Kale ‘Ragged Jack’", since: 2021, rating: 4.1, reviews: 96, again: 72 },
  { variety: "Lettuce ‘Bronze Arrow’", since: 2018, rating: 4.6, reviews: 187, again: 88 },
  { variety: "Tomato ‘Gardener’s Delight’", since: 2015, rating: 4.8, reviews: 341, again: 95 },
  { variety: "Squash ‘Crown Prince’", since: 2020, rating: 4.3, reviews: 121, again: 79 },
];

export default function Example() {
  return (
    <Table.Root className="table-reviews" highlightOnHover>
      <Table.Caption>
        Member reviews of the most-grown varieties, to 8 September 2026: the rating, the count, and
        how many would grow it again.
      </Table.Caption>
      <Table.Thead>
        <Table.Tr>
          <Table.Th scope="col">Variety</Table.Th>
          <Table.Th scope="col" className="number">
            Listed since
          </Table.Th>
          <Table.Th scope="col">Rating</Table.Th>
          <Table.Th scope="col" className="number">
            Reviews
          </Table.Th>
          <Table.Th scope="col" className="split">
            Would grow again
          </Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {VARIETIES.map((row) => (
          <Table.Tr key={row.variety}>
            <Table.Th scope="row">{row.variety}</Table.Th>
            <Table.Td className="number">{row.since}</Table.Td>
            <Table.Td>
              <Rating readOnly label="Average rating" value={row.rating} />
            </Table.Td>
            <Table.Td className="number">{row.reviews.toLocaleString("en")}</Table.Td>
            <Table.Td className="split">
              <span className="yes">
                {row.again}%<span className="loam-VisuallyHidden"> would</span>
              </span>
              <Meter value={row.again} max={100} label="Would grow again" />
              <span className="no">
                {100 - row.again}%<span className="loam-VisuallyHidden"> would not</span>
              </span>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table.Root>
  );
}
