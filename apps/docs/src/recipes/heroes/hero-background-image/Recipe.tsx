import { useId } from "react";
import { SignpostLink } from "@loamui/core";
import "./recipe.css";

export default function Recipe() {
  const titleId = useId();
  return (
    <section className="hero-background-image" aria-labelledby={titleId}>
      <img
        src="https://picsum.photos/id/206/1600/900"
        srcSet="https://picsum.photos/id/206/640/360 640w, https://picsum.photos/id/206/960/540 960w, https://picsum.photos/id/206/1600/900 1600w"
        sizes="100vw"
        alt=""
        width="1600"
        height="900"
        fetchPriority="high"
      />
      <header>
        <h1 id={titleId}>A field of seed, saved by the people who sow it.</h1>
        <p className="lede">
          Hedgerow grows open-pollinated vegetables, herbs and flowers on member plots across
          Shropshire, and posts the seed the week you order it.
        </p>
        <div className="actions">
          <SignpostLink href="/catalogue">Browse the catalogue</SignpostLink>
          <a href="/films/harvest">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
            Watch the harvest
          </a>
        </div>
      </header>
    </section>
  );
}
