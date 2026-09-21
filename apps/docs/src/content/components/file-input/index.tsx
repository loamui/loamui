import type { ComponentContent } from "@/renderer/types";
import { Field, FileInput } from "@loamui/core";

export function FileInputOneDemo() {
  return (
    <div style={{ maxInlineSize: "24rem", inlineSize: "100%" }}>
      <Field.Root>
        <Field.Label>Passport scan</Field.Label>
        <Field.Description>PDF or PNG, up to 5 MB</Field.Description>
        <FileInput.Root>
          <FileInput.Control accept=".pdf,.png" />
          <FileInput.Prompt>Choose a file or drop it here</FileInput.Prompt>
          <FileInput.Files />
        </FileInput.Root>
      </Field.Root>
    </div>
  );
}

export function FileInputManyDemo() {
  return (
    <div style={{ maxInlineSize: "24rem", inlineSize: "100%" }}>
      <Field.Root>
        <Field.Label>Supporting documents</Field.Label>
        <Field.Description>PDF or PNG, up to 5 MB each</Field.Description>
        <FileInput.Root>
          <FileInput.Control accept=".pdf,.png" multiple />
          <FileInput.Prompt>Choose files or drop them here</FileInput.Prompt>
          <FileInput.Files />
        </FileInput.Root>
      </Field.Root>
    </div>
  );
}

export function FileInputDraggingDemo() {
  return (
    <div style={{ maxInlineSize: "24rem", inlineSize: "100%" }}>
      <Field.Root>
        <Field.Label>Passport scan</Field.Label>
        <Field.Description>PDF or PNG, up to 5 MB</Field.Description>
        <FileInput.Root data-dragging>
          <FileInput.Control accept=".pdf,.png" />
          <FileInput.Prompt>Choose a file or drop it here</FileInput.Prompt>
          <FileInput.Files />
        </FileInput.Root>
      </Field.Root>
    </div>
  );
}

export function FileInputErrorDemo() {
  return (
    <div style={{ maxInlineSize: "24rem", inlineSize: "100%" }}>
      <Field.Root invalid>
        <Field.Label>Passport scan</Field.Label>
        <Field.Description>PDF or PNG, up to 5 MB</Field.Description>
        <Field.Error>Choose a file smaller than 5 MB</Field.Error>
        <FileInput.Root>
          <FileInput.Control accept=".pdf,.png" />
          <FileInput.Prompt>Choose a file or drop it here</FileInput.Prompt>
          <FileInput.Files />
        </FileInput.Root>
      </Field.Root>
    </div>
  );
}

