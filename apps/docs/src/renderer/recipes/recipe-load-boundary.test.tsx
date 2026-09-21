import { afterEach, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { lazy, Suspense } from "react";
import { ExampleLoadBoundary } from "./recipe-load-boundary";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

it("keeps navigation available when an optional example chunk fails to load", async () => {
  vi.spyOn(console, "error").mockImplementation(() => {});
  const FailedPreview = lazy(() => Promise.reject(new Error("Preview chunk unavailable")));
  render(
    <>
      <ExampleLoadBoundary fallback={<p>Preview unavailable</p>}>
        <Suspense fallback={null}>
          <FailedPreview />
        </Suspense>
      </ExampleLoadBoundary>
      <a href="/recipes/forms/sign-in">Sign in example</a>
    </>,
  );
  expect(await screen.findByText("Preview unavailable")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Sign in example" })).toHaveAttribute(
    "href",
    "/recipes/forms/sign-in",
  );
});
