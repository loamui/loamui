"use client";

import { useId, useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@loamui/core";
import "./recipe.css";

type Choice = "accept" | "reject";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, iframe, [tabindex]:not([tabindex="-1"])';

/** Focus the next thing the reader could have tabbed to after the banner, or the main content. */
function focusAfter(banner: HTMLElement) {
  const doc = banner.ownerDocument;
  for (const el of doc.querySelectorAll<HTMLElement>(FOCUSABLE)) {
    if (banner.contains(el)) continue;
    if (banner.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING) {
      el.focus();
      return;
    }
  }
  const main = doc.querySelector<HTMLElement>("main");
  if (main) {
    if (!main.hasAttribute("tabindex")) main.setAttribute("tabindex", "-1");
    main.focus();
  }
}

export default function Recipe() {
  const instanceId = useId();
  const [choice, setChoice] = useState<Choice | null>(null);
  const [hidden, setHidden] = useState(false);
  const banner = useRef<HTMLElement>(null);
  const confirmation = useRef<HTMLDivElement>(null);

  // The button the reader pressed has gone with the banner, so focus moves to the one that replaced it.
  useEffect(() => {
    if (choice === null) return;
    confirmation.current?.querySelector("button")?.focus();
  }, [choice]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const { submitter } = event.nativeEvent as SubmitEvent;
    const value = submitter instanceof HTMLButtonElement ? submitter.value : "";
    if (value !== "accept" && value !== "reject") return;
    // Persist the choice here: a cookie, or a request to your server.
    setChoice(value);
  }

  function hide() {
    // The banner is still in the page here; focus moves on before it goes.
    if (banner.current) focusAfter(banner.current);
    setHidden(true);
  }

  if (hidden) return null;

  return (
    <section
      className="cookie-banner"
      aria-labelledby={`${instanceId}-cookie-banner-title`}
      ref={banner}
    >
      {choice === null && (
        <div className="inner">
          <h2 id={`${instanceId}-cookie-banner-title`}>Cookies on Hedgerow</h2>
          <p>
            We use essential cookies to keep your basket and remember that you are signed in. They
            are always on.
          </p>
          <p>
            We would also like to set cookies that tell us which guides and varieties people look
            at, so we can decide what to grow and write next. Nothing is shared with advertisers.
          </p>
          <form method="post" action="/cookies" onSubmit={submit}>
            <Button type="submit" name="cookies" value="accept">
              Accept additional cookies
            </Button>
            <Button type="submit" name="cookies" value="reject">
              Reject additional cookies
            </Button>
            <a href="/cookies">Cookie settings</a>
          </form>
        </div>
      )}
      <div className="confirmation" role="status" tabIndex={-1} ref={confirmation}>
        {choice !== null && (
          <>
            <p>
              You have {choice === "accept" ? "accepted" : "rejected"} additional cookies. You can
              change your cookie settings at any time.
            </p>
            <Button onClick={hide}>Hide this message</Button>
          </>
        )}
      </div>
    </section>
  );
}
