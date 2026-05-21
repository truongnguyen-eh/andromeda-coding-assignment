import type { PersistedStore } from "../types";
import { CURRENT_VERSION, runMigrations } from "./migrations";

export const STORAGE_KEY = "finance_tracker";

export function read(): PersistedStore | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { version?: number } & PersistedStore;
    const fromVersion = parsed.version ?? 0;
    if (fromVersion < CURRENT_VERSION) {
      return runMigrations(parsed, fromVersion);
    }
    return parsed;
  } catch {
    return null;
  }
}

export function write(store: PersistedStore): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // quota exceeded — silently ignore
  }
}
