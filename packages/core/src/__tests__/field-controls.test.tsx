import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import {
  Field,
  Fieldset,
  Checkbox,
  Radio,
  RadioGroup,
  Switch,
  Range,
  QuantityInput,
} from "../index.js";

afterEach(cleanup);

describe("Inline controls composed inside Field", () => {
  it("wires a Checkbox from Field context (label + describedby + detected invalid)", () => {
    render(
      <Field.Root invalid>
        <Field.Label>
          <Checkbox /> Accept the terms
        </Field.Label>
        <Field.Description>You must accept to continue.</Field.Description>
        <Field.Error>This field is required.</Field.Error>
      </Field.Root>,
    );

    const checkbox = screen.getByRole("checkbox");
    // Label association: clicking the label text finds this control.
    expect(screen.getByLabelText(/Accept the terms/)).toBe(checkbox);
    expect(checkbox).toHaveAttribute("aria-invalid", "true");
    const describedBy = checkbox.getAttribute("aria-describedby")?.split(" ") ?? [];
    expect(describedBy).toContain(screen.getByText(/must accept/).id);
    expect(describedBy).toContain(screen.getByRole("alert").id);
  });

  it("points a Field.Label at a labelled Checkbox and joins the Field's error to its description", () => {
    render(
      <Field.Root invalid>
        <Field.Label>Terms</Field.Label>
        <Field.Error>Accept the terms to continue</Field.Error>
        <>
          <Field.Label>
            <Checkbox /> I accept
          </Field.Label>
          <Field.Description>You can withdraw at any time.</Field.Description>
        </>
      </Field.Root>,
    );
    const checkbox = screen.getByRole("checkbox");
    // Both labels name the same input: the Field's and the row's own.
    expect(screen.getByLabelText("Terms")).toBe(checkbox);
    expect(screen.getByLabelText(/I accept/)).toBe(checkbox);
    expect(checkbox).toHaveAttribute("aria-invalid", "true");
    const describedBy = checkbox.getAttribute("aria-describedby")?.split(" ") ?? [];
    expect(describedBy).toContain(screen.getByText(/withdraw/).id);
    expect(describedBy).toContain(screen.getByRole("alert").id);
  });

  it("keeps a standalone Checkbox working with its own label", () => {
    render(
      <Field.Item>
        <Field.Label>
          <Checkbox /> Stay signed in
        </Field.Label>
      </Field.Item>,
    );
    expect(screen.getByLabelText("Stay signed in")).toBeInTheDocument();
  });

  it("keeps input and composed wrapper props on their own elements", () => {
    let node: HTMLInputElement | null = null;
    const { container } = render(
      <>
        <Field.Item {...{ className: "row" }}>
          <Field.Label>
            <Checkbox
              className="mine"
              ref={(el) => {
                node = el;
              }}
            />{" "}
            Email
          </Field.Label>
        </Field.Item>
        <Field.Item {...{ className: "radio-row", id: "radio-row" }}>
          <Field.Label>
            <Radio /> Post
          </Field.Label>
        </Field.Item>
        <Field.Item>
          <Field.Label>
            <Switch.Root {...{ className: "switch-row" }}>
              <Switch.Control />
              <Switch.Track>
                <Switch.Thumb />
              </Switch.Track>
            </Switch.Root>{" "}
            Push
          </Field.Label>
        </Field.Item>
        <Switch.Root {...{ className: "bare" }}>
          <Switch.Control aria-label="Bare" />
          <Switch.Track>
            <Switch.Thumb />
          </Switch.Track>
        </Switch.Root>
      </>,
    );
    expect(node).toBe(screen.getByLabelText("Email"));
    expect(screen.getByLabelText("Email")).toHaveClass("mine");
    expect(container.querySelector(".loam-Field.row")).toHaveClass("row");
    expect(container.querySelector(".loam-Field.radio-row")).toHaveClass("loam-Field", "radio-row");
    expect(container.querySelector(".loam-Switch-control.switch-row")).toHaveClass("switch-row");
    expect(screen.getByLabelText("Bare").parentElement).toHaveClass("loam-Switch-control", "bare");
  });

  it("puts aria-invalid on the radiogroup, never the radios", () => {
    render(
      <RadioGroup.Root invalid>
        <RadioGroup.Legend>Plan</RadioGroup.Legend>
        <RadioGroup.Error>Select a plan</RadioGroup.Error>
        <Field.Item>
          <Field.Label>
            <Radio value="a" /> A
          </Field.Label>
        </Field.Item>
      </RadioGroup.Root>,
    );
    const group = screen.getByRole("radiogroup");
    expect(group).toHaveAttribute("aria-invalid", "true");
    expect(group).toHaveAccessibleDescription("Error: Select a plan");
    expect(screen.getByRole("alert")).toHaveTextContent("Select a plan");
    expect(screen.getByRole("radio")).not.toHaveAttribute("aria-invalid");
  });

  it("opens required radio errors on submit, then clears them on selection or reset", () => {
    render(
      <form>
        <RadioGroup.Root name="plan">
          <RadioGroup.Legend>Plan</RadioGroup.Legend>
          <Field.Item>
            <Field.Label>
              <Radio value="free" required /> Free
            </Field.Label>
          </Field.Item>
          <Field.Item>
            <Field.Label>
              <Radio value="pro" /> Pro
            </Field.Label>
          </Field.Item>
        </RadioGroup.Root>
      </form>,
    );

    const group = screen.getByRole("radiogroup");
    const free = screen.getByLabelText("Free");
    fireEvent.invalid(free);
    expect(group).toHaveAttribute("aria-invalid", "true");

    fireEvent.click(screen.getByLabelText("Pro"));
    expect(group).not.toHaveAttribute("aria-invalid");

    fireEvent.invalid(free);
    fireEvent.reset(group.closest("form")!);
    expect(group).not.toHaveAttribute("aria-invalid");
  });

  it("wires a Switch.Control from Field context (label + describedby)", () => {
    render(
      <Field.Root>
        <Field.Label>
          <Switch.Root>
            <Switch.Control />
            <Switch.Track>
              <Switch.Thumb />
            </Switch.Track>
          </Switch.Root>{" "}
          Email notifications
        </Field.Label>
        <Field.Description>Sent at most once a day.</Field.Description>
      </Field.Root>,
    );

    const sw = screen.getByRole("switch");
    expect(screen.getByLabelText(/Email notifications/)).toBe(sw);
    expect(sw.getAttribute("aria-describedby")).toBe(screen.getByText(/once a day/).id);
  });

  it("wires a Range through Field.Control (stacked field)", () => {
    render(
      <Field.Root>
        <Field.Label>Volume</Field.Label>
        <Field.Description>Between 0 and 100.</Field.Description>
        <Field.Control render={<Range.Control />} />
      </Field.Root>,
    );

    const slider = screen.getByRole("slider");
    expect(screen.getByLabelText("Volume")).toBe(slider);
    expect(slider.getAttribute("aria-describedby")).toBe(screen.getByText(/Between 0 and 100/).id);
  });

  it("keeps standalone Switch and Range working with their own labels", () => {
    render(
      <>
        <Field.Root>
          <Field.Label>Brightness</Field.Label>
          <Range.Control defaultValue={40} />
        </Field.Root>
      </>,
    );
    expect(screen.getByLabelText("Brightness")).toHaveAttribute("type", "range");
  });

  it("detects disabled on the input rather than declaring it on a wrapper", () => {
    const { container } = render(
      <>
        <Field.Item>
          <Field.Label>
            <Checkbox disabled /> Off
          </Field.Label>
        </Field.Item>
        <Field.Item>
          <Field.Label>
            <Radio disabled /> Off
          </Field.Label>
        </Field.Item>
        <Field.Item>
          <Field.Label>
            <Switch.Root>
              <Switch.Control disabled />
              <Switch.Track>
                <Switch.Thumb />
              </Switch.Track>
            </Switch.Root>{" "}
            Off
          </Field.Label>
        </Field.Item>
        <Range.Control aria-label="Off" disabled />
      </>,
    );
    expect(container.querySelector("[data-disabled]")).toBeNull();
    expect(container.querySelectorAll("input:disabled")).toHaveLength(4);
  });
});

