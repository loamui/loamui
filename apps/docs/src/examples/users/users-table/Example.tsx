"use client";

import { Avatar, Menu, Table } from "@loamui/core";
import "./example.css";

const MEMBERS = [
  {
    id: "imogen",
    photo: 823,
    name: "Imogen Hartley",
    role: "Steward, Lower Field",
    email: "imogen@hedgerow.example",
    phone: "01584 870101",
    tel: "+441584870101",
  },
  {
    id: "bryn",
    photo: 1005,
    name: "Bryn Powell",
    role: "Head grower",
    email: "bryn@hedgerow.example",
    phone: "01584 870123",
    tel: "+441584870123",
  },
  {
    id: "sadia",
    photo: 832,
    name: "Sadia Rahman",
    role: "Seed librarian",
    email: "sadia@hedgerow.example",
    phone: "01584 870144",
    tel: "+441584870144",
  },
  {
    id: "tomos",
    photo: 669,
    name: "Tomos Ellis",
    role: "Open days coordinator",
    email: "tomos@hedgerow.example",
    phone: "01584 870162",
    tel: "+441584870162",
  },
  {
    id: "greta",
    photo: 64,
    name: "Greta Lindqvist",
    role: "Treasurer",
    email: "greta@hedgerow.example",
    phone: "01584 870187",
    tel: "+441584870187",
  },
];

export default function Example() {
  return (
    <Table.Root className="users-table" highlightOnHover>
      <Table.Caption>The co-op&rsquo;s stewards and staff, with how to reach them.</Table.Caption>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Member</Table.Th>
          <Table.Th>Role</Table.Th>
          <Table.Th>Email</Table.Th>
          <Table.Th>Phone</Table.Th>
          <Table.Th>
            <span className="loam-VisuallyHidden">Actions</span>
          </Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {MEMBERS.map((member) => (
          <Table.Tr key={member.id}>
            <Table.Th scope="row">
              <span className="member">
                <Avatar.Root aria-hidden>
                  <Avatar.Image src={`https://picsum.photos/id/${member.photo}/96/96`} alt="" />
                  <Avatar.Fallback>
                    {member.name
                      .split(/\s+/)
                      .map((part) => part[0])
                      .join("")}
                  </Avatar.Fallback>
                </Avatar.Root>
                {member.name}
              </span>
            </Table.Th>
            <Table.Td>{member.role}</Table.Td>
            <Table.Td>
              <a href={`mailto:${member.email}`}>{member.email}</a>
            </Table.Td>
            <Table.Td className="phone">
              <a href={`tel:${member.tel}`}>{member.phone}</a>
            </Table.Td>
            <Table.Td className="actions">
              <Menu.Root>
                <Menu.Trigger>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12h.01M12 12h.01M19 12h.01" />
                  </svg>
                  <span className="loam-VisuallyHidden">Actions for {member.name}</span>
                </Menu.Trigger>
                <Menu.Popup>
                  <Menu.Item href={`/team/${member.id}/edit`}>Edit details</Menu.Item>
                  <Menu.Item href={`/team/${member.id}/role`}>Change role</Menu.Item>
                  <Menu.Separator />
                  <form method="post" action={`/team/${member.id}/remove`}>
                    <Menu.Item render={<button type="submit">Remove from team</button>} />
                  </form>
                </Menu.Popup>
              </Menu.Root>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table.Root>
  );
}
