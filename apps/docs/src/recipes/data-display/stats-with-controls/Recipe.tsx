"use client";

import { useId, useState } from "react";
import { Button, Card, Meter, Time } from "@loamui/core";
import "./recipe.css";

interface Day {
  date: string;
  posted: number;
  picked: number;
  deliveries: number;
}

// What the packing shed can do in a day: the range each figure sits in.
const CAPACITY = { posted: 200, picked: 1200, deliveries: 16 };

// The day shown first is today, so Next has nowhere to go until tomorrow's
// figures exist; Previous walks back through the days the shed has logged.
const TODAY: Day = { date: "2026-09-08", posted: 84, picked: 520, deliveries: 11 };

const DAYS: Day[] = [
  { date: "2026-09-03", posted: 118, picked: 760, deliveries: 12 },
  { date: "2026-09-04", posted: 96, picked: 640, deliveries: 9 },
  { date: "2026-09-07", posted: 132, picked: 910, deliveries: 14 },
  TODAY,
];

function Chevron({ direction }: { direction: -1 | 1 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points={direction === -1 ? "15 18 9 12 15 6" : "9 18 15 12 9 6"} />
    </svg>
  );
}

export default function Recipe() {
  const instanceId = useId();
  const [day, setDay] = useState<Day>(TODAY);
  const at = DAYS.indexOf(day);
  const previous = DAYS[at - 1];
  const next = DAYS[at + 1];

  return (
    <section
      className="stats-with-controls"
      aria-labelledby={`${instanceId}-stats-with-controls-title`}
    >
      <div className="controls">
        <Button
          aria-disabled={previous ? undefined : true}
          onClick={() => {
            if (previous) setDay(previous);
          }}
        >
          <Chevron direction={-1} />
          <span className="loam-VisuallyHidden">Previous day</span>
        </Button>
        <h2 id={`${instanceId}-stats-with-controls-title`}>
          <Time value={day.date} locale="en-GB" dateStyle="full" />
        </h2>
        <Button
          aria-disabled={next ? undefined : true}
          onClick={() => {
            if (next) setDay(next);
          }}
        >
          <Chevron direction={1} />
          <span className="loam-VisuallyHidden">Next day</span>
        </Button>
      </div>
      <dl className="figures">
        <Card render={<div className="figure" />}>
          <dt>Orders posted</dt>
          <dd className="value">
            {day.posted} <span className="of">of {CAPACITY.posted}</span>
          </dd>
          <dd className="bar">
            <Meter value={day.posted} max={CAPACITY.posted} label="Orders posted, of capacity" />
          </dd>
        </Card>
        <Card render={<div className="figure" />}>
          <dt>Packets picked</dt>
          <dd className="value">
            {day.picked.toLocaleString("en")}{" "}
            <span className="of">of {CAPACITY.picked.toLocaleString("en")}</span>
          </dd>
          <dd className="bar">
            <Meter value={day.picked} max={CAPACITY.picked} label="Packets picked, of capacity" />
          </dd>
        </Card>
        <Card render={<div className="figure" />}>
          <dt>Deliveries out</dt>
          <dd className="value">
            {day.deliveries} <span className="of">of {CAPACITY.deliveries}</span>
          </dd>
          <dd className="bar">
            <Meter
              value={day.deliveries}
              max={CAPACITY.deliveries}
              label="Deliveries out, of capacity"
            />
          </dd>
        </Card>
      </dl>
    </section>
  );
}
