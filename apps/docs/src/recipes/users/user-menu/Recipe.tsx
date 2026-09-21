"use client";

import { useId } from "react";
import { Avatar, Menu } from "@loamui/core";
import "./recipe.css";

export default function Recipe() {
  const instanceId = useId();
  return (
    <Menu.Root className="user-menu">
      <Menu.Trigger>
        <Avatar.Root aria-hidden>
          <Avatar.Image src="https://picsum.photos/id/823/96/96" alt="" />
          <Avatar.Fallback>IH</Avatar.Fallback>
        </Avatar.Root>
        <span className="loam-VisuallyHidden">Account menu for Imogen Hartley</span>
      </Menu.Trigger>
      <Menu.Popup aria-labelledby={`${instanceId}-user-menu-account`}>
        <div className="account" id={`${instanceId}-user-menu-account`}>
          <strong>Imogen Hartley</strong>
          <span className="email">imogen@hedgerow.example</span>
        </div>
        <Menu.Separator />
        <Menu.Item href="/plot">Your plot</Menu.Item>
        <Menu.Item href="/orders">Orders</Menu.Item>
        <Menu.Item href="/membership">Membership</Menu.Item>
        <Menu.Separator />
        <form method="post" action="/sign-out">
          <Menu.Item render={<button type="submit">Sign out</button>} />
        </form>
      </Menu.Popup>
    </Menu.Root>
  );
}
