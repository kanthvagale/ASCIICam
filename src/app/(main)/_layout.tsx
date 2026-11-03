import {
  SlideFromBottomTransition,
  SlideFromTopTransition,
  TransitionStack as Stack
} from "@/layout";

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
