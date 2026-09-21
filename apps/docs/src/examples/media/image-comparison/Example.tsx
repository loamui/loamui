"use client";

import { useId, useState } from "react";
import type { CSSProperties } from "react";
import { Range } from "@loamui/core";
import "./example.css";

export default function Example() {
  const controlId = useId();
  const [position, setPosition] = useState(50);
  return (
    <div className="image-comparison">
      <figure style={{ "--_position": `${position}%` } as CSSProperties}>
        <div className="before">
          <img
            src="https://picsum.photos/id/59/1200/675"
            alt="Black-and-white photograph of wooden fence posts and wire above long grass"
            width="1200"
            height="675"
            loading="lazy"
            sizes="auto, 100vw"
            srcSet="https://picsum.photos/id/59/400/225 400w, https://picsum.photos/id/59/800/450 800w, https://picsum.photos/id/59/1200/675 1200w"
          />
        </div>
        <div className="after">
          <img
            src="https://picsum.photos/id/59/1200/675"
            alt="The same fence photograph in colour: weathered brown posts above golden grass"
            width="1200"
            height="675"
            loading="lazy"
            sizes="auto, 100vw"
            srcSet="https://picsum.photos/id/59/400/225 400w, https://picsum.photos/id/59/800/450 800w, https://picsum.photos/id/59/1200/675 1200w"
          />
        </div>
        <label htmlFor={controlId}>Reveal the colour photograph</label>
        <Range.Control
          id={controlId}
          aria-describedby={`${controlId}-caption`}
          aria-valuetext={`${position}% colour photograph`}
          min={0}
          max={100}
          value={position}
          onChange={(event) => setPosition(event.currentTarget.valueAsNumber)}
        />
        <p className="value" aria-hidden="true">
          {position}% colour
        </p>
        <figcaption id={`${controlId}-caption`}>
          One photograph in black and white and colour. Move the slider to compare the treatments.
        </figcaption>
      </figure>
    </div>
  );
}
