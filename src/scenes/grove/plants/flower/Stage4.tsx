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
import { StageProps } from '../plantTypes'

const PETAL_R = 11
const PETAL_SPREAD = PETAL_R + 4
const DIAG = 0.7

// Flower — Stage 4: Fully bloomed, glowing. Bloom animation on mount.
const Stage4 = ({ x, y, colors, accentColor }: StageProps) => {
  const stemHeight = 72
  const flowerCy = y - stemHeight - 8
  const flowerColor = accentColor ?? colors.bloom

  const bloom = useSharedValue(0)
  useEffect(() => {
    bloom.value = withSequence(
      withTiming(0, { duration: 0 }),
      withDelay(200, withTiming(1, { duration: 1800, easing: Easing.out(Easing.back(1.2)) }))
    )
  }, [])

  const pr = useDerivedValue(() => bloom.value * PETAL_R)
  const prSmall = useDerivedValue(() => bloom.value * PETAL_R * 0.85)
  const centerR = useDerivedValue(() => bloom.value * 8)
  const highlightR = useDerivedValue(() => bloom.value * 3.5)

  const petalN_cy  = useDerivedValue(() => flowerCy - bloom.value * PETAL_SPREAD)
  const petalS_cy  = useDerivedValue(() => flowerCy + bloom.value * PETAL_SPREAD)
  const petalE_cx  = useDerivedValue(() => x + bloom.value * PETAL_SPREAD)
  const petalW_cx  = useDerivedValue(() => x - bloom.value * PETAL_SPREAD)
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

  // Lush lower leaves — wider and more generous
  const lowerLeftLeaf = Skia.Path.Make()
  lowerLeftLeaf.moveTo(x, y - 26)
  lowerLeftLeaf.cubicTo(x - 14, y - 29, x - 28, y - 41, x - 22, y - 28)
  lowerLeftLeaf.cubicTo(x - 15, y - 20, x, y - 26, x, y - 26)

  const lowerRightLeaf = Skia.Path.Make()
  lowerRightLeaf.moveTo(x, y - 26)
  lowerRightLeaf.cubicTo(x + 14, y - 29, x + 28, y - 41, x + 22, y - 28)
  lowerRightLeaf.cubicTo(x + 15, y - 20, x, y - 26, x, y - 26)

  const midLeftLeaf = Skia.Path.Make()
  midLeftLeaf.moveTo(x, y - 42)
  midLeftLeaf.cubicTo(x - 13, y - 46, x - 24, y - 58, x - 18, y - 46)
  midLeftLeaf.cubicTo(x - 11, y - 39, x, y - 42, x, y - 42)

  const midRightLeaf = Skia.Path.Make()
  midRightLeaf.moveTo(x, y - 42)
  midRightLeaf.cubicTo(x + 13, y - 46, x + 24, y - 58, x + 18, y - 46)
  midRightLeaf.cubicTo(x + 11, y - 39, x, y - 42, x, y - 42)

  const upperLeftLeaf = Skia.Path.Make()
  upperLeftLeaf.moveTo(x, y - 56)
  upperLeftLeaf.cubicTo(x - 10, y - 60, x - 18, y - 67, x - 13, y - 59)
  upperLeftLeaf.cubicTo(x - 7, y - 53, x, y - 56, x, y - 56)

  const upperRightLeaf = Skia.Path.Make()
  upperRightLeaf.moveTo(x, y - 56)
  upperRightLeaf.cubicTo(x + 10, y - 60, x + 18, y - 67, x + 13, y - 59)
  upperRightLeaf.cubicTo(x + 7, y - 53, x, y - 56, x, y - 56)

  // Filled mound
  const moundPath = Skia.Path.Make()
  moundPath.moveTo(x - 19, y)
  moundPath.quadTo(x - 8, y - 11, x, y - 12)
  moundPath.quadTo(x + 8, y - 11, x + 19, y)
  moundPath.close()

  return (
    <>
      {/* Soil mound */}
      <Path path={moundPath} color={colors.bodyDark} style="fill" opacity={0.9} />
      {/* Stem */}
      <Path path={stemPath} color={colors.trunk} style="stroke" strokeWidth={4} strokeCap="round" />

      {/* Leaves — lush */}
      <Path path={lowerLeftLeaf} color={colors.bodyMid} style="fill" />
      <Path path={lowerRightLeaf} color={colors.bodyMid} style="fill" />
      <Line p1={vec(x, y - 26)} p2={vec(x - 18, y - 35)} color={colors.bodyDark} strokeWidth={0.7} opacity={0.3} />
      <Line p1={vec(x, y - 26)} p2={vec(x + 18, y - 35)} color={colors.bodyDark} strokeWidth={0.7} opacity={0.3} />
      <Path path={midLeftLeaf} color={colors.bodyLight} style="fill" />
      <Path path={midRightLeaf} color={colors.bodyLight} style="fill" />
      <Line p1={vec(x, y - 42)} p2={vec(x - 15, y - 51)} color={colors.bodyMid} strokeWidth={0.7} opacity={0.3} />
      <Line p1={vec(x, y - 42)} p2={vec(x + 15, y - 51)} color={colors.bodyMid} strokeWidth={0.7} opacity={0.3} />
      <Path path={upperLeftLeaf} color={colors.sprout} style="fill" />
      <Path path={upperRightLeaf} color={colors.sprout} style="fill" />

      {/* Glow ring behind flower */}
      <Circle cx={x} cy={flowerCy} r={28} color={flowerColor} opacity={0.08} />
      <Circle cx={x} cy={flowerCy} r={20} color={flowerColor} opacity={0.12} />

      {/* Petals */}
      <Circle cx={x} cy={petalN_cy} r={pr} color={flowerColor} />
      <Circle cx={x} cy={petalS_cy} r={pr} color={flowerColor} />
      <Circle cx={petalE_cx} cy={flowerCy} r={pr} color={flowerColor} />
      <Circle cx={petalW_cx} cy={flowerCy} r={pr} color={flowerColor} />
      <Circle cx={petalNE_cx} cy={petalNE_cy} r={prSmall} color={flowerColor} opacity={0.85} />
      <Circle cx={petalNW_cx} cy={petalNW_cy} r={prSmall} color={flowerColor} opacity={0.85} />
      <Circle cx={petalSE_cx} cy={petalSE_cy} r={prSmall} color={flowerColor} opacity={0.85} />
      <Circle cx={petalSW_cx} cy={petalSW_cy} r={prSmall} color={flowerColor} opacity={0.85} />

      {/* Petal inner highlights — subtle shimmer on each petal */}
      <Circle cx={x} cy={petalN_cy} r={3} color={colors.bodyLight} opacity={0.25} />
      <Circle cx={x} cy={petalS_cy} r={3} color={colors.bodyLight} opacity={0.25} />
      <Circle cx={petalE_cx} cy={flowerCy} r={3} color={colors.bodyLight} opacity={0.25} />
      <Circle cx={petalW_cx} cy={flowerCy} r={3} color={colors.bodyLight} opacity={0.25} />
      <Circle cx={petalNE_cx} cy={petalNE_cy} r={2.5} color={colors.bodyLight} opacity={0.25} />
      <Circle cx={petalNW_cx} cy={petalNW_cy} r={2.5} color={colors.bodyLight} opacity={0.25} />
      <Circle cx={petalSE_cx} cy={petalSE_cy} r={2.5} color={colors.bodyLight} opacity={0.25} />
      <Circle cx={petalSW_cx} cy={petalSW_cy} r={2.5} color={colors.bodyLight} opacity={0.25} />

      {/* Center */}
      <Circle cx={x} cy={flowerCy} r={centerR} color={colors.bloom} />
      <Circle cx={x - 1} cy={flowerCy - 1} r={highlightR} color={colors.bodyLight} opacity={0.5} />

      {/* Stamen dots — tiny ring around center */}
      <Circle cx={x} cy={flowerCy - 5} r={1.5} color={colors.bloom} opacity={0.7} />
      <Circle cx={x + 4} cy={flowerCy - 2} r={1.5} color={colors.bloom} opacity={0.7} />
      <Circle cx={x + 3} cy={flowerCy + 4} r={1.5} color={colors.bloom} opacity={0.7} />
      <Circle cx={x - 4} cy={flowerCy + 2} r={1.5} color={colors.bloom} opacity={0.7} />

      {/* Fallen petal accent at base */}
      <Circle cx={x} cy={y - 2} r={3} color={flowerColor} opacity={0.7} />
    </>
  )
}

export default Stage4
