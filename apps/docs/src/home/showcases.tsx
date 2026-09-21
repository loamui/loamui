"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import { Avatar, Badge, Button, Card, Checkbox, Field, Input, Select } from "@loamui/core";
import "@/home/home-demo.css";
import { IconBell, IconBellOff } from "@tabler/icons-react";

/** Interactive "settings" card that shows real LoamUI components in the hero. */
export function HeroShowcase() {
  const [notify, setNotify] = useState(true);
  const [name, setName] = useState("jamie@acme.com");
  const [saved, setSaved] = useState({ name: "jamie@acme.com", notify: true });
  const [message, setMessage] = useState("");

  return (
    <Card>
      <form
        className="site-SettingsDemo"
        aria-label="Demo account settings"
        onSubmit={(event) => {
          event.preventDefault();
          setSaved({ name, notify });
          setMessage("Changes saved for this demo.");
        }}
        onReset={(event) => {
          event.preventDefault();
          setName(saved.name);
          setNotify(saved.notify);
          setMessage("Unsaved changes discarded.");
        }}
      >
        <header>
          <Avatar.Root role="img" aria-label="Jamie Rivera">
            <Avatar.Fallback>JR</Avatar.Fallback>
          </Avatar.Root>
          <div>
            <strong>Jamie Rivera</strong>
            <small>Product designer</small>
          </div>
          <div
            style={
              {
                marginInlineStart: "auto",
                "--loam-context": "primary",
              } as CSSProperties
            }
          >
            <Badge.Root>
              <Badge.Text>Pro</Badge.Text>
            </Badge.Root>
          </div>
        </header>

        <Field.Root>
          <Field.Label>Work email</Field.Label>
          <Input
            name="email"
            type="email"
            required
            value={name}
            onChange={(event) => {
              setName(event.currentTarget.value);
              setMessage("");
            }}
          />
        </Field.Root>

        <div className="row">
          <Field.Item>
            <Field.Label>
              <Checkbox
                name="notifications"
                checked={notify}
                onChange={(event) => {
                  setNotify(event.currentTarget.checked);
                  setMessage("");
                }}
              />{" "}
              Email notifications
            </Field.Label>
          </Field.Item>
        </div>
        <div className="row">
          <span className="label">Notifications</span>
          <span
            style={
              {
                "--loam-context": saved.notify ? "primary" : undefined,
              } as CSSProperties
            }
          >
            <Badge.Root>
              {saved.notify ? <IconBell aria-hidden /> : <IconBellOff aria-hidden />}
              <Badge.Text>{saved.notify ? "Notifications on" : "Muted"}</Badge.Text>
            </Badge.Root>
          </span>
        </div>

        <footer>
          <Button type="submit">Save changes</Button>
          <Button type="reset">Cancel</Button>
        </footer>
        <p className="note">Try the controls. Changes stay on this page.</p>
        <p role="status">{message}</p>
      </form>
    </Card>
  );
}

export function ContextShowcase() {
  const [context, setContext] = useState("primary");
  const [space, setSpace] = useState("wide");
  const [selected, setSelected] = useState(true);

  return (
    <div className="site-ContextDemo">
      <div className="controls">
        <Field.Root>
          <Field.Label>Region meaning</Field.Label>
          <Select.Root value={context} onChange={(event) => setContext(event.currentTarget.value)}>
            <Select.Option value="primary">Neutral</Select.Option>
            <Select.Option value="success">Success</Select.Option>
            <Select.Option value="danger">Danger</Select.Option>
          </Select.Root>
        </Field.Root>
        <Field.Root>
          <Field.Label>Available space</Field.Label>
          <Select.Root value={space} onChange={(event) => setSpace(event.currentTarget.value)}>
            <Select.Option value="wide">Wide</Select.Option>
            <Select.Option value="narrow">Narrow</Select.Option>
          </Select.Root>
        </Field.Root>
      </div>
      <div
        className="site-ContextRegion"
        style={
          {
            "--loam-context": context,
            "--_preview-size": space === "narrow" ? "14rem" : undefined,
          } as CSSProperties
        }
      >
        <Card>
          <div className="site-ContextSample">
            <header>
              <Badge.Root>
                <Badge.Text>Live example</Badge.Text>
              </Badge.Root>
              <h4>One region, shared styles</h4>
            </header>
            <p>The same content adapts to its surroundings.</p>
            <Field.Item>
              <Field.Label>
                <Checkbox
                  checked={selected}
                  onChange={(event) => setSelected(event.currentTarget.checked)}
                />{" "}
                Example selection
              </Field.Label>
            </Field.Item>
            <a href="/docs/contextualism">How contextualism works</a>
            <footer>
              <Button
                type="button"
                onClick={() => {
                  setContext("primary");
                  setSpace("wide");
                  setSelected(true);
                }}
              >
                Reset demo
              </Button>
            </footer>
          </div>
        </Card>
      </div>
      <p role="status">
        {space === "narrow" ? "Narrow" : "Wide"} container ·{" "}
        {context === "primary" ? "Neutral" : context === "success" ? "Success" : "Danger"} context
      </p>
      <p className="note">Wide fits the space available on your screen.</p>
    </div>
  );
}
