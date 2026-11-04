import "./fonts";

import { Composition } from "remotion";

import { FPS, HEIGHT, WIDTH, sec } from "./constants";
import { FEATURE_HEIGHT, FEATURE_WIDTH, FeatureGraphic } from "./FeatureGraphic";
import { PROMO_FRAMES, Promo } from "./Promo";
import { SHOT_HEIGHT, SHOT_WIDTH, SHOTS, StoreScreenshot } from "./StoreScreenshot";

// Stills render frame 0, but Freeze clamps to the composition's length, so give them room for every freezeAt.
// (<Still> is no good either: it runs at 1 fps and would read freezeAt as seconds.)
const STILL_FRAMES = sec(10);

export function Root() {
  return (
    <>
      <Composition id="Promo" component={Promo} durationInFrames={PROMO_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
      <Composition
        id="FeatureGraphic"
        component={FeatureGraphic}
        durationInFrames={STILL_FRAMES}
        fps={FPS}
        width={FEATURE_WIDTH}
        height={FEATURE_HEIGHT}
      />
      {SHOTS.map((shot, i) => (
        <Composition
          key={i}
          id={`Screenshot${i + 1}`}
          component={StoreScreenshot}
          defaultProps={shot}
          durationInFrames={STILL_FRAMES}
          fps={FPS}
          width={SHOT_WIDTH}
          height={SHOT_HEIGHT}
        />
      ))}
    </>
  );
}
