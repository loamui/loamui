"use client";

import { isValidElement } from "react";
import { renderWithProps } from "../../../utils/render.js";
import type { RenderProp } from "../../../utils/render.js";
import { useFieldContext } from "../root/FieldRootContext.js";
import { useFieldControlProps } from "../root/FieldRootContext.js";

export interface FieldControlRenderProps {
  id: string;
  "aria-describedby": string | undefined;
  "aria-invalid": true | undefined;
}

export interface FieldControlProps {
  /**
   * The control to render. Either an element to clone (`render={<Input />}`)
   * or a function that receives the accessibility props to spread.
   */
  render: RenderProp<FieldControlRenderProps>;
}

export function FieldControl({ render }: FieldControlProps) {
  const ctx = useFieldContext("Field.Control");

  const ownId = isValidElement<{ id?: string }>(render) ? render.props.id : undefined;
  const field = useFieldControlProps(undefined, ownId);
  const controlProps: FieldControlRenderProps = {
    id: field.id ?? ctx.fieldId,
    "aria-describedby": ctx.describedBy,
    "aria-invalid": ctx.invalid || undefined,
  };

  return <>{renderWithProps(render, controlProps, { id: controlProps.id })}</>;
}
