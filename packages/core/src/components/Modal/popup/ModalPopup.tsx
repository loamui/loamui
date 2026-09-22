"use client";

import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";
import { useDialogContext, useDialogPopup } from "../../../hooks/use-dialog.js";
import { COMPONENT } from "../root/ModalRootContext.js";

export interface ModalPopupProps extends Omit<PartProps<"dialog">, "open"> {
  /**
   * Renders an alert dialog (`role="alertdialog"`): a confirmation that
   * interrupts the user and cannot be light-dismissed. Clicking the backdrop
   * does nothing; only Escape or an explicit choice closes it. Pair with a
   * Title and Description, and put `autoFocus` on the least-destructive
   * action so it is the default answer.
   */
  alert?: boolean;
}

export function ModalPopup({
  alert = false,
  className,
  children,
  ref,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  ...rest
}: ModalPopupProps) {
  const ctx = useDialogContext(COMPONENT, "Popup");
  const dialogProps = useDialogPopup(ctx, {
    ref,
    lightDismiss: !alert,
    label: ariaLabel,
    labelledBy: ariaLabelledBy,
    describedBy: ariaDescribedBy,
  });

  return (
    // The wiring below wins over rest (CONTRIBUTING: one merge contract).
    <dialog
      {...rest}
      {...dialogProps}
      // Missing from React's typings; lowercase passes through as an attribute.
      // "closerequest" = Escape closes, backdrop clicks don't: the native
      // spelling of an alert dialog's dismissal contract.
      {...({ closedby: alert ? "closerequest" : "any" } as object)}
      role={alert ? "alertdialog" : undefined}
      className={cx("loam-Modal-popup", className)}
    >
      {children}
    </dialog>
  );
}
