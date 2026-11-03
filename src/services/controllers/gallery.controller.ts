import { useRouter } from "expo-router";

import { useCapturesStore } from "@/store/captures";
import type { Capture } from "@/types/capture";

export function useGalleryController() {
  const router = useRouter();
  const captures = useCapturesStore((s) => s.captures);

  return {
    captures,
    open: (capture: Capture) =>
      router.push({ pathname: "/viewer/[id]", params: { id: capture.id } }),
    openUpload: () => router.push("/upload"),
  };
}
