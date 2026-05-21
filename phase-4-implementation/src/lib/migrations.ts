import type { PersistedStore } from "../types";

export const CURRENT_VERSION = 1;

type MigrationFn = (raw: unknown) => PersistedStore;

const migrations: Record<number, MigrationFn> = {
  // placeholder for future v0→v1 migrations
  1: (raw) => raw as PersistedStore,
};

export function runMigrations(
  state: unknown,
  fromVersion: number,
): PersistedStore {
  let s = state;
  for (let v = fromVersion + 1; v <= CURRENT_VERSION; v++) {
    s = migrations[v](s);
  }
  return s as PersistedStore;
}
