// src/test/bridge.ts
//
// Test bridge. Exposes a stable, read-only `window.app` snapshot for
// the shared app shell so end-to-end and unit tests can assert on
// the active surface, selected record, item count, storage status,
// last error, and active panel without coupling to React internals.

import { useEffect } from "react";

import {
  SCOPED_REVIEW_ACTIVE_SURFACE,
  useScopedReviewStore,
} from "../features/scoped-review-pulse-two/scoped-review-pulse-two.store";
import type {
  ActivePanelId,
  ActiveSurfaceId,
  ScopedReviewState,
} from "../features/scoped-review-pulse-two/scoped-review-pulse-two.types";

export interface AppWindowSnapshot {
  readonly activeSurface: ActiveSurfaceId;
  readonly activePanel: ActivePanelId;
  readonly selectedItemId: string | null;
  readonly itemCount: number;
  readonly storageStatus: ScopedReviewState["storageStatus"];
  readonly lastError: string | null;
}

export interface AppWindow {
  readonly getState: () => AppWindowSnapshot;
  readonly activeSurface: ActiveSurfaceId;
  readonly activePanel: ActivePanelId;
  readonly selectedItemId: string | null;
  readonly itemCount: number;
  readonly storageStatus: ScopedReviewState["storageStatus"];
  readonly lastError: string | null;
}

declare global {
  interface Window {
    app?: AppWindow;
  }
}

export const buildAppWindow = (state: ScopedReviewState): AppWindow => {
  const snapshot: AppWindowSnapshot = {
    activeSurface: state.activeSurface,
    activePanel: state.activePanel,
    selectedItemId: state.selectedItemId,
    itemCount: state.itemCount,
    storageStatus: state.storageStatus,
    lastError: state.lastError,
  };
  return {
    getState: () => snapshot,
    activeSurface: snapshot.activeSurface,
    activePanel: snapshot.activePanel,
    selectedItemId: snapshot.selectedItemId,
    itemCount: snapshot.itemCount,
    storageStatus: snapshot.storageStatus,
    lastError: snapshot.lastError,
  };
};

/**
 * Sync the current store snapshot to `window.app`. Tests can read
 * `window.app` directly to assert on shell state without coupling
 * to React internals.
 */
export function useAppWindowBridge(): void {
  const { state } = useScopedReviewStore();
  useEffect(() => {
    if (typeof globalThis === "undefined") return;
    const w = globalThis as { window?: Window };
    if (!w.window) return;
    w.window.app = buildAppWindow(state);
    return () => {
      if (
        w.window &&
        w.window.app &&
        w.window.app.getState().activeSurface === state.activeSurface
      ) {
        // Only clear if it still points at our snapshot to avoid clobbering
        // a freshly-installed bridge in a different test.
        delete w.window.app;
      }
    };
  }, [state]);
}

export { SCOPED_REVIEW_ACTIVE_SURFACE };