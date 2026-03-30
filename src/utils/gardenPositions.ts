// Pre-calculated slot positions as fractions of canvas (0.0–1.0).
// x/y represent the center-bottom anchor of the plant (stem base).
//
// ─── Zone map ────────────────────────────────────────────────────────────────
//
//   BACK ROW   y ≈ 0.68   — elder tree territory, far away, feels ancient
//   MID ROW    y ≈ 0.78   — middle ground, established plants
//   FRONT ROW  y ≈ 0.87   — newest growth, closest to viewer
//
// ─── Fill order ──────────────────────────────────────────────────────────────
//
//   New plants fill front-center first, then spread outward, then push back.
//   Elder trees always occupy back-row slots (slots 7–9).
//   This creates natural depth — elders recede, new growth comes forward.
//
//   Slot 0  — front center         (first win always here)
//   Slot 1  — front right
//   Slot 2  — front left
//   Slot 3  — mid center
//   Slot 4  — mid right
//   Slot 5  — mid left
//   Slot 6  — mid far-right
//   Slot 7  — back center          (elder territory starts)
//   Slot 8  — back right
//   Slot 9  — back left
//
// ─── Elder tree slots ────────────────────────────────────────────────────────
//
//   Elder trees are placed starting from slot 7 (back-center), then 8, 9.
//   Regular plants never use slots 7–9 unless all elder slots are full.
//   This keeps elders visually behind new growth at all times.
//
// ─── Adjusting positions ─────────────────────────────────────────────────────
//
//   The canvas height passed to GardenCanvas is (screenHeight * 0.72).
//   GardenBackground places groundY at (canvasHeight * 0.82).
//   Keep all y values between 0.65 and 0.92 to stay on the ground.
//   Never go above 0.60 — that is sky/hill territory.

export interface SlotPosition {
  x: number  // 0.0 = left edge, 1.0 = right edge
  y: number  // 0.0 = top of canvas, 1.0 = bottom of canvas
}

export const GARDEN_POSITIONS: SlotPosition[] = [
  // ── Front row — newest growth, closest to viewer ──
  { x: 0.50, y: 0.87 }, // 0 — front center       ← first win always here
  { x: 0.64, y: 0.85 }, // 1 — front right
  { x: 0.36, y: 0.85 }, // 2 — front left

  // ── Mid row — established plants ──
  { x: 0.50, y: 0.76 }, // 3 — mid center
  { x: 0.68, y: 0.74 }, // 4 — mid right
  { x: 0.32, y: 0.74 }, // 5 — mid left
  { x: 0.78, y: 0.80 }, // 6 — mid far-right

  // ── Back row — elder tree territory ──
  { x: 0.50, y: 0.66 }, // 7 — back center        ← elder slot 1
  { x: 0.67, y: 0.64 }, // 8 — back right         ← elder slot 2
  { x: 0.33, y: 0.64 }, // 9 — back left          ← elder slot 3
]

// ─── Elder slot indices ───────────────────────────────────────────────────────
// usePlants.ts uses these when placing elder trees so they always
// land in the back row, never mixed with regular plant slots.
export const ELDER_SLOT_INDICES = [7, 8, 9]
export const REGULAR_SLOT_INDICES = [0, 1, 2, 3, 4, 5, 6]

export const resolvePosition = (
  slot: SlotPosition,
  canvasWidth: number,
  canvasHeight: number,
): { x: number; y: number } => ({
  x: slot.x * canvasWidth,
  y: slot.y * canvasHeight,
})