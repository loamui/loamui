"use client";

import { Button, Menu } from "@loamui/core";
import "./recipe.css";

export default function Recipe() {
  return (
    <form className="split-button" action="/basket" method="post">
      <input type="hidden" name="product" value="beetroot-boltardy" />
      <span className="main">
        <Button type="submit">Add to basket</Button>
      </span>
      <Menu.Root>
        <Menu.Trigger>
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
          <span className="loam-VisuallyHidden">More ways to add</span>
        </Menu.Trigger>
        <Menu.Popup>
          <Menu.Item render={<button type="submit" name="then" value="basket" />}>
            Add and go to basket
          </Menu.Item>
          <Menu.Item render={<button type="submit" name="then" value="later" />}>
            Save for later
          </Menu.Item>
          <Menu.Item render={<button type="submit" name="then" value="wish-list" />}>
            Add to a wish list
          </Menu.Item>
        </Menu.Popup>
      </Menu.Root>
    </form>
  );
}
