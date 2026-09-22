import { useId } from "react";
import { Badge, SignpostLink } from "@loamui/core";
import "./recipe.css";

export default function Recipe() {
  const titleId = useId();
  return (
    <section className="banner-with-image" aria-labelledby={titleId}>
      <img
        src="https://picsum.photos/id/429/800/600"
        srcSet="https://picsum.photos/id/429/400/300 400w, https://picsum.photos/id/429/800/600 800w, https://picsum.photos/id/429/1600/1200 1600w"
        sizes="auto, 100vw"
        alt="A cup of freshly picked raspberries"
        width="1600"
        height="1200"
        loading="lazy"
      />
      <div className="copy">
        <p className="eyebrow">
          <Badge.Root>
            <Badge.Text>Offer</Badge.Text>
          </Badge.Root>
          <span>Until 30 November · bare-root season</span>
        </p>
        <h2 id={titleId}>Members save 20% on fruit plants</h2>
        <p className="description">
          Apples, pears, plums and soft fruit on local rootstocks, lifted the week they are posted.
          Order before the end of November and the discount comes off at the basket.
        </p>
        <div className="actions">
          <SignpostLink href="/catalogue/fruit">See the fruit list</SignpostLink>
        </div>
      </div>
    </section>
  );
}
