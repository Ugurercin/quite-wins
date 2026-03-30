import React, { useEffect } from 'react'
import { Circle, Path, Skia } from '@shopify/react-native-skia'
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

// Elder Mushroom — ancient giant. Wide cap, glowing spots, smaller mushrooms
// clustered at the base. Same breathing glow as ElderFlower.
const ElderMushroom = ({ x, y, colors }: Props) => {
  const glow = useSharedValue(0.2)

  useEffect(() => {
    glow.value = withRepeat(
      withSequence(
        withTiming(0.55, { duration: 2800, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.2,  { duration: 2800, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    )
  }, [])

  const glowOpacity = useDerivedValue(() => glow.value)
  const glowR       = useDerivedValue(() => 10 + glow.value * 6)
  const spotGlow    = useDerivedValue(() => glow.value * 0.8)

  // Main thick stem
  const stemPath = Skia.Path.Make()
  stemPath.moveTo(x - 14, y)
  stemPath.cubicTo(x - 14, y - 18, x - 10, y - 38, x - 8, y - 44)
  stemPath.lineTo(x + 8, y - 44)
  stemPath.cubicTo(x + 10, y - 38, x + 14, y - 18, x + 14, y)
  stemPath.close()

  // Skirt ring
  const skirtPath = Skia.Path.Make()
  skirtPath.moveTo(x - 20, y - 40)
  skirtPath.quadTo(x, y - 30, x + 20, y - 40)

  // Small mushroom left
  const smallStemL = Skia.Path.Make()
  smallStemL.moveTo(x - 26, y)
  smallStemL.lineTo(x - 24, y - 16)
  smallStemL.lineTo(x - 20, y - 16)
  smallStemL.lineTo(x - 18, y)
  smallStemL.close()

  // Small mushroom right
  const smallStemR = Skia.Path.Make()
  smallStemR.moveTo(x + 18, y)
  smallStemR.lineTo(x + 20, y - 12)
  smallStemR.lineTo(x + 24, y - 12)
  smallStemR.lineTo(x + 26, y)
  smallStemR.close()

  // Tiny mushroom far left
  const tinyStemL = Skia.Path.Make()
  tinyStemL.moveTo(x - 36, y)
  tinyStemL.lineTo(x - 35, y - 10)
  tinyStemL.lineTo(x - 32, y - 10)
  tinyStemL.lineTo(x - 31, y)
  tinyStemL.close()

  return (
    <>
      {/* Tiny mushroom far left */}
      <Path path={tinyStemL} color="#C8BC9A" style="fill" />
      <Circle cx={x - 33} cy={y - 14} r={7} color="#A03020" />
      <Circle cx={x - 34} cy={y - 16} r={2} color="#FFFFFF" opacity={0.6} />

      {/* Small mushroom left */}
      <Path path={smallStemL} color="#D4C8A8" style="fill" />
      <Circle cx={x - 22} cy={y - 22} r={11} color="#B83820" />
      <Circle cx={x - 22} cy={y - 26} r={8} color="#C84030" />
      <Circle cx={x - 22} cy={y - 26} r={3} color="#FFFFFF" opacity={0.65} />
      <Circle cx={x - 28} cy={y - 20} r={2} color="#FFFFFF" opacity={0.55} />

      {/* Small mushroom right */}
      <Path path={smallStemR} color="#D4C8A8" style="fill" />
      <Circle cx={x + 22} cy={y - 18} r={10} color="#B83820" />
      <Circle cx={x + 22} cy={y - 22} r={7} color="#C84030" />
      <Circle cx={x + 21} cy={y - 22} r={2.5} color="#FFFFFF" opacity={0.65} />
      <Circle cx={x + 27} cy={y - 17} r={1.8} color="#FFFFFF" opacity={0.5} />

      {/* Main stem */}
      <Path path={stemPath} color="#D4C8A8" style="fill" />
      {/* Stem texture */}
      <Circle cx={x - 4} cy={y - 15} r={1.2} color="#C0B494" opacity={0.5} />
      <Circle cx={x + 5} cy={y - 28} r={1} color="#C0B494" opacity={0.4} />
      <Path path={skirtPath} color="#C8BC9A" style="stroke" strokeWidth={3} opacity={0.8} />

      {/* Giant cap — layered for depth */}
      <Circle cx={x} cy={y - 58} r={42} color="#901810" />
      <Circle cx={x} cy={y - 62} r={38} color="#B02010" />
      <Circle cx={x} cy={y - 66} r={32} color="#C43020" />
      {/* Cap edge shadow */}
      <Circle cx={x} cy={y - 46} r={42} color="#701008" opacity={0.35} />

      {/* Gills */}
      <Circle cx={x} cy={y - 44} r={40} color="#C89080" opacity={0.5} />
      <Circle cx={x} cy={y - 42} r={34} color="#D4A090" opacity={0.35} />

      {/* Cap sheen */}
      <Circle cx={x - 8} cy={y - 72} r={14} color="#D84030" opacity={0.3} />

      {/* Spots — glowing */}
      <Circle cx={x} cy={y - 76} r={7} color="#FFFFFF" opacity={0.85} />
      <Circle cx={x - 20} cy={y - 64} r={5.5} color="#FFFFFF" opacity={0.8} />
      <Circle cx={x + 19} cy={y - 66} r={6} color="#FFFFFF" opacity={0.78} />
      <Circle cx={x - 8} cy={y - 56} r={4} color="#FFFFFF" opacity={0.72} />
      <Circle cx={x + 10} cy={y - 54} r={3.5} color="#FFFFFF" opacity={0.68} />
      <Circle cx={x - 30} cy={y - 56} r={4} color="#FFFFFF" opacity={0.65} />
      <Circle cx={x + 28} cy={y - 58} r={3.5} color="#FFFFFF" opacity={0.62} />
      <Circle cx={x + 4} cy={y - 86} r={3} color="#FFFFFF" opacity={0.55} />

      {/* Spot glows — animated */}
      <Circle cx={x} cy={y - 76} r={glowR} color="#FFFFFF" opacity={spotGlow} />
      <Circle cx={x - 20} cy={y - 64} r={useDerivedValue(() => 6 + glow.value * 4)} color="#FFFFFF" opacity={useDerivedValue(() => glow.value * 0.5)} />

      {/* Main breathing glow under cap */}
      <Circle cx={x} cy={y - 52} r={useDerivedValue(() => 18 + glow.value * 8)} color="#FF8060" opacity={useDerivedValue(() => glow.value * 0.18)} />
    </>
  )
}

export default ElderMushroom