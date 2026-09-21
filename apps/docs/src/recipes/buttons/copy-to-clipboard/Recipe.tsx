"use client";

import { CopyButton, Field, Input } from "@loamui/core";
import "./recipe.css";

const LINK = "https://hedgerow.example/join/ivy-b14";

export default function Recipe() {
  return (
    <Field.Root className="copy-to-clipboard">
      <Field.Label>Your referral link</Field.Label>
      <Field.Description>
        A friend who joins with it gets a free packet of seed, and so do you.
      </Field.Description>
      <div className="row">
        <Input
          readOnly
          value={LINK}
          spellCheck={false}
          onFocus={(event) => event.currentTarget.select()}
        />
        <CopyButton value={LINK} labels={{ copied: "Copied" }}>
          Copy link
        </CopyButton>
      </div>
    </Field.Root>
  );
}
