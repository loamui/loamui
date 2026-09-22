import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Table } from "../../index.js";

type Field = {
  name: string;
  crop: string;
  area: string;
  yield: string;
};

const fields: Field[] = [
  {
    name: "North Field",
    crop: "Winter wheat",
    area: "42 ha",
    yield: "8.1 t/ha",
  },
  {
    name: "Mill Meadow",
    crop: "Oilseed rape",
    area: "28 ha",
    yield: "3.6 t/ha",
  },
  {
    name: "Brook Acre",
    crop: "Spring barley",
    area: "19 ha",
    yield: "6.4 t/ha",
  },
  { name: "Long Ley", crop: "Grass ley", area: "35 ha", yield: "—" },
];

const FieldTable = (args: React.ComponentProps<typeof Table.Root>) => (
  <Table.Root {...args}>
    <Table.Caption>Field register — 2026 season</Table.Caption>
    <Table.Thead>
      <Table.Tr>
        <Table.Th scope="col">Field</Table.Th>
        <Table.Th scope="col">Crop</Table.Th>
        <Table.Th scope="col">Area</Table.Th>
        <Table.Th scope="col">Yield</Table.Th>
      </Table.Tr>
    </Table.Thead>
    <Table.Tbody>
      {fields.map((field) => (
        <Table.Tr key={field.name}>
          <Table.Th scope="row">{field.name}</Table.Th>
          <Table.Td>{field.crop}</Table.Td>
          <Table.Td>{field.area}</Table.Td>
          <Table.Td>{field.yield}</Table.Td>
        </Table.Tr>
      ))}
    </Table.Tbody>
  </Table.Root>
);

const meta = {
  title: "Data display/Table",
  component: Table.Root,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A styled data table composed from native thead/tbody/tr/th/td. Its boolean props tune how the data reads, not how it looks: `striped` and `highlightOnHover` aid row tracking, `withColumnBorders` separates columns — data-presentation semantics, not size or variant knobs. The component's own element is the scroll wrapper; when the table outgrows its container it becomes a keyboard-focusable horizontal scroll region.",
      },
    },
  },
  args: {
    striped: false,
    highlightOnHover: false,
    withColumnBorders: false,
    stickyHeader: false,
  },
  argTypes: {
    striped: { control: "boolean" },
    highlightOnHover: { control: "boolean" },
    withColumnBorders: { control: "boolean" },
    stickyHeader: { control: "boolean" },
  },
  render: (args) => <FieldTable {...args} />,
} satisfies Meta<typeof Table.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Striped: Story = { args: { striped: true } };

export const HighlightOnHover: Story = { args: { highlightOnHover: true } };

export const WithColumnBorders: Story = {
  args: { withColumnBorders: true, striped: true },
};

/**
 * A capped scroller keeps its header row in view: the cap is the public
 * `--loam-table-block-size` on the component's own element, and
 * `stickyHeader` pins the column names to its top.
 */
export const StickyHeader: Story = {
  args: { stickyHeader: true },
  render: (args) => (
    <Table.Root {...args} style={{ "--loam-table-block-size": "12rem" } as React.CSSProperties}>
      <Table.Caption>Field register — every season on record</Table.Caption>
      <Table.Thead>
        <Table.Tr>
          <Table.Th scope="col">Field</Table.Th>
          <Table.Th scope="col">Crop</Table.Th>
          <Table.Th scope="col">Area</Table.Th>
          <Table.Th scope="col">Yield</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {[2020, 2021, 2022, 2023, 2024, 2025, 2026].flatMap((year) =>
          fields.map((field) => (
            <Table.Tr key={`${year}-${field.name}`}>
              <Table.Th scope="row">
                {field.name} ({year})
              </Table.Th>
              <Table.Td>{field.crop}</Table.Td>
              <Table.Td>{field.area}</Table.Td>
              <Table.Td>{field.yield}</Table.Td>
            </Table.Tr>
          )),
        )}
      </Table.Tbody>
    </Table.Root>
  ),
};

/**
 * Caption placement is the platform's own `caption-side`, set on the
 * `<table>` through `tableProps` (or a consumer class).
 */
export const CaptionBottom: Story = {
  args: { tableProps: { style: { captionSide: "bottom" } } },
};

/**
 * When the table is wider than its container it becomes a keyboard-focusable
 * scroll region (WCAG 2.1.1).
 */
export const OverflowScroll: Story = {
  render: (args) => (
    <div style={{ maxWidth: "24rem" }}>
      <Table.Root {...args}>
        <Table.Caption>Field register — full agronomy record</Table.Caption>
        <Table.Thead>
          <Table.Tr>
            <Table.Th scope="col">Field</Table.Th>
            <Table.Th scope="col">Crop</Table.Th>
            <Table.Th scope="col">Variety</Table.Th>
            <Table.Th scope="col">Area</Table.Th>
            <Table.Th scope="col">Drilled</Table.Th>
            <Table.Th scope="col">Harvested</Table.Th>
            <Table.Th scope="col">Yield</Table.Th>
            <Table.Th scope="col">Soil type</Table.Th>
            <Table.Th scope="col">Agronomist</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {fields.map((field) => (
            <Table.Tr key={field.name}>
              <Table.Th scope="row">{field.name}</Table.Th>
              <Table.Td>{field.crop}</Table.Td>
              <Table.Td>Group 3 milling</Table.Td>
              <Table.Td>{field.area}</Table.Td>
              <Table.Td>12 Oct 2025</Table.Td>
              <Table.Td>04 Aug 2026</Table.Td>
              <Table.Td>{field.yield}</Table.Td>
              <Table.Td>Clay loam</Table.Td>
              <Table.Td>J. Alderton</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table.Root>
    </div>
  ),
};

/** Interaction test: every data row is headed by its row header, so a cell is announced with its field's name. */
export const RowsAreHeaded: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const table = canvas.getByRole("table");
    const rowHeaders = within(table).getAllByRole("rowheader");
    const bodyRows = within(table).getAllByRole("row").slice(1);
    await expect(rowHeaders).toHaveLength(bodyRows.length);
    await expect(within(table).getAllByRole("columnheader").length).toBeGreaterThanOrEqual(4);
  },
};