describe("Fieldset / grouped controls", () => {
  it("renders a native fieldset with a legend label", () => {
    render(
      <Fieldset.Root>
        <Fieldset.Legend>Notifications</Fieldset.Legend>
        <Field.Item>
          <Field.Label>
            <Checkbox /> Email
          </Field.Label>
        </Field.Item>
        <Field.Item>
          <Field.Label>
            <Checkbox /> SMS
          </Field.Label>
        </Field.Item>
      </Fieldset.Root>,
    );
    // The group is exposed via native fieldset/legend semantics.
    const group = screen.getByRole("group", { name: "Notifications" });
    expect(group.tagName).toBe("FIELDSET");
  });

  it("marks an optional group in words the Root's labels supply", () => {
    render(
      <>
        <Fieldset.Root>
          <Fieldset.Legend optional>Interests</Fieldset.Legend>
        </Fieldset.Root>
        <Fieldset.Root labels={{ optional: "(facultatif)" }}>
          <Fieldset.Legend optional>Centres d'intérêt</Fieldset.Legend>
        </Fieldset.Root>
      </>,
    );
    expect(screen.getByRole("group", { name: "Interests (optional)" })).toBeInTheDocument();
    expect(
      screen.getByRole("group", { name: "Centres d'intérêt (facultatif)" }),
    ).toBeInTheDocument();
  });

  it("RadioGroup labels its options with a native fieldset/legend and describes them", () => {
    render(
      <RadioGroup.Root name="plan">
        <RadioGroup.Legend optional>Plan</RadioGroup.Legend>
        <RadioGroup.Description>You can change it later.</RadioGroup.Description>
        <Field.Item>
          <Field.Label>
            <Radio value="free" /> Free
          </Field.Label>
        </Field.Item>
        <Field.Item>
          <Field.Label>
            <Radio value="pro" /> Pro
          </Field.Label>
        </Field.Item>
      </RadioGroup.Root>,
    );
    const group = screen.getByRole("radiogroup", { name: "Plan (optional)" });
    expect(group.tagName).toBe("FIELDSET");
    expect(group).toHaveAccessibleDescription("You can change it later.");
    expect(group).not.toHaveAttribute("aria-invalid");
    expect(screen.getAllByRole("radio")).toHaveLength(2);
  });

  it("says a RadioGroup's own words in the language its labels give it", () => {
    render(
      <RadioGroup.Root invalid labels={{ optional: "(facultatif)", errorPrefix: "Erreur : " }}>
        <RadioGroup.Legend optional>Formule</RadioGroup.Legend>
        <RadioGroup.Error>Choisissez une formule</RadioGroup.Error>
        <Field.Item>
          <Field.Label>
            <Radio value="a" /> A
          </Field.Label>
        </Field.Item>
      </RadioGroup.Root>,
    );
    expect(
      screen.getByRole("radiogroup", { name: "Formule (facultatif)" }),
    ).toHaveAccessibleDescription("Erreur : Choisissez une formule");
  });

  it("shares the group name with Radios at any nesting depth (context, not cloning)", () => {
    render(
      <RadioGroup.Root name="plan" defaultValue="pro">
        <RadioGroup.Legend>Plan</RadioGroup.Legend>
        <Field.Item>
          <Field.Label>
            <Radio value="free" /> Free
          </Field.Label>
        </Field.Item>
        <div>
          <Field.Item>
            <Field.Label>
              <Radio value="pro" /> Pro
            </Field.Label>
          </Field.Item>
        </div>
      </RadioGroup.Root>,
    );
    const radios = screen.getAllByRole("radio") as HTMLInputElement[];
    expect(radios.map((r) => r.name)).toEqual(["plan", "plan"]);
    expect(screen.getByLabelText("Pro")).toBeChecked();
    expect(screen.getByLabelText("Free")).not.toBeChecked();
  });

  it("forwards ref and rest to the group's fieldset and lays it out by orientation", () => {
    let node: HTMLFieldSetElement | null = null;
    render(
      <RadioGroup.Root
        orientation="horizontal"
        id="contact"
        ref={(el) => {
          node = el;
        }}
      >
        <RadioGroup.Legend>Contact</RadioGroup.Legend>
        <Field.Item>
          <Field.Label>
            <Radio value="email" /> Email
          </Field.Label>
        </Field.Item>
      </RadioGroup.Root>,
    );
    const group = screen.getByRole("radiogroup", { name: "Contact" });
    expect(node).toBe(group);
    expect(group).toHaveAttribute("id", "contact");
    expect(group).toHaveAttribute("data-orientation", "horizontal");
    expect(group).toHaveClass("loam-RadioGroup", "loam-Fieldset");
  });
});

