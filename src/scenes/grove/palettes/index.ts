import { GrovePalette } from './types'

const autumnPalette: GrovePalette = {
  id: 'autumn',
  name: 'Autumn Grove',
  locked: true,
  bundleId: 'grove_palettes_bundle',
  dotColor: '#D46B20',
  getColors: (_theme) => ({
    trunk:            '#5C3010',
    bodyDark:         '#8B2500',
    bodyMid:          '#C44A10',
    bodyLight:        '#E87830',
    sprout:           '#D4A020',
    bloom:            '#F0C840',
    backgroundGarden: '#1A0E08',
    backgroundGround: '#2A1A0A',
  }),
  getBackgroundColors: () => ({
    skyTop:      '#1A0A04',
    skyBottom:   '#3D1A08',
    hillFar:     '#2A0E04',
    hillNear:    '#1A0A04',
    ground:      '#2A1A0A',
    groundStrip: '#3A2010',
  }),
}

const cherryPalette: GrovePalette = {
  id: 'cherry',
  name: 'Cherry Blossom',
  locked: true,
  bundleId: 'grove_palettes_bundle',
  dotColor: '#E87898',
  getColors: (_theme) => ({
    trunk:            '#5C3040',
    bodyDark:         '#C05070',
    bodyMid:          '#E07898',
    bodyLight:        '#F0A8B8',
    sprout:           '#D4609A',
    bloom:            '#FFD0E0',
    backgroundGarden: '#1A0E12',
    backgroundGround: '#2A1820',
  }),
  getBackgroundColors: () => ({
    skyTop:      '#140810',
    skyBottom:   '#3D1828',
    hillFar:     '#2A0E1A',
    hillNear:    '#1A0812',
    ground:      '#2A1820',
    groundStrip: '#3A2030',
  }),
}

const neonPalette: GrovePalette = {
  id: 'neon',
  name: 'Neon Grove',
  locked: true,
  bundleId: 'grove_palettes_bundle',
  dotColor: '#00FF88',
  getColors: (_theme) => ({
    trunk:            '#003320',
    bodyDark:         '#006040',
    bodyMid:          '#00C060',
    bodyLight:        '#00FF88',
    sprout:           '#00E0A0',
    bloom:            '#80FFD0',
    backgroundGarden: '#020A06',
    backgroundGround: '#041208',
  }),
  getBackgroundColors: () => ({
    skyTop:      '#010604',
    skyBottom:   '#020E08',
    hillFar:     '#021006',
    hillNear:    '#010804',
    ground:      '#041208',
    groundStrip: '#061A0A',
  }),
}

const frostPalette: GrovePalette = {
  id: 'frost',
  name: 'Frost Grove',
  locked: true,
  bundleId: 'grove_palettes_bundle',
  dotColor: '#A0C8E8',
  getColors: (_theme) => ({
    trunk:            '#2A3A4A',
    bodyDark:         '#304858',
    bodyMid:          '#5080A0',
    bodyLight:        '#90C0D8',
    sprout:           '#A0C8E8',
    bloom:            '#E0F0FF',
    backgroundGarden: '#080E14',
    backgroundGround: '#101820',
  }),
  getBackgroundColors: () => ({
    skyTop:      '#060A10',
    skyBottom:   '#101828',
    hillFar:     '#0A1420',
    hillNear:    '#080E18',
    ground:      '#101820',
    groundStrip: '#182030',
  }),
}

const goldenPalette: GrovePalette = {
  id: 'golden',
  name: 'Golden Hour',
  locked: true,
  bundleId: 'grove_palettes_bundle',
  dotColor: '#F0A820',
  getColors: (_theme) => ({
    trunk:            '#3A2008',
    bodyDark:         '#6A3810',
    bodyMid:          '#B06020',
    bodyLight:        '#E09040',
    sprout:           '#C8A030',
    bloom:            '#FFD878',
    backgroundGarden: '#120A04',
    backgroundGround: '#201408',
  }),
  getBackgroundColors: () => ({
    skyTop:      '#0E0804',
    skyBottom:   '#3A1C08',
    hillFar:     '#200E04',
    hillNear:    '#160A04',
    ground:      '#201408',
    groundStrip: '#2E1C0A',
  }),
}

export const GROVE_PALETTES: GrovePalette[] = [
  autumnPalette,
  cherryPalette,
  neonPalette,
  frostPalette,
  goldenPalette,
]

export const DEFAULT_PALETTE_ID = 'default'  // original Grove colors

export const getPaletteById = (id: string): GrovePalette | null =>
  GROVE_PALETTES.find(p => p.id === id) ?? null
