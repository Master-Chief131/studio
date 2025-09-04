export function saveToStorage<T>(key: string, value: T): void {
  if (typeof window !== 'undefined') {
    try {
      const serializedState = JSON.stringify(value);
      localStorage.setItem(key, serializedState);
    } catch (error) {
      console.error('Error saving to localStorage', error);
    }
  }
}

export function getFromStorage<T>(key: string): T | null {
  if (typeof window !== 'undefined') {
    try {
      const serializedState = localStorage.getItem(key);
      if (serializedState === null) {
        return null;
      }
      return JSON.parse(serializedState);
    } catch (error) {
      console.error('Error reading from localStorage', error);
      return null;
    }
  }
  return null;
}

export function removeFromStorage(key: string): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(key);
  }
}
