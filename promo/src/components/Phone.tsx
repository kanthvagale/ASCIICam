import type { CSSProperties } from "react";
import { Freeze, Loop, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";

import { type Clip, clipFrames, trimStart } from "../clips";
import { FPS, SRC_SCREEN_HEIGHT, SRC_STATUS_HEIGHT, SRC_WIDTH, UI_FONT } from "../constants";

export const phoneSize = (width: number) => {
  const statusHeight = (width * SRC_STATUS_HEIGHT) / SRC_WIDTH;
  const screenHeight = statusHeight + (width * SRC_SCREEN_HEIGHT) / SRC_WIDTH;
  const bezel = Math.max(3, width * 0.028);
  return { statusHeight, screenHeight, bezel, outerWidth: width + bezel * 2, outerHeight: screenHeight + bezel * 2 };
};

type PhoneProps = {
  clip: Clip;
  /** Screen width in px. */
  width: number;
  rate?: number;
  /** Hold this clip frame instead of playing. */
  freezeAt?: number;
  /** Loop the clip; otherwise it plays once and holds its last frame. */
  loop?: boolean;
  /** White flash over the screen, 0–1. */
  flash?: number;
  style?: CSSProperties;
};

export function Phone({ clip, width, rate = 1, freezeAt, loop = true, flash = 0, style }: PhoneProps) {
  const frame = useCurrentFrame();
  const { screenHeight, bezel } = phoneSize(width);
  const radius = width * 0.12;
  const total = clipFrames(clip, rate);

  const screen = <Screen clip={clip} width={width} rate={rate} />;
  let content = screen;
  if (freezeAt !== undefined) content = <Freeze frame={freezeAt}>{screen}</Freeze>;
  else if (loop) content = <Loop durationInFrames={total} layout="none">{screen}</Loop>;
  // A clip that plays once holds its last frame instead of going black.
  else if (frame >= total - 1) content = <Freeze frame={total - 1}>{screen}</Freeze>;

  return (
    <div
      style={{
        width: width + bezel * 2,
        height: screenHeight + bezel * 2,
        padding: bezel,
        borderRadius: radius + bezel,
        background: "linear-gradient(145deg, #6B6B70 0%, #2C2C2F 35%, #4A4A4E 70%, #2A2A2D 100%)",
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.14), 0 40px 90px rgba(0,0,0,0.65)",
        boxSizing: "border-box",
        ...style,
      }}
    >
      <div
        style={{
          position: "relative",
          width,
          height: screenHeight,
          borderRadius: radius,
          overflow: "hidden",
          background: "#000",
          boxShadow: "0 0 0 2px #000",
        }}
      >
        {content}
        {flash > 0 ? <div style={{ position: "absolute", inset: 0, background: "#FFF", opacity: flash }} /> : null}
      </div>
    </div>
  );
}

function Screen({ clip, width, rate }: { clip: Clip; width: number; rate: number }) {
  const frame = useCurrentFrame();
  const sourceTime = clip.from + (frame * rate) / FPS;
  const light = !!clip.lightTheme && sourceTime >= clip.lightTheme[0] && sourceTime < clip.lightTheme[1];

  return (
    <>
      <StatusBar width={width} light={light} />
      <OffthreadVideo
        src={staticFile(clip.src)}
        trimBefore={trimStart(clip)}
        durationInFrames={Math.round((clip.to - clip.from) * FPS)}
        playbackRate={rate}
        muted
        style={{ display: "block", width, height: (width * clip.height) / SRC_WIDTH }}
      />
    </>
  );
}

/** The recordings start below the status bar, so it and the punch-hole camera are drawn here. */
function StatusBar({ width, light }: { width: number; light: boolean }) {
  const { statusHeight } = phoneSize(width);
  const color = light ? "#111111" : "#FFFFFF";
  const fontSize = statusHeight * 0.34;
  const hole = statusHeight * 0.4;

  return (
    <div
      style={{
        position: "relative",
        height: statusHeight,
        background: light ? "#F8FAF7" : "#000000",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: `0 ${width * 0.075}px`,
        color,
        fontFamily: UI_FONT,
        fontSize,
        fontWeight: 600,
        boxSizing: "border-box",
      }}
    >
      <span>9:41</span>
      <div
        style={{
          position: "absolute",
          left: (width - hole) / 2,
          top: (statusHeight - hole) / 2,
          width: hole,
          height: hole,
          borderRadius: "50%",
          background: "#050505",
          boxShadow: "inset 0 0 0 1.5px #1F1F22, 0 0 0 1px rgba(255,255,255,0.04)",
        }}
      />
      <StatusIcons size={fontSize} color={color} />
    </div>
  );
}

function StatusIcons({ size, color }: { size: number; color: string }) {
  const h = size * 0.85;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: size * 0.3 }}>
      <svg width={h * 1.2} height={h} viewBox="0 0 12 10">
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={i * 3.1} y={10 - (i + 1) * 2.5} width={2.2} height={(i + 1) * 2.5} rx={0.5} fill={color} />
        ))}
      </svg>
      <svg width={h * 1.3} height={h} viewBox="0 0 13 10">
        <path d="M6.5 9.5 L4.4 7.2 A3 3 0 0 1 8.6 7.2 Z" fill={color} />
        <path d="M2.6 5.4 A5.6 5.6 0 0 1 10.4 5.4" stroke={color} strokeWidth={1.4} fill="none" strokeLinecap="round" />
        <path d="M0.8 3.4 A8.2 8.2 0 0 1 12.2 3.4" stroke={color} strokeWidth={1.4} fill="none" strokeLinecap="round" />
      </svg>
      <svg width={h * 2.1} height={h} viewBox="0 0 21 10">
        <rect x={0.6} y={0.6} width={17.4} height={8.8} rx={2.4} stroke={color} strokeOpacity={0.5} strokeWidth={1.2} fill="none" />
        <rect x={2.2} y={2.2} width={12.2} height={5.6} rx={1.2} fill={color} />
        <rect x={19} y={3.4} width={1.5} height={3.2} rx={0.7} fill={color} fillOpacity={0.5} />
      </svg>
    </div>
  );
}
