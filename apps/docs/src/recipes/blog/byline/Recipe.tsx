import { Avatar, Time } from "@loamui/core";
import "./recipe.css";

export default function Recipe() {
  return (
    <div className="byline">
      <Avatar.Root aria-hidden>
        <Avatar.Fallback>NP</Avatar.Fallback>
      </Avatar.Root>
      <address>
        <a href="/growers/nia-prosser" rel="author">
          Nia Prosser
        </a>
      </address>
      <span>
        <Time value="2026-08-28" locale="en-GB" dateStyle="long" />
      </span>
      <span>
        Updated <Time value="2026-09-04" locale="en-GB" dateStyle="long" />
      </span>
      <span>6 min read</span>
    </div>
  );
}
