import { AbsoluteFill } from "remotion";

import { clips } from "../clips";
import { Headline } from "../components/Headline";
import { TiltedWall } from "../components/TiltedWall";
import { useBeatFade, useEase } from "../components/motion";

export const WALL_FRAMES = 160;
const PUSH_AT = 108;
/** Screen width the centre phone lands at, matching the Live beat. */
export const FOCUS_WIDTH = 380;

export const WALL_TILES = [
  clips.camBinary,
  clips.liveCam,
  clips.camBlocks,
  clips.gallery,
  clips.optCharset,
  clips.uploadResult,
  clips.themeSwitch,
];

export function Wall() {
  const fade = useBeatFade(WALL_FRAMES, 12, 10);
  const push = useEase(PUSH_AT, 44);
  const intro = useEase(0, 40);
  const textOut = 1 - useEase(PUSH_AT - 10, 14);
  const panelIn = useEase(16, 16);

  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${1.08 - intro * 0.08})` }}>
        <TiltedWall tiles={WALL_TILES} push={push} focusWidth={FOCUS_WIDTH} />
      </div>
      {/* Vignette keeps the headline readable over the wall. */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse at 50% 50%, rgba(10,10,10,0) 30%, rgba(10,10,10,0.85) 100%)",
          opacity: 1 - push,
        }}
      />
      <AbsoluteFill style={{ justifyContent: "flex-end", padding: "0 0 170px 120px", opacity: textOut }}>
        <div
          style={{
            alignSelf: "flex-start",
            padding: "28px 36px",
            background: `rgba(10,10,10,${0.72 * panelIn})`,
            borderRadius: 28,
          }}
        >
          <Headline lines={[[{ text: "Your camera," }], [{ text: "in ASCII", dim: true }]]} size={96} enterAt={18} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
