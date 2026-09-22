import { Details } from "@loamui/core/details";

export function DetailsBasicDemo() {
  return (
    <div style={{ inlineSize: "100%", maxInlineSize: "30rem" }}>
      <Details.Root>
        <Details.Summary>Advanced options</Details.Summary>
        <Details.Content>Extra settings most people never need.</Details.Content>
      </Details.Root>
    </div>
  );
}

export function DetailsDefaultOpenDemo() {
  return (
    <div style={{ inlineSize: "100%", maxInlineSize: "30rem" }}>
      <Details.Root defaultOpen>
        <Details.Summary>Getting started</Details.Summary>
        <Details.Content>Create your workspace and invite your first teammate.</Details.Content>
      </Details.Root>
    </div>
  );
}

export function DetailsExclusiveDemo() {
  return (
    <div
      style={{
        display: "grid",
        gap: "var(--loam-space-2xs)",
        inlineSize: "100%",
        maxInlineSize: "30rem",
      }}
    >
      <Details.Root name="extras">
        <Details.Summary>Gift options</Details.Summary>
        <Details.Content>Add a gift message or hide prices on the packing slip.</Details.Content>
      </Details.Root>
      <Details.Root name="extras">
        <Details.Summary>Delivery instructions</Details.Summary>
        <Details.Content>Tell the courier where to leave the parcel.</Details.Content>
      </Details.Root>
      <Details.Root name="extras">
        <Details.Summary>Order notes</Details.Summary>
        <Details.Content>Anything else we should know about this order.</Details.Content>
      </Details.Root>
    </div>
  );
}
