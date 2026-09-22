"use client";

import type { CSSProperties } from "react";
import { Card, Carousel } from "@loamui/core";

const frame = { inlineSize: "100%", maxInlineSize: "44rem" } as const;
const row = { display: "flex", gap: "var(--loam-space-2xs)" } as const;

const GUIDES = [
  ["Tokens", "Four hues, eight neutrals and two fluid scales; everything else is derived."],
  ["Element styles", "Native HTML, styled page-wide, so plain markup is presentable first."],
  ["Components", "A small set of contextually styled parts; no size or variant props."],
  ["Contextualism", "A region declares what it means and everything inside adapts."],
  ["Accessibility", "Semantic HTML, managed focus and keyboard support as the baseline."],
] as const;

function GuideItems() {
  return GUIDES.map(([title, text]) => (
    <Carousel.Item key={title}>
      <Card>
        <h3>{title}</h3>
        <p>{text}</p>
      </Card>
    </Carousel.Item>
  ));
}

export function CarouselBasicDemo() {
  return (
    <div style={frame}>
      <Carousel.Root aria-labelledby="carousel-guides">
        <h2 id="carousel-guides" style={{ margin: 0 }}>
          Guides
        </h2>
        <Carousel.Track>
          <GuideItems />
        </Carousel.Track>
        <div style={row}>
          <Carousel.Previous />
          <Carousel.Next />
        </div>
      </Carousel.Root>
    </div>
  );
}

export function CarouselIndicatorsDemo() {
  return (
    <div style={frame}>
      <Carousel.Root labels={{ region: "Guides" }}>
        <Carousel.Track>
          <GuideItems />
        </Carousel.Track>
        <div style={row}>
          <Carousel.Previous />
          <Carousel.Next />
        </div>
        <Carousel.Indicators />
      </Carousel.Root>
    </div>
  );
}

export function CarouselLoopDemo() {
  return (
    <div style={frame}>
      <Carousel.Root labels={{ region: "Guides" }} loop>
        <Carousel.Track>
          <GuideItems />
        </Carousel.Track>
        <div style={row}>
          <Carousel.Previous />
          <Carousel.Next />
        </div>
        <Carousel.Indicators />
      </Carousel.Root>
    </div>
  );
}

export function CarouselItemSizeDemo() {
  return (
    <div style={frame}>
      <Carousel.Root
        labels={{ region: "Contexts" }}
        style={{ "--loam-carousel-item-size": "10rem" } as CSSProperties}
      >
        <Carousel.Track>
          {["primary", "success", "warning", "info", "danger"].map((context) => (
            <Carousel.Item key={context} style={{ "--loam-context": context } as CSSProperties}>
              <Card>
                <p style={{ margin: 0 }}>{context}</p>
              </Card>
            </Carousel.Item>
          ))}
        </Carousel.Track>
        <div style={row}>
          <Carousel.Previous />
          <Carousel.Next />
        </div>
      </Carousel.Root>
    </div>
  );
}

export function CarouselLabelsDemo() {
  return (
    <div style={frame}>
      <Carousel.Root
        labels={{
          region: "Guides",
          previous: "Précédent",
          next: "Suivant",
          indicator: (i, n) => `Diapositive ${i} sur ${n}`,
          status: (i, n) => `Diapositive ${i} sur ${n}`,
        }}
      >
        <Carousel.Track>
          <GuideItems />
        </Carousel.Track>
        <div style={row}>
          <Carousel.Previous>Précédent</Carousel.Previous>
          <Carousel.Next>Suivant</Carousel.Next>
        </div>
        <Carousel.Indicators />
      </Carousel.Root>
    </div>
  );
}
