// src/features/scoped-review-pulse-two/scoped-review-pulse-two.store.tsx
//
// Shared app shell store for the Scoped Review Pulse Two feature.
// Owns active surface, selected item, item counts, storage status,
// last error, active panel, preferences, and the stable action
// handlers that screen-owner stories wire through props.actions.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import {
  defaultPreferences,
  fixtureItems,
} from "../../__fixtures__/scoped-review-pulse-two.fixture";
import {
  buildSnapshot,
  createLocalStorageRepo,
  type ScopedReviewRepo,
} from "./scoped-review-pulse-two.repo";
import type {
  ActivePanelId,
  ActiveSurfaceId,
  ScopedReviewActionId,
  ScopedReviewItem,
  ScopedReviewState,
  ScopedReviewStore,
} from "./scoped-review-pulse-two.types";

const ACTIVE_SURFACE: ActiveSurfaceId = "SURF_STATUS_UTILITY";
const DEFAULT_ACTIVE_PANEL: ActivePanelId = "overview";

const computeItemCount = (items: ReadonlyArray<ScopedReviewItem>): number => items.length;

const buildInitialState = (snapshot: ReturnType<ScopedReviewRepo["load"]>): ScopedReviewState => {
  const items = fixtureItems;
  return {
    activeSurface: ACTIVE_SURFACE,
    activePanel: snapshot.snapshot.activePanel,
    selectedItemId: snapshot.snapshot.selectedItemId,
    items,
    itemCount: computeItemCount(items),
    preferences: snapshot.snapshot.preferences,
    storageStatus: snapshot.lastError === null ? "ready" : "error",
    lastError: snapshot.lastError,
  };
};

const ScopedReviewStoreContext = createContext<ScopedReviewStore | null>(null);

export interface ScopedReviewStoreProviderProps {
  readonly children: ReactNode;
  readonly repo?: ScopedReviewRepo;
  readonly initialItems?: ReadonlyArray<ScopedReviewItem>;
  readonly initialPreferences?: typeof defaultPreferences;
  readonly onStateChange?: (state: ScopedReviewState) => void;
}

export function ScopedReviewStoreProvider({
  children,
  repo,
  initialItems,
  initialPreferences,
  onStateChange,
}: ScopedReviewStoreProviderProps): JSX.Element {
  const repoRef = useRef<ScopedReviewRepo>(repo ?? createLocalStorageRepo());
  const onStateChangeRef = useRef(onStateChange);

  useEffect(() => {
    onStateChangeRef.current = onStateChange;
  }, [onStateChange]);

  const [state, setState] = useState<ScopedReviewState>(() => {
    const loaded = repoRef.current.load();
    const baseState = buildInitialState(loaded);
    const items = initialItems ?? baseState.items;
    return {
      ...baseState,
      items,
      itemCount: initialItems ? computeItemCount(initialItems) : baseState.itemCount,
      preferences: initialPreferences ?? baseState.preferences,
    };
  });

  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    const result = repoRef.current.save(
      buildSnapshot(state.preferences, state.selectedItemId, state.activePanel),
    );
    if (!result.ok) {
      setState((prev) => {
        if (prev.storageStatus === "error" && prev.lastError === result.reason) {
          return prev;
        }
        return {
          ...prev,
          storageStatus: "error",
          lastError: result.reason,
        };
      });
    } else {
      setState((prev) => {
        if (prev.storageStatus === "error") {
          return {
            ...prev,
            storageStatus: "ready",
            lastError: null,
          };
        }
        return prev;
      });
    }
  }, [state.preferences, state.selectedItemId, state.activePanel]);

  useEffect(() => {
    onStateChangeRef.current?.(state);
  }, [state]);

  const refresh = useCallback(() => {
    setState((prev) => {
      const timestamp = new Date().toISOString();
      const nextItems: ReadonlyArray<ScopedReviewItem> = prev.items.map((item, index) => {
        const cycle: ScopedReviewItem["status"][] = [
          "active",
          "processing",
          "queued",
        ];
        const status = cycle[index % cycle.length] ?? "active";
        return { ...item, status, updatedAt: timestamp };
      });
      return {
        ...prev,
        items: nextItems,
        itemCount: computeItemCount(nextItems),
        storageStatus: "ready",
        lastError: null,
      };
    });
  }, []);

  const selectItem = useCallback(() => {
    setState((prev) => {
      const firstId = prev.items[0]?.id ?? null;
      if (firstId === prev.selectedItemId) return prev;
      return { ...prev, selectedItemId: firstId };
    });
  }, []);

  const setActivePanel = useCallback(() => {
    setState((prev) => {
      const order: ActivePanelId[] = ["overview", "items", "preferences"];
      const idx = order.indexOf(prev.activePanel);
      const nextPanel = order[(idx + 1) % order.length] ?? DEFAULT_ACTIVE_PANEL;
      if (nextPanel === prev.activePanel) return prev;
      return { ...prev, activePanel: nextPanel };
    });
  }, []);

  const toggleInstant = useCallback(() => {
    setState((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        instantToggle: !prev.preferences.instantToggle,
      },
    }));
  }, []);

  const toggleAutoRefresh = useCallback(() => {
    setState((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        autoRefresh: !prev.preferences.autoRefresh,
      },
    }));
  }, []);

  const actions = useMemo<Record<ScopedReviewActionId, () => void>>(
    () => ({
      "refresh-1": refresh,
      "select-item": selectItem,
      "set-active-panel": setActivePanel,
      "toggle-instant": toggleInstant,
      "toggle-auto-refresh": toggleAutoRefresh,
    }),
    [refresh, selectItem, setActivePanel, toggleInstant, toggleAutoRefresh],
  );

  const value = useMemo<ScopedReviewStore>(
    () => ({ state, actions }),
    [state, actions],
  );

  return (
    <ScopedReviewStoreContext.Provider value={value}>
      {children}
    </ScopedReviewStoreContext.Provider>
  );
}

export function useScopedReviewStore(): ScopedReviewStore {
  const ctx = useContext(ScopedReviewStoreContext);
  if (ctx === null) {
    throw new Error("useScopedReviewStore must be used within a ScopedReviewStoreProvider");
  }
  return ctx;
}

export const SCOPED_REVIEW_ACTIVE_SURFACE = ACTIVE_SURFACE;