import { Scene } from '@/scenes/types'
import { getNightColors } from './colors'
import nightMusic from './music'
import GardenCanvas from './GardenCanvas'
import PreviewCanvas from './PreviewCanvas'

const night: Scene = {
  id: 'night',
  name: 'Night Grove',
  locked: false,
  music: nightMusic,
  getColors: getNightColors,
  Canvas: GardenCanvas,
  PreviewCanvas,
}

export default night
