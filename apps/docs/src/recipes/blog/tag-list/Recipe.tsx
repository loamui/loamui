import { Badge } from "@loamui/core";
import "./recipe.css";

export default function Recipe() {
  return (
    <ul className="tag-list" role="list" aria-label="Tags">
      <li>
        <Badge.Root
          size="lg"
          render={
            <a href="/tags/broad-beans">
              <Badge.Text>Broad beans</Badge.Text>
            </a>
          }
        />
      </li>
      <li>
        <Badge.Root
          size="lg"
          render={
            <a href="/tags/autumn-sowing" aria-current="page">
              <Badge.Text>Autumn sowing</Badge.Text>
            </a>
          }
        />
      </li>
      <li>
        <Badge.Root
          size="lg"
          render={
            <a href="/tags/legumes">
              <Badge.Text>Legumes</Badge.Text>
            </a>
          }
        />
      </li>
      <li>
        <Badge.Root
          size="lg"
          render={
            <a href="/tags/overwintering">
              <Badge.Text>Overwintering</Badge.Text>
            </a>
          }
        />
      </li>
      <li>
        <Badge.Root
          size="lg"
          render={
            <a href="/tags/pigeons">
              <Badge.Text>Pigeons</Badge.Text>
            </a>
          }
        />
      </li>
    </ul>
  );
}
