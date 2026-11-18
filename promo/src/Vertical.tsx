import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";

import { END_FRAMES, End } from "./beats/End";
import { HOOK_FRAMES, Hook } from "./beats/Hook";
import { Backdrop } from "./components/Backdrop";
import {
  V_KEEP_FRAMES,
  V_LIVE_FRAMES,
  V_PHOTO_FRAMES,
  V_STYLE_FRAMES,
  V_WALL_FRAMES,
  VKeep,
  VLive,
  VPhoto,
  VStyle,
  VWall,
} from "./vertical/beats";

const OVERLAP = 10;
const BEATS = [
  { duration: HOOK_FRAMES, Beat: Hook },
  { duration: V_WALL_FRAMES, Beat: VWall },
  { duration: V_LIVE_FRAMES, Beat: VLive },
  { duration: V_STYLE_FRAMES, Beat: VStyle },
  { duration: V_PHOTO_FRAMES, Beat: VPhoto },
  { duration: V_KEEP_FRAMES, Beat: VKeep },
  { duration: END_FRAMES, Beat: End },
];

// Each beat starts OVERLAP frames before the previous one ends, so they crossfade.
const TIMELINE = BEATS.map((beat, i) => ({
  ...beat,
  from: BEATS.slice(0, i).reduce((sum, b) => sum + b.duration - OVERLAP, 0),
}));

export const VERTICAL_FRAMES = TIMELINE[TIMELINE.length - 1].from + END_FRAMES;

export function Vertical() {
  return (
    <AbsoluteFill>
      <Backdrop />
      {TIMELINE.map(({ from, duration, Beat }) => (
        <Sequence key={from} from={from} durationInFrames={duration}>
          <Beat />
        </Sequence>
      ))}
      <Audio src={staticFile("audio/bed-vertical.wav")} />
    </AbsoluteFill>
  );
}
