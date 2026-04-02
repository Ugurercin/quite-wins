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

export type PlantType = 'terrestrial' | 'gas' | 'crystal'

export const PLANT_TYPES: PlantType[] = ['terrestrial', 'gas', 'crystal']

export const randomPlantType = (): PlantType =>
  PLANT_TYPES[Math.floor(Math.random() * PLANT_TYPES.length)]
