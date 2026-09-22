import { RecipesRail } from "@/renderer/recipes/RecipesRail";
import { MarkdownLink } from "@/site/MarkdownLink";
import "@/renderer/recipes/RecipePage.css";

export default function RecipeGuideLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-RecipePage">
      <div className="shell">
        <aside>
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
