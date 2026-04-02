import React from 'react'
import { Circle, Line, Path, Skia, vec } from '@shopify/react-native-skia'
import { StageProps } from '../plantTypes'

// Flower — Stage 2: First leaves, curious.
const Stage2 = ({ x, y, colors }: StageProps) => {
  const stemHeight = 48

  // Gentle S-curve stem
  const stemPath = Skia.Path.Make()
  stemPath.moveTo(x, y)
  stemPath.cubicTo(x + 5, y - 16, x - 4, y - 32, x, y - stemHeight)

  // Left leaf — plump and wide, rounded tip
  const leftLeaf = Skia.Path.Make()
  leftLeaf.moveTo(x, y - 26)
  leftLeaf.quadTo(x - 22, y - 40, x - 17, y - 28)
  leftLeaf.quadTo(x - 10, y - 19, x, y - 26)

  // Right leaf — mirror, slightly higher for asymmetry
  const rightLeaf = Skia.Path.Make()
  rightLeaf.moveTo(x, y - 28)
  rightLeaf.quadTo(x + 20, y - 42, x + 16, y - 30)
  rightLeaf.quadTo(x + 10, y - 21, x, y - 28)

  // Upper small leaf — sprout color
  const upperLeaf = Skia.Path.Make()
  upperLeaf.moveTo(x, y - 40)
  upperLeaf.quadTo(x - 12, y - 48, x - 9, y - 40)
  upperLeaf.quadTo(x - 5, y - 35, x, y - 40)

  // Filled mound
  const moundPath = Skia.Path.Make()
  moundPath.moveTo(x - 15, y)
  moundPath.quadTo(x - 7, y - 9, x, y - 10)
  moundPath.quadTo(x + 7, y - 9, x + 15, y)
  moundPath.close()

  // Teardrop bud — defined, two-tone (darker base, lighter tip)
  const budBase = y - stemHeight
  const budOuter = Skia.Path.Make()
  budOuter.moveTo(x, budBase)
  budOuter.cubicTo(x + 6, budBase - 2, x + 7, budBase - 11, x, budBase - 14)
  budOuter.cubicTo(x - 7, budBase - 11, x - 5, budBase - 2, x, budBase)

  const budTip = Skia.Path.Make()
  budTip.moveTo(x, budBase - 5)
  budTip.cubicTo(x + 3, budBase - 7, x + 3, budBase - 12, x, budBase - 14)
  budTip.cubicTo(x - 3, budBase - 12, x - 3, budBase - 7, x, budBase - 5)

  return (
    <>
      {/* Soil mound */}
      <Path path={moundPath} color={colors.bodyDark} style="fill" opacity={0.85} />
      {/* Stem */}
      <Path path={stemPath} color={colors.trunk} style="stroke" strokeWidth={3} strokeCap="round" />

      {/* Lower leaves — plump */}
      <Path path={leftLeaf} color={colors.bodyLight} style="fill" />
      <Path path={rightLeaf} color={colors.bodyLight} style="fill" />

      {/* Leaf veins — subtle */}
      <Line p1={vec(x, y - 26)} p2={vec(x - 14, y - 34)} color={colors.bodyDark} strokeWidth={0.8} opacity={0.3} />
      <Line p1={vec(x, y - 28)} p2={vec(x + 13, y - 35)} color={colors.bodyDark} strokeWidth={0.8} opacity={0.3} />

      {/* Dewdrop on right leaf — tiny touch of cute */}
      <Circle cx={x + 10} cy={y - 32} r={2} color="#FFFFFF" opacity={0.3} />

      {/* Upper leaf */}
      <Path path={upperLeaf} color={colors.sprout} style="fill" />

      {/* Teardrop bud — two-tone */}
      <Path path={budOuter} color={colors.bodyMid} style="fill" />
      <Path path={budTip} color={colors.sprout} style="fill" />

      {/* Bud highlight */}
      <Circle cx={x} cy={budBase - 11} r={1.5} color="#FFFFFF" opacity={0.5} />
    </>
  )
}

export default Stage2
