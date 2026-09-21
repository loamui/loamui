"use client";

import { useId } from "react";
import { Button, Field, Input, Select, Textarea } from "@loamui/core";
import "./recipe.css";

export default function Recipe() {
  const instanceId = useId();
  return (
    <form
      className="contact-form"
      action="/contact"
      method="post"
      aria-labelledby={`${instanceId}-contact-form-title`}
    >
      <div className="intro">
        <h2 id={`${instanceId}-contact-form-title`}>Get in touch</h2>
        <p>
          The nursery answers email on Tuesdays and Fridays. For an order that has already been
          posted, include the order number.
        </p>
      </div>
      <Field.Root>
        <Field.Label>Full name</Field.Label>
        <Input name="name" autoComplete="name" required />
      </Field.Root>
      <Field.Root>
        <Field.Label>Email address</Field.Label>
        <Field.Description>Only used to reply.</Field.Description>
        <Input name="email" type="email" autoComplete="email" inputMode="email" required />
      </Field.Root>
      <Field.Root>
        <Field.Label>What is it about?</Field.Label>
        <Select.Root name="subject" required>
          <Select.Option value="" disabled>
            Choose a subject
          </Select.Option>
          <Select.Option value="order">An order</Select.Option>
          <Select.Option value="seed">Seed availability</Select.Option>
          <Select.Option value="membership">Membership</Select.Option>
          <Select.Option value="trade">Trade orders</Select.Option>
          <Select.Option value="other">Something else</Select.Option>
        </Select.Root>
      </Field.Root>
      <Field.Root>
        <Field.Label>Message</Field.Label>
        <Textarea name="message" rows={5} required />
      </Field.Root>
      <div className="actions">
        <Button type="submit">Send message</Button>
      </div>
    </form>
  );
}
