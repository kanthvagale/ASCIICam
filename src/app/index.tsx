import { View } from "react-native";

import { SplashWordmark } from "@/components/splash/splash-wordmark";
import { useSplashController } from "@/services/controllers";
import { makeStyles } from "@/theme";

export default function SplashScreen() {
  const styles = useStyles();
  const { onFinish } = useSplashController();

  return (
    <View style={styles.root}>
      <SplashWordmark onFinish={onFinish} />
    </View>
  );
}

// Always black — matches the native splash so the handoff is seamless.
const useStyles = makeStyles(() => ({
  root: {
    flex: 1,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
  },
}));
