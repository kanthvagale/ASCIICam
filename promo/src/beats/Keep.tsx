import { AbsoluteFill, Freeze, OffthreadVideo, Sequence, staticFile } from "remotion";

import { type Clip, clipFrames, clips, trimStart } from "../clips";
import { FPS, HEIGHT, SRC_WIDTH } from "../constants";
import { Headline } from "../components/Headline";
import { Phone } from "../components/Phone";
import { PhoneSlot, mix, useBeatFade, useEase } from "../components/motion";

export const KEEP_FRAMES = 128;
const GALLERY_FRAMES = clipFrames(clips.gallery);
const WIDTH = 380;

const CARDS: { clip: Clip; at: number; x: number; y: number; rotate: number }[] = [
  { clip: clips.camBinary, at: 1.0, x: 1530, y: 400, rotate: -9 },
  { clip: clips.camBlocks, at: 1.0, x: 1640, y: 560, rotate: 4 },
  { clip: clips.liveCam, at: 1.5, x: 1520, y: 720, rotate: 11 },
];

export function Keep() {
  const fade = useBeatFade(KEEP_FRAMES, 10, 10);
  const enter = useEase(0, 26);

  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <PhoneSlot x={mix(1060, 1140, enter)} y={HEIGHT / 2} width={WIDTH} opacity={enter}>
        <div style={{ position: "relative" }}>
          <Sequence durationInFrames={GALLERY_FRAMES} layout="none">
            <Phone clip={clips.gallery} width={WIDTH} loop={false} />
          </Sequence>
          <Sequence from={GALLERY_FRAMES} layout="none">
            <Phone clip={clips.viewer} width={WIDTH} loop={false} />
          </Sequence>
        </div>
      </PhoneSlot>
      {CARDS.map((card, i) => (
        <CaptureCard key={i} index={i} {...card} />
      ))}
      <div style={{ position: "absolute", left: 130, top: 360 }}>
        <Headline
          lines={[[{ text: "Save it," }], [{ text: "export or", dim: true }], [{ text: "copy as text", dim: true }]]}
          size={110}
          enterAt={10}
        />
      </div>
    </AbsoluteFill>
  );
}

/** A capture "print" that flies out of the phone as the viewer opens. */
function CaptureCard({ clip, at, x, y, rotate, index }: { clip: Clip; at: number; x: number; y: number; rotate: number; index: number }) {
  const t = useEase(GALLERY_FRAMES + 4 + index * 5, 22);
  const width = 230;
  const height = 230;
  const videoWidth = width * 1.15;
  const videoHeight = (videoWidth * clip.height) / SRC_WIDTH;

  return (
    <div
      style={{
        position: "absolute",
        left: mix(1140, x, t) - width / 2,
        top: mix(540, y, t) - height / 2,
        width,
        height,
        borderRadius: 22,
        overflow: "hidden",
        transform: `rotate(${mix(0, rotate, t)}deg) scale(${mix(0.6, 1, t)})`,
        opacity: t,
        boxShadow: "0 24px 60px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.12)",
        background: "#000",
      }}
    >
      <Freeze frame={Math.round(at * FPS)}>
        <OffthreadVideo
          src={staticFile(clip.src)}
          trimBefore={trimStart(clip)}
          muted
          style={{
            position: "absolute",
            width: videoWidth,
            height: videoHeight,
            left: (width - videoWidth) / 2,
            // Crop to the ASCII preview, below the camera's top bar.
            top: -videoHeight * 0.22,
          }}
        />
      </Freeze>
    </div>
  );
}
