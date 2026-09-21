"use client";

import { useId } from "react";
import { Card } from "@loamui/core";
import "./recipe.css";

const FEATURES = [
  {
    title: "Seed packets",
    description:
      "Two hundred open-pollinated varieties of vegetable, herb and flower, each with the grower's guide on the back.",
    icon: (
      <>
        <path d="M6 3h12l2 4v14H4V7Z" />
        <path d="M4 7h16" />
        <path d="M12 11c0-2.5 2-4.5 5-4.5 0 2.5-2 4.5-5 4.5Z" />
        <path d="M12 16V11" />
      </>
    ),
  },
  {
    title: "Bare-root fruit",
    description:
      "Apples, pears and soft fruit on local rootstocks, lifted in November and posted the same week.",
    icon: (
      <>
        <path d="M12 21V9" />
        <path d="M12 9c-4 0-7-3-7-7 4 0 7 3 7 7Z" />
        <path d="M12 9c4 0 7-3 7-7-4 0-7 3-7 7Z" />
        <path d="M7 21c0-3 2-5 5-5s5 2 5 5" />
      </>
    ),
  },
  {
    title: "Plant sales",
    description:
      "Member-grown perennials and vegetable plugs on the nursery bench every Saturday from March.",
    icon: (
      <>
        <path d="M5 10h14l-1.5 10h-11Z" />
        <path d="M12 10V4" />
        <path d="M12 7c0-2 1.5-3 4-3 0 2-1.5 3-4 3Z" />
      </>
    ),
  },
  {
    title: "Seed swap",
    description:
      "Bring what you saved, take what you need. The bench is open to everyone on the first Sunday of the month.",
    icon: (
      <>
        <path d="M4 8h13l-3-3" />
        <path d="M20 16H7l3 3" />
      </>
    ),
  },
  {
    title: "Workshops",
    description:
      "Seed saving, grafting and winter pruning, taught by the growers, free to members and open to all.",
    icon: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M3 10h18" />
        <path d="M8 3v4M16 3v4" />
      </>
    ),
  },
  {
    title: "Growing guides",
    description:
      "Sowing, pricking out, hardening off and saving, written by the person who grew the packet.",
    icon: (
      <>
        <path d="M4 4h6a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4Z" />
        <path d="M20 4h-6a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h7Z" />
      </>
    ),
  },
];

export default function Recipe() {
  const instanceId = useId();
  return (
    <section
      className="features-with-cards"
      aria-labelledby={`${instanceId}-features-with-cards-title`}
    >
      <header>
        <p className="eyebrow">What we do</p>
        <h2 id={`${instanceId}-features-with-cards-title`}>
          Everything a grower needs, from one bench
        </h2>
        <p className="description">
          Hedgerow sells seed and plants, but the co-op is the swap bench, the workshops and the
          guides that come with them.
        </p>
      </header>
      <ul role="list">
        {FEATURES.map((feature) => (
          <Card key={feature.title} render={<li className="feature" />}>
            <div className="icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {feature.icon}
              </svg>
            </div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </Card>
        ))}
      </ul>
    </section>
  );
}
