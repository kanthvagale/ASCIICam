import { useRouter } from "expo-router";

/** ViewModel for the `+not-found` route. */
export function useNotFoundController() {
  const router = useRouter();
  return { goHome: () => router.replace("/camera") };
}
