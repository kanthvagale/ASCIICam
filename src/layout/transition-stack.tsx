/**
 * The app's navigator: screen-transitions' blank stack, wired into Expo Router.
 *
 * Use it in every `_layout.tsx` and give each screen a preset from
 * `./transition-presets`. In screen-transitions v4 the Expo Router integration
 * ships ready-made, so this re-exports it under one name the app owns.
 */
export {
  BlankStack as TransitionStack,
  type BlankStackNavigationOptions as TransitionStackOptions,
} from "react-native-screen-transitions/expo-router";
