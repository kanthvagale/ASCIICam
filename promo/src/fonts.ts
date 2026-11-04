import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

import { DISPLAY_FONT, WORDMARK_FONT } from "./constants";

// loadFont blocks rendering until each face is ready.
const faces = [
  { family: DISPLAY_FONT, file: "JetBrainsMono_400Regular.ttf", weight: "400" },
  { family: DISPLAY_FONT, file: "JetBrainsMono_700Bold.ttf", weight: "700" },
  { family: DISPLAY_FONT, file: "JetBrainsMono_800ExtraBold.ttf", weight: "800" },
  { family: WORDMARK_FONT, file: "SpaceMono-Regular.ttf", weight: "400" },
  { family: WORDMARK_FONT, file: "SpaceMono-Bold.ttf", weight: "700" },
];

for (const face of faces) {
  void loadFont({ family: face.family, url: staticFile(`fonts/${face.file}`), weight: face.weight });
}
