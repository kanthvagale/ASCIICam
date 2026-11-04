import { Stack } from "expo-router";

import { FadeScreen, SheetScreen, stackScreenOptions } from "@/layout";

export default function MainLayout() {
  return (
    <Stack screenOptions={stackScreenOptions}>
      <Stack.Screen name="camera" />
      <Stack.Screen name="settings" options={FadeScreen} />
      <Stack.Screen name="options" options={FadeScreen} />
      <Stack.Screen name="gallery" options={SheetScreen} />
      <Stack.Screen name="upload" options={SheetScreen} />
      <Stack.Screen name="viewer/[id]" options={SheetScreen} />
    </Stack>
  );
}
