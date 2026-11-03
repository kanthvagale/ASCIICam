import { useRouter } from "expo-router";

export function useNotFoundController() {
  const router = useRouter();
  return { goHome: () => router.replace("/camera") };
}
