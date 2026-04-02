// Space scene plant positions — planets float in open space.
// y values sit well above the asteroid ground strip (ground strip starts ~0.75+).
// Elder slots are near the top of the canvas (deep space).
// DO NOT modify src/utils/gardenPositions.ts — this file is Space-only.

interface SlotPosition { x: number; y: number }

export const SPACE_POSITIONS: SlotPosition[] = [
  { x: 0.50, y: 0.58 }, // 0 — center float
  { x: 0.73, y: 0.48 }, // 1 — right high
  { x: 0.27, y: 0.50 }, // 2 — left high
  { x: 0.55, y: 0.38 }, // 3 — upper center
  { x: 0.76, y: 0.65 }, // 4 — right low
  { x: 0.24, y: 0.66 }, // 5 — left low
  { x: 0.64, y: 0.42 }, // 6 — upper right
  { x: 0.50, y: 0.24 }, // 7 — elder top center (deep space)
  { x: 0.74, y: 0.28 }, // 8 — elder top right
  { x: 0.26, y: 0.28 }, // 9 — elder top left
]

export const SPACE_REGULAR_SLOT_INDICES = [0, 1, 2, 3, 4, 5, 6]
export const SPACE_ELDER_SLOT_INDICES   = [7, 8, 9]

export const resolveSpacePosition = (
  slotIndex: number,
  canvasWidth: number,
  canvasHeight: number,
): { x: number; y: number } => {
  const slot = SPACE_POSITIONS[slotIndex] ?? SPACE_POSITIONS[0]
  return { x: slot.x * canvasWidth, y: slot.y * canvasHeight }
}
