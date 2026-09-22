"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { Button } from "../Button/Button.js";
import { Input } from "../Input/Input.js";
import type { InputProps } from "../Input/Input.js";
import { cx } from "../../utils/cx.js";
import type { PartProps } from "../../utils/props.js";

/** The words the field says on its own, each with an English default. */
export interface PasswordInputLabels {
  /**
   * The toggle's name. Constant: the Button reports whether the password
   * is shown with `aria-pressed`, and a name that swapped as well would
   * say it twice. @default "Show password"
   */
  show?: ReactNode;
}

const DEFAULT_LABELS: Required<PasswordInputLabels> = {
  show: "Show password",
};

export interface PasswordInputProps extends Omit<InputProps, "type"> {
  labels?: PasswordInputLabels;
  /**
   * Props for the row that holds the box and the toggle
   * (`div.loam-PasswordInput`). `className`, `style`, `ref` and every other
   * prop land on the `<input>` itself.
   */
  wrapperProps?: Omit<PartProps<"div">, "children">;
}

/**
 * A password box with a toggle that shows what was typed.
 *
 * The box is the library's {@link Input} with `type="password"`, and the
 * toggle is a {@link Button} with visible words, not an eye icon alone.
 * Pressing it swaps the input to `type="text"`, so a long password can be
 * checked by reading it rather than retyped; the button's name stays the
 * same and `aria-pressed` carries the state, the one signal a toggle
 * button gives. Shown as text, the box is neither capitalised nor
 * spell-checked behind the user's back.
 *
 * Label it by composing {@link Field} — the control reads its id,
 * description and error wiring from the surrounding `Field.Root`. Pass
 * the autofill purpose yourself: `autoComplete="current-password"` to sign
 * in, `"new-password"` to make one up.
 *
 * ```tsx
 * <Field.Root>
 *   <Field.Label>Password</Field.Label>
 *   <PasswordInput name="password" autoComplete="current-password" />
 * </Field.Root>
 * ```
 */
export function PasswordInput({ labels, wrapperProps, ...rest }: PasswordInputProps) {
  const [shown, setShown] = useState(false);
  const showLabel = labels?.show ?? DEFAULT_LABELS.show;
  const { className: wrapperClassName, ...wrapper } = wrapperProps ?? {};
  return (
    <div className={cx("loam-PasswordInput", wrapperClassName)} {...wrapper}>
      <Input
        type={shown ? "text" : "password"}
        autoCapitalize="none"
        spellCheck={false}
        {...rest}
      />
      <Button type="button" aria-pressed={shown} onClick={() => setShown((s) => !s)}>
        {showLabel}
      </Button>
    </div>
  );
}
