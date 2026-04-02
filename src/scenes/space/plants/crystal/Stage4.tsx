import React, { useEffect } from 'react'
import { Circle, Group, Line, vec } from '@shopify/react-native-skia'
import {
  useDerivedValue,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated'
import { StageProps } from '../plantTypes'

// Crystal — Stage 4: Glowing crystal sphere, animated light rays + glow pulse.
const Stage4 = ({ x, y, colors }: StageProps) => {
  const BODY  = '#D0E8FF'
  const INNER = '#EEF8FF'

  const cy = y - 52

  const bloom = useSharedValue(0)
  const ray   = useSharedValue(0)
  useEffect(() => {
    bloom.value = withDelay(200, withTiming(1, { duration: 1500, easing: Easing.out(Easing.cubic) }))
    ray.value   = withDelay(400, withRepeat(
      withTiming(Math.PI * 2, { duration: 6000, easing: Easing.linear }),
      -1, false
    ))
  }, [])

  const glowR  = useDerivedValue(() => 32 + bloom.value * 16)
  const glowOp = useDerivedValue(() => bloom.value * 0.28)
  const rayTransform = useDerivedValue(() => [{ rotate: ray.value }])
  const rayLen = useDerivedValue(() => bloom.value * 22)

  const RAY_COLOR = '#E0F0FF'

  return (
    <>
      {/* Outer glow */}
      <Circle cx={x} cy={cy} r={glowR} color={colors.bloom} opacity={glowOp} />

      {/* Rotating light rays */}
      <Group transform={rayTransform} origin={vec(x, cy)}>
        <Line p1={vec(x, cy)} p2={vec(x, useDerivedValue(() => cy - rayLen.value))} color={RAY_COLOR} strokeWidth={1.5} opacity={useDerivedValue(() => bloom.value * 0.7)} />
        <Line p1={vec(x, cy)} p2={vec(x, useDerivedValue(() => cy + rayLen.value))} color={RAY_COLOR} strokeWidth={1.5} opacity={useDerivedValue(() => bloom.value * 0.4)} />
        <Line p1={vec(x, cy)} p2={useDerivedValue(() => vec(x + rayLen.value, cy))} color={RAY_COLOR} strokeWidth={1.5} opacity={useDerivedValue(() => bloom.value * 0.6)} />
        <Line p1={vec(x, cy)} p2={useDerivedValue(() => vec(x - rayLen.value, cy))} color={RAY_COLOR} strokeWidth={1.5} opacity={useDerivedValue(() => bloom.value * 0.35)} />
      </Group>

      {/* Crystal sphere */}
      <Circle cx={x} cy={cy} r={32}   color={BODY} />
      <Circle cx={x} cy={cy} r={18}   color={INNER} opacity={0.6} />
      <Circle cx={x} cy={cy} r={8}    color="#FFFFFF" opacity={0.75} />
      {/* Facet highlight */}
      <Circle cx={x - 10} cy={cy - 14} r={6} color="#FFFFFF" opacity={0.25} />
    </>
  )
}

export default Stage4
