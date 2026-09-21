"use client";

import { useId } from "react";
import { SignpostLink } from "@loamui/core";
import "./recipe.css";

const FEATURES = [
  {
    title: "Comes true from saved seed",
    description:
      "No hybrids. Save from the best plants and the variety improves on your plot year on year.",
    icon: (
      <>
        <path d="M12 22V12" />
        <path d="M12 12c0-4 3-7 8-7 0 4-3 7-8 7Z" />
        <path d="M12 15c0-3-2.5-5-6-5 0 3 2.5 5 6 5Z" />
      </>
    ),
  },
  {
    title: "Selected for this climate",
    description:
      "Grown on member plots in the Shropshire hills, so it has already met the wind and the wet.",
    icon: (
      <>
        <path d="M7 18a4 4 0 0 1-.5-8 6 6 0 0 1 11.5 1.5A3.5 3.5 0 0 1 17.5 18Z" />
        <path d="M9 21v-1M13 21v-1M11 23v-1" />
      </>
    ),
  },
  {
    title: "Tested before it is listed",
    description:
      "The germination rate on the packet is from this batch, checked in the month it was packed.",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m8 12 3 3 5-6" />
      </>
    ),
  },
  {
    title: "Fair to the grower",
    description:
      "Half of every packet's price goes to the member who grew it, and the rest runs the bench.",
    icon: (
      <>
        <path d="M12 3v18" />
        <path d="M17 7H9.5a2.5 2.5 0 0 0 0 5h5a2.5 2.5 0 0 1 0 5H7" />
      </>
    ),
  },
];

export default function Recipe() {
  const instanceId = useId();
  return (
    <section
      className="features-with-title"
      aria-labelledby={`${instanceId}-features-with-title-title`}
    >
      <div className="inner">
        <div className="text">
          <h2 id={`${instanceId}-features-with-title-title`}>Why seed from a co-op is different</h2>
          <p>
            A packet from a seed company was bred somewhere warmer, flatter and drier than your
            plot. A packet from Hedgerow was grown twenty miles away by someone who eats what they
            sow, and it goes back into the ground the year after with nothing lost.
          </p>
          <div className="actions">
            <SignpostLink href="/about/seed">How we save seed</SignpostLink>
          </div>
        </div>
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
      </div>
    </section>
  );
}
