"use client";

import { useId } from "react";
import { Nav, useScrollSpy } from "@loamui/core";
import "./recipe.css";

const SECTIONS = [
  { id: "table-of-contents-sowing", title: "Sowing" },
  { id: "table-of-contents-pricking-out", title: "Pricking out" },
  { id: "table-of-contents-hardening-off", title: "Hardening off" },
  { id: "table-of-contents-planting-out", title: "Planting out" },
];

export default function Recipe() {
  const instanceId = useId();
  const sections = SECTIONS.map((section) => ({ ...section, id: `${instanceId}-${section.id}` }));
  // The section in view: the first of these headings inside the top part
  // of the viewport, or the last one that was once none is.
  const active = useScrollSpy(
    sections.map((section) => section.id),
    { rootMargin: "0px 0px -60% 0px" },
  );
  return (
    <div className="table-of-contents">
      <Nav.Root>
        <Nav.Title>On this page</Nav.Title>
        <Nav.List>
          {sections.map((section) => (
            <Nav.Item key={section.id}>
              <Nav.Link href={`#${section.id}`} current={active === section.id && "location"}>
                {section.title}
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav.List>
      </Nav.Root>
      <article>
        <p className="lede">
          Tomatoes are the seed most members raise indoors, and the one most often started too
          early. Four steps take a packet from a windowsill in March to a bed in June.
        </p>
        <h2 id={`${instanceId}-table-of-contents-sowing`}>Sowing</h2>
        <p>
          Sow from late March, two seeds to a 7cm pot of sieved compost, covered with a centimetre
          of vermiculite and kept at 18 to 21 degrees. A heated propagator gets them up in five
          days; an airing cupboard does the same, so long as the pots come out the moment the first
          loop of stem shows.
        </p>
        <p>
          Give them the brightest window you have from the day they are up. A tomato grown warm and
          dim stretches towards the light and never quite recovers the leg it gains in its first
          week.
        </p>
        <h2 id={`${instanceId}-table-of-contents-pricking-out`}>Pricking out</h2>
        <p>
          When the first true leaves show, the ones with the toothed edge rather than the smooth
          seed leaves, lift each seedling by a leaf and move it to its own 9cm pot. Hold the leaf,
          never the stem: a bruised leaf grows back and a bruised stem does not.
        </p>
        <p>
          Bury the seedling deeper than it stood before, up to the seed leaves. Tomatoes root along
          the buried stem, and a plant with more root shrugs off the dry days in a greenhouse.
        </p>
        <h2 id={`${instanceId}-table-of-contents-hardening-off`}>Hardening off</h2>
        <p>
          A fortnight before planting out, start putting the pots outside by day and bringing them
          in at night, a little longer each day. The plant is learning wind and direct sun, and the
          cell walls thicken to meet them.
        </p>
        <p>
          Skip this and the leaves scorch white within a day of going out. Rush it and a cold night
          stalls the plant for three weeks, which is longer than the fortnight saved.
        </p>
        <h2 id={`${instanceId}-table-of-contents-planting-out`}>Planting out</h2>
        <p>
          After the last frost, which for the Marches is the first week of June more often than the
          last week of May, plant 45cm apart in ground that had compost dug in over winter. Water
          the hole before the plant goes in, and again after, then leave it alone until the top of
          the soil is dry.
        </p>
        <p>
          Tie the stem to its cane loosely, with a loop that can grow, and pinch out the side shoots
          that appear where a leaf meets the stem. A cordon carries five trusses in a Marches
          summer, and a plant left to bush carries as many but ripens fewer of them.
        </p>
      </article>
    </div>
  );
}
