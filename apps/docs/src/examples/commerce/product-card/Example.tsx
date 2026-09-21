"use client";

import { useId } from "react";
import { Badge, Button, Card, Price, Rating } from "@loamui/core";
import "./example.css";

export default function Example() {
  const title = useId();
  return (
    <Card render={<article className="product-card" aria-labelledby={title} />}>
      <img
        className="media"
        src="https://picsum.photos/id/627/600/600"
        alt="Freshly picked green pods heaped in a crate on the bench"
        width="600"
        height="600"
      />
      <p className="meta">
        <Badge.Root>
          <Badge.Text>Save 20%</Badge.Text>
        </Badge.Root>
      </p>
      <h3 id={title}>
        <a href="/seeds/climbing-bean-blue-lake">Climbing bean ‘Blue Lake’ seeds</a>
      </h3>
      <div className="rating">
        <Rating readOnly label="Average rating" value={4.5} />
        <span>
          (128<span className="loam-VisuallyHidden"> reviews</span>)
        </span>
      </div>
      <p className="price">
        <span className="loam-VisuallyHidden">Was </span>
        <s>
          <Price value={3.5} currency="GBP" locale="en-GB" />
        </s>{" "}
        <span className="loam-VisuallyHidden">Now </span>
        <Price value={2.8} currency="GBP" locale="en-GB" />
      </p>
      <div className="actions">
        <Button>
          Add<span className="loam-VisuallyHidden"> Climbing bean ‘Blue Lake’ seeds</span> to basket
        </Button>
      </div>
    </Card>
  );
}
