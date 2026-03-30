import React, { useEffect } from 'react'
import { Circle, Line, Path, Rect, Skia, vec } from '@shopify/react-native-skia'
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

// Permanent elder tree — ancient, wide, gnarled. Cannot be deleted.
// Wider trunk, complex layered canopy, deeper muted greens, subtle living glow.
const ElderTree = ({ x, y, theme }: Props) => {
  const trunkColor = theme.plant.trunk
  const canopyDeep = theme.plant.bodyDark
  const canopyMid = theme.plant.bodyMid
  const canopyLight = theme.plant.sprout
  const glowColor = theme.plant.bloom

  // Subtle breathing glow — opacity pulses gently, forever
  const glow = useSharedValue(0.25)

  useEffect(() => {
    glow.value = withRepeat(
      withSequence(
        withTiming(0.55, { duration: 2400, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.25, { duration: 2400, easing: Easing.inOut(Easing.sin) })
      ),
      -1, // infinite
      false
    )
  }, [])

  const glowOpacity = useDerivedValue(() => glow.value)
  const glowR = useDerivedValue(() => 8 + glow.value * 4)

  // Trunk — wide, slightly tapered
  const trunkPath = Skia.Path.Make()
  trunkPath.moveTo(x - 10, y)
  trunkPath.lineTo(x - 8, y - 55)
  trunkPath.lineTo(x + 8, y - 55)
  trunkPath.lineTo(x + 10, y)
  trunkPath.close()

  // Root flares — gnarled base
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

  // Branch stubs — thick, character
  const branchLeft = Skia.Path.Make()
  branchLeft.moveTo(x - 6, y - 42)
  branchLeft.quadTo(x - 22, y - 52, x - 20, y - 46)
  branchLeft.quadTo(x - 16, y - 40, x - 6, y - 42)

  const branchRight = Skia.Path.Make()
  branchRight.moveTo(x + 6, y - 42)
  branchRight.quadTo(x + 22, y - 52, x + 20, y - 46)
  branchRight.quadTo(x + 16, y - 40, x + 6, y - 42)

  // Canopy — layered overlapping masses for gnarled look
  // Outer canopy shape — wide, irregular
  const canopyOuterLeft = Skia.Path.Make()
  canopyOuterLeft.moveTo(x - 6, y - 58)
  canopyOuterLeft.quadTo(x - 40, y - 72, x - 32, y - 82)
  canopyOuterLeft.quadTo(x - 20, y - 96, x, y - 88)

  const canopyOuterRight = Skia.Path.Make()
  canopyOuterRight.moveTo(x + 6, y - 58)
  canopyOuterRight.quadTo(x + 40, y - 72, x + 32, y - 82)
  canopyOuterRight.quadTo(x + 20, y - 96, x, y - 88)

  return (
    <>
      {/* Root flares */}
      <Path path={rootLeft} color={trunkColor} style="fill" />
      <Path path={rootRight} color={trunkColor} style="fill" />
      <Path path={rootCenter} color={trunkColor} style="fill" />
      {/* Trunk */}
      <Path path={trunkPath} color={trunkColor} style="fill" />
      {/* Trunk bark texture — subtle vertical lines */}
      <Line p1={vec(x - 4, y - 8)} p2={vec(x - 3, y - 48)} color={canopyDeep} strokeWidth={1} opacity={0.4} />
      <Line p1={vec(x + 3, y - 10)} p2={vec(x + 4, y - 45)} color={canopyDeep} strokeWidth={0.8} opacity={0.3} />
      {/* Branch stubs */}
      <Path path={branchLeft} color={trunkColor} style="fill" />
      <Path path={branchRight} color={trunkColor} style="fill" />

      {/* Outer canopy — deepest layer, widest */}
      <Circle cx={x} cy={y - 80} r={34} color={canopyDeep} />
      <Circle cx={x - 26} cy={y - 72} r={22} color={canopyDeep} />
      <Circle cx={x + 26} cy={y - 72} r={22} color={canopyDeep} />
      <Circle cx={x - 14} cy={y - 92} r={18} color={canopyDeep} />
      <Circle cx={x + 14} cy={y - 92} r={18} color={canopyDeep} />
      {/* Mid canopy — medium layer */}
      <Circle cx={x} cy={y - 84} r={26} color={canopyMid} />
      <Circle cx={x - 18} cy={y - 78} r={16} color={canopyMid} />
      <Circle cx={x + 18} cy={y - 78} r={16} color={canopyMid} />
      {/* Inner canopy — highlights */}
      <Circle cx={x - 6} cy={y - 90} r={14} color={canopyLight} />
      <Circle cx={x + 8} cy={y - 86} r={10} color={canopyLight} opacity={0.7} />
      {/* Canopy texture dots — subtle depth */}
      <Circle cx={x - 20} cy={y - 76} r={3} color={canopyLight} opacity={0.3} />
      <Circle cx={x + 22} cy={y - 74} r={2.5} color={canopyLight} opacity={0.25} />
      <Circle cx={x - 8} cy={y - 96} r={2} color={glowColor} opacity={0.3} />

      {/* Subtle living glow — pulses gently */}
      <Circle cx={x - 2} cy={y - 88} r={glowR} color={glowColor} opacity={glowOpacity} />
      <Circle cx={x + 6} cy={y - 82} r={5} color={glowColor} opacity={glowOpacity} />
    </>
  )
}

export default ElderTree
