// The assembly carries no "use client": composing outside the boundary keeps
// each part its own client reference, so `Switch.Control` resolves in a
// server module.
export { SwitchRoot as Root } from "./root/SwitchRoot.js";
export { SwitchControl as Control } from "./control/SwitchControl.js";
export { SwitchTrack as Track } from "./track/SwitchTrack.js";
export { SwitchThumb as Thumb } from "./thumb/SwitchThumb.js";
