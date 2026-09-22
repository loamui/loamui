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
