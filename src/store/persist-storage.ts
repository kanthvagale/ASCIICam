import AsyncStorage from "@react-native-async-storage/async-storage";
import { createJSONStorage } from "zustand/middleware";

/**
 * The storage adapter every persisted store shares.
 *
 * `persist` writes asynchronously, so a store is briefly at its default values
 * on launch. Gate on `useHasHydrated` below before rendering anything that
 * would flash the wrong state.
 *
 *   export const useFooStore = create<FooState>()(
 *     persist(
 *       (set) => ({ count: 0, inc: () => set((s) => ({ count: s.count + 1 })) }),
 *       { name: StorageKeys.foo, storage: persistStorage }
 *     )
 *   );
 */
export const persistStorage = createJSONStorage(() => AsyncStorage);
