import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  RECIPE_CATEGORIES,
  recipeHref,
  recipesIn,
  getCategory,
  recipesByCategory,
} from "@/recipes";
import { RECIPE_SOURCE } from "@/recipes/generated/source";
import { RecipesRail } from "@/renderer/recipes/recipe-rail";
import { RecipeStage } from "@/renderer/recipes/recipe-stage";
import { RecipeCodePanel } from "@/renderer/recipes/recipe-code-panel";
import { RecipeCrumbs } from "@/renderer/recipes/recipe-crumbs";
import { RecipePager } from "@/renderer/recipes/recipe-pager";
import "@/renderer/recipes/recipe-page.css";

export function generateStaticParams() {
  return recipesByCategory().map(({ category }) => ({ category: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const category = getCategory((await params).category);
  if (!category) return {};
  return { title: `${category.title} recipes`, description: category.blurb };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();
  const items = recipesIn(category.slug);
  if (!items.length) notFound();

  // Previous and next among the categories that have recipes, in the
  // rail's order.
  const listed = RECIPE_CATEGORIES.filter((cat) => recipesIn(cat.slug).length > 0);
  const at = listed.findIndex((cat) => cat.slug === category.slug);
  const toLink = (cat?: (typeof listed)[number]) =>
    cat ? { href: `/recipes/${cat.slug}`, title: cat.title } : undefined;

  return (
    <div className="site-RecipePage">
      <header>
        <RecipeCrumbs category={category} />
        <h1>{category.title}</h1>
        <p className="lead">
          {category.blurb} {items.length} {items.length === 1 ? "recipe" : "recipes"}.
        </p>
      </header>
      <div className="shell">
        <aside>
          <RecipesRail current={category.slug} />
        </aside>
        <div className="content">
          {items.map((e) => {
            const source = RECIPE_SOURCE[e.slug];
            return (
              <article key={e.slug} id={e.slug} className="entry">
                <header>
                  <h2>
                    <Link href={recipeHref(e)}>{e.meta.title}</Link>
                    <a
                      href={`#${e.slug}`}
                      className="anchor"
                      aria-label={`Link to ${e.meta.title}`}
                    >
                      #
                    </a>
                  </h2>
                  <p>{e.meta.description}</p>
                </header>
                <RecipeStage title={e.meta.title} href={recipeHref(e)}>
                  <e.Recipe />
                </RecipeStage>
                {source && <RecipeCodePanel source={source} href={recipeHref(e)} />}
              </article>
            );
          })}
          <RecipePager
            label="category"
            previous={toLink(listed[at - 1])}
            next={toLink(listed[at + 1])}
          />
        </div>
      </div>
    </div>
  );
}
