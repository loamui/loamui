"use client";

import { ToastViewport } from "./viewport/ToastViewport.js";
import type { ToastViewportLabels } from "./viewport/ToastViewport.js";
import { ToastRoot } from "./root/ToastRoot.js";
import { ToastTitle } from "./title/ToastTitle.js";
import { ToastDescription } from "./description/ToastDescription.js";
import { ToastAction } from "./action/ToastAction.js";
import { ToastClose } from "./close/ToastClose.js";
import type { ToastCloseLabels } from "./close/ToastClose.js";
import { useToast } from "./provider/ToastProviderContext.js";

export interface ToastsLabels extends ToastViewportLabels, ToastCloseLabels {}

export interface ToastsProps {
  /**
   * The words the viewport speaks: `region` names the landmark, `dismiss`
   * names each toast's close button.
   */
  labels?: ToastsLabels;
}

/**
 * The ready-made viewport: renders every active toast with title,
 * description, action and a dismiss button. Compose the parts yourself only
 * when this layout doesn't fit.
 */
export function Toasts({ labels }: ToastsProps) {
  const { toasts } = useToast();
  return (
    <ToastViewport labels={{ region: labels?.region }}>
      {toasts.map((toast) => (
        <ToastRoot key={toast.id} toast={toast}>
          <div className="content">
            {toast.title && <ToastTitle>{toast.title}</ToastTitle>}
            {toast.description && <ToastDescription>{toast.description}</ToastDescription>}
          </div>
          {toast.action && (
            <ToastAction onAction={toast.action.onClick}>{toast.action.label}</ToastAction>
          )}
          <ToastClose labels={{ dismiss: labels?.dismiss }} />
        </ToastRoot>
      ))}
    </ToastViewport>
  );
}
