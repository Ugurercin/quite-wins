import React, { useEffect } from 'react'
import { Circle, Path, Skia } from '@shopify/react-native-skia'
import {
  useDerivedValue,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated'
import { StageProps } from '../plantTypes'

// Night Mushroom — Stage 4: Fully bioluminescent. Spots pulse in staggered sequence.
// A soft light pool glows on the ground beneath.
const Stage4 = ({ x, y, colors }: StageProps) => {
  const stemH = 36

  // Cap expands on mount
  const bloom = useSharedValue(0.3)
  useEffect(() => {
    bloom.value = withDelay(150, withTiming(1, { duration: 1600, easing: Easing.out(Easing.back(1.1)) }))
  }, [])

  // Staggered spot pulses — start at different phases so they never sync
  const s1 = useSharedValue(0.85)
  const s2 = useSharedValue(0.35)
  const s3 = useSharedValue(0.60)
  useEffect(() => {
    s1.value = withRepeat(withSequence(
      withTiming(0.95, { duration: 650, easing: Easing.inOut(Easing.sin) }),
      withTiming(0.25, { duration: 650, easing: Easing.inOut(Easing.sin) })
    ), -1, false)
    s2.value = withRepeat(withSequence(
      withTiming(0.25, { duration: 650, easing: Easing.inOut(Easing.sin) }),
      withTiming(0.95, { duration: 650, easing: Easing.inOut(Easing.sin) })
    ), -1, false)
    s3.value = withRepeat(withSequence(
      withTiming(0.90, { duration: 900, easing: Easing.inOut(Easing.sin) }),
      withTiming(0.30, { duration: 900, easing: Easing.inOut(Easing.sin) })
    ), -1, false)
  }, [])

  const capW    = useDerivedValue(() => bloom.value * 32)
  const capH    = useDerivedValue(() => bloom.value * 40)
  const gillW   = useDerivedValue(() => bloom.value * 32)
  const poolR   = useDerivedValue(() => 18 + bloom.value * 6)
  const poolOp  = useDerivedValue(() => bloom.value * 0.12)

  const moundPath = Skia.Path.Make()
  moundPath.moveTo(x - 15, y)
  moundPath.quadTo(x, y - 7, x + 15, y)

  const stemPath = Skia.Path.Make()
  stemPath.moveTo(x - 7, y)
  stemPath.cubicTo(x - 7, y - 12, x - 4, y - stemH, x - 3, y - stemH)
  stemPath.lineTo(x + 3, y - stemH)
  stemPath.cubicTo(x + 4, y - stemH, x + 7, y - 12, x + 7, y)
  stemPath.close()

  const skirtPath = Skia.Path.Make()
  skirtPath.moveTo(x - 13, y - stemH + 5)
  skirtPath.quadTo(x, y - stemH + 13, x + 13, y - stemH + 5)

  return (
    <>
      {/* Ground light pool */}
      <Circle cx={x} cy={y - 4} r={poolR} color="#40D890" opacity={poolOp} />

      <Path path={moundPath} color={colors.bodyDark} style="stroke" strokeWidth={5} strokeCap="round" />
      <Path path={stemPath} color="#1A2820" style="fill" />
      <Circle cx={x - 2} cy={y - 10} r={1} color="#243A2E" opacity={0.5} />
      <Circle cx={x + 3} cy={y - 22} r={1} color="#243A2E" opacity={0.4} />
      <Path path={skirtPath} color="#243A2E" style="stroke" strokeWidth={2.5} opacity={0.8} />

      {/* Dark cap */}
      <Circle cx={x} cy={y - stemH - 10} r={capW} color="#0B2218" />
      <Circle cx={x} cy={y - stemH - 20} r={useDerivedValue(() => bloom.value * 20)} color="#0D2A1E" />
      <Circle cx={x} cy={y - stemH - 8}  r={useDerivedValue(() => bloom.value * 32)} color="#071510" opacity={0.35} />

      {/* Gills underside */}
      <Circle cx={x} cy={y - stemH + 2} r={gillW} color="#0A1810" opacity={0.6} />
      <Circle cx={x} cy={y - stemH + 4} r={useDerivedValue(() => bloom.value * 26)} color="#0D2018" opacity={0.4} />

      {/* Bioluminescent spots — staggered pulse */}
      <Circle cx={x} cy={y - stemH - 30}
        r={useDerivedValue(() => bloom.value * 5)} color="#7DFFC8" opacity={s1} />
      <Circle cx={useDerivedValue(() => x - bloom.value * 15)} cy={y - stemH - 20}
        r={useDerivedValue(() => bloom.value * 4)} color="#7DFFC8" opacity={s2} />
      <Circle cx={useDerivedValue(() => x + bloom.value * 14)} cy={y - stemH - 22}
        r={useDerivedValue(() => bloom.value * 4.5)} color="#7DFFC8" opacity={s3} />
      <Circle cx={useDerivedValue(() => x - bloom.value * 7)} cy={y - stemH - 10}
        r={useDerivedValue(() => bloom.value * 2.5)} color="#7DFFC8" opacity={s1} />
      <Circle cx={useDerivedValue(() => x + bloom.value * 19)} cy={y - stemH - 10}
        r={useDerivedValue(() => bloom.value * 3)} color="#7DFFC8" opacity={s2} />

      {/* Cap glow halo */}
      <Circle cx={x} cy={y - stemH - 18} r={useDerivedValue(() => 16 + bloom.value * 8)} color="#40D890"
        opacity={useDerivedValue(() => s1.value * 0.12)} />

      <Circle cx={x} cy={y - 2} r={3} color="#1A2820" opacity={0.5} />
    </>
  )
}

export default Stage4
