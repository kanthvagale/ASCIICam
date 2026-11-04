import { AbsoluteFill } from "remotion";

import { clips } from "./clips";
import { Backdrop } from "./components/Backdrop";
import { Phone } from "./components/Phone";
import { CharField, Wordmark } from "./components/Wordmark";
import { PhoneSlot } from "./components/motion";
import { COLORS, DISPLAY_FONT } from "./constants";

// Google Play feature graphic: 1024 × 500, no alpha.
export const FEATURE_WIDTH = 1024;
export const FEATURE_HEIGHT = 500;

const PHONE_WIDTH = 176;

const PHONES = [
  { clip: clips.camBinary, freezeAt: 21, x: 600, y: 300, rotate: -12 },
  { clip: clips.liveCam, freezeAt: 54, x: 790, y: 230, rotate: -12 },
  { clip: clips.uploadResult, freezeAt: 90, x: 975, y: 330, rotate: -12 },
];

export function FeatureGraphic() {
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Backdrop />
      <CharField opacity={0.07} />
      {PHONES.map(({ clip, freezeAt, x, y, rotate }) => (
        <PhoneSlot key={x} x={x} y={y} width={PHONE_WIDTH} rotate={rotate}>
          <Phone clip={clip} width={PHONE_WIDTH} freezeAt={freezeAt} />
        </PhoneSlot>
      ))}
      {/* Darken behind the copy so the left half reads cleanly over the char field. */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(90deg, ${COLORS.bg} 0%, ${COLORS.bg} 30%, rgba(10,10,10,0.85) 42%, transparent 58%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 92,
          top: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: 30,
        }}
      >
        <Wordmark size={112} settled />
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div
            style={{
              fontFamily: DISPLAY_FONT,
              fontWeight: 800,
              fontSize: 34,
              lineHeight: 1,
              letterSpacing: -0.7,
              textTransform: "uppercase",
              color: COLORS.white,
            }}
          >
            Your camera,
          </div>
          <div style={{ fontFamily: DISPLAY_FONT, fontWeight: 400, fontSize: 22, lineHeight: 1, color: COLORS.dim }}>
            in ASCII
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}
