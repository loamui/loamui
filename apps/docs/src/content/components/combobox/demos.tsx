"use client";

import { useState } from "react";
import { Button, Combobox, Field } from "@loamui/core";

const COUNTRIES = [
  "Australia",
  "Austria",
  "Belgium",
  "Brazil",
  "Canada",
  "Chile",
  "Denmark",
  "Finland",
  "France",
  "Germany",
  "Ireland",
  "Italy",
  "Japan",
  "Netherlands",
  "New Zealand",
  "Norway",
  "Portugal",
  "Spain",
  "Sweden",
  "United Kingdom",
];

function matches(query: string, from: string[] = COUNTRIES): string[] {
  const q = query.trim().toLowerCase();
  return from.filter((c) => c.toLowerCase().includes(q));
}

export function ComboboxBasicDemo() {
  const [query, setQuery] = useState("");
  return (
    <div style={{ maxInlineSize: "20rem", inlineSize: "100%" }}>
      <Field.Root>
        <Field.Label>Country</Field.Label>
        <Combobox.Root inputValue={query} onInputValueChange={setQuery}>
          <Combobox.Input />
          <Combobox.List>
            {matches(query).map((c) => (
              <Combobox.Option key={c} value={c}>
                {c}
              </Combobox.Option>
            ))}
            <Combobox.Empty />
          </Combobox.List>
        </Combobox.Root>
      </Field.Root>
    </div>
  );
}

export function ComboboxTriggerDemo() {
  const [query, setQuery] = useState("");
  return (
    <div style={{ maxInlineSize: "20rem", inlineSize: "100%" }}>
      <Field.Root>
        <Field.Label>Country</Field.Label>
        <Combobox.Root inputValue={query} onInputValueChange={setQuery}>
          <Combobox.Input />
          <Combobox.Trigger />
          <Combobox.List>
            {matches(query).map((c) => (
              <Combobox.Option key={c} value={c}>
                {c}
              </Combobox.Option>
            ))}
            <Combobox.Empty />
          </Combobox.List>
        </Combobox.Root>
      </Field.Root>
    </div>
  );
}

const PLANS = ["Free", "Team", "Business", "Enterprise"];

export function ComboboxDisabledDemo() {
  const [query, setQuery] = useState("");
  return (
    <div style={{ maxInlineSize: "20rem", inlineSize: "100%" }}>
      <Field.Root>
        <Field.Label>Plan</Field.Label>
        <Combobox.Root inputValue={query} onInputValueChange={setQuery}>
          <Combobox.Input />
          <Combobox.Trigger />
          <Combobox.List>
            {matches(query, PLANS).map((p) => (
              <Combobox.Option key={p} value={p.toLowerCase()} disabled={p === "Enterprise"}>
                {p}
              </Combobox.Option>
            ))}
            <Combobox.Empty />
          </Combobox.List>
        </Combobox.Root>
      </Field.Root>
    </div>
  );
}

export function ComboboxFieldDemo() {
  const [query, setQuery] = useState("");
  return (
    <div style={{ maxInlineSize: "20rem", inlineSize: "100%" }}>
      <Field.Root invalid>
        <Field.Label>Country</Field.Label>
        <Field.Description>Where you are resident for tax.</Field.Description>
        <Field.Error>Choose a country from the list</Field.Error>
        <Combobox.Root inputValue={query} onInputValueChange={setQuery}>
          <Combobox.Input />
          <Combobox.List>
            {matches(query).map((c) => (
              <Combobox.Option key={c} value={c}>
                {c}
              </Combobox.Option>
            ))}
            <Combobox.Empty />
          </Combobox.List>
        </Combobox.Root>
      </Field.Root>
    </div>
  );
}

export function ComboboxFormDemo() {
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState<string | null>(null);
  return (
    <form
      style={{
        display: "grid",
        gap: "var(--loam-space-xs)",
        inlineSize: "100%",
        maxInlineSize: "20rem",
      }}
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(String(new FormData(e.currentTarget).get("country") ?? ""));
      }}
    >
      <Field.Root>
        <Field.Label>Country</Field.Label>
        <Combobox.Root name="country" inputValue={query} onInputValueChange={setQuery}>
          <Combobox.Input />
          <Combobox.List>
            {matches(query).map((c) => (
              <Combobox.Option key={c} value={c}>
                {c}
              </Combobox.Option>
            ))}
            <Combobox.Empty />
          </Combobox.List>
        </Combobox.Root>
      </Field.Root>
      <Button type="submit">Save</Button>
      {submitted !== null && (
        <p role="status" style={{ margin: 0 }}>
          Submitted country: {submitted || "nothing"}
        </p>
      )}
    </form>
  );
}
