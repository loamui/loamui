// Composing here, outside the "use client" boundary, keeps each part its own
// client reference, so `Switch.Control` resolves in a server module. Assembled
// inside the boundary the whole component would cross as one opaque reference
// and every part would be undefined.
export { SwitchControl as Control } from "./Switch.js";
export {
  SwitchRoot as Root,
  SwitchTrack as Track,
  SwitchThumb as Thumb,
} from "./SwitchStructure.js";
