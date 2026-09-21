"use client";

import { useId } from "react";
import { Avatar, Card, Price, SignpostLink } from "@loamui/core";
import "./recipe.css";

const GROWERS = [
  {
    id: "imogen",
    photo: 823,
    name: "Imogen Hartley",
    role: "Steward, Lower Field",
    email: "imogen@hedgerow.example",
    rate: 22,
  },
  {
    id: "bryn",
    photo: 1005,
    name: "Bryn Powell",
    role: "Head grower",
    email: "bryn@hedgerow.example",
    rate: 28,
  },
  {
    id: "sadia",
    photo: 832,
    name: "Sadia Rahman",
    role: "Seed librarian",
    email: "sadia@hedgerow.example",
    rate: 20,
  },
  {
    id: "tomos",
    photo: 669,
    name: "Tomos Ellis",
    role: "Open days coordinator",
    email: "tomos@hedgerow.example",
    rate: 18.5,
  },
];

export default function Recipe() {
  const instanceId = useId();
  return (
    <ul className="users-grid" role="list">
      {GROWERS.map((grower) => (
        <li key={grower.id}>
          <Card render={<article aria-labelledby={`${instanceId}-users-grid-${grower.id}`} />}>
            <Avatar.Root aria-hidden>
              <Avatar.Image src={`https://picsum.photos/id/${grower.photo}/120/120`} alt="" />
              <Avatar.Fallback>
                {grower.name
                  .split(/\s+/)
                  .map((part) => part[0])
                  .join("")}
              </Avatar.Fallback>
            </Avatar.Root>
            <div className="text">
              <h2 id={`${instanceId}-users-grid-${grower.id}`}>{grower.name}</h2>
              <p className="role">{grower.role}</p>
            </div>
            <dl>
              <div>
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${grower.email}`}>{grower.email}</a>
                </dd>
              </div>
              <div>
                <dt>Rate</dt>
                <dd>
                  <Price value={grower.rate} currency="GBP">
                    an hour
                  </Price>
                </dd>
              </div>
            </dl>
            <SignpostLink href={`/growers/${grower.id}`}>Book a session</SignpostLink>
          </Card>
        </li>
      ))}
    </ul>
  );
}
