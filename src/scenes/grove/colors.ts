import { Theme } from '@/theme/theme'
import { SceneColors } from '@/scenes/types'

// Grove colors are pulled directly from the app theme
// so light/dark mode is respected automatically.
// Future scenes (desert, night, etc.) can return completely custom values here.

export const getGroveColors = (theme: Theme): SceneColors => ({
  trunk:             theme.plant.trunk,
  bodyDark:          theme.plant.bodyDark,
  bodyMid:           theme.plant.bodyMid,
  bodyLight:         theme.plant.bodyLight,
  sprout:            theme.plant.sprout,
  bloom:             theme.plant.bloom,
  backgroundGarden:  theme.background.garden,
  backgroundGround:  theme.background.gardenGround,
})