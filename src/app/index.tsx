import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useHomeController } from "@/services/controllers";
import { makeStyles } from "@/theme";

export default function HomeScreen() {
  const styles = useStyles();
  useHomeController();

  return (
    <SafeAreaView style={styles.root} edges={["top"]}>
      <View />
    </SafeAreaView>
  );
}

const useStyles = makeStyles((theme) => ({
  root: { flex: 1, backgroundColor: theme.colors.background },
}));
