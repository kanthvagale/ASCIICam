import type { CSSProperties, ReactNode } from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

import { phoneSize } from "./Phone";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Opacity that fades a beat in and out at its edges. */
export function useBeatFade(duration: number, fadeIn = 10, fadeOut = 10) {
  const frame = useCurrentFrame();
  return interpolate(frame, [0, fadeIn, duration - fadeOut, duration], [0, 1, 1, 0], clamp);
}

/** One shared, non-bouncy spring for every move. */
export function useEase(delay = 0, duration = 24) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping: 200 }, durationInFrames: duration });
}

export const mix = (from: number, to: number, t: number) => from + (to - from) * t;

/** Places a phone of `width` so its centre sits at (x, y). */
export function PhoneSlot({
  x,
  y,
  width,
  rotate = 0,
  scale = 1,
  opacity = 1,
  children,
  style,
}: {
  x: number;
  y: number;
  width: number;
  rotate?: number;
  scale?: number;
  opacity?: number;
  children: ReactNode;
  style?: CSSProperties;
}) {
  const { outerWidth, outerHeight } = phoneSize(width);
  return (
    <div
      style={{
        position: "absolute",
        left: x - outerWidth / 2,
        top: y - outerHeight / 2,
        transform: `rotate(${rotate}deg) scale(${scale})`,
        opacity,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
