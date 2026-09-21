"use client";

import { useId } from "react";
import { Details } from "@loamui/core";
import "./recipe.css";

const QUESTIONS = [
  {
    question: "Where is my order?",
    answer:
      "Seed goes second class on the Monday or Thursday after you order and takes two to four working days. If it has been a week, write to the bench with the order number and we will send it again.",
  },
  {
    question: "Can I change an order after placing it?",
    answer:
      "Until it is packed, yes. Reply to the confirmation email with what to add or take off and we adjust the charge before it goes out.",
  },
  {
    question: "How do I renew or cancel membership?",
    answer:
      "Membership renews on the anniversary of joining and we write a fortnight before. Cancel by replying to that email or from the membership page; nothing is charged after that.",
  },
  {
    question: "Do you offer trade or bulk prices?",
    answer:
      "Growers, community gardens and shops can order in bulk at a trade rate from a hundred packets. Write to the bench with what you need and we quote from that season's stock.",
  },
  {
    question: "Are the workshops accessible?",
    answer:
      "The polytunnel and the classroom are level from the car park, with step-free access and a hearing loop. The field walks cross rough ground; tell us when booking and we plan a route.",
  },
];

export default function Recipe() {
  const instanceId = useId();
  return (
    <section className="faq-page-header" aria-labelledby={`${instanceId}-faq-page-header-title`}>
      <header>
        <div className="intro">
          <h1 id={`${instanceId}-faq-page-header-title`}>Help and support</h1>
          <p>
            Answers to the questions the bench is asked most, and the ways to reach a person when
            the answer is not here.
          </p>
        </div>
        <address className="contact">
          <ul role="list">
            <li>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" />
              </svg>
              <a href="mailto:hello@hedgerow.coop">hello@hedgerow.coop</a>
            </li>
            <li>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
              </svg>
              <a href="tel:+441588640210">01588 640210</a>
            </li>
          </ul>
          <p className="hours">
            Wednesday to Sunday, 10am to 4pm. Email is read on Tuesdays and Fridays.
          </p>
        </address>
      </header>
      <div className="questions">
        {QUESTIONS.map((item) => (
          <Details.Root key={item.question} name="faq-page-header">
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
