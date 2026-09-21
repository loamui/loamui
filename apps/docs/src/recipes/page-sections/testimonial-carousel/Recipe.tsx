"use client";

import { useId } from "react";
import { Avatar, Card, Carousel } from "@loamui/core";
import "./recipe.css";

const TESTIMONIALS = [
  {
    quote:
      "I joined for the seed and stayed for the people. Every packet I have grown from has come true, and the guides read like a neighbour talking you through it.",
    name: "Mari Hughes",
    role: "Member since 2019, Ludlow",
  },
  {
    quote:
      "We run a school garden on a shoestring. The trade prices and the germination rates on every packet mean nothing we sow with the children is a gamble.",
    name: "Dafydd Rees",
    role: "Teacher, Clun",
  },
  {
    quote:
      "The Crimson Flowered broad bean I bought in 2021 has been my own seed ever since. That is what open-pollinated means, and Hedgerow told me so on the packet.",
    name: "Amara Okonkwo",
    role: "Allotment holder, Shrewsbury",
  },
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
  return (
    <Carousel.Root
      className="testimonial-carousel"
      aria-labelledby={`${instanceId}-testimonial-carousel-title`}
    >
      <h2 id={`${instanceId}-testimonial-carousel-title`}>What members say</h2>
      <Carousel.Track>
        {TESTIMONIALS.map((testimonial) => (
          <Carousel.Item key={testimonial.name}>
            <Card render={<figure className="quote" />}>
              <blockquote>
                <p>{testimonial.quote}</p>
              </blockquote>
              <figcaption>
                <Avatar.Root aria-hidden="true">
                  <Avatar.Fallback>
                    {testimonial.name
                      .split(/\s+/)
                      .map((part) => part[0])
                      .join("")}
                  </Avatar.Fallback>
                </Avatar.Root>
                <div className="author">
                  <span className="name">{testimonial.name}</span>
                  <span className="role">{testimonial.role}</span>
                </div>
              </figcaption>
            </Card>
          </Carousel.Item>
        ))}
      </Carousel.Track>
      <div className="controls">
        <Carousel.Previous>
          <Chevron direction={-1} />
          <span className="loam-VisuallyHidden">Previous</span>
        </Carousel.Previous>
        <Carousel.Indicators />
        <Carousel.Next>
          <Chevron direction={1} />
          <span className="loam-VisuallyHidden">Next</span>
        </Carousel.Next>
      </div>
    </Carousel.Root>
  );
}
