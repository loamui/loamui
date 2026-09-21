"use client";

import { Button, Field, Input } from "@loamui/core";
import "./recipe.css";

export default function Recipe() {
  return (
    <form className="input-with-button" action="/newsletter" method="post">
      <Field.Root>
        <Field.Label>Email address</Field.Label>
        <Field.Description>
          Sowing notes once a month. Unsubscribe from any issue.
        </Field.Description>
        <div className="row">
          <Input type="email" name="email" autoComplete="email" inputMode="email" required />
          <div className="action">
            <Button type="submit">Subscribe</Button>
          </div>
        </div>
      </Field.Root>
    </form>
  );
}
