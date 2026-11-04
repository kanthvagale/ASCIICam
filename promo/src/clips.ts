import { FPS } from "./constants";

export type Clip = {
  src: string;
  /** Source seconds. */
  from: number;
  to: number;
  /** Footage height at 720 px wide. */
  height: number;
  /** Source seconds where the app is in light theme (status bar turns light). */
  lightTheme?: [number, number];
  /** The video stream's start_time. Clip times are measured from the file start; Remotion seeks by stream time. */
  offset?: number;
};

const A = "raw/screen-20261103-231916.mp4";
const B = "raw/screen-20261103-234004.mp4";

const fromA = (from: number, to: number, extra?: Partial<Clip>): Clip => ({
  src: A,
  from,
  to,
  height: 1520,
  offset: 0.2589,
  ...extra,
});

// Swap a moment here to recut the video; every beat reads from this map.
export const clips = {
  liveCam: fromA(5.2, 9.4),
  gallery: fromA(10.8, 12.0),
  viewer: fromA(12.5, 14.8),
  themeSwitch: fromA(20.5, 23.2, { lightTheme: [20.875, 22.925] }),
  optRes: fromA(30.5, 33.8),
  // Both camera clips skip the blank frames while the camera restarts and hands off.
  camBlocks: fromA(36.1, 37.4),
  optCharset: fromA(38.0, 42.4),
  camBinary: fromA(44.5, 45.7),
  uploadEmpty: fromA(48.15, 48.25),
  uploadResult: { src: B, from: 0, to: 3.33, height: 1524 },
} satisfies Record<string, Clip>;

/** Source frame (at composition fps) to start playback from. */
export const trimStart = (clip: Clip) => Math.round((clip.from + (clip.offset ?? 0)) * FPS);

/** Composition frames the clip lasts at the given playback rate. */
export const clipFrames = (clip: Clip, rate = 1) => Math.floor(((clip.to - clip.from) * FPS) / rate);
