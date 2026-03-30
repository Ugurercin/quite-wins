import React, { useEffect } from 'react'
import { Circle, Line, Path, Skia, vec } from '@shopify/react-native-skia'
import {
  useDerivedValue,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated'
import { SceneColors } from '@/scenes/types'

interface Props {
  x: number
  y: number
  colors: SceneColors
  accentColor?: string
}

const PETAL_R = 9
const PETAL_SPREAD = PETAL_R + 3
const DIAG = 0.7

// Stage 4 — Fully flowering plant. Bloom animation on mount.
const Bloomed = ({ x, y, colors, accentColor }: Props) => {
  const stemHeight = 72
  const flowerCy = y - stemHeight - 8
  const flowerColor = accentColor ?? colors.bloom

  const bloom = useSharedValue(0)

  useEffect(() => {
    bloom.value = withSequence(
      withTiming(0, { duration: 0 }),
      withDelay(
        200,
        withTiming(1, { duration: 1800, easing: Easing.out(Easing.back(1.2)) })
      )
    )
  }, [])

  const pr = useDerivedValue(() => bloom.value * PETAL_R)
  const prSmall = useDerivedValue(() => bloom.value * PETAL_R * 0.85)
  const centerR = useDerivedValue(() => bloom.value * 7)
  const highlightR = useDerivedValue(() => bloom.value * 3.5)

  const petalN_cy = useDerivedValue(() => flowerCy - bloom.value * PETAL_SPREAD)
  const petalS_cy = useDerivedValue(() => flowerCy + bloom.value * PETAL_SPREAD)
  const petalE_cx = useDerivedValue(() => x + bloom.value * PETAL_SPREAD)
  const petalW_cx = useDerivedValue(() => x - bloom.value * PETAL_SPREAD)

  const petalNE_cx = useDerivedValue(() => x + bloom.value * PETAL_SPREAD * DIAG)
  const petalNE_cy = useDerivedValue(() => flowerCy - bloom.value * PETAL_SPREAD * DIAG)
  const petalNW_cx = useDerivedValue(() => x - bloom.value * PETAL_SPREAD * DIAG)
  const petalNW_cy = useDerivedValue(() => flowerCy - bloom.value * PETAL_SPREAD * DIAG)
  const petalSE_cx = useDerivedValue(() => x + bloom.value * PETAL_SPREAD * DIAG)
  const petalSE_cy = useDerivedValue(() => flowerCy + bloom.value * PETAL_SPREAD * DIAG)
  const petalSW_cx = useDerivedValue(() => x - bloom.value * PETAL_SPREAD * DIAG)
  const petalSW_cy = useDerivedValue(() => flowerCy + bloom.value * PETAL_SPREAD * DIAG)

  const stemPath = Skia.Path.Make()
  stemPath.moveTo(x, y)
  stemPath.cubicTo(x - 2, y - 24, x + 3, y - 48, x, y - stemHeight)

  const lowerLeftLeaf = Skia.Path.Make()
  lowerLeftLeaf.moveTo(x, y - 26)
  lowerLeftLeaf.quadTo(x - 24, y - 38, x - 20, y - 28)
  lowerLeftLeaf.quadTo(x - 14, y - 20, x, y - 26)

  const lowerRightLeaf = Skia.Path.Make()
  lowerRightLeaf.moveTo(x, y - 26)
  lowerRightLeaf.quadTo(x + 24, y - 38, x + 20, y - 28)
  lowerRightLeaf.quadTo(x + 14, y - 20, x, y - 26)

  const midLeftLeaf = Skia.Path.Make()
  midLeftLeaf.moveTo(x, y - 42)
  midLeftLeaf.quadTo(x - 20, y - 56, x - 16, y - 46)
  midLeftLeaf.quadTo(x - 10, y - 40, x, y - 42)

  const midRightLeaf = Skia.Path.Make()
  midRightLeaf.moveTo(x, y - 42)
  midRightLeaf.quadTo(x + 20, y - 56, x + 16, y - 46)
  midRightLeaf.quadTo(x + 10, y - 40, x, y - 42)

  const upperLeftLeaf = Skia.Path.Make()
  upperLeftLeaf.moveTo(x, y - 56)
  upperLeftLeaf.quadTo(x - 14, y - 64, x - 10, y - 58)
  upperLeftLeaf.quadTo(x - 6, y - 54, x, y - 56)

  const upperRightLeaf = Skia.Path.Make()
  upperRightLeaf.moveTo(x, y - 56)
  upperRightLeaf.quadTo(x + 14, y - 64, x + 10, y - 58)
  upperRightLeaf.quadTo(x + 6, y - 54, x, y - 56)

  const moundPath = Skia.Path.Make()
  moundPath.moveTo(x - 18, y)
  moundPath.quadTo(x, y - 9, x + 18, y)

  return (
    <>
      <Path path={moundPath} color={colors.bodyDark} style="stroke" strokeWidth={5} strokeCap="round" />
      <Path path={stemPath} color={colors.trunk} style="stroke" strokeWidth={4} strokeCap="round" />
      <Path path={lowerLeftLeaf} color={colors.bodyMid} style="fill" />
      <Path path={lowerRightLeaf} color={colors.bodyMid} style="fill" />
      <Line p1={vec(x, y - 26)} p2={vec(x - 16, y - 33)} color={colors.bodyDark} strokeWidth={0.7} />
      <Line p1={vec(x, y - 26)} p2={vec(x + 16, y - 33)} color={colors.bodyDark} strokeWidth={0.7} />
      <Path path={midLeftLeaf} color={colors.bodyLight} style="fill" />
      <Path path={midRightLeaf} color={colors.bodyLight} style="fill" />
      <Line p1={vec(x, y - 42)} p2={vec(x - 13, y - 50)} color={colors.bodyMid} strokeWidth={0.7} />
      <Line p1={vec(x, y - 42)} p2={vec(x + 13, y - 50)} color={colors.bodyMid} strokeWidth={0.7} />
      <Path path={upperLeftLeaf} color={colors.sprout} style="fill" />
      <Path path={upperRightLeaf} color={colors.sprout} style="fill" />

      <Circle cx={x} cy={petalN_cy} r={pr} color={flowerColor} />
      <Circle cx={x} cy={petalS_cy} r={pr} color={flowerColor} />
      <Circle cx={petalE_cx} cy={flowerCy} r={pr} color={flowerColor} />
      <Circle cx={petalW_cx} cy={flowerCy} r={pr} color={flowerColor} />
      <Circle cx={petalNE_cx} cy={petalNE_cy} r={prSmall} color={flowerColor} opacity={0.85} />
      <Circle cx={petalNW_cx} cy={petalNW_cy} r={prSmall} color={flowerColor} opacity={0.85} />
      <Circle cx={petalSE_cx} cy={petalSE_cy} r={prSmall} color={flowerColor} opacity={0.85} />
      <Circle cx={petalSW_cx} cy={petalSW_cy} r={prSmall} color={flowerColor} opacity={0.85} />

      <Circle cx={x} cy={flowerCy} r={centerR} color={colors.bloom} />
      <Circle cx={x - 1} cy={flowerCy - 1} r={highlightR} color={colors.bodyLight} opacity={0.5} />
      <Circle cx={x} cy={y - 2} r={3} color={flowerColor} opacity={0.7} />
    </>
  )
}

export default Bloomed