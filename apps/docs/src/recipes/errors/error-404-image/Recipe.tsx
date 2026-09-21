"use client";

import { useId } from "react";
import { SignpostLink } from "@loamui/core";
import "./recipe.css";

export default function Recipe() {
  const instanceId = useId();
  return (
    <section className="error-404-image" aria-labelledby={`${instanceId}-error-404-image-title`}>
      <div className="text">
        <p className="code">404</p>
        <h1 id={`${instanceId}-error-404-image-title`}>Nothing is growing here</h1>
        <p className="description">
          We looked under every pot. The page you asked for is not here: the link you followed may
          be out of date, or the page went when the new season’s catalogue replaced the old one.
        </p>
        <div className="actions">
          <SignpostLink href="/">Back to the home page</SignpostLink>
        </div>
      </div>
      <svg
        className="illustration"
        viewBox="0 0 240 200"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M70 110h100l-10 70H80z" />
        <rect x="62" y="98" width="116" height="12" rx="3" />
        <path className="soil" d="M84 110c10-6 62-6 72 0" />
        <path d="M120 98V52" />
        <path className="leaf" d="M120 74c-14 2-24-4-26-16 12-2 22 4 26 16z" />
        <path className="leaf" d="M120 62c10-8 22-8 30 0-8 8-20 10-30 0z" />
        <path className="wilt" d="M120 52c0-10 6-16 10-16" />
        <path className="ground" d="M20 180h200" />
        <path
          className="ground"
          d="M30 180c6-8 12-12 18-12M60 180c3-6 6-9 9-9M190 180c-6-8-12-12-18-12"
        />
      </svg>
    </section>
  );
}
