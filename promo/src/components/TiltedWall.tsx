import { useCurrentFrame } from "remotion";

import type { Clip } from "../clips";
import { HEIGHT, WIDTH } from "../constants";
import { Phone, phoneSize } from "./Phone";

type TiltedWallProps = {
  /** tiles[0] sits in the centre; the rest repeat around it. */
  tiles: Clip[];
  phoneWidth?: number;
  angle?: number;
  /** px per frame that alternate columns drift. */
  drift?: number;
  /** 0 → wall, 1 → centre phone straightened and scaled to `focusWidth`, others faded. */
  push?: number;
  focusWidth?: number;
  opacity?: number;
};

const COLS = [-3, -2, -1, 0, 1, 2, 3];
const ROWS = [-1, 0, 1];

/** The reference look: a grid of phones tilted on a diagonal, columns drifting in opposite directions. */
export function TiltedWall({
  tiles,
  phoneWidth = 330,
  angle = -14,
  drift = 0.9,
  push = 0,
  focusWidth = phoneWidth,
  opacity = 1,
}: TiltedWallProps) {
  const frame = useCurrentFrame();
  const { outerWidth, outerHeight } = phoneSize(phoneWidth);
  const gapX = outerWidth * 0.14;
  const gapY = outerHeight * 0.06;
  const scale = 1 + push * (focusWidth / phoneWidth - 1);

  // Everything is laid out around the centre tile; the centre column never drifts so a push lands on it.
  return (
    <div
      style={{
        position: "absolute",
        left: WIDTH / 2,
        top: HEIGHT / 2,
        transform: `rotate(${angle * (1 - push)}deg) scale(${scale})`,
        opacity,
      }}
    >
      {COLS.flatMap((col) =>
        ROWS.map((row) => {
          const isCentre = col === 0 && row === 0;
          const columnShift = (Math.abs(col) % 2) * outerHeight * 0.42;
          const columnDrift = col === 0 ? 0 : (col % 2 === 0 ? 1 : -1) * frame * drift;
          const x = col * (outerWidth + gapX);
          const y = row * (outerHeight + gapY) + columnShift + columnDrift;
          const index = Math.abs(col * 3 + row * 2) % tiles.length;
          const clip = isCentre ? tiles[0] : tiles[index === 0 ? 1 : index];
          // Outer columns hold a still; only the middle three play, which keeps renders fast.
          const still = Math.abs(col) >= 2;
          return (
            <div
              key={`${col}:${row}`}
              style={{
                position: "absolute",
                left: x - outerWidth / 2,
                top: y - outerHeight / 2,
                opacity: isCentre ? 1 : 1 - push,
              }}
            >
              <Phone clip={clip} width={phoneWidth} freezeAt={still ? 20 : undefined} />
            </div>
          );
        }),
      )}
    </div>
  );
}
