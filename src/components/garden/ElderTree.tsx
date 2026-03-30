import React, { useEffect } from 'react'
import { Circle, Line, Path, Skia } from '@shopify/react-native-skia'
import {
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated'
import { Theme } from '@/theme/theme'

interface Props {
  x: number
  y: number
  theme: Theme
}

// Permanent elder tree — ancient, wide, gnarled, now with a broader magical canopy aura.
const ElderTree = ({ x, y, theme }: Props) => {
  const trunkColor = theme.plant.trunk
  const canopyDeep = theme.plant.bodyDark
  const canopyMid = theme.plant.bodyMid
  const canopyLight = theme.plant.sprout
  const glowColor = theme.plant.bloom

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
  const glowRBig = useDerivedValue(() => 20 + glow.value * 10)
  const glowRMed = useDerivedValue(() => 12 + glow.value * 6)

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
      {/* Root flares */}
      <Path path={rootLeft} color={trunkColor} style="fill" />
      <Path path={rootRight} color={trunkColor} style="fill" />
      <Path path={rootCenter} color={trunkColor} style="fill" />

      {/* Trunk */}
      <Path path={trunkPath} color={trunkColor} style="fill" />

      {/* Trunk bark texture */}
      <Line p1={{ x: x - 4, y: y - 8 }} p2={{ x: x - 3, y: y - 48 }} color={canopyDeep} strokeWidth={1} opacity={0.4} />
      <Line p1={{ x: x + 3, y: y - 10 }} p2={{ x: x + 4, y: y - 45 }} color={canopyDeep} strokeWidth={0.8} opacity={0.3} />

      {/* Branch stubs */}
      <Path path={branchLeft} color={trunkColor} style="fill" />
      <Path path={branchRight} color={trunkColor} style="fill" />

      {/* Ancient canopy aura */}
      <Circle cx={x} cy={y - 86} r={glowRBig} color={glowColor} opacity={glowOpacity} />
      <Circle cx={x - 14} cy={y - 90} r={glowRMed} color={glowColor} opacity={0.16} />
      <Circle cx={x + 14} cy={y - 84} r={glowRMed} color={glowColor} opacity={0.14} />

      {/* Outer canopy */}
      <Circle cx={x} cy={y - 80} r={34} color={canopyDeep} />
      <Circle cx={x - 26} cy={y - 72} r={22} color={canopyDeep} />
      <Circle cx={x + 26} cy={y - 72} r={22} color={canopyDeep} />
      <Circle cx={x - 14} cy={y - 92} r={18} color={canopyDeep} />
      <Circle cx={x + 14} cy={y - 92} r={18} color={canopyDeep} />

      {/* Mid canopy */}
      <Circle cx={x} cy={y - 84} r={26} color={canopyMid} />
      <Circle cx={x - 18} cy={y - 78} r={16} color={canopyMid} />
      <Circle cx={x + 18} cy={y - 78} r={16} color={canopyMid} />

      {/* Inner canopy highlights */}
      <Circle cx={x - 6} cy={y - 90} r={14} color={canopyLight} />
      <Circle cx={x + 8} cy={y - 86} r={10} color={canopyLight} opacity={0.75} />

      {/* Texture dots */}
      <Circle cx={x - 20} cy={y - 76} r={3} color={canopyLight} opacity={0.3} />
      <Circle cx={x + 22} cy={y - 74} r={2.5} color={canopyLight} opacity={0.25} />
      <Circle cx={x - 8} cy={y - 96} r={2} color={glowColor} opacity={0.32} />

      {/* Living core glow */}
      <Circle cx={x - 2} cy={y - 88} r={glowR} color={glowColor} opacity={glowOpacity} />
      <Circle cx={x + 6} cy={y - 82} r={5} color={glowColor} opacity={glowOpacity} />

      {/* Extra mystical motes */}
      <Circle cx={x - 24} cy={y - 96} r={1.4} color={theme.plant.bodyLight} opacity={0.24} />
      <Circle cx={x + 20} cy={y - 98} r={1.2} color={glowColor} opacity={0.22} />
    </>
  )
}

export default ElderTree