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
import Sprout from './Sprout'
import Seedling from './Seedling'
import Growing from './Growing'
import Bloomed from './Bloomed'
import ElderTree from './ElderTree'

interface Props {
  x: number
  y: number
  stage: 1 | 2 | 3 | 4
  colors: SceneColors
  accentColor: string
  isElder?: boolean
  isExiting?: boolean
}

const PlantNode = ({ x, y, stage, colors, accentColor, isElder, isExiting }: Props) => {
  const scaleVal = useSharedValue(isExiting ? 1 : 0.2)
  const opacityVal = useSharedValue(isExiting ? 1 : 0)
  const prevStageRef = useRef(stage)

  useEffect(() => {
    if (isExiting) {
      scaleVal.value = withTiming(0.15, { duration: 500, easing: Easing.in(Easing.cubic) })
      opacityVal.value = withTiming(0, { duration: 450 })
    } else {
      scaleVal.value = withSequence(
        withTiming(1.12, { duration: 380, easing: Easing.out(Easing.cubic) }),
        withTiming(1.0, { duration: 200, easing: Easing.inOut(Easing.cubic) }),
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

  return (
    <Group transform={transform} origin={vec(x, y)} opacity={opacityVal}>
      {isElder ? (
        <ElderTree x={x} y={y} colors={colors} />
      ) : stage === 1 ? (
        <Sprout x={x} y={y} colors={colors} />
      ) : stage === 2 ? (
        <Seedling x={x} y={y} colors={colors} />
      ) : stage === 3 ? (
        <Growing x={x} y={y} colors={colors} />
      ) : (
        <Bloomed x={x} y={y} colors={colors} accentColor={accentColor} />
      )}
    </Group>
  )
}

export default PlantNode