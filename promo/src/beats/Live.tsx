import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

import { clips } from "../clips";
import { HEIGHT, WIDTH } from "../constants";
import { Headline } from "../components/Headline";
import { Phone } from "../components/Phone";
import { PhoneSlot, mix, useBeatFade, useEase } from "../components/motion";
import { FOCUS_WIDTH } from "./Wall";

export const LIVE_FRAMES = 128;
// The shutter fires at 9.0 s in the source; the clip starts at 5.2 s.
const CAPTURE_AT = Math.round((9.0 - clips.liveCam.from) * 30);

export function Live() {
  const frame = useCurrentFrame();
  const fade = useBeatFade(LIVE_FRAMES, 8, 10);
  const slide = useEase(4, 26);
  const flash = interpolate(frame, [CAPTURE_AT, CAPTURE_AT + 2, CAPTURE_AT + 10], [0, 0.85, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <PhoneSlot x={mix(WIDTH / 2, 600, slide)} y={HEIGHT / 2} width={FOCUS_WIDTH}>
        <Phone clip={clips.liveCam} width={FOCUS_WIDTH} loop={false} flash={flash} />
      </PhoneSlot>
      <div style={{ position: "absolute", left: 960, top: 300 }}>
        <Headline
          lines={[[{ text: "Point." }], [{ text: "Shoot." }], [{ text: "ascii.", dim: true }]]}
          sub="Live, right on your device"
          size={110}
          enterAt={14}
        />
      </div>
    </AbsoluteFill>
  );
}
