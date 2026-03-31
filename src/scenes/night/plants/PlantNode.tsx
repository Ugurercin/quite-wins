import React, { useEffect, useRef } from 'react'
import { Group, vec } from '@shopify/react-native-skia'
import {
  Easing,
  useDerivedValue,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated'
import { SceneColors } from '@/scenes/types'
import { PlantType } from './plantTypes'

// ─── Stage registry ───────────────────────────────────────────────────────────

import FlowerS1 from './flower/Stage1'
import FlowerS2 from './flower/Stage2'
import FlowerS3 from './flower/Stage3'
import FlowerS4 from './flower/Stage4'

import MushroomS1 from './mushroom/Stage1'
import MushroomS2 from './mushroom/Stage2'
import MushroomS3 from './mushroom/Stage3'
import MushroomS4 from './mushroom/Stage4'

import CactusS1 from './cactus/Stage1'
import CactusS2 from './cactus/Stage2'
import CactusS3 from './cactus/Stage3'
import CactusS4 from './cactus/Stage4'

const STAGE_REGISTRY = {
  flower:   { 1: FlowerS1,   2: FlowerS2,   3: FlowerS3,   4: FlowerS4 },
  mushroom: { 1: MushroomS1, 2: MushroomS2, 3: MushroomS3, 4: MushroomS4 },
  cactus:   { 1: CactusS1,   2: CactusS2,   3: CactusS3,   4: CactusS4 },
} as const

// ─── Elder registry ───────────────────────────────────────────────────────────

import ElderFlower   from './elders/ElderFlower'
import ElderMushroom from './elders/ElderMushroom'
import ElderCactus   from './elders/ElderCactus'

const ELDER_REGISTRY = {
  flower:   ElderFlower,
  mushroom: ElderMushroom,
  cactus:   ElderCactus,
} as const

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  x: number
  y: number
  stage: 1 | 2 | 3 | 4
  colors: SceneColors
  accentColor: string
  plantType: PlantType
  isElder?: boolean
  isExiting?: boolean
}

// ─── Component ───────────────────────────────────────────────────────────────

const PlantNode = ({ x, y, stage, colors, accentColor, plantType, isElder, isExiting }: Props) => {
  const scaleVal   = useSharedValue(isExiting ? 1 : 0.2)
  const opacityVal = useSharedValue(isExiting ? 1 : 0)
  const prevStageRef = useRef(stage)

  useEffect(() => {
    if (isExiting) {
      scaleVal.value   = withTiming(0.15, { duration: 500, easing: Easing.in(Easing.cubic) })
      opacityVal.value = withTiming(0, { duration: 450 })
    } else {
      scaleVal.value = withSequence(
        withTiming(1.12, { duration: 380, easing: Easing.out(Easing.cubic) }),
        withTiming(1.0,  { duration: 200, easing: Easing.inOut(Easing.cubic) }),
      )
      opacityVal.value = withTiming(1, { duration: 320 })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (stage < prevStageRef.current) {
      scaleVal.value = withSequence(
        withTiming(0.6, { duration: 280, easing: Easing.out(Easing.cubic) }),
        withTiming(1.0, { duration: 380, easing: Easing.out(Easing.back(1.6)) }),
      )
    }
    prevStageRef.current = stage
  }, [stage])

  const transform = useDerivedValue(() => [{ scale: scaleVal.value }])

  const ElderComponent = ELDER_REGISTRY[plantType] ?? ElderFlower
  const StageComponent = STAGE_REGISTRY[plantType]?.[stage]

  return (
    <Group transform={transform} origin={vec(x, y)} opacity={opacityVal}>
      {isElder ? (
        <ElderComponent x={x} y={y} colors={colors} />
      ) : StageComponent ? (
        <StageComponent x={x} y={y} colors={colors} accentColor={accentColor} />
      ) : null}
    </Group>
  )
}

export default PlantNode
