import { useId } from "react";
import { Avatar, Badge, Card, Time } from "@loamui/core";
import "./example.css";

export default function Example() {
  const title = useId();
  return (
    <Card render={<article className="article-card" aria-labelledby={title} />}>
      <div className="body">
        <img
          className="media"
          src="https://picsum.photos/id/292/800/450"
          alt=""
          width="800"
          height="450"
          loading="lazy"
          sizes="auto, 100vw"
          srcSet="https://picsum.photos/id/292/400/225 400w, https://picsum.photos/id/292/800/450 800w"
        />
        <p className="meta">
          <Badge.Root>
            <Badge.Text>Guide</Badge.Text>
          </Badge.Root>
          <Time value="2026-09-01" locale="en-GB" dateStyle="long" />
        </p>
        <h3 id={title}>
          <a href="/guides/overwintering-onions">Overwintering onions from sets</a>
        </h3>
        <p className="description">
          Sets planted in the last week of September root before the frosts and bulb up six weeks
          ahead of a spring planting. Which varieties hold through a wet winter, how far apart to
          set them, and what to do about the ones that bolt.
        </p>
        <div className="foot">
          <Avatar.Root aria-hidden>
            <Avatar.Fallback>RV</Avatar.Fallback>
          </Avatar.Root>
          <address>
            <a href="/growers/rhiannon-vaughan" rel="author">
              Rhiannon Vaughan
            </a>
          </address>
        </div>
      </div>
    </Card>
  );
}
