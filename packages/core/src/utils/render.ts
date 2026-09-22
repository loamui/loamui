import { cloneElement, isValidElement } from "react";
import type { CSSProperties, ReactElement, ReactNode, Ref } from "react";
import { cx } from "./cx.js";

/**
 * Composition plumbing shared by compound components — the single merge
 * contract for attaching wiring props to a consumer-provided element:
 *
 * - event handlers: BOTH run — the element's own handler first, wiring second,
 *   so consumers can't accidentally disable wiring and wiring can't eat
 *   consumer events;
 * - `className`: concatenated;
 * - `style`: shallow-merged, wiring wins on conflicts (wiring styles such as
 *   `anchorName` are load-bearing);
 * - `aria-describedby` / `aria-labelledby`: token-list concatenated, the
 *   wiring's ids first, then the element's own, each id once;
 * - `ref`: composed — both receive the node;
 * - anything else: the element's own prop wins.
 */

/** A render target: an element to merge props onto, or a function of them. */
export type RenderProp<P> = ReactElement<Record<string, unknown>> | ((props: P) => ReactNode);

type AnyProps = Record<string, unknown>;

function isEventHandlerKey(key: string): boolean {
  return /^on[A-Z]/.test(key);
}

/** Attach one ref to a node; returns what detaches it. */
function attachRef<T>(ref: Ref<T>, node: T): () => void {
  if (typeof ref === "function") {
    // React 19: a ref callback may return its own cleanup, in which case it
    // is never called with null.
    const cleanup = ref(node);
    return typeof cleanup === "function" ? cleanup : () => ref(null);
  }
  if (ref) ref.current = node;
  return () => {
    if (ref) ref.current = null;
  };
}

/**
 * Compose two refs so both receive the node. The composed ref is a React 19
 * callback with cleanup, so a ref that subscribes on attach (a listener, an
 * observer) is unsubscribed on detach through it.
 */
export function composeRefs<T>(a: Ref<T> | undefined, b: Ref<T> | undefined): Ref<T> | undefined {
  if (!a) return b;
  if (!b) return a;
  return (node: T | null) => {
    if (node === null) {
      // Only a caller outside React reaches here: React honours the cleanup.
      attachRef(a, node);
      attachRef(b, node);
      return;
    }
    const detachA = attachRef(a, node);
    const detachB = attachRef(b, node);
    return () => {
      detachA();
      detachB();
    };
  };
}

const ARIA_LIST_KEYS = new Set(["aria-describedby", "aria-labelledby"]);

/**
 * Join id token-lists (`aria-describedby`, `aria-labelledby`) in the order
 * given, each id once; `undefined` when nothing is left.
 */
export function idList(...lists: Array<string | undefined>): string | undefined {
  const ids: string[] = [];
  for (const list of lists) {
    for (const id of list?.split(/\s+/) ?? []) {
      if (id && !ids.includes(id)) ids.push(id);
    }
  }
  return ids.length ? ids.join(" ") : undefined;
}

/** Merge wiring props with an element's own props (see contract above). */
export function mergeProps<W extends object, O extends object>(wiring: W, own: O): W & O {
  const wiringProps = wiring as AnyProps;
  const ownProps = own as AnyProps;
  // Start from the wiring and let own props in only when they are defined:
  // a `ref={undefined}` or `onClick={cond ? fn : undefined}` on the element
  // must not erase the wiring that makes the part work.
  const merged: AnyProps = { ...wiringProps };

  for (const key of Object.keys(ownProps)) {
    const w = wiringProps[key];
    const o = ownProps[key];
    if (o === undefined) continue;
    if (w === undefined) {
      merged[key] = o;
      continue;
    }

    if (isEventHandlerKey(key) && typeof w === "function" && typeof o === "function") {
      merged[key] = (...args: unknown[]) => {
        (o as (...a: unknown[]) => void)(...args);
        (w as (...a: unknown[]) => void)(...args);
      };
    } else if (key === "className") {
      merged[key] = cx(w as string, o as string);
    } else if (key === "style") {
      merged[key] = { ...(o as CSSProperties), ...(w as CSSProperties) };
    } else if (ARIA_LIST_KEYS.has(key)) {
      merged[key] = idList(w as string, o as string);
    } else if (key === "ref") {
      merged[key] = composeRefs(w as Ref<unknown>, o as Ref<unknown>);
    } else merged[key] = o;
  }

  return merged as W & O;
}

/** Render with merged props. ownedProps reserves coordinated identities, such as a Field control ID. */
export function renderWithProps<P extends object>(
  render: RenderProp<P>,
  props: P,
  ownedProps?: Partial<P>,
): ReactNode {
  if (typeof render === "function") {
    if (process.env.NODE_ENV !== "production" && /^[A-Z]/.test(render.name)) {
      console.error(
        `LoamUI: \`render\` received a component reference (\`render={${render.name}}\`). ` +
          `Pass an element instead — \`render={<${render.name} />}\` — or a function of the wiring props.`,
      );
    }
    return render({ ...props, ...ownedProps });
  }
  if (isValidElement<AnyProps>(render)) {
    // React 19: the element's ref is an ordinary prop and merges like one.
    return cloneElement(render, {
      ...mergeProps(props as AnyProps, render.props as AnyProps),
      ...ownedProps,
    });
  }
  return null;
}