describe("QuantityInput naming", () => {
  it("names its buttons from labels and reports a count with no name in development", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      render(<QuantityInput labels={{ decrement: "Moins", increment: "Plus" }} />);
      expect(screen.getByRole("button", { name: "Moins" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Plus" })).toBeInTheDocument();
      expect(error).toHaveBeenCalledWith(expect.stringContaining("no accessible name"));
    } finally {
      error.mockRestore();
    }
  });

  it("is quiet when a Field.Label or aria-label names it", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      render(
        <>
          <Field.Root>
            <Field.Label>Seats</Field.Label>
            <QuantityInput />
          </Field.Root>
          <QuantityInput aria-label="Guests" />
        </>,
      );
      expect(error).not.toHaveBeenCalled();
    } finally {
      error.mockRestore();
    }
  });
});

it.each([
  { name: "Checkbox", Control: Checkbox, role: "checkbox" },
  { name: "Radio", Control: Radio, role: "radio" },
])("keeps the Field label connected to a $name with an explicit ID", ({ Control, role }) => {
  function Example({ id }: { id: string }) {
    return (
      <Field.Root>
        <Field.Label>Choice</Field.Label>
        <Control id={id} />
      </Field.Root>
    );
  }
  const { rerender } = render(<Example id="first-choice" />);
  expect(screen.getByRole(role)).toHaveAccessibleName("Choice");
  rerender(<Example id="next-choice" />);
  expect(screen.getByRole(role)).toHaveAttribute("id", "next-choice");
  expect(screen.getByRole(role)).toHaveAccessibleName("Choice");
});
