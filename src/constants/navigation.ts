import type { NativeStackNavigationOptions } from "expo-router";
import { I18nManager } from "react-native";

const ANIMATION_DURATION = 250;

/**
 * Shared stack options.
 *
 * Native headers are off everywhere — screens render the `Header` component
 * instead, so titles, back buttons and actions are styled in one place and
 * mirror correctly in RTL.
 *
 * `forceRTL` mirrors the layout but not the JS-configured animation name, so
 * the slide direction has to be picked explicitly — otherwise pushing a screen
 * in Arabic slides in from the wrong edge.
 */
export const stackOptions: NativeStackNavigationOptions = {
  headerShown: false,
  animation: I18nManager.isRTL ? "slide_from_left" : "slide_from_right",
  animationDuration: ANIMATION_DURATION,
  gestureEnabled: true,
};

/** Auth screens fade rather than slide — softer for a linear sign-in flow. */
export const authStackOptions: NativeStackNavigationOptions = {
  ...stackOptions,
  animation: "fade_from_bottom",
};
