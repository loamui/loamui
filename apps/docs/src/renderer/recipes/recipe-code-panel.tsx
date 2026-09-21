"use client";

import { Details } from "@loamui/core";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ExampleLoadBoundary } from "./recipe-load-boundary";
import type { RecipeSource } from "@/recipes/types";
import "./recipe-code-panel.css";

const RecipeCode = lazy(() => import("./recipe-code").then((m) => ({ default: m.RecipeCode })));

/**
 * The code, collapsed under a native disclosure, so a category page reads
 * as a showcase first and a source listing second.
 */
export function RecipeCodePanel({ source, href }: { source: RecipeSource; href: string }) {
  const ref = useRef<HTMLDetailsElement>(null);
  const [requested, setRequested] = useState(false);

  // Native details can open before hydration has attached the toggle handler.
  useEffect(() => {
    if (ref.current?.open) setRequested(true);
  }, []);

  const sourceLink = (
    <p className="message">
      <Link href={`${href}#code`} prefetch={false}>
        View code on the example page
      </Link>
    </p>
  );

  return (
    <Details.Root
      ref={ref}
      className="site-RecipeCodePanel"
      onToggle={(event) => {
        if (event.currentTarget.open) setRequested(true);
      }}
    >
      <Details.Summary>Code</Details.Summary>
      <Details.Content className="content">
        {requested ? (
          <ExampleLoadBoundary fallback={sourceLink}>
            <Suspense
              fallback={
                <p className="message" role="status">
                  Loading code…
                </p>
              }
            >
              <RecipeCode source={source} />
            </Suspense>
          </ExampleLoadBoundary>
        ) : (
          sourceLink
        )}
      </Details.Content>
    </Details.Root>
  );
}
