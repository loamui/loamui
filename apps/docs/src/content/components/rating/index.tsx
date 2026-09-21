import { Rating } from "@loamui/core";
import { RatingLabelsDemo } from "./demos";
import type { CSSProperties } from "react";
import type { ComponentContent } from "@/renderer/types";

const doc: ComponentContent = {
  slug: "rating",
  lead: "Stars that are real inputs: a choice of one to five, or a picture of the average.",
  importLine: `import { Rating } from "@loamui/core";`,
  demos: [
    {
      title: "Rate this",
      description:
        "Five native radios, one under each star. Click or tap a star, or arrow through them from the keyboard; the stars up to the choice fill. Hovering previews a choice without making it.",
      code: `<Rating label="Rate this recipe" />`,
      render: () => <Rating label="Rate this recipe" />,
    },
    {
      title: "Prefilled",
      description:
        "An existing rating the user can change. Use defaultValue for a form the browser owns, or value with onValueChange to hold the number yourself, exactly as with RadioGroup.",
      code: `<Rating label="Rate this recipe" defaultValue={4} />`,
      render: () => <Rating label="Rate this recipe" defaultValue={4} />,
    },
    {
      title: "Read only",
      description:
        "readOnly turns the stars into a picture: no radios, no fieldset, one accessible name reading the value out of the maximum. Halves are drawn as half a star; the picture rounds to the nearest half and the name keeps the exact number.",
      code: `<Rating readOnly label="Average rating" value={3.5} />`,
      render: () => <Rating readOnly label="Average rating" value={3.5} />,
    },
    {
      title: "With a visible label",
      description:
        "The label is always in the accessibility tree; showLabel paints it beside the stars as well, for a form where no heading already says what is being rated. In display mode it does the same before the picture.",
      code: `<Rating label="Rate this recipe" showLabel defaultValue={2} />
<Rating readOnly label="Average rating" showLabel value={4} />`,
      render: () => (
        <div style={{ display: "grid", gap: "var(--loam-space-2xs)", justifyItems: "start" }}>
          <Rating label="Rate this recipe" showLabel defaultValue={2} />
          <Rating readOnly label="Average rating" showLabel value={4} />
        </div>
      ),
    },
    {
      title: "Your own words",
      description:
        'Each star announces as "3 stars" and the picture as "3.5 out of 5". labels replaces both: star names each input, value names the picture, so the group speaks another language or a different noun.',
      code: `<Rating
  label="Notez cette recette"
  labels={{
    star: (n) => \`\${n} \${n === 1 ? "étoile" : "étoiles"}\`,
    value: (v, max) => \`\${v} sur \${max}\`,
  }}
/>
<Rating
  readOnly
  label="Note moyenne"
  value={3.5}
  labels={{ value: (v, max) => \`\${v} sur \${max}\` }}
/>`,
      render: () => <RatingLabelsDemo />,
    },
    {
      title: "Disabled",
      description:
        "disabled goes to the fieldset, so every star greys out and none can be chosen; a screen reader hears the group as unavailable. required makes a choice a condition of submitting the form, reported by the browser in its own words.",
      code: `<Rating label="Rate this recipe" defaultValue={3} disabled />`,
      render: () => <Rating label="Rate this recipe" defaultValue={3} disabled />,
    },
    {
      title: "In a context",
      description:
        "Filled stars take the accent colour, the library's one chromatic flourish. There is no colour prop: declare --loam-context on a region and the stars follow, as every other control does.",
      code: `<div style={{ "--loam-context": "success" }}>
  <Rating readOnly label="Average rating" value={4} />
</div>`,
      render: () => (
        <div style={{ "--loam-context": "success" } as CSSProperties}>
          <Rating readOnly label="Average rating" value={4} />
        </div>
      ),
    },
  ],
  whenToUse: [
    "For a score on a short, ordered scale where the steps have no names of their own: one to five stars for a recipe, a product, a stay.",
    "To show an aggregate score beside the thing it describes, with readOnly, where a number alone would be slower to read than the picture.",
  ],
  whenNotToUse: [
    "For a single approval (like, favourite, bookmark): that is a toggle, so use a Checkbox or Switch, or a Button with aria-pressed.",
    "For a scale whose steps mean different things (three faces for sentiment, 'poor' to 'excellent'): that is a RadioGroup, with each option carrying its own label.",
  ],
  howItWorks: [
    {
      title: "Real radios, so keyboard and forms come free",
      body: "Each star is a native radio in a fieldset that shares one name. The browser supplies mutual exclusion, arrow keys that move the choice, Tab that lands on the chosen star, required validation and form submission. The component adds only the glyph and the paint; it holds no state of its own.",
    },
    {
      title: "Every star says what choosing it means",
      body: "The visible label of a star is a picture, so each radio carries a visually hidden name: '1 star', '2 stars' and so on. A screen reader announces the group by its label, then '3 stars, radio, 3 of 5', which is the whole choice in words. The group's label names what is being rated; keep it visually hidden when the surrounding heading already says so, and show it with showLabel when it does not.",
    },
    {
      title: "Display mode is decoration plus a number",
      body: "With readOnly the stars are not inputs and should not pretend to be: the glyphs are marked decorative and the group is one image named with the value, '3.5 out of 5'. Anyone who cannot see the stars gets the number, which is the fact they illustrate. The picture rounds to the nearest half star; the name does not.",
    },
  ],
  accessibility: [
    "Input mode renders a native <fieldset> with a <legend>, so the label names the group and every star announces with it. The legend is visually hidden by default, never removed.",
    'Each star is an <input type="radio"> with a visually hidden text label, so it is named, focusable and operable by keyboard without any ARIA; the focus ring is drawn around the glyph the input sits under.',
    'Display mode marks the glyphs decorative and names the group with role="img" and the value out of the maximum, so the rating is read once, as a number. Filled and empty stars stay distinct in forced-colours mode: Highlight for filled, a CanvasText outline for empty.',
  ],
  contextual: true,
  props: [
    {
      name: "label",
      type: "string",
      description:
        "What is being rated. Names the group for assistive tech; visually hidden unless showLabel.",
    },
    {
      name: "showLabel",
      type: "boolean",
      default: "false",
      description: "Show the label as text beside the stars.",
    },
    {
      name: "max",
      type: "number",
      default: "5",
      description: "How many stars.",
    },
    {
      name: "name",
      type: "string",
      description: "Shared name for the star radios (auto-generated if omitted).",
    },
    {
      name: "value",
      type: "number",
      description:
        "Controlled rating (pair with onValueChange). With readOnly, the rating shown; halves allowed.",
    },
    {
      name: "defaultValue",
      type: "number",
      description: "Initial rating for uncontrolled usage.",
    },
    {
      name: "labels",
      type: "{ star?: (n: number) => string; value?: (value: number, max: number) => string }",
      default: `{ star: (n) => "n stars", value: (v, max) => "v out of max" }`,
      description:
        'The words the stars speak, for another language or a different noun: star names each input ("3 stars"), value names the picture in display mode ("3.5 out of 5").',
    },
    {
      name: "onValueChange",
      type: "(value: number) => void",
      description: "Fires with the number of stars chosen.",
    },
    {
      name: "readOnly",
      type: "boolean",
      default: "false",
      description: "Display mode: a picture of value with one accessible name, no inputs.",
    },
    {
      name: "required",
      type: "boolean",
      description: "The user must choose a star before the form submits.",
    },
    {
      name: "disabled",
      type: "boolean",
      description: "Disables every star through the fieldset.",
    },
    {
      name: "...others",
      type: "HTMLAttributes",
      description:
        "Forwarded to the root: the <fieldset> in input mode, the <span> in display mode.",
    },
  ],
};

export default doc;
