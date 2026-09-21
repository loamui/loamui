"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Button, Field, Price, QuantityInput } from "@loamui/core";
import "./recipe.css";

const UNIT_PRICE_PENCE = 280;

export default function Recipe() {
  const title = useId();
  const [draft, setDraft] = useState("2");
  const [error, setError] = useState(false);
  const [removed, setRemoved] = useState(false);
  const undo = useRef<HTMLButtonElement>(null);
  const quantityInput = useRef<HTMLInputElement>(null);
  const restoreFocus = useRef(false);
  const quantity = Number(draft);
  const valid = draft !== "" && Number.isInteger(quantity) && quantity >= 1 && quantity <= 10;

  useEffect(() => {
    if (removed) undo.current?.focus();
    else if (restoreFocus.current) {
      quantityInput.current?.focus();
      restoreFocus.current = false;
    }
  }, [removed]);

  if (removed)
    return (
      <div className="cart-line">
        <p role="status">Climbing bean ‘Blue Lake’ seeds removed from your basket.</p>
        <Button
          ref={undo}
          onClick={() => {
            restoreFocus.current = true;
            setRemoved(false);
          }}
        >
          Undo removal
        </Button>
      </div>
    );
  return (
    <article className="cart-line" aria-labelledby={title}>
      <div className="inner">
        <img
          className="media"
          src="https://picsum.photos/id/627/300/300"
          alt=""
          width="300"
          height="300"
        />
        <h3 id={title}>
          <a href="/seeds/climbing-bean-blue-lake">Climbing bean ‘Blue Lake’ seeds</a>
        </h3>
        <p className="options">Packet of 25 seeds</p>
        <div className="control">
          <Field.Root invalid={Boolean(error ? "Enter a whole quantity from 1 to 10." : null)}>
            <Field.Label className="loam-VisuallyHidden">
              Quantity of Climbing bean ‘Blue Lake’ seeds
            </Field.Label>
            <Field.Error>{error ? "Enter a whole quantity from 1 to 10." : null}</Field.Error>
            <QuantityInput
              name="quantity"
              ref={quantityInput}
              value={draft}
              min={1}
              max={10}
              required
              onChange={(event) => {
                setDraft(event.currentTarget.value);
                setError(false);
              }}
              onBlur={() => setError(!valid)}
            />
          </Field.Root>
        </div>
        <p className="total" aria-live="polite" aria-atomic="true">
          <span className="loam-VisuallyHidden">Line total: </span>
          {valid ? (
            <Price value={(quantity * UNIT_PRICE_PENCE) / 100} currency="GBP" locale="en-GB" />
          ) : (
            "—"
          )}
        </p>
        <p className="each">
          <Price value={UNIT_PRICE_PENCE / 100} currency="GBP" locale="en-GB">
            each
          </Price>
        </p>
        <div className="actions">
          <Button onClick={() => setRemoved(true)}>
            Remove<span className="loam-VisuallyHidden"> Climbing bean ‘Blue Lake’ seeds</span>
          </Button>
        </div>
      </div>
    </article>
  );
}
