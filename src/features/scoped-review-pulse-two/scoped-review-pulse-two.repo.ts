// src/features/scoped-review-pulse-two/scoped-review-pulse-two.repo.ts
//
// Local persistence adapter for the Scoped Review Pulse Two feature.
// Stores user preferences and selection in localStorage. Corrupted or
// version-mismatched data is dropped and the caller receives a recovery
// signal so the UI can show a recoverable state.

import { fixturePersistedSnapshot } from "../../__fixtures__/scoped-review-pulse-two.fixture";
import type {
  ScopedReviewPersistedSnapshot,
  ScopedReviewPreferences,
  ActivePanelId,
} from "./scoped-review-pulse-two.types";

export const STORAGE_KEY = "scoped-review-pulse-two:v1";
export const STORAGE_VERSION = 1 as const;

export interface PersistOk {
  readonly ok: true;
}

export interface PersistErr {
  readonly ok: false;
  readonly reason: string;
}

export type PersistResult = PersistOk | PersistErr;

export interface RepoLoadResult {
  readonly snapshot: ScopedReviewPersistedSnapshot;
  readonly recovered: boolean;
  readonly lastError: string | null;
}

export interface ScopedReviewRepo {
  load(): RepoLoadResult;
  save(snapshot: ScopedReviewPersistedSnapshot): PersistResult;
  clear(): void;
}

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isPanelId = (value: unknown): value is ActivePanelId =>
  value === "overview" || value === "items" || value === "preferences";

const validateSnapshot = (
  value: unknown,
): { ok: true; snapshot: ScopedReviewPersistedSnapshot } | { ok: false; reason: string } => {
  if (!isObject(value)) {
    return { ok: false, reason: "snapshot is not an object" };
  }
  if (value.version !== STORAGE_VERSION) {
    return { ok: false, reason: `unsupported snapshot version: ${String(value.version)}` };
  }
  const prefs = value.preferences;
  if (!isObject(prefs)) {
    return { ok: false, reason: "preferences missing" };
  }
  if (typeof prefs.instantToggle !== "boolean") {
    return { ok: false, reason: "preferences.instantToggle must be boolean" };
  }
  if (typeof prefs.autoRefresh !== "boolean") {
    return { ok: false, reason: "preferences.autoRefresh must be boolean" };
  }
  if (!isPanelId(value.activePanel)) {
    return { ok: false, reason: `invalid activePanel: ${String(value.activePanel)}` };
  }
  if (value.selectedItemId !== null && typeof value.selectedItemId !== "string") {
    return { ok: false, reason: "selectedItemId must be string or null" };
  }
  return {
    ok: true,
    snapshot: {
      version: STORAGE_VERSION,
      preferences: {
        instantToggle: prefs.instantToggle,
        autoRefresh: prefs.autoRefresh,
      },
      selectedItemId: value.selectedItemId as string | null,
      activePanel: value.activePanel,
    },
  };
};

export const createLocalStorageRepo = (
  storageKey: string = STORAGE_KEY,
  fallback: ScopedReviewPersistedSnapshot = fixturePersistedSnapshot,
): ScopedReviewRepo => {
  const hasWindow = (): boolean =>
    typeof globalThis !== "undefined" &&
    typeof (globalThis as { localStorage?: Storage }).localStorage !== "undefined";

  const readStorage = (): string | null => {
    if (!hasWindow()) return null;
    try {
      return (globalThis as { localStorage: Storage }).localStorage.getItem(storageKey);
    } catch {
      return null;
    }
  };

  const writeStorage = (raw: string): boolean => {
    if (!hasWindow()) return false;
    try {
      (globalThis as { localStorage: Storage }).localStorage.setItem(storageKey, raw);
      return true;
    } catch {
      return false;
    }
  };

  const removeStorage = (): void => {
    if (!hasWindow()) return;
    try {
      (globalThis as { localStorage: Storage }).localStorage.removeItem(storageKey);
    } catch {
      /* ignore */
    }
  };

  return {
    load(): RepoLoadResult {
      const raw = readStorage();
      if (raw === null) {
        return { snapshot: fallback, recovered: false, lastError: null };
      }
      let parsed: unknown;
      try {
        parsed = JSON.parse(raw);
      } catch {
        return { snapshot: fallback, recovered: true, lastError: "persisted snapshot was not valid JSON" };
      }
      const validation = validateSnapshot(parsed);
      if (!validation.ok) {
        return {
          snapshot: fallback,
          recovered: true,
          lastError: validation.reason,
        };
      }
      return {
        snapshot: validation.snapshot,
        recovered: false,
        lastError: null,
      };
    },
    save(snapshot: ScopedReviewPersistedSnapshot): PersistResult {
      const validation = validateSnapshot(snapshot);
      if (!validation.ok) {
        return { ok: false, reason: validation.reason };
      }
      const ok = writeStorage(JSON.stringify(validation.snapshot));
      if (!ok) {
        return { ok: false, reason: "localStorage write failed" };
      }
      return { ok: true };
    },
    clear(): void {
      removeStorage();
    },
  };
};

export const buildSnapshot = (
  preferences: ScopedReviewPreferences,
  selectedItemId: string | null,
  activePanel: ActivePanelId,
): ScopedReviewPersistedSnapshot => ({
  version: STORAGE_VERSION,
  preferences,
  selectedItemId,
  activePanel,
});