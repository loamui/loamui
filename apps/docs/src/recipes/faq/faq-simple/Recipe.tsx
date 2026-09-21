"use client";

import { useId } from "react";
import { Details } from "@loamui/core";
import "./recipe.css";

const QUESTIONS = [
  {
    question: "How long does seed keep?",
    answer:
      "Most vegetable seed keeps three to five years in a cool, dry drawer. Parsnip, onion and leek are the exception and are best sown the year after harvest. The harvest year is printed on every packet.",
  },
  {
    question: "Can I save seed from what I grow?",
    answer:
      "Yes. Everything in the catalogue is open-pollinated, so seed saved from the best plants comes true the next year. The guide in each packet says how far apart to keep it from its relatives.",
  },
  {
    question: "When do orders go out?",
    answer:
      "Seed is packed on Mondays and Thursdays and posted the same day, second class. Bare-root fruit is lifted and posted in November and December only, once the leaves are down.",
  },
  {
    question: "What does membership cost?",
    answer:
      "Forty-eight pounds a year for a household, which brings twelve packets from the catalogue, the swap bench and the workshops. A plot on a member field is a separate arrangement with the field.",
  },
];

export default function Recipe() {
  const instanceId = useId();
  return (
    <section className="faq-simple" aria-labelledby={`${instanceId}-faq-simple-title`}>
      <h2 id={`${instanceId}-faq-simple-title`}>Frequently asked questions</h2>
      <p className="description">
        The four things people ask the bench most often. For anything else, write to{" "}
        <a href="mailto:hello@hedgerow.coop">hello@hedgerow.coop</a>.
      </p>
      <div className="questions">
        {QUESTIONS.map((item) => (
          <Details.Root key={item.question} name="faq-simple">
            <Details.Summary>{item.question}</Details.Summary>
            <Details.Content>
              <p>{item.answer}</p>
            </Details.Content>
          </Details.Root>
        ))}
      </div>
    </section>
  );
}
