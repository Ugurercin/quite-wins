import React from 'react'
import { Theme } from '@/theme/theme'
import { Plant } from '@/hooks/usePlants'
import { Win } from '@/hooks/useWins'
import { GroveBackgroundColors } from './grove/palettes/types'

export type { GroveBackgroundColors }

// ─── Colors ──────────────────────────────────────────────────────────────────
// Every scene must provide these color tokens.
// Plant sprites and canvas read from SceneColors — never from Theme directly.

export interface SceneColors {
  // Plant
  trunk: string
  bodyDark: string
  bodyMid: string
  bodyLight: string
  sprout: string
  bloom: string
  // Canvas background
  backgroundGarden: string
  backgroundGround: string
}

// ─── Canvas Props ─────────────────────────────────────────────────────────────
// Props every scene's GardenCanvas must accept.

export interface CanvasProps {
  width: number
  height: number
  colors: SceneColors
  theme: Theme          // still needed for accent colors (emoji → flower color)
  plants: Plant[]
  wins: Win[]
  activeSceneId: string // filters scene-locked elders — only show elders belonging to this scene
  paletteBackgroundColors?: GroveBackgroundColors  // Grove-only — overrides sky/hill/ground colors
  onPlantTap?: (plant: Plant) => void
}

// ─── Scene ───────────────────────────────────────────────────────────────────
// The contract every scene must fulfill.
// Add a new scene by creating a folder and exporting an object matching this shape.

export interface PreviewCanvasProps {
  width: number
  height: number
  colors: SceneColors
}

export interface Scene {
  id: string
  name: string
  locked: boolean
  bundleId?: string     // if set, this scene belongs to a paid bundle
  thumbnail: any        // require()'d PNG — shown in paywall and shop cards. Replace with real screenshot before App Store submission.
  music: any            // require()'d mp3 — null if no music yet
  getColors: (theme: Theme) => SceneColors   // derives colors from current theme
  Canvas: React.ComponentType<CanvasProps>
  PreviewCanvas?: React.ComponentType<PreviewCanvasProps>
}