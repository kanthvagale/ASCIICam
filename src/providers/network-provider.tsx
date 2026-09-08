import * as Network from "expo-network";
import {
  createContext,
  use,
  useCallback,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";

type NetworkContextValue = {
  isOffline: boolean;
  isChecking: boolean;
  /** Re-reads the connection state; wired to the Retry button. */
  recheck: () => Promise<void>;
};

const NetworkContext = createContext<NetworkContextValue | null>(null);

export function NetworkProvider({ children }: PropsWithChildren) {
  const state = Network.useNetworkState();
  const [isChecking, setIsChecking] = useState(false);
  const [probe, setProbe] = useState<{ against: boolean; value: boolean } | null>(
    null
  );

  // `isInternetReachable` is undefined until the first probe resolves — treat
  // that as online so the app never flashes an offline modal at launch.
  const observedOffline =
    state.isConnected === false || state.isInternetReachable === false;

  // A manual probe only overrides the subscription until the subscription
  // itself reports something new, at which point the override is discarded.
  const isOffline =
    probe && probe.against === observedOffline ? probe.value : observedOffline;

  const recheck = useCallback(async () => {
    setIsChecking(true);
    try {
      const fresh = await Network.getNetworkStateAsync();
      const offline =
        fresh.isConnected === false || fresh.isInternetReachable === false;
      setProbe({ against: observedOffline, value: offline });
    } finally {
      setIsChecking(false);
    }
  }, [observedOffline]);

  const value = useMemo<NetworkContextValue>(
    () => ({ isOffline, isChecking, recheck }),
    [isOffline, isChecking, recheck]
  );

  return <NetworkContext value={value}>{children}</NetworkContext>;
}

export function useNetwork(): NetworkContextValue {
  const ctx = use(NetworkContext);
  if (!ctx) throw new Error("useNetwork must be used within NetworkProvider");
  return ctx;
}
