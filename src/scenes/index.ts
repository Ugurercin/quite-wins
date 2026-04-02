import { Scene } from './types'
import grove from './grove'
import night from './night'
import space from './space'

// ─── Registry ────────────────────────────────────────────────────────────────
// Add new scenes here as you build them. That's it.
// The rest of the app reads from SCENES and DEFAULT_SCENE — no other changes needed.

export const SCENES: Scene[] = [
  grove,
  night,
  space,
]

export const DEFAULT_SCENE = grove

export const getSceneById = (id: string): Scene =>
  SCENES.find(s => s.id === id) ?? DEFAULT_SCENE