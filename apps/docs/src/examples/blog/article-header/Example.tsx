"use client";

import { useId } from "react";
import { Avatar, Badge, Time } from "@loamui/core";
import "./example.css";

export default function Example() {
  const instanceId = useId();
  return (
    <article className="article-header" aria-labelledby={`${instanceId}-article-header-title`}>
      <header>
        <p className="eyebrow">
          <a href="/guides">Growing guides</a>
        </p>
        <h1 id={`${instanceId}-article-header-title`}>Sowing broad beans in autumn</h1>
        <p className="standfirst">
          An October sowing of ‘Aquadulce Claudia’ overwinters in the open ground and crops a month
          before anything sown in spring. Which plots it suits, how deep to sow, and how to keep the
          pigeons off.
        </p>
        <div className="byline">
          <Avatar.Root aria-hidden>
            <Avatar.Fallback>NP</Avatar.Fallback>
          </Avatar.Root>
          <address>
            <a href="/growers/nia-prosser" rel="author">
              Nia Prosser
            </a>
          </address>
          <span>
            <Time value="2026-08-28" locale="en-GB" dateStyle="long" />
          </span>
          <span>
            Updated <Time value="2026-09-04" locale="en-GB" dateStyle="long" />
          </span>
          <span>6 min read</span>
        </div>
        <ul className="tags" role="list" aria-label="Tags">
          <li>
            <Badge.Root
              size="lg"
              render={
                <a href="/tags/broad-beans">
                  <Badge.Text>Broad beans</Badge.Text>
                </a>
              }
            />
          </li>
          <li>
            <Badge.Root
              size="lg"
              render={
                <a href="/tags/autumn-sowing">
                  <Badge.Text>Autumn sowing</Badge.Text>
                </a>
              }
            />
          </li>
          <li>
            <Badge.Root
              size="lg"
              render={
                <a href="/tags/legumes">
                  <Badge.Text>Legumes</Badge.Text>
                </a>
              }
            />
          </li>
        </ul>
        <figure>
          <img
            src="https://picsum.photos/id/627/1200/675"
            alt="A crate of freshly picked beans on the packing bench"
            width="1200"
            height="675"
          />
          <figcaption>
            The first picking from the autumn-sown row on the Ludlow plot. Photograph: Nia Prosser
          </figcaption>
        </figure>
      </header>
    </article>
  );
}
