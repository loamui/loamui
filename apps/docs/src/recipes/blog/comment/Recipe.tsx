"use client";

import { useId } from "react";
import { Avatar, Button, Time } from "@loamui/core";
import "./recipe.css";

// The moment the distance is written against: a value the server and the
// browser share, never Date.now(), so both write the same words.
const NOW = "2026-09-08T09:00:00Z";

export default function Recipe() {
  const author = useId();
  return (
    <article className="comment" aria-labelledby={author}>
      <header>
        <Avatar.Root aria-hidden>
          <Avatar.Fallback>PN</Avatar.Fallback>
        </Avatar.Root>
        <a id={author} className="author" href="/members/priya-natarajan">
          Priya Natarajan
        </a>
        <Time value="2026-09-05T14:30:00Z" locale="en-GB" relative={{ now: NOW }} />
      </header>
      <div className="body">
        <p>
          Sowed a double row of ‘Aquadulce Claudia’ on the allotment last October and it came
          through two hard frosts with nothing over it. The pigeons were another matter: net the row
          the day the shoots show, not the day after.
        </p>
      </div>
      <div className="actions">
        <Button>
          Reply<span className="loam-VisuallyHidden"> to Priya Natarajan</span>
        </Button>
        <Button>
          Report<span className="loam-VisuallyHidden"> Priya Natarajan’s comment</span>
        </Button>
      </div>
    </article>
  );
}
