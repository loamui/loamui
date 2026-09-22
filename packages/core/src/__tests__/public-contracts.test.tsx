import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import {
  Avatar,
  Button,
  Checkbox,
  DateInput,
  Field,
  Input,
  QuantityInput,
  Radio,
  RadioGroup,
  Tabs,
} from "../index.js";

afterEach(cleanup);

describe("pillar audit reproductions", () => {
  it("server HTML links the rendered description and error to the input", () => {
    const html = renderToString(
      <Field.Root id="email" invalid>
        <Field.Label>Email</Field.Label>
        <Field.Description>Work email</Field.Description>
        <Field.Error>Enter your email</Field.Error>
        <Input aria-describedby="email-description email-error" />
      </Field.Root>,
    );
    const doc = new DOMParser().parseFromString(html, "text/html");
    const input = doc.querySelector("input")!;
    expect.soft(input.getAttribute("aria-describedby")).toBe("email-description email-error");
    expect.soft(input.getAttribute("aria-invalid")).toBe("true");
  });
  it("a supported input id retains the Field label association", () => {
    render(
      <Field.Root>
        <Field.Label>Email</Field.Label>
        <Input id="custom-email" />
      </Field.Root>,
    );
    expect(screen.getByRole("textbox")).toHaveAccessibleName("Email");
  });
  it("a supported description id retains the Field description association", () => {
    render(
      <Field.Root>
        <Field.Label>Email</Field.Label>
        <Field.Description id="custom-help">Work email</Field.Description>
        <Input />
      </Field.Root>,
    );
    expect(screen.getByRole("textbox")).toHaveAccessibleDescription("Work email");
  });
  it("an empty error message does not mark a field invalid", () => {
    render(
      <Field.Root>
        <Field.Label>Email</Field.Label>
        <Field.Error>{""}</Field.Error>
        <Input />
      </Field.Root>,
    );
    expect.soft(screen.getByRole("textbox")).not.toHaveAttribute("aria-invalid", "true");
    expect.soft(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
  it("Button render keeps the default non-submit behavior", async () => {
    const onSubmit = vi.fn((e) => e.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <Button render={<button />}>Cancel</Button>
      </form>,
    );
    await userEvent.setup().click(screen.getByRole("button", { name: "Cancel" }));
    expect(onSubmit).not.toHaveBeenCalled();
  });
  it("QuantityInput readOnly cannot be changed by its increment button", async () => {
    render(<QuantityInput aria-label="Quantity" readOnly defaultValue={2} />);
    await userEvent.setup().click(screen.getByRole("button", { name: "More" }));
    expect(screen.getByRole("spinbutton")).toHaveValue(2);
  });
  it("Tabs.List calls the consumer keyboard handler", () => {
    const handler = vi.fn();
    render(
      <Tabs.Root defaultValue="one">
        <Tabs.List onKeyDown={handler}>
          <Tabs.Tab value="one">One</Tabs.Tab>
          <Tabs.Tab value="two">Two</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="one">First</Tabs.Panel>
        <Tabs.Panel value="two">Second</Tabs.Panel>
      </Tabs.Root>,
    );
    fireEvent.keyDown(screen.getByRole("tab", { name: "One" }), { key: "Escape" });
    expect(handler).toHaveBeenCalledOnce();
  });
  it("Avatar retries when a failed image URL changes", () => {
    const { container, rerender } = render(
      <Avatar.Root role="img" aria-label="Jane Doe">
        <Avatar.Image src="/broken.png" alt="" />
        <Avatar.Fallback>JD</Avatar.Fallback>
      </Avatar.Root>,
    );
    fireEvent.error(container.querySelector("img")!);
    rerender(
      <Avatar.Root role="img" aria-label="Jane Doe">
        <Avatar.Image src="/valid.png" alt="" />
        <Avatar.Fallback>JD</Avatar.Fallback>
      </Avatar.Root>,
    );
    expect(container.querySelector("img")).toHaveAttribute("src", "/valid.png");
  });
  it("Avatar fallback preserves the full accessible name after image failure", () => {
    const { container } = render(
      <Avatar.Root role="img" aria-label="Jane Doe">
        <Avatar.Image src="/broken.png" alt="" />
        <Avatar.Fallback>JD</Avatar.Fallback>
      </Avatar.Root>,
    );
    fireEvent.error(container.querySelector("img")!);
    expect(screen.getByRole("img", { name: "Jane Doe" })).toBeInTheDocument();
  });
});

describe("composition edge cases", () => {
  it("keeps validation independent of message content", () => {
    const { rerender } = render(
      <Field.Root invalid>
        <Field.Label>Email</Field.Label>
        <Input />
        <Field.Error>{""}</Field.Error>
      </Field.Root>,
    );
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    rerender(
      <Field.Root>
        <Field.Label>Email</Field.Label>
        <Input />
        <Field.Error>Previous error</Field.Error>
      </Field.Root>,
    );
    expect(screen.getByRole("textbox")).not.toHaveAttribute("aria-invalid");
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("registers custom parts through component boundaries and removes only unmounted IDs", () => {
    function Help({ show }: { show: boolean }) {
      return (
        <>
          <Field.Description id="always">Always present.</Field.Description>
          {show && <Field.Description id="conditional">Conditional hint.</Field.Description>}
        </>
      );
    }
    function Example({ show }: { show: boolean }) {
      return (
        <Field.Root>
          <Field.Label>Email</Field.Label>
          <Help show={show} />
          <Field.Control render={<input id="custom-control" />} />
        </Field.Root>
      );
    }
    const { rerender } = render(<Example show />);
    expect(screen.getByRole("textbox")).toHaveAttribute("id", "custom-control");
    expect(screen.getByRole("textbox")).toHaveAccessibleName("Email");
    expect(screen.getByRole("textbox")).toHaveAccessibleDescription(
      "Always present. Conditional hint.",
    );
    rerender(<Example show={false} />);
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-describedby", "always");
  });

  it("preserves explicit submit targets and omits button type on anchors", async () => {
    const onSubmit = vi.fn((event) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <Button render={<button type="submit" />}>Submit</Button>
        <Button render={<a href="#details" />}>Details</Button>
      </form>,
    );
    await userEvent.setup().click(screen.getByRole("button", { name: "Submit" }));
    expect(onSubmit).toHaveBeenCalledOnce();
    expect(screen.getByRole("link")).not.toHaveAttribute("type");
  });

  it("keeps the non-submit default through a custom button component", async () => {
    function CustomButton(props: import("react").ComponentProps<"button">) {
      return <button {...props} />;
    }
    const onSubmit = vi.fn((event) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <Button render={<CustomButton />}>Cancel</Button>
      </form>,
    );
    await userEvent.setup().click(screen.getByRole("button", { name: "Cancel" }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("keeps a controlled read-only quantity in submitted form data without change events", async () => {
    const onChange = vi.fn();
    const { container } = render(
      <form>
        <QuantityInput
          aria-label="Quantity"
          name="quantity"
          readOnly
          value={2}
          onChange={onChange}
        />
      </form>,
    );
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "More" }));
    await user.click(screen.getByRole("button", { name: "Fewer" }));
    expect(onChange).not.toHaveBeenCalled();
    expect(new FormData(container.querySelector("form")!).get("quantity")).toBe("2");
  });
});

describe("empty group errors", () => {
  it.each([
    "",
    "   ",
    null,
    false,
    <>
      {""}
      {false}
    </>,
  ])("does not announce empty RadioGroup errors (%s)", (message) => {
    render(
      <RadioGroup.Root>
        <RadioGroup.Legend>Plan</RadioGroup.Legend>
        <Field.Item>
          <Field.Label>
            <Radio value="free" /> Free
          </Field.Label>
        </Field.Item>
        <RadioGroup.Error>{message}</RadioGroup.Error>
      </RadioGroup.Root>,
    );
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.getByRole("radiogroup")).not.toHaveAttribute("aria-invalid");
  });
  it("does not announce or invalidate empty DateInput errors", () => {
    render(
      <DateInput.Root>
        <DateInput.Legend>Date of birth</DateInput.Legend>
        <DateInput.Error>{""}</DateInput.Error>
        <DateInput.Fields>
          <DateInput.Day />
          <DateInput.Month />
          <DateInput.Year />
        </DateInput.Fields>
      </DateInput.Root>,
    );
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    for (const input of screen.getAllByRole("textbox"))
      expect(input).not.toHaveAttribute("aria-invalid");
  });
});

describe("group composition and server state", () => {
  it("keeps item descriptions separate while inheriting explicit validation", () => {
    render(
      <Field.Root invalid>
        <Field.Item>
          <Field.Label>
            <Checkbox /> Email updates
          </Field.Label>
          <Field.Description>Weekly.</Field.Description>
        </Field.Item>
        <Field.Item>
          <Field.Label>
            <Checkbox /> Product news
          </Field.Label>
          <Field.Description>Monthly.</Field.Description>
        </Field.Item>
      </Field.Root>,
    );
    const first = screen.getByRole("checkbox", { name: "Email updates" });
    const second = screen.getByRole("checkbox", { name: "Product news" });
    expect(first.id).not.toBe(second.id);
    expect(first).toHaveAccessibleDescription("Weekly.");
    expect(second).toHaveAccessibleDescription("Monthly.");
    expect(first).toHaveAttribute("aria-invalid", "true");
    expect(second).toHaveAttribute("aria-invalid", "true");
  });
  it("registers actual group message IDs", () => {
    render(
      <RadioGroup.Root invalid>
        <RadioGroup.Legend>Plan</RadioGroup.Legend>
        <RadioGroup.Description id="plan-hint">Choose one.</RadioGroup.Description>
        <RadioGroup.Error id="plan-error">Choose a plan.</RadioGroup.Error>
        <Field.Item>
          <Field.Label>
            <Radio value="free" /> Free
          </Field.Label>
        </Field.Item>
      </RadioGroup.Root>,
    );
    expect(screen.getByRole("radiogroup")).toHaveAttribute(
      "aria-describedby",
      "plan-hint plan-error",
    );
  });
  it("renders a date's explicit invalid parts and message links before hydration", () => {
    const html = renderToString(
      <DateInput.Root invalid={["year"]} aria-describedby="date-help">
        <DateInput.Legend>Date</DateInput.Legend>
        <DateInput.Description id="date-help">Use the year on the document.</DateInput.Description>
        <DateInput.Fields>
          <DateInput.Day />
          <DateInput.Year />
        </DateInput.Fields>
      </DateInput.Root>,
    );
    const doc = new DOMParser().parseFromString(html, "text/html");
    expect(doc.querySelector("fieldset")?.getAttribute("aria-describedby")).toBe("date-help");
    const inputs = doc.querySelectorAll("input");
    expect(inputs[0]?.hasAttribute("aria-invalid")).toBe(false);
    expect(inputs[1]?.getAttribute("aria-invalid")).toBe("true");
  });
});

it("selects an enabled fallback when the active uncontrolled tab becomes disabled", () => {
  function Example({ disabled }: { disabled: boolean }) {
    return (
      <Tabs.Root defaultValue="one">
        <Tabs.List>
          <Tabs.Tab value="one" disabled={disabled}>
            One
          </Tabs.Tab>
          <Tabs.Tab value="two">Two</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="one">First</Tabs.Panel>
        <Tabs.Panel value="two">Second</Tabs.Panel>
      </Tabs.Root>
    );
  }
  const { rerender } = render(<Example disabled={false} />);
  rerender(<Example disabled />);
  expect(screen.getByRole("tab", { name: "Two" })).toHaveAttribute("aria-selected", "true");
  expect(screen.getByRole("tab", { name: "Two" })).toHaveAttribute("tabindex", "0");
  expect(screen.getByRole("tabpanel")).toHaveTextContent("Second");
});
