import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Contact us with details",
  description:
    "A short enquiry form alongside the nursery's email, phone number, address and opening hours.",
  whenToUse:
    "Use when people should be able to choose between sending a message and contacting you directly. State when replies are handled so they can decide whether another contact method is more suitable.",
  integration:
    "Replace the sample contact details and pass action for your POST endpoint; the default is /contact. Validate on the server and deliver or durably queue the message before confirming it. On failure, render a fresh Example with initialResponse: { status: 'error', values: { email, message }, errors: { form: 'We could not send your message. Please try again.' } }. Use errors.email and errors.message for field-specific validation; a service failure belongs in errors.form. Values are restored and the error summary receives focus after hydration. After confirmed success, redirect to a confirmation page rendering Example with initialResponse: { status: 'sent' }; its confirmation replaces the form, explains when a reply is due and receives focus after hydration. initialResponse initializes each new server response; it is not an asynchronous update to a mounted form. Give the response page an Error: title prefix on failure or a Message sent title on success. Native POST and validation remain usable without JavaScript. No message is sent by this recipe alone.",
  category: "forms",
  uses: ["Button", "ErrorSummary", "Field", "Input", "Textarea"],
  notes: {
    modern:
      "An address and description list pair each contact method with its value, email and phone links use mailto: and tel:, and the native POST form uses required fields, email validation and autocomplete; after hydration, native validity supplies the focused summary and inline messages, while a valid submission remains a normal POST. Layered donut scopes keep recipe styles local: an intrinsic auto-fit grid stacks the details and form when two columns cannot fit, padding and type tokens resolve inside the section’s container, the padding interpolation includes rem as well as cqi so it responds to enlarged root text, long labels and addresses can wrap, and headings inherit the element typography. The actions region declares --loam-context: primary for its Button, and shared surface, text and border tokens follow the colour scheme, so layout and sizing are supplied by the parent rather than configuration props.",
    accessible:
      "Required fields use native required attributes and follow the unmarked-label convention. Error messages appear after an attempt and match the focused summary links; correcting a native constraint error removes its message and link without moving focus, while server errors remain until another attempt; useId keeps repeated forms independent. Failed responses preserve entered values. Confirmed delivery replaces the form with a focused heading and next steps. Decorative icons repeat visible terms and are hidden from assistive technology. Email and telephone values retain left-to-right ordering in RTL pages. Text and DOM order stay intact when the grid stacks, and real borders preserve surface boundaries in forced colours.",
  },
  composition:
    "The section supplies one shared surface around the details and native form. Field wires labels, descriptions and errors; ErrorSummary links focus their controls. Input, Textarea and Button keep their own styles. General server failures do not mark valid fields invalid. Avoiding nested padded surfaces leaves room for the form at narrow widths and enlarged text sizes.",
  tags: ["contact", "enquiry", "address", "form", "support"],
  order: 2,
};
