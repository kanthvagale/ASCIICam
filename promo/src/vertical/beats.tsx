import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";

import { type Clip, clipFrames, clips } from "../clips";
import { CaptureCard, GALLERY_FRAMES } from "../beats/Keep";
import { WALL_TILES } from "../beats/Wall";
import { Headline } from "../components/Headline";
import { Phone, phoneSize } from "../components/Phone";
import { TiltedWall } from "../components/TiltedWall";
import { PhoneSlot, mix, useBeatFade, useEase } from "../components/motion";
import { PHONE_WIDTH, PHONE_Y, TopHeadline, V_HEIGHT, V_WIDTH } from "./layout";

const CENTER_X = V_WIDTH / 2;
const SPAN = [-2, -1, 0, 1, 2];

export const V_WALL_FRAMES = 140;
const PUSH_AT = 92;

export function VWall() {
  const fade = useBeatFade(V_WALL_FRAMES, 12, 10);
  const push = useEase(PUSH_AT, 40);
  const intro = useEase(0, 40);
  const textOut = 1 - useEase(PUSH_AT - 10, 14);
  const panelIn = useEase(16, 16);

  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${1.08 - intro * 0.08})` }}>
        <TiltedWall tiles={WALL_TILES} push={push} focusWidth={PHONE_WIDTH} cols={SPAN} rows={SPAN} />
      </div>
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse at 50% 50%, rgba(10,10,10,0) 30%, rgba(10,10,10,0.85) 100%)",
          opacity: 1 - push,
        }}
      />
      <AbsoluteFill style={{ opacity: textOut }}>
        <TopHeadline>
          <div style={{ padding: "28px 40px", background: `rgba(10,10,10,${0.75 * panelIn})`, borderRadius: 28 }}>
            <Headline lines={[[{ text: "Your camera," }], [{ text: "in ASCII", dim: true }]]} size={96} enterAt={18} align="center" />
          </div>
        </TopHeadline>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

export const V_LIVE_FRAMES = 128;
// The shutter fires at 9.0 s in the source; the clip starts at 5.2 s.
const CAPTURE_AT = Math.round((9.0 - clips.liveCam.from) * 30);

export function VLive() {
  const frame = useCurrentFrame();
  const fade = useBeatFade(V_LIVE_FRAMES, 8, 10);
  const slide = useEase(4, 26);
  const flash = interpolate(frame, [CAPTURE_AT, CAPTURE_AT + 2, CAPTURE_AT + 10], [0, 0.85, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: fade }}>
      {/* Starts where the wall's push left the centre phone. */}
      <PhoneSlot x={CENTER_X} y={mix(V_HEIGHT / 2, PHONE_Y, slide)} width={PHONE_WIDTH}>
        <Phone clip={clips.liveCam} width={PHONE_WIDTH} loop={false} flash={flash} />
      </PhoneSlot>
      <TopHeadline>
        <Headline
          lines={[[{ text: "Point. Shoot." }], [{ text: "ascii.", dim: true }]]}
          sub="Live, right on your device"
          size={100}
          enterAt={14}
          align="center"
        />
      </TopHeadline>
    </AbsoluteFill>
  );
}

const STYLE_RATE = 1.5;
const RES_FRAMES = clipFrames(clips.optRes, STYLE_RATE);
// Binary is picked at 41.0 s in the source clip that starts at 38.0 s.
const BINARY_AT = RES_FRAMES + Math.round(((41.0 - clips.optCharset.from) * 30) / STYLE_RATE);
const SIDE_WIDTH = 340;
export const V_STYLE_FRAMES = 160;

export function VStyle() {
  const fade = useBeatFade(V_STYLE_FRAMES, 10, 10);
  const enter = useEase(0, 26);
  const blocks = useEase(RES_FRAMES, 22);
  const binary = useEase(BINARY_AT, 22);

  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <SidePhone clip={clips.camBlocks} t={blocks} x={210} rotate={-9} />
      <SidePhone clip={clips.camBinary} t={binary} x={870} rotate={9} />
      <PhoneSlot x={CENTER_X} y={mix(PHONE_Y + 60, PHONE_Y, enter)} width={PHONE_WIDTH} opacity={enter}>
        <div style={{ position: "relative" }}>
          <Sequence durationInFrames={RES_FRAMES} layout="none">
            <Phone clip={clips.optRes} width={PHONE_WIDTH} rate={STYLE_RATE} loop={false} />
          </Sequence>
          <Sequence from={RES_FRAMES} layout="none">
            <Phone clip={clips.optCharset} width={PHONE_WIDTH} rate={STYLE_RATE} loop={false} />
          </Sequence>
        </div>
      </PhoneSlot>
      <TopHeadline>
        <Headline
          lines={[[{ text: "Your" }, { text: "style", dim: true }]]}
          sub="Resolution · charsets · colours"
          size={110}
          enterAt={10}
          align="center"
        />
      </TopHeadline>
    </AbsoluteFill>
  );
}

/** Peeks out from behind the main phone once its look is picked. */
function SidePhone({ clip, t, x, rotate }: { clip: Clip; t: number; x: number; rotate: number }) {
  return (
    <PhoneSlot
      x={mix(CENTER_X, x, t)}
      y={PHONE_Y + 50}
      width={SIDE_WIDTH}
      rotate={mix(0, rotate, t)}
      opacity={t}
      scale={mix(0.85, 1, t)}
    >
      <Phone clip={clip} width={SIDE_WIDTH} />
    </PhoneSlot>
  );
}

export const V_PHOTO_FRAMES = 120;
const EMPTY_FRAMES = 14;

export function VPhoto() {
  const frame = useCurrentFrame();
  const fade = useBeatFade(V_PHOTO_FRAMES, 10, 10);
  const enter = useEase(0, 26);
  const { outerWidth, outerHeight } = phoneSize(PHONE_WIDTH);
  const scan = interpolate(frame, [EMPTY_FRAMES - 4, EMPTY_FRAMES + 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <PhoneSlot x={mix(CENTER_X + 80, CENTER_X, enter)} y={PHONE_Y} width={PHONE_WIDTH} opacity={enter}>
        <div style={{ position: "relative" }}>
          <Sequence durationInFrames={EMPTY_FRAMES} layout="none">
            <Phone clip={clips.uploadEmpty} width={PHONE_WIDTH} freezeAt={0} />
          </Sequence>
          <Sequence from={EMPTY_FRAMES} layout="none">
            <Phone clip={clips.uploadResult} width={PHONE_WIDTH} loop={false} />
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
      <TopHeadline>
        <Headline lines={[[{ text: "Any photo," }], [{ text: "converted", dim: true }]]} size={100} enterAt={10} align="center" />
      </TopHeadline>
    </AbsoluteFill>
  );
}

export const V_KEEP_FRAMES = 124;
const CARDS = [
  { clip: clips.camBinary, at: 1.0, x: 175, y: 840, rotate: -9 },
  { clip: clips.camBlocks, at: 1.0, x: 910, y: 1020, rotate: 6 },
  { clip: clips.liveCam, at: 1.5, x: 170, y: 1430, rotate: 10 },
];

export function VKeep() {
  const fade = useBeatFade(V_KEEP_FRAMES, 10, 10);
  const enter = useEase(0, 26);

  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <PhoneSlot x={CENTER_X} y={mix(PHONE_Y + 60, PHONE_Y, enter)} width={PHONE_WIDTH} opacity={enter}>
        <div style={{ position: "relative" }}>
          <Sequence durationInFrames={GALLERY_FRAMES} layout="none">
            <Phone clip={clips.gallery} width={PHONE_WIDTH} loop={false} />
          </Sequence>
          <Sequence from={GALLERY_FRAMES} layout="none">
            <Phone clip={clips.viewer} width={PHONE_WIDTH} loop={false} />
          </Sequence>
        </div>
      </PhoneSlot>
      {CARDS.map((card, i) => (
        <CaptureCard key={i} index={i} origin={{ x: CENTER_X, y: PHONE_Y }} {...card} />
      ))}
      <TopHeadline>
        <Headline
          lines={[[{ text: "Save it," }], [{ text: "export or copy as text", dim: true }]]}
          size={100}
          enterAt={10}
          align="center"
        />
      </TopHeadline>
    </AbsoluteFill>
  );
}
