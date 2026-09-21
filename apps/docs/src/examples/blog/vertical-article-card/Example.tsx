"use client";

import { useId } from "react";
import { Avatar, Badge, Card, Time } from "@loamui/core";
import "./example.css";

export default function Example() {
  const instanceId = useId();
  return (
    <Card
      render={
        <article
          className="vertical-article-card"
          aria-labelledby={`${instanceId}-vertical-article-card-title`}
        />
      }
    >
      <img
        className="media"
        src="https://picsum.photos/id/152/600/750"
        alt="Purple trumpet-shaped flowers with water droplets"
        width="600"
        height="750"
      />
      <p className="meta">
        <Badge.Root>
          <Badge.Text>Summer planting</Badge.Text>
        </Badge.Root>
      </p>
      <h3 id={`${instanceId}-vertical-article-card-title`}>
        <a href="/journal/summer-container-colours">Colour ideas for summer containers</a>
      </h3>
      <div className="author">
        <Avatar.Root aria-hidden>
          <Avatar.Fallback>AO</Avatar.Fallback>
        </Avatar.Root>
        <div className="byline">
          <address>
            <a href="/growers/amara-okonkwo" rel="author">
              Amara Okonkwo
            </a>
          </address>
          <Time value="2026-05-20" locale="en-GB" dateStyle="long" />
        </div>
      </div>
    </Card>
  );
}
