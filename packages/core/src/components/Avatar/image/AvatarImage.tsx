"use client";

import { useRef, useState } from "react";
import { useIsoLayoutEffect } from "../../../hooks/use-id-registry.js";
import { composeRefs } from "../../../utils/render.js";
import { cx } from "../../../utils/cx.js";
import type { PartProps } from "../../../utils/props.js";
import { useAvatarContext } from "../root/AvatarRootContext.js";
import type { AvatarImageStatus } from "../root/AvatarRootContext.js";

export interface AvatarImageProps extends PartProps<"img"> {
  /** Use an empty alt when the Root supplies the accessible name. */
  alt: string;
}

/** Native image loading, including srcSet and loading="lazy", without a preload request. */
export function AvatarImage(props: AvatarImageProps) {
  return (
    <AvatarImageLoader key={JSON.stringify([props.src, props.srcSet, props.sizes])} {...props} />
  );
}

function AvatarImageLoader({ className, alt, ref, onLoad, onError, ...rest }: AvatarImageProps) {
  const { setStatus } = useAvatarContext("Avatar.Image");
  const imageRef = useRef<HTMLImageElement>(null);
  const [status, setLocalStatus] = useState<AvatarImageStatus>("loading");
  useIsoLayoutEffect(() => {
    const image = imageRef.current;
    const next =
      image?.complete && image.currentSrc
        ? image.naturalWidth > 0
          ? "loaded"
          : "error"
        : "loading";
    setLocalStatus(next);
    setStatus(next);
    return () => setStatus("loading");
  }, [setStatus]);
  return (
    <img
      {...rest}
      alt={alt}
      ref={composeRefs(imageRef, ref)}
      className={cx("image", className)}
      data-loading={status === "loading" ? "" : undefined}
      data-error={status === "error" ? "" : undefined}
      aria-hidden={status !== "loaded" ? true : rest["aria-hidden"]}
      onLoad={(event) => {
        setLocalStatus("loaded");
        setStatus("loaded");
        onLoad?.(event);
      }}
      onError={(event) => {
        setLocalStatus("error");
        setStatus("error");
        onError?.(event);
      }}
    />
  );
}
