import { asciiFontSize } from "@/constants/camera";
import { makeStyles } from "@/theme";
import { TextInput } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedProps,
} from "react-native-reanimated";

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const AnimatedText = ({ text }: { text: SharedValue<string> }) => {
  const styles = useStyles();

  const animatedProps = useAnimatedProps(() => {
    return {
      value: text.value,
      text: text.value,
    };
  });

  // useDerivedValue(() => {
  //   console.log(text.value);
  // });

  return (
    <AnimatedTextInput
      animatedProps={animatedProps}
      editable={false}
      style={styles.text}
      multiline={true}
    />
  );
};

export default AnimatedText;

const useStyles = makeStyles((theme) => ({
  text: {
    flex: 1,
    fontFamily: "SpaceMono-Bold",
    fontSize: asciiFontSize,
    lineHeight: asciiFontSize,
    textAlign: "center",
    color: "white",
  },
}));
