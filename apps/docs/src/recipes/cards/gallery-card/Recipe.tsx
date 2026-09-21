"use client";

import { useId } from "react";
import { Card, Carousel, Price, Rating } from "@loamui/core";
import "./recipe.css";

export default function Recipe() {
  const instanceId = useId();
  return (
    <Card
      render={
        <article className="gallery-card" aria-labelledby={`${instanceId}-gallery-card-title`} />
      }
    >
      <div className="body">
        <Carousel.Root
          className="photos"
          labels={{
            region: "Photos of the Orchard Cabin",
            previous: "Previous photo",
            next: "Next photo",
            indicator: (index, count) => `Go to photo ${index} of ${count}`,
            status: (index, count) => `Photo ${index} of ${count}`,
          }}
        >
          <Carousel.Track>
            <Carousel.Item>
              <img
                src="https://picsum.photos/id/206/640/400"
                alt="A timber building among orchard trees in low sunlight"
                width="640"
                height="400"
                loading="lazy"
                sizes="auto, 100vw"
                srcSet="https://picsum.photos/id/206/320/200 320w, https://picsum.photos/id/206/640/400 640w, https://picsum.photos/id/206/960/600 960w"
              />
            </Carousel.Item>
            <Carousel.Item>
              <img
                src="https://picsum.photos/id/225/640/400"
                alt="A glass pot of tea and a small cup beside yellow roses"
                width="640"
                height="400"
                loading="lazy"
                sizes="auto, 100vw"
                srcSet="https://picsum.photos/id/225/320/200 320w, https://picsum.photos/id/225/640/400 640w, https://picsum.photos/id/225/960/600 960w"
              />
            </Carousel.Item>
            <Carousel.Item>
              <img
                src="https://picsum.photos/id/33/640/400"
                alt="White wildflowers and tall meadow grass in low sunlight"
                width="640"
                height="400"
                loading="lazy"
                sizes="auto, 100vw"
                srcSet="https://picsum.photos/id/33/320/200 320w, https://picsum.photos/id/33/640/400 640w, https://picsum.photos/id/33/960/600 960w"
              />
            </Carousel.Item>
          </Carousel.Track>
          <div className="controls">
            <Carousel.Previous />
            <Carousel.Indicators />
            <Carousel.Next />
          </div>
        </Carousel.Root>
        <div className="head">
          <h3 id={`${instanceId}-gallery-card-title`}>
            <a href="/stays/orchard-cabin">The Orchard Cabin</a>
          </h3>
          <div className="rating">
            <Rating readOnly label="Average rating" value={4.8} />
            <span>63 reviews</span>
          </div>
        </div>
        <p className="description">
          Two nights at the nursery, sleeping four, with the walled garden to yourselves once the
          gates close and breakfast from the yard café.
        </p>
        <p className="price">
          <Price value={145} currency="GBP" locale="en-GB">
            per night
          </Price>
        </p>
      </div>
    </Card>
  );
}
