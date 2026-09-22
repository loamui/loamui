import type { CSSProperties } from "react";
import type { ComponentContent } from "@/renderer/types";
import { Avatar } from "@loamui/core";

export function AvatarGroupDemo() {
  return (
    <Avatar.Group aria-label="Participants">
      <Avatar.Root role="img" aria-label="Jane Doe">
        <Avatar.Fallback>JD</Avatar.Fallback>
      </Avatar.Root>
      <Avatar.Root role="img" aria-label="Sam Reed">
        <Avatar.Fallback>SR</Avatar.Fallback>
      </Avatar.Root>
      <Avatar.Root role="img" aria-label="Amara Okafor">
        <Avatar.Fallback>AO</Avatar.Fallback>
      </Avatar.Root>
      <Avatar.Root role="img" aria-label="5 more people">
        <Avatar.Fallback>+5</Avatar.Fallback>
      </Avatar.Root>
    </Avatar.Group>
  );
}

const IMG =
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&h=128&fit=crop&crop=faces";

const doc: ComponentContent = {
  slug: "avatar",
  lead: "An image and an explicit fallback representing a person.",
  importLine: `import { Avatar } from "@loamui/core";`,
  demos: [
    {
      title: "Image and fallback",
      description:
        "Image owns the source and native loading attributes. Fallback holds the content shown while loading or after an error.",
      code: `<Avatar.Root role="img" aria-label="Ada Lovelace">
  <Avatar.Image
    src="${IMG}"
    alt=""
    loading="lazy"
  />
  <Avatar.Fallback>AL</Avatar.Fallback>
</Avatar.Root>`,
      render: () => (
        <Avatar.Root role="img" aria-label="Ada Lovelace">
          <Avatar.Image src={IMG} alt="" loading="lazy" />
          <Avatar.Fallback>AL</Avatar.Fallback>
        </Avatar.Root>
      ),
    },
    {
      title: "Initials",
      description:
        "Supply initials as children. The background answers the surrounding --loam-context region.",
      code: `<span style={{ "--loam-context": "info" }}>
  <Avatar.Root role="img" aria-label="Amara Okafor">
    <Avatar.Fallback>AO</Avatar.Fallback>
  </Avatar.Root>
</span>`,
      render: () => (
        <span style={{ "--loam-context": "info" } as CSSProperties}>
          <Avatar.Root role="img" aria-label="Amara Okafor">
            <Avatar.Fallback>AO</Avatar.Fallback>
          </Avatar.Root>
        </span>
      ),
    },
    {
      title: "Size",
      description: "Set the public --loam-avatar-size property on an instance or region.",
      code: `<Avatar.Root role="img" aria-label="Jane Doe" style={{ "--loam-avatar-size": "4rem" }}>
  <Avatar.Fallback>JD</Avatar.Fallback>
</Avatar.Root>`,
      render: () => (
        <Avatar.Root
          role="img"
          aria-label="Jane Doe"
          style={{ "--loam-avatar-size": "4rem" } as CSSProperties}
        >
          <Avatar.Fallback>JD</Avatar.Fallback>
        </Avatar.Root>
      ),
    },
    {
      title: "Group",
      description: "Each child is a list item. Compose an additional avatar for an overflow count.",
      code: `<Avatar.Group aria-label="Participants">
  <Avatar.Root role="img" aria-label="Jane Doe">
    <Avatar.Fallback>JD</Avatar.Fallback>
  </Avatar.Root>
  <Avatar.Root role="img" aria-label="Sam Reed">
    <Avatar.Fallback>SR</Avatar.Fallback>
  </Avatar.Root>
  <Avatar.Root role="img" aria-label="Amara Okafor">
    <Avatar.Fallback>AO</Avatar.Fallback>
  </Avatar.Root>
  <Avatar.Root role="img" aria-label="5 more people">
    <Avatar.Fallback>+5</Avatar.Fallback>
  </Avatar.Root>
</Avatar.Group>`,
      render: () => <AvatarGroupDemo />,
    },
  ],
  whenToUse: [
    "To identify a person beside their comment, assignment or member record.",
    "With Avatar.Group, to show a compact set of participants.",
  ],
  whenNotToUse: [
    "For logos, screenshots or product photos: use a plain image without the avatar's cover crop.",
    "As a click target: wrap the avatar in a link or button when it opens a profile.",
  ],
  howItWorks: [
    {
      title: "Explicit parts",
      body: "Root provides the shared loading state. Compose one Image and a Fallback in either order. Root accepts native span attributes; it does not generate an image, initials, icon or overflow count from content props.",
    },
    {
      title: "Native image loading",
      body: 'Image stays in the DOM and loads in place, so loading="lazy", srcSet and sizes reach the browser. Loading and failed images keep their layout box with visibility: hidden. Fallback remains visible until a successful load. A new source starts a new loading attempt.',
    },
    {
      title: "Server rendering",
      body: "Both parts are present in server HTML. Fallback remains visible until hydration resolves image status, including an image already in the browser cache. With JavaScript unavailable the fallback remains visible.",
    },
  ],
  accessibility: [
    'When the avatar identifies a person, put role="img" and aria-label with the full name on Root, and alt="" on Image. The name then remains available during loading and failure.',
    'When the person’s name is printed beside the avatar, use aria-hidden on Root and alt="" on Image to avoid repeating it.',
    "Fallback content is supplied by the caller: initials, an icon, or other meaningful content. Initials alone do not replace the person's full accessible name.",
  ],
  parts: [
    {
      name: "Avatar.Root",
      description:
        "A span containing one Image and a Fallback, or plain content. It holds parts, not content props: what shows is composed, never derived behind your back.",
      props: [
        {
          name: "...others",
          type: "SpanHTMLAttributes",
          description: "Native span props, including children, role, aria-label and aria-hidden.",
        },
      ],
    },
    {
      name: "Avatar.Image",
      description: "A native image which loads in place.",
      props: [
        { name: "src", type: "string", description: "Image source." },
        {
          name: "alt",
          type: "string",
          description:
            "Required image alternative. Use an empty string when Root supplies the name or is decorative.",
        },
        {
          name: "...others",
          type: "ImgHTMLAttributes",
          description:
            "Native image props, including loading, srcSet, sizes, onLoad, onError and ref.",
        },
      ],
    },
    {
      name: "Avatar.Fallback",
      description:
        "A span shown while loading or when the image fails; children supply its content.",
    },
    {
      name: "Avatar.Group",
      description:
        "An overlapping list; each supplied child becomes a list item. Native ul props are forwarded.",
    },
  ],
  cssProps: [
    {
      name: "--loam-avatar-size",
      syntax: "CSS length",
      default: "2.5rem",
      description: "The diameter; set per instance or on a region.",
    },
    {
      name: "--loam-avatar-overlap",
      syntax: "CSS length",
      default: "0.5rem",
      description: "How far each group item overlaps the preceding item.",
    },
  ],
  contextual: true,
};
export default doc;
