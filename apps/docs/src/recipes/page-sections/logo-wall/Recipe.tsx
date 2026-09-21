"use client";

import { useId } from "react";
import "./recipe.css";

export default function Recipe() {
  const instanceId = useId();
  return (
    <section className="logo-wall" aria-labelledby={`${instanceId}-logo-wall-title`}>
      <h2 id={`${instanceId}-logo-wall-title`}>Stocked by</h2>
      <ul role="list">
        <li>
          <svg role="img" aria-label="Teme Valley Growers" viewBox="0 0 40 40" fill="currentColor">
            <path d="M4 4h32v32H4Z" fillOpacity=".12" />
            <path d="M20 8c6 0 10 5 10 11 0 4-2 7-5 9l-5 4-5-4c-3-2-5-5-5-9 0-6 4-11 10-11Zm0 6a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z" />
          </svg>
        </li>
        <li>
          <svg
            role="img"
            aria-label="Clun Allotment Society"
            viewBox="0 0 96 40"
            fill="currentColor"
          >
            <circle cx="20" cy="20" r="14" fillOpacity=".12" />
            <circle cx="20" cy="20" r="14" fill="none" stroke="currentColor" strokeWidth="3" />
            <path
              d="M14 26h12M20 26V14M16 18l4-4 4 4"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            />
            <text x="42" y="28" fontSize="22" fontWeight="700">
              CAS
            </text>
          </svg>
        </li>
        <li>
          <svg role="img" aria-label="The Potting Shed" viewBox="0 0 140 40" fill="currentColor">
            <text x="70" y="28" fontSize="22" fontWeight="700" textAnchor="middle">
              Potting Shed
            </text>
          </svg>
        </li>
        <li>
          <svg
            role="img"
            aria-label="Wenlock Edge Farm Shop"
            viewBox="0 0 60 40"
            fill="currentColor"
          >
            <path d="M6 30 30 8l24 22Z" fillOpacity=".12" />
            <path d="M14 30 30 16l16 14Z" />
          </svg>
        </li>
        <li>
          <svg role="img" aria-label="Border Bees" viewBox="0 0 120 40" fill="currentColor">
            <path d="m18 6 12 7v14l-12 7-12-7V13Z" fillOpacity=".12" />
            <path d="m18 12 7 4v8l-7 4-7-4v-8Z" />
            <text x="40" y="28" fontSize="22" fontWeight="700">
              Border
            </text>
          </svg>
        </li>
        <li>
          <svg role="img" aria-label="Corve Dale Schools" viewBox="0 0 200 40" fill="currentColor">
            <text
              x="100"
              y="28"
              fontSize="20"
              fontWeight="600"
              letterSpacing="6"
              textAnchor="middle"
            >
              CORVE DALE
            </text>
          </svg>
        </li>
      </ul>
    </section>
  );
}
