import { recipeRouteParams, recipeDestination } from "@/examples/redirects";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { Badge } from "@loamui/core";
import { exampleHref, examplesIn, getCategory, getExample } from "@/examples";
import { EXAMPLE_SOURCE } from "@/examples/generated-source";
import { componentForExport } from "@/site/nav";
import { RecipePlayground } from "@/renderer/recipe-playground";
import { linkedRecipePrompt } from "@/examples/recipe-prompt";
import { PromptBlock } from "@/renderer/CopyPanel";
import "@/renderer/recipe-prompt-button.css";
import { ExamplePillars } from "@/renderer/examples-pillars";
import { ExampleCrumbs } from "@/renderer/examples-crumbs";
import { ExamplePager } from "@/renderer/examples-pager";
import "@/renderer/examples-page.css";
import "@/site/MarkdownLink.css";

export function generateStaticParams() {
  return recipeRouteParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { category, slug } = await params;
  const example = getExample(category, slug);
  if (!example) return {};
  return { title: `${example.meta.title} recipe`, description: example.meta.description };
}

/** The docs page for a core component, by its export name. */
function docHref(name: string): string | undefined {
  const item = componentForExport(name);
  return item ? `/docs/components/${item.slug}` : undefined;
}

export default async function ExamplePage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category: categorySlug, slug } = await params;
  const destination = recipeDestination(categorySlug, slug);
  if (destination && destination !== `/recipes/${categorySlug}/${slug}`)
    permanentRedirect(destination);
  const example = getExample(categorySlug, slug);
  const category = getCategory(categorySlug);
  const source = EXAMPLE_SOURCE[slug];
  if (!example || !category || !source) notFound();
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const prompt = linkedRecipePrompt(example);

  // Previous and next within the category, in its display order.
  const siblings = examplesIn(categorySlug);
  const at = siblings.findIndex((e) => e.slug === slug);
  const toLink = (e?: (typeof siblings)[number]) =>
    e ? { href: exampleHref(e), title: e.meta.title } : undefined;

  return (
    <div className="site-RecipePage">
      <article className="single">
        <header className="singleHead">
          <div className="crumbRow">
            <ExampleCrumbs category={category} title={example.meta.title} />
            <a
              className="site-MarkdownLink"
              href={`${base}/recipes/${categorySlug}/${slug}.md`}
              title="Read this recipe as Markdown"
            >
              View as Markdown
            </a>
          </div>
          <h1 className="title">{example.meta.title}</h1>
          <p className="lead">{example.meta.description}</p>
          {example.meta.whenToUse && <p className="sectionNote">{example.meta.whenToUse}</p>}
        </header>

        <section className="site-RecipePrompt" aria-labelledby="build-with-skill">
          <h2 id="build-with-skill">Build with the LoamUI skill</h2>
          <p>
            Already added the LoamUI skill? Copy the prompt below. Your agent will check your
            project and help complete any missing setup before building.
          </p>
          <PromptBlock prompt={prompt} copyLabel={`Copy prompt for ${example.meta.title}`} />
          <p className="help">
            Add your content or describe what you want to change. New to the skill?{" "}
            <Link href="/docs/agent-workflow">Add it to your project</Link>.
          </p>
        </section>

        <RecipePlayground title={example.meta.title} source={source}>
          <example.Example />
        </RecipePlayground>

        <section className="section" aria-labelledby="code">
          <h2 id="code" className="h2">
            Use this recipe
          </h2>
          <p className="sectionNote">
            Copy <code>Example.tsx</code> and <code>example.css</code> side by side into a React 19
            project. Install <code>@loamui/core</code> and load the core stylesheet at your
            application root, as shown in the{" "}
            <Link href="/docs/installation">installation guide</Link>. The component imports its own
            stylesheet.
          </p>
          <p className="sectionNote">
            {example.meta.integration ??
              "Replace the sample content and images with your own. Links and form actions illustrate application routes; provide those destinations and connect any action buttons to your application before shipping."}
          </p>
        </section>

        <section className="section" aria-labelledby="uses">
          <h2 id="uses" className="h2">
            Uses
          </h2>
          {example.meta.uses.length > 0 ? (
            <ul className="uses">
              {example.meta.uses.map((name) => {
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

        <section className="section" aria-labelledby="pillars">
          <h2 id="pillars" className="h2">
            Design decisions
          </h2>
          <p className="sectionNote">
            How this recipe answers the <Link href="/docs">two pillars</Link>, and how it composes
            the primitives. These notes explain the design. The included tests cover structure and
            selected interactions; check contrast, keyboard behaviour and assistive technology
            support in your application.
          </p>
          <ExamplePillars notes={example.meta.notes} composition={example.meta.composition} />
        </section>

        <ExamplePager
          label="recipe"
          previous={toLink(siblings[at - 1])}
          next={toLink(siblings[at + 1])}
        />
      </article>
    </div>
  );
}
