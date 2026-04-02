import React, { useEffect } from 'react'
import { Circle, Group, Path, Skia, vec } from '@shopify/react-native-skia'
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

// Space Elder Terrestrial — ancient blue-green world, cloud swirls, soft atmosphere glow, breathing pulse.
const ElderTerrestrial = ({ x, y, colors }: Props) => {
  const BODY   = '#3870A8'
  const OCEAN  = '#2858A0'
  const LAND   = '#4A7848'
  const CLOUD  = '#D8ECF8'
  const ATMO   = '#80B4D8'

  const scale = useSharedValue(1)
  const glow  = useSharedValue(0.18)

  useEffect(() => {
    scale.value = withRepeat(withSequence(
      withTiming(1.05, { duration: 1900, easing: Easing.inOut(Easing.sin) }),
      withTiming(0.96, { duration: 1900, easing: Easing.inOut(Easing.sin) }),
    ), -1, false)
    glow.value = withRepeat(withSequence(
      withTiming(0.52, { duration: 3200, easing: Easing.inOut(Easing.sin) }),
      withTiming(0.18, { duration: 3200, easing: Easing.inOut(Easing.sin) }),
    ), -1, false)
  }, [])

  const transform = useDerivedValue(() => [{ scale: scale.value }])
  const glowOp    = useDerivedValue(() => glow.value)
  const glowR     = useDerivedValue(() => 56 + glow.value * 12)
  const atmoOp    = useDerivedValue(() => 0.12 + glow.value * 0.1)

  const cloudPath1 = Skia.Path.Make()
  cloudPath1.moveTo(x - 38, y - 82)
  cloudPath1.cubicTo(x - 28, y - 90, x - 10, y - 88, x - 4, y - 80)
  cloudPath1.cubicTo(x - 10, y - 76, x - 28, y - 78, x - 38, y - 82)
  cloudPath1.close()

  const cloudPath2 = Skia.Path.Make()
  cloudPath2.moveTo(x + 10, y - 98)
  cloudPath2.cubicTo(x + 20, y - 106, x + 36, y - 104, x + 38, y - 96)
  cloudPath2.cubicTo(x + 36, y - 90, x + 20, y - 92, x + 10, y - 98)
  cloudPath2.close()

  return (
    <Group transform={transform} origin={vec(x, y)}>
      {/* Atmosphere glow */}
      <Circle cx={x} cy={y - 72} r={glowR} color={ATMO} opacity={atmoOp} />
      <Circle cx={x} cy={y - 72} r={54}    color={colors.bloom} opacity={glowOp} />

      {/* Planet body */}
      <Circle cx={x} cy={y - 72} r={50} color={BODY} />
      <Circle cx={x - 16} cy={y - 86} r={20} color={OCEAN} opacity={0.6} />
      <Circle cx={x + 14} cy={y - 60} r={18} color={LAND}  opacity={0.7} />
      <Circle cx={x - 8}  cy={y - 56} r={10} color={LAND}  opacity={0.5} />
      <Circle cx={x + 6}  cy={y - 94} r={8}  color={LAND}  opacity={0.45} />
      <Circle cx={x - 28} cy={y - 68} r={12} color={OCEAN} opacity={0.4} />

      {/* Cloud swirls */}
      <Path path={cloudPath1} color={CLOUD} style="fill" opacity={0.65} />
      <Path path={cloudPath2} color={CLOUD} style="fill" opacity={0.55} />
      <Circle cx={x + 20} cy={y - 84} r={6}  color={CLOUD} opacity={0.4} />
      <Circle cx={x - 14} cy={y - 100} r={5} color={CLOUD} opacity={0.35} />

      {/* Atmosphere rim */}
      <Circle cx={x} cy={y - 72} r={52} color={ATMO} opacity={0.18} />
    </Group>
  )
}

export default ElderTerrestrial
