import React from 'react'
import { SceneColors } from '@/scenes/types'

// ─── Stage props ──────────────────────────────────────────────────────────────
// Every stage component across every plant type must accept exactly these props.

export interface StageProps {
  x: number
  y: number
  colors: SceneColors
  accentColor?: string
}

// ─── Elder props ──────────────────────────────────────────────────────────────
// Every elder component must accept exactly these props.

export interface ElderProps {
  x: number
  y: number
  colors: SceneColors
}

// ─── Plant types ──────────────────────────────────────────────────────────────

export type PlantType = 'flower' | 'mushroom' | 'cactus'

export const PLANT_TYPES: PlantType[] = ['flower', 'mushroom', 'cactus']

// Assign a random plant type when a new slot opens.
// Later this can be replaced with user selection or emoji-based mapping.
export const randomPlantType = (): PlantType =>
  PLANT_TYPES[Math.floor(Math.random() * PLANT_TYPES.length)]