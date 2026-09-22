import Link from "next/link";
import { Badge, Card, SignpostLink } from "@loamui/core";
import { HeroShowcase, ContextShowcase } from "@/home/Showcases";
import { AgentShowcase } from "@/home/AgentShowcase";
import { RestaurantMenu } from "@/home/agent-demo/menu";
import { menu } from "@/home/agent-demo/generated";
import "@/home/home.css";

const primitives = [
  {
    title: "Tokens",
    href: "/docs/tokens",
    body: "Colour, type and spacing that adapt to their surroundings. A few design decisions, with the rest derived from them.",
    example: "The values your design is built on.",
  },
  {
    title: "Element styles",
    href: "/docs/element-styles",
    body: "Native HTML with considered defaults for typography, forms and links, respecting the user’s preferences.",
    example: "A foundation before you add a component.",
  },
  {
    title: "Components",
    href: "/docs/components",
    body: "Low-level React parts for behaviour and interaction. Compose them with your own markup to make what your product needs.",
    example: "The parts, with the arrangement left to you.",
  },
];

const prompt =
  "Use the LoamUI skill to build a restaurant menu with starter and dessert cards. Include three dishes in each, with descriptions and prices. Mark the starters as vegetarian and the desserts as sold out. Let me select the available course.";

export default function HomePage() {
  return (
    <div className="site-Home" data-no-hyphens>
      <section className="hero">
        <div className="intro">
          <Badge.Root>
            <Badge.Text>v0.1 Beta</Badge.Text>
          </Badge.Root>
          <h1>
            Modern UI primitives for <span>agent-assisted developers.</span>
          </h1>
          <p className="lede">
            Use our agent skill to quickly build bespoke, accessible UIs on top of our contextual
            tokens, element styles, and React components.
          </p>
          <SignpostLink render={<Link href="/docs/installation" />}>Get started</SignpostLink>
        </div>
        <div className="specimen">
          <HeroShowcase />
          <p>Real primitives. Try the controls.</p>
        </div>
      </section>

      <section>
        <header>
          <p className="eyebrow">The foundation</p>
          <h2>Three primitives. One package.</h2>
          <p>Use them together to build your own UI, from a single form to a whole product.</p>
        </header>
        <div className="primitives">
          {primitives.map(({ title, href, body, example }) => (
            <Card key={title}>
              <article className="site-Primitive">
                <h3>
                  <Link href={href}>{title}</Link>
                </h3>
                <p>{body}</p>
                <footer>{example}</footer>
              </article>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <header>
          <p className="eyebrow">Build with the skill</p>
          <h2>Describe your UI. Build on the primitives.</h2>
          <p>
            Start with a framework and LoamUI installed. Add the skill, then describe what you want
            to build. Your agent checks the setup, composes the primitives and tests the result.
          </p>
        </header>
        <AgentShowcase
          prompt={prompt}
          tsx={menu.tsx}
          css={menu.css}
          caption="The cards compose tokens, native element styles, Badge and Button. Open the React or CSS tab to see how they fit together."
        >
          <RestaurantMenu headingLevel={3} />
        </AgentShowcase>
      </section>

      <section>
        <header>
          <p className="eyebrow">Pillar 1 · Modern Web</p>
          <h2>Let the platform do the work.</h2>
          <p>
            <a href="https://developer.chrome.com/docs/modern-web-guidance">
              Google’s Modern Web Guidance
            </a>{" "}
            and <a href="https://moderncss.ai/">Modern CSS</a> inform how we build all three
            primitives. Native behaviour comes first, with enhancements where the browser supports
            them.
          </p>
        </header>
        <div className="principles">
          <article>
            <h3>Native foundations</h3>
            <p>Real buttons, inputs and dialogs supply their semantics and platform behaviour.</p>
          </article>
          <article>
            <h3>Progressive enhancement</h3>
            <p>
              New capabilities build on usable defaults. Motion is added when the user permits it.
            </p>
          </article>
          <article>
            <h3>Baseline browser support</h3>
            <p>Baseline guides feature adoption. Newer capabilities have a usable fallback.</p>
          </article>
        </div>
        <div className="context">
          <div>
            <h3>A paradigm shift: design responds to context.</h3>
            <p>
              Declare a region’s meaning once. Its tokens adapt, and the native elements and
              components using them follow. Available space shapes type and spacing in the same way.
            </p>
            <p>
              Change the region’s meaning or available space. The same elements and components adapt
              through LoamUI’s tokens and CSS.
            </p>
            <Link href="/docs/contextualism">Explore contextualism</Link>
          </div>
          <ContextShowcase />
        </div>
      </section>

      <section className="accessibility">
        <header>
          <p className="eyebrow">Pillar 2 · Accessibility &amp; UX</p>
          <h2>Considered defaults. Everyday differences.</h2>
          <p>
            We draw on the GOV.UK and Polaris design systems for decisions that help people use your
            interface. Each component’s documentation explains when to use it and why.
          </p>
          <Link href="/docs/accessibility">Read the accessibility guidance</Link>
        </header>
        <dl>
          <div>
            <dt>Forms that help people recover</dt>
            <dd>
              Labels, hints and errors appear before the control. Optional fields are marked in
              words.
            </dd>
          </div>
          <div>
            <dt>Controls that mean what they say</dt>
            <dd>
              Buttons perform actions. Links navigate. A switch acts immediately; a checkbox can
              wait for submission.
            </dd>
          </div>
          <div>
            <dt>Preferences that carry through</dt>
            <dd>
              Colour scheme, reduced motion, forced colours and browser text size inform the
              defaults.
            </dd>
          </div>
          <div>
            <dt>Keyboard use built into the interaction</dt>
            <dd>
              Named controls, visible focus and appropriate focus management support navigation
              without a pointer.
            </dd>
          </div>
        </dl>
      </section>

      <section>
        <header>
          <p className="eyebrow">Confidence in the result</p>
          <h2>Check what your agent builds.</h2>
          <p>
            The skill guides the work; checks help you review it. Our primitives are tested in CI.
            Your composition still needs validation with its own content, layout and interactions.
          </p>
        </header>
        <ol className="workflow">
          <li>
            <h3>Establish the foundations</h3>
            <p>
              The skill checks the package, stylesheet and project setup before composing your UI.
            </p>
          </li>
          <li>
            <h3>Run the project’s checks</h3>
            <p>
              Use TypeScript, Stylelint and automated accessibility checks, then exercise the
              interactions.
            </p>
          </li>
          <li>
            <h3>Review it in the browser</h3>
            <p>
              Inspect narrow layouts, both themes and keyboard use. Judge the copy and visual
              result.
            </p>
          </li>
        </ol>
        <Link href="/docs/agent-workflow">Build with the skill</Link>
      </section>

      <section className="closing">
        <Card>
          <div className="site-Closing">
            <p className="eyebrow">Build with LoamUI</p>
            <h2>Your product. Your compositions.</h2>
            <p>
              Contextual tokens, native element styles and composable React parts, with an agent
              skill to bring them together. Modern web foundations and considered UX, ready for your
              next project.
            </p>
            <SignpostLink render={<Link href="/docs/installation" />}>Get started</SignpostLink>
          </div>
        </Card>
      </section>
    </div>
  );
}
