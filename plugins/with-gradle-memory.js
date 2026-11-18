// The template's 512 MB metaspace runs out in release builds (D8 dexing and lint load a lot of
// classes across this many native modules), failing with "OutOfMemoryError: Metaspace".
const { withGradleProperties } = require("expo/config-plugins");

const JVM_ARGS = "-Xmx4096m -XX:MaxMetaspaceSize=1024m";

module.exports = function withGradleMemory(config) {
  return withGradleProperties(config, (mod) => {
    const props = mod.modResults.filter(
      (item) =>
        !(item.type === "property" && item.key === "org.gradle.jvmargs"),
    );
    props.push({
      type: "property",
      key: "org.gradle.jvmargs",
      value: JVM_ARGS,
    });
    mod.modResults = props;
    return mod;
  });
};
