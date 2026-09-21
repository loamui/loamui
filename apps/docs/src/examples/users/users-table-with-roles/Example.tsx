"use client";

import { useId } from "react";
import { Avatar, Badge, Button, Select, Table, Time } from "@loamui/core";
import "./example.css";

// The moment the page was rendered, supplied rather than read from the
// clock, so the server and the browser write the same words.
const NOW = "2026-09-08T09:00:00Z";

const ROLES = [
  { value: "admin", label: "Administrator" },
  { value: "editor", label: "Editor" },
  { value: "viewer", label: "Viewer" },
];

const STATUS: Record<string, string> = {
  active: "Active",
  invited: "Invited",
  suspended: "Suspended",
};

interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  lastActive?: string;
  status: string;
  photo: number;
}

const MEMBERS: Member[] = [
  {
    id: "imogen",
    photo: 823,
    name: "Imogen Hartley",
    email: "imogen@hedgerow.example",
    role: "admin",
    lastActive: "2026-09-08T07:42:00Z",
    status: "active",
  },
  {
    id: "bryn",
    photo: 1005,
    name: "Bryn Powell",
    email: "bryn@hedgerow.example",
    role: "editor",
    lastActive: "2026-09-07T08:15:00Z",
    status: "active",
  },
  {
    id: "sadia",
    photo: 832,
    name: "Sadia Rahman",
    email: "sadia@hedgerow.example",
    role: "editor",
    lastActive: "2026-09-05T11:20:00Z",
    status: "active",
  },
  {
    id: "tomos",
    photo: 669,
    name: "Tomos Ellis",
    email: "tomos@hedgerow.example",
    role: "viewer",
    status: "invited",
  },
  {
    id: "greta",
    photo: 64,
    name: "Greta Lindqvist",
    email: "greta@hedgerow.example",
    role: "viewer",
    lastActive: "2026-08-24T17:05:00Z",
    status: "suspended",
  },
];

export default function Example() {
  const instanceId = useId();
  return (
    <form className="users-table-with-roles" method="post" action="/team/roles">
      <Table.Root>
        <Table.Caption>Team members and their roles. Change a role, then save.</Table.Caption>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Member</Table.Th>
            <Table.Th>Role</Table.Th>
            <Table.Th>Last active</Table.Th>
            <Table.Th>Status</Table.Th>
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
                  <span className="text">
                    <strong>{member.name}</strong>
                    <span>{member.email}</span>
                  </span>
                </span>
              </Table.Th>
              <Table.Td className="role">
                <label className="loam-VisuallyHidden" htmlFor={`${instanceId}-role-${member.id}`}>
                  Role for {member.name}
                </label>
                <Select.Root
                  id={`${instanceId}-role-${member.id}`}
                  name={`role[${member.id}]`}
                  defaultValue={member.role}
                >
                  {ROLES.map((role) => (
                    <Select.Option key={role.value} value={role.value}>
                      {role.label}
                    </Select.Option>
                  ))}
                </Select.Root>
              </Table.Td>
              <Table.Td>
                {member.lastActive ? (
                  <Time value={member.lastActive} locale="en-GB" relative={{ now: NOW }} />
                ) : (
                  <span className="never">Not yet</span>
                )}
              </Table.Td>
              <Table.Td>
                <span className={member.status}>
                  <Badge.Root>
                    {" "}
                    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                      <circle cx="8" cy="8" r="4" />
                    </svg>
                    <Badge.Text>{STATUS[member.status]}</Badge.Text>
                  </Badge.Root>
                </span>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table.Root>
      <div className="actions">
        <Button type="submit">Save roles</Button>
      </div>
    </form>
  );
}
