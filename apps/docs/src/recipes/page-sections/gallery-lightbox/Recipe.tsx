"use client";

import { useState } from "react";
import type { MouseEvent } from "react";
import { Modal } from "@loamui/core";
import "./recipe.css";

const PHOTOS = [
  {
    id: 955,
    alt: "Rows of the trial beds seen from the bank above",
    caption: "The trial beds in April",
  },
  { id: 400, alt: "Flower buds forming on a shrub in the stock beds" },
  {
    id: 112,
    alt: "Grass seed heads ripening in the meadow",
    caption: "Seed left to ripen",
  },
  { id: 627, alt: "Freshly picked green beans in a crate on the bench" },
  { id: 1080, alt: "Strawberries in punnets on the open-day stall" },
  {
    id: 17,
    alt: "Visitors on the meadow path on an open day",
    caption: "Open day, September",
  },
];

const url = (id: number, size: string) => `https://picsum.photos/id/${id}/${size}`;

/** What the lightbox shows; kept after closing so the image stays put while the dialog leaves. */
interface Opened {
  src: string;
  alt: string;
  name: string;
}

export default function Recipe() {
  const [open, setOpen] = useState(false);
  const [opened, setOpened] = useState<Opened | null>(null);

  function show(event: MouseEvent<HTMLAnchorElement>, photo: (typeof PHOTOS)[number]) {
    // A modified click (new tab, new window, download) keeps the link's own behaviour.
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    event.preventDefault();
    setOpened({
      src: url(photo.id, "1600/1067"),
      alt: photo.alt,
      name: photo.caption ?? photo.alt,
    });
    setOpen(true);
  }

  return (
    <div className="gallery-lightbox">
      <ul role="list">
        {PHOTOS.map((photo) => (
          <li key={photo.id}>
            <figure>
              <a href={url(photo.id, "1600/1067")} onClick={(event) => show(event, photo)}>
                <img
                  src={url(photo.id, "600/600")}
                  alt={photo.alt}
                  width="600"
                  height="600"
                  loading="lazy"
                />
              </a>
              {photo.caption && <figcaption>{photo.caption}</figcaption>}
            </figure>
          </li>
        ))}
      </ul>
      {opened && (
        <Modal.Root open={open} onOpenChange={setOpen}>
          <Modal.Popup aria-label={opened.name}>
            <div className="lightbox">
              <img src={opened.src} alt={opened.alt} />
              <Modal.Close>Close</Modal.Close>
            </div>
          </Modal.Popup>
        </Modal.Root>
      )}
    </div>
  );
}
