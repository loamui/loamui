"use client";

import { useId } from "react";
import { Stepper } from "@loamui/core";
import "./recipe.css";

export default function Recipe() {
  const instanceId = useId();
  return (
    <section className="stepper-progress" aria-labelledby={`${instanceId}-stepper-progress-title`}>
      <header>
        <p className="eyebrow">Order HR-20417</p>
        <h2 id={`${instanceId}-stepper-progress-title`}>Your order is being packed</h2>
        <p>
          Placed on <time dateTime="2026-09-03T09:14">Thursday 3 September</time>: four packets and
          a hand fork, going to Ludlow.
        </p>
      </header>
      <Stepper.Root aria-label="Progress of order HR-20417">
        <Stepper.Step>
          <Stepper.Marker />
          <Stepper.Title>Order placed</Stepper.Title>
          <Stepper.Description>
            Paid by card at 09:14. The receipt is in your inbox.
          </Stepper.Description>
        </Stepper.Step>
        <Stepper.Step aria-current="step">
          <Stepper.Marker />
          <Stepper.Title>Being packed</Stepper.Title>
          <Stepper.Description>
            Picked from the seed store at Bromfield this morning and checked against your order.
          </Stepper.Description>
        </Stepper.Step>
        <Stepper.Step>
          <Stepper.Marker />
          <Stepper.Title>Dispatched</Stepper.Title>
          <Stepper.Description>
            We email the tracking number when Royal Mail collects, usually the same afternoon.
          </Stepper.Description>
        </Stepper.Step>
        <Stepper.Step>
          <Stepper.Marker />
          <Stepper.Title>Delivered</Stepper.Title>
          <Stepper.Description>
            Two working days after dispatch, through the letterbox.
          </Stepper.Description>
        </Stepper.Step>
      </Stepper.Root>
      <p className="back">
        <a href="/orders">Back to your orders</a>
      </p>
    </section>
  );
}
