import Link from "next/link";
import { RECIPE_META, recipesByCategory } from "@/recipes/catalog";
import "./recipe-rail.css";

/**
 * The category rail: every category with its count, the current one
 * marked. Sticky beside the content where there is room; a horizontal
 * scroller above it where there is not.
 * Prefetching the whole rail would load every category before it is visited.
 */
export function RecipesRail({ current }: { current?: string }) {
  const groups = recipesByCategory();
  return (
    <nav className="site-RecipesRail" aria-label="Recipe categories">
      <ul>
        <li>
          <Link
            href="/recipes/guide"
            prefetch={false}
            aria-current={current === "guide" ? "page" : undefined}
          >
            Building your own recipes
          </Link>
        </li>
        <li>
          <Link href="/recipes" prefetch={false} aria-current={current ? undefined : "page"}>
            <span>All recipes</span>
            <span className="count">{RECIPE_META.length}</span>
          </Link>
        </li>
        {groups.map(({ category, items }) => (
          <li key={category.slug}>
            <Link
              href={`/recipes/${category.slug}`}
              prefetch={false}
              aria-current={current === category.slug ? "page" : undefined}
            >
              <span>{category.title}</span>
              <span className="count">{items.length}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
