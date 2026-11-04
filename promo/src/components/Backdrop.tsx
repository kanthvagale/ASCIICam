import { AbsoluteFill } from "remotion";

import { COLORS } from "../constants";

/** Near-black canvas with the faint diagonal light streak from the reference. */
export function Backdrop() {
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(118deg, transparent 30%, rgba(255,255,255,0.045) 48%, transparent 66%), ${COLORS.bg}`,
      }}
    />
  );
}
