import { RecipesRail } from "@/renderer/recipes/recipe-rail";
import { MarkdownLink } from "@/site/MarkdownLink";
import "@/renderer/recipes/recipe-page.css";

export default function RecipeGuideLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-RecipePage">
      <div className="shell">
        <aside className="aside">
          <RecipesRail current="guide" />
        </aside>
        <article className="content">
          <MarkdownLink />
          {children}
        </article>
      </div>
    </div>
  );
}
