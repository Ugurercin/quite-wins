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

// Night Elder Mushroom — ancient bioluminescent giant. Family of smaller shrooms at base.
// Breathing scale + teal glow pulse.
const ElderMushroom = ({ x, y, colors }: Props) => {
  const scale = useSharedValue(1)
  const glow  = useSharedValue(0.15)

  useEffect(() => {
    scale.value = withRepeat(withSequence(
      withTiming(1.04, { duration: 1700, easing: Easing.inOut(Easing.sin) }),
      withTiming(0.97, { duration: 1700, easing: Easing.inOut(Easing.sin) })
    ), -1, false)
    glow.value = withRepeat(withSequence(
      withTiming(0.60, { duration: 2800, easing: Easing.inOut(Easing.sin) }),
      withTiming(0.15, { duration: 2800, easing: Easing.inOut(Easing.sin) })
    ), -1, false)
  }, [])

  const transform   = useDerivedValue(() => [{ scale: scale.value }])
  const glowOp      = useDerivedValue(() => glow.value)
  const glowR       = useDerivedValue(() => 12 + glow.value * 8)
  const spotGlow    = useDerivedValue(() => glow.value * 0.85)
  const haloOp      = useDerivedValue(() => glow.value * 0.15)

  const stemPath = Skia.Path.Make()
  stemPath.moveTo(x - 13, y); stemPath.cubicTo(x - 13, y - 18, x - 9, y - 38, x - 7, y - 44)
  stemPath.lineTo(x + 7, y - 44); stemPath.cubicTo(x + 9, y - 38, x + 13, y - 18, x + 13, y); stemPath.close()

  const skirtPath = Skia.Path.Make()
  skirtPath.moveTo(x - 19, y - 40); skirtPath.quadTo(x, y - 30, x + 19, y - 40)

  const smStemL = Skia.Path.Make()
  smStemL.moveTo(x - 26, y); smStemL.lineTo(x - 24, y - 15); smStemL.lineTo(x - 20, y - 15); smStemL.lineTo(x - 18, y); smStemL.close()
  const smStemR = Skia.Path.Make()
  smStemR.moveTo(x + 18, y); smStemR.lineTo(x + 20, y - 12); smStemR.lineTo(x + 24, y - 12); smStemR.lineTo(x + 26, y); smStemR.close()
  const tinyStemL = Skia.Path.Make()
  tinyStemL.moveTo(x - 36, y); tinyStemL.lineTo(x - 35, y - 9); tinyStemL.lineTo(x - 32, y - 9); tinyStemL.lineTo(x - 31, y); tinyStemL.close()

  return (
    <Group transform={transform} origin={vec(x, y)}>
      {/* Tiny far-left shroom */}
      <Path path={tinyStemL} color="#1A2820" style="fill" />
      <Circle cx={x - 33} cy={y - 13} r={7} color="#0B2218" />
      <Circle cx={x - 34} cy={y - 15} r={2} color="#7DFFC8" opacity={0.55} />

      {/* Small shroom left */}
      <Path path={smStemL} color="#1A2820" style="fill" />
      <Circle cx={x - 22} cy={y - 21} r={11} color="#091E14" />
      <Circle cx={x - 22} cy={y - 25} r={8}  color="#0D2A1E" />
      <Circle cx={x - 22} cy={y - 25} r={3}  color="#7DFFC8" opacity={0.62} />
      <Circle cx={x - 28} cy={y - 19} r={2}  color="#7DFFC8" opacity={0.50} />

      {/* Small shroom right */}
      <Path path={smStemR} color="#1A2820" style="fill" />
      <Circle cx={x + 22} cy={y - 17} r={10} color="#091E14" />
      <Circle cx={x + 22} cy={y - 21} r={7}  color="#0D2A1E" />
      <Circle cx={x + 21} cy={y - 21} r={2.5} color="#7DFFC8" opacity={0.62} />
      <Circle cx={x + 27} cy={y - 16} r={1.8} color="#7DFFC8" opacity={0.48} />

      {/* Main stem */}
      <Path path={stemPath} color="#1A2820" style="fill" />
      <Path path={skirtPath} color="#243A2E" style="stroke" strokeWidth={3} opacity={0.8} />

      {/* Ground light pool */}
      <Circle cx={x} cy={y - 4} r={useDerivedValue(() => 20 + glow.value * 6)} color="#40D890" opacity={useDerivedValue(() => glow.value * 0.1)} />

      {/* Giant dark cap */}
      <Circle cx={x} cy={y - 58} r={42} color="#071510" />
      <Circle cx={x} cy={y - 62} r={38} color="#0B2018" />
      <Circle cx={x} cy={y - 66} r={32} color="#0D2A1E" />
      <Circle cx={x} cy={y - 46} r={42} color="#040C08" opacity={0.35} />

      {/* Gills */}
      <Circle cx={x} cy={y - 44} r={40} color="#0A1810" opacity={0.5} />
      <Circle cx={x} cy={y - 42} r={34} color="#0D2018" opacity={0.35} />

      {/* Bioluminescent spots */}
      <Circle cx={x}       cy={y - 76} r={7}   color="#7DFFC8" opacity={0.85} />
      <Circle cx={x - 20}  cy={y - 64} r={5.5} color="#7DFFC8" opacity={0.80} />
      <Circle cx={x + 19}  cy={y - 66} r={6}   color="#7DFFC8" opacity={0.78} />
      <Circle cx={x - 8}   cy={y - 56} r={4}   color="#7DFFC8" opacity={0.72} />
      <Circle cx={x + 10}  cy={y - 54} r={3.5} color="#7DFFC8" opacity={0.68} />
      <Circle cx={x - 30}  cy={y - 56} r={4}   color="#7DFFC8" opacity={0.65} />
      <Circle cx={x + 28}  cy={y - 58} r={3.5} color="#7DFFC8" opacity={0.62} />
      <Circle cx={x + 4}   cy={y - 86} r={3}   color="#7DFFC8" opacity={0.55} />

      {/* Animated spot glow */}
      <Circle cx={x}      cy={y - 76} r={glowR} color="#7DFFC8"  opacity={spotGlow} />
      <Circle cx={x - 20} cy={y - 64} r={useDerivedValue(() => 6 + glow.value * 4)} color="#7DFFC8" opacity={useDerivedValue(() => glow.value * 0.5)} />

      {/* Teal halo under cap */}
      <Circle cx={x} cy={y - 52} r={useDerivedValue(() => 20 + glow.value * 10)} color="#40D890" opacity={haloOp} />
    </Group>
  )
}

export default ElderMushroom
