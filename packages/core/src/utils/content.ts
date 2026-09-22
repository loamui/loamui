import { Children, Fragment, isValidElement } from "react";
import type { ReactNode } from "react";

/** Empty strings, arrays and fragments do not constitute an error message. */
export function hasContent(children: ReactNode): boolean {
  return Children.toArray(children).some((child) => {
    if (typeof child === "string") return child.trim().length > 0;
    if (isValidElement<{ children?: ReactNode }>(child) && child.type === Fragment) {
      return hasContent(child.props.children);
    }
    return true;
  });
}
