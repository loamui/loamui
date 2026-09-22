import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@loamui/core";
import { RECIPES, recipeHref, recipesIn, getCategory, getRecipe } from "@/recipes";
import { RECIPE_SOURCE } from "@/recipes/generated/source";
import { componentForExport } from "@/site/nav";
import { RecipePlayground } from "@/renderer/recipes/RecipePlayground";
import { linkedRecipePrompt } from "@/recipes/recipe-prompt";
import { PromptBlock } from "@/renderer/shared/CopyPanel";
import "@/renderer/recipes/RecipePrompt.css";
import { RecipePillars } from "@/renderer/recipes/RecipePillars";
import { RecipeCrumbs } from "@/renderer/recipes/RecipeCrumbs";
import { RecipePager } from "@/renderer/recipes/RecipePager";
import "@/renderer/recipes/RecipePage.css";
import "@/site/MarkdownLink.css";

export function generateStaticParams() {
  return RECIPES.map(({ category, slug }) => ({ category, slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { category, slug } = await params;
  const recipe = getRecipe(category, slug);
  if (!recipe) return {};
  return { title: `${recipe.meta.title} recipe`, description: recipe.meta.description };
}

function docHref(name: string): string | undefined {
  const item = componentForExport(name);
  return item ? `/docs/components/${item.slug}` : undefined;
}

export default async function RecipePage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category: categorySlug, slug } = await params;
  const recipe = getRecipe(categorySlug, slug);
  const category = getCategory(categorySlug);
  const source = RECIPE_SOURCE[slug];
  if (!recipe || !category || !source) notFound();
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const prompt = linkedRecipePrompt(recipe);

  const siblings = recipesIn(categorySlug);
  const at = siblings.findIndex((e) => e.slug === slug);
  const toLink = (e?: (typeof siblings)[number]) =>
    e ? { href: recipeHref(e), title: e.meta.title } : undefined;

  return (
    <div className="site-RecipePage">
      <article className="single">
        <header>
          <div className="crumbRow">
            <RecipeCrumbs category={category} title={recipe.meta.title} />
            <a
              className="site-MarkdownLink"
              href={`${base}/recipes/${categorySlug}/${slug}.md`}
              title="Read this recipe as Markdown"
            >
              View as Markdown
            </a>
          </div>
          <h1>{recipe.meta.title}</h1>
          <p className="lead">{recipe.meta.description}</p>
          {recipe.meta.whenToUse && <p className="sectionNote">{recipe.meta.whenToUse}</p>}
        </header>

        <section className="site-RecipePrompt" aria-labelledby="build-with-skill">
          <h2 id="build-with-skill">Build with the LoamUI skill</h2>
          <p>
            Already added the LoamUI skill? Copy the prompt below. Your agent will check your
            project and help complete any missing setup before building.
          </p>
          <PromptBlock prompt={prompt} copyLabel={`Copy prompt for ${recipe.meta.title}`} />
          <p className="help">
            Add your content or describe what you want to change. New to the skill?{" "}
            <Link href="/docs/agent-workflow">Add it to your project</Link>.
          </p>
        </section>

        <RecipePlayground title={recipe.meta.title} source={source}>
          <recipe.Recipe />
        </RecipePlayground>

        <section aria-labelledby="code">
          <h2 id="code">Use this recipe</h2>
          <p className="sectionNote">
            Copy <code>Recipe.tsx</code> and <code>recipe.css</code> side by side into a React 19
            project. Install <code>@loamui/core</code> and load the core stylesheet at your
            application root, as shown in the{" "}
            <Link href="/docs/installation">installation guide</Link>. The component imports its own
            stylesheet.
          </p>
          <p className="sectionNote">
            {recipe.meta.integration ??
              "Replace the sample content and images with your own. Links and form actions illustrate application routes; provide those destinations and connect any action buttons to your application before shipping."}
          </p>
        </section>

        <section aria-labelledby="uses">
          <h2 id="uses">Uses</h2>
          {recipe.meta.uses.length > 0 ? (
            <ul className="uses">
              {recipe.meta.uses.map((name) => {
                const href = docHref(name);
                return (
                  <li key={name}>
                    {href ? (
                      <Badge.Root render={<Link href={href} />}>
                        <Badge.Text>{name}</Badge.Text>
                      </Badge.Root>
                    ) : (
                      <Badge.Root>
                        <Badge.Text>{name}</Badge.Text>
                      </Badge.Root>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="usesNone">
              No components: the <Link href="/docs/element-styles">element styles</Link> and the
              tokens carry this one on their own.
            </p>
          )}
        </section>

        <section aria-labelledby="pillars">
          <h2 id="pillars">Design decisions</h2>
          <p className="sectionNote">
            How this recipe answers the <Link href="/docs">two pillars</Link>, and how it composes
            the primitives. These notes explain the design. The included tests cover structure and
            selected interactions; check contrast, keyboard behaviour and assistive technology
            support in your application.
          </p>
          <RecipePillars notes={recipe.meta.notes} composition={recipe.meta.composition} />
        </section>

        <RecipePager
          label="recipe"
          previous={toLink(siblings[at - 1])}
          next={toLink(siblings[at + 1])}
        />
      </article>
    </div>
  );
}
