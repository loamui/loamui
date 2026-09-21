"use client";

import { useEffect, useState } from "react";
import { Button, Progress } from "@loamui/core";
import "./recipe.css";

const PHOTOS = 5;

export default function Recipe() {
  // null while idle; the percentage while an upload is under way.
  const [percent, setPercent] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const uploading = percent !== null;

  // Stands in for the request's progress events: a real upload reports
  // through XMLHttpRequest's upload.onprogress or a streamed fetch.
  useEffect(() => {
    if (!uploading) return;
    const timer = setInterval(() => {
      setPercent((current) => (current === null ? null : Math.min(100, current + 4)));
    }, 100);
    return () => clearInterval(timer);
  }, [uploading]);

  // The full bar is left in view for a moment before the button comes back.
  useEffect(() => {
    if (percent !== 100) return;
    const timer = setTimeout(() => {
      setPercent(null);
      setDone(true);
    }, 400);
    return () => clearTimeout(timer);
  }, [percent]);

  return (
    <div className="button-with-progress">
      <span className="stack">
        <Button
          disabled={uploading}
          onClick={() => {
            setDone(false);
            setPercent(0);
          }}
        >
          {uploading ? `Uploading ${PHOTOS} photos…` : `Upload ${PHOTOS} photos`}
        </Button>
        {uploading && (
          <span className="bar">
            <Progress
              size="sm"
              value={percent}
              aria-label="Upload progress"
              labels={{ value: (n) => `${n}% uploaded` }}
            />
          </span>
        )}
      </span>
      <p role="status">{done ? `${PHOTOS} photos uploaded.` : ""}</p>
    </div>
  );
}
