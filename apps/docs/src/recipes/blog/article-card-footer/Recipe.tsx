"use client";

import { useId } from "react";
import { Avatar, Badge, Card, Time } from "@loamui/core";
import "./recipe.css";

export default function Recipe() {
  const instanceId = useId();
  return (
    <Card
      render={
        <article
          className="article-card-footer"
          aria-labelledby={`${instanceId}-article-card-footer-title`}
        />
      }
    >
      <img
        className="media"
        src="https://picsum.photos/id/729/800/450"
        alt=""
        width="800"
        height="450"
      />
      <p className="meta">
        <Badge.Root>
          <Badge.Text>Harvest</Badge.Text>
        </Badge.Root>
      </p>
      <h3 id={`${instanceId}-article-card-footer-title`}>
        <a href="/journal/curing-winter-squash">Curing winter squash for storage</a>
      </h3>
      <p className="description">
        Ten days somewhere warm and dry hardens the skin; after that a cool shed keeps a ‘Crown
        Prince’ until March.
      </p>
      <footer>
        <div className="author">
          <Avatar.Root aria-hidden>
            <Avatar.Fallback>DR</Avatar.Fallback>
          </Avatar.Root>
          <div className="byline">
            <address>
              <a href="/growers/dafydd-rees" rel="author">
                Dafydd Rees
              </a>
            </address>
            <Time value="2026-09-02" locale="en-GB" dateStyle="medium" />
          </div>
        </div>
        <p className="likes">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 21s-7-4.5-9.5-9C1 8.5 3 4.5 7 4.5c2 0 3.5 1 5 3 1.5-2 3-3 5-3 4 0 6 4 4.5 7.5C19 16.5 12 21 12 21z" />
          </svg>
          124<span className="loam-VisuallyHidden"> likes</span>
        </p>
      </footer>
    </Card>
  );
}
