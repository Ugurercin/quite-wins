import { Theme } from '@/theme/theme'
import { SceneColors } from '@/scenes/types'

// Space colors are fixed — deep space doesn't shift with light/dark theme.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getSpaceColors = (_theme: Theme): SceneColors => ({
  trunk:            '#3A2A5A',  // deep purple-dark
  bodyDark:         '#1A1040',  // deep space shadow
  bodyMid:          '#4A3080',  // mid nebula purple
  bodyLight:        '#8060C0',  // bright nebula highlight
  sprout:           '#C0A060',  // asteroid warm gold
  bloom:            '#E0D0FF',  // ringed planet glow
  backgroundGarden: '#05060F',  // near-black space
  backgroundGround: '#1A1424',  // rocky asteroid strip
})
