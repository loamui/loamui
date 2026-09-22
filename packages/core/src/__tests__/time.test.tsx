import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { axe } from "vitest-axe";

import { Time } from "../components/Time/index.js";

afterEach(cleanup);

const axeOptions = { rules: { "color-contrast": { enabled: false } } };

describe("Time", () => {
  it("writes the date for people and keeps the ISO string for machines", () => {
    const { container } = render(<Time value="2026-08-12" locale="en-GB" dateStyle="medium" />);
    const time = container.querySelector("time")!;
    expect(time).toHaveClass("loam-Time");
    expect(time).toHaveAttribute("datetime", "2026-08-12");
    expect(time).toHaveTextContent(/^12 Aug 2026$/);
  });

  it("writes a calendar date as the day it names, whatever the zone", () => {
    const { container } = render(<Time value="2026-08-12" locale="en-GB" dateStyle="full" />);
    expect(container.querySelector("time")).toHaveTextContent(/^Wednesday, 12 August 2026$/);
  });

  it("writes the time only when asked", () => {
    const { container } = render(
      <>
        <Time value="2026-08-12" />
        <Time value="2026-08-12T14:30:00Z" timeStyle="short" />
      </>,
    );
    const [date, time] = Array.from(container.querySelectorAll("time"));
    expect(date).toHaveTextContent(/^Aug 12, 2026$/);
    expect(time).toHaveTextContent(/^\d{1,2}:\d{2}\s?(AM|PM)$/);
  });

  it("writes the distance from a fixed reference moment", () => {
    const { container } = render(
      <>
        <Time value="2026-08-12" relative={{ now: "2026-08-15" }} />
        <Time value="2026-08-12T12:00:00Z" relative={{ now: "2026-08-12T10:00:00Z" }} />
        <Time value="2026-08-12" relative={{ now: new Date("2026-08-12") }} />
      </>,
    );
    const [past, future, same] = Array.from(container.querySelectorAll("time"));
    expect(past).toHaveTextContent(/^3 days ago$/);
    expect(past).toHaveAttribute("datetime", "2026-08-12");
    expect(future).toHaveTextContent(/^in 2 hours$/);
    expect(same).toHaveTextContent(/^now$/);
  });

  it("lets children replace the words but not the dateTime", () => {
    const { container } = render(
      <Time value="2026-08-11" relative={{ now: "2026-08-12" }}>
        Yesterday
      </Time>,
    );
    const time = container.querySelector("time")!;
    expect(time).toHaveTextContent(/^Yesterday$/);
    expect(time).toHaveAttribute("datetime", "2026-08-11");
  });

  it("takes a Date and writes its ISO form", () => {
    const { container } = render(<Time value={new Date("2026-08-12T14:30:00Z")} />);
    expect(container.querySelector("time")).toHaveAttribute("datetime", "2026-08-12T14:30:00.000Z");
  });

  it("forwards native <time> attributes", () => {
    const { container } = render(<Time value="2026-08-12" id="published" lang="en-GB" />);
    const time = container.querySelector("time")!;
    expect(time).toHaveAttribute("id", "published");
    expect(time).toHaveAttribute("lang", "en-GB");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <p>
        Published <Time value="2026-08-12" locale="en-GB" />, updated{" "}
        <Time value="2026-08-12" relative={{ now: "2026-08-15" }} />
      </p>,
    );
    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });
});

describe("Time rounding and zone", () => {
  it("chooses a unit only once a whole one has passed, then rounds within it", () => {
    const { container } = render(
      <>
        <Time value="2026-08-12T22:00:00Z" relative={{ now: "2026-08-12T10:00:00Z" }} />
        <Time value="2026-02-10" relative={{ now: "2026-08-12" }} />
        <Time value="2026-08-12T09:15:00Z" relative={{ now: "2026-08-12T10:00:00Z" }} />
      </>,
    );
    const [twelveHours, sixMonths, fortyFiveMinutes] = Array.from(
      container.querySelectorAll("time"),
    );
    expect(twelveHours).toHaveTextContent("in 12 hours");
    expect(sixMonths).toHaveTextContent("6 months ago");
    expect(fortyFiveMinutes).toHaveTextContent("45 minutes ago");
  });

  it("writes a moment in the page's zone, so server and browser agree", () => {
    const { container } = render(
      <>
        <Time value="2026-08-12T23:30:00Z" timeStyle="short" timeZone="UTC" />
        <Time value="2026-08-12T23:30:00Z" timeStyle="short" timeZone="America/Los_Angeles" />
      </>,
    );
    const [utc, la] = Array.from(container.querySelectorAll("time"));
    expect(utc).toHaveTextContent("11:30 PM");
    expect(la).toHaveTextContent("4:30 PM");
  });
});
