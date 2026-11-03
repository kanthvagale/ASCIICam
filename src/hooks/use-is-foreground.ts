import { useEffect, useState } from "react";
import { AppState } from "react-native";

/** Whether the app is in the foreground (`active`), updated as it changes. */
export function useIsForeground(): boolean {
  const [isForeground, setIsForeground] = useState(() => AppState.currentState === "active");

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      setIsForeground(state === "active");
    });
    return () => subscription.remove();
  }, []);

  return isForeground;
}
