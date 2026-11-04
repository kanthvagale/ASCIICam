import { AbsoluteFill, Sequence } from "remotion";

import { END_FRAMES, End } from "./beats/End";
import { HOOK_FRAMES, Hook } from "./beats/Hook";
import { KEEP_FRAMES, Keep } from "./beats/Keep";
import { LIVE_FRAMES, Live } from "./beats/Live";
import { LOOK_FRAMES, Look } from "./beats/Look";
import { PHOTO_FRAMES, Photo } from "./beats/Photo";
import { STYLE_FRAMES, Style } from "./beats/Style";
import { WALL_FRAMES, Wall } from "./beats/Wall";
import { Backdrop } from "./components/Backdrop";

// Beats overlap by a few frames so each one crossfades into the next.
const TIMELINE = [
  { from: 0, duration: HOOK_FRAMES, Beat: Hook },
  { from: 86, duration: WALL_FRAMES, Beat: Wall },
  { from: 236, duration: LIVE_FRAMES, Beat: Live },
  { from: 356, duration: STYLE_FRAMES, Beat: Style },
  { from: 508, duration: PHOTO_FRAMES, Beat: Photo },
  { from: 628, duration: KEEP_FRAMES, Beat: Keep },
  { from: 748, duration: LOOK_FRAMES, Beat: Look },
  { from: 812, duration: END_FRAMES, Beat: End },
];

export const PROMO_FRAMES = 900;

export function Promo() {
  return (
    <AbsoluteFill>
      <Backdrop />
      {TIMELINE.map(({ from, duration, Beat }) => (
        <Sequence key={from} from={from} durationInFrames={duration}>
          <Beat />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
}
