import React, { useEffect, useRef, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { Canvas } from '@shopify/react-native-skia'
import { Theme } from '@/theme/theme'
import { Plant } from '@/hooks/usePlants'
import { Win } from '@/hooks/useWins'
import { GARDEN_POSITIONS, resolvePosition } from '@/utils/gardenPositions'
import { emojiToFlowerColor } from '@/utils/emojiColorMap'
import GardenBackground from './GardenBackground'
import PlantNode from './PlantNode'

interface Props {
  width: number
  height: number
  theme: Theme
  plants: Plant[]
  wins: Win[]
  onPlantTap?: (plant: Plant) => void
}

// Hit-area dimensions for each plant tap target
const HIT_W = 64
const HIT_H = 80

const GardenCanvas = ({ width, height, theme, plants, wins, onPlantTap }: Props) => {
  const prevPlantsRef = useRef<Map<string, Plant>>(new Map())
  const isFirstRender = useRef(true)
  const [departingPlants, setDepartingPlants] = useState<Plant[]>([])

  useEffect(() => {
    const currMap = new Map(plants.map(p => [p.id, p]))

    if (isFirstRender.current) {
      // Don't animate plants that were already saved — just record them
      isFirstRender.current = false
      prevPlantsRef.current = currMap
      return
    }

    // Detect plants that disappeared (went to stage 0 and were removed)
    const departed: Plant[] = []
    prevPlantsRef.current.forEach((plant, id) => {
      if (!currMap.has(id)) departed.push(plant)
    })

    if (departed.length > 0) {
      setDepartingPlants(prev => [...prev, ...departed])
      setTimeout(() => {
        setDepartingPlants(prev => prev.filter(dp => !departed.some(d => d.id === dp.id)))
      }, 650)
    }

    prevPlantsRef.current = currMap
  }, [plants])

  const getAccentColor = (plant: Plant): string => {
    const lastWinId = plant.winIds[plant.winIds.length - 1]
    const win = wins.find(w => w.id === lastWinId)
    return win ? emojiToFlowerColor(win.emoji, theme) : theme.accent.amber
  }

  return (
    <View style={{ width, height }}>
      {/* Skia canvas — background + plant sprites */}
      <Canvas style={{ width, height }}>
        <GardenBackground width={width} height={height} theme={theme} />

        {/* Active plants */}
        {plants.map(plant => {
          if (plant.stage === 0) return null
          const slot = GARDEN_POSITIONS[plant.slotIndex] ?? GARDEN_POSITIONS[0]
          const { x, y } = resolvePosition(slot, width, height)
          return (
            <PlantNode
              key={plant.id}
              x={x}
              y={y}
              stage={plant.stage as 1 | 2 | 3 | 4}
              theme={theme}
              accentColor={getAccentColor(plant)}
              isElder={plant.isElder}
            />
          )
        })}

        {/* Departing plants — fade/shrink out before disappearing */}
        {departingPlants.map(plant => {
          const slot = GARDEN_POSITIONS[plant.slotIndex] ?? GARDEN_POSITIONS[0]
          const { x, y } = resolvePosition(slot, width, height)
          return (
            <PlantNode
              key={`dep-${plant.id}`}
              x={x}
              y={y}
              stage={Math.max(1, plant.stage) as 1 | 2 | 3 | 4}
              theme={theme}
              accentColor={getAccentColor(plant)}
              isElder={plant.isElder}
              isExiting
            />
          )
        })}
      </Canvas>

      {/* Transparent touch targets overlaid on canvas — one per visible plant */}
      {plants.map(plant => {
        if (plant.stage === 0 || !onPlantTap) return null
        const slot = GARDEN_POSITIONS[plant.slotIndex] ?? GARDEN_POSITIONS[0]
        const { x, y } = resolvePosition(slot, width, height)
        return (
          <TouchableOpacity
            key={`tap-${plant.id}`}
            style={{
              position: 'absolute',
              left: x - HIT_W / 2,
              top: y - HIT_H,
              width: HIT_W,
              height: HIT_H,
            }}
            onPress={() => onPlantTap(plant)}
            activeOpacity={0.0}
            accessibilityLabel={`View plant details`}
          />
        )
      })}
    </View>
  )
}

export default GardenCanvas
