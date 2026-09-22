const code = (n) => `[${n}m`;
const styles = {
  reset: code(0),
  bold: code(1),
  dim: code(2),
  red: code(31),
  green: code(32),
  yellow: code(33),
  cyan: code(36),
};

const useColor = process.stdout.isTTY && !process.env.NO_COLOR;
const paint = (style, text) => (useColor ? `${style}${text}${styles.reset}` : text);

export const ui = {
  info: (m) => console.log(m),
  step: (m) => console.log(`${paint(styles.cyan, "›")} ${m}`),
  ok: (m) => console.log(`${paint(styles.green, "✓")} ${m}`),
  warn: (m) => console.log(`${paint(styles.yellow, "!")} ${m}`),
  fail: (m) => console.log(`${paint(styles.red, "✗")} ${m}`),
  heading: (m) => console.log(`\n${paint(styles.bold, m)}`),
  dim: (m) => console.log(paint(styles.dim, m)),
};
