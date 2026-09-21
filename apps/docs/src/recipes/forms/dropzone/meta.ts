import type { RecipeMeta } from "@/recipes/types";

export const meta: RecipeMeta = {
  title: "Dropzone",
  description:
    "A box for plot photos that takes a drop or a click, says which types and sizes it accepts in words, lists what was chosen, and refuses a choice it cannot post, naming the file.",
  category: "forms",
  uses: ["Field", "FileInput"],
  integration:
    "This example checks file count, declared MIME type and size for immediate feedback. Supply an upload endpoint that validates the actual file content and limits independently before storing it.",
  notes: {
    modern:
      'The control is a native <input type="file"> with accept and multiple: a dropped file lands in the same input, so the form posts it like a picked one, and the accept list filters the picker; a refused choice is cleared from the input, so the form cannot post what the message said no to. The drag state is core’s data-dragging on the box, painted in the -strong border that holds 3:1 in every context, and the example styles only the icon and the two lines it puts inside the prompt.',
    accessible:
      "The limits are in the description, joined to the input by aria-describedby, before any choice is made; a refused choice is an alert that explains the failed constraint and says what to do. The list of chosen files is a polite live region core keeps in the page from the start, so the choice is announced as well as shown, and the input stays focusable inside the box the prompt draws.",
  },
  composition:
    "Field.Root with FileInput.Root, Control, Prompt and Files as core ships them; the prompt's children are the example's, and the type, size and count limits are one function from the chosen files to words, rendered as the Field's error.",
  tags: ["file", "upload", "dropzone", "drag and drop", "photos", "size limit"],
  order: 22,
};
