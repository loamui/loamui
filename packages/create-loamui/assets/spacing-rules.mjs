/** Shared spacing checks for repository and consumer compositions. */
import postcss from "postcss";
import valueParser from "postcss-value-parser";
import ts from "loamui-typescript";

const PROPERTY = /^(?:padding|margin|(?:row-|column-)?gap)(?:-[a-z]+)*$/;

export function bypassesScale(value) {
  let bare = false;
  valueParser(value).walk((node) => {
    if (node.type === "function" && ["clamp", "calc"].includes(node.value)) return false;
    if (node.type === "word" && /^-?(?:\d*\.)?\d+(?:rem|px)$/.test(node.value)) {
      if (parseFloat(node.value) !== 0 && node.value !== "-1px") bare = true;
    }
  });
  return bare;
}

export function spacingFindings(source, file) {
  const findings = [];
  if (file.endsWith(".css")) {
    postcss.parse(source, { from: file }).walkDecls((decl) => {
      if (PROPERTY.test(decl.prop) && bypassesScale(decl.value)) {
        findings.push({ line: decl.source.start.line, prop: decl.prop, value: decl.value });
      }
    });
  } else {
    const tree = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    function visit(node) {
      // Covers inline style objects and extracted style constants, but not code
      // samples inside strings. Computed keys and runtime values need review.
      if (ts.isPropertyAssignment(node)) {
        const prop = node.name
          .getText(tree)
          .replace(/["']/g, "")
          .replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
        const value = node.initializer;
        const literal = ts.isStringLiteralLike(value)
          ? value.text
          : ts.isNumericLiteral(value)
            ? `${value.text}px`
            : null;
        if (PROPERTY.test(prop) && literal !== null && bypassesScale(literal)) {
          findings.push({
            line: tree.getLineAndCharacterOfPosition(node.getStart(tree)).line + 1,
            prop,
            value: literal,
          });
        }
      }
      ts.forEachChild(node, visit);
    }
    visit(tree);
  }
  return findings;
}
