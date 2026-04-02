import { Scene } from '@/scenes/types'
import { getNightColors } from './colors'
import nightMusic from './music'
import GardenCanvas from './GardenCanvas'
import PreviewCanvas from './PreviewCanvas'

const night: Scene = {
  id: 'night',
  name: 'Night Grove',
  locked: false,
  bundleId: 'night_space_bundle',
  // TODO: Replace with real screenshot before App Store submission
  thumbnail: require('../../../assets/thumbnails/night.png'),
  music: nightMusic,
  getColors: getNightColors,
  Canvas: GardenCanvas,
  PreviewCanvas,
}

export default night
