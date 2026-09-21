import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { ComponentDoc } from "../types";
import { Preview } from "./Preview";
import { CodeBlock } from "./CodeBlock";
import { PropsTable } from "./PropsTable";
import { ScrollRegion } from "../shared/ScrollRegion";
import "./DocPage.css";
import "./PropsTable.css";

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Read a component's real, complete stylesheet from disk at build time.
 * This is the actual CSS that ships — showing it is the whole point.
 */
function readComponentCss(name: string, pkg: "core"): string | undefined {
  try {
    const file = join(
      process.cwd(),
      "..",
      "..",
      "packages",
      pkg,
      "src",
      "components",
      name,
      `${name}.css`,
    );
    const raw = readFileSync(file, "utf8").trim();
    return `/* The complete stylesheet for <${name} />: plain, static CSS.\n   Nothing runs in the browser: no CSS-in-JS, no runtime. */\n\n${raw}`;
  } catch {
    return undefined;
  }
}

export function DocPage({ doc }: { doc: ComponentDoc }) {
  const css = readComponentCss(doc.name, doc.pkg ?? "core");

  return (
    <article className="site-DocPage">
      <header>
        <p>{doc.category}</p>
        <h1>{doc.name}</h1>
        <p className="lead">{doc.lead ?? doc.description}</p>
      </header>

      <section>
        <h2 id="import">Import</h2>
        <CodeBlock code={doc.importLine} />
      </section>

      <section>
        <h2 id="usage">Usage</h2>
        <p className="usageNote">
          Every example has a <strong>CSS</strong>&#32;tab. That&rsquo;s the real, complete
          stylesheet for the component: plain, static CSS, with nothing running in the browser.
        </p>
        <div className="demos">
          {doc.demos.map((demo) => (
            <div key={demo.title} id={slugify(demo.title)} className="demo">
              <h3>{demo.title}</h3>
              {demo.description && <p className="demoDesc">{demo.description}</p>}
              <Preview code={demo.code} css={css}>
                {demo.render()}
              </Preview>
            </div>
          ))}
        </div>
      </section>

      {(doc.whenToUse || doc.whenNotToUse || doc.accessibility) && (
        <section>
          <h2 id="guidance">Guidance</h2>
          <div className="guidance">
            {(doc.whenToUse || doc.whenNotToUse) && (
              <div className="guidanceCols">
                {doc.whenToUse && (
                  <div className="guidanceCard guidanceYes">
                    <h3>When to use it</h3>
                    <ul>
                      {doc.whenToUse.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {doc.whenNotToUse && (
                  <div className="guidanceCard guidanceNo">
                    <h3>When not to</h3>
                    <ul>
                      {doc.whenNotToUse.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            {doc.accessibility && (
              <div className="guidanceCard a11y">
                <h3>Accessibility</h3>
                <ul>
                  {doc.accessibility.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {doc.howItWorks && (
        <section>
          <h2 id="how-it-works">How it works</h2>
          <div className="demos">
            {doc.howItWorks.map((entry) => (
              <div key={entry.title} id={slugify(entry.title)} className="demo">
                <h3>{entry.title}</h3>
                <p className="demoDesc">{entry.body}</p>
                {entry.code && entry.render && (
                  <Preview code={entry.code} css={css}>
                    {entry.render()}
                  </Preview>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {doc.errors && (
        <section>
          <h2 id="error-messages">Error messages</h2>
          <p className="usageNote">
            Say what happened and how to fix it, in the words of the question itself. See the
            writing guidance{" "}
            {doc.slug === "field" ? (
              <>above.</>
            ) : (
              <>
                on the <a href="/docs/components/field#writing-error-messages">Field page</a>.
              </>
            )}
          </p>
          <ScrollRegion className="site-PropsTable" label="Error messages table">
            <table>
              <thead>
                <tr>
                  <th scope="col">Situation</th>
                  <th scope="col">Message</th>
                </tr>
              </thead>
              <tbody>
                {doc.errors.map((e) => (
                  <tr key={e.situation}>
                    <td>{e.situation}</td>
                    <td>
                      <code className="name">{e.message}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollRegion>
        </section>
      )}

      {doc.props && doc.props.length > 0 && (
        <section>
          <h2 id="props">Props</h2>
          {doc.contextual && (
            <p className="demoDesc">
              Status is not a prop: it comes from the surrounding <code>--loam-context</code>{" "}
              region. See the <a href="/docs/contextualism">Contextualism guide</a>.
            </p>
          )}
          <PropsTable rows={doc.props} />
        </section>
      )}

      {doc.parts && doc.parts.length > 0 && (
        <section>
          <h2 id="parts">Parts</h2>
          <div className="demos">
            {doc.parts.map((part) => (
              <div key={part.name} id={slugify(part.name)} className="demo">
                <h3>
                  <code>{part.name}</code>
                </h3>
                <p className="demoDesc">{part.description}</p>
                {part.props && part.props.length > 0 && (
                  <PropsTable label={`${part.name} props table`} rows={part.props} />
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {doc.cssProps && doc.cssProps.length > 0 && (
        <section>
          <h2 id="custom-properties">Custom properties</h2>
          <PropsTable
            nameLabel="Property"
            typeLabel="Syntax"
            label="Custom properties table"
            rows={doc.cssProps.map((p) => ({
              name: p.name,
              type: p.syntax,
              default: p.default,
              description: p.description,
            }))}
          />
        </section>
      )}

      {doc.hooks && doc.hooks.length > 0 && (
        <section>
          <h2 id="hooks">Hooks</h2>
          <div className="demos">
            {doc.hooks.map((hook) => (
              <div key={hook.name} id={slugify(hook.name)} className="demo">
                <h3>
                  <code>{hook.name}</code>
                </h3>
                <p className="demoDesc">{hook.description}</p>
                <CodeBlock code={hook.signature} />
                {hook.options && (
                  <>
                    <p className="demoDesc">{hook.options.title}</p>
                    <PropsTable
                      nameLabel="Option"
                      label={`${hook.name} options table`}
                      rows={hook.options.rows}
                    />
                  </>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
