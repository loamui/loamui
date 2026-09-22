---
title: Contact us with details
description: A short enquiry form alongside the nursery's email, phone number, address and opening hours.
---

> LoamUI documentation, generated from the same source as the live page —
> treat it as authoritative for `@loamui/core`.

# Contact us with details

A short enquiry form alongside the nursery's email, phone number, address and opening hours.

A recipe in **Forms**: a component and a stylesheet built from `@loamui/core`, to copy into a project and change. Both files are below, exactly as the live preview renders them.

- Uses: `Button`, `ErrorSummary`, `Field`, `Input`, `Textarea`
- Tags: contact, enquiry, address, form, support
- Live: https://loamui.com/recipes/forms/contact-us-with-details

## Using this recipe

Copy both files side by side into your React framework project. Install `@loamui/core` and load the core stylesheet at the application root, following the framework-specific installation guide.

Replace the sample contact details and pass action for your POST endpoint; the default is /contact. Validate on the server and deliver or durably queue the message before confirming it. On failure, render a fresh Example with initialResponse: { status: 'error', values: { email, message }, errors: { form: 'We could not send your message. Please try again.' } }. Use errors.email and errors.message for field-specific validation; a service failure belongs in errors.form. Values are restored and the error summary receives focus after hydration. After confirmed success, redirect to a confirmation page rendering Example with initialResponse: { status: 'sent' }; its confirmation replaces the form, explains when a reply is due and receives focus after hydration. initialResponse initializes each new server response; it is not an asynchronous update to a mounted form. Give the response page an Error: title prefix on failure or a Message sent title on success. Native POST and validation remain usable without JavaScript. No message is sent by this recipe alone.

## When to use

Use when people should be able to choose between sending a message and contacting you directly. State when replies are handled so they can decide whether another contact method is more suitable.

## Design decisions

These notes explain the design. The included tests cover structure and selected interactions; check contrast, keyboard behavior and assistive technology support in your application.

- **Modern.** An address and description list pair each contact method with its value, email and phone links use mailto: and tel:, and the native POST form uses required fields, email validation and autocomplete; after hydration, native validity supplies the focused summary and inline messages, while a valid submission remains a normal POST. Layered donut scopes keep recipe styles local: an intrinsic auto-fit grid stacks the details and form when two columns cannot fit, padding and type tokens resolve inside the section’s container, the padding interpolation includes rem as well as cqi so it responds to enlarged root text, long labels and addresses can wrap, and headings inherit the element typography. The actions region declares --loam-context: primary for its Button, and shared surface, text and border tokens follow the colour scheme, so layout and sizing are supplied by the parent rather than configuration props.
- **Accessible.** Required fields use native required attributes and follow the unmarked-label convention. Error messages appear after an attempt and match the focused summary links; correcting a native constraint error removes its message and link without moving focus, while server errors remain until another attempt; useId keeps repeated forms independent. Failed responses preserve entered values. Confirmed delivery replaces the form with a focused heading and next steps. Decorative icons repeat visible terms and are hidden from assistive technology. Email and telephone values retain left-to-right ordering in RTL pages. Text and DOM order stay intact when the grid stacks, and real borders preserve surface boundaries in forced colours.

## References

