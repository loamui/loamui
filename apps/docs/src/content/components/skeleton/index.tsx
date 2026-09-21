import { Avatar, Skeleton } from "@loamui/core";
import type { CSSProperties } from "react";
import type { ComponentContent } from "@/renderer/types";
import { SkeletonSwapDemo } from "./demos";

const doc: ComponentContent = {
  slug: "skeleton",
  lead: "A placeholder shown while content loads, sized by the content it stands in for.",
  importLine: `import { Skeleton, Avatar } from "@loamui/core";`,
  demos: [
    {
      title: "Basic lines",
      description:
        "Stack skeletons to stand in for text while it loads. A bare Skeleton is one line tall (1lh) in the local typography and full width; a shorter line is a CSS decision, through the public --loam-skeleton-inline-size property.",
      code: `<Skeleton />
<Skeleton style={{ "--loam-skeleton-inline-size": "80%" }} />
<Skeleton style={{ "--loam-skeleton-inline-size": "60%" }} />`,
      render: () => (
        <div
          style={{
            display: "grid",
            gap: "var(--loam-space-2xs)",
            inlineSize: "100%",
            maxInlineSize: "22rem",
          }}
        >
          <Skeleton />
          <Skeleton style={{ "--loam-skeleton-inline-size": "80%" } as CSSProperties} />
          <Skeleton style={{ "--loam-skeleton-inline-size": "60%" } as CSSProperties} />
        </div>
      ),
    },
    {
      title: "Circle + lines",
      description:
        "An avatar-and-text placeholder for a list item. The circle is a wrapped Avatar: the child sizes and shapes the placeholder, so there is no circle prop and nothing to keep in step with the avatar's size.",
      code: `<div style={{ display: "flex", gap: "var(--loam-space-xs)", alignItems: "center" }}>
  <Skeleton><Avatar.Root /></Skeleton>
  <div style={{ display: "grid", gap: "var(--loam-space-2xs)", flex: 1 }}>
    <Skeleton style={{ "--loam-skeleton-inline-size": "40%" }} />
    <Skeleton style={{ "--loam-skeleton-inline-size": "70%" }} />
  </div>
</div>`,
      render: () => (
        <div
          style={{
            display: "flex",
            gap: "var(--loam-space-xs)",
            alignItems: "center",
            inlineSize: "100%",
            maxInlineSize: "22rem",
          }}
        >
          <Skeleton>
            <Avatar.Root>
              <Avatar.Fallback>?</Avatar.Fallback>
            </Avatar.Root>
          </Skeleton>
          <div style={{ display: "grid", gap: "var(--loam-space-2xs)", flex: 1 }}>
            <Skeleton style={{ "--loam-skeleton-inline-size": "40%" } as CSSProperties} />
            <Skeleton style={{ "--loam-skeleton-inline-size": "70%" } as CSSProperties} />
          </div>
        </div>
      ),
    },
    {
      title: "A bare placeholder from CSS",
      description:
        "Where there is no content to wrap, a thumbnail's size and shape are CSS decisions: --loam-skeleton-inline-size, --loam-skeleton-block-size and --loam-skeleton-radius, set per instance or on a region.",
      code: `<Skeleton
  style={{
    "--loam-skeleton-inline-size": "8rem",
    "--loam-skeleton-block-size": "8rem",
    "--loam-skeleton-radius": "var(--loam-radius-lg)",
  }}
/>`,
      render: () => (
        <Skeleton
          style={
            {
              "--loam-skeleton-inline-size": "8rem",
              "--loam-skeleton-block-size": "8rem",
              "--loam-skeleton-radius": "var(--loam-radius-lg)",
            } as CSSProperties
          }
        />
      ),
    },
    {
      title: "Wrap real content",
      description:
        "Wrapped children size the box, so the placeholder matches the coming layout with no size props; flip visible when the data lands.",
      code: `<Skeleton visible={loading}>
  <Avatar.Root role="img" aria-label="Ada Lovelace"><Avatar.Fallback>AL</Avatar.Fallback></Avatar.Root>
</Skeleton>`,
      render: () => <SkeletonSwapDemo />,
    },
  ],
  whenToUse: [
    "While loading content whose shape you already know: the skeleton mirrors the coming layout, so the swap to real content is a fill-in, not a rearrangement.",
    "To hold the loaded content's space open and avoid layout shift while data arrives.",
  ],
  whenNotToUse: [
    "When you cannot predict what the loaded layout looks like. A skeleton that does not match what replaces it makes the swap more jarring than showing nothing, and perceived performance gets worse, not better. Use Loader.",
    "For an operation that is not producing visible content in that spot (saving, deleting, background work). A skeleton promises content that never comes; use Loader next to the affected control.",
  ],
  howItWorks: [
    {
      title: "Match the shape you are loading",
      body: "Build the skeleton from the loaded UI's real dimensions: the avatar's diameter, the text's line heights, the thumbnail's radius. The entire benefit of a skeleton is that the eye has already parsed the layout before the content lands; a placeholder of a different shape spends that benefit and charges interest.",
    },
    {
      title: "Swap in place with visible",
      body: "Wrap the real content and flip visible to false when it is ready. The wrapped children size the placeholder themselves, so it mirrors the coming layout without declared dimensions; the public custom properties exist for bare placeholders, where the absent content cannot be measured. While the skeleton is visible, children are hidden from pointer, selection and assistive tech, so nothing half-loaded leaks out.",
    },
    {
      title: "Say the region is busy",
      body: 'Skeletons are silent, so the region they fill should not be. Put aria-busy="true" on the region while its skeletons show and remove it when the content lands: assistive technology then knows the region is being updated rather than empty, and can hold announcements until it settles. A wait that needs announcing gets a Loader or a visually hidden status message beside the region.',
    },
  ],
  accessibility: [
    "The root renders aria-hidden: skeletons are never announced. Screen-reader users hear the real content when it arrives instead of a stream of meaningless placeholders. Mark the region they fill aria-busy while they show.",
    'Because skeletons are silent, announce the wait elsewhere if it needs announcing: a Loader (which renders role="status") or a visually hidden status message.',
    "The moving shimmer is gated behind prefers-reduced-motion: no-preference. Reduced-motion users get the same placeholder with a static gradient, with no override needed because the motion is opt-in.",
    "While visible, wrapped children keep their layout but paint nothing (visibility: hidden inherits through the whole subtree) and are unreachable by pointer and text selection, so nothing interactive is exposed before it is real.",
  ],
  props: [
    {
      name: "visible",
      type: "boolean",
      default: "true",
      description: "When false, render children instead of the placeholder.",
    },
    {
      name: "children",
      type: "ReactNode",
      description: "Real content, shown once visible is false.",
    },
    {
      name: "...others",
      type: "HTMLAttributes<HTMLDivElement>",
      description: "All native <div> props are forwarded.",
    },
  ],
  cssProps: [
    {
      name: "--loam-skeleton-inline-size",
      syntax: "CSS length",
      default: "100% (bare), fit-content (wrapped)",
      description: "Inline size of a bare placeholder, where there is no content to measure.",
    },
    {
      name: "--loam-skeleton-block-size",
      syntax: "CSS length",
      default: "1lh (bare), auto (wrapped)",
      description: "Block size of a bare placeholder.",
    },
    {
      name: "--loam-skeleton-radius",
      syntax: "CSS length",
      default: "var(--loam-radius-md); var(--loam-radius-full) around an Avatar",
      description: "Corner rounding of the placeholder; set per instance or on a region.",
    },
  ],
};

export default doc;
