"use client";

import { useState } from "react";
import { Menu } from "@loamui/core";
import "./recipe.css";

const LANGUAGES = [
  { code: "en", short: "EN", name: "English" },
  { code: "cy", short: "CY", name: "Cymraeg" },
  { code: "fr", short: "FR", name: "Français" },
  { code: "de", short: "DE", name: "Deutsch" },
  { code: "nl", short: "NL", name: "Nederlands" },
];

export default function Recipe() {
  const [value, setValue] = useState("en");
  const current = LANGUAGES.find((language) => language.code === value) ?? LANGUAGES[0]!;

  return (
    <Menu.Root className="language-picker">
      <Menu.Trigger>
        <span className="loam-VisuallyHidden">Language: </span>
        <span className="code" aria-hidden="true">
          {current.short}
        </span>
        <span lang={current.code}>{current.name}</span>
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M4 6l4 4 4-4" />
        </svg>
      </Menu.Trigger>
      <Menu.Popup>
        <Menu.RadioGroup value={value} onValueChange={setValue}>
          <Menu.GroupLabel>Language</Menu.GroupLabel>
          {LANGUAGES.map((language) => (
            <Menu.RadioItem key={language.code} value={language.code} closeOnClick>
              <span className="code" aria-hidden="true">
                {language.short}
              </span>
              <span lang={language.code}>{language.name}</span>
            </Menu.RadioItem>
          ))}
        </Menu.RadioGroup>
      </Menu.Popup>
    </Menu.Root>
  );
}
