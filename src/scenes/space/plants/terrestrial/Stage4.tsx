import React, { useEffect } from 'react'
import { Circle, Path, Skia } from '@shopify/react-native-skia'
import {
  useDerivedValue,
  useSharedValue,
  withDelay,
  withTiming,
  Easing,
} from 'react-native-reanimated'
import { StageProps } from '../plantTypes'

// Terrestrial — Stage 4: Ringed planet. Ring shimmer animates on mount (~1.5s).
const Stage4 = ({ x, y, colors }: StageProps) => {
  const BODY       = '#5A78C0'
  const OCEAN      = '#4868B0'
  const LAND       = '#5C8850'
  const RING_COLOR = '#C0B080'
  const ATMO       = '#A0B8E0'

  const cy = y - 52

  const shimmer = useSharedValue(0)
  useEffect(() => {
    shimmer.value = withDelay(200, withTiming(1, { duration: 1500, easing: Easing.out(Easing.cubic) }))
  }, [])

  const ringOpBack  = useDerivedValue(() => shimmer.value * 0.35)
  const ringOpFront = useDerivedValue(() => shimmer.value * 0.75)
  const glowR       = useDerivedValue(() => shimmer.value * 14)
  const glowOp      = useDerivedValue(() => shimmer.value * 0.22)

  // Ring: back arc (behind planet) — wide oval
  const ringBackPath = Skia.Path.Make()
  ringBackPath.addOval(Skia.XYWHRect(x - 44, cy - 10, 88, 20))

  // Ring: front arc (in front of planet) — same oval, only lower half matters
  const ringFrontPath = Skia.Path.Make()
  ringFrontPath.moveTo(x - 44, cy)
  ringFrontPath.cubicTo(x - 44, cy + 10, x + 44, cy + 10, x + 44, cy)

  return (
    <>
      {/* Back ring */}
      <Path path={ringBackPath} color={RING_COLOR} style="stroke" strokeWidth={5} opacity={ringOpBack} />

      {/* Planet */}
      <Circle cx={x} cy={cy} r={32} color={BODY} />
      <Circle cx={x - 8} cy={cy - 8} r={12} color={OCEAN} opacity={0.6} />
      <Circle cx={x + 6} cy={cy + 6} r={9}  color={LAND}  opacity={0.7} />
      <Circle cx={x - 4} cy={cy + 10} r={5} color={LAND}  opacity={0.5} />
      {/* Atmosphere rim */}
      <Circle cx={x} cy={cy} r={34} color={ATMO} opacity={0.12} />
      <Circle cx={x - 10} cy={cy - 14} r={8} color="#D0E4FF" opacity={0.15} />

      {/* Front ring */}
      <Path path={ringFrontPath} color={RING_COLOR} style="stroke" strokeWidth={5} strokeCap="round" opacity={ringOpFront} />

      {/* Mount glow */}
      <Circle cx={x} cy={cy} r={glowR} color={colors.bloom} opacity={glowOp} />
    </>
  )
}

export default Stage4
