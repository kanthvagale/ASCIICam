import type { PropsWithChildren } from "react";
import { Modal, Pressable, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Text } from "@/components/ui/text";
import { makeStyles } from "@/theme";

export type BottomSheetModalProps = PropsWithChildren<{
  visible: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  /** Blocks backdrop taps and the hardware back button (used when offline). */
  dismissible?: boolean;
}>;

/**
 * The base every modal in the app is built on: a dimmed backdrop plus a sheet
 * that slides up from the bottom. Bottom sheets don't mirror in RTL, so no
 * direction handling is needed here.
 */
export function BottomSheetModal({
  visible,
  onClose,
  title,
  subtitle,
  dismissible = true,
  children,
}: BottomSheetModalProps) {
  const styles = useStyles();
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={dismissible ? onClose : undefined}
    >
      <Animated.View entering={FadeIn.duration(180)} style={styles.backdrop}>
        <Pressable
          style={styles.backdropPress}
          onPress={dismissible ? onClose : undefined}
          accessible={false}
        />

        <Animated.View
          entering={FadeInDown.duration(220)}
          style={[styles.sheet, { paddingBottom: insets.bottom + 24 }]}
        >
          <View style={styles.grabber} />

          {title ? (
            <Text variant="h3" align="center">
              {title}
            </Text>
          ) : null}
          {subtitle ? (
            <Text variant="small" color="textMuted" align="center" style={styles.subtitle}>
              {subtitle}
            </Text>
          ) : null}

          <View style={styles.body}>{children}</View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const useStyles = makeStyles((theme) => ({
  backdrop: { flex: 1, backgroundColor: theme.colors.overlay, justifyContent: "flex-end" },
  backdropPress: { position: "absolute", top: 0, bottom: 0, start: 0, end: 0 },
  sheet: {
    backgroundColor: theme.colors.card,
    borderTopStartRadius: theme.radii.xl,
    borderTopEndRadius: theme.radii.xl,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
  },
  grabber: {
    alignSelf: "center",
    width: theme.spacing.xxl,
    height: theme.spacing.xs,
    borderRadius: theme.radii.pill,
    backgroundColor: theme.colors.border,
    marginBottom: theme.spacing.lg,
  },
  subtitle: { marginTop: theme.spacing.xs },
  body: { marginTop: theme.spacing.lg, gap: theme.spacing.sm },
}));
