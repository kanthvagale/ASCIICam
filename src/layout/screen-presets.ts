import type { NativeStackNavigationOptions } from "expo-router";

// Native-stack presets. For custom curves or a slide from the top, see `expo-router/js-stack`.

export const stackScreenOptions: NativeStackNavigationOptions = {
  headerShown: false,
  // Avoids a white flash behind screens while they animate.
  contentStyle: { backgroundColor: "#000000" },
};

export const FadeScreen: NativeStackNavigationOptions = {
  animation: "fade",
};

/** Slides up from the bottom; swipe down to close. */
export const SheetScreen: NativeStackNavigationOptions = {
  animation: "slide_from_bottom",
  gestureEnabled: true,
  gestureDirection: "vertical",
};
