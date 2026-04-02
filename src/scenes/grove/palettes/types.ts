import { Theme } from '@/theme/theme'
import { SceneColors } from '@/scenes/types'

export interface GroveBackgroundColors {
  skyTop: string
  skyBottom: string
  hillFar: string
  hillNear: string
  ground: string
  groundStrip: string
}

export interface GrovePalette {
  id: string
  name: string
  locked: boolean
  bundleId: string
  dotColor: string        // dominant color shown as dot in picker
  getColors: (theme: Theme) => SceneColors
  getBackgroundColors: () => GroveBackgroundColors
}
