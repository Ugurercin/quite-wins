// Pre-calculated slot positions as fractions of canvas (0.0–1.0).
// x/y represent the center-bottom anchor of the plant (stem base).
// Spirals outward from center. 10 slots total.

export interface SlotPosition {
  x: number
  y: number
}

export const GARDEN_POSITIONS: SlotPosition[] = [
  { x: 0.50, y: 0.62 }, // 0 — center
  { x: 0.65, y: 0.58 }, // 1 — center-right
  { x: 0.35, y: 0.58 }, // 2 — center-left
  { x: 0.50, y: 0.44 }, // 3 — center-top
  { x: 0.72, y: 0.48 }, // 4 — upper-right
  { x: 0.28, y: 0.48 }, // 5 — upper-left
  { x: 0.78, y: 0.65 }, // 6 — far-right
  { x: 0.22, y: 0.65 }, // 7 — far-left
  { x: 0.62, y: 0.76 }, // 8 — lower-right
  { x: 0.38, y: 0.76 }, // 9 — lower-left
]

export const resolvePosition = (
  slot: SlotPosition,
  canvasWidth: number,
  canvasHeight: number,
): { x: number; y: number } => ({
  x: slot.x * canvasWidth,
  y: slot.y * canvasHeight,
})
