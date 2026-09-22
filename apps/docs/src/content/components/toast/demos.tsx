"use client";

import { Button, Toast, Toasts, useToast } from "@loamui/core";

function SaveButton() {
  const toast = useToast();
  return (
    <Button onClick={() => toast.add({ title: "Saved", description: "Your changes are live." })}>
      Save changes
    </Button>
  );
}

export function ToastDemo() {
  return (
    <Toast.Provider>
      <SaveButton />
      <Toasts />
    </Toast.Provider>
  );
}

function ArchiveButton() {
  const toast = useToast();
  return (
    <Button
      onClick={() =>
        toast.add({
          title: "Message archived",
          action: {
            label: "Undo",
            onClick: () => toast.add({ title: "Message restored" }),
          },
        })
      }
    >
      Archive
    </Button>
  );
}

export function ToastActionDemo() {
  return (
    <Toast.Provider>
      <ArchiveButton />
      <Toasts />
    </Toast.Provider>
  );
}

function DisconnectButton() {
  const toast = useToast();
  return (
    <Button
      onClick={() =>
        toast.add({
          title: "Connection lost",
          description: "Trying to reconnect…",
          priority: "high",
        })
      }
    >
      Drop connection
    </Button>
  );
}

export function ToastPriorityDemo() {
  return (
    <Toast.Provider>
      <DisconnectButton />
      <Toasts />
    </Toast.Provider>
  );
}

function ExportButton() {
  const toast = useToast();
  return (
    <Button
      onClick={() =>
        toast.add({
          title: "Export ready",
          description: "Stays until you dismiss it.",
          timeout: 0,
        })
      }
    >
      Export data
    </Button>
  );
}

export function ToastPersistentDemo() {
  return (
    <Toast.Provider>
      <ExportButton />
      <Toasts />
    </Toast.Provider>
  );
}
