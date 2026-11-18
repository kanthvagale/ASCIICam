// "orientation": "portrait" makes Play infer android.hardware.screen.portrait as required, which hides
// the app from landscape-only devices (Chromebooks, Android XR, some tablets). They letterbox it instead.
const { withAndroidManifest } = require("expo/config-plugins");

const FEATURE = "android.hardware.screen.portrait";

module.exports = function withOptionalPortrait(config) {
  return withAndroidManifest(config, (mod) => {
    const manifest = mod.modResults.manifest;
    const features = (manifest["uses-feature"] ?? []).filter((item) => item.$["android:name"] !== FEATURE);
    features.push({ $: { "android:name": FEATURE, "android:required": "false" } });
    manifest["uses-feature"] = features;
    return mod;
  });
};
