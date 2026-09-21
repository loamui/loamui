"use client";

import { Field, Input, Tooltip } from "@loamui/core";
import "./recipe.css";

export default function Recipe() {
  return (
    <Field.Root className="input-with-tooltip">
      <Field.Label>Plot reference</Field.Label>
      <div className="row">
        <Input name="plot" autoComplete="off" autoCapitalize="characters" />
        <Tooltip.Root>
          <Tooltip.Trigger>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 11v6M12 7.5v.5" />
            </svg>
            <span className="loam-VisuallyHidden">About the plot reference</span>
          </Tooltip.Trigger>
          <Tooltip.Popup>
            Printed on your gate tag and your membership card, like B-14.
            <Tooltip.Arrow />
          </Tooltip.Popup>
        </Tooltip.Root>
      </div>
    </Field.Root>
  );
}
