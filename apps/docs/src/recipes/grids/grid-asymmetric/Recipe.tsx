import { useId } from "react";
import { Card, SignpostLink } from "@loamui/core";
import "./recipe.css";

export default function Recipe() {
  const instanceId = useId();
  return (
    <div className="grid-asymmetric">
      <ul role="list">
        <li className="lead">
          <Card render={<article aria-labelledby={`${instanceId}-grid-asymmetric-lead`} />}>
            <div className="body">
              <img
                className="media"
                src="https://picsum.photos/id/646/1200/800"
                alt="A person walking between young orchard trees in low sunlight"
                width="1200"
                height="800"
                loading="lazy"
                sizes="auto, 100vw"
                srcSet="https://picsum.photos/id/646/400/267 400w, https://picsum.photos/id/646/800/533 800w, https://picsum.photos/id/646/1200/800 1200w"
              />
              <h3 id={`${instanceId}-grid-asymmetric-lead`}>September at the nursery</h3>
              <p>
                The plant sale opens on the first Saturday, the last of the summer seed comes off
                the bench, and the field walks move to the afternoon as the light shortens.
                Bare-root orders open on the fifteenth.
              </p>
              <div className="actions">
                <SignpostLink href="/news/september">Read the month’s notes</SignpostLink>
              </div>
            </div>
          </Card>
        </li>
        <li>
          <Card render={<article aria-labelledby={`${instanceId}-grid-asymmetric-sale`} />}>
            <div className="body">
              <h3 id={`${instanceId}-grid-asymmetric-sale`}>Plant sale</h3>
              <p>
                Member-grown perennials, herbs and the last vegetable plugs, on the bench from nine
                on Saturday 5 September.
              </p>
              <div className="actions">
                <SignpostLink href="/events/plant-sale">What is on the bench</SignpostLink>
              </div>
            </div>
          </Card>
        </li>
        <li>
          <Card render={<article aria-labelledby={`${instanceId}-grid-asymmetric-swap`} />}>
            <div className="body">
              <h3 id={`${instanceId}-grid-asymmetric-swap`}>Seed swap</h3>
              <p>
                Bring what you saved and take what you need, first Sunday of the month. Labels and
                envelopes are on the table.
              </p>
              <div className="actions">
                <SignpostLink href="/events/seed-swap">How the swap works</SignpostLink>
              </div>
            </div>
          </Card>
        </li>
      </ul>
    </div>
  );
}
