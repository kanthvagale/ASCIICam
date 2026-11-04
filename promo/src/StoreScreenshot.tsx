import { AbsoluteFill } from "remotion";

import { type Clip, clips } from "./clips";
import { Backdrop } from "./components/Backdrop";
import { Headline, type Part } from "./components/Headline";
import { Phone, phoneSize } from "./components/Phone";
import { Wordmark } from "./components/Wordmark";
import { PhoneSlot } from "./components/motion";

// Google Play phone screenshots: 9:16.
export const SHOT_WIDTH = 1080;
export const SHOT_HEIGHT = 1920;

const PHONE_WIDTH = 600;
const BOTTOM_MARGIN = 110;

export type StoreScreenshotProps = {
  clip: Clip;
  /** Clip frame to hold. */
  freezeAt: number;
  /** Omit to show the wordmark instead. */
  lines?: Part[][];
  sub?: string;
};

export const SHOTS: StoreScreenshotProps[] = [
  { clip: clips.liveCam, freezeAt: 54, sub: "Your camera, in ASCII" },
  { clip: clips.camBlocks, freezeAt: 21, lines: [[{ text: "Point. Shoot." }], [{ text: "ascii.", dim: true }]], sub: "Live, right on your device" },
  { clip: clips.optCharset, freezeAt: 45, lines: [[{ text: "Your" }, { text: "style", dim: true }]], sub: "Resolution · charsets · colours" },
  { clip: clips.camBinary, freezeAt: 21, lines: [[{ text: "Binary, blocks," }], [{ text: "& more", dim: true }]], sub: "Five character sets" },
  { clip: clips.uploadResult, freezeAt: 90, lines: [[{ text: "Any photo," }], [{ text: "converted", dim: true }]] },
  { clip: clips.viewer, freezeAt: 30, lines: [[{ text: "Save it," }], [{ text: "export or copy as text", dim: true }]] },
  { clip: clips.gallery, freezeAt: 15, lines: [[{ text: "Every capture," }], [{ text: "kept", dim: true }]], sub: "Your gallery, on device" },
  { clip: clips.themeSwitch, freezeAt: 21, lines: [[{ text: "Light" }, { text: "& dark", dim: true }]] },
];

export function StoreScreenshot({ clip, freezeAt, lines, sub }: StoreScreenshotProps) {
  const { outerHeight } = phoneSize(PHONE_WIDTH);
  const phoneTop = SHOT_HEIGHT - BOTTOM_MARGIN - outerHeight;

  return (
    <AbsoluteFill>
      <Backdrop />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: phoneTop,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: 20,
        }}
      >
        {lines ? (
          // enterAt far in the past so every word has finished its entrance on frame 0.
          <Headline lines={lines} sub={sub} size={96} align="center" enterAt={-200} />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 36 }}>
            <Wordmark size={150} settled />
            <Headline lines={[[{ text: sub ?? "", dim: true }]]} size={70} align="center" enterAt={-200} />
          </div>
        )}
      </div>
      <PhoneSlot x={SHOT_WIDTH / 2} y={phoneTop + outerHeight / 2} width={PHONE_WIDTH}>
        <Phone clip={clip} width={PHONE_WIDTH} freezeAt={freezeAt} />
      </PhoneSlot>
    </AbsoluteFill>
  );
}
