import { Scene } from '@/scenes/types'
import { getGroveColors } from './colors'
import groveMusic from './music'
import GardenCanvas from './GardenCanvas'
import PreviewCanvas from './PreviewCanvas'

const grove: Scene = {
  id: 'grove',
  name: 'Grove',
  locked: false,
  // TODO: Replace with real screenshot before App Store submission
  thumbnail: require('../../../assets/thumbnails/grove.png'),
  music: groveMusic,
  getColors: getGroveColors,
  Canvas: GardenCanvas,
  PreviewCanvas,
}

export default grove