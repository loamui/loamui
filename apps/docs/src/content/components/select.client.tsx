"use client";

import { Field, Select } from "@loamui/core";

const countryOptions = (
  <>
    <option>Canada</option>
    <option>United Kingdom</option>
    <option>United States</option>
  </>
);

export function SelectBasicDemo() {
  return (
    <div style={{ maxInlineSize: "20rem", inlineSize: "100%" }}>
      <Field.Root>
        <Field.Label>Country</Field.Label>
        <Select.Root>{countryOptions}</Select.Root>
      </Field.Root>
    </div>
  );
}

export function SelectPlaceholderDemo() {
  return (
    <div style={{ maxInlineSize: "20rem", inlineSize: "100%" }}>
      <Field.Root>
        <Field.Label>Country</Field.Label>
        <Select.Root>
          <Select.Option value="" disabled>
            Pick a country
          </Select.Option>
          <Select.Option value="ca">Canada</Select.Option>
          <Select.Option value="uk">United Kingdom</Select.Option>
          <Select.Option value="us">United States</Select.Option>
        </Select.Root>
      </Field.Root>
    </div>
  );
}

export function SelectGroupsDemo() {
  return (
    <div style={{ maxInlineSize: "20rem", inlineSize: "100%" }}>
      <Field.Root>
        <Field.Label>Instrument</Field.Label>
        <Select.Root>
          <Select.OptGroup label="Strings">
            <Select.Option>Violin</Select.Option>
            <Select.Option>Cello</Select.Option>
          </Select.OptGroup>
          <Select.OptGroup label="Brass">
            <Select.Option>Trumpet</Select.Option>
            <Select.Option disabled>Tuba (unavailable)</Select.Option>
          </Select.OptGroup>
        </Select.Root>
      </Field.Root>
    </div>
  );
}

export function SelectErrorDemo() {
  return (
    <div style={{ maxInlineSize: "20rem", inlineSize: "100%" }}>
      <Field.Root invalid>
        <Field.Label>Country</Field.Label>
        <Field.Error>Select a country</Field.Error>
        <Select.Root>
          <Select.Option value="" disabled>
            Pick a country
          </Select.Option>
          {countryOptions}
        </Select.Root>
      </Field.Root>
    </div>
  );
}

export function SelectDescriptionDemo() {
  return (
    <div style={{ maxInlineSize: "20rem", inlineSize: "100%" }}>
      <Field.Root>
        <Field.Label>Country</Field.Label>
        <Field.Description>Where you are resident for tax.</Field.Description>
        <Select.Root>
          <Select.Option>United States</Select.Option>
          <Select.Option>Canada</Select.Option>
        </Select.Root>
      </Field.Root>
    </div>
  );
}
