import {
  SlideFromBottomTransition,
  SlideFromTopTransition,
  TransitionStack as Stack
} from "@/layout";

/**
 * Everything after the splash. `camera` is home; every other screen is
 * reachable from it (upload via gallery). Each screen enters from the side of
 * the camera its button sits on: top-bar screens drop from the top, the
 * gallery rises from the bottom, and upload pushes in from the right. A
 * capture opened from the gallery flips up into the viewer.
 */
export default function MainLayout() {
  return (
    <Stack>
      <Stack.Screen name="camera" />
      <Stack.Screen name="settings" options={SlideFromTopTransition()} />
      <Stack.Screen name="options" options={SlideFromTopTransition()} />
      <Stack.Screen name="gallery" options={SlideFromBottomTransition()} />
      <Stack.Screen name="upload" options={SlideFromBottomTransition()} />
      <Stack.Screen name="viewer/[id]" options={SlideFromBottomTransition()} />
    </Stack>
  );
}
