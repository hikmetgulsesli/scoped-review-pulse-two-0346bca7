// src/App.tsx
//
// Application shell. Mounts the shared app store, exposes the test
// bridge on `window.app`, and renders the owned product surface.
// The root container is intentionally neutral (`relative min-h-screen
// w-full overflow-hidden`) so the absolute/fixed generated screen
// layers have a stable viewport frame.

import { StatusUtilityScopedReviewPulseTwo } from "./screens";
import {
  ScopedReviewStoreProvider,
  useScopedReviewStore,
} from "./features/scoped-review-pulse-two/scoped-review-pulse-two.store";
import { useAppWindowBridge } from "./test/bridge";

function AppShell(): JSX.Element {
  useAppWindowBridge();
  const { actions } = useScopedReviewStore();
  return (
    <div
      data-setfarm-root="scoped-review-pulse-two"
      data-testid="setfarm-app-root"
      className="relative min-h-screen w-full overflow-hidden"
    >
      <StatusUtilityScopedReviewPulseTwo actions={actions} />
    </div>
  );
}

export default function App(): JSX.Element {
  return (
    <ScopedReviewStoreProvider>
      <AppShell />
    </ScopedReviewStoreProvider>
  );
}