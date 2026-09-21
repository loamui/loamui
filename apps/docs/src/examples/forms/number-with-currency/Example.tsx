"use client";

import { useId, useState } from "react";
import { Field, Input, Select } from "@loamui/core";
import "./example.css";

const CURRENCIES = [
  { code: "GBP", symbol: "£", name: "Pounds sterling" },
  { code: "EUR", symbol: "€", name: "Euros" },
  { code: "USD", symbol: "$", name: "US dollars" },
];

export default function Example() {
  const currencyId = useId();
  const [currency, setCurrency] = useState("GBP");
  const symbol = CURRENCIES.find((c) => c.code === currency)?.symbol;

  return (
    <Field.Root className="number-with-currency">
      <Field.Label>Amount</Field.Label>
      <Field.Description>
        Gift cards are sold in three currencies, from 10 to 200.
      </Field.Description>
      <div className="row">
        <div className="amount">
          <span aria-hidden="true">{symbol}</span>
          <Input className="currency-amount" name="amount" inputMode="decimal" autoComplete="off" />
        </div>
        <Field.Root id={currencyId}>
          <Select.Root
            name="currency"
            aria-label="Currency"
            value={currency}
            onChange={(e) => setCurrency(e.currentTarget.value)}
          >
            {CURRENCIES.map((c) => (
              <Select.Option key={c.code} value={c.code}>
                {c.code}
              </Select.Option>
            ))}
          </Select.Root>
        </Field.Root>
      </div>
    </Field.Root>
  );
}
