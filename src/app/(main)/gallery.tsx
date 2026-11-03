import { useTranslation } from "react-i18next";
import { FlatList, useWindowDimensions } from "react-native";

import { EmptyState } from "@/components/empty-state";
import { CaptureTile } from "@/components/gallery";
import { Screen } from "@/components/screen";
import { IconButton } from "@/components/ui";
import { useGalleryController } from "@/services/controllers";
import { makeStyles, useTheme } from "@/theme";

const COLUMNS = 3;

export default function GalleryScreen() {
  const styles = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const vm = useGalleryController();

  const gap = theme.spacing.xs;
  const tileSize = (width - theme.spacing.lg * 2 - gap * (COLUMNS - 1)) / COLUMNS;

  return (
    <Screen
      title={t("gallery.title")}
      right={
        <IconButton
          icon="cloud-upload-outline"
          onPress={vm.openUpload}
          accessibilityLabel={t("a11y.upload")}
        />
      }
    >
      <FlatList
        data={vm.captures}
        keyExtractor={(capture) => capture.id}
        numColumns={COLUMNS}
        columnWrapperStyle={{ gap }}
        contentContainerStyle={[styles.grid, { gap }, vm.captures.length === 0 && styles.fill]}
        renderItem={({ item }) => <CaptureTile capture={item} size={tileSize} onPress={vm.open} />}
        ListEmptyComponent={
          <EmptyState
            icon="images-outline"
            title={t("gallery.emptyTitle")}
            body={t("gallery.emptyBody")}
            actionLabel={t("gallery.upload")}
            onAction={vm.openUpload}
          />
        }
      />
    </Screen>
  );
}

const useStyles = makeStyles((theme) => ({
  grid: { padding: theme.spacing.lg, paddingBottom: theme.spacing.xxxl },
  fill: { flexGrow: 1 },
}));
