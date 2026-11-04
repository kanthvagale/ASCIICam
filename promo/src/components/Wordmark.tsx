import { interpolate, random, useCurrentFrame } from "remotion";

import { COLORS, WORDMARK_FONT } from "../constants";
import { CHARSETS } from "../../../src/lib/ascii/charsets";

const TITLE = "ASCii";
const RAMP = CHARSETS.minimal.trim().split("");
const STAR_PATH =
  "M12 0C12.8 7.2 16.8 11.2 24 12C16.8 12.8 12.8 16.8 12 24C11.2 16.8 7.2 12.8 0 12C7.2 11.2 11.2 7.2 12 0Z";

type WordmarkProps = {
  size?: number;
  /** Frame each letter starts scrambling from; letters lock one after another. */
  startAt?: number;
  /** Skip the scramble and show the settled mark. */
  settled?: boolean;
};

/** The splash wordmark: "ASCii" decoding from the app's character ramp, "Cam" bottom-right, twinkling star. */
export function Wordmark({ size = 200, startAt = 0, settled = false }: WordmarkProps) {
  const frame = useCurrentFrame();
  const local = settled ? 1000 : frame - startAt;

  const lockAt = (i: number) => 8 + i * 6;
  const camIn = interpolate(local, [36, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const starPeak = interpolate(local, [40, 52, 64], [0, 1, 0.75], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const starTwinkle = settled ? 0.8 + 0.2 * Math.sin(frame / 6) : starPeak;
  const subtitleSize = size * (16 / 72);
  const tracking = size * (3 / 72);

  return (
    <div style={{ position: "relative", display: "inline-flex", flexDirection: "column", alignItems: "center" }}>
      <svg
        width={size * 0.39}
        height={size * 0.39}
        viewBox="0 0 24 24"
        style={{
          position: "absolute",
          top: -size * 0.19,
          left: -size * 0.25,
          opacity: starTwinkle,
          transform: `scale(${0.6 + starTwinkle * 0.4}) rotate(${starTwinkle * 45}deg)`,
        }}
      >
        <path d={STAR_PATH} fill={COLORS.white} />
      </svg>
      <div
        style={{
          fontFamily: WORDMARK_FONT,
          fontWeight: 700,
          fontSize: size,
          lineHeight: 1.1,
          color: COLORS.white,
          display: "flex",
        }}
      >
        {TITLE.split("").map((letter, i) => {
          const visible = local >= i * 3;
          const locked = local >= lockAt(i);
          const scrambled = RAMP[Math.floor(random(`${i}-${Math.floor(local / 2)}`) * RAMP.length)];
          return (
            <span key={i} style={{ opacity: visible ? 1 : 0, color: locked ? COLORS.white : COLORS.dim }}>
              {locked ? letter : scrambled}
            </span>
          );
        })}
      </div>
      <div
        style={{
          alignSelf: "flex-end",
          marginTop: -size * 0.12,
          marginRight: -tracking,
          fontFamily: WORDMARK_FONT,
          fontWeight: 700,
          fontSize: subtitleSize,
          lineHeight: 1,
          letterSpacing: tracking,
          color: COLORS.sub,
          opacity: camIn,
          transform: `translateY(${(1 - camIn) * subtitleSize * 0.5}px)`,
        }}
      >
        Cam
      </div>
    </div>
  );
}

/** Faint, flickering field of ramp characters behind the hook. */
export function CharField({ opacity }: { opacity: number }) {
  const frame = useCurrentFrame();
  const cols = 64;
  const rows = 22;
  const tick = Math.floor(frame / 3);
  const lines = Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => {
      const v = random(`${r}-${c}-${tick}`);
      return v < 0.55 ? " " : RAMP[Math.floor(random(`${c}-${r}-${tick}`) * RAMP.length)];
    }).join(""),
  );
  return (
    <pre
      style={{
        position: "absolute",
        inset: 0,
        margin: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "JetBrains Mono",
        fontSize: 28,
        lineHeight: "48px",
        color: COLORS.white,
        opacity,
      }}
    >
      {lines.join("\n")}
    </pre>
  );
}
