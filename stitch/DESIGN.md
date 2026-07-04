---
name: Technical Utility Interface
colors:
  surface: '#f9f9ff'
  surface-dim: '#cfdaf2'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eeff'
  surface-container-high: '#dee8ff'
  surface-container-highest: '#d8e3fb'
  on-surface: '#111c2d'
  on-surface-variant: '#424656'
  inverse-surface: '#263143'
  inverse-on-surface: '#ecf1ff'
  outline: '#727687'
  outline-variant: '#c2c6d8'
  surface-tint: '#0054d6'
  primary: '#0050cb'
  on-primary: '#ffffff'
  primary-container: '#0066ff'
  on-primary-container: '#f8f7ff'
  inverse-primary: '#b3c5ff'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#006645'
  on-tertiary: '#ffffff'
  tertiary-container: '#008259'
  on-tertiary-container: '#e1ffec'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae1ff'
  primary-fixed-dim: '#b3c5ff'
  on-primary-fixed: '#001849'
  on-primary-fixed-variant: '#003fa4'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f9f9ff'
  on-background: '#111c2d'
  surface-variant: '#d8e3fb'
typography:
  display:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-sm:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  body-xs:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-mono:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.02em
  timestamp:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '400'
    lineHeight: 12px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  gutter: 12px
  margin: 16px
---

## Brand & Style
The design system is engineered for high-density information environments where clarity and technical precision are paramount. It adopts a **Modern Corporate** aesthetic with a heavy emphasis on **Minimalism** and functional utility. 

The visual language communicates reliability and speed. By stripping away decorative elements and focusing on structural grid alignment, the interface ensures that status changes and system pulses are immediately perceptible. The emotional response is one of controlled authority—a "cockpit" experience for technical operators who require rapid data ingestion without cognitive fatigue.

## Colors
The palette is centered around **Utility Blue** and **System Slate**, creating a high-contrast environment optimized for legibility.

- **Utility Blue (#0066FF):** Reserved for primary actions, active states, and focus indicators. It acts as the "signal" within the "noise."
- **System Slate (#1E293B / #64748B):** Used for typography, iconography, and structural borders to provide a grounded, professional foundation.
- **Success Green (#10B981):** A functional tertiary color used exclusively for "Healthy" or "Completed" status indicators.
- **Surface Neutrals:** A range of cool greys (Slate 50-200) are used to differentiate nested containers without relying on heavy shadows.

## Typography
This design system utilizes **Geist** for its clean, geometric grotesque qualities which excel in high-density layouts. It provides a technical feel while remaining highly legible at small sizes. 

**JetBrains Mono** is employed for all quantitative data, timestamps, and system IDs. The monospaced nature ensures that numerical values align vertically in tables and status boards, allowing for easier "scanning" of data columns. 

All type is set with a slightly tighter tracking in headlines to maintain a compact footprint. Body text prioritizes vertical rhythm to ensure that even in dense views, the line hierarchy is preserved.

## Layout & Spacing
The layout follows a **Fluid Grid** model optimized for dashboard density. A 12-column system is used for desktop, but the primary logic is driven by "Flex-Tiles"—containers that snap to a 4px baseline grid.

- **Density:** High. Standard padding within components is reduced to 8px (sm) or 12px (md) to maximize information per square inch.
- **Breakpoints:**
  - **Desktop (1280px+):** Full 12-column visibility with persistent side navigation.
  - **Tablet (768px - 1279px):** 8-column grid; status tiles reflow into a 2-column stack.
  - **Mobile (<767px):** Single column; margins reduce to 12px; horizontal scrolling permitted for wide data tables.

## Elevation & Depth
In this design system, hierarchy is communicated through **Low-contrast outlines** and **Tonal Layers** rather than shadows. This minimizes visual "fuzziness" and maintains a crisp, technical look.

- **Level 0 (Background):** Slate-50 (#F8FAFC).
- **Level 1 (Cards/Tiles):** White background with a 1px border in Slate-200.
- **Level 2 (Dropdowns/Modals):** White background with a slightly darker Slate-300 border and a very tight 4px blur shadow (low opacity) to suggest interaction priority.
- **Active State:** A 2px Utility Blue border indicates focus or selection, providing immediate feedback.

## Shapes
The shape language is **Soft (0.25rem)**. This subtle rounding takes the edge off the industrial aesthetic without sacrificing the professional, organized feel of the interface.

- **Status Tiles:** 4px (0.25rem) corner radius.
- **Action Buttons:** 4px (0.25rem) corner radius for a "blocky" tool-like appearance.
- **Form Inputs:** 4px (0.25rem) for consistency.
- **Pills/Chips:** Fully rounded (circular) to distinguish them clearly from interactive buttons.

## Components
- **Status Tiles:** Compact containers featuring a `label-mono` header, a primary metric in `headline-md`, and a bottom-aligned `timestamp`. Status is indicated by a 4px vertical bar on the left edge (e.g., Green for Up, Blue for Processing).
- **Primary Action Buttons:** Solid Utility Blue background with White text. Hover states shift to a deeper navy. The size is compact (32px height) to fit the high-density grid.
- **Toggle Switches:** Small, rectangular toggles. "Off" is Slate-200; "On" is Utility Blue. The switch movement is instant (100ms) to provide immediate feedback.
- **Input Fields:** Minimalist design with a 1px Slate-200 border. Focus state triggers a Utility Blue border and a subtle light-blue inner glow.
- **Data Lists:** Zebra-striped using Slate-50 for even rows. No horizontal borders between rows to reduce visual noise; only a single vertical line separates the "Status" icon from the text content.
- **Pulse Indicator:** A small, 8px breathing dot used in the top-right of the dashboard to show real-time connectivity.