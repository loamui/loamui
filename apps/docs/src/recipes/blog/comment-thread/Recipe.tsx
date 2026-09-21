"use client";

import { useId } from "react";
import { Avatar, Badge, Button, Time } from "@loamui/core";
import "./recipe.css";

// The moment the distances are written against: a value the server and the
// browser share, never Date.now(), so both write the same words.
const NOW = "2026-09-08T09:00:00Z";

export default function Recipe() {
  const instanceId = useId();
  return (
    <article className="comment-thread" aria-labelledby={`${instanceId}-comment-thread-author`}>
      <header>
        <Avatar.Root aria-hidden>
          <Avatar.Fallback>DR</Avatar.Fallback>
        </Avatar.Root>
        <a
          id={`${instanceId}-comment-thread-author`}
          className="author"
          href="/members/dafydd-rees"
        >
          Dafydd Rees
        </a>
        <Time value="2026-09-05T14:30:00Z" locale="en-GB" relative={{ now: NOW }} />
      </header>
      <div className="body">
        <p>
          Does the October sowing hold up on heavy clay? Mine sat in water until March and half of
          it rotted, and the half that came through was no earlier than the spring-sown row.
        </p>
      </div>
      <div className="actions">
        <Button>
          Reply<span className="loam-VisuallyHidden"> to Dafydd Rees</span>
        </Button>
      </div>
      <ul className="replies" role="list" aria-label="Replies to Dafydd Rees">
        <li>
          <article aria-labelledby={`${instanceId}-comment-thread-reply-1-author`}>
            <header>
              <Avatar.Root aria-hidden>
                <Avatar.Fallback>NP</Avatar.Fallback>
              </Avatar.Root>
              <a
                id={`${instanceId}-comment-thread-reply-1-author`}
                className="author"
                href="/growers/nia-prosser"
              >
                Nia Prosser
              </a>
              <Badge.Root>
                <Badge.Text>Author</Badge.Text>
              </Badge.Root>
              <Time value="2026-09-05T16:05:00Z" locale="en-GB" relative={{ now: NOW }} />
            </header>
            <div className="body">
              <p>
                On clay, sow into a ridge so the seed sits above the standing water, or start them
                in modules in a cold frame and plant out in February. Either way you keep the early
                crop; it is the wet feet that do for them, not the cold.
              </p>
            </div>
            <div className="actions">
              <Button>
                Reply<span className="loam-VisuallyHidden"> to Nia Prosser</span>
              </Button>
            </div>
          </article>
        </li>
        <li>
          <article aria-labelledby={`${instanceId}-comment-thread-reply-2-author`}>
            <header>
              <Avatar.Root aria-hidden>
                <Avatar.Fallback>PN</Avatar.Fallback>
              </Avatar.Root>
              <a
                id={`${instanceId}-comment-thread-reply-2-author`}
                className="author"
                href="/members/priya-natarajan"
              >
                Priya Natarajan
              </a>
              <Time value="2026-09-06T08:12:00Z" locale="en-GB" relative={{ now: NOW }} />
            </header>
            <div className="body">
              <p>
                Ours is clay at Ludlow. A ridge and a handful of grit in the drill got a full row
                through last winter.
              </p>
            </div>
            <div className="actions">
              <Button>
                Reply<span className="loam-VisuallyHidden"> to Priya Natarajan</span>
              </Button>
            </div>
          </article>
        </li>
      </ul>
    </article>
  );
}
