"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Badge, Button, Drawer, Field, Price, QuantityInput, SignpostLink } from "@loamui/core";
import "./example.css";

const LINES = [
  {
    slug: "climbing-bean-blue-lake",
    name: "Climbing bean ‘Blue Lake’ seeds",
    options: "Packet of 25 seeds",
    image: 627,
    eachPence: 280,
    quantity: 2,
  },
  {
    slug: "raspberry-autumn-bliss",
    name: "Raspberry ‘Autumn Bliss’ canes",
    options: "Bundle of five",
    image: 429,
    eachPence: 2400,
    quantity: 1,
  },
];

function quantityOf(draft: string): number | null {
  const value = Number(draft);
  return draft !== "" && Number.isInteger(value) && value >= 1 && value <= 10 ? value : null;
}

type Line = (typeof LINES)[number] & { draft: string; invalid: boolean };
const DELIVERY_PENCE = 395;

export default function Example() {
  const instanceId = useId();
  const [lines, setLines] = useState<Line[]>(() =>
    LINES.map((line) => ({ ...line, draft: String(line.quantity), invalid: false })),
  );
  const [removed, setRemoved] = useState<{ line: Line; index: number } | null>(null);
  const undo = useRef<HTMLButtonElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const valid = lines.every((line) => quantityOf(line.draft) !== null);
  const subtotal = lines.reduce(
    (sum, line) => sum + line.eachPence * (quantityOf(line.draft) ?? 0),
    0,
  );
  const delivery = lines.length ? DELIVERY_PENCE : 0;

  useEffect(() => {
    if (removed) undo.current?.focus();
  }, [removed]);

  const updateLine = (slug: string, patch: Partial<Pick<Line, "draft" | "invalid">>) => {
    setLines((current) =>
      current.map((line) => (line.slug === slug ? { ...line, ...patch } : line)),
    );
  };
  return (
    <div className="mini-basket">
      <Drawer.Root>
        <Drawer.Trigger>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3 9h18l-2 11H5z" />
            <path d="M8 9V6a4 4 0 0 1 8 0v3" />
          </svg>
          Basket
          <Badge.Root>
            {" "}
            <Badge.Text>{lines.length}</Badge.Text>
            <span className="loam-VisuallyHidden">
              <Badge.Text>{lines.length === 1 ? "product" : "products"}</Badge.Text>
            </span>
          </Badge.Root>
        </Drawer.Trigger>
        <Drawer.Popup side="end">
          <div className="basket">
            <div className="head">
              <Drawer.Title>Your basket</Drawer.Title>
              <Drawer.Close ref={close}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
                <span className="loam-VisuallyHidden">Close basket</span>
              </Drawer.Close>
            </div>
            <ul className="lines" role="list">
              {lines.map((line, index) => (
                <li key={line.slug}>
                  <article aria-labelledby={`${instanceId}-mini-basket-${line.slug}-title`}>
                    <img
                      className="media"
                      src={`https://picsum.photos/id/${line.image}/240/240`}
                      alt=""
                      width="240"
                      height="240"
                    />
                    <h3 id={`${instanceId}-mini-basket-${line.slug}-title`}>
                      <a href={`/shop/${line.slug}`}>{line.name}</a>
                    </h3>
                    <p className="options">{line.options}</p>
                    <div className="control">
                      <Field.Root
                        invalid={Boolean(
                          line.invalid ? "Enter a whole quantity from 1 to 10." : null,
                        )}
                      >
                        <Field.Label className="loam-VisuallyHidden">
                          Quantity of {line.name}
                        </Field.Label>
                        <Field.Error>
                          {line.invalid ? "Enter a whole quantity from 1 to 10." : null}
                        </Field.Error>
                        <QuantityInput
                          name={`quantity-${line.slug}`}
                          value={line.draft}
                          required
                          onChange={(event) =>
                            updateLine(line.slug, {
                              draft: event.currentTarget.value,
                              invalid: false,
                            })
                          }
                          onBlur={() =>
                            updateLine(line.slug, { invalid: quantityOf(line.draft) === null })
                          }
                          min={1}
                          max={10}
                        />
                      </Field.Root>
                    </div>
                    <p className="total">
                      {quantityOf(line.draft) !== null ? (
                        <Price
                          value={(line.eachPence * Number(line.draft)) / 100}
                          currency="GBP"
                          locale="en-GB"
                        />
                      ) : (
                        "—"
                      )}
                    </p>
                    <div className="remove">
                      <Button
                        onClick={() => {
                          setRemoved({ line, index });
                          setLines((current) => current.filter((item) => item.slug !== line.slug));
                        }}
                      >
                        Remove<span className="loam-VisuallyHidden"> {line.name}</span>
                      </Button>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
            {lines.length === 0 && <p>Your basket is empty.</p>}
            {removed && (
              <div>
                <p role="status">{removed.line.name} removed.</p>
                <Button
                  ref={undo}
                  onClick={() => {
                    setLines((current) => {
                      const next = [...current];
                      next.splice(removed.index, 0, removed.line);
                      return next;
                    });
                    setRemoved(null);
                    close.current?.focus();
                  }}
                >
                  Undo removal
                </Button>
              </div>
            )}
            <dl className="summary">
              <div>
                <dt>Subtotal</dt>
                <dd>
                  {valid ? <Price value={subtotal / 100} currency="GBP" locale="en-GB" /> : "—"}
                </dd>
              </div>
              <div>
                <dt>Delivery</dt>
                <dd>
                  <Price value={delivery / 100} currency="GBP" locale="en-GB" />
                </dd>
              </div>
              <div>
                <dt>Total</dt>
                <dd aria-live="polite" aria-atomic="true">
                  <span className="loam-VisuallyHidden">Basket total: </span>
                  {valid ? (
                    <Price value={(subtotal + delivery) / 100} currency="GBP" locale="en-GB" />
                  ) : (
                    "Enter valid quantities"
                  )}
                </dd>
              </div>
            </dl>
            <div className="actions">
              {lines.length > 0 && valid && (
                <SignpostLink href="/checkout">Go to checkout</SignpostLink>
              )}
              <Drawer.Close>Continue shopping</Drawer.Close>
            </div>
          </div>
        </Drawer.Popup>
      </Drawer.Root>
    </div>
  );
}
