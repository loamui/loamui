/**
 * The first grapheme cluster of `n` characters, so an emoji or a combining
 * accent counts once rather than splitting into its code units.
 */
function graphemes(value: string, count: number): string {
  if (typeof Intl.Segmenter === "function") {
    let out = "";
    for (const { segment } of new Intl.Segmenter(undefined, {
      granularity: "grapheme",
    }).segment(value)) {
      if (count-- <= 0) break;
      out += segment;
    }
    return out;
  }
  return [...value].slice(0, count).join("");
}

/**
 * Initials for a name: "Imogen Hartley" → "IH"; a single name gives its first
 * two characters. Exported because `Avatar.Fallback` takes the content you
 * give it — this is the part that is easy to get wrong, not the markup.
 */
export function initialsFrom(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0];
  const last = parts[parts.length - 1];
  if (!first || !last) return "";
  if (parts.length === 1) return graphemes(first, 2).toUpperCase();
  return (graphemes(first, 1) + graphemes(last, 1)).toUpperCase();
}
