"use client";

import { useId } from "react";
import { Badge, Card, Carousel, SignpostLink, VisuallyHidden } from "@loamui/core";
import "./example.css";

export default function Example() {
  const instanceId = useId();
  return (
    <Carousel.Root
      className="article-carousel"
      aria-labelledby={`${instanceId}-article-carousel-title`}
      labels={{
        previous: "Previous articles",
        next: "Next articles",
        indicator: (index, count) => `Go to article ${index} of ${count}`,
        status: (index, count) => `Article ${index} of ${count}`,
      }}
    >
      <div className="head">
        <h2 id={`${instanceId}-article-carousel-title`}>From the growers’ journal</h2>
        <div className="controls">
          <Carousel.Previous />
          <Carousel.Next />
        </div>
      </div>
      <Carousel.Track>
        <Carousel.Item>
          <Card
            render={
              <article
                className="article"
                aria-labelledby={`${instanceId}-article-carousel-picking-french-beans`}
              />
            }
          >
            <div className="body">
              <img
                className="media"
                src="https://picsum.photos/id/627/640/400"
                alt=""
                width="640"
                height="400"
                sizes="auto, 100vw"
                srcSet="https://picsum.photos/id/627/320/200 320w, https://picsum.photos/id/627/640/400 640w"
                loading="lazy"
              />
              <p className="meta">
                <Badge.Root>
                  <Badge.Text>Guide</Badge.Text>
                </Badge.Root>
              </p>
              <h3 id={`${instanceId}-article-carousel-picking-french-beans`}>
                Picking French beans at their best
              </h3>
              <div className="foot">
                <SignpostLink href="/journal/picking-french-beans">
                  Read article
                  <VisuallyHidden> – Picking French beans at their best</VisuallyHidden>
                </SignpostLink>
              </div>
            </div>
          </Card>
        </Carousel.Item>
        <Carousel.Item>
          <Card
            render={
              <article
                className="article"
                aria-labelledby={`${instanceId}-article-carousel-haymaking`}
              />
            }
          >
            <div className="body">
              <img
                className="media"
                src="https://picsum.photos/id/729/640/400"
                alt=""
                width="640"
                height="400"
                sizes="auto, 100vw"
                srcSet="https://picsum.photos/id/729/320/200 320w, https://picsum.photos/id/729/640/400 640w"
                loading="lazy"
              />
              <p className="meta">
                <Badge.Root>
                  <Badge.Text>Harvest</Badge.Text>
                </Badge.Root>
              </p>
              <h3 id={`${instanceId}-article-carousel-haymaking`}>
                Haymaking on the member fields
              </h3>
              <div className="foot">
                <SignpostLink href="/journal/haymaking">
                  Read article
                  <VisuallyHidden> – Haymaking on the member fields</VisuallyHidden>
                </SignpostLink>
              </div>
            </div>
          </Card>
        </Carousel.Item>
        <Carousel.Item>
          <Card
            render={
              <article
                className="article"
                aria-labelledby={`${instanceId}-article-carousel-spring-buds`}
              />
            }
          >
            <div className="body">
              <img
                className="media"
                src="https://picsum.photos/id/400/640/400"
                alt=""
                width="640"
                height="400"
                sizes="auto, 100vw"
                srcSet="https://picsum.photos/id/400/320/200 320w, https://picsum.photos/id/400/640/400 640w"
                loading="lazy"
              />
              <p className="meta">
                <Badge.Root>
                  <Badge.Text>Plants</Badge.Text>
                </Badge.Root>
              </p>
              <h3 id={`${instanceId}-article-carousel-spring-buds`}>
                A closer look at spring buds
              </h3>
              <div className="foot">
                <SignpostLink href="/journal/spring-buds">
                  Read article
                  <VisuallyHidden> – A closer look at spring buds</VisuallyHidden>
                </SignpostLink>
              </div>
            </div>
          </Card>
        </Carousel.Item>
        <Carousel.Item>
          <Card
            render={
              <article
                className="article"
                aria-labelledby={`${instanceId}-article-carousel-woodland-tulips`}
              />
            }
          >
            <div className="body">
              <img
                className="media"
                src="https://picsum.photos/id/976/640/400"
                alt=""
                width="640"
                height="400"
                sizes="auto, 100vw"
                srcSet="https://picsum.photos/id/976/320/200 320w, https://picsum.photos/id/976/640/400 640w"
                loading="lazy"
              />
              <p className="meta">
                <Badge.Root>
                  <Badge.Text>Spring</Badge.Text>
                </Badge.Root>
              </p>
              <h3 id={`${instanceId}-article-carousel-woodland-tulips`}>
                Tulips at the woodland edge
              </h3>
              <div className="foot">
                <SignpostLink href="/journal/woodland-tulips">
                  Read article
                  <VisuallyHidden> – Tulips at the woodland edge</VisuallyHidden>
                </SignpostLink>
              </div>
            </div>
          </Card>
        </Carousel.Item>
        <Carousel.Item>
          <Card
            render={
              <article
                className="article"
                aria-labelledby={`${instanceId}-article-carousel-changing-weather`}
              />
            }
          >
            <div className="body">
              <img
                className="media"
                src="https://picsum.photos/id/542/640/400"
                alt=""
                width="640"
                height="400"
                sizes="auto, 100vw"
                srcSet="https://picsum.photos/id/542/320/200 320w, https://picsum.photos/id/542/640/400 640w"
                loading="lazy"
              />
              <p className="meta">
                <Badge.Root>
                  <Badge.Text>Notes</Badge.Text>
                </Badge.Root>
              </p>
              <h3 id={`${instanceId}-article-carousel-changing-weather`}>
                Reading the weather over the fields
              </h3>
              <div className="foot">
                <SignpostLink href="/journal/changing-weather">
                  Read article
                  <VisuallyHidden> – Reading the weather over the fields</VisuallyHidden>
                </SignpostLink>
              </div>
            </div>
          </Card>
        </Carousel.Item>
      </Carousel.Track>
      <Carousel.Indicators />
    </Carousel.Root>
  );
}
