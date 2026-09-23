/**
 * WCAG contrast audit over the token palette. The CSS stays the single
 * source: tokens are read from the tokens.css AST (root scope only — the
 * context blocks re-answer tokens per region, which the browser scopes
 * itself), and the label/tint recipes are read back out of the component
 * CSS rather than assumed, so a weight change there is re-audited, not
 * silently trusted. Fails CI on any pair below threshold — and throws on
 * any colour form it cannot resolve exactly (alpha, unknown functions,
 * out-of-sRGB-gamut values), so an unresolvable token can never PASS.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import postcss from "postcss";

const src = (...p) => join(dirname(fileURLToPath(import.meta.url)), "..", "src", ...p);
const css = readFileSync(src("tokens.css"), "utf8");

// ---- colour math -----------------------------------------------------
// oklch → OKLab → linear sRGB (Ottosson's matrices) → WCAG relative
// luminance. Out-of-gamut values get the CSS gamut-mapping treatment —
// hold lightness and hue, shrink chroma until sRGB contains it — so the
// audited numbers track what a browser actually renders, not a per-channel
// clip of a colour it never shows.
const gam = (u) => (u <= 0.0031308 ? 12.92 * u : 1.055 * u ** (1 / 2.4) - 0.055);
const lin = (u) => (u <= 0.04045 ? u / 12.92 : ((u + 0.055) / 1.055) ** 2.4);

function oklabToLinear([L, a, b]) {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}
const inGamut = (rgb) => rgb.every((u) => u >= -1e-6 && u <= 1 + 1e-6);

function oklabToSrgb([L, a, b]) {
  let linear = oklabToLinear([L, a, b]);
  if (!inGamut(linear)) {
    let lo = 0;
    let hi = 1;
    for (let i = 0; i < 30; i++) {
      const mid = (lo + hi) / 2;
      if (inGamut(oklabToLinear([L, a * mid, b * mid]))) lo = mid;
      else hi = mid;
    }
    linear = oklabToLinear([L, a * lo, b * lo]);
  }
  return linear.map((u) => gam(Math.min(1, Math.max(0, u))));
}
function srgbToOklab([r, g, b]) {
  const [lr, lg, lb] = [lin(r), lin(g), lin(b)];
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}
const oklchToSrgb = (L, C, H) => {
  const h = (H * Math.PI) / 180;
  return oklabToSrgb([L, C * Math.cos(h), C * Math.sin(h)]);
};
const relLum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const contrast = (c1, c2) => {
  const [l1, l2] = [relLum(c1), relLum(c2)];
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
};
const mixOklab = (c1, c2, w2) => {
  const [a, b] = [srgbToOklab(c1), srgbToOklab(c2)];
  return oklabToSrgb(a.map((x, i) => x * (1 - w2) + b[i] * w2));
};

// ---- token collection (root scope only) ------------------------------
// The context blocks re-declare tokens inside @container rules; those
// apply per region in the browser and must not shadow the root palette
// here (a flat text scan would let the last block win and audit the
// wrong colours).
const decls = {};
postcss.parse(css).walkDecls(/^--loam-/, (decl) => {
  for (let p = decl.parent; p; p = p.parent) {
    if (p.type === "atrule" && p.name !== "layer") return;
  }
  if (decl.prop in decls) throw new Error(`duplicate root declaration of ${decl.prop}`);
  decls[decl.prop] = decl.value.trim();
});

// ---- token resolution (the subset tokens.css uses) -------------------
function resolve(expr, scheme) {
  expr = expr.trim();
  const ld = expr.match(/^light-dark\(([\s\S]+)\)$/);
  if (ld) {
    const parts = splitTop(ld[1]);
    return resolve(scheme === "light" ? parts[0] : parts[1], scheme);
  }
  const v = expr.match(/^var\((--[\w-]+)\)$/);
  if (v) {
    if (!(v[1] in decls)) throw new Error(`unknown token ${v[1]}`);
    return resolve(decls[v[1]], scheme);
  }
  // Relative colour, the reference derivation idiom: each of L and C either
  // pinned to a number or kept from the source (`l`, `c`), hue always kept —
  // oklch(from <colour> <L>% <C> h). Anything fancier (calc channels,
  // alpha) throws loudly.
  const rel = expr.match(/^oklch\(from\s+([\s\S]+?)\s+([\d.]+%|l)\s+([\d.]+|c)\s+h\)$/);
  if (rel) {
    const srcRgb = resolve(rel[1], scheme);
    const [L0, a0, b0] = srgbToOklab(srcRgb);
    const hue = Math.atan2(b0, a0);
    const L = rel[2] === "l" ? L0 : +rel[2].slice(0, -1) / 100;
    const C = rel[3] === "c" ? Math.hypot(a0, b0) : +rel[3];
    return oklabToSrgb([L, C * Math.cos(hue), C * Math.sin(hue)]);
  }
  const ok = expr.match(/^oklch\(([\d.]+)%\s+([\d.]+)\s+([\d.]+)deg(\s*\/\s*[\d.]+%?)?\)$/);
  if (ok) {
    if (ok[4])
      throw new Error(
        `translucent colour in an audited chain: ${expr} — contrast depends on what shows through, which this audit cannot know`,
      );
    return oklchToSrgb(+ok[1] / 100, +ok[2], +ok[3]);
  }
  const mix = expr.match(/^color-mix\(in oklab,\s*([\s\S]+)\)$/);
  if (mix) {
    const parts = splitTop(mix[1]);
    const pct = (p) => {
      const m2 = p.match(/([\s\S]+?)\s+([\d.]+)%$/);
      return m2 ? [m2[1].trim(), +m2[2] / 100] : [p.trim(), null];
    };
    const [c1e, w1] = pct(parts[0]);
    const [c2e, w2raw] = pct(parts[1]);
    const w2 = w2raw ?? (w1 != null ? 1 - w1 : 0.5);
    return mixOklab(resolve(c1e, scheme), resolve(c2e, scheme), w2);
  }
  throw new Error(`cannot resolve: ${expr}`);
}
function splitTop(s) {
  const out = [];
  let depth = 0,
    cur = "";
  for (const ch of s) {
    if (ch === "(") depth++;
    if (ch === ")") depth--;
    if (ch === "," && depth === 0) {
      out.push(cur);
      cur = "";
      continue;
    }
    cur += ch;
  }
  out.push(cur);
  return out.map((x) => x.trim());
}
const T = (name, scheme) => resolve(`var(${name})`, scheme);

// ---- recipes read from component CSS ---------------------------------
// Button/Badge/Alert derive every look from one colour channel, so their
// label colour is a recipe on the channel, not a token. The audit reads
// the weights out of each file: change a weight and the changed pair is
// what gets audited.
function labelWeights(file, channel) {
  const text = readFileSync(src(file), "utf8");
  const re = new RegExp(
    String.raw`light-dark\(\s*color-mix\(in oklab,\s*var\(${channel}\)\s+([\d.]+)%,\s*oklch\(0% 0 0deg\)\s*\),\s*color-mix\(in oklab,\s*var\(${channel}\)\s+([\d.]+)%,\s*oklch\(100% 0 0deg\)\s*\)\s*\)`,
  );
  const m = text.match(re);
  if (!m)
    throw new Error(`label recipe not found in ${file} — update this audit alongside the recipe`);
  return { light: +m[1] / 100, dark: +m[2] / 100 };
}
const labelRecipes = [
  labelWeights("components/Button/Button.css", "--_color"),
  labelWeights("components/Badge/Badge.css", "--_color"),
  labelWeights("components/Alert/Alert.css", "--_accent"),
  labelWeights("components/ErrorSummary/ErrorSummary.css", "--loam-color-danger"),
  labelWeights("elements.css", "--loam-color-fg"),
];
for (const r of labelRecipes.slice(1)) {
  if (r.light !== labelRecipes[0].light || r.dark !== labelRecipes[0].dark) {
    throw new Error(
      "label recipes have drifted apart across Button/Badge/Alert/ErrorSummary/elements",
    );
  }
}
const LABEL = labelRecipes[0];
const mixedLabel = (colour, scheme) =>
  scheme === "light"
    ? mixOklab(colour, [0, 0, 0], 1 - LABEL.light)
    : mixOklab(colour, [1, 1, 1], 1 - LABEL.dark);

// Button's rest-state background tint (the first light-dark background in
// the file; the hover tint below it is darker, so rest is the worst case
// for the label).
function tintWeights(file, channel) {
  const text = readFileSync(src(file), "utf8");
  const re = new RegExp(
    String.raw`light-dark\(\s*color-mix\(in oklab,\s*var\(${channel}\),\s*var\(--loam-color-bg\)\s+([\d.]+)%\s*\),\s*color-mix\(in oklab,\s*var\(${channel}\),\s*var\(--loam-color-bg\)\s+([\d.]+)%\s*\)\s*\)`,
  );
  const m = text.match(re);
  if (!m)
    throw new Error(`tint recipe not found in ${file} — update this audit alongside the recipe`);
  return { light: +m[1] / 100, dark: +m[2] / 100 };
}
const TINT = tintWeights("components/Button/Button.css", "--_color");
const elementsTint = tintWeights("elements.css", "--loam-color-fg");
const ALERT_TINT = tintWeights("components/Alert/Alert.css", "--_accent");
if (elementsTint.light !== TINT.light || elementsTint.dark !== TINT.dark) {
  throw new Error("native button tint in elements.css has drifted from Button.css");
}

// ---- the audited pairs ----------------------------------------------
const failures = [];
function check(name, scheme, fg, bg, need) {
  const r = contrast(fg, bg);
  const ok = r >= need;
  if (!ok) failures.push(name);
  console.log(
    `${ok ? "PASS" : "FAIL"}  ${r.toFixed(2).padStart(5)}  (≥${need})  [${scheme}] ${name}`,
  );
}

for (const scheme of ["light", "dark"]) {
  const t = (n) => T(n, scheme);
  check("text on bg", scheme, t("--loam-color-fg"), t("--loam-color-bg"), 4.5);
  check("link on bg", scheme, t("--loam-color-link"), t("--loam-color-bg"), 4.5);
  check("link on surface", scheme, t("--loam-color-link"), t("--loam-color-surface"), 4.5);
  // <mark> and ::selection paint a fixed dark text on the highlight fill; the
  // dark stays put but the highlight token could drift, so lock the pair.
  check(
    "mark/selection text on highlight",
    scheme,
    resolve("oklch(20% 0 0deg)", scheme),
    t("--loam-color-highlight"),
    4.5,
  );
  check(
    "text-strong (headings) on bg",
    scheme,
    t("--loam-color-fg-strong"),
    t("--loam-color-bg"),
    4.5,
  );
  check(
    "text-strong (headings) on surface",
    scheme,
    t("--loam-color-fg-strong"),
    t("--loam-color-surface"),
    4.5,
  );
  check("text-muted on bg", scheme, t("--loam-color-fg-muted"), t("--loam-color-bg"), 4.5);
  check(
    "text-dim (placeholder) on surface",
    scheme,
    t("--loam-color-fg-dim"),
    t("--loam-color-surface"),
    4.5,
  );
  check(
    "danger text (FieldError) on bg",
    scheme,
    t("--loam-color-danger"),
    t("--loam-color-bg"),
    4.5,
  );
  // The -strong family is also TEXT: Tabs' selected tab, Details' open
  // summary and any contexted label lean on it holding 4.5:1 on both
  // surfaces, where the raw hue does not (light warning is 2.5:1).
  for (const status of ["primary", "success", "danger", "warning", "info"]) {
    check(
      `${status}-strong text on bg`,
      scheme,
      t(`--loam-color-${status}-strong`),
      t("--loam-color-bg"),
      4.5,
    );
    check(
      `${status}-strong text on surface`,
      scheme,
      t(`--loam-color-${status}-strong`),
      t("--loam-color-surface"),
      4.5,
    );
  }
  // Fills and edges on the subtle surface: Meter and Progress tracks, the
  // SchemeToggle's chosen option, FileInput's drop zone; and the accent as a
  // glyph on a Card (Rating in a ProductCard).
  for (const status of ["primary", "success", "danger", "warning", "info"]) {
    check(
      `${status}-strong fill on bg-subtle`,
      scheme,
      t(`--loam-color-${status}-strong`),
      t("--loam-color-bg-subtle"),
      3.0,
    );
  }
  check(
    "line-strong on bg-subtle",
    scheme,
    t("--loam-color-line-strong"),
    t("--loam-color-bg-subtle"),
    3.0,
  );
  check(
    "text-muted on bg-subtle",
    scheme,
    t("--loam-color-fg-muted"),
    t("--loam-color-bg-subtle"),
    4.5,
  );
  check(
    "primary-strong edge on primary-soft",
    scheme,
    t("--loam-color-primary-strong"),
    t("--loam-color-primary-soft"),
    3.0,
  );
  check(
    "accent glyph on surface",
    scheme,
    t("--loam-color-accent"),
    t("--loam-color-surface"),
    3.0,
  );
  check(
    "fill text on primary-strong",
    scheme,
    t("--loam-color-on-strong"),
    t("--loam-color-primary-strong"),
    4.5,
  );
  check(
    "fill text on success-strong",
    scheme,
    t("--loam-color-on-strong"),
    t("--loam-color-success-strong"),
    4.5,
  );
  check(
    "fill text on danger-strong",
    scheme,
    t("--loam-color-on-strong"),
    t("--loam-color-danger-strong"),
    4.5,
  );
  check(
    "fill text on warning-strong",
    scheme,
    t("--loam-color-on-strong"),
    t("--loam-color-warning-strong"),
    4.5,
  );
  check(
    "fill text on info-strong",
    scheme,
    t("--loam-color-on-strong"),
    t("--loam-color-info-strong"),
    4.5,
  );
  check(
    "ErrorSummary link on danger-soft",
    scheme,
    mixedLabel(t("--loam-color-danger"), scheme),
    t("--loam-color-danger-soft"),
    4.5,
  );
  // Text on the -soft surfaces. A page link inside a soft-tinted region
  // (a notice, a callout, an ErrorSummary body) keeps the link colour, so
  // the link must read on every soft. The status's own text there is the
  // -strong token: the RAW hue on its -soft is banned as text (light
  // warning on warning-soft is far below 4.5:1), which is why the pair
  // audited is -strong, and why no component paints raw-on-soft.
  for (const s of ["primary", "success", "danger", "warning", "info"]) {
    check(`link on ${s}-soft`, scheme, t("--loam-color-link"), t(`--loam-color-${s}-soft`), 4.5);
    // No component sets small -strong TEXT on its -soft: the pair in use is a
    // glyph or an edge (a Feature icon, FileInput's drop-zone border), so the
    // non-text threshold applies. Small text on a tint stays the mixed label.
    check(
      `${s}-strong glyph on ${s}-soft`,
      scheme,
      t(`--loam-color-${s}-strong`),
      t(`--loam-color-${s}-soft`),
      3.0,
    );
  }
  for (const s of ["primary", "success", "danger", "warning", "info"]) {
    const colour = t(`--loam-color-${s}`);
    const tint = mixOklab(
      colour,
      t("--loam-color-bg"),
      scheme === "light" ? TINT.light : TINT.dark,
    );
    check(`button ${s} text on its tint`, scheme, mixedLabel(colour, scheme), tint, 4.5);
  }
  {
    // Alert's description is full-strength text on the alert's tint, which
    // mixes more of the channel in than Button's; the neutral channel (the
    // text colour itself) makes the darkest tint, so every channel is read.
    const alertTint = ALERT_TINT[scheme];
    for (const channel of ["fg", "primary", "success", "danger", "warning", "info"]) {
      const tint = mixOklab(t(`--loam-color-${channel}`), t("--loam-color-bg"), alertTint);
      check(`Alert description on ${channel} tint`, scheme, t("--loam-color-fg"), tint, 4.5);
    }
  }
  {
    // The elements layer's native button: neutral text channel on its tint.
    const colour = t("--loam-color-fg");
    const tint = mixOklab(
      colour,
      t("--loam-color-bg"),
      scheme === "light" ? TINT.light : TINT.dark,
    );
    check("native button text on its tint", scheme, mixedLabel(colour, scheme), tint, 4.5);
  }
  check(
    "input border-strong vs surface",
    scheme,
    t("--loam-color-line-strong"),
    t("--loam-color-surface"),
    3.0,
  );
  // Checked Checkbox/Radio/Switch/Slider paint their glyph (tick, dot,
  // thumb) in --loam-color-on-strong over the -strong fill — a non-text
  // state indicator, so the 1.4.11 3:1 bar applies. In a --loam-context
  // region the fill becomes that status's -strong, already audited for
  // on-strong at 4.5:1 above, so every context clears 3:1 too.
  check(
    "checked-control glyph on primary-strong",
    scheme,
    t("--loam-color-on-strong"),
    t("--loam-color-primary-strong"),
    3.0,
  );
  // Accent is a graphical indicator (e.g. the Loader arc) painted on the page
  // background — a non-text object, so the 1.4.11 3:1 bar applies.
  check("accent indicator on bg", scheme, t("--loam-color-accent"), t("--loam-color-bg"), 3.0);
  for (const s of ["primary", "success", "danger", "warning", "info"]) {
    check(
      `${s} focus ring vs bg`,
      scheme,
      t(`--loam-color-${s}-strong`),
      t("--loam-color-bg"),
      3.0,
    );
  }
}

// ---- the docs site's own pairings -----------------------------------
// The site defines no colours of its own — every colour is a core token —
// but it combines them in ways no component does: a dim count on the page
// ground, the raw primary as a category label, the accent as text on its
// own 14% tint behind the current page. Those pairings are the site's to
// audit, so the site is held to the bar it documents.
for (const scheme of ["light", "dark"]) {
  const t = (n) => T(n, scheme);
  // The current item's tint: color-mix(in oklab, accent 14%, transparent)
  // over the page ground (Sidebar, RecipesRail) or the surface (CommandMenu).
  const tintOn = (ground) => mixOklab(t("--loam-color-accent"), ground, 0.86);
  check(
    "site: dim count/hint text on bg",
    scheme,
    t("--loam-color-fg-dim"),
    t("--loam-color-bg"),
    4.5,
  );
  check(
    "site: dim category title on bg (NavLinks)",
    scheme,
    t("--loam-color-fg-dim"),
    t("--loam-color-bg"),
    4.5,
  );
  check(
    "site: primary category label on bg (DocPage)",
    scheme,
    t("--loam-color-primary"),
    t("--loam-color-bg"),
    4.5,
  );
  check(
    "site: primary guidance heading on surface",
    scheme,
    t("--loam-color-primary"),
    t("--loam-color-surface"),
    4.5,
  );
  check(
    "site: danger guidance heading on surface",
    scheme,
    t("--loam-color-danger"),
    t("--loam-color-surface"),
    4.5,
  );
  check(
    "site: accent current-page text on its tint over bg",
    scheme,
    t("--loam-color-accent"),
    tintOn(t("--loam-color-bg")),
    4.5,
  );
  check(
    "site: accent current-result text on its tint over surface",
    scheme,
    t("--loam-color-accent"),
    tintOn(t("--loam-color-surface")),
    4.5,
  );
  check(
    "site: accent as text on bg (h1 emphasis)",
    scheme,
    t("--loam-color-accent"),
    t("--loam-color-bg"),
    4.5,
  );
  check(
    "site: text on surface-hover (nav/result hover)",
    scheme,
    t("--loam-color-fg"),
    t("--loam-color-surface-hover"),
    4.5,
  );
  check(
    "site: link on bg-subtle (empty panel)",
    scheme,
    t("--loam-color-link"),
    t("--loam-color-bg-subtle"),
    4.5,
  );
  check(
    "site: text-strong on bg-subtle (empty title)",
    scheme,
    t("--loam-color-fg-strong"),
    t("--loam-color-bg-subtle"),
    4.5,
  );
  check(
    "site: text on bg-subtle (context demo)",
    scheme,
    t("--loam-color-fg"),
    t("--loam-color-bg-subtle"),
    4.5,
  );
  check(
    "site: text-muted on primary-soft (usage note)",
    scheme,
    t("--loam-color-fg-muted"),
    t("--loam-color-primary-soft"),
    4.5,
  );
  check(
    "site: text-muted on surface (card body)",
    scheme,
    t("--loam-color-fg-muted"),
    t("--loam-color-surface"),
    4.5,
  );
}

if (failures.length) {
  console.error(`\n${failures.length} contrast pair(s) below WCAG threshold.`);
  process.exit(1);
}
console.log("\nAll audited pairs pass.");
