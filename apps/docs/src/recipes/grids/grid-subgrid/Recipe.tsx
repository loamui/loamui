import { useId } from "react";
import { Card, SignpostLink, VisuallyHidden } from "@loamui/core";
import "./recipe.css";

export default function Recipe() {
  const instanceId = useId();
  return (
    <div className="grid-subgrid">
      <ul role="list">
        <Card
          render={
            <li className="workshop" aria-labelledby={`${instanceId}-grid-subgrid-seed-saving`} />
          }
        >
          <div className="head">
            <h3 id={`${instanceId}-grid-subgrid-seed-saving`}>Seed saving</h3>
            <p className="when">
              <time dateTime="2026-09-19T10:00">Saturday 19 September 2026, 10am</time>
            </p>
          </div>
          <div className="description">
            <p>
              Which crops to save from first, isolation distances, and cleaning, drying and storing
              what you gather. Bring a crop you want to keep.
            </p>
          </div>
          <div className="actions">
            <SignpostLink href="/workshops/seed-saving">
              Book a place<VisuallyHidden> – Seed saving</VisuallyHidden>
            </SignpostLink>
          </div>
        </Card>
        <Card
          render={
            <li className="workshop" aria-labelledby={`${instanceId}-grid-subgrid-grafting`} />
          }
        >
          <div className="head">
            <h3 id={`${instanceId}-grid-subgrid-grafting`}>Grafting fruit trees</h3>
            <p className="when">
              <time dateTime="2027-02-06T10:00">Saturday 6 February 2027, 10am</time>
            </p>
          </div>
          <div className="description">
            <p>
              Whip-and-tongue grafting onto local rootstocks. Everyone takes home two trees on the
              rootstock of their choice, labelled and wrapped.
            </p>
          </div>
          <div className="actions">
            <SignpostLink href="/workshops/grafting">
              Book a place<VisuallyHidden> – Grafting fruit trees</VisuallyHidden>
            </SignpostLink>
          </div>
        </Card>
        <Card
          render={
            <li
              className="workshop"
              aria-labelledby={`${instanceId}-grid-subgrid-winter-pruning`}
            />
          }
        >
          <div className="head">
            <h3 id={`${instanceId}-grid-subgrid-winter-pruning`}>Winter pruning</h3>
            <p className="when">
              <time dateTime="2027-01-17T13:00">Sunday 17 January 2027, 1pm</time>
            </p>
          </div>
          <div className="description">
            <p>Apples and pears in the member orchard, in the cold, with a flask.</p>
          </div>
          <div className="actions">
            <SignpostLink href="/workshops/winter-pruning">
              Book a place<VisuallyHidden> – Winter pruning</VisuallyHidden>
            </SignpostLink>
          </div>
        </Card>
      </ul>
    </div>
  );
}
