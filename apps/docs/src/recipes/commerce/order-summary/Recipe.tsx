"use client";

import { useId } from "react";
import { Price, SignpostLink } from "@loamui/core";
import "./recipe.css";

export default function Recipe() {
  const instanceId = useId();
  return (
    <section className="order-summary" aria-labelledby={`${instanceId}-order-summary-title`}>
      <h2 id={`${instanceId}-order-summary-title`}>Your order</h2>
      <dl>
        <div className="row">
          <dt>Subtotal</dt>
          <dd className="value">
            <Price value={46.5} currency="GBP" />
          </dd>
        </div>
        <div className="row">
          <dt>Delivery</dt>
          <dd className="value">
            <Price value={3.99} currency="GBP" />
          </dd>
          <dd className="note">Royal Mail 48, arriving Thursday 10 September. Free over £50.</dd>
          <dd className="change">
            <a href="/basket/delivery">
              Change<span className="loam-VisuallyHidden"> delivery</span>
            </a>
          </dd>
        </div>
        <div className="row">
          <dt>Member discount</dt>
          <dd className="value">
            <Price value={-4.65} currency="GBP" />
          </dd>
        </div>
        <div className="row total">
          <dt>Total</dt>
          <dd className="value">
            <Price value={45.84} currency="GBP" />
          </dd>
        </div>
      </dl>
      <div className="actions">
        <SignpostLink href="/checkout/payment">Continue to payment</SignpostLink>
        <a href="/basket">Back to your basket</a>
      </div>
    </section>
  );
}
