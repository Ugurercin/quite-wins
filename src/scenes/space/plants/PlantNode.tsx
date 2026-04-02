import React, { useEffect, useRef } from 'react'
import { useAudio } from '@/audio/useAudio'
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

import TerrestrialS1 from './terrestrial/Stage1'
import TerrestrialS2 from './terrestrial/Stage2'
import TerrestrialS3 from './terrestrial/Stage3'
import TerrestrialS4 from './terrestrial/Stage4'

import GasS1 from './gas/Stage1'
import GasS2 from './gas/Stage2'
import GasS3 from './gas/Stage3'
import GasS4 from './gas/Stage4'

import CrystalS1 from './crystal/Stage1'
import CrystalS2 from './crystal/Stage2'
import CrystalS3 from './crystal/Stage3'
import CrystalS4 from './crystal/Stage4'

const STAGE_REGISTRY = {
  terrestrial: { 1: TerrestrialS1, 2: TerrestrialS2, 3: TerrestrialS3, 4: TerrestrialS4 },
  gas:         { 1: GasS1,         2: GasS2,         3: GasS3,         4: GasS4 },
  crystal:     { 1: CrystalS1,     2: CrystalS2,     3: CrystalS3,     4: CrystalS4 },
} as const

// ─── Elder registry ───────────────────────────────────────────────────────────

import ElderTerrestrial from './elders/ElderTerrestrial'
import ElderGas         from './elders/ElderGas'
import ElderCrystal     from './elders/ElderCrystal'

const ELDER_REGISTRY = {
  terrestrial: ElderTerrestrial,
  gas:         ElderGas,
  crystal:     ElderCrystal,
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
  const { playSFX } = useAudio()

  useEffect(() => {
    if (stage === 4 && !isElder) {
      const t = setTimeout(() => playSFX('bloom'), 300)
      return () => clearTimeout(t)
    }
  }, [stage])

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
    } else if (stage > prevStageRef.current && !isElder) {
      scaleVal.value = withSequence(
        withTiming(1.15, { duration: 200, easing: Easing.out(Easing.ease) }),
        withTiming(1.0,  { duration: 200, easing: Easing.inOut(Easing.ease) }),
      )
    }
    prevStageRef.current = stage
  }, [stage])

  const transform = useDerivedValue(() => [{ scale: scaleVal.value }])

  const ElderComponent = ELDER_REGISTRY[plantType] ?? ElderTerrestrial
  const StageComponent = STAGE_REGISTRY[plantType]?.[stage]
  if (__DEV__ && !isElder && !StageComponent) {
    console.warn(`[space/PlantNode] no stage component for type="${plantType}" stage=${stage}`)
  }

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
