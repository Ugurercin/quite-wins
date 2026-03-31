import React, { useEffect } from 'react'
import { Circle, Group, Line, Path, Skia, vec } from '@shopify/react-native-skia'
import {
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated'
import { SceneColors } from '@/scenes/types'

interface Props { x: number; y: number; colors: SceneColors }

// Night Elder Flower — wide moonlit canopy, silver-blue gnarled branches. Breathing scale + glow.
const ElderFlower = ({ x, y, colors }: Props) => {
  const scale = useSharedValue(1)
  const glow  = useSharedValue(0.2)

  useEffect(() => {
    scale.value = withRepeat(withSequence(
      withTiming(1.05, { duration: 1600, easing: Easing.inOut(Easing.sin) }),
      withTiming(0.96, { duration: 1600, easing: Easing.inOut(Easing.sin) })
    ), -1, false)
    glow.value = withRepeat(withSequence(
      withTiming(0.55, { duration: 2400, easing: Easing.inOut(Easing.sin) }),
      withTiming(0.2,  { duration: 2400, easing: Easing.inOut(Easing.sin) })
    ), -1, false)
  }, [])

  const transform   = useDerivedValue(() => [{ scale: scale.value }])
  const glowOpacity = useDerivedValue(() => glow.value)
  const glowR       = useDerivedValue(() => 9 + glow.value * 5)

  const trunkPath = Skia.Path.Make()
  trunkPath.moveTo(x - 10, y); trunkPath.lineTo(x - 8, y - 55)
  trunkPath.lineTo(x + 8, y - 55); trunkPath.lineTo(x + 10, y); trunkPath.close()

  const rootL = Skia.Path.Make()
  rootL.moveTo(x - 10, y); rootL.quadTo(x - 24, y - 4, x - 22, y + 2)
  rootL.quadTo(x - 18, y + 4, x - 10, y)

  const rootR = Skia.Path.Make()
  rootR.moveTo(x + 10, y); rootR.quadTo(x + 24, y - 4, x + 22, y + 2)
  rootR.quadTo(x + 18, y + 4, x + 10, y)

  const brL = Skia.Path.Make()
  brL.moveTo(x - 6, y - 42); brL.quadTo(x - 22, y - 52, x - 20, y - 46)
  brL.quadTo(x - 16, y - 40, x - 6, y - 42)

  const brR = Skia.Path.Make()
  brR.moveTo(x + 6, y - 42); brR.quadTo(x + 22, y - 52, x + 20, y - 46)
  brR.quadTo(x + 16, y - 40, x + 6, y - 42)

  return (
    <Group transform={transform} origin={vec(x, y)}>
      <Path path={rootL} color={colors.trunk} style="fill" />
      <Path path={rootR} color={colors.trunk} style="fill" />
      <Path path={trunkPath} color={colors.trunk} style="fill" />
      <Line p1={vec(x - 4, y - 8)} p2={vec(x - 3, y - 48)} color={colors.bodyDark} strokeWidth={1} opacity={0.35} />
      <Path path={brL} color={colors.trunk} style="fill" />
      <Path path={brR} color={colors.trunk} style="fill" />

      {/* Wide moonlit canopy */}
      <Circle cx={x} cy={y - 80} r={34} color={colors.bodyDark} />
      <Circle cx={x - 26} cy={y - 72} r={22} color={colors.bodyDark} />
      <Circle cx={x + 26} cy={y - 72} r={22} color={colors.bodyDark} />
      <Circle cx={x - 14} cy={y - 92} r={18} color={colors.bodyDark} />
      <Circle cx={x + 14} cy={y - 92} r={18} color={colors.bodyDark} />
      <Circle cx={x} cy={y - 84} r={26} color={colors.bodyMid} />
      <Circle cx={x - 18} cy={y - 78} r={16} color={colors.bodyMid} />
      <Circle cx={x + 18} cy={y - 78} r={16} color={colors.bodyMid} />
      {/* Silver-blue moonlit highlights */}
      <Circle cx={x - 6} cy={y - 90} r={14} color={colors.bodyLight} opacity={0.25} />
      <Circle cx={x + 8} cy={y - 86} r={10} color={colors.bodyLight} opacity={0.2} />
      <Circle cx={x - 20} cy={y - 76} r={3} color={colors.bloom} opacity={0.25} />
      <Circle cx={x + 22} cy={y - 74} r={2.5} color={colors.bloom} opacity={0.2} />

      {/* Breathing moonlit glow */}
      <Circle cx={x - 2} cy={y - 88} r={glowR} color={colors.bloom} opacity={glowOpacity} />
      <Circle cx={x + 6} cy={y - 82} r={5} color={colors.bloom} opacity={glowOpacity} />
    </Group>
  )
}

export default ElderFlower
