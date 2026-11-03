import { useRouter } from "expo-router";
import { useCallback } from "react";

/** ViewModel for the `/` (splash) route. */
export function useSplashController() {
  const router = useRouter();

  const onFinish = useCallback(() => {
    router.replace("/camera");
  }, [router]);

  return { onFinish };
}
