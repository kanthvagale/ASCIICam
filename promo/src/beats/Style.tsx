import { AbsoluteFill, Sequence } from "remotion";

import { clipFrames, clips } from "../clips";
import { HEIGHT } from "../constants";
import { Headline } from "../components/Headline";
import { Phone } from "../components/Phone";
import { PhoneSlot, mix, useBeatFade, useEase } from "../components/motion";

const RATE = 1.5;
const RES_FRAMES = clipFrames(clips.optRes, RATE);
export const STYLE_FRAMES = 160;
// Binary is picked at 41.0 s in the source clip that starts at 38.0 s.
const BINARY_AT = RES_FRAMES + Math.round(((41.0 - clips.optCharset.from) * 30) / RATE);

const MAIN_WIDTH = 380;
const SIDE_WIDTH = 260;

export function Style() {
  const fade = useBeatFade(STYLE_FRAMES, 10, 10);
  const enter = useEase(0, 26);
  const blocks = useEase(RES_FRAMES, 22);
  const binary = useEase(BINARY_AT, 22);

  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <PhoneSlot x={1700} y={HEIGHT / 2 + 40} width={SIDE_WIDTH} rotate={mix(0, 13, binary)} opacity={binary} scale={mix(0.85, 1, binary)}>
        <Phone clip={clips.camBinary} width={SIDE_WIDTH} />
      </PhoneSlot>
      <PhoneSlot x={mix(1400, 1500, blocks)} y={HEIGHT / 2 + 10} width={SIDE_WIDTH} rotate={mix(0, 7, blocks)} opacity={blocks} scale={mix(0.85, 1, blocks)}>
        <Phone clip={clips.camBlocks} width={SIDE_WIDTH} />
      </PhoneSlot>
      <PhoneSlot x={mix(1300, 1180, enter)} y={HEIGHT / 2} width={MAIN_WIDTH} opacity={enter}>
        <div style={{ position: "relative" }}>
          <Sequence durationInFrames={RES_FRAMES} layout="none">
            <Phone clip={clips.optRes} width={MAIN_WIDTH} rate={RATE} loop={false} />
          </Sequence>
          <Sequence from={RES_FRAMES} layout="none">
            <Phone clip={clips.optCharset} width={MAIN_WIDTH} rate={RATE} loop={false} />
          </Sequence>
        </div>
      </PhoneSlot>
      <div style={{ position: "absolute", left: 130, top: 340 }}>
        <Headline
          lines={[[{ text: "Your" }], [{ text: "style", dim: true }]]}
          sub="Resolution · charsets · colours"
          size={120}
          enterAt={10}
        />
      </div>
    </AbsoluteFill>
  );
}
