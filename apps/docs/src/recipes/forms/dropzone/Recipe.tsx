"use client";

import { useState } from "react";
import { Field, FileInput } from "@loamui/core";
import "./recipe.css";

const LIMIT = 10_000_000;
const MOST = 5;

const megabytes = new Intl.NumberFormat("en-GB", {
  style: "unit",
  unit: "megabyte",
  maximumFractionDigits: 1,
});

/** What is wrong with a choice, in words, or nothing. */
function problem(files: File[]): string | null {
  if (files.length > MOST) return `Choose ${MOST} photos at most: ${files.length} were chosen`;
  const unsupported = files.find((file) => !["image/jpeg", "image/png"].includes(file.type));
  if (unsupported) return `${unsupported.name} is not a supported photo. Choose a JPEG or PNG file`;
  const big = files.find((file) => file.size > LIMIT);
  if (big) {
    return `${big.name} is ${megabytes.format(big.size / 1_000_000)}. Each photo must be 10 MB or smaller: choose a smaller copy`;
  }
  return null;
}

export default function Recipe() {
  const [error, setError] = useState<string | null>(null);

  return (
    <Field.Root invalid={Boolean(error)} className="dropzone">
      <Field.Label>Plot photos</Field.Label>
      <Field.Description>JPEG or PNG, up to 10 MB each, five at most.</Field.Description>
      <Field.Error>{error}</Field.Error>
      <FileInput.Root>
        <FileInput.Control
          name="photos"
          accept="image/jpeg,image/png"
          multiple
          onChange={(event) => {
            const input = event.currentTarget;
            const found = problem(Array.from(input.files ?? []));
            setError(found);
            // A refused choice is cleared, so the form cannot post it.
            if (found) input.value = "";
          }}
        />
        <FileInput.Prompt>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M4 16.5V18a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1.5" />
            <path d="M12 4v11M7.5 8.5 12 4l4.5 4.5" />
          </svg>
          <strong>Drop photos here</strong>
          <span>or choose files</span>
        </FileInput.Prompt>
        <FileInput.Files locale="en-GB" />
      </FileInput.Root>
    </Field.Root>
  );
}
