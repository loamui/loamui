"use client";

import { Component, type ReactNode } from "react";

/** A failed optional preview or code chunk must not take down the gallery. */
export class ExampleLoadBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
