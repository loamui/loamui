"use client";

import { useId } from "react";
import { Avatar, Badge, Card, Time } from "@loamui/core";
import "./example.css";

const ARTICLES = [
  {
    slug: "planting-a-native-hedge",
    title: "Planting a mixed native hedge",
    category: "Planting",
    date: "2026-09-06",
    description:
      "Hawthorn, blackthorn, hazel and dog rose as bare-root whips from November: how many to the metre, why a double staggered row, and the cutting back that makes it thick in the first two winters.",
    author: { name: "Dafydd Rees", slug: "dafydd-rees" },
    image: 19,
  },
  {
    slug: "tomato-seed-from-one-fruit",
    title: "Saving tomato seed from a single fruit",
    category: "Seed saving",
    date: "2026-08-14",
    description:
      "Ferment the pulp for three days, rinse, dry on a plate and you have enough seed for a decade.",
    author: { name: "Tom Okafor", slug: "tom-okafor" },
    image: 400,
  },
  {
    slug: "september-plant-sale",
    title: "Open day: the September plant sale",
    category: "Co-op news",
    date: "2026-08-30",
    description:
      "Member-grown perennials, bare-root fruit and the last of the summer seed, on the nursery bench from nine.",
    author: { name: "Rhiannon Vaughan", slug: "rhiannon-vaughan" },
    image: 696,
  },
];

export default function Example() {
  const instanceId = useId();
  return (
    <ul className="article-cards-grid" role="list">
      {ARTICLES.map((article) => (
        <li key={article.slug}>
          <Card
            render={
              <article
                className="article"
                aria-labelledby={`${instanceId}-article-${article.slug}-title`}
              />
            }
          >
            <img
              className="media"
              src={`https://picsum.photos/id/${article.image}/800/450`}
              alt=""
              width="800"
              height="450"
            />
            <p className="meta">
              <Badge.Root>
                <Badge.Text>{article.category}</Badge.Text>
              </Badge.Root>
              <Time value={article.date} locale="en-GB" dateStyle="long" />
            </p>
            <h3 id={`${instanceId}-article-${article.slug}-title`}>
              <a href={`/guides/${article.slug}`}>{article.title}</a>
            </h3>
            <p className="description">{article.description}</p>
            <div className="foot">
              <Avatar.Root aria-hidden>
                <Avatar.Fallback>
                  {article.author.name
                    .split(/\s+/)
                    .map((part) => part[0])
                    .join("")}
                </Avatar.Fallback>
              </Avatar.Root>
              <address>
                <a href={`/growers/${article.author.slug}`} rel="author">
                  {article.author.name}
                </a>
              </address>
            </div>
          </Card>
        </li>
      ))}
    </ul>
  );
}
