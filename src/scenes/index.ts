import { Scene } from './types'
import grove from './grove'

// ─── Registry ────────────────────────────────────────────────────────────────
// Add new scenes here as you build them. That's it.
// The rest of the app reads from SCENES and DEFAULT_SCENE — no other changes needed.

export const SCENES: Scene[] = [
  grove,
  // desert,   ← uncomment when ready
  // night,    ← uncomment when ready
]

export const DEFAULT_SCENE = grove

export const getSceneById = (id: string): Scene =>
  SCENES.find(s => s.id === id) ?? DEFAULT_SCENE