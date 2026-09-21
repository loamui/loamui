"use client";

import { useEffect, useState } from "react";
import { Combobox, Field, Loader } from "@loamui/core";
import "./recipe.css";

const SEED_LIST = [
  "Beetroot 'Boltardy'",
  "Broad bean 'Aquadulce Claudia'",
  "Carrot 'Autumn King'",
  "Climbing bean 'Cherokee Trail of Tears'",
  "Courgette 'Nero di Milano'",
  "Kale 'Nero di Toscana'",
  "Leek 'Musselburgh'",
  "Lettuce 'Little Gem'",
  "Pea 'Kelvedon Wonder'",
  "Radish 'French Breakfast'",
  "Squash 'Crown Prince'",
  "Tomato 'Gardener's Delight'",
];

/** Stands in for the request a real seed list answers; the delay is the point. */
function searchSeedList(text: string, signal: AbortSignal): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      const needle = text.toLowerCase();
      resolve(SEED_LIST.filter((name) => name.toLowerCase().includes(needle)));
    }, 600);
    signal.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(signal.reason);
    });
  });
}

export default function Recipe() {
  const [query, setQuery] = useState("");
  const [chosen, setChosen] = useState<string | null>(null);
  const [matches, setMatches] = useState<string[] | null>(null);
  const [searching, setSearching] = useState(false);

  // Every change of text starts a search and abandons the one before it, so
  // a slow answer never lands on top of a newer question; choosing an option
  // writes its name into the box, which is not a new question.
  useEffect(() => {
    const text = query.trim();
    if (text === "") {
      setMatches(null);
      setSearching(false);
      return;
    }
    if (text === chosen) {
      setSearching(false);
      return;
    }
    const controller = new AbortController();
    setSearching(true);
    searchSeedList(text, controller.signal).then(
      (found) => {
        setMatches(found);
        setSearching(false);
      },
      () => {},
    );
    return () => controller.abort();
  }, [query, chosen]);

  const status = searching
    ? "Searching the seed list…"
    : query.trim() === chosen
      ? `${chosen} selected.`
      : matches === null
        ? ""
        : matches.length === 0
          ? "Nothing in the seed list matches."
          : matches.length === 1
            ? "1 variety matches."
            : `${matches.length} varieties match.`;

  return (
    <Field.Root className="autocomplete-async">
      <Field.Label>Variety</Field.Label>
      <Field.Description>Start typing a crop or a variety name.</Field.Description>
      <Combobox.Root
        name="variety"
        inputValue={query}
        onInputValueChange={setQuery}
        onValueChange={setChosen}
        labels={{
          // Read from the answer, not the list's own count, which registers
          // a render after the options mount.
          status: () => status,
          empty: "No varieties match",
        }}
      >
        <Combobox.Input autoCapitalize="none" spellCheck={false} />
        {searching && <Loader aria-hidden="true" />}
        <Combobox.List>
          {matches?.map((name) => (
            <Combobox.Option key={name} value={name}>
              {name}
            </Combobox.Option>
          ))}
          <Combobox.Empty>
            {searching
              ? "Searching…"
              : matches === null
                ? "Type to search the seed list"
                : undefined}
          </Combobox.Empty>
        </Combobox.List>
      </Combobox.Root>
      <p className="status">{status}</p>
    </Field.Root>
  );
}
