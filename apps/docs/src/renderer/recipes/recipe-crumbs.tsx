"use client";

import Link from "next/link";
import { Breadcrumbs } from "@loamui/core";

/**
 * The trail above a category (Recipes → the category) or an example
 * (Recipes → its category → the example). The items are built as a list
 * so the root never sees a false child, which would draw a separator
 * after the current item.
 */
export function RecipeCrumbs({
  category,
  title,
}: {
  category: { slug: string; title: string };
  /** The example's title; omitted on the category page, which is the current item. */
  title?: string;
}) {
  const items = [
    <Breadcrumbs.Item key="recipes" render={<Link href="/recipes" />}>
      Recipes
    </Breadcrumbs.Item>,
    title ? (
      <Breadcrumbs.Item key="category" render={<Link href={`/recipes/${category.slug}`} />}>
        {category.title}
      </Breadcrumbs.Item>
    ) : (
      <Breadcrumbs.Item key="category" current>
        {category.title}
      </Breadcrumbs.Item>
    ),
  ];
  if (title) {
    items.push(
      <Breadcrumbs.Item key="example" current>
        {title}
      </Breadcrumbs.Item>,
    );
  }
  return <Breadcrumbs.Root>{items}</Breadcrumbs.Root>;
}
