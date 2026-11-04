import { AbsoluteFill, useCurrentFrame } from "remotion";

import { clips } from "../clips";
import { FPS, HEIGHT, WIDTH as CANVAS_WIDTH } from "../constants";
import { Headline } from "../components/Headline";
import { Phone } from "../components/Phone";
import { PhoneSlot, useBeatFade, useEase } from "../components/motion";

export const LOOK_FRAMES = 72;
const RATE = 1.2;
const WIDTH = 360;

export function Look() {
  const frame = useCurrentFrame();
  const fade = useBeatFade(LOOK_FRAMES, 8, 10);
  const enter = useEase(0, 20);
  const clip = clips.themeSwitch;
  const sourceTime = clip.from + (frame * RATE) / FPS;
  const light = !!clip.lightTheme && sourceTime >= clip.lightTheme[0] && sourceTime < clip.lightTheme[1];

  return (
    <AbsoluteFill style={{ opacity: fade }}>
      {/* A soft glow behind the phone follows the app's theme. */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(248,250,247,0.18) 0%, transparent 45%)",
          opacity: light ? 1 : 0.15,
        }}
      />
      <PhoneSlot x={CANVAS_WIDTH / 2} y={HEIGHT / 2} width={WIDTH} opacity={enter} scale={0.92 + enter * 0.08}>
        <Phone clip={clip} width={WIDTH} rate={RATE} loop={false} />
      </PhoneSlot>
      <div style={{ position: "absolute", right: CANVAS_WIDTH / 2 + 260, top: 470 }}>
        <Headline lines={[[{ text: "Light" }]]} size={120} enterAt={6} align="right" />
      </div>
      <div style={{ position: "absolute", left: CANVAS_WIDTH / 2 + 260, top: 490 }}>
        <Headline lines={[[{ text: "& dark", dim: true }]]} size={150} enterAt={10} />
      </div>
    </AbsoluteFill>
  );
}
