import { renderToString } from "react-dom/server";
import { Fixture } from "./Fixture.js";
export function render() {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Component contracts</title><link rel="stylesheet" href="/dist/styles.css"></head><body><div id="root">${renderToString(<Fixture />)}</div><script type="module" src="/browser/entry.tsx"></script></body></html>`;
}
