"use client";

import { Field, Search } from "@loamui/core";
import { IconSearch } from "@tabler/icons-react";

export function SearchSiteDemo() {
  return (
    <header
      style={{
        alignItems: "center",
        display: "flex",
        gap: "var(--loam-space-s)",
        inlineSize: "100%",
        justifyContent: "space-between",
      }}
    >
      <strong>Loam</strong>
      <Search.Root style={{ inlineSize: "min(20rem, 100%)" }}>
        <Search.Label>Search this site</Search.Label>
        <Search.Input />
        <Search.Button />
      </Search.Root>
    </header>
  );
}

export function SearchIconDemo() {
  return (
    <Search.Root style={{ inlineSize: "min(20rem, 100%)" }}>
      <Search.Label>Search this site</Search.Label>
      <Search.Input />
      <Search.Button aria-label="Search">
        <IconSearch aria-hidden />
      </Search.Button>
    </Search.Root>
  );
}

export function SearchInFieldDemo() {
  return (
    <Search.Root aria-label="Search orders" style={{ inlineSize: "min(24rem, 100%)" }}>
      <Field.Root>
        <Field.Label>Order number</Field.Label>
        <Field.Description>The reference on your confirmation email.</Field.Description>
        <Search.Input name="order" />
      </Field.Root>
      <Search.Button>Find order</Search.Button>
    </Search.Root>
  );
}
