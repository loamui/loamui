import { Modal } from "@loamui/core/modal";
import type { CSSProperties } from "react";

export function ModalDemo() {
  return (
    <Modal.Root>
      <Modal.Trigger>Invite a teammate</Modal.Trigger>
      <Modal.Popup>
        <Modal.Title>Invite a teammate</Modal.Title>
        <Modal.Description>
          They&apos;ll receive an email invitation to join your workspace.
        </Modal.Description>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "var(--loam-space-2xs)",
            alignItems: "center",
          }}
        >
          <span style={{ "--loam-context": "primary" } as CSSProperties}>
            <Modal.Close>Send invite</Modal.Close>
          </span>
          <Modal.Close>Cancel</Modal.Close>
        </div>
      </Modal.Popup>
    </Modal.Root>
  );
}

export function ModalAlertDemo() {
  return (
    <Modal.Root>
      <span style={{ "--loam-context": "danger" } as CSSProperties}>
        <Modal.Trigger>Delete file</Modal.Trigger>
      </span>
      <Modal.Popup alert>
        <Modal.Title>Delete this file?</Modal.Title>
        <Modal.Description>
          &ldquo;report-final-v2.pdf&rdquo; will be permanently deleted. This cannot be undone.
        </Modal.Description>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "var(--loam-space-2xs)",
            alignItems: "center",
          }}
        >
          <Modal.Close autoFocus>Cancel</Modal.Close>
          <span style={{ "--loam-context": "danger" } as CSSProperties}>
            <Modal.Close>Delete</Modal.Close>
          </span>
        </div>
      </Modal.Popup>
    </Modal.Root>
  );
}

export function ModalWidthDemo() {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "var(--loam-space-2xs)",
        alignItems: "center",
      }}
    >
      <Modal.Root>
        <Modal.Trigger>Content-sized</Modal.Trigger>
        <Modal.Popup>
          <Modal.Title>Signed out</Modal.Title>
          <Modal.Description>Sign in again to continue.</Modal.Description>
          <Modal.Close>Close</Modal.Close>
        </Modal.Popup>
      </Modal.Root>
      <Modal.Root>
        <Modal.Trigger>Wide (44rem)</Modal.Trigger>
        <Modal.Popup style={{ "--loam-modal-size": "44rem" } as CSSProperties}>
          <Modal.Title>Release notes</Modal.Title>
          <Modal.Description>
            A wide panel for content that needs the room, set with one custom property where the
            modal is used.
          </Modal.Description>
          <Modal.Close>Close</Modal.Close>
        </Modal.Popup>
      </Modal.Root>
    </div>
  );
}

export function ModalHeaderCloseDemo() {
  return (
    <Modal.Root>
      <Modal.Trigger>Open settings</Modal.Trigger>
      <Modal.Popup>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBlockEnd: "var(--loam-space-2xs)",
          }}
        >
          <Modal.Title style={{ margin: 0 }}>Settings</Modal.Title>
          <Modal.Close aria-label="Close">×</Modal.Close>
        </div>
        <Modal.Description>Manage your workspace settings.</Modal.Description>
      </Modal.Popup>
    </Modal.Root>
  );
}
