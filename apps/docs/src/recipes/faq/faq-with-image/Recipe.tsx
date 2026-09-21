"use client";

import { useId } from "react";
import { Details } from "@loamui/core";
import "./recipe.css";

const QUESTIONS = [
  {
    question: "How deep do I sow?",
    answer:
      "Twice the seed's own width is the rule, so a bean goes in a thumb deep and a lettuce barely under the surface. The packet gives the depth for that variety.",
  },
  {
    question: "Indoors or straight in the ground?",
    answer:
      "Tender crops such as tomatoes, squash and beans start indoors in April and go out after the last frost. Roots, peas and salads are sown where they will grow.",
  },
  {
    question: "When is the last frost here?",
    answer:
      "In the Shropshire hills, the third week of May most years, and later on a north slope. The sowing calendar is set for the nursery, so add a week for a colder plot.",
  },
  {
    question: "Why did my seedlings go leggy?",
    answer:
      "Not enough light for the warmth they had. Move them to the brightest sill, keep the room cooler at night, and pot on deeper, burying the stem up to the first leaves.",
  },
];

export default function Recipe() {
  const instanceId = useId();
  return (
    <section className="faq-with-image" aria-labelledby={`${instanceId}-faq-with-image-title`}>
      <div className="inner">
        <svg
          className="illustration"
          viewBox="0 0 240 240"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path className="fill" d="M56 104h96v88a12 12 0 0 1-12 12H68a12 12 0 0 1-12-12Z" />
          <path d="M152 124l40-28a10 10 0 0 1 14 14l-8 8" />
          <path className="fill" d="M198 118a12 12 0 1 1 8-8Z" />
          <path d="M56 128h96" />
          <path d="M104 104V80a24 24 0 0 0-48 0v24" />
          <path d="M40 64 26 44M56 58l-6-24M72 64l10-22" />
          <path className="fill" d="M120 178c0-10 6-16 16-16 0 10-6 16-16 16Z" />
          <path className="fill" d="M120 186c0-8-5-12-12-12 0 8 5 12 12 12Z" />
          <path d="M120 204v-34" />
        </svg>
        <div className="text">
          <h2 id={`${instanceId}-faq-with-image-title`}>Sowing questions</h2>
          <p>
            The questions every packet's guide answers, gathered in one place for the first week of
            spring.
          </p>
          <div className="questions">
            {QUESTIONS.map((item) => (
              <Details.Root key={item.question} name="faq-with-image">
                <Details.Summary>{item.question}</Details.Summary>
                <Details.Content>
                  <p>{item.answer}</p>
                </Details.Content>
              </Details.Root>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
