"use client";

import { useId } from "react";
import { Time } from "@loamui/core";
import "./recipe.css";

export default function Recipe() {
  const instanceId = useId();
  return (
    <section className="summary-list" aria-labelledby={`${instanceId}-summary-list-title`}>
      <h2 id={`${instanceId}-summary-list-title`}>Your membership</h2>
      <dl>
        <div className="row">
          <dt>Name</dt>
          <dd className="value">Sarah Bloom</dd>
          <dd className="change">
            <a href="/account/name">
              Change<span className="loam-VisuallyHidden"> name</span>
            </a>
          </dd>
        </div>
        <div className="row">
          <dt>Email address</dt>
          <dd className="value">sarah.bloom@example.com</dd>
          <dd className="change">
            <a href="/account/email">
              Change<span className="loam-VisuallyHidden"> email address</span>
            </a>
          </dd>
        </div>
        <div className="row">
          <dt>Phone number</dt>
          <dd className="value">Not provided</dd>
          <dd className="change">
            <a href="/account/phone">
              Add<span className="loam-VisuallyHidden"> phone number</span>
            </a>
          </dd>
        </div>
        <div className="row">
          <dt>Plot</dt>
          <dd className="value">Bed 14, Ludlow field</dd>
          <dd className="change">
            <a href="/account/plot">
              Change<span className="loam-VisuallyHidden"> plot</span>
            </a>
          </dd>
        </div>
        <div className="row">
          <dt>Seed-swap interests</dt>
          <dd className="value">
            <ul role="list">
              <li>Vegetables</li>
              <li>Herbs</li>
              <li>Cut flowers</li>
            </ul>
          </dd>
          <dd className="change">
            <a href="/account/interests">
              Change<span className="loam-VisuallyHidden"> seed-swap interests</span>
            </a>
          </dd>
        </div>
        <div className="row">
          <dt>Renews</dt>
          <dd className="value">
            <Time value="2027-03-01" locale="en-GB" dateStyle="long" />
          </dd>
          <dd className="change">
            <a href="/account/renewal">
              Change<span className="loam-VisuallyHidden"> renewal</span>
            </a>
          </dd>
        </div>
      </dl>
    </section>
  );
}
