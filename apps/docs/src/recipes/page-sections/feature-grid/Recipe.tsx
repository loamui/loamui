"use client";

import { useId } from "react";
import "./recipe.css";

const FEATURES = [
  {
    title: "Open-pollinated only",
    description:
      "Every variety comes true from saved seed, so the packet you buy this year can be the last one you need.",
    icon: (
      <>
        <path d="M12 22V12" />
        <path d="M12 12c0-4 3-7 8-7 0 4-3 7-8 7Z" />
        <path d="M12 15c0-3-2.5-5-6-5 0 3 2.5 5 6 5Z" />
      </>
    ),
  },
  {
    title: "Grown on member plots",
    description:
      "Selected and harvested on allotments within twenty miles of the nursery, by people who eat what they grow.",
    icon: (
      <>
        <path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
  },
  {
    title: "Packed the week you order",
    description:
      "Seed is dried and stored whole, then packed to order, so nothing sits in a warehouse losing its vigour.",
    icon: (
      <>
        <path d="m3 7 9-4 9 4v10l-9 4-9-4Z" />
        <path d="m3 7 9 4 9-4" />
        <path d="M12 11v10" />
      </>
    ),
  },
  {
    title: "A guide in every packet",
    description:
      "Sowing depth, spacing and timing on the back, and a longer guide online, written by the grower.",
    icon: (
      <>
        <path d="M4 4h6a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4Z" />
        <path d="M20 4h-6a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h7Z" />
      </>
    ),
  },
  {
    title: "Germination tested",
    description:
      "Every batch is tested before it is listed, and the rate is printed on the packet beside the harvest year.",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m8 12 3 3 5-6" />
      </>
    ),
  },
  {
    title: "Workshops all year",
    description:
      "Seed saving, grafting and winter pruning at the nursery, free to members and open to everyone.",
    icon: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M3 10h18" />
        <path d="M8 3v4M16 3v4" />
      </>
    ),
  },
];

export default function Recipe() {
  const instanceId = useId();
  return (
    <section className="feature-grid" aria-labelledby={`${instanceId}-feature-grid-title`}>
      <header>
        <p className="eyebrow">Why Hedgerow</p>
        <h2 id={`${instanceId}-feature-grid-title`}>Seed you can save again</h2>
        <p className="description">
          Everything in the catalogue is grown for flavour and for saving, so a packet is the start
          of a variety you keep, not a purchase you repeat.
        </p>
      </header>
      <ul role="list">
        {FEATURES.map((feature) => (
          <li key={feature.title}>
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
          </li>
        ))}
      </ul>
    </section>
  );
}
