import AsyncStorage from "@react-native-async-storage/async-storage";

export const storage = {
  async get(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch {
      return null;
    }
  },

  async set(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch {
      // ignore — persistence is best-effort
    }
  },

  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch {
      // ignore
    }
  },

  async getJSON<T>(key: string, fallback: T): Promise<T> {
    const raw = await storage.get(key);
    if (!raw) return fallback;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  },

  async setJSON(key: string, value: unknown): Promise<void> {
    await storage.set(key, JSON.stringify(value));
  },
};
