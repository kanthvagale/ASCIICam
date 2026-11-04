import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

import { CharField, Wordmark } from "../components/Wordmark";
import { useBeatFade } from "../components/motion";

export const HOOK_FRAMES = 96;

export function Hook() {
  const frame = useCurrentFrame();
  const fade = useBeatFade(HOOK_FRAMES, 1, 12);
  const field = interpolate(frame, [0, 10, 50, 80], [0, 0.16, 0.08, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const settle = interpolate(frame, [0, 60], [1.15, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <CharField opacity={field} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ transform: `scale(${settle})` }}>
          <Wordmark size={230} startAt={4} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
