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

// Space Elder Gas — enormous banded sphere, large storm spot, thick rings, amber glow, breathing pulse.
const ElderGas = ({ x, y, colors }: Props) => {
  const BODY   = '#C07830'
  const BAND1  = '#E09840'
  const BAND2  = '#A05E20'
  const BAND3  = '#D4B060'
  const RING   = '#D4B060'
  const STORM  = '#FFF0A0'

  const scale = useSharedValue(1)
  const glow  = useSharedValue(0.15)

  useEffect(() => {
    scale.value = withRepeat(withSequence(
      withTiming(1.04, { duration: 2100, easing: Easing.inOut(Easing.sin) }),
      withTiming(0.97, { duration: 2100, easing: Easing.inOut(Easing.sin) }),
    ), -1, false)
    glow.value = withRepeat(withSequence(
      withTiming(0.55, { duration: 3500, easing: Easing.inOut(Easing.sin) }),
      withTiming(0.15, { duration: 3500, easing: Easing.inOut(Easing.sin) }),
    ), -1, false)
  }, [])

  const transform   = useDerivedValue(() => [{ scale: scale.value }])
  const glowOp      = useDerivedValue(() => glow.value)
  const glowR       = useDerivedValue(() => 60 + glow.value * 16)
  const stormOp     = useDerivedValue(() => 0.7 + glow.value * 0.25)
  const ringOpBack  = 0.32
  const ringOpFront = 0.7

  const cy = y - 74

  const band1 = Skia.Path.Make()
  band1.moveTo(x - 50, cy - 10)
  band1.cubicTo(x - 20, cy - 2, x + 20, cy - 22, x + 50, cy - 10)
  band1.lineTo(x + 50, cy + 2)
  band1.cubicTo(x + 20, cy + 10, x - 20, cy - 10, x - 50, cy + 2)
  band1.close()

  const band2 = Skia.Path.Make()
  band2.moveTo(x - 50, cy + 14)
  band2.cubicTo(x - 18, cy + 24, x + 18, cy + 8, x + 50, cy + 14)
  band2.lineTo(x + 50, cy + 26)
  band2.cubicTo(x + 18, cy + 20, x - 18, cy + 36, x - 50, cy + 26)
  band2.close()

  const ringBackPath = Skia.Path.Make()
  ringBackPath.addOval(Skia.XYWHRect(x - 70, cy - 16, 140, 32))

  const ringFrontPath = Skia.Path.Make()
  ringFrontPath.moveTo(x - 70, cy)
  ringFrontPath.cubicTo(x - 70, cy + 16, x + 70, cy + 16, x + 70, cy)

  return (
    <Group transform={transform} origin={vec(x, y)}>
      {/* Amber glow */}
      <Circle cx={x} cy={cy} r={glowR} color="#E0A040" opacity={useDerivedValue(() => glow.value * 0.15)} />
      <Circle cx={x} cy={cy} r={56}    color={colors.bloom} opacity={glowOp} />

      {/* Back ring */}
      <Path path={ringBackPath} color={RING} style="stroke" strokeWidth={8} opacity={ringOpBack} />

      {/* Planet body */}
      <Circle cx={x} cy={cy} r={52} color={BODY} />
      <Path path={band1} color={BAND1} style="fill" opacity={0.55} />
      <Path path={band2} color={BAND2} style="fill" opacity={0.45} />
      <Circle cx={x - 18} cy={cy + 4} r={9}  color={BAND3} opacity={0.5} />
      {/* Storm spot */}
      <Circle cx={x + 16} cy={cy - 8} r={12} color={STORM}  opacity={stormOp} />
      <Circle cx={x + 16} cy={cy - 8} r={7}  color="#FFFFFF" opacity={useDerivedValue(() => glow.value * 0.6)} />
      {/* Haze */}
      <Circle cx={x} cy={cy} r={54} color={BAND1} opacity={0.08} />

      {/* Front ring */}
      <Path path={ringFrontPath} color={RING} style="stroke" strokeWidth={8} strokeCap="round" opacity={ringOpFront} />
    </Group>
  )
}

export default ElderGas
