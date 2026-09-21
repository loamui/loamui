"use client";

import { useId } from "react";
import { Badge, Button, Card, Price, Rating } from "@loamui/core";
import "./recipe.css";

const PRODUCTS = [
  {
    slug: "climbing-bean-blue-lake",
    name: "Climbing bean ‘Blue Lake’ seeds",
    alt: "Freshly picked green pods heaped in a crate on the bench",
    image: 627,
    rating: 4.5,
    reviews: 128,
    price: 2.8,
    was: 3.5,
    offer: "Save 20%",
  },
  {
    slug: "raspberry-autumn-bliss",
    name: "Raspberry ‘Autumn Bliss’ canes, bundle of five",
    alt: "A cup of freshly picked raspberries on the bench",
    image: 429,
    rating: 5,
    reviews: 41,
    price: 24,
  },
  {
    slug: "strawberry-cambridge-favourite",
    name: "Strawberry ‘Cambridge Favourite’ runners, pack of twelve",
    alt: "Ripe strawberries on the plant, ready to pick",
    image: 1080,
    rating: 4,
    reviews: 17,
    price: 8.5,
  },
  {
    slug: "bamboo-canes",
    name: "Bamboo canes, bundle of ten",
    alt: "Bamboo canes capped with jam jars along a raised bed",
    image: 90,
    rating: 4.5,
    reviews: 63,
    price: 14,
  },
];

export default function Recipe() {
  const instanceId = useId();
  return (
    <ul className="product-grid" role="list">
      {PRODUCTS.map((product) => (
        <li key={product.slug}>
          <Card
            render={
              <article
                className="product"
                aria-labelledby={`${instanceId}-product-${product.slug}-title`}
              />
            }
          >
            <img
              className="media"
              src={`https://picsum.photos/id/${product.image}/600/600`}
              alt={product.alt}
              width="600"
              height="600"
            />
            {product.offer && (
              <p className="meta">
                <Badge.Root>
                  <Badge.Text>{product.offer}</Badge.Text>
                </Badge.Root>
              </p>
            )}
            <h3 id={`${instanceId}-product-${product.slug}-title`}>
              <a href={`/shop/${product.slug}`}>{product.name}</a>
            </h3>
            <div className="rating">
              <Rating readOnly label="Average rating" value={product.rating} />
              <span>
                ({product.reviews}
                <span className="loam-VisuallyHidden"> reviews</span>)
              </span>
            </div>
            <p className="price">
              {product.was && (
                <>
                  <span className="loam-VisuallyHidden">Was </span>
                  <s>
                    <Price value={product.was} currency="GBP" locale="en-GB" />
                  </s>{" "}
                  <span className="loam-VisuallyHidden">Now </span>
                </>
              )}
              <Price value={product.price} currency="GBP" locale="en-GB" />
            </p>
            <div className="actions">
              <Button>
                Add<span className="loam-VisuallyHidden"> {product.name}</span> to basket
              </Button>
            </div>
          </Card>
        </li>
      ))}
    </ul>
  );
}
