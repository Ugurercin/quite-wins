import { Theme } from '@/theme/theme'
import { SceneColors } from '@/scenes/types'

// Night Grove colors are fixed — moonlight doesn't shift with light/dark mode.
export const getNightColors = (_theme: Theme): SceneColors => ({
  trunk:            '#2A2D1A',  // deep charcoal brown
  bodyDark:         '#0D1F0D',  // deep midnight green
  bodyMid:          '#1E3D2A',  // moonlit mid-green
  bodyLight:        '#7AA8C0',  // silver-blue leaf highlight
  sprout:           '#3A6B5A',  // cool blue-green
  bloom:            '#C8D8F0',  // moonlit silver-white
  backgroundGarden: '#080C1F',  // near-black navy
  backgroundGround: '#0D1A0D',  // deep dark earth
})
