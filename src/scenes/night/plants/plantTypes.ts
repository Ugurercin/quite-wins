import React from 'react'
import { SceneColors } from '@/scenes/types'

// ─── Stage props ──────────────────────────────────────────────────────────────
export interface StageProps {
  x: number
  y: number
  colors: SceneColors
  accentColor?: string
}

// ─── Elder props ──────────────────────────────────────────────────────────────
export interface ElderProps {
  x: number
  y: number
  colors: SceneColors
}

// ─── Plant types ──────────────────────────────────────────────────────────────
export type PlantType = 'flower' | 'mushroom' | 'cactus'

export const PLANT_TYPES: PlantType[] = ['flower', 'mushroom', 'cactus']

export const randomPlantType = (): PlantType =>
  PLANT_TYPES[Math.floor(Math.random() * PLANT_TYPES.length)]
