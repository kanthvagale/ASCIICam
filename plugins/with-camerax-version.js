// VisionCamera pins CameraX 1.7.0-alpha03, which creates a new window context on every display-size
// lookup. Android 11 caps those, so after a few session setups (e.g. flipping cameras) configure fails
// with "Too many unused window contexts" and the camera freezes. 1.7.0-rc02 reads the size directly there.
const { withProjectBuildGradle } = require("expo/config-plugins");

const CAMERAX_VERSION = "1.7.0-rc02";
const MARKER = "// with-camerax-version";

const BLOCK = `
${MARKER}
allprojects {
  configurations.all {
    resolutionStrategy.eachDependency { details ->
      if (details.requested.group == 'androidx.camera') {
        details.useVersion '${CAMERAX_VERSION}'
      }
    }
  }
}
`;

module.exports = function withCameraXVersion(config) {
  return withProjectBuildGradle(config, (mod) => {
    if (!mod.modResults.contents.includes(MARKER)) {
      mod.modResults.contents += BLOCK;
    }
    return mod;
  });
};