const doc: ComponentContent = {
  slug: "file-input",
  lead: "A file picker on the native file input: the box is its label, dropping a file is an enhancement, and the choice is announced.",
  importLine: `import { Field, FileInput } from "@loamui/core";`,
  demos: [
    {
      title: "One file",
      description:
        "Inside a Field the control reads its id from the field, so Field.Label and the Prompt both label the input. Click the box or press Enter on the input to open the picker; a file dropped on the box lands in the same input.",
      code: `<Field.Root>
  <Field.Label>Passport scan</Field.Label>
  <Field.Description>PDF or PNG, up to 5 MB</Field.Description>
  <FileInput.Root>
    <FileInput.Control accept=".pdf,.png" />
    <FileInput.Prompt>Choose a file or drop it here</FileInput.Prompt>
    <FileInput.Files />
  </FileInput.Root>
</Field.Root>`,
      render: () => <FileInputOneDemo />,
    },
    {
      title: "Several files",
      description:
        "multiple forwards to the native input: the picker allows a selection and a drop keeps every file. Without it a drop of several files keeps the first, as the picker would. Say in the prompt that more than one is welcome.",
      code: `<Field.Root>
  <Field.Label>Supporting documents</Field.Label>
  <Field.Description>PDF or PNG, up to 5 MB each</Field.Description>
  <FileInput.Root>
    <FileInput.Control accept=".pdf,.png" multiple />
    <FileInput.Prompt>Choose files or drop them here</FileInput.Prompt>
    <FileInput.Files />
  </FileInput.Root>
</Field.Root>`,
      render: () => <FileInputManyDemo />,
    },
    {
      title: "While a file is held over it",
      description:
        "The Root carries data-dragging while a drag with files is over the box, and the box answers with the primary line and a tinted surface; under forced colours it takes the system Highlight. The attribute is set by hand here so the state can be seen without a file in hand.",
      code: `<Field.Root>
  <Field.Label>Passport scan</Field.Label>
  <Field.Description>PDF or PNG, up to 5 MB</Field.Description>
  <FileInput.Root data-dragging>
    <FileInput.Control accept=".pdf,.png" />
    <FileInput.Prompt>Choose a file or drop it here</FileInput.Prompt>
    <FileInput.Files />
  </FileInput.Root>
</Field.Root>`,
      render: () => <FileInputDraggingDemo />,
    },
    {
      title: "With a size limit",
      description:
        "The browser enforces neither a size limit nor, for a dropped file, the accept list, so the limit is stated in the description and checked when the form is submitted. A Field.Error before the control marks it invalid and is announced; the message answers in the words of the question.",
      code: `<Field.Root invalid>
  <Field.Label>Passport scan</Field.Label>
  <Field.Description>PDF or PNG, up to 5 MB</Field.Description>
  <Field.Error>Choose a file smaller than 5 MB</Field.Error>
  <FileInput.Root>
    <FileInput.Control accept=".pdf,.png" />
    <FileInput.Prompt>Choose a file or drop it here</FileInput.Prompt>
    <FileInput.Files />
  </FileInput.Root>
</Field.Root>`,
      render: () => <FileInputErrorDemo />,
    },
  ],
  whenToUse: [
    "When the answer to a question is a file the user already has: a scan of a document, a photo, a spreadsheet to import.",
    "Inside a Field.Root, so the label, the format-and-size description and any error are wired to the control by construction. See the Field page.",
  ],
  whenNotToUse: [
    "For a photo the user is expected to take now: the native picker on a phone already offers the camera, so keep the plain control rather than building a capture flow.",
    "For a large or long-running upload that needs progress and cancel: FileInput selects files; the application owns the transfer. Pair it with Progress, or hand the transfer to a dedicated uploader once the file is chosen.",
  ],
  howItWorks: [
    {
      title: "The input is the control, the box is its label",
      body: "There is no button pretending to be a file picker. The native input stays in the page, focusable and named, and the Prompt is a real label for it, so clicking anywhere on the box opens the picker and Tab reaches the input inside it. With scripting the native control is hidden from sight only; without it, the control shows in full with the browser's own file-name display.",
    },
    {
      title: "Dropping is an enhancement",
      body: "Dragging a file over the Root marks it (data-dragging) and dropping assigns the files to the same input, then fires change, so nothing downstream can tell a drop from a pick: the form submits the file, onChange runs, the list fills. A drag that carries no files is ignored, and a single-file control keeps the first file dropped, as its picker would.",
    },
    {
      title: "The list is the announcement",
      body: 'Files is a polite live region that is in the page before any choice is made, so when it fills the choice is read out ("passport.png, 12 kB") as well as shown, whether it came from the picker or a drop. A form reset empties it. It is a list, not a status line, so several files are read as several items.',
    },
  ],
  errors: [
    {
      situation: "No file was chosen",
      message: "Choose [whatever the label asks for]",
    },
    {
      situation: "The file is too large",
      message: "Choose a file smaller than [limit]",
    },
    {
      situation: "The file is the wrong type",
      message: "Choose a [PDF or PNG] file",
    },
  ],
  accessibility: [
    'Renders a real <input type="file">: the picker, the keyboard behaviour and the platform\'s own file-name display come from the browser, before and without JavaScript.',
    "The Prompt is a <label> for the input, so its text joins the accessible name and clicking it opens the picker; inside a Field, Field.Label names the control too, and Field.Description and Field.Error are linked via aria-describedby with Field.Root invalid setting aria-invalid.",
    "Inside a Root the native control wears the library's shared .loam-VisuallyHidden class, never display: none, so it keeps focus; the ring is drawn on the box with :has(input:focus-visible), and the dragging and error states move to system colours under forced colours. Outside a Root the control stays in view.",
  ],
  parts: [
    {
      name: "FileInput.Root",
      description:
        "The drop target, rendered as a <div>. Holds the selection for the Files part and carries data-dragging while a file is held over it.",
      props: [
        {
          name: "...others",
          type: "HTMLAttributes<HTMLDivElement>",
          description:
            "All native <div> props are forwarded; your drag handlers run before the drop wiring.",
        },
      ],
    },
    {
      name: "FileInput.Control",
      description:
        'The native <input type="file">. Inside a Field it reads its id, aria-describedby and aria-invalid from context, like Input; inside a Root it reports its selection to the list and is visually hidden, the Prompt being its box. On its own it is the plain native control, in view.',
      props: [
        {
          name: "accept",
          type: "string",
          description:
            'What the picker offers: extensions or MIME types (".pdf,.png", "image/*"). A dropped file is not filtered by it.',
        },
        {
          name: "multiple",
          type: "boolean",
          default: "false",
          description: "Allow more than one file, from the picker and from a drop.",
        },
        {
          name: "...others",
          type: "InputHTMLAttributes",
          description:
            "All native <input> props are forwarded (name, required, disabled, onChange, …), except type, size and value.",
        },
      ],
    },
    {
      name: "FileInput.Prompt",
      description:
        "The visible invitation, rendered as a <label> for the control: the dashed box. Its children are the text.",
    },
    {
      name: "FileInput.Files",
      description:
        'The chosen files by name and size, in a <ul aria-live="polite">. Render it even though it starts empty: a live region announces only changes it was present for.',
      props: [
        {
          name: "locale",
          type: "string",
          default: '"en"',
          description: "The BCP 47 locale the sizes are written in. Set it to the page's language.",
        },
      ],
    },
  ],
};

export default doc;
