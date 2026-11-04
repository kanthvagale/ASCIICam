import type { CSSProperties } from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";

import { COLORS, DISPLAY_FONT } from "../constants";

export type Part = { text: string; dim?: boolean };

type HeadlineProps = {
  /** Each inner array is one line. Dim parts are the grey, lighter half of the two-tone label. */
  lines: Part[][];
  sub?: string;
  size?: number;
  enterAt?: number;
  align?: "left" | "right" | "center";
  style?: CSSProperties;
};

/** Two-tone headline: heavy white uppercase words, lighter grey words, entering word by word. */
export function Headline({ lines, sub, size = 92, enterAt = 0, align = "left", style }: HeadlineProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  let wordIndex = 0;

  const enter = (index: number) =>
    spring({ frame: frame - enterAt - index * 3, fps, config: { damping: 200 }, durationInFrames: 20 });

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: alignToFlex(align), gap: size * 0.08, ...style }}>
      {lines.map((line, lineIndex) => (
        <div key={lineIndex} style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: size * 0.32 }}>
          {line.flatMap((part) =>
            part.text.split(" ").map((word) => {
              const p = enter(wordIndex++);
              return (
                <span
                  key={`${lineIndex}-${wordIndex}`}
                  style={{
                    fontFamily: DISPLAY_FONT,
                    fontWeight: part.dim ? 400 : 800,
                    fontSize: part.dim ? size * 0.62 : size,
                    lineHeight: 1,
                    letterSpacing: part.dim ? 0 : -size * 0.02,
                    textTransform: part.dim ? "none" : "uppercase",
                    color: part.dim ? COLORS.dim : COLORS.white,
                    opacity: p,
                    transform: `translateY(${(1 - p) * size * 0.35}px)`,
                    display: "inline-block",
                  }}
                >
                  {word}
                </span>
              );
            }),
          )}
        </div>
      ))}
      {sub ? (
        <div
          style={{
            marginTop: size * 0.18,
            fontFamily: DISPLAY_FONT,
            fontSize: size * 0.3,
            color: COLORS.dim,
            opacity: enter(wordIndex + 2),
          }}
        >
          {sub}
        </div>
      ) : null}
    </div>
  );
}

const alignToFlex = (align: "left" | "right" | "center") =>
  align === "left" ? "flex-start" : align === "right" ? "flex-end" : "center";
