// src/__fixtures__/scoped-review-pulse-two.fixture.ts
//
// Deterministic fixtures used by the store, persistence adapter, and tests.
// Items are intentionally small (3) so screen snapshots stay legible.

import type {
  ScopedReviewItem,
  ScopedReviewPersistedSnapshot,
  ScopedReviewPreferences,
} from "../features/scoped-review-pulse-two/scoped-review-pulse-two.types";

export const defaultPreferences: ScopedReviewPreferences = {
  instantToggle: false,
  autoRefresh: true,
};

export const fixtureItems: ReadonlyArray<ScopedReviewItem> = [
  {
    id: "srp-001",
    title: "Pulse · Build pipeline",
    status: "active",
    updatedAt: "2026-07-04T17:00:00.000Z",
  },
  {
    id: "srp-002",
    title: "Pulse · Review queue",
    status: "processing",
    updatedAt: "2026-07-04T17:05:00.000Z",
  },
  {
    id: "srp-003",
    title: "Pulse · Notification fan-out",
    status: "queued",
    updatedAt: "2026-07-04T17:10:00.000Z",
  },
];

export const fixturePersistedSnapshot: ScopedReviewPersistedSnapshot = {
  version: 1,
  preferences: defaultPreferences,
  selectedItemId: "srp-001",
  activePanel: "overview",
};