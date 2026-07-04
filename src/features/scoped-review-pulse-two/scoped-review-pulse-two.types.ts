// src/features/scoped-review-pulse-two/scoped-review-pulse-two.types.ts
//
// State and contract types for the Scoped Review Pulse Two feature.
// All other stories import from here so shape decisions stay in one place.

export type ActiveSurfaceId = "SURF_STATUS_UTILITY";

export type StorageStatus =
  | "idle"
  | "loading"
  | "ready"
  | "error";

export type ActivePanelId =
  | "overview"
  | "items"
  | "preferences";

export type ScopedReviewItemStatus =
  | "active"
  | "processing"
  | "queued"
  | "blocked";

export interface ScopedReviewItem {
  readonly id: string;
  readonly title: string;
  readonly status: ScopedReviewItemStatus;
  readonly updatedAt: string;
}

export interface ScopedReviewPreferences {
  readonly instantToggle: boolean;
  readonly autoRefresh: boolean;
}

export interface ScopedReviewPersistedSnapshot {
  readonly version: 1;
  readonly preferences: ScopedReviewPreferences;
  readonly selectedItemId: string | null;
  readonly activePanel: ActivePanelId;
}

export interface ScopedReviewState {
  readonly activeSurface: ActiveSurfaceId;
  readonly activePanel: ActivePanelId;
  readonly selectedItemId: string | null;
  readonly items: ReadonlyArray<ScopedReviewItem>;
  readonly itemCount: number;
  readonly preferences: ScopedReviewPreferences;
  readonly storageStatus: StorageStatus;
  readonly lastError: string | null;
}

export interface ScopedReviewBootstrapInput {
  readonly items: ReadonlyArray<ScopedReviewItem>;
  readonly preferences: ScopedReviewPreferences;
  readonly selectedItemId: string | null;
  readonly activePanel: ActivePanelId;
}

export interface ScopedReviewBootstrapResult {
  readonly state: ScopedReviewState;
  readonly storageStatus: StorageStatus;
  readonly lastError: string | null;
}

export type ScopedReviewActionId =
  | "refresh-1"
  | "select-item"
  | "set-active-panel"
  | "toggle-instant"
  | "toggle-auto-refresh";

export interface ScopedReviewStore {
  readonly state: ScopedReviewState;
  readonly actions: Readonly<Record<ScopedReviewActionId, () => void>>;
}