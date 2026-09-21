import type { Metadata } from "next";
import { RecipesRail } from "@/renderer/recipes/recipe-rail";
import { RecipesIndex } from "@/renderer/recipes/recipe-index";
import "@/renderer/recipes/recipe-page.css";

export const metadata: Metadata = {
  title: "Example recipes",
  description:
    "Example recipes we built for our own products with LoamUI’s tokens, element styles and React components: worked references to take inspiration from.",
};

export default function RecipesPage() {
  return (
    <div className="site-RecipePage">
      <header className="hero">
        <span className="eyebrow">Example recipes</span>
        <h1 className="title">Recipes we built for our own products.</h1>
        <p className="lead">
          Explore product-specific compositions of LoamUI’s tokens, element styles and React
          components. Inspect the preview and source, then adapt a recipe to your own content.
        </p>
        <p className="lead">
          Open a recipe for its demo, React, CSS and a short prompt to build it with the{" "}
          <a href="/docs/agent-workflow">LoamUI skill</a>.{" "}
          <a href="/recipes/guide">Building your own recipes</a> explains the composition
          techniques.
        </p>
      </header>
      <div className="shell">
        <aside className="aside">
          <RecipesRail />
        </aside>
        <div className="content">
          <RecipesIndex />
        </div>
      </div>
    </div>
  );
}
