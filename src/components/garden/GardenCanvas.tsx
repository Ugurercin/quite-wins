import React from 'react'
import { Canvas, Rect } from '@shopify/react-native-skia'
import { Theme } from '@/theme/theme'
import { Plant } from '@/hooks/usePlants'
import { Win } from '@/hooks/useWins'
import { GARDEN_POSITIONS, resolvePosition } from '@/utils/gardenPositions'
import { emojiToFlowerColor } from '@/utils/emojiColorMap'
import Sprout from './Sprout'
import Seedling from './Seedling'
import Growing from './Growing'
import Bloomed from './Bloomed'
import ElderTree from './ElderTree'

interface Props {
  width: number
  height: number
  theme: Theme
  plants: Plant[]
  wins: Win[]
}

const GardenCanvas = ({ width, height, theme, plants, wins }: Props) => {
  const groundY = height * 0.85

  const getAccentColor = (plant: Plant): string => {
    const lastWinId = plant.winIds[plant.winIds.length - 1]
    const win = wins.find(w => w.id === lastWinId)
    return win ? emojiToFlowerColor(win.emoji, theme) : theme.accent.amber
  }

  return (
    <Canvas style={{ width, height }}>
      {/* Garden background */}
      <Rect x={0} y={0} width={width} height={height} color={theme.background.garden} />
      {/* Ground strip */}
      <Rect x={0} y={groundY} width={width} height={height - groundY} color={theme.background.gardenGround} />

      {plants.map(plant => {
        if (plant.stage === 0) return null
        const slot = GARDEN_POSITIONS[plant.slotIndex] ?? GARDEN_POSITIONS[0]
        const { x, y } = resolvePosition(slot, width, height)

        if (plant.isElder) {
          return <ElderTree key={plant.id} x={x} y={y} theme={theme} />
        }

        const accentColor = getAccentColor(plant)

        switch (plant.stage) {
          case 1:
            return <Sprout key={plant.id} x={x} y={y} theme={theme} />
          case 2:
            return <Seedling key={plant.id} x={x} y={y} theme={theme} />
          case 3:
            return <Growing key={plant.id} x={x} y={y} theme={theme} />
          case 4:
            return (
              <Bloomed
                key={plant.id}
                x={x}
                y={y}
                theme={theme}
                accentColor={accentColor}
              />
            )
          default:
            return null
        }
      })}
    </Canvas>
  )
}

export default GardenCanvas
