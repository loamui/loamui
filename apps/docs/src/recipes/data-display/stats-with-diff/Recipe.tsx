import { Card, Price } from "@loamui/core";
import "./recipe.css";

/** The change on August as a whole percentage; negative is down. */
function Change({ percent }: { percent: number }) {
  const up = percent >= 0;
  return (
    <dd className="diff" data-direction={up ? "up" : "down"}>
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d={up ? "M3 11l5-5 5 5" : "M3 5l5 5 5-5"} />
      </svg>
      <span className="loam-VisuallyHidden">{up ? "Up" : "Down"}</span>{" "}
      <span className="change">{Math.abs(percent)}%</span> on August
    </dd>
  );
}

export default function Recipe() {
  return (
    <div className="stats-with-diff" role="group" aria-label="September so far, against August">
      <Card render={<dl className="stat" />}>
        <dt>Sales</dt>
        <dd className="value">
          <Price value={24145} currency="GBP" locale="en-GB" />
        </dd>
        <Change percent={9} />
      </Card>
      <Card render={<dl className="stat" />}>
        <dt>Orders posted</dt>
        <dd className="value">2,318</dd>
        <Change percent={12} />
      </Card>
      <Card render={<dl className="stat" />}>
        <dt>New members</dt>
        <dd className="value">186</dd>
        <Change percent={-4} />
      </Card>
      <Card render={<dl className="stat" />}>
        <dt>Seed swaps</dt>
        <dd className="value">57</dd>
        <Change percent={31} />
      </Card>
    </div>
  );
}
