import { CopyButton } from "@loamui/core";
import type { ComponentContent } from "@/renderer/types";
import { CopyButtonOnCopyDemo } from "./copy-button.client";
import { IconCopy } from "@tabler/icons-react";

const doc: ComponentContent = {
  slug: "copy-button",
  lead: "A Button that copies a string to the clipboard and says so.",
  importLine: `import { CopyButton } from "@loamui/core";`,
  demos: [
    {
      title: "Copy a command",
      description:
        "Click and the command is on the clipboard. The label reads Copied for a moment and a live region announces the same word, then the label reverts, so the button never claims a copy it made a while ago.",
      code: `<CopyButton value="pnpm add @loamui/core" />`,
      render: () => <CopyButton value="pnpm add @loamui/core" />,
    },
    {
      title: "Icon only",
      description:
        "An svg child is detected by Button as an icon, and the aria-label names the button and makes it square. The label swaps to Copied only when the button has visible text: an icon-only button keeps its icon and its name, and the confirmation is carried by the announcement alone, so pair it with a Tooltip or nearby text where a sighted user needs to see it.",
      code: `<CopyButton value="pnpm add @loamui/core" aria-label="Copy install command">
  <IconCopy aria-hidden />
</CopyButton>`,
      render: () => (
        <CopyButton value="pnpm add @loamui/core" aria-label="Copy install command">
          <IconCopy aria-hidden />
        </CopyButton>
      ),
    },
    {
      title: "Your own words",
      description:
        "The rest label is the children; the confirmation and the failure are labels.copied and labels.failed, so every word can be translated or made specific. The timeout decides how long the confirmation stands.",
      code: `<CopyButton
  value="https://loamui.dev/docs/components/copy-button"
  labels={{
    copied: "Link copied",
    failed: "The link could not be copied: select it and copy it yourself",
  }}
  timeout={3000}
>
  Copy link
</CopyButton>`,
      render: () => (
        <CopyButton
          value="https://loamui.dev/docs/components/copy-button"
          labels={{
            copied: "Link copied",
            failed: "The link could not be copied: select it and copy it yourself",
          }}
          timeout={3000}
        >
          Copy link
        </CopyButton>
      ),
    },
    {
      title: "After a copy",
      description:
        "onCopy is called with the value once it is on the clipboard, and not on failure, so anything that depends on the copy having happened (a note, a step marked done) runs only when it did.",
      code: `const [copied, setCopied] = useState<string | null>(null);

<CopyButton value="LOAM-4F7K-2Q9X" onCopy={setCopied}>
  Copy code
</CopyButton>
<p>{copied ? \`On the clipboard: \${copied}\` : "Nothing copied yet."}</p>`,
      render: () => <CopyButtonOnCopyDemo />,
    },
  ],
  whenToUse: [
    "To put a short string on the clipboard in one action: an install command, a link, a token, an id, a code sample.",
    "Next to text the reader would otherwise have to select precisely, especially where selection is awkward (a code block, a table cell, a value on a touch screen).",
  ],
  whenNotToUse: [
    "For a whole document or a large export: that is a download (a link to the file), not a clipboard write.",
    "To share something with another app or person: that is navigator.share and a different button, with its own sheet and its own wording.",
  ],
  howItWorks: [
    {
      title: "The announcement is the feedback",
      body: 'A label that changes from Copy to Copied is invisible to a screen reader, whose focus is sitting on the button it already named. So the same words go into a visually hidden role="status" region, which is polite: it is read after whatever is being read now, without moving focus. The region is in the DOM from the start, since a live region only announces a change, and it empties again after the timeout so the next copy is a change too.',
    },
    {
      title: "The label reverts so the button stays honest",
      body: "Copied is a confirmation, not a state: the clipboard can be overwritten by anything at any time, so a button that kept saying Copied would soon be wrong. The label goes back after the timeout, and there is no aria-pressed, because nothing is toggled. The default of 1.5 seconds is long enough to be read and short enough that a second copy does not have to wait for it.",
    },
    {
      title: "Failure is said, not swallowed",
      body: "The clipboard can refuse: there is no API on an insecure origin, the permission can be denied, and the document may not have focus. There is no selection to fall back on, so the button announces what happened and what to do (select the text and copy it yourself) through the same region, and leaves its label alone. A click that silently did nothing would leave the reader believing the value was copied.",
    },
  ],
  accessibility: [
    "Renders a real Button, so focus, Enter and Space, and the button role come from the platform; every Button prop is forwarded, and an icon-only version needs an aria-label like any other icon-only button.",
    'Success and failure are announced through a visually hidden role="status" region, so a screen reader hears the outcome without focus moving or a dialog opening.',
    "The confirmation is words, not colour or an icon alone: the visible label and the announcement carry the same text, and both revert.",
  ],
  props: [
    {
      name: "value",
      type: "string",
      description: "The text written to the clipboard.",
    },
    {
      name: "children",
      type: "ReactNode",
      default: `"Copy"`,
      description: "The label at rest. An svg child is detected by Button as an icon.",
    },
    {
      name: "labels",
      type: "{ copied?: ReactNode; failed?: ReactNode }",
      default: `{ copied: "Copied", failed: "Copy failed: select the text and copy it yourself" }`,
      description:
        "The words the button says: copied is shown, and announced, after a successful copy; failed is announced when the clipboard refuses, and the label is left as it was.",
    },
    {
      name: "timeout",
      type: "number",
      default: "1500",
      description: "How long the copied label and the announcement stand, in ms.",
    },
    {
      name: "onCopy",
      type: "(value: string) => void",
      description:
        "Called with the value once it is on the clipboard. Replaces the native onCopy event, which fires on copying a selection a button never holds.",
    },
    {
      name: "...others",
      type: "ButtonProps",
      description:
        "Every Button prop is forwarded, including className, style, ref and aria-label.",
    },
  ],
  contextual: true,
};

export default doc;
