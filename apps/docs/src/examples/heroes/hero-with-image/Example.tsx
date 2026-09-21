import { useId } from "react";
import { Badge, SignpostLink } from "@loamui/core";
import "./example.css";

export default function Example() {
  const titleId = useId();
  return (
    <section className="hero-with-image" aria-labelledby={titleId}>
      <div>
        <header>
          <p className="eyebrow">
            <Badge.Root>
              <Badge.Text>Catalogue</Badge.Text>
            </Badge.Root>
            <span>Sowing from March</span>
          </p>
          <h1 id={titleId}>Seed saved by growers, for growers.</h1>
          <p className="lede">
            Hedgerow is a nursery and seed co-op. Every packet is an open-pollinated variety grown
            on a member plot, dried and packed by hand, and posted the week you order it.
          </p>
          <div className="actions">
            <SignpostLink href="/catalogue">Browse the catalogue</SignpostLink>
            <a href="/films/seed-saving">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
              Watch how we save seed
            </a>
          </div>
        </header>
        <img
          src="https://picsum.photos/id/785/1200/900"
          srcSet="https://picsum.photos/id/785/600/450 600w, https://picsum.photos/id/785/900/675 900w, https://picsum.photos/id/785/1200/900 1200w"
          sizes="100vw"
          alt="Cupped hands holding a bundle of fresh green shoots"
          width="1200"
          height="900"
          fetchPriority="high"
        />
      </div>
    </section>
  );
}
