import { Scene } from '@/scenes/types'
import { getSpaceColors } from './colors'
import GardenCanvas from './GardenCanvas'
import PreviewCanvas from './PreviewCanvas'

const space: Scene = {
  id: 'space',
  name: 'Deep Space',
  locked: false,
  bundleId: 'night_space_bundle',
  // TODO: Replace with real screenshot before App Store submission
  thumbnail: require('../../../assets/thumbnails/space.png'),
  music: null,
  getColors: getSpaceColors,
  Canvas: GardenCanvas,
  PreviewCanvas,
}

export default space
