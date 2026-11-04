import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";

import { clips } from "../clips";
import { HEIGHT } from "../constants";
import { Headline } from "../components/Headline";
import { Phone, phoneSize } from "../components/Phone";
import { PhoneSlot, mix, useBeatFade, useEase } from "../components/motion";

export const PHOTO_FRAMES = 128;
const EMPTY_FRAMES = 14;
const WIDTH = 380;

export function Photo() {
  const frame = useCurrentFrame();
  const fade = useBeatFade(PHOTO_FRAMES, 10, 10);
  const enter = useEase(0, 26);
  const { outerWidth, outerHeight } = phoneSize(WIDTH);
  // A thin scan line sweeps down the screen as the photo turns into ASCII.
  const scan = interpolate(frame, [EMPTY_FRAMES - 4, EMPTY_FRAMES + 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <PhoneSlot x={mix(760, 640, enter)} y={HEIGHT / 2} width={WIDTH} opacity={enter}>
        <div style={{ position: "relative" }}>
          <Sequence durationInFrames={EMPTY_FRAMES} layout="none">
            <Phone clip={clips.uploadEmpty} width={WIDTH} freezeAt={0} />
          </Sequence>
          <Sequence from={EMPTY_FRAMES} layout="none">
            <Phone clip={clips.uploadResult} width={WIDTH} loop={false} />
          </Sequence>
          {scan > 0 && scan < 1 ? (
            <div
              style={{
                position: "absolute",
                left: 0,
                width: outerWidth,
                top: scan * outerHeight,
                height: 3,
                background: "linear-gradient(90deg, transparent, #FFFFFF, transparent)",
                boxShadow: "0 0 24px 6px rgba(255,255,255,0.35)",
              }}
            />
          ) : null}
        </div>
      </PhoneSlot>
      <div style={{ position: "absolute", left: 980, top: 360 }}>
        <Headline lines={[[{ text: "Any photo," }], [{ text: "converted", dim: true }]]} size={110} enterAt={10} />
      </div>
    </AbsoluteFill>
  );
}
