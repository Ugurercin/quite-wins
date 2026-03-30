import { Scene } from '@/scenes/types'
import { getGroveColors } from './colors'
import groveMusic from './music'
import GardenCanvas from './GardenCanvas'

const grove: Scene = {
  id: 'grove',
  name: 'Grove',
  locked: false,
  music: groveMusic,
  getColors: getGroveColors,
  Canvas: GardenCanvas,
}

export default grove