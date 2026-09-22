// Stylelint rule: spacing comes from the scale.
//
// A literal rem/px on padding, margin or gap bypasses the --loam-space-*
// tokens the whole system is tuned to. Fluid calc()/clamp() ramps and a
// -1px overlap are deliberate exceptions. The check lives in the skill's
// spacing-rules module, shared with consuming projects; this file lets
// Stylelint run it on CSS. Literal React style objects are .tsx, which
// Stylelint never sees, so those stay with scripts/check-spacing.mjs.
import stylelint from "stylelint";
import { spacingFindings } from "../../packages/cli/assets/spacing-rules.mjs";

const ruleName = "loamui/spacing";
const messages = stylelint.utils.ruleMessages(ruleName, {
  literal: (prop, value) =>
    `${prop}: ${value} bypasses the spacing scale. Use --loam-space-* or --loam-space-fixed-*.`,
});

const rule = (primary) => (root, result) => {
  if (!primary) return;
  const file = root.source?.input.file ?? "stylesheet.css";
  for (const finding of spacingFindings(root.source.input.css, file)) {
    let node = root;
    root.walkDecls((decl) => {
      if (decl.source?.start?.line === finding.line && decl.prop === finding.prop) {
        node = decl;
        return false;
      }
    });
    stylelint.utils.report({
      ruleName,
      result,
      node,
      message: messages.literal(finding.prop, finding.value),
    });
  }
};

rule.ruleName = ruleName;
rule.messages = messages;
export default stylelint.createPlugin(ruleName, rule);
