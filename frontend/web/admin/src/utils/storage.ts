export function getLocalStorageItem<T>(key: string): T | null {
  try {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : null;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
}
