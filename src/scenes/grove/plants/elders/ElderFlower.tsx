import React, { useEffect } from 'react'
import { Circle, Line, Path, Skia, vec } from '@shopify/react-native-skia'
import {
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated'
import { SceneColors } from '@/scenes/types'

interface Props {
  x: number
  y: number
  colors: SceneColors
}

// Elder Flower Tree — ancient, wide, gnarled. Permanent. Breathing glow.
const ElderFlower = ({ x, y, colors }: Props) => {
  const glow = useSharedValue(0.25)

  useEffect(() => {
    glow.value = withRepeat(
      withSequence(
        withTiming(0.55, { duration: 2400, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.25, { duration: 2400, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    )
  }, [])

  const glowOpacity = useDerivedValue(() => glow.value)
  const glowR = useDerivedValue(() => 8 + glow.value * 4)

  const trunkPath = Skia.Path.Make()
  trunkPath.moveTo(x - 10, y)
  trunkPath.lineTo(x - 8, y - 55)
  trunkPath.lineTo(x + 8, y - 55)
  trunkPath.lineTo(x + 10, y)
  trunkPath.close()

  const rootLeft = Skia.Path.Make()
  rootLeft.moveTo(x - 10, y)
  rootLeft.quadTo(x - 24, y - 4, x - 22, y + 2)
  rootLeft.quadTo(x - 18, y + 4, x - 10, y)

  const rootRight = Skia.Path.Make()
  rootRight.moveTo(x + 10, y)
  rootRight.quadTo(x + 24, y - 4, x + 22, y + 2)
  rootRight.quadTo(x + 18, y + 4, x + 10, y)

  const rootCenter = Skia.Path.Make()
  rootCenter.moveTo(x - 4, y)
  rootCenter.quadTo(x, y + 6, x + 4, y)

  const branchLeft = Skia.Path.Make()
  branchLeft.moveTo(x - 6, y - 42)
  branchLeft.quadTo(x - 22, y - 52, x - 20, y - 46)
  branchLeft.quadTo(x - 16, y - 40, x - 6, y - 42)

  const branchRight = Skia.Path.Make()
  branchRight.moveTo(x + 6, y - 42)
  branchRight.quadTo(x + 22, y - 52, x + 20, y - 46)
  branchRight.quadTo(x + 16, y - 40, x + 6, y - 42)

  return (
    <>
      <Path path={rootLeft} color={colors.trunk} style="fill" />
      <Path path={rootRight} color={colors.trunk} style="fill" />
      <Path path={rootCenter} color={colors.trunk} style="fill" />
      <Path path={trunkPath} color={colors.trunk} style="fill" />
      <Line p1={vec(x - 4, y - 8)} p2={vec(x - 3, y - 48)} color={colors.bodyDark} strokeWidth={1} opacity={0.4} />
      <Line p1={vec(x + 3, y - 10)} p2={vec(x + 4, y - 45)} color={colors.bodyDark} strokeWidth={0.8} opacity={0.3} />
      <Path path={branchLeft} color={colors.trunk} style="fill" />
      <Path path={branchRight} color={colors.trunk} style="fill" />

      {/* Layered canopy */}
      <Circle cx={x} cy={y - 80} r={34} color={colors.bodyDark} />
      <Circle cx={x - 26} cy={y - 72} r={22} color={colors.bodyDark} />
      <Circle cx={x + 26} cy={y - 72} r={22} color={colors.bodyDark} />
      <Circle cx={x - 14} cy={y - 92} r={18} color={colors.bodyDark} />
      <Circle cx={x + 14} cy={y - 92} r={18} color={colors.bodyDark} />
      <Circle cx={x} cy={y - 84} r={26} color={colors.bodyMid} />
      <Circle cx={x - 18} cy={y - 78} r={16} color={colors.bodyMid} />
      <Circle cx={x + 18} cy={y - 78} r={16} color={colors.bodyMid} />
      <Circle cx={x - 6} cy={y - 90} r={14} color={colors.sprout} />
      <Circle cx={x + 8} cy={y - 86} r={10} color={colors.sprout} opacity={0.7} />
      <Circle cx={x - 20} cy={y - 76} r={3} color={colors.sprout} opacity={0.3} />
      <Circle cx={x + 22} cy={y - 74} r={2.5} color={colors.sprout} opacity={0.25} />
      <Circle cx={x - 8} cy={y - 96} r={2} color={colors.bloom} opacity={0.3} />

      {/* Breathing glow */}
      <Circle cx={x - 2} cy={y - 88} r={glowR} color={colors.bloom} opacity={glowOpacity} />
      <Circle cx={x + 6} cy={y - 82} r={5} color={colors.bloom} opacity={glowOpacity} />
    </>
  )
}

export default ElderFlower