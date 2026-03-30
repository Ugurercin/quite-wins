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

// Mushroom — Stage 4: Fully grown. Wide cap, gills, spots. Bloom: cap expands on mount.
const Stage4 = ({ x, y, colors, accentColor }: StageProps) => {
  const stemH = 38
  const capColor = accentColor ?? '#C43D22'

  // Bloom: cap scales out from center
  const bloom = useSharedValue(0.3)
  useEffect(() => {
    bloom.value = withDelay(
      150,
      withTiming(1, { duration: 1600, easing: Easing.out(Easing.back(1.1)) })
    )
  }, [])

  const capW = useDerivedValue(() => bloom.value * 34)
  const capH = useDerivedValue(() => bloom.value * 42)
  const gillW = useDerivedValue(() => bloom.value * 34)
  const spotScale = useDerivedValue(() => bloom.value)

  const moundPath = Skia.Path.Make()
  moundPath.moveTo(x - 16, y)
  moundPath.quadTo(x, y - 8, x + 16, y)

  // Stem — tall and sturdy
  const stemPath = Skia.Path.Make()
  stemPath.moveTo(x - 8, y)
  stemPath.cubicTo(x - 8, y - 12, x - 5, y - stemH, x - 4, y - stemH)
  stemPath.lineTo(x + 4, y - stemH)
  stemPath.cubicTo(x + 5, y - stemH, x + 8, y - 12, x + 8, y)
  stemPath.close()

  // Skirt ring
  const skirtPath = Skia.Path.Make()
  skirtPath.moveTo(x - 14, y - stemH + 5)
  skirtPath.quadTo(x, y - stemH + 14, x + 14, y - stemH + 5)

  return (
    <>
      <Path path={moundPath} color={colors.bodyDark} style="stroke" strokeWidth={5} strokeCap="round" />
      <Path path={stemPath} color="#D4C8A8" style="fill" />
      {/* Stem texture */}
      <Circle cx={x - 2} cy={y - 10} r={1} color="#C0B494" opacity={0.5} />
      <Circle cx={x + 3} cy={y - 22} r={1} color="#C0B494" opacity={0.4} />
      <Path path={skirtPath} color="#C8BC9A" style="stroke" strokeWidth={2.5} opacity={0.8} />

      {/* Cap — animated width */}
      <Circle cx={x} cy={y - stemH - 10} r={capW} color={capColor} />
      {/* Cap dome top */}
      <Circle cx={x} cy={y - stemH - 20} r={useDerivedValue(() => bloom.value * 22)} color={capColor} />
      {/* Cap dark edge */}
      <Circle cx={x} cy={y - stemH - 8} r={useDerivedValue(() => bloom.value * 34)} color="#8B2210" opacity={0.3} />

      {/* Gills underside */}
      <Circle cx={x} cy={y - stemH + 2} r={gillW} color="#C8907A" opacity={0.6} />
      <Circle cx={x} cy={y - stemH + 4} r={useDerivedValue(() => bloom.value * 28)} color="#D4A090" opacity={0.4} />

      {/* Spots — scale with bloom */}
      <Circle cx={x} cy={y - stemH - 30} r={useDerivedValue(() => spotScale.value * 5)} color="#FFFFFF" opacity={0.8} />
      <Circle cx={useDerivedValue(() => x - bloom.value * 16)} cy={y - stemH - 20} r={useDerivedValue(() => spotScale.value * 4)} color="#FFFFFF" opacity={0.75} />
      <Circle cx={useDerivedValue(() => x + bloom.value * 15)} cy={y - stemH - 22} r={useDerivedValue(() => spotScale.value * 4.5)} color="#FFFFFF" opacity={0.7} />
      <Circle cx={useDerivedValue(() => x - bloom.value * 8)} cy={y - stemH - 10} r={useDerivedValue(() => spotScale.value * 2.5)} color="#FFFFFF" opacity={0.65} />
      <Circle cx={useDerivedValue(() => x + bloom.value * 20)} cy={y - stemH - 10} r={useDerivedValue(() => spotScale.value * 3)} color="#FFFFFF" opacity={0.6} />

      {/* Cap sheen */}
      <Circle cx={x - 6} cy={y - stemH - 28} r={useDerivedValue(() => bloom.value * 7)} color="#FF7055" opacity={0.2} />

      {/* Ground accent */}
      <Circle cx={x} cy={y - 2} r={3} color={capColor} opacity={0.5} />
    </>
  )
}

export default Stage4