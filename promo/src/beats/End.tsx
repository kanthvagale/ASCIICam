import { AbsoluteFill } from "remotion";

import { COLORS, DISPLAY_FONT } from "../constants";
import { Headline } from "../components/Headline";
import { TiltedWall } from "../components/TiltedWall";
import { Wordmark } from "../components/Wordmark";
import { useBeatFade, useEase } from "../components/motion";
import { WALL_TILES } from "./Wall";

export const END_FRAMES = 88;

export function End() {
  const fade = useBeatFade(END_FRAMES, 12, 1);
  const pullBack = useEase(0, 50);
  const mark = useEase(14, 26);
  const tagline = useEase(34, 20);

  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${1.25 - pullBack * 0.25})` }}>
        <TiltedWall tiles={WALL_TILES} opacity={0.32} drift={0.6} />
      </div>
      <AbsoluteFill
        style={{ background: "radial-gradient(ellipse at 50% 46%, rgba(10,10,10,0.9) 25%, rgba(10,10,10,0.55) 70%)" }}
      />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 90 }}>
        <div style={{ opacity: mark, transform: `scale(${0.9 + mark * 0.1})` }}>
          <Wordmark size={190} settled />
        </div>
        <div style={{ marginTop: 70 }}>
          <Headline lines={[[{ text: "Available on" , dim: true }, { text: "Google Play" }]]} size={64} enterAt={30} align="center" />
        </div>
        <div
          style={{
            marginTop: 26,
            fontFamily: DISPLAY_FONT,
            fontSize: 26,
            letterSpacing: 2,
            color: COLORS.dim,
            opacity: tagline,
          }}
        >
          No account. No ads.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