- [Installation](https://loamui.com/docs/installation.md)
- [Tokens](https://loamui.com/docs/tokens.md)
- [Element styles](https://loamui.com/docs/element-styles.md)
- [Button](https://loamui.com/docs/components/button.md)
- [ErrorSummary](https://loamui.com/docs/components/error-summary.md)
- [Field](https://loamui.com/docs/components/field.md)
- [Input](https://loamui.com/docs/components/input.md)
- [Textarea](https://loamui.com/docs/components/textarea.md)

## Recipe.tsx

```tsx
"use client";

import { useCallback, useId, useState, type FormEvent } from "react";
import { Button, ErrorSummary, Field, Input, Textarea } from "@loamui/core";
import "./recipe.css";

type ContactResponse =
  | { status: "sent" }
  | {
      status: "error";
      values: { email: string; message: string };
      errors: { email?: string; message?: string; form?: string };
    };

export default function Recipe({
  action = "/contact",
  initialResponse,
}: {
  action?: string;
  initialResponse?: ContactResponse;
}) {
  const id = useId();
  const failure = initialResponse?.status === "error" ? initialResponse : undefined;
  const [validation, setValidation] = useState({
    email: failure?.errors.email ?? "",
    message: failure?.errors.message ?? "",
    form: failure?.errors.form ?? "",
    attempt: 0,
  });
  const focusConfirmation = useCallback((heading: HTMLHeadingElement | null) => {
    heading?.focus();
  }, []);

  function handleValidation(event: FormEvent<HTMLFormElement>) {
    const fields = event.currentTarget.elements;
    const email = fields.namedItem("email") as HTMLInputElement;
    const message = fields.namedItem("message") as HTMLTextAreaElement;
    const emailError = email.validity.valueMissing
      ? "Enter your email address"
      : email.validity.typeMismatch
        ? "Enter an email address in the correct format, like name@example.com"
        : "";
    const messageError = message.validity.valueMissing ? "Enter your message" : "";

    if (emailError || messageError) event.preventDefault();
    setValidation((previous) => ({
      email: emailError,
      message: messageError,
      form: "",
      attempt: previous.attempt + 1,
    }));
  }

  function handleCorrection(event: FormEvent<HTMLFormElement>) {
    const control = event.target;
    if (!(control instanceof HTMLInputElement || control instanceof HTMLTextAreaElement)) return;
    if (!control.validity.valid) return;
    const { name } = control;
    if (name !== "email" && name !== "message") return;
    setValidation((previous) =>
      previous.attempt > 0 && previous[name] ? { ...previous, [name]: "" } : previous,
    );
  }

  return (
    <section className="contact-us-with-details">
      <div>
        <div className="details">
          <h2>Contact us</h2>
          <p>
            Ask about an order, a variety, or a place on a workshop. The nursery answers email on
            Tuesdays and Fridays.
          </p>
          <address>
            <dl>
              <div>
                <dt>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m3 7 9 6 9-6" />
                  </svg>
                  Email
                </dt>
                <dd>
                  <a href="mailto:hello@hedgerow.coop" dir="ltr">
                    hello@hedgerow.coop
                  </a>
                </dd>
              </div>
              <div>
                <dt>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
                  </svg>
                  Phone
                </dt>
                <dd>
                  <a href="tel:+441588640210" dir="ltr">
                    01588 640210
                  </a>
                </dd>
              </div>
              <div>
                <dt>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11Z" />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>
                  Nursery
                </dt>
                <dd>Bury Ditches Lane, Clun, Shropshire SY7 8JQ</dd>
              </div>
              <div>
                <dt>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" />
                  </svg>
                  Open
                </dt>
                <dd>Wednesday to Sunday, 10am to 4pm</dd>
              </div>
            </dl>
          </address>
        </div>
        {initialResponse?.status === "sent" ? (
          <div className="confirmation">
            <h3 ref={focusConfirmation} tabIndex={-1}>
              Message sent
            </h3>
            <p>
              Thank you for contacting the nursery. We’ll reply on our next email day: Tuesday or
              Friday.
            </p>
            <p>You do not need to send your message again.</p>
            <a href="/">Return to the nursery homepage</a>
          </div>
        ) : (
          <form
            action={action}
            method="post"
            aria-labelledby={`${id}-title`}
            onInvalid={handleValidation}
            onSubmit={handleValidation}
            onInput={handleCorrection}
          >
            <h3 id={`${id}-title`}>Send a message</h3>
            {(validation.email || validation.message || validation.form) && (
              <ErrorSummary.Root key={validation.attempt}>
                <ErrorSummary.Title aria-level={4} />
                {validation.form && <p>{validation.form}</p>}
                {(validation.email || validation.message) && (
                  <ErrorSummary.List>
                    {validation.email && (
                      <ErrorSummary.Item href={`#${id}-email`}>
                        {validation.email}
                      </ErrorSummary.Item>
                    )}
                    {validation.message && (
                      <ErrorSummary.Item href={`#${id}-message`}>
                        {validation.message}
                      </ErrorSummary.Item>
                    )}
                  </ErrorSummary.List>
                )}
              </ErrorSummary.Root>
            )}
            <Field.Root invalid={Boolean(validation.email && validation.email)} id={`${id}-email`}>
              <Field.Label>Email address</Field.Label>
              <Field.Description>We’ll reply to this address.</Field.Description>
              {validation.email && <Field.Error>{validation.email}</Field.Error>}
              <Input
                name="email"
                defaultValue={failure?.values.email}
                type="email"
                dir="ltr"
                autoComplete="email"
                autoCapitalize="none"
                spellCheck={false}
                inputMode="email"
                required
              />
            </Field.Root>
            <Field.Root
              invalid={Boolean(validation.message && validation.message)}
              id={`${id}-message`}
            >
              <Field.Label>Message</Field.Label>
              {validation.message && <Field.Error>{validation.message}</Field.Error>}
              <Textarea name="message" defaultValue={failure?.values.message} rows={5} required />
            </Field.Root>
            <div className="actions">
              <Button type="submit">Send message</Button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
```

## recipe.css

```css
@scope (.contact-us-with-details) to ([class*="loam-"]) {
  @layer loamui.components {
    h2,
    h3,
    p,
    dl,
    dd {
      margin-block: 0;
    }

    div.details {
      display: block grid;
      gap: var(--loam-space-xs);
      min-inline-size: 0;
      overflow-wrap: anywhere;

      > p {
        color: var(--loam-color-fg-muted);
        max-inline-size: var(--loam-measure);
      }
    }

    address {
      font-style: normal;
    }

    dl {
      display: block grid;
      gap: var(--loam-space-xs);

      > div {
        display: block grid;
        gap: var(--loam-space-3xs);
      }
    }

    dt {
      align-items: center;
      color: var(--loam-color-fg-muted);
      display: block flex;
      font-size: var(--loam-text-sm);
      gap: var(--loam-space-3xs);

      svg {
        block-size: 1em;
        flex: none;
        inline-size: 1em;
      }
    }

    dd {
      margin-inline: 0;
    }

    form,
    div.confirmation {
      align-content: start;
      display: block grid;
      gap: var(--loam-space-s);
      grid-template-columns: minmax(0, 1fr);
      overflow-wrap: anywhere;
    }

    div.actions {
      --loam-context: primary;

      display: block grid;
    }

    :scope {
      container-type: inline-size;
      inline-size: 100%;

      > div {
        align-items: start;
        background: var(--loam-color-surface);
        border: 1px solid var(--loam-color-line);
        border-radius: var(--loam-radius-xl);
        display: block grid;
        font-size: var(--loam-text-md);
        gap: var(--loam-space-l);
        grid-template-columns: repeat(auto-fit, minmax(min(100%, 21rem), 1fr));
        padding: clamp(var(--loam-space-xs), 0.5rem + 2cqi, var(--loam-space-l));
      }
    }
  }
}
```

